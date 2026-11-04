# Nginx Proxy Manager — fly-fix TLS checklist

Live edge for `fly-fix.com` / `www.fly-fix.com` / `api.fly-fix.com` is
**Nginx Proxy Manager** (`nginx-proxy-manager` Docker container) on the VPS.

## Symptoms Chrome shows

- **“Connection is not secure”** on `http://fly-fix.com` when Force SSL is off
  (HTTP 200 instead of 301 to HTTPS).
- Certificate / name mismatch on `https://www.fly-fix.com` when the LE cert
  SAN is only `DNS:fly-fix.com` (apex works; www fails verify).
- Frontend on HTTP then calls `https://api.fly-fix.com` → CORS blocks the
  `Origin: http://fly-fix.com` request → “Could not reach the flight API”.

## Required proxy-host settings

| Host | Domains | Force SSL | Certificate SANs |
|------|---------|-----------|------------------|
| Frontend | `fly-fix.com`, `www.fly-fix.com` | on | both names |
| API | `api.fly-fix.com` | on | `api.fly-fix.com` |

## Reissue frontend cert (both names)

```bash
docker exec nginx-proxy-manager /opt/certbot/bin/certbot certonly \
  --config /etc/letsencrypt.ini \
  --work-dir /tmp/letsencrypt-lib \
  --logs-dir /data/logs \
  --cert-name npm-7 \
  --force-renewal \
  --webroot \
  --webroot-path /data/letsencrypt-acme-challenge \
  --preferred-challenges http \
  -d fly-fix.com \
  -d www.fly-fix.com \
  --agree-tos \
  --email <admin-email>
```

Ensure each proxy host conf includes:

```nginx
include conf.d/include/force-ssl.conf;
```

Then `nginx -t` and `nginx -s reload` inside the NPM container.

Also set `ssl_forced=1` on the matching rows in NPM’s `proxy_host` table so the
UI does not regenerate configs without Force SSL.
