const ptd = {
    'state': { 'ov.ptd_var': {
        'Uninit': { 'ov.no_param': null },
        'Init': { 'ov.with_param': { 'ov.ptd_rec': {
            'InternalButtons': { 'ov.ptd_arr': { 'ov.ptd_bool': null } },
            'ExternalButtons': { 'ov.ptd_arr': { 'ov.ptd_rec': {
                'Down': { 'ov.ptd_bool': null },
                'Up': { 'ov.ptd_bool': null },
            }}},
            'Elevator': { 'ov.ptd_rec': {
                'Position': { 'ov.ptd_double': null },
                'Destination': { 'ov.ptd_int': null },
                'Doors': { 'ov.ptd_var': {
                    'Open': { 'ov.no_param': null },
                    'Opening': { 'ov.no_param': null },
                    'Closing': { 'ov.no_param': null },
                    'Closed': { 'ov.no_param': null },
                }},
            }},
            'LastDoorsTimerCallId': { 'ov.ptd_int': null }
        }}}
    }},
    'cmd': { 'ov.ptd_var': {
        'InternalButtons': { 'ov.with_param': { 'ov.ptd_int': null } },
        'ExternalButtons': { 'ov.with_param': { 'ov.ptd_rec': {
            'Floor': { 'ov.ptd_int': null },
            'Type': { 'ov.ptd_var': {
                'Down': { 'ov.no_param': null },
                'Up': { 'ov.no_param': null },
            }},
        }}},
        'Sensors': { 'ov.with_param': { 'ov.ptd_rec': {
            'Floor': { 'ov.ptd_double': null },
            'Velocity': { 'ov.ptd_double': null },
        }}},
        'ElevatorEngine': { 'ov.with_param': { 'ov.ptd_var': {
            'DoorsOpened': { 'ov.no_param': null },
            'DoorsClosed': { 'ov.no_param': null },
        }}},
        'DoorsTimer': { 'ov.with_param': { 'ov.ptd_int': null } },
        'Init': { 'ov.with_param': { 'ov.ptd_int': null } },
    }},
    'extCmd': { 'ov.ptd_var': {
        'InternalButtons': { 'ov.with_param': { 'ov.ptd_rec': { 
            'Floor': { 'ov.ptd_int': null },
            'Action': { 'ov.ptd_var': {
                'TurnOn': { 'ov.no_param': null },
                'TurnOff': { 'ov.no_param': null },
            }},
        }}},
        'ExternalButtons': { 'ov.with_param': { 'ov.ptd_rec': {
            'Floor': { 'ov.ptd_int': null },
            'Type': { 'ov.ptd_var': {
                'Down': { 'ov.no_param': null },
                'Up': { 'ov.no_param': null },
            }},
            'Action': { 'ov.ptd_var': {
                'TurnOn': { 'ov.no_param': null },
                'TurnOff': { 'ov.no_param': null },
            }},
        }}},
        'ElevatorEngine': { 'ov.with_param': { 'ov.ptd_var': {
            'OpenDoors': { 'ov.no_param': null },
            'CloseDoors': { 'ov.no_param': null },
            'StartMovingUp': { 'ov.no_param': null },
            'StartMovingDown': { 'ov.no_param': null },
            'StopMoving': { 'ov.no_param': null },
        }}},
        'PrettyPrinter': { 'ov.with_param': { 'ov.ptd_rec': {
            'cmd': { 'ov.ptd_ref': 'cmd' },
            'state': { 'ov.ptd_ref': 'state' },
            'extCmds': { 'ov.ptd_arr': { 'ov.ptd_ref': 'extCmd' } },
            'date': { 'ov.ptd_utf8': null },
        }}},
        'DoorsTimer': { 'ov.with_param': { 'ov.ptd_int': null } },
    }},
}