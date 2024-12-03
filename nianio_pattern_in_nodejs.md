---
layout: default
title: Nianio Pattern in NodeJs
---

## Nianio Pattern in NodeJs
The Nianio Pattern can be defined in any programming language. In this case, we will create a NodeJs library that can be used as a system skeleton, providing all the functionalities outlined by the Nianio Pattern.

### Why NodeJs?
NodeJs is a highly popular technology for building backend services, such as Web APIs. These systems often manage incoming connections, database communications, and more. Utilizing the Nianio Pattern in this context allows us to synchronize these processes and offer additional capabilities, such as managing the number of open connections and queuing requests.

### JavaScript is Single-Threaded
The JavaScript runtime operates on a single thread, yet it allows for writing asynchronous code. This is made possible through a mechanism called the JS Event Loop. Consequently, both Nianio and Workers will operate on the same thread, requiring them to share it. 
Therefore, operations like transition functions of Nianio and Workers must execute 'immediately'. Costly operations, such as database queries, must be handled using callbacks to avoid blocking the main thread. Responses from the database will be directed to the Task Queue and processed in due course.
To prevent any Dispatcher from monopolizing the thread entirely, its transition will also be deferred to the Task Queue using `process.nextTick`.

### State and Command Validation
The Nianio Pattern ensures the validation of processed states and commands. During each Dispatcher transition, the command, the received state, and the list of external commands are validated to ensure they conform to a predefined immutable type. All objects - state and commands - are assumed to be finite and compliant with json-ptd. For validation, we will use the JavaScript json-ptd validator available on GitHub. [https://github.com/atinea-nl/json-ptd](https://github.com/atinea-nl/json-ptd)

To ensure that the state and commands can only be modified within the Dispatcher, all objects that users of the library interact with will be fully copied.

### Api documentation

The library provides the `NianioStart` function that initializes and starts Nianio. It expects parameters:
- `statePtd` - The ptd type of Nianio's internal state.
- `cmdPtd` - The ptd type of the commands sent to Nianio (by workers)
- `extCmdPtd` - Type of commands going out of Nianio (to the workers).
- `nianioFunction` - The transition function. On input it accepts the application state and command, on output it should return an object with a `state` field (new state) and an `extCmds` field (list of external commands). This is where the core logic of the system is implemented.
- `initState` - Nianio's initial state.
- `workerFactories` - Hash with worker factories (example will be given below)

The library does not contain a method to stop the Nianio dispatcher - this logic is left to developers to implement in `nianioFunction`. 

The dispatcher itself does not operate in an infinite loop but works as a result of receiving a command. Commands in the queue are scheduled to execute immediately after processing the current command.

### Worker definition
The definition of the worker we pass to Nianio is a function of type 'closure'. Inside this function we can define any logic and state of the worker. The worker function must meet the following conditions:
- Accepts on input a reference to a function that allows the worker to throw commands to Nianio.
- On the output, it returns a command that allows you to throw commands to the worker

The worker function is executed only once during the initialization of Nianio.

Example of counter worker that returns answer after 5s:
~~~js
function counterWorker(pushCmdFunc) {
    let counter = 0;

    function pushExtCmdFunc(extCmd) {
        const newValue = counter;
        counter++;
        setTimeout(() => pushCmdFunc(newValue), 5000);
    }

    return pushExtCmdFunc;
}
~~~

### Additional assumption
All command types should read from the variant with the name of the worker they are associated with. 
  In practice, this makes it easier to parse and send commands in `nianioFunction`. 

  With that assumption library additionally ensures that:
  - Before the command reaches the worker it is unpacked from variant with his name
  - Before a command gets from a worker to the Nianio queue it is wrapped in a variant with his name

### Error handling
In case of any exception during the dispatcher's transition (e.g. attempting to handle a command or a state that does not conform to ptd ), nianio will throw an unhandled exception with an error message. 
This is a state in which we don't know what to expect next, so the error will be thrown at the toplevel of js runtime and it will terminate the entire service.


### Download nianio-pattern-js
Library with its documentation and example available on GitHub.
 [nianio-pattern-js](https://github.com/atinea-nl/nianio-pattern-js)