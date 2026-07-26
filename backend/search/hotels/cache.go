package hotels

import (
	"sync"
	"time"
)

// TTLCache is a simple in-process cache used for hotel searches and estimates.
type TTLCache struct {
	mu    sync.RWMutex
	items map[string]cacheEntry
	ttl   time.Duration
}

type cacheEntry struct {
	value   any
	expires time.Time
}

// NewTTLCache creates a cache with the given TTL. A background evictor runs every minute.
func NewTTLCache(ttl time.Duration) *TTLCache {
	if ttl <= 0 {
		ttl = 5 * time.Minute
	}
	c := &TTLCache{items: make(map[string]cacheEntry), ttl: ttl}
	go func() {
		ticker := time.NewTicker(time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			c.Evict()
		}
	}()
	return c
}

func (c *TTLCache) Get(key string) (any, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.items[key]
	if !ok || time.Now().After(e.expires) {
		return nil, false
	}
	return e.value, true
}

func (c *TTLCache) Set(key string, value any) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items[key] = cacheEntry{value: value, expires: time.Now().Add(c.ttl)}
}

func (c *TTLCache) Evict() {
	c.mu.Lock()
	defer c.mu.Unlock()
	now := time.Now()
	for k, e := range c.items {
		if now.After(e.expires) {
			delete(c.items, k)
		}
	}
}

// DeduplicateStayKeys returns unique keys preserving first-seen order.
func DeduplicateStayKeys(keys []string) []string {
	seen := make(map[string]struct{}, len(keys))
	out := make([]string, 0, len(keys))
	for _, k := range keys {
		if k == "" {
			continue
		}
		if _, ok := seen[k]; ok {
			continue
		}
		seen[k] = struct{}{}
		out = append(out, k)
	}
	return out
}

// EstimateCacheKey builds a stable cache key for hotel estimates/searches.
func EstimateCacheKey(destination, checkIn, checkOut, currency string, rooms, guests int, filters string) string {
	return destination + "|" + checkIn + "|" + checkOut + "|" + currency + "|r" +
		itoa(rooms) + "|g" + itoa(guests) + "|" + filters
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := n < 0
	if neg {
		n = -n
	}
	var b [16]byte
	i := len(b)
	for n > 0 {
		i--
		b[i] = byte('0' + n%10)
		n /= 10
	}
	if neg {
		i--
		b[i] = '-'
	}
	return string(b[i:])
}
