---
layout: default
title: Nianio Pattern — HTTP game and deadlines
---

## An HTTP game: which timeout still counts?

A tic-tac-toe server looks straightforward: accept a move, update the board, send a reply. Add a ten-second deadline and a new question appears: if a move extends the deadline, what should an already scheduled timeout do when it arrives?

The question exists even if tests have never exposed a timing problem. A callback that simply ends the game on every timeout would quietly encode the wrong rule. The [Nianio Pattern](nianio_pattern_introduction.html) helps expose the missing fact: the game must remember which deadline is current.

### Decide the rules before connecting the workers

The game is played through these endpoints:

- `/[gameId]/start` starts a game and its first timer.
- `/[gameId]/move/[moveId]` attempts a move at position 0–8.
- `/[gameId]/end` ends a game explicitly.

This example uses these policies:

- A timer ends a game only if the game is still playing and the timer identifies its current deadline.
- A move attempt with a parsed numeric position renews the deadline while the game is playing, even if the position is occupied or out of range. A request with an invalid endpoint shape or no parsable move number does not renew it. This is a policy of this example; decide explicitly whether it suits your application.
- Completed games reject further changes to the board. Their identifiers cannot be reused to start another game in this example.
- If a move and the current timeout arrive together, their accepted input order decides the outcome: a move processed first renews the deadline; a timeout processed first ends the game.

The timeout is processed as an event. This example does not enforce a deadline against an absolute wall-clock timestamp. A stricter deadline policy would need time observations in its input and corresponding state and decisions.

### Three identifiers, three meanings

| Identifier | Meaning | Owner |
| --- | --- | --- |
| `GameId` | Which game the event concerns. | Nianio's game state and message contracts. |
| `LastTimerCallId` / timer `CallId` | Which deadline is currently valid within that game. | Nianio; the timer worker echoes the supplied identifier. |
| `ConnectinId` | Which HTTP connection should receive a reply. | The HTTP worker; Nianio passes the handle back with its reply. |

`ConnectinId` retains the spelling used by the existing binding. It is not a deadline identifier. Both values happen to be integers, so a type check cannot detect mixing them up.

The HTTP worker owns open response handles. The timer worker waits and reports that its delay elapsed. The transition owns the board, game status, and current deadline. No worker decides whether the game may continue.

Starting a new timer does not cancel the old timer. It makes its future message obsolete by changing `LastTimerCallId`. The transition will still receive that message and deliberately ignore it. If games were removed and their identifiers reused, the model would also need a way to distinguish old and new game instances.

### Implementation

This example uses the generic HTTP and timer workers described in [the JavaScript binding documentation](nianio_pattern_in_nodejs.html). That page also records the current library's FIFO and failure-handling gaps. The code below illustrates application decisions; those decisions still require a conforming runtime.

The listing corrects a deadline-identifier error in the upstream example at commit [`31eb64e`](https://github.com/atinea-nl/nianio-pattern-js/tree/31eb64eb1d0a598daf5bea8880d7f5c7151b81a9): after a valid move, it sends the updated `LastTimerCallId` to the timer instead of the HTTP connection identifier. The review sequence below makes this distinction observable.

#### PTD types

~~~~js
import { httpWorkerCmdPtd, httpWorkerExtCmdPtdFromPayload } from '../defaultWorkers/httpWorker.js'

export const gamePtd = {
    'state': { 'ov.ptd_hash': { 'ov.ptd_rec': {
        'Board': { 'ov.ptd_ref': 'boardPtd' },
        'LastTimerCallId': { 'ov.ptd_int': null },
        'State': { 'ov.ptd_ref': 'gameStatusPtd' },
    }}},
    'cmd': { 'ov.ptd_var': {
        'HttpWorker': { 'ov.with_param': httpWorkerCmdPtd },
        'TimerWorker': { 'ov.with_param': { 'ov.ptd_ref': 'timerWorkerPtd' } },
    }},
    'extCmd': { 'ov.ptd_var': {
        'HttpWorker': { 'ov.with_param': httpWorkerExtCmdPtdFromPayload({ 'ov.ptd_var': {
            'BoardState': { 'ov.with_param': { 'ov.ptd_rec': {
                'Board': { 'ov.ptd_ref': 'boardPtd' },
                'State': { 'ov.ptd_ref': 'gameStatusPtd' },
            }}},
            'Message': {  'ov.with_param': {'ov.ptd_utf8': null } },
        }})},
        'TimerWorker': { 'ov.with_param': { 'ov.ptd_ref': 'timerWorkerPtd' } },
    }},
    'gameStatusPtd': { 'ov.ptd_var': {
        'Playing': { 'ov.no_param': null },
        'UserEnded': { 'ov.no_param': null },
        'TimeOut': { 'ov.no_param': null },
        'YouWin': { 'ov.no_param': null },
        'YouLose': { 'ov.no_param': null },
        'Tie': { 'ov.no_param': null },
    }},
    'boardPtd': { 'ov.ptd_arr': { 'ov.ptd_utf8': null } },
    'timerWorkerPtd': { 'ov.ptd_rec': {
        'GameId': { 'ov.ptd_utf8': null },
        'CallId': { 'ov.ptd_int': null },
    }},
}
~~~~

#### Transition function

`GameNianioFunction` handles one event and returns the next state with descriptions of external operations. Its helper functions organize the rules; they do not own separate application state. In particular, `handleTimerTimeOut` checks both the game's status and the deadline identifier before changing anything.

~~~js
import { parse } from 'url';

export const gameInitState = {}

export default function GameNianioFunction(state, cmd) {
    if (Object.hasOwn(cmd, 'ov.HttpWorker')) {
        if (Object.hasOwn(cmd['ov.HttpWorker'], 'ov.NewRequest')) {
            return handleNewRequest(state, cmd['ov.HttpWorker']['ov.NewRequest']);
        } else if (Object.hasOwn(cmd['ov.HttpWorker'], 'ov.ConnectinIdDoesntExist')) {
            // that will never happen in this implementation
            throw new Error(`Invalid cmd: ${cmd}`);
        } else {
            // that will never happen in this implementation
            throw new Error(`Invalid cmd: ${cmd}`);
        }
    } else if (Object.hasOwn(cmd, 'ov.TimerWorker')) {
        return handleTimerTimeOut(state, cmd['ov.TimerWorker']);
    } else {
        // that will never happen in this implementation
        throw new Error(`Invalid cmd: ${cmd}`);
    }
}

function sendMessageCmd(code, message, connectinId) {
    return { 'ov.HttpWorker': {
        'ConnectinId': connectinId,
        'StatusCode': code,
        'Payload': { 'ov.Message': message },
    }};
}

function sendBoardStateCmd(game, connectinId) {
    return { 'ov.HttpWorker': {
        'ConnectinId': connectinId,
        'StatusCode': 200,
        'Payload': { 'ov.BoardState': {
            'Board': game['Board'],
            'State': game['State'],
        }}
    }};
}

function startTimerCmd(gameId, timerCallId) {
    return { 'ov.TimerWorker': {
        'GameId': gameId,
        'CallId': timerCallId,
    }};
}

function getBoardState(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i * 3] == board[i * 3 + 1] && board[i * 3] == board[i * 3 + 2] && board[i * 3] != ' ') return board[i * 3] == 'X' ? 'ov.YouWin' : 'ov.YouLose';
    }
    for (let i = 0; i < 3; i++) {
        if (board[i] == board[i + 3] && board[i] == board[i + 6] && board[i] != ' ') return board[i] == 'X' ? 'ov.YouWin' : 'ov.YouLose';
    }
    if (board[0] == board[4] && board[0] == board[8] && board[0] != ' ') return board[0] == 'X' ? 'ov.YouWin' : 'ov.YouLose';
    if (board[2] == board[4] && board[2] == board[6] && board[2] != ' ') return board[2] == 'X' ? 'ov.YouWin' : 'ov.YouLose';
    return board.flat().some(b => b == ' ') ? 'ov.Playing' : 'ov.Tie';
}

function handleStartNewGame(state, gameId, connectinId) {
    if (Object.hasOwn(state, gameId)) {
        let message = '';
        if (Object.hasOwn(state[gameId]['State'], 'ov.Playing')) message = 'Game already started';
        else if (Object.hasOwn(state[gameId]['State'], 'ov.UserEnded')) message = 'User ended this game';
        else if (Object.hasOwn(state[gameId]['State'], 'ov.TimeOut')) message = 'Game is lost because of TimeOut';
        else if (Object.hasOwn(state[gameId]['State'], 'ov.YouWin')) message = 'You won this game';
        else if (Object.hasOwn(state[gameId]['State'], 'ov.YouLose')) message = 'You lost this game';
        else if (Object.hasOwn(state[gameId]['State'], 'ov.Tie')) message = 'Game ended with tie';
        else throw new Error(`Invalid gameState: ${state[gameId]['State']}`);

        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, message, connectinId)],
        };
    } else {
        state[gameId] = {
            'Board': [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            'State': { 'ov.Playing': null },
            'LastTimerCallId': 0,
        }
        return {
            'state': state,
            'extCmds': [
                sendMessageCmd(200, 'Game started', connectinId),
                startTimerCmd(gameId, 0),
            ],
        }
    }
}

function handleMove(state, gameId, pathSegments, connectinId) {
    if (pathSegments.length !== 3) {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Invalid move endpoint', connectinId)],
        };
    }

    const moveId = parseInt(pathSegments[2]);
    if (isNaN(moveId)) {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Invalid moveId', connectinId)],
        };
    }

    if (Object.hasOwn(state, gameId)) {
        const gameState = state[gameId]['State'];
        if (Object.hasOwn(gameState, 'ov.Playing')) {
            state[gameId]['LastTimerCallId']++;
            const board = state[gameId]['Board'];
            if (moveId < 0 || moveId > 8 || board[moveId] != ' ') {
                return {
                    'state': state,
                    'extCmds': [
                        sendMessageCmd(400, 'Invalid Move', connectinId),
                        startTimerCmd(gameId, state[gameId]['LastTimerCallId']),
                    ],
                }
            }

            board[moveId] = 'X';
            let boardState = getBoardState(board);

            if (boardState == 'ov.Playing') {
                const oponentMove = board.flat().findIndex(b => b == ' ');
                board[oponentMove] = 'O';
                boardState = getBoardState(board);
            }

            state[gameId]['Board'] = board;
            state[gameId]['State'] = {};
            state[gameId]['State'][boardState] = null;

            return {
                'state': state,
                'extCmds': [
                    sendBoardStateCmd(state[gameId], connectinId),
                    startTimerCmd(gameId, state[gameId]['LastTimerCallId']),
                ]
            }
        } else {
            return {
                'state': state,
                'extCmds': [sendBoardStateCmd(state[gameId], connectinId)]
            }
        }
    } else {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Game not started', connectinId)],
        };
    }
}

function handleEndGame(state, gameId, connectinId) {
    if (Object.hasOwn(state, gameId)) {
        const gameState = state[gameId]['State'];
        if (Object.hasOwn(gameState, 'ov.Playing')) {
            state[gameId]['State'] = { 'ov.UserEnded': null }
            return {
                'state': state,
                'extCmds': [sendMessageCmd(200, 'Game ended', connectinId)],
            };
        } else {
            return {
                'state': state,
                'extCmds': [sendMessageCmd(400, 'Game already ended', connectinId)],
            };
        }
    } else {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Game not started', connectinId)],
        };
    }
}

function handleNewRequest(state, request) {
    const connectinId = request['ConnectinId'];
    const url = request['Url'];
    const parsedUrl = parse(url || '', true);
    const pathname = parsedUrl.pathname || '';
    const pathSegments = pathname.split('/').filter(segment => segment.length > 0);

    if (pathSegments.length < 2) {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Invalid URL structure', connectinId)],
        };
    }

    const gameId = pathSegments[0];
    const action = pathSegments[1];

    if (!gameId) {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Missing gameId', connectinId)],
        };
    }

    if (action === 'start') return handleStartNewGame(state, gameId, connectinId);
    else if (action === 'move') return handleMove(state, gameId, pathSegments, connectinId);
    else if (action === 'end') return handleEndGame(state, gameId, connectinId);
    else {
        return {
            'state': state,
            'extCmds': [sendMessageCmd(400, 'Bad action', connectinId)],
        };
    }
}

function handleTimerTimeOut(state, command) {
    const callId = command['CallId'];
    const gameId = command['GameId'];
    const lastTimerCallId = state[gameId]['LastTimerCallId'];
    const gameState = state[gameId]['State'];
    if (Object.hasOwn(gameState, 'ov.Playing') && lastTimerCallId == callId) {
        state[gameId]['State'] = { 'ov.TimeOut': null };
    }
    return {
        'state': state,
        'extCmds': [],
    }
}
~~~


### Review event sequences, not just endpoints

Start from an empty state and call the transition directly with the following events. No real HTTP server or ten-second wait is needed.

| Event | Expected decision |
| --- | --- |
| Start game `g`, using HTTP connection 100. | Create a playing game and request timer `(g, 0)`. |
| Move at position 0, using HTTP connection 101. | Update the board, store deadline 1, reply on connection 101, and request timer `(g, 1)`. |
| Timer `(g, 0)` arrives. | Leave the game unchanged: this deadline is obsolete. |
| Timer `(g, 1)` arrives. | Set the game status to `TimeOut`. |
| Another move arrives. | Return the terminal board and status without changing them. |

Using connection numbers 100 and 101 is intentional. Starting both counters at zero can hide a mistaken dependency between values that mean different things.

Also test a second move before timeout, an invalid move, an explicit end followed by timeout, and two games with overlapping timer numbers. Reverse the order of a move and its current timeout and check both outcomes against the chosen rule. These are tests of application quality: each one asks whether the state and transition express an intended decision.

The [source repository](https://github.com/atinea-nl/nianio-pattern-js) contains the runnable example and worker implementations. When adapting it, review additional policies such as disconnects, game cleanup, input parsing, and retries. The explicit model gives each new requirement a place in state, messages, and transition tests.
