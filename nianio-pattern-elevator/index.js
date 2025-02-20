const numberOfFloors = 7; 

let externalButtonClickUp;
let externalButtonClickDown;
let internalButtonClick;
let sendSensorInfo;

let statePage = -1;
const states = [];

const nianioRuntime = {
    logErrorBeforeTerminationFunc: _ => { },
    scheduleNextNianioTickFunc: func => setTimeout(func, 0),
    debugPrinter: PrettyPrinter,
    deepCopy: val => JSON.parse(JSON.stringify(val)),
};

const workerFactories = {
    'ExternalButtons': ExternalButtonsWorker,
    'InternalButtons': InternalButtonsWorker,
    'Sensors': SensorsWorker,
    'ElevatorEngine': ElevatorWorker,
    'DoorsTimer': TimerWorker,
    'Init': InitWorkerGenerator(numberOfFloors),

}

// NianioStart({
//     ptd: elevatorLogicPtd,
//     initState: { 'ov.Uninit': null },
//     nianioFunc: ElevatorNianioFunc,
//     nianioRuntime: nianioRuntime,
//     workerFactories: workerFactories,
// });

NianioStartWithNl({
    ptd: elevatorLogicPtd,
    initState: nl.elevatorLogic.initState,
    nianioFunc: nl.elevatorLogic.nianioFunc,
    nianioRuntime: nianioRuntime,
    workerFactories: workerFactories,
});

function InitWorkerGenerator(floors) {
    function InitWorker(pushCmdFunc) {
        pushCmdFunc({ 'ov.InitState': { 'Floors': floors }});
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
        } else if (Object.hasOwn(extCmd, 'ov.CloseDoors')) {
            doorLeft.style.transition = `width ${animationDuration}s ease`;
            doorRight.style.transition = `width ${animationDuration}s ease`;

            doorLeft.style.width = '50%';
            doorRight.style.width = '50%';
            setTimeout(() => {
                pushCmdFunc({ 'ov.DoorsClosed': null })
            }, animationDuration * 1000)
        } else if (Object.hasOwn(extCmd, 'ov.StartMovingUp')) {
            direction = 1;
            startMoving();
        } else if (Object.hasOwn(extCmd, 'ov.StartMovingDown')) {
            direction = -1;
            startMoving();
        } else if (Object.hasOwn(extCmd, 'ov.StopMovingAtNextFloor')) {
            stopMoving();
        }
    }

    return pushExtCmdFunc;
}

function ExternalButtonsWorker(pushCmdFunc) {
    externalButtonClickUp = (floor) => {
        pushCmdFunc({ 'ov.Pressed': {
            'Floor': floor,
            'Type': { 'ov.Up': null },
        }});
    }
    externalButtonClickDown = (floor) => {
        pushCmdFunc({ 'ov.Pressed': {
            'Floor': floor,
            'Type': { 'ov.Down': null },
        }});
    }

    function pushExtCmdFunc(extCmd) {
        if (Object.hasOwn(extCmd, 'ov.TurnOn')) {
            const { Floor, Type } = extCmd['ov.TurnOn'];
            const type = Object.hasOwn(Type, 'ov.Up') ? 'up' : 'down';
            document.querySelector(`#external-button-${type}-${Floor}`).classList.add('selected-button');
        } else if (Object.hasOwn(extCmd, 'ov.TurnOff')) {
            const { Floor, Type } = extCmd['ov.TurnOff'];
            const type = Object.hasOwn(Type, 'ov.Up') ? 'up' : 'down';
            document.querySelector(`#external-button-${type}-${Floor}`).classList.remove('selected-button');
        }
    }

    return pushExtCmdFunc;
}

function InternalButtonsWorker(pushCmdFunc) {
    internalButtonClick = (floor) => {
        pushCmdFunc({ 'ov.Pressed': { 'Floor': floor } });
    }

    function pushExtCmdFunc(extCmd) {
        if (Object.hasOwn(extCmd, 'ov.TurnOn')) {
            const Floor = extCmd['ov.TurnOn']['Floor'];
            document.querySelector(`#internal-button-${Floor}`).classList.add('selected-button');
        } else if (Object.hasOwn(extCmd, 'ov.TurnOff')) {
            const Floor = extCmd['ov.TurnOff']['Floor'];
            document.querySelector(`#internal-button-${Floor}`).classList.remove('selected-button');
        }
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

function TimerWorker(pushCmdFunc) {
    function pushExtCmdFunc(extCmd) {
        if (Object.hasOwn(extCmd, 'ov.StartTimer')) {
            const CallId = extCmd['ov.StartTimer']['CallId'];

            setTimeout(() => pushCmdFunc({ 'ov.TimeOut': { 'CallId': CallId } }), 2 * 1000);
        }
    }

    return pushExtCmdFunc;
}

function PrettyPrinter(data) {
    const date = new Date().toISOString().split('T')[1].slice(0, 12);
    const index = states.length;

    states.unshift({ ...data, 'date': date });

    const stateListContainer = document.querySelector('.state-list');
    const listItem = document.createElement('div');
    listItem.dataset.index = index.toString();
    const dateElement = document.createElement('div');
    dateElement.textContent = date;
    const cmdElement = document.createElement('pre');
    cmdElement.textContent = prettyPrinter(data.cmd);
    listItem.appendChild(dateElement);
    listItem.appendChild(cmdElement);
    listItem.addEventListener('click', () => openPanel(index));
    stateListContainer.prepend(listItem);
}

function openPanel(index) {
    const { state, extCmds, date } = states[index];
    (document.querySelector('.state-detail-date')).textContent = date;
    (document.querySelector('.state-detail-state')).textContent = "State: " + prettyPrinter(state);
    (document.querySelector('.state-detail-extCmds')).textContent = "ExtCmds: " +prettyPrinter(extCmds);
    (document.getElementById('state-detail-panel')).style.display = 'block';
}

function closePanel() {
    (document.getElementById('state-detail-panel')).style.display = 'none';
}
