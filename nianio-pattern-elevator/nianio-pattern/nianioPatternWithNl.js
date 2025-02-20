function NianioStartWithNl({ ptd, nianioFunc, initState, workerFactories, nianioRuntime }) {
    let state;
    let queue;
    let isScheduled;
    let workers;

    const extCmdsPtd = { 'ov.ptd_arr': ptd['extCmd'] }

    function nianioTick() {
        try {
            while (queue.length > 0) {
                const cmd = queue.pop();

                const wrappedState = nl.c_rt_lib.ov_mk_arg(nl.imm_str("label1"), state);
                const wrappedExtCmds = nl.c_rt_lib.ov_mk_arg(nl.imm_str("label1"), nl.json_to_imm([], extCmdsPtd, ptd));
                nianioFunc(wrappedState, cmd, wrappedExtCmds);
                state = wrappedState.value;
                const extCmds = wrappedExtCmds.value;

                const extCmdsJson = nl.imm_to_json(extCmds, extCmdsPtd, ptd);

                if (nianioRuntime['debugPrinter']) {
                    const stateJson = nl.imm_to_json(state, ptd['state'], ptd);

                    nianioRuntime['debugPrinter']({
                        'cmd': nl.imm_to_json(cmd, ptd['cmd'], ptd),
                        'state': stateJson,
                        'extCmds': extCmdsJson,
                    });
                }

                for (let i = 0; i < extCmdsJson.length; i++) {
                    const extCmd = extCmdsJson[i];
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
            const cmdWrapped = {};
            cmdWrapped[`ov.${workerName}`] = cmd;
            const cmdWrappedImm = nl.json_to_imm(cmdWrapped, ptd['cmd'], ptd);
            queue.push(cmdWrappedImm);
            if (!isScheduled) {
                nianioRuntime['scheduleNextNianioTickFunc'](nianioTick);
                isScheduled = true;
            }
        };
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

        ptd = JSON.parse(JSON.stringify(ptd)); // deepCopy of ptd
        queue = [];
        isScheduled = false;

        const initStateImm = initState();
        _ = nl.imm_to_json(initStateImm, ptd['state'], ptd); // walidacja
        state = initStateImm;

        initWorkers();
    }

    initNianio();
}