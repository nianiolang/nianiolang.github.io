
use array;
use elevatorLogicPtd;
use ptd;

def elevatorLogic::nianioFunc(ref state : @elevatorLogicPtd::state, cmd : @elevatorLogicPtd::cmd, ref extCmds : @elevatorLogicPtd::extCmds
) {
    match (state) case :Uninit {
        match (cmd) case :Init(var initCmd) {
            match (initCmd) case :InitState(var param) {
                initState(ref state, param->Floors, ref extCmds);
            }
        } case :InternalButtons(var intButton) {
        } case :ExternalButtons(var extButton) {
        } case :Sensors(var sensorData) {
        } case :ElevatorEngine(var engineCommand) {
        } case :DoorsTimer(var timer) {
        }
    } case :Init(var initState) {
        match (cmd) case :Init(var initCmd) {
        } case :InternalButtons(var intButton) {
            match (intButton) case :Pressed(var param) {
                handleInternalButton(ref initState, param->Floor, ref extCmds);
            }
        } case :ExternalButtons(var extButton) {
            match (extButton) case :Pressed(var param) {
                handleExternalButton(ref initState, param->Floor, param->Type, ref extCmds);
            }
        } case :Sensors(var sensorData) {
            handleSensors(ref initState, sensorData->Floor, sensorData->Velocity, ref extCmds);
        } case :ElevatorEngine(var engineCommand) {
            match (engineCommand) case :DoorsOpened {
                handleDoorsOpened(ref initState, ref extCmds);
            } case :DoorsClosed {
                handleDoorsClosed(ref initState, ref extCmds);
            }
        } case :DoorsTimer(var timer) {
            match (timer) case :TimeOut(var param) {
                handleDoorsTimer(ref initState, param->CallId, ref extCmds);
            }
        }
        state = :Init(initState);
    }
}

def initState(ref state : @elevatorLogicPtd::state, numberOfFloors : ptd::int(), ref extCmds : @elevatorLogicPtd::extCmds) {
    var internalButtons = [];
    var ixternalButtons = [];
    for(var i = 0; i < numberOfFloors; ++i) {
        internalButtons []= false;
        ixternalButtons []= { Up => false, Down => false };
    }
    
    state = :Init({
        InternalButtons => internalButtons,
        ExternalButtons => ixternalButtons,
        Elevator => {
            Position => 0,
            Destination => 0,
            Doors => :Closed,
        },
        LastDoorsTimerCallId => 0,
    });
}

def handleInternalButton(ref initState : @elevatorLogicPtd::initState, floor : ptd::int(), ref extCmds : @elevatorLogicPtd::extCmds) {
    initState->InternalButtons[floor] = !initState->InternalButtons[floor];

    if (initState->InternalButtons[floor]) {
        if (initState->Elevator->Position == floor && initState->Elevator->Destination == floor) {
            initState->InternalButtons[floor] = false;

            if (initState->Elevator->Doors is :Open) {
                return;
            }

            initState->Elevator->Doors = :Opening;
            extCmds = [:ElevatorEngine(:OpenDoors)];

            return;
        } elsif (initState->Elevator->Position == initState->Elevator->Destination) {
            initState->Elevator->Destination = floor;

            var action = :TurnOff({ Floor => floor });
            if (initState->InternalButtons[floor]) {
                action = :TurnOn({ Floor => floor });
            }

            if (initState->Elevator->Doors is :Open) {
                initState->Elevator->Doors = :Closing;
                extCmds = [
                    :ElevatorEngine(:CloseDoors),
                    :InternalButtons(action)
                ];
                return;
            } elsif (initState->Elevator->Doors is :Closed) {
                var direction = :StartMovingDown;
                if (floor > initState->Elevator->Position) {
                    direction = :StartMovingUp;
                }
                extCmds = [
                    :ElevatorEngine(direction),
                    :InternalButtons(action)
                ];
                return;
            }
        } elsif ((initState->Elevator->Destination < floor && floor < initState->Elevator->Position - 1)
                || (initState->Elevator->Destination > floor && floor > initState->Elevator->Position + 1)) {
            initState->Elevator->Destination = floor;
        }
    }

    
    var action = :TurnOff({ Floor => floor });
    if (initState->InternalButtons[floor]) {
        action = :TurnOn({ Floor => floor });
    }
    
    extCmds []= :InternalButtons(action);
}

def handleExternalButton(ref initState : @elevatorLogicPtd::initState, floor : ptd::int(), type : @elevatorLogicPtd::varUpDown, ref extCmds : @elevatorLogicPtd::extCmds) {
    if (type is :Up) {
        initState->ExternalButtons[floor]->Up = true;
    } elsif (type is :Down) {
        initState->ExternalButtons[floor]->Down = true;
    }
    

    if (initState->Elevator->Position == floor && initState->Elevator->Destination == floor) {
        
        if (initState->Elevator->Doors is :Open) {
            if (type is :Up) {
                initState->ExternalButtons[floor]->Up = false;
            } elsif (type is :Down) {
                initState->ExternalButtons[floor]->Down = false;
            }
            return;
        }

        initState->Elevator->Doors = :Opening;

        extCmds []= :ExternalButtons(:TurnOn({
            Floor => floor,
            Type => type,
        }));
        extCmds []= :ElevatorEngine(:OpenDoors);
        return;
    } elsif (initState->Elevator->Position == initState->Elevator->Destination) {
        initState->Elevator->Destination = floor;
        
        if (initState->Elevator->Doors is :Open) {
            initState->Elevator->Doors = :Closing;
            extCmds []= :ExternalButtons(:TurnOn({
                Floor => floor,
                Type => type,
            }));
            extCmds []= :ElevatorEngine(:CloseDoors);
            return;
        } elsif (initState->Elevator->Doors is :Closed) {
            var direction = :StartMovingDown;
            if (floor > initState->Elevator->Position) {
                direction = :StartMovingUp;
            }

            extCmds []= :ElevatorEngine(direction);
            extCmds []= :ExternalButtons(:TurnOn({
                Floor => floor,
                Type => type,
            }));
            return;
        }
    } elsif ((type is :Down && initState->Elevator->Destination < floor && floor < initState->Elevator->Position - 1)
        || (type is :Up && initState->Elevator->Destination > floor && floor > initState->Elevator->Position + 1)) {
        initState->Elevator->Destination = floor;
    }

    extCmds []= :ExternalButtons(:TurnOn({
        Floor => floor,
        Type => type,
    }));
}

def handleSensors(ref initState : @elevatorLogicPtd::initState, floor : ptd::int(), velocity : ptd::int(), ref extCmds : @elevatorLogicPtd::extCmds) {
    initState->Elevator->Position = floor;

    if (velocity == 0) {
        initState->Elevator->Doors = :Opening;
        extCmds []= :ElevatorEngine(:OpenDoors);
        return;
    }

    var direction = 0;
    if (velocity > 0) { direction = 1; }
    elsif (velocity < 0) { direction = -1; }

    if (initState->Elevator->Destination == floor + (1 * direction)) {
        extCmds []= :ElevatorEngine(:StopMovingAtNextFloor);
    }
}

def handleDoorsOpened(ref initState : @elevatorLogicPtd::initState, ref extCmds : @elevatorLogicPtd::extCmds) {
    initState->Elevator->Doors = :Open;

    initState->LastDoorsTimerCallId++;

    extCmds []= :DoorsTimer(:StartTimer({
        CallId => initState->LastDoorsTimerCallId,
    }));
    var floor = initState->Elevator->Position;

    if (initState->InternalButtons[floor]) {
        initState->InternalButtons[floor] = false;
        extCmds []= :InternalButtons(:TurnOff({ Floor => floor }));
    }
    if (initState->ExternalButtons[floor]->Down) {
        initState->ExternalButtons[floor]->Down = false;
        extCmds []= :ExternalButtons(:TurnOff({
            Floor => floor,
            Type => :Down,
        }));
    }
    if (initState->ExternalButtons[floor]->Up) {
        initState->ExternalButtons[floor]->Up = false;
        extCmds []= :ExternalButtons(:TurnOff({
            Floor => floor,
            Type => :Up,
        }));
    }
}

def handleDoorsClosed(ref initState : @elevatorLogicPtd::initState, ref extCmds : @elevatorLogicPtd::extCmds) {
    initState->Elevator->Doors = :Closed;

    if (initState->Elevator->Position != initState->Elevator->Destination) {
        var dir = :StartMovingDown;
        if (initState->Elevator->Destination > initState->Elevator->Position) {
            dir = :StartMovingUp;
        }

        extCmds []= :ElevatorEngine(dir);
        return;
    }

    var destination = -array::len(initState->InternalButtons) - 1;

    for (var i = 0; i < array::len(initState->InternalButtons); i++) {
        if ((initState->InternalButtons[i] || initState->ExternalButtons[i]->Up || initState->ExternalButtons[i]->Down)
            && abs(i - initState->Elevator->Position) < abs(destination - initState->Elevator->Position)) {
            destination = i;
        }
    }

    if (destination != -array::len(initState->InternalButtons) - 1) {
        initState->Elevator->Destination = destination;
        
        var dir = :StartMovingDown;
        if (initState->Elevator->Destination > initState->Elevator->Position) {
            dir = :StartMovingUp;
        }

        extCmds []= :ElevatorEngine(dir);
    }
}

def handleDoorsTimer(ref initState : @elevatorLogicPtd::initState, doorsTimerCallId : ptd::int(), ref extCmds : @elevatorLogicPtd::extCmds) {
    if (doorsTimerCallId == initState->LastDoorsTimerCallId) {
        extCmds []= :ElevatorEngine(:CloseDoors);
    }
}

def abs(num : ptd::int()) : ptd::int() {
    return num >= 0 ? num : -num;
}

def elevatorLogic::initState() : @elevatorLogicPtd::state {
    return :Uninit;
}