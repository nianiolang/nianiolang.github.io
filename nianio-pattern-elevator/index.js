const numberOfFloors = 7; 

let externalButtonClickUp;
let externalButtonClickDown;
let internalButtonClick;
let sendSensorInfo;

let statePage = -1;
const states = [];

NianioStart({
    ptd: ptd,
    initState: { 'ov.Uninit': null },
    nianioFunc: ElevatorNianioFunc,
    nianioRuntime: runtimeClient,
    workerFactories: {
        'ExternalButtons': ExternalButtonsWorker,
        'InternalButtons': InternalButtonsWorker,
        'Sensors': SensorsWorker,   
        'ElevatorEngine': ElevatorWorker,
        'PrettyPrinter': PrettyPrinterWorker,
        'DoorsTimer': simpleTimerWorkerGenerator({ seconds: 2 }),
        'Init': InitWorkerGenerator(numberOfFloors),
    }
});

function InitWorkerGenerator(floors) {
    function InitWorker(pushCmdFunc) {
        pushCmdFunc(floors);

        return null;
    }

    return InitWorker;
}

function ElevatorWorker(pushCmdFunc) {
    const elevator = document.querySelector('.elevator');
    const doorLeft = document.querySelector('.left-door');
    const doorRight = document.querySelector('.right-door');
    const animationDuration = 1;
    let currentY = 0;
    let direction = 1;

    function sensorInfo(velocity) {
        if (currentY / 40 % 2 == 0) 
        sendSensorInfo(-1 * currentY / 80, velocity * direction);
    }

    function startMoving() {
        sensorInfo(10);
        elevator.addEventListener('transitionend', move);
        elevator.style.transition = `transform ${animationDuration}s ease-in`;
        elevator.style.transform = `translateY(${currentY - (40 * direction)}px)`;
    }

    function move(event) {
        if (event.propertyName !== 'transform' | event.target !== elevator) return;
        currentY -= (40 * direction);
        sensorInfo(100);
        elevator.style.transition = `transform ${animationDuration / 2}s linear`;
        elevator.style.transform = `translateY(${currentY - (40 * direction)}px)`;
    }

    function stopMoving() {
        elevator.removeEventListener('transitionend', move);
        elevator.addEventListener('transitionend', endMoving);
    }

    function endMoving(event) {
        if (event.propertyName !== 'transform' | event.target !== elevator) return;
        elevator.removeEventListener('transitionend', endMoving);
        elevator.addEventListener('transitionend', stopped);
        currentY -= (40 * direction);
        sensorInfo(10);
        elevator.style.transition = `transform ${animationDuration}s ease-out`;
        elevator.style.transform = `translateY(${currentY - (40 * direction)}px)`;
    }

    function stopped(event) {
        if (event.propertyName !== 'transform' | event.target !== elevator) return;
        elevator.removeEventListener('transitionend', stopped);
        currentY -= (40 * direction);
        sensorInfo(0);
    }

    function pushExtCmdFunc(extCmd) {
        if (Object.hasOwn(extCmd, 'ov.OpenDoors')) {
            doorLeft.style.transition = `width ${animationDuration}s ease`;
            doorRight.style.transition = `width ${animationDuration}s ease`;

            doorLeft.style.width = '0%';
            doorRight.style.width = '0%';
            setTimeout(() => {
                pushCmdFunc({ 'ov.DoorsOpened': null })
            }, animationDuration * 1000)
        }
        else if (Object.hasOwn(extCmd, 'ov.CloseDoors')) {
            doorLeft.style.transition = `width ${animationDuration}s ease`;
            doorRight.style.transition = `width ${animationDuration}s ease`;

            doorLeft.style.width = '50%';
            doorRight.style.width = '50%';
            setTimeout(() => {
                pushCmdFunc({ 'ov.DoorsClosed': null })
            }, animationDuration * 1000)
        }
        else if (Object.hasOwn(extCmd, 'ov.StartMovingUp')) {
            direction = 1;
            startMoving();
        }
        else if (Object.hasOwn(extCmd, 'ov.StartMovingDown')) {
            direction = -1;
            startMoving();
        }
        else if (Object.hasOwn(extCmd, 'ov.StopMoving')) {
            stopMoving();
        }
    }

    return pushExtCmdFunc;
}

function ExternalButtonsWorker(pushCmdFunc) {
    externalButtonClickUp = (floor) => {
        pushCmdFunc({
            'Floor': floor,
            'Type': { 'ov.Up': null },
        })
    }
    externalButtonClickDown = (floor) => {
        pushCmdFunc({
            'Floor': floor,
            'Type': { 'ov.Down': null },
        })
    }

    function pushExtCmdFunc(extCmd) {
        const { Floor, Type, Action } = extCmd;
        const type = Object.hasOwn(Type, 'ov.Up') ? 'up': 'down';

        const button = document.querySelector(`#external-button-${type}-${Floor}`);

        if (Object.hasOwn(Action, 'ov.TurnOff')) button.classList.remove('selected-button');
        if (Object.hasOwn(Action, 'ov.TurnOn')) button.classList.add('selected-button');
    }

    return pushExtCmdFunc;
}

function InternalButtonsWorker(pushCmdFunc) {
    internalButtonClick = (floor) => {
        pushCmdFunc(floor);
    }

    function pushExtCmdFunc(extCmd) {
        const { Floor, Action } = extCmd;

        const button = document.querySelector(`#internal-button-${Floor}`);

        if (Object.hasOwn(Action, 'ov.TurnOff')) button.classList.remove('selected-button');
        if (Object.hasOwn(Action, 'ov.TurnOn')) button.classList.add('selected-button');
    }

    return pushExtCmdFunc;
}

function SensorsWorker(pushCmdFunc) {
    sendSensorInfo = (floor, velocity) => {
        pushCmdFunc({
            'Floor': floor,
            'Velocity': velocity,
        })
    }
}

function PrettyPrinterWorker(pushCmdFunc) {

    function pushExtCmdFunc(extCmd) {
        states.push(extCmd);
        if (statePage == states.length - 2) {
            statePage = states.length - 1;
            updateStatePage();
        }
    }

    return pushExtCmdFunc;
}

function updateStatePage() {
    const { cmd, state, extCmds, date } = states[statePage];

    const statePageNumber = document.querySelector('#state-page-number');
    statePageNumber.textContent = statePage;

    const ptdValueCmd = document.querySelector('.ptd-value-cmd');
    ptdValueCmd.textContent = prettyPrinter(cmd);

    const ptdValueState = document.querySelector('.ptd-value-state');
    ptdValueState.textContent = prettyPrinter(state);

    const ptdValueExtCmds = document.querySelector('.ptd-value-extCmds');
    ptdValueExtCmds.textContent = prettyPrinter(extCmds);

    const ptdValueDate = document.querySelector('.ptd-value-date');
    ptdValueDate.textContent = date;
}

function nextStatePage() {
    statePage = Math.min(++statePage, states.length - 1);
    updateStatePage();
}

function previewStatePage() {
    statePage = Math.max(--statePage, 0);
    updateStatePage();
}