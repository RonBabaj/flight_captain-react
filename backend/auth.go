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
	password := strings.TrimSpace(os.Getenv("ADMIN_TEMP_PASSWORD"))
	if email == "" || password == "" {
		return
	}
	syncFromEnv := envFlagTrue("ADMIN_SYNC_BOOTSTRAP_PASSWORD")

	var existingID int64
	err := sessionDB.QueryRow(`SELECT id FROM users WHERE email = ?`, email).Scan(&existingID)
	if err == nil {
		if !syncFromEnv {
			log.Printf("[AUTH] admin user %s already exists (set ADMIN_SYNC_BOOTSTRAP_PASSWORD=1 to reset password from env)", email)
			return
		}
		if err := setAdminPassword(existingID, password, true); err != nil {
			log.Printf("[AUTH] bootstrap admin password sync failed: %v", err)
			return
		}
		log.Printf("[AUTH] synced bootstrap admin password for %s from env", email)
		return
	}
	if err != sql.ErrNoRows {
		log.Printf("[AUTH] bootstrap admin lookup failed: %v", err)
		return
	}
	if err := insertAdminUser(email, password); err != nil {
		log.Printf("[AUTH] bootstrap admin insert failed: %v", err)
		return
	}
	log.Printf("[AUTH] created bootstrap admin user %s (must change password on first login)", email)
}

func envFlagTrue(name string) bool {
	v := strings.TrimSpace(strings.ToLower(os.Getenv(name)))
	return v == "1" || v == "true" || v == "yes"
}

func insertAdminUser(email, password string) error {
	return insertUser(email, password, "admin", true)
}

func insertUser(email, password, role string, mustChange bool) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return err
	}
	mustChangeInt := 0
	if mustChange {
		mustChangeInt = 1
	}
	now := time.Now().Unix()
	_, err = sessionDB.Exec(
		`INSERT INTO users (email, password_hash, role, must_change_password, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		email, string(hash), role, mustChangeInt, now, now,
	)
	return err
}

func setAdminPassword(userID int64, password string, mustChange bool) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return err
	}
	mustChangeInt := 0
	if mustChange {
		mustChangeInt = 1
	}
	now := time.Now().Unix()
	_, err = sessionDB.Exec(
		`UPDATE users SET password_hash = ?, must_change_password = ?, updated_at = ? WHERE id = ?`,
		string(hash), mustChangeInt, now, userID,
	)
	return err
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
		"id":                 u.ID,
		"email":              u.Email,
		"role":               role,
		"mustChangePassword": u.MustChangePassword,
	}
}

func validUserRole(role string) bool {
	return role == "user" || role == "admin"
}

func requireAdminUser(w http.ResponseWriter, r *http.Request) (authUser, bool) {
	u, ok := userFromRequest(r)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return authUser{}, false
	}
	if u.Role != "admin" {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": "admin access required"})
		return authUser{}, false
	}
	return u, true
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

func publicRegistrationEnabled() bool {
	v := strings.TrimSpace(strings.ToLower(os.Getenv("ALLOW_PUBLIC_REGISTRATION")))
	if v == "0" || v == "false" || v == "no" {
		return false
	}
	return true
}

func handleAuthRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	if sessionDB == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "authentication is not available"})
		return
	}
	if !publicRegistrationEnabled() {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": "registration is disabled"})
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
	password := strings.TrimSpace(body.Password)
	if email == "" || password == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "email and password are required"})
		return
	}
	if len(password) < 8 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password must be at least 8 characters"})
		return
	}
	var existingID int64
	err := sessionDB.QueryRow(`SELECT id FROM users WHERE email = ?`, email).Scan(&existingID)
	if err == nil {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "email already registered"})
		return
	}
	if err != sql.ErrNoRows {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "registration failed"})
		return
	}
	if err := insertUser(email, password, "user", false); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "registration failed"})
		return
	}
	var u authUser
	var mustChange int
	err = sessionDB.QueryRow(
		`SELECT id, email, role, must_change_password FROM users WHERE email = ?`, email,
	).Scan(&u.ID, &u.Email, &u.Role, &mustChange)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "registration failed"})
		return
	}
	u.MustChangePassword = mustChange != 0
	token, err := createAuthSession(u.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create session"})
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{
		"token": token,
		"user":  authUserJSON(u),
	})
}

func handleAuthUsers(w http.ResponseWriter, r *http.Request) {
	if sessionDB == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "authentication is not available"})
		return
	}
	admin, ok := requireAdminUser(w, r)
	if !ok {
		return
	}
	switch r.Method {
	case http.MethodGet:
		rows, err := sessionDB.Query(
			`SELECT id, email, role, must_change_password FROM users ORDER BY email COLLATE NOCASE`,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not list users"})
			return
		}
		defer rows.Close()
		users := make([]map[string]any, 0)
		for rows.Next() {
			var u authUser
			var mustChange int
			if err := rows.Scan(&u.ID, &u.Email, &u.Role, &mustChange); err != nil {
				writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not list users"})
				return
			}
			u.MustChangePassword = mustChange != 0
			users = append(users, authUserJSON(u))
		}
		writeJSON(w, http.StatusOK, map[string]any{"users": users})
	case http.MethodPost:
		var body struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Role     string `json:"role"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}
		email := strings.TrimSpace(strings.ToLower(body.Email))
		password := strings.TrimSpace(body.Password)
		role := strings.TrimSpace(strings.ToLower(body.Role))
		if role == "" {
			role = "user"
		}
		if email == "" || password == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "email and password are required"})
			return
		}
		if len(password) < 8 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password must be at least 8 characters"})
			return
		}
		if !validUserRole(role) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid role"})
			return
		}
		var existingID int64
		err := sessionDB.QueryRow(`SELECT id FROM users WHERE email = ?`, email).Scan(&existingID)
		if err == nil {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "email already registered"})
			return
		}
		if err != sql.ErrNoRows {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create user"})
			return
		}
		mustChange := role == "admin"
		if err := insertUser(email, password, role, mustChange); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create user"})
			return
		}
		var u authUser
		var mustChangeInt int
		err = sessionDB.QueryRow(
			`SELECT id, email, role, must_change_password FROM users WHERE email = ?`, email,
		).Scan(&u.ID, &u.Email, &u.Role, &mustChangeInt)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create user"})
			return
		}
		u.MustChangePassword = mustChangeInt != 0
		writeJSON(w, http.StatusCreated, map[string]any{"user": authUserJSON(u)})
	case http.MethodPatch:
		var body struct {
			ID       int64  `json:"id"`
			Role     string `json:"role"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}
		if body.ID <= 0 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "user id is required"})
			return
		}
		if body.Role != "" {
			role := strings.TrimSpace(strings.ToLower(body.Role))
			if !validUserRole(role) {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid role"})
				return
			}
			now := time.Now().Unix()
			res, err := sessionDB.Exec(`UPDATE users SET role = ?, updated_at = ? WHERE id = ?`, role, now, body.ID)
			if err != nil {
				writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not update user"})
				return
			}
			n, _ := res.RowsAffected()
			if n == 0 {
				writeJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
				return
			}
		}
		if strings.TrimSpace(body.Password) != "" {
			password := strings.TrimSpace(body.Password)
			if len(password) < 8 {
				writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password must be at least 8 characters"})
				return
			}
			if err := setAdminPassword(body.ID, password, body.Role == "admin"); err != nil {
				writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not update password"})
				return
			}
		}
		var u authUser
		var mustChange int
		err := sessionDB.QueryRow(
			`SELECT id, email, role, must_change_password FROM users WHERE id = ?`, body.ID,
		).Scan(&u.ID, &u.Email, &u.Role, &mustChange)
		if err == sql.ErrNoRows {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not load user"})
			return
		}
		u.MustChangePassword = mustChange != 0
		writeJSON(w, http.StatusOK, map[string]any{"user": authUserJSON(u)})
	case http.MethodDelete:
		var body struct {
			ID int64 `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}
		if body.ID <= 0 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "user id is required"})
			return
		}
		if body.ID == admin.ID {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "cannot delete your own account"})
			return
		}
		res, err := sessionDB.Exec(`DELETE FROM users WHERE id = ?`, body.ID)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete user"})
			return
		}
		n, _ := res.RowsAffected()
		if n == 0 {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}
