function NianioStart({ ptd, nianioFunc, initState, workerFactories, nianioRuntime }) {
    let state;
    let queue;
    let isScheduled;
    let workers;

    function nianioTick() {
        try {
            while (queue.length > 0) {
                const command = queue.pop();
                const oldState = nianioRuntime['deepCopy'](state);
                const result = nianioFunc(oldState, command);
                const newState = result['state'];
                const newStateCopy = nianioRuntime['deepCopy'](newState);
                ptdEnsure(newStateCopy, 'state');
                state = newStateCopy;
                const extCmds = result['extCmds'];
                const extCmdsCopy = [];

                for (let i = 0; i < extCmds.length; i++) {
                    const extCmdCopy = nianioRuntime['deepCopy'](extCmds[i]);
                    ptdEnsure(extCmdCopy, 'extCmd');
                    extCmdsCopy.push(extCmdCopy);
                }

                for (let i = 0; i < extCmdsCopy.length; i++) {
                    const extCmd = extCmdsCopy[i];
                    executeWorkerCommand(extCmd);
                }
            }
            isScheduled = false;
        } catch (ex) {
            nianioRuntime['logErrorBeforeTerminationFunc'](ex);
            throw ex;
        }
    }

    function executeWorkerCommand(extCmd) {
        const workerName =  Object.keys(extCmd)[0].substring('ov.'.length);
        if (!Object.hasOwn(workers, workerName)) throwNianioError(`Worker ${workerName} isn't definded`);
        const extCmdValue = extCmd[`ov.${workerName}`];
        workers[workerName](extCmdValue);
    }

    function pushCmdFromWorker(workerName) {
        return (cmd) => {
            const cmdCopy = nianioRuntime['deepCopy'](cmd);
            const cmdWrappedCopy = {};
            cmdWrappedCopy[`ov.${workerName}`] = cmdCopy;
            ptdEnsure(cmdWrappedCopy, 'cmd');
            queue.push(cmdWrappedCopy);
            if (!isScheduled) {
                nianioRuntime['scheduleNextNianioTickFunc'](nianioTick);
                isScheduled = true;
            }
        };
    }

    function ptdEnsure(value, typeName) {
        if (!jsonptd.verify(value, typeName, ptd)) {
            throwNianioError(`jsonptd.verify_type error:\nPTD: ${JSON.stringify(ptd[typeName], null, 4)}\nValue: ${JSON.stringify(value, null, 4) }`)
        }
    }

    function throwNianioError(msg) {
        throw new Error(`Nianio: ${msg}`);
    }

    function validateInitParamiters() {
        if (ptd == null) throwNianioError('ptd == null');
        if (!Object.hasOwn(ptd, 'state') || ptd['state'] == null) throwNianioError('ptd doesn\'t have property state');
        if (!Object.hasOwn(ptd, 'cmd') || ptd['cmd'] == null) throwNianioError('ptd doesn\'t have property cmd');
        if (!Object.hasOwn(ptd, 'extCmd') || ptd['extCmd'] == null) throwNianioError('ptd doesn\'t have property extCmd');
        if (nianioFunc == null) throwNianioError('nianioFunc == null');
        if (initState == null) throwNianioError('initState == null');
        if (workerFactories == null) throwNianioError('workerFactories == null');
        if (nianioRuntime == null) throwNianioError('nianioRuntime == null');
        if (!Object.hasOwn(nianioRuntime, 'logErrorBeforeTerminationFunc') || nianioRuntime['logErrorBeforeTerminationFunc'] == null) throwNianioError('nianioRuntime doesn\'t have property logErrorBeforeTerminationFunc');
        if (!Object.hasOwn(nianioRuntime, 'scheduleNextNianioTickFunc') || nianioRuntime['scheduleNextNianioTickFunc'] == null) throwNianioError('nianioRuntime doesn\'t have property scheduleNextNianioTickFunc');
        if (!Object.hasOwn(nianioRuntime, 'deepCopy') || nianioRuntime['deepCopy'] == null) throwNianioError('nianioRuntime doesn\'t have property deepCopy');
    }

    function initWorkers() {
        workers = {};
        const workerNames = Object.keys(workerFactories);
        for (let i = 0; i < workerNames.length; i++) {
            const workerName = workerNames[i];
            workers[workerName] = workerFactories[workerName](pushCmdFromWorker(workerName));
        }
    }

    function initNianio() {
        validateInitParamiters();

        ptd = nianioRuntime['deepCopy'](ptd);
        queue = [];
        isScheduled = false;
        const initStateCopy = nianioRuntime['deepCopy'](initState);
        ptdEnsure(initStateCopy, 'state');
        state = initStateCopy;
        
        initWorkers();
    }

    initNianio();
}