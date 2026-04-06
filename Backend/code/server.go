package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    _ "github.com/lib/pq"
)

var db *sql.DB

func initDB() error {
    user := os.Getenv("POSTGRES_USER")
    pass := os.Getenv("POSTGRES_PASSWORD")
    host := os.Getenv("POSTGRES_HOST")
    port := os.Getenv("POSTGRES_PORT")
    name := os.Getenv("POSTGRES_DB")

    if host == "" {
        host = "127.0.0.1"
    }
    if port == "" {
        port = "5432"
    }
    if user == "" {
        user = "postgres"
    }
    if name == "" {
        name = "postgres"
    }

    connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, name)
    var err error
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        return err
    }
    db.SetConnMaxLifetime(time.Minute * 5)

    // create table if not exists
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS workout_entries (
            id SERIAL PRIMARY KEY,
            exercise TEXT NOT NULL,
            reps INT,
            weight NUMERIC,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
        )
    `)
    return err
}

func sendCORSHeaders(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
}

func main() {
    ps := NewInMemoryPubSub()

    if err := initDB(); err != nil {
        log.Printf("warning: could not initialize DB: %v", err)
        // continue; DB optional for pubsub-only usage
    }

    mux := http.NewServeMux()

    mux.HandleFunc("/publish", func(w http.ResponseWriter, r *http.Request) {
        sendCORSHeaders(w)
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        if r.Method != http.MethodPost {
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
            return
        }
        var req struct {
            Topic string      `json:"topic"`
            Msg   interface{} `json:"msg"`
        }
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "bad request", http.StatusBadRequest)
            return
        }
        go ps.Publish(req.Topic, req.Msg)
        w.WriteHeader(http.StatusAccepted)
    })

    // workout save endpoint
    mux.HandleFunc("/workout", func(w http.ResponseWriter, r *http.Request) {
        sendCORSHeaders(w)
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        if r.Method != http.MethodPost {
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
            return
        }
        if db == nil {
            http.Error(w, "database not configured", http.StatusInternalServerError)
            return
        }

        var entries []struct {
            Exercise string  `json:"exercise"`
            Reps     int     `json:"reps"`
            Weight   float64 `json:"weight"`
            Notes    string  `json:"notes"`
        }

        // try decode as array
        if err := json.NewDecoder(r.Body).Decode(&entries); err != nil {
            // try single object
            r.Body.Close()
            return
        }

        tx, err := db.Begin()
        if err != nil {
            http.Error(w, "db error", http.StatusInternalServerError)
            return
        }
        stmt, err := tx.Prepare(`INSERT INTO workout_entries (exercise, reps, weight, notes) VALUES ($1,$2,$3,$4) RETURNING id`)
        if err != nil {
            tx.Rollback()
            http.Error(w, "db error", http.StatusInternalServerError)
            return
        }
        defer stmt.Close()

        ids := []int{}
        for _, e := range entries {
            var id int
            if err := stmt.QueryRow(e.Exercise, e.Reps, e.Weight, e.Notes).Scan(&id); err != nil {
                tx.Rollback()
                http.Error(w, "db error", http.StatusInternalServerError)
                return
            }
            ids = append(ids, id)
        }
        if err := tx.Commit(); err != nil {
            http.Error(w, "db error", http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]interface{}{"ids": ids})
    })

    // SSE subscribe endpoint: /subscribe?topic=...
    mux.HandleFunc("/subscribe", func(w http.ResponseWriter, r *http.Request) {
        topic := r.URL.Query().Get("topic")
        if topic == "" {
            http.Error(w, "missing topic", http.StatusBadRequest)
            return
        }

        // CORS and SSE headers
        w.Header().Set("Content-Type", "text/event-stream")
        w.Header().Set("Cache-Control", "no-cache")
        w.Header().Set("Connection", "keep-alive")
        sendCORSHeaders(w)

        flusher, ok := w.(http.Flusher)
        if !ok {
            http.Error(w, "streaming unsupported", http.StatusInternalServerError)
            return
        }

        ch, unsub := ps.Subscribe(topic)
        defer unsub()

        // send a ping every 30s to keep connection alive
        pingTicker := time.NewTicker(30 * time.Second)
        defer pingTicker.Stop()

        notify := r.Context().Done()
        for {
            select {
            case <-notify:
                return
            case msg, ok := <-ch:
                if !ok {
                    return
                }
                b, err := json.Marshal(msg)
                if err != nil {
                    // skip marshalling errors
                    continue
                }
                fmt.Fprintf(w, "data: %s\n\n", b)
                flusher.Flush()
            case <-pingTicker.C:
                fmt.Fprint(w, ": ping\n\n")
                flusher.Flush()
            }
        }
    })

    addr := ":8081"
    log.Printf("starting pubsub server on %s", addr)
    if err := http.ListenAndServe(addr, mux); err != nil {
        log.Fatalf("server error: %v", err)
    }
}
