duction---
layout: default
title: Nianio Pattern introduction
---

## Introduction to the Nianio Pattern

The Nianio Pattern provides a structured approach for managing long-running applications that rely on asynchronous communication between distinct system components. This pattern is technology-agnostic, enabling implementation within any technology stack. At its core, the Nianio Pattern leverages extended state machines to handle state transitions and command processing in a controlled and efficient manner.

### When to Use the Nianio Pattern?

Use the Nianio Pattern when building long-running applications that must handle asynchronous communication and maintain a complex, evolving internal state.

### What is the Nianio Pattern?

The system is composed of a central state management unit, called the **Nianio**, and multiple worker components that communicate asynchronously with the Nianio. All communication is routed through queues - completely eliminating any synchronous interactions between components.

The Nianio maintains the application’s state, a queue of incoming commands, and a dispatcher that updates the state by invoking the **NianioFunc** (also referred to as **F**). The NianioFunc takes the current Nianio state and a command from the queue and returns a new state along with a list of commands. These commands are then dispatched to the workers.

#### Assumptions about State and NianioFunc

- **In-Memory State:** The entire Nianio state resides in memory.
- **Non-Blocking NianioFunc:** The NianioFunc must execute immediately without performing any blocking operations.
- **Command Dispatching:** While processing each transition, the NianioFunc can enqueue commands for workers or for the Nianio itself.
- **Controlled State Modification:** Only the Nianio dispatcher can modify the state. Neither workers nor NianioFunc are allowed to change the state directly.
- **Purely Functional:** The NianioFunc is mathematically pure, relying solely on its input parameters and not affecting any external systems, modules, or variables.

#### Assumptions about Workers

- **No Direct Worker-to-Worker Communication:** Workers do not communicate with each other.
- **Minimal Logic:** Workers should remain simple and defer application logic to the NianioFunc.
- **Minimal State:** Workers should have as little internal state as possible - state belongs in the Nianio.
- **External Integration:** Workers are interfaces with the external world (e.g., printers, parsers, TCP/HTTP interfaces, UI components).

### State and Command validation

The Nianio Pattern ensures the validation of all processed states and commands. During each dispatcher transition, the command, the current state, and any external commands are validated against predefined, immutable types.

One practical approach to validation is to use **json-ptd** technology. For more details, see: [Introduction to json-ptd technology](json-ptd_intro.html).

For an example implementation and practical usage of the Nianio Pattern, refer to: [Nianio Pattern in Node.js](nianio_pattern_in_nodejs.html).
