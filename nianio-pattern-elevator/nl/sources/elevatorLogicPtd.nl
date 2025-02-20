
use ptd;

def elevatorLogicPtd::initState() {
    return ptd::rec({
        InternalButtons => ptd::arr(ptd::bool()),
        ExternalButtons => ptd::arr(ptd::rec({
            Down => ptd::bool(),
            Up => ptd::bool(),
        })),
        Elevator => ptd::rec({
            Position => ptd::int(),
            Destination => ptd::int(),
            Doors => ptd::var({
                Open => ptd::none(),
                Opening => ptd::none(),
                Closing => ptd::none(),
                Closed => ptd::none(),
            }),
        }),
        LastDoorsTimerCallId => ptd::int(),
    });
}

def elevatorLogicPtd::state() {
    return ptd::var({
        Uninit => ptd::none(),
        Init => @elevatorLogicPtd::initState,
    });
}

def elevatorLogicPtd::cmd() {
    return ptd::var({
        InternalButtons => ptd::var({
            Pressed => ptd::rec({
                Floor => ptd::int(),
            }),
        }),
        ExternalButtons => ptd::var({
            Pressed => ptd::rec({
                Floor => ptd::int(),
                Type => @elevatorLogicPtd::varUpDown,
            }),
        }),
        Sensors => ptd::rec({
            Floor => ptd::int(),
            Velocity => ptd::int(),
        }),
        ElevatorEngine => ptd::var({
            DoorsOpened => ptd::none(),
            DoorsClosed => ptd::none(),
        }),
        DoorsTimer => ptd::var({
            TimeOut => ptd::rec({
                CallId => ptd::int(),
            }),
        }),
        Init => ptd::var({
            InitState => ptd::rec({
                Floors => ptd::int(),
            }),
        }),
    });
}

def elevatorLogicPtd::extCmd() {
    return ptd::var({
        InternalButtons => ptd::var({
            TurnOn => ptd::rec({
                Floor => ptd::int(),
            }),
            TurnOff => ptd::rec({
                Floor => ptd::int(),
            }),
        }),
        ExternalButtons => ptd::var({
            TurnOn => ptd::rec({
                Floor => ptd::int(),
                Type => @elevatorLogicPtd::varUpDown,
            }),
            TurnOff => ptd::rec({
                Floor => ptd::int(),
                Type => @elevatorLogicPtd::varUpDown,
            }),
        }),
        ElevatorEngine => ptd::var({
            OpenDoors => ptd::none(),
            CloseDoors => ptd::none(),
            StartMovingUp => ptd::none(),
            StartMovingDown => ptd::none(),
            StopMovingAtNextFloor => ptd::none(),
        }),
        DoorsTimer => ptd::var({
            StartTimer => ptd::rec({
                CallId => ptd::int(),
            }),
        }),
    });
}

def elevatorLogicPtd::extCmds() {
    return ptd::arr(@elevatorLogicPtd::extCmd);
}

def elevatorLogicPtd::varUpDown() {
    return ptd::var({
        Down => ptd::none(),
        Up => ptd::none(),
    });
}