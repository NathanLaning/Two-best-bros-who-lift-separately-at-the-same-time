# Pub/Sub backend (development)

This folder contains a minimal Go-based in-memory Pub/Sub server used for development and local testing.

Files of interest:
- `pubsub.go` — In-memory Pub/Sub implementation.
- `server.go` — Small HTTP server exposing a POST `/publish` endpoint and an SSE `/subscribe` endpoint.

Run locally (requires Go >= 1.18):

```bash
# from Backend/code
cd Backend/code
# build and run
go run server.go pubsub.go
```

The server listens on port `8081` by default.

HTTP API:
- `POST /publish` — publish a message. JSON body: `{ "topic": "chat", "msg": { ... } }`. Response: 202 Accepted.
- `GET /subscribe?topic=chat` — connect via Server-Sent Events (SSE). Each event data is a JSON-encoded message.

CORS: the server sets `Access-Control-Allow-Origin: *` for development convenience.

Notes:
- This is an in-memory pub/sub meant for local testing only. For production use, replace with a persistent message broker.
