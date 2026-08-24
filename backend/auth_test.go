package main

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func randomTestPassword(t *testing.T) string {
	t.Helper()
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		t.Fatal(err)
	}
	return hex.EncodeToString(buf)
}

func initTestAuthDB(t *testing.T) string {
	t.Helper()
	bootstrapPassword := randomTestPassword(t)
	t.Setenv("SESSION_DB_PATH", t.TempDir()+"/auth_test.db")
	t.Setenv("ADMIN_EMAIL", "admin-test@fly-fix.test")
	t.Setenv("ADMIN_TEMP_PASSWORD", bootstrapPassword)
	initSessionStore()
	initAuthStore()
	return bootstrapPassword
}

func TestBootstrapAdminUser(t *testing.T) {
	initTestAuthDB(t)
	var n int
	if err := sessionDB.QueryRow(`SELECT COUNT(*) FROM users WHERE email = ?`, "admin-test@fly-fix.test").Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Fatalf("expected 1 admin user, got %d", n)
	}
}

func TestAuthLoginAndChangePassword(t *testing.T) {
	bootstrapPassword := initTestAuthDB(t)
	newPassword := randomTestPassword(t)

	loginBody, err := json.Marshal(map[string]string{
		"email":    "admin-test@fly-fix.test",
		"password": bootstrapPassword,
	})
	if err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(loginBody))
	rec := httptest.NewRecorder()
	handleAuthLogin(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("login status %d body %s", rec.Code, rec.Body.String())
	}
	var loginResp struct {
		Token string `json:"token"`
		User  struct {
			Role               string `json:"role"`
			MustChangePassword bool   `json:"mustChangePassword"`
		} `json:"user"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &loginResp); err != nil {
		t.Fatal(err)
	}
	if loginResp.Token == "" || loginResp.User.Role != "admin" || !loginResp.User.MustChangePassword {
		t.Fatalf("unexpected login response: %+v", loginResp)
	}

	meReq := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	meReq.Header.Set("Authorization", "Bearer "+loginResp.Token)
	meRec := httptest.NewRecorder()
	handleAuthMe(meRec, meReq)
	if meRec.Code != http.StatusOK {
		t.Fatalf("me status %d", meRec.Code)
	}

	changeBody, err := json.Marshal(map[string]string{
		"currentPassword": bootstrapPassword,
		"newPassword":     newPassword,
	})
	if err != nil {
		t.Fatal(err)
	}
	changeReq := httptest.NewRequest(http.MethodPost, "/api/auth/change-password", bytes.NewReader(changeBody))
	changeReq.Header.Set("Authorization", "Bearer "+loginResp.Token)
	changeRec := httptest.NewRecorder()
	handleAuthChangePassword(changeRec, changeReq)
	if changeRec.Code != http.StatusOK {
		t.Fatalf("change password status %d body %s", changeRec.Code, changeRec.Body.String())
	}

	adminReq := httptest.NewRequest(http.MethodGet, "/api/admin/runtime-config", nil)
	adminReq.Header.Set("Authorization", "Bearer "+loginResp.Token)
	adminRec := httptest.NewRecorder()
	handleAdminRuntimeConfig(adminRec, adminReq)
	if adminRec.Code != http.StatusOK {
		t.Fatalf("admin runtime config status %d body %s", adminRec.Code, adminRec.Body.String())
	}
}
