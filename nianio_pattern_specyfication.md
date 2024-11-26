---
layout: default
title: Nianio Pattern specyfication
---

## Nianio Pattern specification
Specification version: `1.0`

The Nianio Pattern provides a structured approach for managing application state with asynchronous communication between different system components. This design pattern is technology-agnostic, allowing implementation in any technology stack. The core concept revolves around state machines that handle state updates and command processing in an organized and efficient manner.

### Key Concepts
The Nianio Pattern is built upon several fundamental concepts:

#### State Machine
A State Machine is a program that maintains "state," "command queue," and "transition function." The state machine operates in an infinite loop (called Dispatcher), continuously updating its state based on the current state and the first command in the queue. Additionally, the "transition function" returns a list of commands that the Dispatcher should appropriately process (e.g., enqueue to another state machine's queue). The "command queue" should be capable of accepting commands from different threads; therefore, it must be equipped with mechanisms that ensure exclusive access for editing. The Dispatcher should run synchronously, preferably on its own thread. Below is a highly simplified version of the Dispatcher:
```
while (true) {
    command = queue.pop()
    state, externalCommands = calculateNewState(state, command)
	// process externalCommands
}

```
With such defined machines, we can easily define an entire network of state machines communicating with each other. The Nianio Pattern is precisely such a network with a few additional requirements.

#### Nianio (Main State Machine)
The Nianio is the primary state machine responsible for the overall application state. It adheres to the following guidelines:
- Non-Blocking Transition Function: The transition function should execute immediately without performing any heavy or blocking operations.
- Command Dispatching: During the execution of the transition function, commands can be sent to the queues of Workers or to Nianio's own queue for further processing.
- State Modification: The application state can only be modified within the main infinite loop, referred to as the Dispatcher. Neither Workers nor the transition functions are permitted to modify the state directly.

#### Workers
Workers are specialized state machines designed to handle resource-intensive tasks. They operate under the following principles:
- Heavy Operations: Workers are intended to perform operations that may block execution threads, such as data processing, network requests, or complex computations.
- Asynchronous Communication: Worker Dispatchers send commands only to Nianio (Main State Machine). They do not communicate directly with each other. This allows for precise communication and management of Nianio's main state.
- State Modification: Similar to Nianio, Workers can only modify their own state within their main infinite loop. They cannot directly alter the global application state managed by Nianio.

### State and Command Validation
The Nianio Pattern also ensures the validation of processed states and commands. During each Dispatcher transition, the command, the received state, and the list of external commands are validated to ensure they match to a their predefined immutable type.
One possible way to perform validation is by using json-ptd: <a href="json-ptd_intro.html">Introduction to json-ptd technology</a>

An example implementation of the Nianio Pattern library and its usage can be found on the page: 
<a href="nianio_pattern_in_NodeJs.html">Nianio Pattern in NodeJs</a>