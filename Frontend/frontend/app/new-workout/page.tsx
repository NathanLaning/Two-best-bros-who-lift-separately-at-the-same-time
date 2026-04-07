"use client"

import { useEffect, useRef, useState } from "react"

type Entry = {
  id: number
  exercise: string
  reps: number | ""
  weight: number | ""
  notes: string
  saving?: boolean
}

export default function NewWorkoutPage() {
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: 1, exercise: "", reps: "", weight: "", notes: "" },
  ])
  const nextId = useRef(2)
  const timers = useRef<Record<number, number>>({})

  function addEntry() {
    setEntries((e) => [...e, { id: nextId.current++, exercise: "", reps: "", weight: "", notes: "" }])
  }

  function removeEntry(id: number) {
    setEntries((e) => e.filter((x) => x.id !== id))
  }

  function updateEntry(id: number, patch: Partial<Entry>) {
    setEntries((list) => {
      return list.map((it) => (it.id === id ? { ...it, ...patch } : it))
    })
    scheduleSave(id)
  }

  function scheduleSave(id: number) {
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id])
    }
    timers.current[id] = window.setTimeout(() => doSave(id), 700)
  }

  async function doSave(id: number) {
    const entry = entries.find((e) => e.id === id)
    if (!entry) return
    setEntries((list) => list.map((it) => (it.id === id ? { ...it, saving: true } : it)))

    try {
      await fetch("http://localhost:8081/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            exercise: entry.exercise,
            reps: typeof entry.reps === "number" ? entry.reps : 0,
            weight: typeof entry.weight === "number" ? entry.weight : 0,
            notes: entry.notes,
          },
        ]),
      })
      setEntries((list) => list.map((it) => (it.id === id ? { ...it, saving: false } : it)))
    } catch (err) {
      setEntries((list) => list.map((it) => (it.id === id ? { ...it, saving: false } : it)))
    }
  }

  return (
    <div>
      <h1>New Workout</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Start a new workout, add exercises, sets and reps. Changes autosave.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((e) => (
            <div key={e.id} style={{ border: "1px solid #eee", padding: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  placeholder="Exercise"
                  value={e.exercise}
                  onChange={(ev) => updateEntry(e.id, { exercise: ev.target.value })}
                  style={{ flex: 2 }}
                />
                <input
                  placeholder="Reps"
                  value={e.reps === "" ? "" : String(e.reps)}
                  onChange={(ev) => {
                    const v = ev.target.value
                    const n = v === "" ? ("" as const) : parseInt(v || "0", 10)
                    updateEntry(e.id, { reps: n as any })
                  }}
                  style={{ width: 80 }}
                />
                <input
                  placeholder="Weight"
                  value={e.weight === "" ? "" : String(e.weight)}
                  onChange={(ev) => {
                    const v = ev.target.value
                    const n = v === "" ? ("" as const) : parseFloat(v || "0")
                    updateEntry(e.id, { weight: n as any })
                  }}
                  style={{ width: 100 }}
                />
                <button onClick={() => removeEntry(e.id)}>Remove</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <textarea
                  placeholder="Notes (optional)"
                  value={e.notes}
                  onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })}
                  style={{ width: "100%", minHeight: 64 }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                {e.saving ? "Saving..." : "Saved"}
              </div>
            </div>
          ))}

          <div>
            <button onClick={addEntry}>Add Exercise</button>
          </div>
        </div>
      </div>
    </div>
  )
}
