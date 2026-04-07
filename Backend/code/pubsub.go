package main

import (
    "sync"
)

// PubSub defines a minimal publish/subscribe interface.
type PubSub interface {
    Publish(topic string, msg interface{})
    Subscribe(topic string) (<-chan interface{}, func())
}

// InMemoryPubSub is a simple thread-safe in-memory pub/sub implementation.
type InMemoryPubSub struct {
    mu          sync.RWMutex
    subscribers map[string]map[chan interface{}]struct{}
}

// NewInMemoryPubSub creates an initialized InMemoryPubSub.
func NewInMemoryPubSub() *InMemoryPubSub {
    return &InMemoryPubSub{
        subscribers: make(map[string]map[chan interface{}]struct{}),
    }
}

// Publish sends msg to all subscribers of the given topic.
// Sends are done in non-blocking goroutines to avoid blocking the publisher.
func (ps *InMemoryPubSub) Publish(topic string, msg interface{}) {
    ps.mu.RLock()
    subs := ps.subscribers[topic]
    ps.mu.RUnlock()

    if subs == nil {
        return
    }

    wg := sync.WaitGroup{}
    for ch := range subs {
        wg.Add(1)
        go func(c chan interface{}) {
            defer wg.Done()
            // best-effort send; if receiver isn't ready, drop the message
            select {
            case c <- msg:
            default:
            }
        }(ch)
    }
    wg.Wait()
}

// Subscribe returns a receive-only channel and an unsubscribe function.
// The returned channel has a small buffer to reduce missed messages.
func (ps *InMemoryPubSub) Subscribe(topic string) (<-chan interface{}, func()) {
    c := make(chan interface{}, 4)

    ps.mu.Lock()
    if ps.subscribers[topic] == nil {
        ps.subscribers[topic] = make(map[chan interface{}]struct{})
    }
    ps.subscribers[topic][c] = struct{}{}
    ps.mu.Unlock()

    unsubOnce := sync.Once{}
    unsub := func() {
        unsubOnce.Do(func() {
            ps.mu.Lock()
            delete(ps.subscribers[topic], c)
            ps.mu.Unlock()
            close(c)
        })
    }

    return c, unsub
}
