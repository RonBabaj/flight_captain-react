package main

import (
	"crypto/rand"
	"encoding/hex"
	"strconv"
	"strings"
	"sync"
	"time"
)

const exploreSessionTTL = 25 * time.Minute

type exploreSession struct {
	mu sync.Mutex

	CreatedAt time.Time
	Key       string

	// Rows is the full sorted list for this explore (pool size); pagination slices into it.
	Rows []exploreDestRow

	// LiveQueue lists destination codes still eligible for a live GF2 refresh (estimated or stale cache).
	LiveQueue         []string
	LiveQueueCursor   int
	LiveFetchAttempts int  // GF2 calls completed this session (hard-capped)
	LiveInFlight      bool // true while a live batch is running (blocks concurrent live)

	Origin string
	Dep    string
	Ret    string

	UseMonth     bool
	Year, Month  int
	DurationDays int
	Currency     string
	Adults       int
	Children     int
	NonStop      bool
	CabinPref    string
	IncludeBag   bool
}

var (
	exploreSessionsMu sync.Mutex
	exploreSessions   = make(map[string]*exploreSession)
)

func newExploreSessionID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return "exp_" + hex.EncodeToString(b)
}

func putExploreSession(id string, s *exploreSession) {
	exploreSessionsMu.Lock()
	defer exploreSessionsMu.Unlock()
	s.CreatedAt = time.Now()
	exploreSessions[id] = s
}

func getExploreSession(id string) *exploreSession {
	exploreSessionsMu.Lock()
	defer exploreSessionsMu.Unlock()
	s, ok := exploreSessions[id]
	if !ok {
		return nil
	}
	if time.Since(s.CreatedAt) > exploreSessionTTL {
		delete(exploreSessions, id)
		return nil
	}
	return s
}

func exploreSessionKey(origin, dep, ret string, useMonth bool, year, month, duration int, currency string, adults, children int, nonStop bool) string {
	ns := "0"
	if nonStop {
		ns = "1"
	}
	if useMonth {
		return strings.Join([]string{
			origin, "m", dep, ret,
			strconv.Itoa(year), strconv.Itoa(month), strconv.Itoa(duration),
			currency, strconv.Itoa(adults), strconv.Itoa(children), ns,
		}, "|")
	}
	return strings.Join([]string{
		origin, "d", dep, ret, currency, strconv.Itoa(adults), strconv.Itoa(children), ns,
	}, "|")
}

func startExploreSessionCleanup() {
	go func() {
		t := time.NewTicker(5 * time.Minute)
		defer t.Stop()
		for range t.C {
			exploreSessionsMu.Lock()
			now := time.Now()
			for id, s := range exploreSessions {
				if now.Sub(s.CreatedAt) > exploreSessionTTL {
					delete(exploreSessions, id)
				}
			}
			exploreSessionsMu.Unlock()
		}
	}()
}
