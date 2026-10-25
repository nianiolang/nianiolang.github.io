---
layout: default
title: Nianio Pattern
---

## The Nianio Pattern

The Nianio Pattern is a technology-independent way to structure long-running applications that maintain state and interact with an external world.

> A Nianio is a deterministic, stateful message transducer. It consumes accepted input commands from one logical FIFO queue, performs one atomic transition for each command, and writes finite sequences of output commands to independent workers.

The pattern separates application decisions from external effects. Nianio owns the application state and decides what should happen. Workers perform operations such as HTTP requests, file access, timers, rendering, or device communication.

### When to use it

The pattern is useful when an application:

- has complex state that changes over time;
- receives events from several asynchronous sources;
- must serialize decisions without sharing mutable application state;
- interacts with external systems whose results arrive later;
- benefits from deterministic transition logic that can be tested independently of its environment.

### Concepts

| Concept | Meaning |
| --- | --- |
| `State` | The complete logical application state owned by one Nianio instance. |
| `Cmd` | An input message describing one event to process. |
| `ExtCmd` | An output message instructing one worker to perform an operation. It describes an effect; it is not the effect itself. |
| `Step` or `NianioFunc` | The deterministic transition logic for one `State` and one `Cmd`. |
| Worker | An adapter between Nianio and an external system or execution mechanism. |
| Runtime | The mechanism that owns the input queue, invokes transitions, and delivers `ExtCmd` messages. |
| Supervisor | A component outside Nianio that reacts to fatal failure and may start a new instance. |

### Transition model

A transition can be described as:

```text
Step : State × Cmd → State × ExtCmd*
```

`ExtCmd*` denotes a finite output sequence. It does not require an implementation to use an array.

For a set of workers `W`, the more precise model is a family of output sequences:

```text
Step : State × Cmd → State × ∏(w ∈ W) ExtCmd_w*
```

A flat list such as:

```text
[WorkerA.X, WorkerB.Y, WorkerA.Z]
```

is one possible representation. Its semantically relevant projections are:

```text
WorkerA: [X, Z]
WorkerB: [Y]
```

The order of commands sent to one worker is significant. There is no required order in which different workers must start or finish their effects.

### Properties of a transition

Each transition:

- consumes exactly one `Cmd`;
- is deterministic for a fixed `State` and `Cmd`;
- finishes in finite execution time;
- does not wait for an external operation;
- produces one next state and a finite amount of output;
- does not invoke another transition recursively.

An external value such as the current time, random data, a network response, or user input must enter Nianio in a `Cmd`. Transition logic must not read such sources directly.

An implementation may mutate a private working representation of `State`. Semantically, however, the transition determines a new value. Workers and other components must never receive a reference that lets them observe or modify Nianio's state.

### Zero logical time

A successful transition is atomic and has zero logical time. This does not mean that it consumes no processor time. It means that the model exposes no intermediate state:

```text
state before the transition
            ↓
     one atomic step
            ↓
state after the transition
```

No later `Cmd` may be processed in the middle of the step. A worker response cannot affect the step that caused it, and no component can observe a partially updated state.

### The input stream

Each Nianio instance has one logical FIFO input queue.

If events occur concurrently, the pattern does not determine which event the runtime accepts first. Once the runtime has accepted commands as `A`, then `B`, it must process `A` before `B`.

There is at most one active transition in an instance. If a worker sends a `Cmd` while an `ExtCmd` is being delivered, the new command is appended to the input queue. It cannot invoke `Step` directly or bypass commands already waiting.

A concrete runtime must document when a command becomes accepted, whether submission can fail before acceptance, and whether it applies backpressure. FIFO is an ordering guarantee; any additional liveness guarantee depends on stated runtime assumptions such as fair scheduling and terminating handlers.

### The output streams

Nianio can only write to its logical output streams. It cannot:

- read whether a worker has started or completed an operation;
- wait for a worker;
- use a worker handler's return value;
- let worker feedback affect the current transition;
- depend on the relative progress of different workers.

If a worker's result matters to the application, the worker sends it back as a new `Cmd`:

```text
Nianio  -- StartRequest(17) ----------> HTTP worker
Nianio  <-- RequestSucceeded(17, data) -- HTTP worker
```

This is an asynchronous protocol even when a runtime uses a direct function call to deliver an `ExtCmd`. A direct call is a transport choice, not a request-response API.

### Workers

A worker:

- receives only commands addressed to it;
- has no access to Nianio's `State`;
- does not invoke `Step`;
- does not communicate directly with another worker;
- does not wait for another worker's effects;
- may later send a new `Cmd` to Nianio;
- keeps only the technical state required to operate its external resource.

Examples of legitimate worker state include a server handle, an open device, pending response handles, or correlation identifiers. Application decisions remain in Nianio.

If two workers use one shared resource and correctness depends on the order of their operations, they are not independent. The resource should be owned by one worker, or coordination should be expressed explicitly through `Cmd` messages and `State`.

### Normal-operation guarantees

While an instance is operating correctly, its runtime must not silently:

- lose, duplicate, or reorder accepted `Cmd` messages;
- execute two transitions concurrently;
- deliver an `ExtCmd` to the wrong worker;
- reorder commands addressed to the same worker;
- expose Nianio's state to a worker;
- turn worker feedback into a reentrant transition.

These guarantees do not imply durable queues, persistence across process failure, or exactly-once execution of external effects.

### Fatal failure

An unexpected failure inside Nianio or at the Nianio-worker boundary stops the entire instance:

1. its transition function is never invoked again;
2. no remaining command is processed;
3. its state must not be used to continue execution;
4. recovery is delegated to a supervisor outside Nianio.

The pattern deliberately does not specify which previously written `ExtCmd` messages:

- were not delivered;
- began an external effect;
- completed an external effect;
- will finish after Nianio has stopped.

Therefore a failed transition does not imply rollback of external effects. When a domain requires retry safety, workers or external systems need operation identifiers, idempotency, deduplication, or reconciliation.

A supervisor normally recovers by starting a new generation of the whole infrastructure: a new Nianio instance, new workers, and a new input queue. Late messages from workers belonging to the failed generation must not enter the new instance.

Expected negative outcomes are not necessarily fatal failures. A timeout, HTTP 404 response, or rejected operation can be represented as an ordinary `Cmd` and handled by transition logic. Contract violations, missing workers, invalid messages, and uncaught runtime or worker exceptions are fatal.

### Required semantics and implementation choices

A conforming implementation must preserve the observable rules described above, especially:

- one transition at a time;
- no reentrant transition;
- FIFO processing after command acceptance;
- write-only output from Nianio's point of view;
- ordering within each worker's input stream;
- isolation of `State`;
- fail-stop behavior after a fatal error.

An implementation may choose:

- an array, generator, callback, buffer, or channel to represent transition output;
- an event loop, threads, processes, or direct function calls as its transport;
- immutable values, defensive copies, ownership rules, or process isolation to protect state;
- whether to deliver output incrementally or after the transition physically returns, provided that worker feedback cannot enter the current step;
- a type system and validation mechanism appropriate to its language binding.

Runtime validation is valuable, but JSON-PTD and full JSON copying are choices of the current JavaScript binding rather than definitions of the Nianio Pattern.

For one concrete implementation, continue with [Nianio Pattern in Node.js](nianio_pattern_in_nodejs.html).
