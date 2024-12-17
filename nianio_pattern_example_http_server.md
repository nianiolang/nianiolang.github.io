---
layout: default
title: Nianio Pattern example
---

## Nianio Pattern Example 

The example presents a http server with a simple game of tic-tac-toe. 

Game is played through these endpoints:
- `/[gameId]/start` - start the game.
- `/[gameId]/move/[moveId]` - making a move - required parameter 'move' with number 0-8
- `/[gameId]/end` - ending the game

In order to present asynchronicity during the game, a 10-second timer is started after the game starts, which, when finished, ends the game and blocks the possibility of further moves. Each move starts a new timer and invalidates the previous ones.

### Implementation

This example uses the generic httpWorker and simpleTimerWorker defined in the nianio-pattern-js library.

##### Ptd types:

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

##### NianioFunction
The GameNianioFunction implementation is an example of how to create a `NianioFunc` and how to extract objects with the variant type. 

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

function startTimerCmd(gameId, connectinId) {
    return { 'ov.TimerWorker': {
        'GameId': gameId,
        'CallId': connectinId,
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
                    startTimerCmd(gameId, connectinId),
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


Full example and documentation available on GitHub [nianio-pattern-js](https://github.com/atinea-nl/nianio-pattern-js)