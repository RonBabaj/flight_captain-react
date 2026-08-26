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

func TestBootstrapAdminPasswordSync(t *testing.T) {
	bootstrapPassword := initTestAuthDB(t)
	newPassword := randomTestPassword(t)
	t.Setenv("ADMIN_SYNC_BOOTSTRAP_PASSWORD", "1")
	t.Setenv("ADMIN_TEMP_PASSWORD", newPassword)
	initAuthStore()

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
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("old password should fail after sync, got status %d", rec.Code)
	}

	loginBody2, err := json.Marshal(map[string]string{
		"email":    "admin-test@fly-fix.test",
		"password": newPassword,
	})
	if err != nil {
		t.Fatal(err)
	}
	req2 := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(loginBody2))
	rec2 := httptest.NewRecorder()
	handleAuthLogin(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Fatalf("synced password login status %d body %s", rec2.Code, rec2.Body.String())
	}
}

func TestAuthRegister(t *testing.T) {
	initTestAuthDB(t)

	regBody, err := json.Marshal(map[string]string{
		"email":    "user-test@fly-fix.test",
		"password": randomTestPassword(t),
	})
	if err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(regBody))
	rec := httptest.NewRecorder()
	handleAuthRegister(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("register status %d body %s", rec.Code, rec.Body.String())
	}
}

func TestAuthUserManagement(t *testing.T) {
	bootstrapPassword := initTestAuthDB(t)

	loginBody, _ := json.Marshal(map[string]string{
		"email":    "admin-test@fly-fix.test",
		"password": bootstrapPassword,
	})
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(loginBody))
	rec := httptest.NewRecorder()
	handleAuthLogin(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("admin login failed: %d", rec.Code)
	}
	var loginResp struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &loginResp); err != nil {
		t.Fatal(err)
	}

	listReq := httptest.NewRequest(http.MethodGet, "/api/auth/users", nil)
	listReq.Header.Set("Authorization", "Bearer "+loginResp.Token)
	listRec := httptest.NewRecorder()
	handleAuthUsers(listRec, listReq)
	if listRec.Code != http.StatusOK {
		t.Fatalf("list users status %d body %s", listRec.Code, listRec.Body.String())
	}

	newUserPassword := randomTestPassword(t)
	createBody, _ := json.Marshal(map[string]string{
		"email":    "managed-user@fly-fix.test",
		"password": newUserPassword,
		"role":     "user",
	})
	createReq := httptest.NewRequest(http.MethodPost, "/api/auth/users", bytes.NewReader(createBody))
	createReq.Header.Set("Authorization", "Bearer "+loginResp.Token)
	createRec := httptest.NewRecorder()
	handleAuthUsers(createRec, createReq)
	if createRec.Code != http.StatusCreated {
		t.Fatalf("create user status %d body %s", createRec.Code, createRec.Body.String())
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
