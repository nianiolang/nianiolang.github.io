---
layout: default
title: Nianio Pattern — elevator state and decisions
---

## An elevator: asking for something does not make it true

The [interactive elevator demo](nianio-pattern-elevator/) shows buttons, movement, and doors. The more interesting part is the state behind them: a requested destination differs from the last reported position, and a request to close the doors differs from confirmation that they are closed.

These distinctions are easy to miss when building one event handler at a time. A button handler can issue a movement command; a timer handler can close the doors; an animation callback can update the display. Each can look reasonable while the combined behavior relies on timing assumptions nobody has written down.

The [Nianio Pattern](nianio_pattern_introduction.html) gives those decisions a common model. Use this walkthrough to examine what the controller needs to know before deciding its next action.

### Find the facts that change the next decision

| Fact in the model | Why it matters |
| --- | --- |
| Last reported `Position` | A destination request does not prove that the elevator has arrived. |
| Chosen `Destination` | A later button press must be interpreted in the context of the current journey. |
| Door phase: `Closed`, `Opening`, `Open`, or `Closing` | Requesting a change and observing its completion are different events. |
| Pending internal and external button requests | A request may need to remain pending while another is served. |
| `LastDoorsTimerCallId` | A timer from an earlier opening must not control a later one. |

These fields appear in the demo's [state and message definitions](nianio-pattern-elevator/nl/sources/elevatorLogicPtd.nl). They describe what the controller knows and intends. The physical device or simulation remains outside that state.

### Follow one decision across several events

Suppose the elevator is at floor 0 with its doors open, and the user requests floor 3. A useful behavior to specify and test is:

| Event | Decision to check |
| --- | --- |
| Floor 3 is requested. | Remember the destination, enter `Closing`, and request door closure. |
| Another button is pressed before closure finishes. | Update pending requests according to policy while retaining the distinction between `Closing` and `Closed`. |
| `DoorsClosed` arrives. | Record confirmation and decide whether and where to move. |
| A sensor reports arrival at the destination with zero velocity. | Record the position, enter `Opening`, and request door opening. |
| `DoorsOpened` arrives. | Record confirmation and start a new door timer with a new identifier. |
| An earlier door timer expires. | Recognize the obsolete identifier and leave the current door cycle unchanged. |

The transition decides these actions from state and one event. Workers execute movement, door operations, timer delays, and display updates. Their completion reports come back as later input messages. A worker's return value cannot stand in for confirmation.

The current [transition source](nianio-pattern-elevator/nl/sources/elevatorLogic.nl) provides a concrete starting point for this review. For example, `handleDoorsTimer` checks the timer identifier. Examine whether the current door phase should also constrain that decision, and when it should become `Closing`. Merely having the right state fields does not ensure every path uses them correctly.

### Turn assumptions into reviewable rules

Run the demo, then write down the expected decisions for sequences that the animation alone cannot establish:

- A destination changes while the doors are closing or the elevator is moving. Which requests remain pending, and which destination wins?
- A button is pressed repeatedly. Does that mean one outstanding request or several?
- A door confirmation is delayed or repeated. Which phases permit it, and how should an unexpected confirmation be handled?
- A timer expires after another door cycle has begun. Which identifier makes it obsolete?
- The controller restarts while an old operation is still completing. How are messages from the old instance kept out of the new one?

Specify the answers before treating these sequences as tests. Starting state, input order, expected next state, and expected output messages are enough to exercise transition logic without animation or real-time delays. Then test the runtime's queue and isolation guarantees separately.

### Read the demo as an implementation to review

The browser [entry point](nianio-pattern-elevator/index.js) currently selects the compiled NianioLang transition. A [JavaScript transition](nianio-pattern-elevator/elevatorLogic/nianioFunc.js) is also included. The [bundled dispatcher](nianio-pattern-elevator/nianio-pattern/nianioPatternWithNl.js) still uses `push()` and `pop()` for pending input, so it does not yet provide the FIFO contract described in the pattern introduction.

The simulated engine and sensor adapters also share a callback in the browser entry point. When designing a conforming worker boundary, make their shared resource explicit: a single simulation worker can own the simulated device and report its observations. Domain decisions still belong in the transition.

The example is useful both for learning the model and for finding places where an implementation falls short of it. A convincing animation is one observed sequence. An explicit state model lets us ask what should happen in the others.

Continue with [the HTTP game](nianio_pattern_example_http_server.html) for a smaller example of obsolete events, or [the pattern introduction](nianio_pattern_introduction.html) for the complete transition and runtime contract.
