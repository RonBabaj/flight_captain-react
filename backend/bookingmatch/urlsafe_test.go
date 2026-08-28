package bookingmatch

import "testing"

func TestValidateBookingURL_acceptsHTTPS(t *testing.T) {
	if err := ValidateBookingURL("https://trip.com/book/flight"); err != nil {
		t.Fatal(err)
	}
}

func TestValidateBookingURL_rejectsJavascript(t *testing.T) {
	if err := ValidateBookingURL("javascript:alert(1)"); err == nil {
		t.Fatal("expected rejection")
	}
}

func TestValidateBookingURL_rejectsLocalhost(t *testing.T) {
	if err := ValidateBookingURL("http://localhost/book"); err == nil {
		t.Fatal("expected rejection")
	}
}

func TestValidateBookingURL_rejectsPrivateIP(t *testing.T) {
	if err := ValidateBookingURL("https://192.168.1.1/book"); err == nil {
		t.Fatal("expected rejection")
	}
}

func TestValidateBookingURL_rejectsEmpty(t *testing.T) {
	if err := ValidateBookingURL(""); err == nil {
		t.Fatal("expected rejection")
	}
}
