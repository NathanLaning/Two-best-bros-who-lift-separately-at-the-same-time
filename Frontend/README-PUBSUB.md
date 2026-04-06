# Frontend notes: Chat UI + Pub/Sub

This frontend connects to the local Go Pub/Sub server for development.

Run the frontend (Next.js):

```bash
# from Frontend/frontend
cd Frontend/frontend
npm install
npm run dev
```

Open `http://localhost:3000/coach` to view the chat UI. The chat UI uses:
- SSE subscribe: `http://localhost:8081/subscribe?topic=chat`
- Publish: `POST http://localhost:8081/publish` with JSON `{ "topic": "chat", "msg": { ... } }`.

If you run backend and frontend on different hosts/ports, adjust the URLs in `app/coach/page.tsx` accordingly or proxy requests through Next.js during development.
