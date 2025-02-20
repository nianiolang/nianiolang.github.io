
function ElevatorNianioFunc(state, cmd) {
    if (Object.hasOwn(state, 'ov.Uninit')) {
        if (Object.hasOwn(cmd, 'ov.Init')) {
            if (Object.hasOwn(cmd['ov.Init'], 'ov.InitState')) {
                return handleInit(cmd['ov.Init']['ov.InitState']['Floors']);
            }
        }
    } else if (Object.hasOwn(state, 'ov.Init')) {
        if (Object.hasOwn(cmd, 'ov.InternalButtons')) {
            if (Object.hasOwn(cmd['ov.InternalButtons'], 'ov.Pressed')) {
                return handleInternalButton(state['ov.Init'], cmd['ov.InternalButtons']['ov.Pressed']['Floor']);
            }
        } else if (Object.hasOwn(cmd, 'ov.ExternalButtons')) {
            if (Object.hasOwn(cmd['ov.ExternalButtons'], 'ov.Pressed')) {
                const { Floor, Type } = cmd['ov.ExternalButtons']['ov.Pressed'];
                return handleExternalButton(state['ov.Init'], Floor, Type);
            }
        } else if (Object.hasOwn(cmd, 'ov.Sensors')) {
            const { Floor, Velocity } = cmd['ov.Sensors'];
            return handleSensors(state['ov.Init'], Floor, Velocity);
        } else if (Object.hasOwn(cmd, 'ov.ElevatorEngine')) {
            if (Object.hasOwn(cmd['ov.ElevatorEngine'], 'ov.DoorsOpened')) {
                return handleDoorsOpened(state['ov.Init']);
            } else if (Object.hasOwn(cmd['ov.ElevatorEngine'], 'ov.DoorsClosed')) {
                return handleDoorsClosed(state['ov.Init']);
            }
        } else if (Object.hasOwn(cmd, 'ov.DoorsTimer')) {
            if (Object.hasOwn(cmd['ov.DoorsTimer'], 'ov.TimeOut')) {
                return handleDoorsTimer(state['ov.Init'], cmd['ov.DoorsTimer']['ov.TimeOut']['CallId']);
            }
        }
    }
}

function handleInit(floors) {
    return {
        'state': { 'ov.Init': {
            'InternalButtons': Array.from({ length: floors }, () => false),
            'ExternalButtons': Array.from({ length: floors }, () => ({ 'Up': false, 'Down': false })),
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

function initVar(initState) {
    return { 'ov.Init': initState };
}

function handleExternalButton(initState, floor, type) {
    const buttonType = Object.keys(type)[0].substring(3);

    initState['ExternalButtons'][floor][buttonType] = true;

    if (initState['Elevator']['Position'] == floor && initState['Elevator']['Destination'] == floor) {
        if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Open')) {
            initState['ExternalButtons'][floor][buttonType] = false;
            return { 'state': initVar(initState), 'extCmds': [] };
        }

        initState['Elevator']['Doors'] = { 'ov.Opening': null };

        return {
            'state': initVar(initState),
            'extCmds': [
                {
                    'ov.ExternalButtons': { 'ov.TurnOn': {
                        'Floor': floor,
                        'Type': type,
                    }},
                },
                { 'ov.ElevatorEngine': { 'ov.OpenDoors': null } },
            ],
        };
    } else if (initState['Elevator']['Position'] == initState['Elevator']['Destination']) {
        initState['Elevator']['Destination'] = floor;
        
        if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Open')) {
            initState['Elevator']['Doors'] = { 'ov.Closing': null };
            return {
                'state': initVar(initState),
                'extCmds': [
                    { 'ov.ElevatorEngine': { 'ov.CloseDoors': null } },
                    {
                        'ov.ExternalButtons': { 'ov.TurnOn': {
                            'Floor': floor,
                            'Type': type,
                        }},
                    }
                ]
            };
        } else if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Closed')) {
            return {
                'state': initVar(initState),
                'extCmds': [
                    { 
                        'ov.ElevatorEngine': floor > initState['Elevator']['Position'] 
                            ? { 'ov.StartMovingUp': null } 
                            : { 'ov.StartMovingDown': null }
                    },
                    {
                        'ov.ExternalButtons': { 'ov.TurnOn': {
                            'Floor': floor,
                            'Type': type,
                        }},
                    }
                ]
            };
        }
    } else if ((Object.hasOwn(type, 'ov.Down') && initState['Elevator']['Destination'] < floor && floor < initState['Elevator']['Position'] - 1)
        || (Object.hasOwn(type, 'ov.Up') && initState['Elevator']['Destination'] > floor && floor > initState['Elevator']['Position']) + 1) {
        initState['Elevator']['Destination'] = floor;
    }


    return {
        'state': initVar(initState),
        'extCmds': [{ 'ov.ExternalButtons': { 'ov.TurnOn': {
            'Floor': floor,
            'Type': type,
        }}}],
    };
}

function handleInternalButton(initState, floor) {
    initState['InternalButtons'][floor] = !initState['InternalButtons'][floor];

    if (initState['InternalButtons'][floor]) {
        if (initState['Elevator']['Position'] == floor && initState['Elevator']['Destination'] == floor) {
            initState['InternalButtons'][floor] = false;

            if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Open')) {
                return { 'state': initVar(initState), 'extCmds': [] };
            }

            initState['Elevator']['Doors'] = { 'ov.Opening': null };
            return {
                'state': initVar(initState),
                'extCmds': [ { 'ov.ElevatorEngine': { 'ov.OpenDoors': null }}],
            };
        } else if (initState['Elevator']['Position'] == initState['Elevator']['Destination']) {
            initState['Elevator']['Destination'] = floor;

            if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Open')) {
                initState['Elevator']['Doors'] = { 'ov.Closing': null };
                return {
                    'state': initVar(initState),
                    'extCmds': [
                        { 'ov.ElevatorEngine': { 'ov.CloseDoors': null } },
                        {
                            'ov.InternalButtons': initState['InternalButtons'][floor] 
                                ? { 'ov.TurnOn': { 'Floor': floor } } 
                                : { 'ov.TurnOff': { 'Floor': floor } },
                        }
                    ]
                };
            } else if (Object.hasOwn(initState['Elevator']['Doors'], 'ov.Closed')) {
                return {
                    'state': initVar(initState),
                    'extCmds': [
                        { 
                            'ov.ElevatorEngine': floor > initState['Elevator']['Position'] 
                                ? { 'ov.StartMovingUp': null } 
                                : { 'ov.StartMovingDown': null }
                        },
                        {
                            'ov.InternalButtons': initState['InternalButtons'][floor]
                                ? { 'ov.TurnOn': { 'Floor': floor } }
                                : { 'ov.TurnOff': { 'Floor': floor } },
                        }
                    ]
                };
            }
        } else if ((initState['Elevator']['Destination'] < floor && floor < initState['Elevator']['Position'] - 1)
                || (initState['Elevator']['Destination'] > floor && floor > initState['Elevator']['Position'] + 1)) {
            initState['Elevator']['Destination'] = floor;
        }
    }

    return {
        'state': initVar(initState),
        'extCmds': [{
            'ov.InternalButtons': initState['InternalButtons'][floor]
                ? { 'ov.TurnOn': { 'Floor': floor } }
                : { 'ov.TurnOff': { 'Floor': floor } },
        }],
    };
}

function handleSensors(initState, floor, velocity) {
    initState['Elevator']['Position'] = floor;

    if (velocity != 0) {
        const direction = Math.sign(velocity)
        if (initState['Elevator']['Destination'] == floor + (1 * direction)) {
            return {
                'state': initVar(initState),
                'extCmds': [{ 'ov.ElevatorEngine': { 'ov.StopMovingAtNextFloor': null }}],
            }
        }
    } else {
        initState['Elevator']['Doors'] = { 'ov.Opening': null };

        return {
            'state': initVar(initState),
            'extCmds': [{ 'ov.ElevatorEngine': { 'ov.OpenDoors': null }}],
        };
    }

    return { 'state': initVar(initState), 'extCmds': [] }
}

function handleDoorsOpened(initState) {
    initState['Elevator']['Doors'] = { 'ov.Open': null };

    initState['LastDoorsTimerCallId']++;

    const extCmds = [{ 'ov.DoorsTimer': { 'ov.StartTimer': { 'CallId': initState['LastDoorsTimerCallId'] }}}];
    const floor = initState['Elevator']['Position'];

    if (initState['InternalButtons'][floor]) {
        initState['InternalButtons'][floor] = false;
        extCmds.push({ 'ov.InternalButtons': { 'ov.TurnOff': { 'Floor': floor} }});
    }
    if (initState['ExternalButtons'][floor]['Down']) {
        initState['ExternalButtons'][floor]['Down'] = false;
        extCmds.push({'ov.ExternalButtons': { 'ov.TurnOff': {
            'Floor': floor,
            'Type': { 'ov.Down': null },
        }}});
    }
    if (initState['ExternalButtons'][floor]['Up']) {
        initState['ExternalButtons'][floor]['Up'] = false;
        extCmds.push({'ov.ExternalButtons': { 'ov.TurnOff': {
            'Floor': floor,
            'Type': { 'ov.Up': null },
        }}});
    }

    return { 'state': initVar(initState), 'extCmds': extCmds };
}

function handleDoorsClosed(initState) {
    initState['Elevator']['Doors'] = { 'ov.Closed': null };

    if (initState['Elevator']['Position'] != initState['Elevator']['Destination']) {
        return {
            'state': initVar(initState),
            'extCmds': [
                {
                    'ov.ElevatorEngine': initState['Elevator']['Destination'] > initState['Elevator']['Position']
                        ? { 'ov.StartMovingUp': null }
                        : { 'ov.StartMovingDown': null }
                }
            ]
        }
    } else if (initState['InternalButtons'].some(b => b) || initState['ExternalButtons'].some(b => b.Up || b.Down)) {
        let destination = -initState['InternalButtons'].length - 1;
        for (let i = 0; i < initState['InternalButtons'].length; i++) {
            if ((initState['InternalButtons'][i] || initState['ExternalButtons'][i]['Up'] || initState['ExternalButtons'][i]['Down'])
                && Math.abs(i - initState['Elevator']['Position']) < Math.abs(destination - initState['Elevator']['Position'])) {
                destination = i;
            }
        }

        initState['Elevator']['Destination'] = destination;

        return {
            'state': initVar(initState),
            'extCmds': [
                {
                    'ov.ElevatorEngine': initState['Elevator']['Destination'] > initState['Elevator']['Position']
                        ? { 'ov.StartMovingUp': null }
                        : { 'ov.StartMovingDown': null }
                }
            ]
        }
    }

    return { 'state': initVar(initState), 'extCmds': [] }
}

function handleDoorsTimer(initState, doorsTimerCallId) {
    if (doorsTimerCallId == initState['LastDoorsTimerCallId']) {
        return {
            'state': initVar(initState),
            'extCmds': [ { 'ov.ElevatorEngine': { 'ov.CloseDoors': null }}],
        };
    }

    return { 'state': initVar(initState), 'extCmds': [] };
}