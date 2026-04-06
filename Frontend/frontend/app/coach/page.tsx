"use client"

import { useEffect, useRef, useState } from "react"

export default function CoachPage() {
  const [messages, setMessages] = useState<Array<{id:number;text:string;from?:string}>>([])
  const [input, setInput] = useState("")
  const idRef = useRef(1)

  useEffect(() => {
    const es = new EventSource("http://localhost:8081/subscribe?topic=chat")
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        const id = idRef.current++
        setMessages((m) => [...m, { id, text: JSON.stringify(data), from: "server" }])
      } catch (err) {
        // keep raw text
        const id = idRef.current++
        setMessages((m) => [...m, { id, text: e.data, from: "server" }])
      }
    }
    es.onerror = () => {
      es.close()
    }
    return () => es.close()
  }, [])

  async function sendMessage() {
    if (!input) return
    const msg = { from: "web", text: input }
    // optimistic UI
    const id = idRef.current++
    setMessages((m) => [...m, { id, text: input, from: "me" }])
    setInput("")

    try {
      await fetch("http://localhost:8081/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "chat", msg }),
      })
    } catch (err) {
      // on error, append an error message
      const id2 = idRef.current++
      setMessages((m) => [...m, { id: id2, text: "failed to send", from: "system" }])
    }
  }

  return (
    <div>
      <h1>Coach</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Messages, tips, and coach recommendations.</p>

        <div style={{ border: "1px solid #ddd", padding: 12, height: 300, overflow: "auto" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 8 }}>
              <strong>{m.from}:</strong> {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            style={{ flex: 1 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}
