var nl;
(function(n , undefined) {
n.elevatorLogicPtd={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.elevatorLogicPtd.initState=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var im18=null;
var im19=null;
var label=null;
while (1) { switch (label) {
default:
//line 6
im3=n.ptd.bool();
//line 6
im2=n.ptd.arr(im3);
//line 6
im3=null;
//line 8
im7=n.ptd.bool();
//line 9
im8=n.ptd.bool();
//line 9
im6=n.imm_hash({"Down":im7,"Up":im8,});
//line 9
im7=null;
//line 9
im8=null;
//line 9
im5=n.ptd.rec(im6);
//line 9
im6=null;
//line 9
im4=n.ptd.arr(im5);
//line 9
im5=null;
//line 12
im11=n.ptd.int();
//line 13
im12=n.ptd.int();
//line 15
im15=n.ptd.none();
//line 16
im16=n.ptd.none();
//line 17
im17=n.ptd.none();
//line 18
im18=n.ptd.none();
//line 18
im14=n.imm_hash({"Open":im15,"Opening":im16,"Closing":im17,"Closed":im18,});
//line 18
im15=null;
//line 18
im16=null;
//line 18
im17=null;
//line 18
im18=null;
//line 18
im13=n.ptd.var(im14);
//line 18
im14=null;
//line 18
im10=n.imm_hash({"Position":im11,"Destination":im12,"Doors":im13,});
//line 18
im11=null;
//line 18
im12=null;
//line 18
im13=null;
//line 18
im9=n.ptd.rec(im10);
//line 18
im10=null;
//line 21
im19=n.ptd.int();
//line 21
im1=n.imm_hash({"InternalButtons":im2,"ExternalButtons":im4,"Elevator":im9,"LastDoorsTimerCallId":im19,});
//line 21
im2=null;
//line 21
im4=null;
//line 21
im9=null;
//line 21
im19=null;
//line 21
im0=n.ptd.rec(im1);
//line 21
im1=null;
//line 21
return im0;
//line 21
im0=null;
//line 21
return null;
}}}

n.elevatorLogicPtd.__dyn_initState=function(arr) {
var ret = n.elevatorLogicPtd.initState()
return ret;
}

n.elevatorLogicPtd.state=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 27
im2=n.ptd.none();
//line 28
im3=n.imm_hash({"module":n.imm_str("elevatorLogicPtd"),"name":n.imm_str("initState"),});
//line 28
im3=n.c_rt_lib.ov_mk_arg(c[0],im3);;
//line 28
im1=n.imm_hash({"Uninit":im2,"Init":im3,});
//line 28
im2=null;
//line 28
im3=null;
//line 28
im0=n.ptd.var(im1);
//line 28
im1=null;
//line 28
return im0;
//line 28
im0=null;
//line 28
return null;
}}}

n.elevatorLogicPtd.__dyn_state=function(arr) {
var ret = n.elevatorLogicPtd.state()
return ret;
}

n.elevatorLogicPtd.cmd=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var im18=null;
var im19=null;
var im20=null;
var im21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var label=null;
while (1) { switch (label) {
default:
//line 36
im6=n.ptd.int();
//line 36
im5=n.imm_hash({"Floor":im6,});
//line 36
im6=null;
//line 36
im4=n.ptd.rec(im5);
//line 36
im5=null;
//line 36
im3=n.imm_hash({"Pressed":im4,});
//line 36
im4=null;
//line 36
im2=n.ptd.var(im3);
//line 36
im3=null;
//line 41
im11=n.ptd.int();
//line 42
im12=n.imm_hash({"module":n.imm_str("elevatorLogicPtd"),"name":n.imm_str("varUpDown"),});
//line 42
im12=n.c_rt_lib.ov_mk_arg(c[0],im12);;
//line 42
im10=n.imm_hash({"Floor":im11,"Type":im12,});
//line 42
im11=null;
//line 42
im12=null;
//line 42
im9=n.ptd.rec(im10);
//line 42
im10=null;
//line 42
im8=n.imm_hash({"Pressed":im9,});
//line 42
im9=null;
//line 42
im7=n.ptd.var(im8);
//line 42
im8=null;
//line 46
im15=n.ptd.int();
//line 47
im16=n.ptd.int();
//line 47
im14=n.imm_hash({"Floor":im15,"Velocity":im16,});
//line 47
im15=null;
//line 47
im16=null;
//line 47
im13=n.ptd.rec(im14);
//line 47
im14=null;
//line 50
im19=n.ptd.none();
//line 51
im20=n.ptd.none();
//line 51
im18=n.imm_hash({"DoorsOpened":im19,"DoorsClosed":im20,});
//line 51
im19=null;
//line 51
im20=null;
//line 51
im17=n.ptd.var(im18);
//line 51
im18=null;
//line 55
im25=n.ptd.int();
//line 55
im24=n.imm_hash({"CallId":im25,});
//line 55
im25=null;
//line 55
im23=n.ptd.rec(im24);
//line 55
im24=null;
//line 55
im22=n.imm_hash({"TimeOut":im23,});
//line 55
im23=null;
//line 55
im21=n.ptd.var(im22);
//line 55
im22=null;
//line 60
im30=n.ptd.int();
//line 60
im29=n.imm_hash({"Floors":im30,});
//line 60
im30=null;
//line 60
im28=n.ptd.rec(im29);
//line 60
im29=null;
//line 60
im27=n.imm_hash({"InitState":im28,});
//line 60
im28=null;
//line 60
im26=n.ptd.var(im27);
//line 60
im27=null;
//line 60
im1=n.imm_hash({"InternalButtons":im2,"ExternalButtons":im7,"Sensors":im13,"ElevatorEngine":im17,"DoorsTimer":im21,"Init":im26,});
//line 60
im2=null;
//line 60
im7=null;
//line 60
im13=null;
//line 60
im17=null;
//line 60
im21=null;
//line 60
im26=null;
//line 60
im0=n.ptd.var(im1);
//line 60
im1=null;
//line 60
return im0;
//line 60
im0=null;
//line 60
return null;
}}}

n.elevatorLogicPtd.__dyn_cmd=function(arr) {
var ret = n.elevatorLogicPtd.cmd()
return ret;
}

n.elevatorLogicPtd.extCmd=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var im18=null;
var im19=null;
var im20=null;
var im21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var im31=null;
var label=null;
while (1) { switch (label) {
default:
//line 70
im6=n.ptd.int();
//line 70
im5=n.imm_hash({"Floor":im6,});
//line 70
im6=null;
//line 70
im4=n.ptd.rec(im5);
//line 70
im5=null;
//line 73
im9=n.ptd.int();
//line 73
im8=n.imm_hash({"Floor":im9,});
//line 73
im9=null;
//line 73
im7=n.ptd.rec(im8);
//line 73
im8=null;
//line 73
im3=n.imm_hash({"TurnOn":im4,"TurnOff":im7,});
//line 73
im4=null;
//line 73
im7=null;
//line 73
im2=n.ptd.var(im3);
//line 73
im3=null;
//line 78
im14=n.ptd.int();
//line 79
im15=n.imm_hash({"module":n.imm_str("elevatorLogicPtd"),"name":n.imm_str("varUpDown"),});
//line 79
im15=n.c_rt_lib.ov_mk_arg(c[0],im15);;
//line 79
im13=n.imm_hash({"Floor":im14,"Type":im15,});
//line 79
im14=null;
//line 79
im15=null;
//line 79
im12=n.ptd.rec(im13);
//line 79
im13=null;
//line 82
im18=n.ptd.int();
//line 83
im19=n.imm_hash({"module":n.imm_str("elevatorLogicPtd"),"name":n.imm_str("varUpDown"),});
//line 83
im19=n.c_rt_lib.ov_mk_arg(c[0],im19);;
//line 83
im17=n.imm_hash({"Floor":im18,"Type":im19,});
//line 83
im18=null;
//line 83
im19=null;
//line 83
im16=n.ptd.rec(im17);
//line 83
im17=null;
//line 83
im11=n.imm_hash({"TurnOn":im12,"TurnOff":im16,});
//line 83
im12=null;
//line 83
im16=null;
//line 83
im10=n.ptd.var(im11);
//line 83
im11=null;
//line 87
im22=n.ptd.none();
//line 88
im23=n.ptd.none();
//line 89
im24=n.ptd.none();
//line 90
im25=n.ptd.none();
//line 91
im26=n.ptd.none();
//line 91
im21=n.imm_hash({"OpenDoors":im22,"CloseDoors":im23,"StartMovingUp":im24,"StartMovingDown":im25,"StopMovingAtNextFloor":im26,});
//line 91
im22=null;
//line 91
im23=null;
//line 91
im24=null;
//line 91
im25=null;
//line 91
im26=null;
//line 91
im20=n.ptd.var(im21);
//line 91
im21=null;
//line 95
im31=n.ptd.int();
//line 95
im30=n.imm_hash({"CallId":im31,});
//line 95
im31=null;
//line 95
im29=n.ptd.rec(im30);
//line 95
im30=null;
//line 95
im28=n.imm_hash({"StartTimer":im29,});
//line 95
im29=null;
//line 95
im27=n.ptd.var(im28);
//line 95
im28=null;
//line 95
im1=n.imm_hash({"InternalButtons":im2,"ExternalButtons":im10,"ElevatorEngine":im20,"DoorsTimer":im27,});
//line 95
im2=null;
//line 95
im10=null;
//line 95
im20=null;
//line 95
im27=null;
//line 95
im0=n.ptd.var(im1);
//line 95
im1=null;
//line 95
return im0;
//line 95
im0=null;
//line 95
return null;
}}}

n.elevatorLogicPtd.__dyn_extCmd=function(arr) {
var ret = n.elevatorLogicPtd.extCmd()
return ret;
}

n.elevatorLogicPtd.extCmds=function() {
var im0=null;
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 102
im1=n.imm_hash({"module":n.imm_str("elevatorLogicPtd"),"name":n.imm_str("extCmd"),});
//line 102
im1=n.c_rt_lib.ov_mk_arg(c[0],im1);;
//line 102
im0=n.ptd.arr(im1);
//line 102
im1=null;
//line 102
return im0;
//line 102
im0=null;
//line 102
return null;
}}}

n.elevatorLogicPtd.__dyn_extCmds=function(arr) {
var ret = n.elevatorLogicPtd.extCmds()
return ret;
}

n.elevatorLogicPtd.varUpDown=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 107
im2=n.ptd.none();
//line 108
im3=n.ptd.none();
//line 108
im1=n.imm_hash({"Down":im2,"Up":im3,});
//line 108
im2=null;
//line 108
im3=null;
//line 108
im0=n.ptd.var(im1);
//line 108
im1=null;
//line 108
return im0;
//line 108
im0=null;
//line 108
return null;
}}}

n.elevatorLogicPtd.__dyn_varUpDown=function(arr) {
var ret = n.elevatorLogicPtd.varUpDown()
return ret;
}
var c=[];
c[0] = n.imm_str("ref");})(nl=nl || {}); 
