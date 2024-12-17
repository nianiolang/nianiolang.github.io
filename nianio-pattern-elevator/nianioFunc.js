function ElevatorNianioFunc(state, cmd) {

    const result = NianioFunc(state, cmd);

    const resultCopy = JSON.parse(JSON.stringify(result));

    result['extCmds'].push({
        'ov.PrettyPrinter': {
            'cmd': cmd,
            'state': resultCopy['state'],
            'extCmds': resultCopy['extCmds'],
            'date': new Date().toISOString().split('T')[1].slice(0, 12),
        },
    })

    return result;
}

function NianioFunc(state, cmd) {
    if (Object.hasOwn(state, 'ov.Uninit')) {
        if (Object.hasOwn(cmd, 'ov.Init')) {
            return handleInit(cmd['ov.Init']);
        }
        return { 'state': state, 'extCmds': [] }
    }

    if (Object.hasOwn(cmd, 'ov.InternalButtons')) {
        return handleInternalButton(state, cmd['ov.InternalButtons']);
    } else if (Object.hasOwn(cmd, 'ov.ExternalButtons')) {
        const { Floor, Type } = cmd['ov.ExternalButtons'];
        return handleExternalButton(state, Floor, Type);
    } else if (Object.hasOwn(cmd, 'ov.Sensors')) {
        const { Floor, Velocity } = cmd['ov.Sensors'];
        return handleSensors(state, Floor, Velocity);
    } else if (Object.hasOwn(cmd, 'ov.ElevatorEngine')) {
        if (Object.hasOwn(cmd['ov.ElevatorEngine'], 'ov.DoorsOpened')) {
            return handleDoorsOpened(state);
        } else if (Object.hasOwn(cmd['ov.ElevatorEngine'], 'ov.DoorsClosed')) {
            return handleDoorsClosed(state);
        }
    } else if (Object.hasOwn(cmd, 'ov.DoorsTimer')) {
        return handleDoorsTimer(state, cmd['ov.DoorsTimer']);
    }

    return { 'state': state, 'extCmds': [] }
}

function handleInit(floors) {
    return {
        'state': { 'ov.Init': {
            'InternalButtons': Array.apply(null, Array(floors)).map(() => false),
            'ExternalButtons': Array.apply(null, Array(floors)).map(() => ({ 'Up': false, 'Down': false })),
            'Elevator': {
                'Position': 0,
                'Destination': 0,
                'Doors': { 'ov.Closed': null },
            },
            'LastDoorsTimerCallId': 0,
        }},
        'extCmds': [],
    };
}

function handleExternalButton(state, floor, type) {
    const buttonType = Object.keys(type)[0].substring(3);

    state['ov.Init']['ExternalButtons'][floor][buttonType] = true;

    if (state['ov.Init']['Elevator']['Position'] == floor && state['ov.Init']['Elevator']['Destination'] == floor) {
        if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Open')) {
            state['ov.Init']['ExternalButtons'][floor][buttonType] = false;
            return { 'state': state, 'extCmds': [] };
        }

        state['ov.Init']['Elevator']['Doors'] = { 'ov.Opening': null };

        return {
            'state': state,
            'extCmds': [
                {
                    'ov.ExternalButtons': {
                        'Floor': floor,
                        'Type': type,
                        'Action': { 'ov.TurnOn': null },
                    }
                },
                { 'ov.ElevatorEngine': { 'ov.OpenDoors': null } },
            ],
        };
    } else if (state['ov.Init']['Elevator']['Position'] == state['ov.Init']['Elevator']['Destination']) {
        state['ov.Init']['Elevator']['Destination'] = floor;
        
        if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Open')) {
            state['ov.Init']['Elevator']['Doors'] = { 'ov.Closing': null };
            return {
                'state': state,
                'extCmds': [
                    { 'ov.ElevatorEngine': { 'ov.CloseDoors': null } },
                    {
                        'ov.ExternalButtons': {
                            'Floor': floor,
                            'Type': type,
                            'Action': { 'ov.TurnOn': null },
                        }
                    }
                ]
            };
        } else if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Closed')) {
            return {
                'state': state,
                'extCmds': [
                    { 'ov.ElevatorEngine': floor > state['ov.Init']['Elevator']['Position'] ? { 'ov.StartMovingUp': null } : { 'ov.StartMovingDown': null } },
                    {
                        'ov.ExternalButtons': {
                            'Floor': floor,
                            'Type': type,
                            'Action': { 'ov.TurnOn': null },
                        }
                    }
                ]
            };
        }
    } else if ((Object.hasOwn(type, 'ov.Down') && state['ov.Init']['Elevator']['Destination'] < floor && floor < state['ov.Init']['Elevator']['Position'])
        || (Object.hasOwn(type, 'ov.Up') && state['ov.Init']['Elevator']['Destination'] > floor && floor > state['ov.Init']['Elevator']['Position'])) {
        state['ov.Init']['Elevator']['Destination'] = floor;
    }


    return {
        'state': state,
        'extCmds': [{
            'ov.ExternalButtons': {
                'Floor': floor,
                'Type': type,
                'Action': { 'ov.TurnOn': null },
            }
        }],
    };
}

function handleInternalButton(state, floor) {
    state['ov.Init']['InternalButtons'][floor] = !state['ov.Init']['InternalButtons'][floor];

    if (state['ov.Init']['InternalButtons'][floor]) {
        if (state['ov.Init']['Elevator']['Position'] == floor && state['ov.Init']['Elevator']['Destination'] == floor) {
            state['ov.Init']['InternalButtons'][floor] = false;

            if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Open')) {
                return { 'state': state, 'extCmds': [] };
            }

            state['ov.Init']['Elevator']['Doors'] = { 'ov.Opening': null };
            return {
                'state': state,
                'extCmds': [
                    { 'ov.ElevatorEngine': { 'ov.OpenDoors': null } },
                ],
            };
        } else if (state['ov.Init']['Elevator']['Position'] == state['ov.Init']['Elevator']['Destination']) {
            state['ov.Init']['Elevator']['Destination'] = floor;

            if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Open')) {
                state['ov.Init']['Elevator']['Doors'] = { 'ov.Closing': null };
                return {
                    'state': state,
                    'extCmds': [
                        { 'ov.ElevatorEngine': { 'ov.CloseDoors': null } },
                        {
                            'ov.InternalButtons': {
                                'Floor': floor,
                                'Action': state['ov.Init']['InternalButtons'][floor] ? { 'ov.TurnOn': null } : { 'ov.TurnOff': null },
                            }
                        }
                    ]
                };
            } else if (Object.hasOwn(state['ov.Init']['Elevator']['Doors'], 'ov.Closed')) {
                return {
                    'state': state,
                    'extCmds': [
                        { 'ov.ElevatorEngine': floor > state['ov.Init']['Elevator']['Position'] ? { 'ov.StartMovingUp': null } : { 'ov.StartMovingDown': null } },
                        {
                            'ov.InternalButtons': {
                                'Floor': floor,
                                'Action': state['ov.Init']['InternalButtons'][floor] ? { 'ov.TurnOn': null } : { 'ov.TurnOff': null },
                            }
                        }
                    ]
                };
            }
        } else if ((state['ov.Init']['Elevator']['Destination'] < floor && floor < state['ov.Init']['Elevator']['Position'])
                || (state['ov.Init']['Elevator']['Destination'] > floor && floor > state['ov.Init']['Elevator']['Position'])) {
            state['ov.Init']['Elevator']['Destination'] = floor;
        }
    }

    return {
        'state': state,
        'extCmds': [{
            'ov.InternalButtons': {
                'Floor': floor,
                'Action': state['ov.Init']['InternalButtons'][floor] ? { 'ov.TurnOn': null } : { 'ov.TurnOff': null },
            }
        }],
    };
}

function handleSensors(state, floor, velocity) {
    state['ov.Init']['Elevator']['Position'] = floor;

    if (velocity != 0) {
        const direction = Math.sign(velocity)
        if (state['ov.Init']['Elevator']['Destination'] == floor + (1 * direction)) {
            return {
                'state': state,
                'extCmds': [
                    { 'ov.ElevatorEngine': { 'ov.StopMoving': null } }
                ],
            }
        }
    } else {
        state['ov.Init']['Elevator']['Doors'] = { 'ov.Opening': null };

        return {
            'state': state,
            'extCmds': [
                { 'ov.ElevatorEngine': { 'ov.OpenDoors': null } },
            ],
        };
    }

    return { 'state': state, 'extCmds': [] }
}

function handleDoorsOpened(state) {
    state['ov.Init']['Elevator']['Doors'] = { 'ov.Open': null };

    state['ov.Init']['LastDoorsTimerCallId']++;

    const extCmds = [{ 'ov.DoorsTimer': state['ov.Init']['LastDoorsTimerCallId'] }];
    const floor = state['ov.Init']['Elevator']['Position'];

    if (state['ov.Init']['InternalButtons'][floor]) {
        state['ov.Init']['InternalButtons'][floor] = false;
        extCmds.push({
            'ov.InternalButtons': {
                'Floor': floor,
                'Action': { 'ov.TurnOff': null },
            }
        })
    }
    if (state['ov.Init']['ExternalButtons'][floor]['Down']) {
        state['ov.Init']['ExternalButtons'][floor]['Down'] = false;
        extCmds.push({
            'ov.ExternalButtons': {
                'Floor': floor,
                'Type': { 'ov.Down': null },
                'Action': { 'ov.TurnOff': null },
            }
        })
    }
    if (state['ov.Init']['ExternalButtons'][floor]['Up']) {
        state['ov.Init']['ExternalButtons'][floor]['Up'] = false;
        extCmds.push({
            'ov.ExternalButtons': {
                'Floor': floor,
                'Type': { 'ov.Up': null },
                'Action': { 'ov.TurnOff': null },
            }
        })
    }



    return {
        'state': state,
        'extCmds': extCmds,
    }
}

function handleDoorsClosed(state) {
    state['ov.Init']['Elevator']['Doors'] = { 'ov.Closed': null };

    if (state['ov.Init']['Elevator']['Position'] != state['ov.Init']['Elevator']['Destination']) {
        return {
            'state': state,
            'extCmds': [
                {
                    'ov.ElevatorEngine': state['ov.Init']['Elevator']['Destination'] > state['ov.Init']['Elevator']['Position']
                        ? { 'ov.StartMovingUp': null }
                        : { 'ov.StartMovingDown': null }
                }
            ]
        }
    } else if (state['ov.Init']['InternalButtons'].some(b => b) || state['ov.Init']['ExternalButtons'].some(b => b.Up || b.Down)) {
        let destination = -state['ov.Init']['InternalButtons'].length - 1;
        for (let i = 0; i < state['ov.Init']['InternalButtons'].length; i++) {
            if ((state['ov.Init']['InternalButtons'][i] || state['ov.Init']['ExternalButtons'][i]['Up'] || state['ov.Init']['ExternalButtons'][i]['Down'])
                && Math.abs(i - state['ov.Init']['Elevator']['Position']) < Math.abs(destination - state['ov.Init']['Elevator']['Position'])) {
                destination = i;
            }
        }

        state['ov.Init']['Elevator']['Destination'] = destination;

        return {
            'state': state,
            'extCmds': [
                {
                    'ov.ElevatorEngine': state['ov.Init']['Elevator']['Destination'] > state['ov.Init']['Elevator']['Position']
                        ? { 'ov.StartMovingUp': null }
                        : { 'ov.StartMovingDown': null }
                }
            ]
        }
    }

    return { 'state': state, 'extCmds': [] }
}

function handleDoorsTimer(state, doorsTimerCallId) {
    if (doorsTimerCallId == state['ov.Init']['LastDoorsTimerCallId']) {
        return {
            'state': state,
            'extCmds': [
                { 'ov.ElevatorEngine': { 'ov.CloseDoors': null } },
            ],
        };
    }

    return { 'state': state, 'extCmds': [] }
}