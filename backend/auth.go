package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const (
	authSessionDays = 30
	bcryptCost      = 12
)

type authUser struct {
	ID                   int64
	Email                string
	Role                 string
	MustChangePassword   bool
}

func initAuthStore() {
	if sessionDB == nil {
		return
	}
	if _, err := sessionDB.Exec(`CREATE TABLE IF NOT EXISTS users (
		id                   INTEGER PRIMARY KEY AUTOINCREMENT,
		email                TEXT NOT NULL UNIQUE COLLATE NOCASE,
		password_hash        TEXT NOT NULL,
		role                 TEXT NOT NULL DEFAULT 'user',
		must_change_password INTEGER NOT NULL DEFAULT 0,
		created_at           INTEGER NOT NULL,
		updated_at           INTEGER NOT NULL
	)`); err != nil {
		log.Printf("[AUTH] create users table failed: %v", err)
		return
	}
	if _, err := sessionDB.Exec(`CREATE TABLE IF NOT EXISTS auth_sessions (
		token      TEXT PRIMARY KEY,
		user_id    INTEGER NOT NULL,
		expires_at INTEGER NOT NULL,
		created_at INTEGER NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)`); err != nil {
		log.Printf("[AUTH] create auth_sessions table failed: %v", err)
		return
	}
	if _, err := sessionDB.Exec(`CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions (user_id)`); err != nil {
		log.Printf("[AUTH] create session index failed: %v", err)
	}
	bootstrapAdminUser()
}

func bootstrapAdminUser() {
	email := strings.TrimSpace(strings.ToLower(os.Getenv("ADMIN_EMAIL")))
	password := os.Getenv("ADMIN_TEMP_PASSWORD")
	if email == "" || password == "" {
		return
	}
	var existingID int64
	err := sessionDB.QueryRow(`SELECT id FROM users WHERE email = ?`, email).Scan(&existingID)
	if err == nil {
		return
	}
	if err != sql.ErrNoRows {
		log.Printf("[AUTH] bootstrap admin lookup failed: %v", err)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		log.Printf("[AUTH] bootstrap admin hash failed: %v", err)
		return
	}
	now := time.Now().Unix()
	_, err = sessionDB.Exec(
		`INSERT INTO users (email, password_hash, role, must_change_password, created_at, updated_at)
		 VALUES (?, ?, 'admin', 1, ?, ?)`,
		email, string(hash), now, now,
	)
	if err != nil {
		log.Printf("[AUTH] bootstrap admin insert failed: %v", err)
		return
	}
	log.Printf("[AUTH] created bootstrap admin user %s (must change password on first login)", email)
}

func adminAccessConfigured() bool {
	if adminTokenConfigured() {
		return true
	}
	if sessionDB == nil {
		return false
	}
	var n int
	if err := sessionDB.QueryRow(`SELECT COUNT(*) FROM users WHERE role = 'admin'`).Scan(&n); err != nil {
		return false
	}
	return n > 0
}

func bearerTokenFromRequest(r *http.Request) string {
	auth := strings.TrimSpace(r.Header.Get("Authorization"))
	if auth == "" {
		return ""
	}
	const prefix = "Bearer "
	if !strings.HasPrefix(auth, prefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(auth, prefix))
}

func userFromRequest(r *http.Request) (authUser, bool) {
	token := bearerTokenFromRequest(r)
	if token == "" {
		return authUser{}, false
	}
	return userFromSessionToken(token)
}

func userFromSessionToken(token string) (authUser, bool) {
	if sessionDB == nil || token == "" {
		return authUser{}, false
	}
	var userID int64
	var expiresAt int64
	err := sessionDB.QueryRow(
		`SELECT user_id, expires_at FROM auth_sessions WHERE token = ?`, token,
	).Scan(&userID, &expiresAt)
	if err != nil {
		return authUser{}, false
	}
	if time.Now().Unix() > expiresAt {
		_, _ = sessionDB.Exec(`DELETE FROM auth_sessions WHERE token = ?`, token)
		return authUser{}, false
	}
	var u authUser
	var mustChange int
	err = sessionDB.QueryRow(
		`SELECT id, email, role, must_change_password FROM users WHERE id = ?`, userID,
	).Scan(&u.ID, &u.Email, &u.Role, &mustChange)
	if err != nil {
		return authUser{}, false
	}
	u.MustChangePassword = mustChange != 0
	return u, true
}

func isAdminRequest(r *http.Request) bool {
	if u, ok := userFromRequest(r); ok && u.Role == "admin" {
		return true
	}
	expected := strings.TrimSpace(os.Getenv("ADMIN_TOKEN"))
	if expected == "" {
		return false
	}
	got := adminTokenFromHeader(r)
	return got != "" && got == expected
}

func newSessionToken() (string, error) {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func createAuthSession(userID int64) (string, error) {
	token, err := newSessionToken()
	if err != nil {
		return "", err
	}
	now := time.Now()
	expires := now.Add(authSessionDays * 24 * time.Hour).Unix()
	_, err = sessionDB.Exec(
		`INSERT INTO auth_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`,
		token, userID, expires, now.Unix(),
	)
	if err != nil {
		return "", err
	}
	return token, nil
}

func authUserJSON(u authUser) map[string]any {
	role := u.Role
	if role == "" {
		role = "guest"
	}
	return map[string]any{
		"email":              u.Email,
		"role":               role,
		"mustChangePassword": u.MustChangePassword,
	}
}

func handleAuthLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	if sessionDB == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "authentication is not available"})
		return
	}
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	email := strings.TrimSpace(strings.ToLower(body.Email))
	password := body.Password
	if email == "" || password == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "email and password are required"})
		return
	}
	var u authUser
	var hash string
	var mustChange int
	err := sessionDB.QueryRow(
		`SELECT id, email, role, must_change_password, password_hash FROM users WHERE email = ?`, email,
	).Scan(&u.ID, &u.Email, &u.Role, &mustChange, &hash)
	if err == sql.ErrNoRows {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "login failed"})
		return
	}
	u.MustChangePassword = mustChange != 0
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
		return
	}
	token, err := createAuthSession(u.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create session"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"token": token,
		"user":  authUserJSON(u),
	})
}

func handleAuthLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	token := bearerTokenFromRequest(r)
	if token != "" && sessionDB != nil {
		_, _ = sessionDB.Exec(`DELETE FROM auth_sessions WHERE token = ?`, token)
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func handleAuthMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	u, ok := userFromRequest(r)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}
	writeJSON(w, http.StatusOK, authUserJSON(u))
}

func handleAuthChangePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	u, ok := userFromRequest(r)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}
	var body struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	newPassword := strings.TrimSpace(body.NewPassword)
	if len(newPassword) < 8 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "new password must be at least 8 characters"})
		return
	}
	var hash string
	if err := sessionDB.QueryRow(`SELECT password_hash FROM users WHERE id = ?`, u.ID).Scan(&hash); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not verify password"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(body.CurrentPassword)); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "current password is incorrect"})
		return
	}
	nextHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcryptCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not update password"})
		return
	}
	now := time.Now().Unix()
	_, err = sessionDB.Exec(
		`UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = ? WHERE id = ?`,
		string(nextHash), now, u.ID,
	)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not update password"})
		return
	}
	u.MustChangePassword = false
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "user": authUserJSON(u)})
}
