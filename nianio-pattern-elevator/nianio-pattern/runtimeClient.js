
const runtimeClient = {
    logErrorBeforeTerminationFunc: (ex) => console.error(JSON.stringify(ex, null, 4)),
    scheduleNextNianioTickFunc: (func) => setTimeout(func, 0),
    deepCopy: (obj) => JSON.parse(JSON.stringify(obj)),
}