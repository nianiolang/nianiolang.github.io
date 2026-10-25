---
layout: default
title: Nianio Pattern
---

## The Nianio Pattern

The Nianio Pattern addresses a software-quality problem: a program can appear to work while important rules about its state and the order of events remain unwritten. Each callback may look reasonable on its own, yet the application's behavior depends on which one happens to run next.

State exists wherever the past changes what the program should do next. It includes pending work, the current selection, a cancellation, a retry count, or the identity of the response still worth accepting. Those facts can be scattered across closures, flags, UI controls, and assumptions about timing. Omitting them from an explicit model does not remove them from the application.

Nianio makes those facts and decisions visible together. It can be used to design an implementation, to review existing code, or simply to reason about a feature before writing it. You do not need to have found a concurrency bug, recognized a synchronization problem, or chosen a framework to benefit from it.

### Start with an ordinary interaction

A search box sends requests while the user types. A response handler displays whatever arrives. Testing one request at a time looks fine, but a slower earlier request can overwrite a newer result.

Suppose the intended rule is that only the current search may update the results:

| Event | Relevant state after the event | Decision |
| --- | --- | --- |
| The user starts search A. | A is current. | Request results for A. |
| The user starts search B. | B is current; A is obsolete. | Request results for B. |
| Results for B arrive. | B is still current. | Display B's results. |
| Results for A arrive. | B is still current. | Ignore the obsolete result. |

The missing piece was a definition of which response was still relevant. A request identifier in state makes that rule expressible and testable. The same exercise raises further questions: what happens after cancellation, after a timeout, or after closing and reopening the view? Can an old identifier be mistaken for a new request?

User input and network responses are already two asynchronous event sources. A timer adds another. A single event-loop thread does not answer how these events should affect the application; it only executes the handlers.

### Use it to discover what needs designing

As soon as two asynchronous sources can influence a component, their possible event orders deserve an explicit explanation. They may prove independent. They may require coordination. That is a conclusion to establish, rather than an assumption supplied by the absence of reported bugs.

A useful first review asks:

1. What can happen next, including completion, failure, timeout, cancellation, and repeated input?
2. Which facts from the past change the decision for that event?
3. Who owns those facts, and where is the decision made?
4. What should happen when the event is late, obsolete, or arrives in a different permitted order?
5. Which external actions follow, and what response would count as their completion?

These questions apply to small interfaces, request handlers, background jobs, games, and device controllers as well as large services. For a small component, a short list of events and a few state fields may be enough. If the component is genuinely stateless or independent, the exercise helps establish that. It remains useful even when the implementation needs no dedicated Nianio runtime.

Choosing to leave some cases unsupported can be a practical decision. Naming those cases makes the limitation reviewable. A path that has happened to work under the observed timing provides weaker evidence about quality.

### What the structure contributes

Nianio gives the answers a stable home:

| Design question | Where the answer belongs |
| --- | --- |
| What does this component need to remember? | Its explicit `State`. |
| What event has occurred? | An input message, `Cmd`. |
| Given what we know now, what should happen? | A transition, `NianioFunc`. |
| What operation should the outside world perform? | An output message, `ExtCmd`. |
| How is that operation performed and reported? | A worker. |

This makes it possible to review a decision without reconstructing control flow across unrelated callbacks. It also makes missing state harder to hide: if two situations require different responses to the same event, the state must distinguish them. The state needs enough information for future decisions, not an archive of everything that ever happened.

The pattern does not invent the application's policies. For example, it cannot decide whether a late result should be ignored or displayed with a warning. It makes that choice explicit and gives it a place to be tested. Adding a queue around otherwise unchanged handlers does not by itself provide this benefit.

### The component model

> A Nianio is a deterministic, stateful component. It consumes accepted input messages from one logical first-in, first-out (FIFO) queue, performs one atomic transition for each message, and writes finite sequences of output messages to independent workers.

Nianio owns the state of the component being modeled and decides what should happen. Workers perform operations such as HTTP requests, file access, timers, rendering, or device communication. A larger application can contain several Nianio instances with separate responsibilities; one global state object for the entire system is not required.

### Concepts

| Concept | Meaning |
| --- | --- |
| `State` | The complete logical state of the component owned by one Nianio instance, including facts about pending work needed for future decisions. |
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

A component that consumes an input sequence, carries state between steps, and produces an output sequence is called a **stateful transducer** in automata theory. This is an optional formal name for the model; understanding the pattern does not depend on knowing the term.

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

For the same initial state and accepted input sequence, the logic determines the same next states and output sequences per worker. This lets a test reproduce decisions without a real network, UI, or clock. It does not make the arrival order of external events predictable.

An implementation may mutate a private working representation of `State`. Semantically, however, the transition determines a new value. Workers and other components must never receive a reference that lets them observe or modify Nianio's state.

### Zero logical time

A successful transition is atomic and has zero logical time: the model exposes the state before and after the step, with no observable intermediate state. A real implementation still consumes processor time.

No later `Cmd` may be processed in the middle of the step. A worker response cannot affect the step that caused it, and no component can observe a partially updated state.

### The input stream

Each Nianio instance has one logical FIFO input queue.

If events occur concurrently, the pattern does not determine which event the runtime accepts first. Once the runtime has accepted commands as `A`, then `B`, it must process `A` before `B`.

There is at most one active transition in an instance. If a worker sends a `Cmd` while an `ExtCmd` is being delivered, the new command is appended to the input queue. It cannot invoke `Step` directly or bypass commands already waiting.

FIFO preserves the accepted order; it does not decide whether a message is still relevant. In the search example, an obsolete response may legitimately arrive after the current response. Transition logic recognizes it using state. Deliberately ignoring that response is an application decision; silently losing an accepted message in the runtime is a fault.

A concrete runtime must document when a command becomes accepted and how it handles input overload. Any guarantee that a queued message will eventually be processed also needs assumptions about scheduling and handlers finishing. These are execution requirements to verify, rather than reasons to leave event order undesigned.

### The output streams

Nianio can only write to its logical output streams. It cannot:

- inspect a worker's progress through the output channel;
- wait for a worker;
- use a worker handler's return value;
- let worker feedback affect the current transition;
- depend on the relative progress of different workers.

If a worker's result matters to the application, the worker sends it back as a new `Cmd`. For example, `StartRequest(17)` goes to the HTTP worker as an `ExtCmd`; `RequestSucceeded(17, data)` later enters Nianio as a `Cmd`. Information about progress follows the same rule.

The state should distinguish an operation requested from an operation confirmed whenever that distinction affects later decisions. Emitting a write command, for example, is not evidence that the data was saved.

This is an asynchronous protocol even when a runtime uses a direct function call to deliver an `ExtCmd`. A direct call is a transport choice, not a request-response API.

In a runtime using such calls on the dispatcher's thread, the worker handler occupies that thread until it returns. It must hand off slow work and return promptly. The protocol does not require physical parallelism, and its output API must not allow worker feedback to affect the current step.

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

For example, an HTTP worker can own the connection on which a response must be sent. Whether the request has expired, been superseded, or remains eligible for a result belongs in Nianio's state and transition logic. Giving an adapter those decisions would scatter the very state model the pattern is intended to expose.

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

This uncertainty also applies to output written during a transition that subsequently fails. Even a state object that appears intact must not be used to resume the failed instance.

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
- mechanisms for representing state and message contracts in its language binding.

JSON-PTD and full JSON copying are mechanisms used by the JavaScript binding. Its validation rules and execution behavior belong in that binding's documentation.

### Review the decisions, then the implementation

For each important event sequence, write down the starting state, the expected decisions, and the facts that must remain true. Try a different permitted order, an obsolete response, a repeated user action, and an expected failure. Test the transition logic against those expectations. Logging input messages can help reproduce a sequence, provided that the initial state and relevant inputs are also available.

Test the runtime separately for FIFO delivery, isolation, and stopping after a fatal error. Correct application logic cannot compensate for a runtime that violates its contract. Likewise, using a conforming runtime does not prove that the application's state and policies are complete.

One instance serializes decisions, while external work may proceed concurrently. The cost of queues, copying, and dispatch depends on the implementation and workload. Choose component boundaries and measure these costs where they matter. The design questions remain useful regardless of the execution strategy.

Continue with [the JavaScript binding](nianio_pattern_in_nodejs.html), [the HTTP game example](nianio_pattern_example_http_server.html), or [the elevator design walkthrough](nianio_pattern_example_elevator.html). Each shows how explicit state and event rules guide the review of an implementation.
