---
layout: default
title: Nianio Pattern in Node.js
---

## Nianio Pattern in Node.js

The [Nianio Pattern](nianio_pattern_introduction.html) makes state and decisions explicit so that behavior can be reviewed across events. This page explains how a JavaScript binding expresses that model. The architectural questions come first; the library provides a mechanism for executing the answers.

### Start by finding the state

A request handler can look stateless while the larger operation depends on pending responses, a timeout, retries, or cancellation. Those facts determine what the next callback should do. Node.js can execute each callback to completion without deciding whether its result is still relevant to the application.

Before wiring workers together, identify the events, the facts needed to interpret them, and the decisions they cause. For an operation with a deadline, for example:

| Question | Representation |
| --- | --- |
| Which operation is still current? | An identifier and status in `State`. |
| Has a response or timeout arrived? | A `Cmd` carrying the operation identifier. |
| Should it be accepted, ignored, or treated as a fault? | A decision in `nianioFunc`. |
| How is a request sent or a timer started? | An `ExtCmd` delivered to the corresponding worker. |
| Where are sockets and response handles kept? | Technical state inside the worker. |

Use the transition function to test these decisions without starting a server or waiting for timers. Wrapping existing callbacks in workers is not enough if they still make conflicting application decisions from private flags.

### Binding status and runtime conformance

The code references below describe upstream commit [`31eb64e`](https://github.com/atinea-nl/nianio-pattern-js/tree/31eb64eb1d0a598daf5bea8880d7f5c7151b81a9). This version is useful for studying the binding, but it is not yet a fully conforming implementation of the contract described in the pattern documentation:

- its input queue uses `push()` and `pop()`, which reverses pending commands instead of processing them in FIFO order;
- its error paths do not implement an explicit, permanent stopped state covering every input and initialization failure.

Applications need a runtime that satisfies the pattern's contract. Tests of application transitions and tests of these runtime guarantees serve different purposes. A demonstration working in the browser does not establish either guarantee by itself.

### Direct handlers and the event loop

In this implementation, the dispatcher and worker handlers execute on the dispatcher's event-loop thread. The Node.js scheduler uses `setImmediate`; the browser scheduler uses `setTimeout(..., 0)`. The dispatcher calls worker handlers directly after `nianioFunc` returns and its result is copied and validated.

A handler's return value is ignored. A response sent through `pushCmd` joins the input queue and does not enter the current transition. This implements an asynchronous message protocol, although delivering an `ExtCmd` uses an ordinary synchronous function call.

Transition functions and directly invoked handlers must finish promptly. A worker should start slow I/O asynchronously or hand off expensive computation, then report a result through `pushCmd`. See Node.js's [event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop). A Nianio worker is an architectural role; it need not be a Node.js worker thread.

The current tick processes queued commands in a loop. `setImmediate` defers the start of that tick; it does not yield after every transition.

### State and command validation
This binding uses [JSON-PTD](json-ptd_intro.html) to describe the valid forms of `state`, `cmd`, and `extCmd`. It copies and validates the initial state, validates copied incoming commands, and copies and validates the state and output messages produced by a transition. Its validator is maintained in [json-ptd](https://github.com/atinea-nl/json-ptd).

The regular JavaScript binding protects state ownership through defensive copying. `nianioFunc` can mutate its private working copy and return it. Workers must not retain or access the instance's internal state. The supplied `deepCopy` uses JSON serialization, so values must be finite and compatible with that representation.

Types catch malformed data. They cannot establish that an integer identifies the current request, that a timeout is still relevant, or that a state change is allowed. Those are application rules for transition logic and event-sequence tests.

### API documentation

The library provides the `NianioStart` function that initializes and starts an instance. It expects an object with these parameters:

| Parameter | Meaning |
| --- | --- |
| `ptd` | JSON-PTD definitions containing `state`, `cmd`, and `extCmd`, plus any referenced types. |
| `nianioFunc` | The transition function. It accepts the current state and one command, then returns `{state, extCmds}`. Application decisions belong here. |
| `initState` | The initial state value. |
| `workerFactories` | A map from worker names to factory functions, described below. |
| `nianioRuntime` | Platform hooks for scheduling, copying, and reporting fatal errors. The library supplies implementations under `runtimes/`. |

The runtime hooks are `scheduleNextNianioTickFunc` to schedule the dispatcher, `deepCopy` to copy state and messages, and `logErrorBeforeTerminationFunc` to report an error caught during dispatch. The last hook reports the error; it does not itself implement permanent termination.

The output array makes the distinction between deciding and executing visible: `nianioFunc` constructs descriptions of operations. It does not call workers or wait for their results. Treat the array as an output buffer, rather than as a way to inspect the progress of external work.

The library has no public `stop` method. Transition logic may express an application-level terminal state, but stopping the infrastructure belongs outside that logic. Fatal failure must permanently stop the instance; the limitations of the current implementation are listed above.

### Worker definition
Each worker factory is called once during initialization. It receives `pushCmd`, the function used to submit input messages, and returns a handler that receives the worker's output messages:

```text
factory(pushCmd) -> handleExtCmd
```

The factory's closure holds technical resources such as sockets or pending HTTP response handles. If a counter decides whether a timeout is obsolete, it belongs in Nianio's state. A counter used only to allocate unique connection handles can belong in the worker. The relevant distinction is who needs the information to make an application decision.

The timer below demonstrates the complete factory shape. It reports that a delay elapsed; the transition decides what that fact means now.

### Message routing

At the Nianio boundary, each command is wrapped in a variant named after its worker. For example, the transition sees a timer input under `ov.TimerWorker`.

The dispatcher unwraps an output message before delivering it to the named worker. The worker's `pushCmd` function wraps an input message with that worker's name before adding it to the queue. This gives the transition an explicit event source without exposing the worker's internal resources.

### Error handling
Expected external failures should have an explicit representation in the message contract. Transition logic can then decide whether to retry, reject, or ignore the result using the current state.

A contract violation or an uncaught internal error is fatal. In the current dispatcher, exceptions during a tick are logged through `logErrorBeforeTerminationFunc` and rethrown. A host that catches exceptions must not resume the failed instance. Rethrowing alone is not a complete stop mechanism for every host or every failure path.

Recovery belongs to an external supervisor and normally creates a new instance with new workers and channels. The failed instance's state cannot be used for continuation. Already requested effects may still complete; stopping Nianio does not roll back HTTP requests, writes, or other external operations.

### Default workers

Workers with a clear technical responsibility can be reused across applications. Their simplicity helps keep domain decisions in the transition function.

#### Simple timer worker

The timer returns the payload it received after a configured delay. Include an operation or timer identifier in that payload when old timer events can outlive the decision that created them. Arrival of a timeout is an observation; whether it still applies is a decision made from state.

~~~js
export function simpleTimerWorkerGenerator({seconds}) {
    if (seconds == null) throw new Error('seconds == null') 
    function simpleTimerWorker(pushCmdFunc) {
        function pushExtCmdFunc(extCmd) {
            setTimeout(() => pushCmdFunc(extCmd), seconds * 1000);
        }
        return pushExtCmdFunc;
    }
    return simpleTimerWorker;
}
~~~

#### HTTP worker

The HTTP worker starts a server on the configured port. It forwards each request's URL and connection identifier to Nianio. Output messages use that identifier to route a response to the waiting connection; `httpWorkerExtCmdPtdFromPayload` describes their payload type.

The connection identifier routes a reply to a transport handle. It need not identify a game, a retry attempt, or a deadline. Keep those meanings distinct in the state and message contracts; the [HTTP game example](nianio_pattern_example_http_server.html) shows why.

~~~js
import { createServer } from 'http';

export function httpWorkerGenerator({port}) {
    if (port == null) port = 8000;

    function httpWorker(pushCmdFunc) {
        let counter = 0;
        const resHashMap = {};

        const server = createServer((req, res) => {
            const connectionId = counter;
            resHashMap[connectionId] = res;
            counter++;
            const url = req.url || '';

            pushCmdFunc({ 'ov.NewRequest' : {
                'ConnectinId': connectionId,
                'Url': url,
            }});
        });

        server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));

        function pushExtCmdFunc(extCmd) {
            const connectionId = extCmd['ConnectinId'];

            if (!Object.hasOwn(resHashMap, connectionId)) {
                pushCmdFunc({ 'ov.ConnectinIdDoesntExist' : null });
                return;
            }

            const res = resHashMap[connectionId];
            const statusCode = extCmd['StatusCode'];
            const message = extCmd['Payload'];

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
            delete resHashMap[connectionId];
        }

        return pushExtCmdFunc;
    }

    return httpWorker;
}

export const httpWorkerCmdPtd = { 'ov.ptd_var': {
    'NewRequest': { 'ov.with_param': { 'ov.ptd_rec': {
        'ConnectinId': { 'ov.ptd_int': null },
        'Url': { 'ov.ptd_utf8': null } },
    }},
    'ConnectinIdDoesntExist': { 'ov.no_param': null },
}};

export function httpWorkerExtCmdPtdFromPayload(payloadPtd) {
    return { 'ov.ptd_rec': {
        'ConnectinId': { 'ov.ptd_int': null },
        'StatusCode': { 'ov.ptd_int': null },
        'Payload': payloadPtd,
    }};
}
~~~

### Download nianio-pattern-js
The library source and its example are available on GitHub. Check the implementation against the documented contract and the version-specific limitations above.
[nianio-pattern-js](https://github.com/atinea-nl/nianio-pattern-js)
