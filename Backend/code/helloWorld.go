package main

import (
    "fmt"
    "time"
)

func main() {
    fmt.Println("Hello? This is Go (with PubSub)")

    ps := NewInMemoryPubSub()

    ch, unsub := ps.Subscribe("greet")
    defer unsub()

    // receiver
    go func() {
        for msg := range ch {
            fmt.Println("received:", msg)
        }
    }()

    // publish a few messages
    ps.Publish("greet", "hi there")
    ps.Publish("greet", map[string]string{"from": "pubsub", "text": "hello!"})

    // give receiver time to print
    time.Sleep(100 * time.Millisecond)
}