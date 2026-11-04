FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o flyfix-api .


FROM alpine:latest

# IANA zones required for AirportLocation / GF2 wall-clock parsing
# (without tzdata, LoadLocation fails and every airport falls back to UTC).
RUN apk add --no-cache tzdata ca-certificates

WORKDIR /app

COPY --from=builder /app/flyfix-api .

EXPOSE 8080

CMD ["./flyfix-api"]
