"use client";

import { useEffect, useState } from "react";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("kg");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("account.settings");
      if (raw) {
        const s = JSON.parse(raw);
        setNotifications(Boolean(s.notifications));
        setUnits(s.units || "kg");
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
            <div style={{ fontSize: 13, color: "var(--muted)" }}>User@example.com</div>
          </div>

          <div className="row">
            <label>Notifications</label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
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
                // close and simulate save
                setOpen(false);
              }}
              style={{ padding: "8px 12px", borderRadius: 8, background: "var(--accent)", color: "white", border: "none" }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
