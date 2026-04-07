"use client";

import { FormEvent, useState } from "react";

type SignInProps = {
  initialUsername?: string;
  onSubmit: (username: string) => void;
  onCancel: () => void;
};

export default function SignIn({ initialUsername = "", onSubmit, onCancel }: SignInProps) {
  const [username, setUsername] = useState(initialUsername);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = username.trim();
    if (!clean) return;
    onSubmit(clean);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <label htmlFor="signin-username" style={{ fontSize: 13, color: "var(--muted)" }}>
        Username
      </label>
      <input
        id="signin-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{
          width: "100%",
          marginTop: 6,
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.03)",
          color: "var(--text)",
        }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: "var(--accent)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
