"use client";

import { useEffect, useState } from "react";
import SignIn from "./SignIn";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("kg");
  const [username, setUsername] = useState("User@example.com");
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("account.settings");
      if (raw) {
        const s = JSON.parse(raw);
        setNotifications(Boolean(s.notifications));
        setUnits(s.units || "kg");
      }
      const savedUser = localStorage.getItem("account.username");
      if (savedUser) {
        setUsername(savedUser);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "account.settings",
        JSON.stringify({ notifications, units })
      );
    } catch {}
  }, [notifications, units]);

  return (
    <div style={{ display: "inline-block" }}>
      <button
        aria-label="Account"
        onClick={() => setOpen((s) => !s)}
        className="avatar"
      >
        U
      </button>

      {open && (
        <div className="account-menu" role="dialog" aria-label="Account menu">
          <div style={{ marginBottom: 8 }}>
            <strong>Account</strong>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{username}</div>
          </div>
          <div className="row">
            <label>Units</label>
            <select value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                setShowSignIn(true);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--line)",
                background: "var(--accent)",
                marginRight: 8,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>

            {showSignIn && (
              <SignIn
                initialUsername={username === "User@example.com" ? "" : username}
                onSubmit={(nextUsername) => {
                  setUsername(nextUsername);
                  try {
                    localStorage.setItem("account.username", nextUsername);
                  } catch {}
                  setShowSignIn(false);
                  setOpen(false);
                }}
                onCancel={() => setShowSignIn(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
