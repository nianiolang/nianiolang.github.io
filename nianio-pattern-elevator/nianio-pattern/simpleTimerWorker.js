function simpleTimerWorkerGenerator({seconds}) {
    if (seconds == null) throw new Error('seconds == null') 
    
    function simpleTimerWorker(pushCmdFunc) {
        
        function pushExtCmdFunc(extCmd) {
            setTimeout(() => pushCmdFunc(extCmd), seconds * 1000);
        }

        return pushExtCmdFunc;
    }

    return simpleTimerWorker;
}
