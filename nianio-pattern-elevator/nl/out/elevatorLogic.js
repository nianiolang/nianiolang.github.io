var nl;
(function(n , undefined) {
n.elevatorLogic={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.elevatorLogic.nianioFunc=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2.value;
n.check_null(im2);
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var im7=null;
var im8=null;
var bool9=null;
var im10=null;
var im11=null;
var im12=null;
var int13=null;
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
var bool27=null;
var im28=null;
var im29=null;
var im30=null;
var im31=null;
var im32=null;
var bool33=null;
var im34=null;
var im35=null;
var im36=null;
var int37=null;
var im38=null;
var im39=null;
var im40=null;
var bool41=null;
var im42=null;
var im43=null;
var im44=null;
var int45=null;
var im46=null;
var im47=null;
var im48=null;
var im49=null;
var int50=null;
var im51=null;
var int52=null;
var im53=null;
var im54=null;
var im55=null;
var bool56=null;
var im57=null;
var im58=null;
var im59=null;
var bool60=null;
var im61=null;
var im62=null;
var im63=null;
var int64=null;
var im65=null;
var label=null;
while (1) { switch (label) {
default:
//line 8
bool3=n.c_rt_lib.ov_is(im0,c[0]);;
//line 8
if (bool3) {label = 7; continue;}
//line 19
bool3=n.c_rt_lib.ov_is(im0,c[1]);;
//line 19
if (bool3) {label = 64; continue;}
//line 19
im4=c[2];
//line 19
im4=n.imm_arr([im4,im0,]);
//line 19
n.nl_die();
//line 8
case 7:
//line 9
bool5=n.c_rt_lib.ov_is(im1,c[1]);;
//line 9
if (bool5) {label = 23; continue;}
//line 13
bool5=n.c_rt_lib.ov_is(im1,c[3]);;
//line 13
if (bool5) {label = 42; continue;}
//line 14
bool5=n.c_rt_lib.ov_is(im1,c[4]);;
//line 14
if (bool5) {label = 46; continue;}
//line 15
bool5=n.c_rt_lib.ov_is(im1,c[5]);;
//line 15
if (bool5) {label = 50; continue;}
//line 16
bool5=n.c_rt_lib.ov_is(im1,c[6]);;
//line 16
if (bool5) {label = 54; continue;}
//line 17
bool5=n.c_rt_lib.ov_is(im1,c[7]);;
//line 17
if (bool5) {label = 58; continue;}
//line 17
im6=c[2];
//line 17
im6=n.imm_arr([im6,im1,]);
//line 17
n.nl_die();
//line 9
case 23:
//line 9
im8=n.c_rt_lib.ov_as(im1,c[1]);;
//line 9
im7=im8
//line 10
bool9=n.c_rt_lib.ov_is(im7,c[8]);;
//line 10
if (bool9) {label = 31; continue;}
//line 10
im10=c[2];
//line 10
im10=n.imm_arr([im10,im7,]);
//line 10
n.nl_die();
//line 10
case 31:
//line 10
im12=n.c_rt_lib.ov_as(im7,c[8]);;
//line 10
im11=im12
//line 11
im14=n.c_rt_lib.hash_get_value(im11,c[9]);;
//line 11
int13=im14.as_int();
//line 11
im14=null;
//line 11
var call_12_1=new n.imm_ref(im0);var call_12_3=new n.imm_ref(im2);_prv_initState(call_12_1,int13,call_12_3);im0=call_12_1.value;call_12_1=null;im2=call_12_3.value;call_12_3=null;
//line 11
int13=null;
//line 12
label = 40; continue;
//line 12
case 40:
//line 13
label = 62; continue;
//line 13
case 42:
//line 13
im16=n.c_rt_lib.ov_as(im1,c[3]);;
//line 13
im15=im16
//line 14
label = 62; continue;
//line 14
case 46:
//line 14
im18=n.c_rt_lib.ov_as(im1,c[4]);;
//line 14
im17=im18
//line 15
label = 62; continue;
//line 15
case 50:
//line 15
im20=n.c_rt_lib.ov_as(im1,c[5]);;
//line 15
im19=im20
//line 16
label = 62; continue;
//line 16
case 54:
//line 16
im22=n.c_rt_lib.ov_as(im1,c[6]);;
//line 16
im21=im22
//line 17
label = 62; continue;
//line 17
case 58:
//line 17
im24=n.c_rt_lib.ov_as(im1,c[7]);;
//line 17
im23=im24
//line 18
label = 62; continue;
//line 18
case 62:
//line 19
label = 179; continue;
//line 19
case 64:
//line 19
im26=n.c_rt_lib.ov_as(im0,c[1]);;
//line 19
im25=im26
//line 20
bool27=n.c_rt_lib.ov_is(im1,c[1]);;
//line 20
if (bool27) {label = 82; continue;}
//line 21
bool27=n.c_rt_lib.ov_is(im1,c[3]);;
//line 21
if (bool27) {label = 86; continue;}
//line 25
bool27=n.c_rt_lib.ov_is(im1,c[4]);;
//line 25
if (bool27) {label = 105; continue;}
//line 29
bool27=n.c_rt_lib.ov_is(im1,c[5]);;
//line 29
if (bool27) {label = 126; continue;}
//line 31
bool27=n.c_rt_lib.ov_is(im1,c[6]);;
//line 31
if (bool27) {label = 139; continue;}
//line 37
bool27=n.c_rt_lib.ov_is(im1,c[7]);;
//line 37
if (bool27) {label = 157; continue;}
//line 37
im28=c[2];
//line 37
im28=n.imm_arr([im28,im1,]);
//line 37
n.nl_die();
//line 20
case 82:
//line 20
im30=n.c_rt_lib.ov_as(im1,c[1]);;
//line 20
im29=im30
//line 21
label = 176; continue;
//line 21
case 86:
//line 21
im32=n.c_rt_lib.ov_as(im1,c[3]);;
//line 21
im31=im32
//line 22
bool33=n.c_rt_lib.ov_is(im31,c[10]);;
//line 22
if (bool33) {label = 94; continue;}
//line 22
im34=c[2];
//line 22
im34=n.imm_arr([im34,im31,]);
//line 22
n.nl_die();
//line 22
case 94:
//line 22
im36=n.c_rt_lib.ov_as(im31,c[10]);;
//line 22
im35=im36
//line 23
im38=n.c_rt_lib.hash_get_value(im35,c[11]);;
//line 23
int37=im38.as_int();
//line 23
im38=null;
//line 23
var call_30_1=new n.imm_ref(im25);var call_30_3=new n.imm_ref(im2);_prv_handleInternalButton(call_30_1,int37,call_30_3);im25=call_30_1.value;call_30_1=null;im2=call_30_3.value;call_30_3=null;
//line 23
int37=null;
//line 24
label = 103; continue;
//line 24
case 103:
//line 25
label = 176; continue;
//line 25
case 105:
//line 25
im40=n.c_rt_lib.ov_as(im1,c[4]);;
//line 25
im39=im40
//line 26
bool41=n.c_rt_lib.ov_is(im39,c[10]);;
//line 26
if (bool41) {label = 113; continue;}
//line 26
im42=c[2];
//line 26
im42=n.imm_arr([im42,im39,]);
//line 26
n.nl_die();
//line 26
case 113:
//line 26
im44=n.c_rt_lib.ov_as(im39,c[10]);;
//line 26
im43=im44
//line 27
im46=n.c_rt_lib.hash_get_value(im43,c[11]);;
//line 27
int45=im46.as_int();
//line 27
im46=null;
//line 27
im47=n.c_rt_lib.hash_get_value(im43,c[12]);;
//line 27
var call_36_1=new n.imm_ref(im25);var call_36_4=new n.imm_ref(im2);_prv_handleExternalButton(call_36_1,int45,im47,call_36_4);im25=call_36_1.value;call_36_1=null;im2=call_36_4.value;call_36_4=null;
//line 27
int45=null;
//line 27
im47=null;
//line 28
label = 124; continue;
//line 28
case 124:
//line 29
label = 176; continue;
//line 29
case 126:
//line 29
im49=n.c_rt_lib.ov_as(im1,c[5]);;
//line 29
im48=im49
//line 30
im51=n.c_rt_lib.hash_get_value(im48,c[11]);;
//line 30
int50=im51.as_int();
//line 30
im51=null;
//line 30
im53=n.c_rt_lib.hash_get_value(im48,c[13]);;
//line 30
int52=im53.as_int();
//line 30
im53=null;
//line 30
var call_40_1=new n.imm_ref(im25);var call_40_4=new n.imm_ref(im2);_prv_handleSensors(call_40_1,int50,int52,call_40_4);im25=call_40_1.value;call_40_1=null;im2=call_40_4.value;call_40_4=null;
//line 30
int50=null;
//line 30
int52=null;
//line 31
label = 176; continue;
//line 31
case 139:
//line 31
im55=n.c_rt_lib.ov_as(im1,c[6]);;
//line 31
im54=im55
//line 32
bool56=n.c_rt_lib.ov_is(im54,c[14]);;
//line 32
if (bool56) {label = 149; continue;}
//line 34
bool56=n.c_rt_lib.ov_is(im54,c[15]);;
//line 34
if (bool56) {label = 152; continue;}
//line 34
im57=c[2];
//line 34
im57=n.imm_arr([im57,im54,]);
//line 34
n.nl_die();
//line 32
case 149:
//line 33
var call_44_1=new n.imm_ref(im25);var call_44_2=new n.imm_ref(im2);_prv_handleDoorsOpened(call_44_1,call_44_2);im25=call_44_1.value;call_44_1=null;im2=call_44_2.value;call_44_2=null;
//line 34
label = 155; continue;
//line 34
case 152:
//line 35
var call_45_1=new n.imm_ref(im25);var call_45_2=new n.imm_ref(im2);_prv_handleDoorsClosed(call_45_1,call_45_2);im25=call_45_1.value;call_45_1=null;im2=call_45_2.value;call_45_2=null;
//line 36
label = 155; continue;
//line 36
case 155:
//line 37
label = 176; continue;
//line 37
case 157:
//line 37
im59=n.c_rt_lib.ov_as(im1,c[7]);;
//line 37
im58=im59
//line 38
bool60=n.c_rt_lib.ov_is(im58,c[16]);;
//line 38
if (bool60) {label = 165; continue;}
//line 38
im61=c[2];
//line 38
im61=n.imm_arr([im61,im58,]);
//line 38
n.nl_die();
//line 38
case 165:
//line 38
im63=n.c_rt_lib.ov_as(im58,c[16]);;
//line 38
im62=im63
//line 39
im65=n.c_rt_lib.hash_get_value(im62,c[17]);;
//line 39
int64=im65.as_int();
//line 39
im65=null;
//line 39
var call_50_1=new n.imm_ref(im25);var call_50_3=new n.imm_ref(im2);_prv_handleDoorsTimer(call_50_1,int64,call_50_3);im25=call_50_1.value;call_50_1=null;im2=call_50_3.value;call_50_3=null;
//line 39
int64=null;
//line 40
label = 174; continue;
//line 40
case 174:
//line 41
label = 176; continue;
//line 41
case 176:
//line 42
im0=n.c_rt_lib.ov_mk_arg(c[1],im25);;
//line 43
label = 179; continue;
//line 43
case 179:
//line 43
im1=null;
//line 43
bool3=null;
//line 43
im4=null;
//line 43
bool5=null;
//line 43
im6=null;
//line 43
im7=null;
//line 43
im8=null;
//line 43
bool9=null;
//line 43
im10=null;
//line 43
im11=null;
//line 43
im12=null;
//line 43
im15=null;
//line 43
im16=null;
//line 43
im17=null;
//line 43
im18=null;
//line 43
im19=null;
//line 43
im20=null;
//line 43
im21=null;
//line 43
im22=null;
//line 43
im23=null;
//line 43
im24=null;
//line 43
im25=null;
//line 43
im26=null;
//line 43
bool27=null;
//line 43
im28=null;
//line 43
im29=null;
//line 43
im30=null;
//line 43
im31=null;
//line 43
im32=null;
//line 43
bool33=null;
//line 43
im34=null;
//line 43
im35=null;
//line 43
im36=null;
//line 43
im39=null;
//line 43
im40=null;
//line 43
bool41=null;
//line 43
im42=null;
//line 43
im43=null;
//line 43
im44=null;
//line 43
im48=null;
//line 43
im49=null;
//line 43
im54=null;
//line 43
im55=null;
//line 43
bool56=null;
//line 43
im57=null;
//line 43
im58=null;
//line 43
im59=null;
//line 43
bool60=null;
//line 43
im61=null;
//line 43
im62=null;
//line 43
im63=null;
//line 43
___arg__0.value = im0;___arg__2.value = im2;return null;
}}}

n.elevatorLogic.__dyn_nianioFunc=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var arg2=new n.imm_ref(arr.value.get_index(2));;
var ret = n.elevatorLogic.nianioFunc(arg0, arg1, arg2)
arr.value = arr.value.set_index(0, arg0.value);
arr.value = arr.value.set_index(2, arg2.value);
return ret;
}

function _prv_initState(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=___arg__2.value;
n.check_null(im2);
var im3=null;
var im4=null;
var int5=null;
var bool6=null;
var bool7=null;
var im8=null;
var im9=null;
var bool10=null;
var im11=null;
var bool12=null;
var im13=null;
var int14=null;
var im15=null;
var im16=null;
var int17=null;
var im18=null;
var int19=null;
var im20=null;
var im21=null;
var int22=null;
var im23=null;
var label=null;
while (1) { switch (label) {
default:
//line 47
im3=n.imm_arr([]);
//line 48
im4=n.imm_arr([]);
//line 49
int5=0;
//line 49
case 3:
//line 49
bool6=int5<int1;
//line 49
bool6=!bool6
//line 49
if (bool6) {label = 26; continue;}
//line 50
bool7=false;
//line 50
im8=n.c_rt_lib.native_to_nl(bool7)
//line 50
var call_0_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_0_1,im8);im3=call_0_1.value;call_0_1=null;;
//line 50
im8=null;
//line 51
bool10=false;
//line 51
im11=n.c_rt_lib.native_to_nl(bool10)
//line 51
bool12=false;
//line 51
im13=n.c_rt_lib.native_to_nl(bool12)
//line 51
im9=n.imm_hash({"Up":im11,"Down":im13,});
//line 51
bool10=null;
//line 51
im11=null;
//line 51
bool12=null;
//line 51
im13=null;
//line 51
var call_1_1=new n.imm_ref(im4);n.c_rt_lib.array_push(call_1_1,im9);im4=call_1_1.value;call_1_1=null;;
//line 51
im9=null;
//line 49
int14=1;
//line 49
int5=Math.floor(int5+int14);
//line 49
int14=null;
//line 52
label = 3; continue;
//line 52
case 26:
//line 58
int17=0;
//line 58
im18=n.imm_int(int17)
//line 59
int19=0;
//line 59
im20=n.imm_int(int19)
//line 60
im21=c[18]
//line 60
im16=n.imm_hash({"Position":im18,"Destination":im20,"Doors":im21,});
//line 60
int17=null;
//line 60
im18=null;
//line 60
int19=null;
//line 60
im20=null;
//line 60
im21=null;
//line 62
int22=0;
//line 62
im23=n.imm_int(int22)
//line 62
im15=n.imm_hash({"InternalButtons":im3,"ExternalButtons":im4,"Elevator":im16,"LastDoorsTimerCallId":im23,});
//line 62
im16=null;
//line 62
int22=null;
//line 62
im23=null;
//line 62
im0=n.c_rt_lib.ov_mk_arg(c[1],im15);;
//line 62
im15=null;
//line 62
int1=null;
//line 62
im3=null;
//line 62
im4=null;
//line 62
int5=null;
//line 62
bool6=null;
//line 62
___arg__0.value = im0;___arg__2.value = im2;return null;
}}}

function _prv_handleInternalButton(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=___arg__2.value;
n.check_null(im2);
var bool3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var string8=null;
var bool9=null;
var im10=null;
var im11=null;
var bool12=null;
var bool13=null;
var int14=null;
var im15=null;
var im16=null;
var int17=null;
var im18=null;
var im19=null;
var bool20=null;
var im21=null;
var im22=null;
var string23=null;
var bool24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var string30=null;
var im31=null;
var im32=null;
var int33=null;
var im34=null;
var im35=null;
var int36=null;
var im37=null;
var im38=null;
var im39=null;
var im40=null;
var string41=null;
var im42=null;
var im43=null;
var im44=null;
var bool45=null;
var im46=null;
var im47=null;
var im48=null;
var im49=null;
var bool50=null;
var im51=null;
var im52=null;
var im53=null;
var im54=null;
var im55=null;
var string56=null;
var im57=null;
var im58=null;
var im59=null;
var im60=null;
var im61=null;
var im62=null;
var bool63=null;
var int64=null;
var im65=null;
var im66=null;
var im67=null;
var im68=null;
var bool69=null;
var int70=null;
var im71=null;
var im72=null;
var int73=null;
var int74=null;
var im75=null;
var im76=null;
var int77=null;
var bool78=null;
var int79=null;
var im80=null;
var im81=null;
var int82=null;
var int83=null;
var im84=null;
var im85=null;
var int86=null;
var im87=null;
var im88=null;
var string89=null;
var im90=null;
var im91=null;
var im92=null;
var bool93=null;
var im94=null;
var im95=null;
var im96=null;
var im97=null;
var im98=null;
var label=null;
while (1) { switch (label) {
default:
//line 67
im4=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 67
im5=im4.get_index(int1);
//line 67
bool3=n.c_rt_lib.check_true_native(im5);;
//line 67
im4=null;
//line 67
im5=null;
//line 67
bool3=!bool3
//line 67
im6=c[3];
//line 67
im6=n.c_rt_lib.get_ref_hash(im0,im6);
//line 67
im7=n.c_rt_lib.native_to_nl(bool3)
//line 67
var call_3_1=new n.imm_ref(im6);n.c_rt_lib.set_ref_arr(call_3_1,int1,im7);im6=call_3_1.value;call_3_1=null;;
//line 67
string8=c[3];
//line 67
var call_4_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_4_1,string8,im6);im0=call_4_1.value;call_4_1=null;
//line 67
bool3=null;
//line 67
im6=null;
//line 67
im7=null;
//line 67
string8=null;
//line 69
im10=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 69
im11=im10.get_index(int1);
//line 69
bool9=n.c_rt_lib.check_true_native(im11);;
//line 69
im10=null;
//line 69
im11=null;
//line 69
bool9=!bool9
//line 69
if (bool9) {label = 269; continue;}
//line 70
im15=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 70
im16=n.c_rt_lib.hash_get_value(im15,c[20]);;
//line 70
int14=im16.as_int();
//line 70
im15=null;
//line 70
im16=null;
//line 70
bool12=int14==int1;
//line 70
int14=null;
//line 70
bool13=!bool12
//line 70
if (bool13) {label = 39; continue;}
//line 70
im18=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 70
im19=n.c_rt_lib.hash_get_value(im18,c[21]);;
//line 70
int17=im19.as_int();
//line 70
im18=null;
//line 70
im19=null;
//line 70
bool12=int17==int1;
//line 70
int17=null;
//line 70
case 39:
//line 70
bool13=null;
//line 70
bool12=!bool12
//line 70
if (bool12) {label = 90; continue;}
//line 71
bool20=false;
//line 71
im21=c[3];
//line 71
im21=n.c_rt_lib.get_ref_hash(im0,im21);
//line 71
im22=n.c_rt_lib.native_to_nl(bool20)
//line 71
var call_12_1=new n.imm_ref(im21);n.c_rt_lib.set_ref_arr(call_12_1,int1,im22);im21=call_12_1.value;call_12_1=null;;
//line 71
string23=c[3];
//line 71
var call_13_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_13_1,string23,im21);im0=call_13_1.value;call_13_1=null;
//line 71
bool20=null;
//line 71
im21=null;
//line 71
im22=null;
//line 71
string23=null;
//line 73
im26=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 73
im25=n.c_rt_lib.hash_get_value(im26,c[22]);;
//line 73
im26=null;
//line 73
bool24=n.c_rt_lib.ov_is(im25,c[23]);;
//line 73
im25=null;
//line 73
bool24=!bool24
//line 73
if (bool24) {label = 67; continue;}
//line 74
int1=null;
//line 74
bool9=null;
//line 74
bool12=null;
//line 74
bool24=null;
//line 74
___arg__0.value = im0;___arg__2.value = im2;return null;
//line 75
label = 67; continue;
//line 75
case 67:
//line 75
bool24=null;
//line 77
im27=c[24]
//line 77
im28=c[19];
//line 77
im28=n.c_rt_lib.get_ref_hash(im0,im28);
//line 77
im29=im27
//line 77
var call_18_1=new n.imm_ref(im28);n.c_rt_lib.hash_set_value(call_18_1,c[22],im29);im28=call_18_1.value;call_18_1=null;;
//line 77
string30=c[19];
//line 77
var call_19_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_19_1,string30,im28);im0=call_19_1.value;call_19_1=null;
//line 77
im27=null;
//line 77
im28=null;
//line 77
im29=null;
//line 77
string30=null;
//line 78
im32=c[25]
//line 78
im31=n.c_rt_lib.ov_mk_arg(c[6],im32);;
//line 78
im32=null;
//line 78
im2=n.imm_arr([im31,]);
//line 78
im31=null;
//line 80
int1=null;
//line 80
bool9=null;
//line 80
bool12=null;
//line 80
___arg__0.value = im0;___arg__2.value = im2;return null;
//line 81
label = 265; continue;
//line 81
case 90:
//line 81
im34=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 81
im35=n.c_rt_lib.hash_get_value(im34,c[20]);;
//line 81
int33=im35.as_int();
//line 81
im34=null;
//line 81
im35=null;
//line 81
im37=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 81
im38=n.c_rt_lib.hash_get_value(im37,c[21]);;
//line 81
int36=im38.as_int();
//line 81
im37=null;
//line 81
im38=null;
//line 81
bool12=int33==int36;
//line 81
int33=null;
//line 81
int36=null;
//line 81
bool12=!bool12
//line 81
if (bool12) {label = 206; continue;}
//line 82
im39=c[19];
//line 82
im39=n.c_rt_lib.get_ref_hash(im0,im39);
//line 82
im40=n.imm_int(int1)
//line 82
var call_26_1=new n.imm_ref(im39);n.c_rt_lib.hash_set_value(call_26_1,c[21],im40);im39=call_26_1.value;call_26_1=null;;
//line 82
string41=c[19];
//line 82
var call_27_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_27_1,string41,im39);im0=call_27_1.value;call_27_1=null;
//line 82
im39=null;
//line 82
im40=null;
//line 82
string41=null;
//line 84
im44=n.imm_int(int1)
//line 84
im43=n.imm_hash({"Floor":im44,});
//line 84
im44=null;
//line 84
im42=n.c_rt_lib.ov_mk_arg(c[26],im43);;
//line 84
im43=null;
//line 85
im46=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 85
im47=im46.get_index(int1);
//line 85
bool45=n.c_rt_lib.check_true_native(im47);;
//line 85
im46=null;
//line 85
im47=null;
//line 85
bool45=!bool45
//line 85
if (bool45) {label = 133; continue;}
//line 86
im49=n.imm_int(int1)
//line 86
im48=n.imm_hash({"Floor":im49,});
//line 86
im49=null;
//line 86
im42=n.c_rt_lib.ov_mk_arg(c[27],im48);;
//line 86
im48=null;
//line 87
label = 133; continue;
//line 87
case 133:
//line 87
bool45=null;
//line 89
im52=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 89
im51=n.c_rt_lib.hash_get_value(im52,c[22]);;
//line 89
im52=null;
//line 89
bool50=n.c_rt_lib.ov_is(im51,c[23]);;
//line 89
im51=null;
//line 89
bool50=!bool50
//line 89
if (bool50) {label = 167; continue;}
//line 90
im53=c[28]
//line 90
im54=c[19];
//line 90
im54=n.c_rt_lib.get_ref_hash(im0,im54);
//line 90
im55=im53
//line 90
var call_36_1=new n.imm_ref(im54);n.c_rt_lib.hash_set_value(call_36_1,c[22],im55);im54=call_36_1.value;call_36_1=null;;
//line 90
string56=c[19];
//line 90
var call_37_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_37_1,string56,im54);im0=call_37_1.value;call_37_1=null;
//line 90
im53=null;
//line 90
im54=null;
//line 90
im55=null;
//line 90
string56=null;
//line 92
im58=c[29]
//line 92
im57=n.c_rt_lib.ov_mk_arg(c[6],im58);;
//line 92
im58=null;
//line 93
im59=n.c_rt_lib.ov_mk_arg(c[3],im42);;
//line 93
im2=n.imm_arr([im57,im59,]);
//line 93
im57=null;
//line 93
im59=null;
//line 95
int1=null;
//line 95
bool9=null;
//line 95
bool12=null;
//line 95
im42=null;
//line 95
bool50=null;
//line 95
___arg__0.value = im0;___arg__2.value = im2;return null;
//line 96
label = 202; continue;
//line 96
case 167:
//line 96
im61=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 96
im60=n.c_rt_lib.hash_get_value(im61,c[22]);;
//line 96
im61=null;
//line 96
bool50=n.c_rt_lib.ov_is(im60,c[30]);;
//line 96
im60=null;
//line 96
bool50=!bool50
//line 96
if (bool50) {label = 202; continue;}
//line 97
im62=c[31]
//line 98
im65=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 98
im66=n.c_rt_lib.hash_get_value(im65,c[20]);;
//line 98
int64=im66.as_int();
//line 98
im65=null;
//line 98
im66=null;
//line 98
bool63=int1>int64;
//line 98
int64=null;
//line 98
bool63=!bool63
//line 98
if (bool63) {label = 187; continue;}
//line 99
im62=c[32]
//line 100
label = 187; continue;
//line 100
case 187:
//line 100
bool63=null;
//line 102
im67=n.c_rt_lib.ov_mk_arg(c[6],im62);;
//line 103
im68=n.c_rt_lib.ov_mk_arg(c[3],im42);;
//line 103
im2=n.imm_arr([im67,im68,]);
//line 103
im67=null;
//line 103
im68=null;
//line 105
int1=null;
//line 105
bool9=null;
//line 105
bool12=null;
//line 105
im42=null;
//line 105
bool50=null;
//line 105
im62=null;
//line 105
___arg__0.value = im0;___arg__2.value = im2;return null;
//line 106
label = 202; continue;
//line 106
case 202:
//line 106
bool50=null;
//line 106
im62=null;
//line 107
label = 265; continue;
//line 107
case 206:
//line 107
im71=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 107
im72=n.c_rt_lib.hash_get_value(im71,c[21]);;
//line 107
int70=im72.as_int();
//line 107
im71=null;
//line 107
im72=null;
//line 107
bool12=int70<int1;
//line 107
int70=null;
//line 107
bool69=!bool12
//line 107
if (bool69) {label = 227; continue;}
//line 107
im75=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 107
im76=n.c_rt_lib.hash_get_value(im75,c[20]);;
//line 107
int74=im76.as_int();
//line 107
im75=null;
//line 107
im76=null;
//line 107
int77=1;
//line 107
int73=Math.floor(int74-int77);
//line 107
int74=null;
//line 107
int77=null;
//line 107
bool12=int1<int73;
//line 107
int73=null;
//line 107
case 227:
//line 107
bool69=null;
//line 107
if (bool12) {label = 252; continue;}
//line 108
im80=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 108
im81=n.c_rt_lib.hash_get_value(im80,c[21]);;
//line 108
int79=im81.as_int();
//line 108
im80=null;
//line 108
im81=null;
//line 108
bool12=int79>int1;
//line 108
int79=null;
//line 108
bool78=!bool12
//line 108
if (bool78) {label = 250; continue;}
//line 108
im84=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 108
im85=n.c_rt_lib.hash_get_value(im84,c[20]);;
//line 108
int83=im85.as_int();
//line 108
im84=null;
//line 108
im85=null;
//line 108
int86=1;
//line 108
int82=Math.floor(int83+int86);
//line 108
int83=null;
//line 108
int86=null;
//line 108
bool12=int1>int82;
//line 108
int82=null;
//line 108
case 250:
//line 108
bool78=null;
//line 108
case 252:
//line 108
bool12=!bool12
//line 108
if (bool12) {label = 265; continue;}
//line 109
im87=c[19];
//line 109
im87=n.c_rt_lib.get_ref_hash(im0,im87);
//line 109
im88=n.imm_int(int1)
//line 109
var call_56_1=new n.imm_ref(im87);n.c_rt_lib.hash_set_value(call_56_1,c[21],im88);im87=call_56_1.value;call_56_1=null;;
//line 109
string89=c[19];
//line 109
var call_57_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_57_1,string89,im87);im0=call_57_1.value;call_57_1=null;
//line 109
im87=null;
//line 109
im88=null;
//line 109
string89=null;
//line 110
label = 265; continue;
//line 110
case 265:
//line 110
bool12=null;
//line 110
im42=null;
//line 111
label = 269; continue;
//line 111
case 269:
//line 111
bool9=null;
//line 114
im92=n.imm_int(int1)
//line 114
im91=n.imm_hash({"Floor":im92,});
//line 114
im92=null;
//line 114
im90=n.c_rt_lib.ov_mk_arg(c[26],im91);;
//line 114
im91=null;
//line 115
im94=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 115
im95=im94.get_index(int1);
//line 115
bool93=n.c_rt_lib.check_true_native(im95);;
//line 115
im94=null;
//line 115
im95=null;
//line 115
bool93=!bool93
//line 115
if (bool93) {label = 289; continue;}
//line 116
im97=n.imm_int(int1)
//line 116
im96=n.imm_hash({"Floor":im97,});
//line 116
im97=null;
//line 116
im90=n.c_rt_lib.ov_mk_arg(c[27],im96);;
//line 116
im96=null;
//line 117
label = 289; continue;
//line 117
case 289:
//line 117
bool93=null;
//line 119
im98=n.c_rt_lib.ov_mk_arg(c[3],im90);;
//line 119
var call_63_1=new n.imm_ref(im2);n.c_rt_lib.array_push(call_63_1,im98);im2=call_63_1.value;call_63_1=null;;
//line 119
im98=null;
//line 119
int1=null;
//line 119
im90=null;
//line 119
___arg__0.value = im0;___arg__2.value = im2;return null;
}}}

function _prv_handleExternalButton(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3.value;
n.check_null(im3);
var bool4=null;
var bool5=null;
var im6=null;
var im7=null;
var im8=null;
var string9=null;
var bool10=null;
var im11=null;
var im12=null;
var im13=null;
var string14=null;
var bool15=null;
var bool16=null;
var int17=null;
var im18=null;
var im19=null;
var int20=null;
var im21=null;
var im22=null;
var bool23=null;
var im24=null;
var im25=null;
var bool26=null;
var bool27=null;
var im28=null;
var im29=null;
var im30=null;
var string31=null;
var bool32=null;
var im33=null;
var im34=null;
var im35=null;
var string36=null;
var im37=null;
var im38=null;
var im39=null;
var string40=null;
var im41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var im46=null;
var int47=null;
var im48=null;
var im49=null;
var int50=null;
var im51=null;
var im52=null;
var im53=null;
var im54=null;
var string55=null;
var bool56=null;
var im57=null;
var im58=null;
var im59=null;
var im60=null;
var im61=null;
var string62=null;
var im63=null;
var im64=null;
var im65=null;
var im66=null;
var im67=null;
var im68=null;
var im69=null;
var im70=null;
var im71=null;
var bool72=null;
var int73=null;
var im74=null;
var im75=null;
var im76=null;
var im77=null;
var im78=null;
var im79=null;
var im80=null;
var bool81=null;
var bool82=null;
var int83=null;
var im84=null;
var im85=null;
var int86=null;
var int87=null;
var im88=null;
var im89=null;
var int90=null;
var bool91=null;
var bool92=null;
var int93=null;
var im94=null;
var im95=null;
var int96=null;
var int97=null;
var im98=null;
var im99=null;
var int100=null;
var im101=null;
var im102=null;
var string103=null;
var im104=null;
var im105=null;
var im106=null;
var im107=null;
var label=null;
while (1) { switch (label) {
default:
//line 123
bool4=n.c_rt_lib.ov_is(im2,c[33]);;
//line 123
bool4=!bool4
//line 123
if (bool4) {label = 18; continue;}
//line 124
bool5=true;
//line 124
im6=c[4];
//line 124
im6=n.c_rt_lib.get_ref_hash(im0,im6);
//line 124
im7=n.c_rt_lib.get_ref_arr(im6,int1);
//line 124
im8=n.c_rt_lib.native_to_nl(bool5)
//line 124
var call_3_1=new n.imm_ref(im7);n.c_rt_lib.hash_set_value(call_3_1,c[33],im8);im7=call_3_1.value;call_3_1=null;;
//line 124
var call_4_1=new n.imm_ref(im6);n.c_rt_lib.set_ref_arr(call_4_1,int1,im7);im6=call_4_1.value;call_4_1=null;
//line 124
string9=c[4];
//line 124
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string9,im6);im0=call_5_1.value;call_5_1=null;
//line 124
bool5=null;
//line 124
im6=null;
//line 124
im7=null;
//line 124
im8=null;
//line 124
string9=null;
//line 125
label = 37; continue;
//line 125
case 18:
//line 125
bool4=n.c_rt_lib.ov_is(im2,c[34]);;
//line 125
bool4=!bool4
//line 125
if (bool4) {label = 37; continue;}
//line 126
bool10=true;
//line 126
im11=c[4];
//line 126
im11=n.c_rt_lib.get_ref_hash(im0,im11);
//line 126
im12=n.c_rt_lib.get_ref_arr(im11,int1);
//line 126
im13=n.c_rt_lib.native_to_nl(bool10)
//line 126
var call_9_1=new n.imm_ref(im12);n.c_rt_lib.hash_set_value(call_9_1,c[34],im13);im12=call_9_1.value;call_9_1=null;;
//line 126
var call_10_1=new n.imm_ref(im11);n.c_rt_lib.set_ref_arr(call_10_1,int1,im12);im11=call_10_1.value;call_10_1=null;
//line 126
string14=c[4];
//line 126
var call_11_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_11_1,string14,im11);im0=call_11_1.value;call_11_1=null;
//line 126
bool10=null;
//line 126
im11=null;
//line 126
im12=null;
//line 126
im13=null;
//line 126
string14=null;
//line 127
label = 37; continue;
//line 127
case 37:
//line 127
bool4=null;
//line 130
im18=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 130
im19=n.c_rt_lib.hash_get_value(im18,c[20]);;
//line 130
int17=im19.as_int();
//line 130
im18=null;
//line 130
im19=null;
//line 130
bool15=int17==int1;
//line 130
int17=null;
//line 130
bool16=!bool15
//line 130
if (bool16) {label = 55; continue;}
//line 130
im21=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 130
im22=n.c_rt_lib.hash_get_value(im21,c[21]);;
//line 130
int20=im22.as_int();
//line 130
im21=null;
//line 130
im22=null;
//line 130
bool15=int20==int1;
//line 130
int20=null;
//line 130
case 55:
//line 130
bool16=null;
//line 130
bool15=!bool15
//line 130
if (bool15) {label = 143; continue;}
//line 132
im25=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 132
im24=n.c_rt_lib.hash_get_value(im25,c[22]);;
//line 132
im25=null;
//line 132
bool23=n.c_rt_lib.ov_is(im24,c[23]);;
//line 132
im24=null;
//line 132
bool23=!bool23
//line 132
if (bool23) {label = 111; continue;}
//line 133
bool26=n.c_rt_lib.ov_is(im2,c[33]);;
//line 133
bool26=!bool26
//line 133
if (bool26) {label = 84; continue;}
//line 134
bool27=false;
//line 134
im28=c[4];
//line 134
im28=n.c_rt_lib.get_ref_hash(im0,im28);
//line 134
im29=n.c_rt_lib.get_ref_arr(im28,int1);
//line 134
im30=n.c_rt_lib.native_to_nl(bool27)
//line 134
var call_22_1=new n.imm_ref(im29);n.c_rt_lib.hash_set_value(call_22_1,c[33],im30);im29=call_22_1.value;call_22_1=null;;
//line 134
var call_23_1=new n.imm_ref(im28);n.c_rt_lib.set_ref_arr(call_23_1,int1,im29);im28=call_23_1.value;call_23_1=null;
//line 134
string31=c[4];
//line 134
var call_24_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_24_1,string31,im28);im0=call_24_1.value;call_24_1=null;
//line 134
bool27=null;
//line 134
im28=null;
//line 134
im29=null;
//line 134
im30=null;
//line 134
string31=null;
//line 135
label = 103; continue;
//line 135
case 84:
//line 135
bool26=n.c_rt_lib.ov_is(im2,c[34]);;
//line 135
bool26=!bool26
//line 135
if (bool26) {label = 103; continue;}
//line 136
bool32=false;
//line 136
im33=c[4];
//line 136
im33=n.c_rt_lib.get_ref_hash(im0,im33);
//line 136
im34=n.c_rt_lib.get_ref_arr(im33,int1);
//line 136
im35=n.c_rt_lib.native_to_nl(bool32)
//line 136
var call_28_1=new n.imm_ref(im34);n.c_rt_lib.hash_set_value(call_28_1,c[34],im35);im34=call_28_1.value;call_28_1=null;;
//line 136
var call_29_1=new n.imm_ref(im33);n.c_rt_lib.set_ref_arr(call_29_1,int1,im34);im33=call_29_1.value;call_29_1=null;
//line 136
string36=c[4];
//line 136
var call_30_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_30_1,string36,im33);im0=call_30_1.value;call_30_1=null;
//line 136
bool32=null;
//line 136
im33=null;
//line 136
im34=null;
//line 136
im35=null;
//line 136
string36=null;
//line 137
label = 103; continue;
//line 137
case 103:
//line 137
bool26=null;
//line 138
int1=null;
//line 138
im2=null;
//line 138
bool15=null;
//line 138
bool23=null;
//line 138
___arg__0.value = im0;___arg__3.value = im3;return null;
//line 139
label = 111; continue;
//line 139
case 111:
//line 139
bool23=null;
//line 141
im37=c[35]
//line 141
im38=c[19];
//line 141
im38=n.c_rt_lib.get_ref_hash(im0,im38);
//line 141
im39=im37
//line 141
var call_32_1=new n.imm_ref(im38);n.c_rt_lib.hash_set_value(call_32_1,c[22],im39);im38=call_32_1.value;call_32_1=null;;
//line 141
string40=c[19];
//line 141
var call_33_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_33_1,string40,im38);im0=call_33_1.value;call_33_1=null;
//line 141
im37=null;
//line 141
im38=null;
//line 141
im39=null;
//line 141
string40=null;
//line 143
im44=n.imm_int(int1)
//line 143
im43=n.imm_hash({"Floor":im44,"Type":im2,});
//line 143
im44=null;
//line 143
im42=n.c_rt_lib.ov_mk_arg(c[27],im43);;
//line 143
im43=null;
//line 143
im41=n.c_rt_lib.ov_mk_arg(c[4],im42);;
//line 143
im42=null;
//line 143
var call_36_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_36_1,im41);im3=call_36_1.value;call_36_1=null;;
//line 143
im41=null;
//line 147
im46=c[36]
//line 147
im45=n.c_rt_lib.ov_mk_arg(c[6],im46);;
//line 147
im46=null;
//line 147
var call_38_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_38_1,im45);im3=call_38_1.value;call_38_1=null;;
//line 147
im45=null;
//line 148
int1=null;
//line 148
im2=null;
//line 148
bool15=null;
//line 148
___arg__0.value = im0;___arg__3.value = im3;return null;
//line 149
label = 320; continue;
//line 149
case 143:
//line 149
im48=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 149
im49=n.c_rt_lib.hash_get_value(im48,c[20]);;
//line 149
int47=im49.as_int();
//line 149
im48=null;
//line 149
im49=null;
//line 149
im51=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 149
im52=n.c_rt_lib.hash_get_value(im51,c[21]);;
//line 149
int50=im52.as_int();
//line 149
im51=null;
//line 149
im52=null;
//line 149
bool15=int47==int50;
//line 149
int47=null;
//line 149
int50=null;
//line 149
bool15=!bool15
//line 149
if (bool15) {label = 251; continue;}
//line 150
im53=c[19];
//line 150
im53=n.c_rt_lib.get_ref_hash(im0,im53);
//line 150
im54=n.imm_int(int1)
//line 150
var call_44_1=new n.imm_ref(im53);n.c_rt_lib.hash_set_value(call_44_1,c[21],im54);im53=call_44_1.value;call_44_1=null;;
//line 150
string55=c[19];
//line 150
var call_45_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_45_1,string55,im53);im0=call_45_1.value;call_45_1=null;
//line 150
im53=null;
//line 150
im54=null;
//line 150
string55=null;
//line 152
im58=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 152
im57=n.c_rt_lib.hash_get_value(im58,c[22]);;
//line 152
im58=null;
//line 152
bool56=n.c_rt_lib.ov_is(im57,c[23]);;
//line 152
im57=null;
//line 152
bool56=!bool56
//line 152
if (bool56) {label = 206; continue;}
//line 153
im59=c[37]
//line 153
im60=c[19];
//line 153
im60=n.c_rt_lib.get_ref_hash(im0,im60);
//line 153
im61=im59
//line 153
var call_50_1=new n.imm_ref(im60);n.c_rt_lib.hash_set_value(call_50_1,c[22],im61);im60=call_50_1.value;call_50_1=null;;
//line 153
string62=c[19];
//line 153
var call_51_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_51_1,string62,im60);im0=call_51_1.value;call_51_1=null;
//line 153
im59=null;
//line 153
im60=null;
//line 153
im61=null;
//line 153
string62=null;
//line 154
im66=n.imm_int(int1)
//line 154
im65=n.imm_hash({"Floor":im66,"Type":im2,});
//line 154
im66=null;
//line 154
im64=n.c_rt_lib.ov_mk_arg(c[27],im65);;
//line 154
im65=null;
//line 154
im63=n.c_rt_lib.ov_mk_arg(c[4],im64);;
//line 154
im64=null;
//line 154
var call_54_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_54_1,im63);im3=call_54_1.value;call_54_1=null;;
//line 154
im63=null;
//line 158
im68=c[38]
//line 158
im67=n.c_rt_lib.ov_mk_arg(c[6],im68);;
//line 158
im68=null;
//line 158
var call_56_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_56_1,im67);im3=call_56_1.value;call_56_1=null;;
//line 158
im67=null;
//line 159
int1=null;
//line 159
im2=null;
//line 159
bool15=null;
//line 159
bool56=null;
//line 159
___arg__0.value = im0;___arg__3.value = im3;return null;
//line 160
label = 247; continue;
//line 160
case 206:
//line 160
im70=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 160
im69=n.c_rt_lib.hash_get_value(im70,c[22]);;
//line 160
im70=null;
//line 160
bool56=n.c_rt_lib.ov_is(im69,c[30]);;
//line 160
im69=null;
//line 160
bool56=!bool56
//line 160
if (bool56) {label = 247; continue;}
//line 161
im71=c[39]
//line 162
im74=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 162
im75=n.c_rt_lib.hash_get_value(im74,c[20]);;
//line 162
int73=im75.as_int();
//line 162
im74=null;
//line 162
im75=null;
//line 162
bool72=int1>int73;
//line 162
int73=null;
//line 162
bool72=!bool72
//line 162
if (bool72) {label = 226; continue;}
//line 163
im71=c[40]
//line 164
label = 226; continue;
//line 164
case 226:
//line 164
bool72=null;
//line 166
im76=n.c_rt_lib.ov_mk_arg(c[6],im71);;
//line 166
var call_63_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_63_1,im76);im3=call_63_1.value;call_63_1=null;;
//line 166
im76=null;
//line 167
im80=n.imm_int(int1)
//line 167
im79=n.imm_hash({"Floor":im80,"Type":im2,});
//line 167
im80=null;
//line 167
im78=n.c_rt_lib.ov_mk_arg(c[27],im79);;
//line 167
im79=null;
//line 167
im77=n.c_rt_lib.ov_mk_arg(c[4],im78);;
//line 167
im78=null;
//line 167
var call_66_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_66_1,im77);im3=call_66_1.value;call_66_1=null;;
//line 167
im77=null;
//line 171
int1=null;
//line 171
im2=null;
//line 171
bool15=null;
//line 171
bool56=null;
//line 171
im71=null;
//line 171
___arg__0.value = im0;___arg__3.value = im3;return null;
//line 172
label = 247; continue;
//line 172
case 247:
//line 172
bool56=null;
//line 172
im71=null;
//line 173
label = 320; continue;
//line 173
case 251:
//line 173
bool15=n.c_rt_lib.ov_is(im2,c[34]);;
//line 173
bool82=!bool15
//line 173
if (bool82) {label = 262; continue;}
//line 173
im84=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 173
im85=n.c_rt_lib.hash_get_value(im84,c[21]);;
//line 173
int83=im85.as_int();
//line 173
im84=null;
//line 173
im85=null;
//line 173
bool15=int83<int1;
//line 173
int83=null;
//line 173
case 262:
//line 173
bool82=null;
//line 173
bool81=!bool15
//line 173
if (bool81) {label = 277; continue;}
//line 173
im88=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 173
im89=n.c_rt_lib.hash_get_value(im88,c[20]);;
//line 173
int87=im89.as_int();
//line 173
im88=null;
//line 173
im89=null;
//line 173
int90=1;
//line 173
int86=Math.floor(int87-int90);
//line 173
int87=null;
//line 173
int90=null;
//line 173
bool15=int1<int86;
//line 173
int86=null;
//line 173
case 277:
//line 173
bool81=null;
//line 173
if (bool15) {label = 307; continue;}
//line 174
bool15=n.c_rt_lib.ov_is(im2,c[33]);;
//line 174
bool92=!bool15
//line 174
if (bool92) {label = 290; continue;}
//line 174
im94=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 174
im95=n.c_rt_lib.hash_get_value(im94,c[21]);;
//line 174
int93=im95.as_int();
//line 174
im94=null;
//line 174
im95=null;
//line 174
bool15=int93>int1;
//line 174
int93=null;
//line 174
case 290:
//line 174
bool92=null;
//line 174
bool91=!bool15
//line 174
if (bool91) {label = 305; continue;}
//line 174
im98=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 174
im99=n.c_rt_lib.hash_get_value(im98,c[20]);;
//line 174
int97=im99.as_int();
//line 174
im98=null;
//line 174
im99=null;
//line 174
int100=1;
//line 174
int96=Math.floor(int97+int100);
//line 174
int97=null;
//line 174
int100=null;
//line 174
bool15=int1>int96;
//line 174
int96=null;
//line 174
case 305:
//line 174
bool91=null;
//line 174
case 307:
//line 174
bool15=!bool15
//line 174
if (bool15) {label = 320; continue;}
//line 175
im101=c[19];
//line 175
im101=n.c_rt_lib.get_ref_hash(im0,im101);
//line 175
im102=n.imm_int(int1)
//line 175
var call_78_1=new n.imm_ref(im101);n.c_rt_lib.hash_set_value(call_78_1,c[21],im102);im101=call_78_1.value;call_78_1=null;;
//line 175
string103=c[19];
//line 175
var call_79_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_79_1,string103,im101);im0=call_79_1.value;call_79_1=null;
//line 175
im101=null;
//line 175
im102=null;
//line 175
string103=null;
//line 176
label = 320; continue;
//line 176
case 320:
//line 176
bool15=null;
//line 178
im107=n.imm_int(int1)
//line 178
im106=n.imm_hash({"Floor":im107,"Type":im2,});
//line 178
im107=null;
//line 178
im105=n.c_rt_lib.ov_mk_arg(c[27],im106);;
//line 178
im106=null;
//line 178
im104=n.c_rt_lib.ov_mk_arg(c[4],im105);;
//line 178
im105=null;
//line 178
var call_82_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_82_1,im104);im3=call_82_1.value;call_82_1=null;;
//line 178
im104=null;
//line 178
int1=null;
//line 178
im2=null;
//line 178
___arg__0.value = im0;___arg__3.value = im3;return null;
}}}

function _prv_handleSensors(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var int2=___arg__2;
n.check_null(int2);
var im3=___arg__3.value;
n.check_null(im3);
var im4=null;
var im5=null;
var string6=null;
var bool7=null;
var int8=null;
var im9=null;
var im10=null;
var im11=null;
var string12=null;
var im13=null;
var im14=null;
var int15=null;
var bool16=null;
var int17=null;
var int18=null;
var bool19=null;
var int20=null;
var im21=null;
var im22=null;
var int23=null;
var int24=null;
var int25=null;
var im26=null;
var im27=null;
var label=null;
while (1) { switch (label) {
default:
//line 185
im4=c[19];
//line 185
im4=n.c_rt_lib.get_ref_hash(im0,im4);
//line 185
im5=n.imm_int(int1)
//line 185
var call_1_1=new n.imm_ref(im4);n.c_rt_lib.hash_set_value(call_1_1,c[20],im5);im4=call_1_1.value;call_1_1=null;;
//line 185
string6=c[19];
//line 185
var call_2_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_2_1,string6,im4);im0=call_2_1.value;call_2_1=null;
//line 185
im4=null;
//line 185
im5=null;
//line 185
string6=null;
//line 187
int8=0;
//line 187
bool7=int2==int8;
//line 187
int8=null;
//line 187
bool7=!bool7
//line 187
if (bool7) {label = 35; continue;}
//line 188
im9=c[41]
//line 188
im10=c[19];
//line 188
im10=n.c_rt_lib.get_ref_hash(im0,im10);
//line 188
im11=im9
//line 188
var call_4_1=new n.imm_ref(im10);n.c_rt_lib.hash_set_value(call_4_1,c[22],im11);im10=call_4_1.value;call_4_1=null;;
//line 188
string12=c[19];
//line 188
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string12,im10);im0=call_5_1.value;call_5_1=null;
//line 188
im9=null;
//line 188
im10=null;
//line 188
im11=null;
//line 188
string12=null;
//line 189
im14=c[42]
//line 189
im13=n.c_rt_lib.ov_mk_arg(c[6],im14);;
//line 189
im14=null;
//line 189
var call_7_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_7_1,im13);im3=call_7_1.value;call_7_1=null;;
//line 189
im13=null;
//line 190
int1=null;
//line 190
int2=null;
//line 190
bool7=null;
//line 190
___arg__0.value = im0;___arg__3.value = im3;return null;
//line 191
label = 35; continue;
//line 191
case 35:
//line 191
bool7=null;
//line 193
int15=0;
//line 194
int17=0;
//line 194
bool16=int2>int17;
//line 194
int17=null;
//line 194
bool16=!bool16
//line 194
if (bool16) {label = 45; continue;}
//line 194
int15=1;
//line 194
label = 54; continue;
//line 194
case 45:
//line 195
int18=0;
//line 195
bool16=int2<int18;
//line 195
int18=null;
//line 195
bool16=!bool16
//line 195
if (bool16) {label = 54; continue;}
//line 195
int15=1;
//line 195
int15=-int15
//line 195
label = 54; continue;
//line 195
case 54:
//line 195
bool16=null;
//line 197
im21=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 197
im22=n.c_rt_lib.hash_get_value(im21,c[21]);;
//line 197
int20=im22.as_int();
//line 197
im21=null;
//line 197
im22=null;
//line 197
int25=1;
//line 197
int24=Math.floor(int25*int15);
//line 197
int25=null;
//line 197
int23=Math.floor(int1+int24);
//line 197
int24=null;
//line 197
bool19=int20==int23;
//line 197
int20=null;
//line 197
int23=null;
//line 197
bool19=!bool19
//line 197
if (bool19) {label = 77; continue;}
//line 198
im27=c[43]
//line 198
im26=n.c_rt_lib.ov_mk_arg(c[6],im27);;
//line 198
im27=null;
//line 198
var call_11_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_11_1,im26);im3=call_11_1.value;call_11_1=null;;
//line 198
im26=null;
//line 199
label = 77; continue;
//line 199
case 77:
//line 199
bool19=null;
//line 199
int1=null;
//line 199
int2=null;
//line 199
int15=null;
//line 199
___arg__0.value = im0;___arg__3.value = im3;return null;
}}}

function _prv_handleDoorsOpened(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var string5=null;
var im6=null;
var int7=null;
var int8=null;
var int9=null;
var string10=null;
var im11=null;
var im12=null;
var im13=null;
var int14=null;
var im15=null;
var im16=null;
var int17=null;
var im18=null;
var im19=null;
var bool20=null;
var im21=null;
var im22=null;
var bool23=null;
var im24=null;
var im25=null;
var string26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var bool31=null;
var im32=null;
var im33=null;
var im34=null;
var bool35=null;
var im36=null;
var im37=null;
var im38=null;
var string39=null;
var im40=null;
var im41=null;
var im42=null;
var im43=null;
var im44=null;
var bool45=null;
var im46=null;
var im47=null;
var im48=null;
var bool49=null;
var im50=null;
var im51=null;
var im52=null;
var string53=null;
var im54=null;
var im55=null;
var im56=null;
var im57=null;
var im58=null;
var label=null;
while (1) { switch (label) {
default:
//line 203
im2=c[44]
//line 203
im3=c[19];
//line 203
im3=n.c_rt_lib.get_ref_hash(im0,im3);
//line 203
im4=im2
//line 203
var call_1_1=new n.imm_ref(im3);n.c_rt_lib.hash_set_value(call_1_1,c[22],im4);im3=call_1_1.value;call_1_1=null;;
//line 203
string5=c[19];
//line 203
var call_2_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_2_1,string5,im3);im0=call_2_1.value;call_2_1=null;
//line 203
im2=null;
//line 203
im3=null;
//line 203
im4=null;
//line 203
string5=null;
//line 205
im6=c[45];
//line 205
im6=n.c_rt_lib.get_ref_hash(im0,im6);
//line 205
int7=1;
//line 205
int8=im6.as_int();
//line 205
int9=Math.floor(int8+int7);
//line 205
im6=n.imm_int(int9)
//line 205
string10=c[45];
//line 205
var call_4_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_4_1,string10,im6);im0=call_4_1.value;call_4_1=null;
//line 205
im6=null;
//line 205
int7=null;
//line 205
int8=null;
//line 205
int9=null;
//line 205
string10=null;
//line 208
im15=n.c_rt_lib.hash_get_value(im0,c[45]);;
//line 208
int14=im15.as_int();
//line 208
im15=null;
//line 208
im16=n.imm_int(int14)
//line 208
im13=n.imm_hash({"CallId":im16,});
//line 208
int14=null;
//line 208
im16=null;
//line 208
im12=n.c_rt_lib.ov_mk_arg(c[46],im13);;
//line 208
im13=null;
//line 208
im11=n.c_rt_lib.ov_mk_arg(c[7],im12);;
//line 208
im12=null;
//line 208
var call_8_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_8_1,im11);im1=call_8_1.value;call_8_1=null;;
//line 208
im11=null;
//line 210
im18=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 210
im19=n.c_rt_lib.hash_get_value(im18,c[20]);;
//line 210
int17=im19.as_int();
//line 210
im18=null;
//line 210
im19=null;
//line 212
im21=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 212
im22=im21.get_index(int17);
//line 212
bool20=n.c_rt_lib.check_true_native(im22);;
//line 212
im21=null;
//line 212
im22=null;
//line 212
bool20=!bool20
//line 212
if (bool20) {label = 70; continue;}
//line 213
bool23=false;
//line 213
im24=c[3];
//line 213
im24=n.c_rt_lib.get_ref_hash(im0,im24);
//line 213
im25=n.c_rt_lib.native_to_nl(bool23)
//line 213
var call_14_1=new n.imm_ref(im24);n.c_rt_lib.set_ref_arr(call_14_1,int17,im25);im24=call_14_1.value;call_14_1=null;;
//line 213
string26=c[3];
//line 213
var call_15_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_15_1,string26,im24);im0=call_15_1.value;call_15_1=null;
//line 213
bool23=null;
//line 213
im24=null;
//line 213
im25=null;
//line 213
string26=null;
//line 214
im30=n.imm_int(int17)
//line 214
im29=n.imm_hash({"Floor":im30,});
//line 214
im30=null;
//line 214
im28=n.c_rt_lib.ov_mk_arg(c[26],im29);;
//line 214
im29=null;
//line 214
im27=n.c_rt_lib.ov_mk_arg(c[3],im28);;
//line 214
im28=null;
//line 214
var call_18_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_18_1,im27);im1=call_18_1.value;call_18_1=null;;
//line 214
im27=null;
//line 215
label = 70; continue;
//line 215
case 70:
//line 215
bool20=null;
//line 216
im33=n.c_rt_lib.hash_get_value(im0,c[4]);;
//line 216
im32=im33.get_index(int17);
//line 216
im33=null;
//line 216
im34=n.c_rt_lib.hash_get_value(im32,c[34]);;
//line 216
bool31=n.c_rt_lib.check_true_native(im34);;
//line 216
im32=null;
//line 216
im34=null;
//line 216
bool31=!bool31
//line 216
if (bool31) {label = 107; continue;}
//line 217
bool35=false;
//line 217
im36=c[4];
//line 217
im36=n.c_rt_lib.get_ref_hash(im0,im36);
//line 217
im37=n.c_rt_lib.get_ref_arr(im36,int17);
//line 217
im38=n.c_rt_lib.native_to_nl(bool35)
//line 217
var call_24_1=new n.imm_ref(im37);n.c_rt_lib.hash_set_value(call_24_1,c[34],im38);im37=call_24_1.value;call_24_1=null;;
//line 217
var call_25_1=new n.imm_ref(im36);n.c_rt_lib.set_ref_arr(call_25_1,int17,im37);im36=call_25_1.value;call_25_1=null;
//line 217
string39=c[4];
//line 217
var call_26_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_26_1,string39,im36);im0=call_26_1.value;call_26_1=null;
//line 217
bool35=null;
//line 217
im36=null;
//line 217
im37=null;
//line 217
im38=null;
//line 217
string39=null;
//line 218
im43=n.imm_int(int17)
//line 220
im44=c[47]
//line 220
im42=n.imm_hash({"Floor":im43,"Type":im44,});
//line 220
im43=null;
//line 220
im44=null;
//line 220
im41=n.c_rt_lib.ov_mk_arg(c[26],im42);;
//line 220
im42=null;
//line 220
im40=n.c_rt_lib.ov_mk_arg(c[4],im41);;
//line 220
im41=null;
//line 220
var call_29_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_29_1,im40);im1=call_29_1.value;call_29_1=null;;
//line 220
im40=null;
//line 222
label = 107; continue;
//line 222
case 107:
//line 222
bool31=null;
//line 223
im47=n.c_rt_lib.hash_get_value(im0,c[4]);;
//line 223
im46=im47.get_index(int17);
//line 223
im47=null;
//line 223
im48=n.c_rt_lib.hash_get_value(im46,c[33]);;
//line 223
bool45=n.c_rt_lib.check_true_native(im48);;
//line 223
im46=null;
//line 223
im48=null;
//line 223
bool45=!bool45
//line 223
if (bool45) {label = 144; continue;}
//line 224
bool49=false;
//line 224
im50=c[4];
//line 224
im50=n.c_rt_lib.get_ref_hash(im0,im50);
//line 224
im51=n.c_rt_lib.get_ref_arr(im50,int17);
//line 224
im52=n.c_rt_lib.native_to_nl(bool49)
//line 224
var call_35_1=new n.imm_ref(im51);n.c_rt_lib.hash_set_value(call_35_1,c[33],im52);im51=call_35_1.value;call_35_1=null;;
//line 224
var call_36_1=new n.imm_ref(im50);n.c_rt_lib.set_ref_arr(call_36_1,int17,im51);im50=call_36_1.value;call_36_1=null;
//line 224
string53=c[4];
//line 224
var call_37_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_37_1,string53,im50);im0=call_37_1.value;call_37_1=null;
//line 224
bool49=null;
//line 224
im50=null;
//line 224
im51=null;
//line 224
im52=null;
//line 224
string53=null;
//line 225
im57=n.imm_int(int17)
//line 227
im58=c[48]
//line 227
im56=n.imm_hash({"Floor":im57,"Type":im58,});
//line 227
im57=null;
//line 227
im58=null;
//line 227
im55=n.c_rt_lib.ov_mk_arg(c[26],im56);;
//line 227
im56=null;
//line 227
im54=n.c_rt_lib.ov_mk_arg(c[4],im55);;
//line 227
im55=null;
//line 227
var call_40_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_40_1,im54);im1=call_40_1.value;call_40_1=null;;
//line 227
im54=null;
//line 229
label = 144; continue;
//line 229
case 144:
//line 229
bool45=null;
//line 229
int17=null;
//line 229
___arg__0.value = im0;___arg__1.value = im1;return null;
}}}

function _prv_handleDoorsClosed(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var string5=null;
var bool6=null;
var int7=null;
var im8=null;
var im9=null;
var int10=null;
var im11=null;
var im12=null;
var im13=null;
var bool14=null;
var int15=null;
var im16=null;
var im17=null;
var int18=null;
var im19=null;
var im20=null;
var im21=null;
var int22=null;
var int23=null;
var im24=null;
var int25=null;
var int26=null;
var bool27=null;
var int28=null;
var im29=null;
var bool30=null;
var bool31=null;
var im32=null;
var im33=null;
var im34=null;
var im35=null;
var im36=null;
var im37=null;
var im38=null;
var im39=null;
var int40=null;
var int41=null;
var int42=null;
var im43=null;
var im44=null;
var int45=null;
var int46=null;
var int47=null;
var im48=null;
var im49=null;
var int50=null;
var bool51=null;
var int52=null;
var int53=null;
var im54=null;
var int55=null;
var im56=null;
var im57=null;
var string58=null;
var im59=null;
var bool60=null;
var int61=null;
var im62=null;
var im63=null;
var int64=null;
var im65=null;
var im66=null;
var im67=null;
var label=null;
while (1) { switch (label) {
default:
//line 233
im2=c[49]
//line 233
im3=c[19];
//line 233
im3=n.c_rt_lib.get_ref_hash(im0,im3);
//line 233
im4=im2
//line 233
var call_1_1=new n.imm_ref(im3);n.c_rt_lib.hash_set_value(call_1_1,c[22],im4);im3=call_1_1.value;call_1_1=null;;
//line 233
string5=c[19];
//line 233
var call_2_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_2_1,string5,im3);im0=call_2_1.value;call_2_1=null;
//line 233
im2=null;
//line 233
im3=null;
//line 233
im4=null;
//line 233
string5=null;
//line 235
im8=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 235
im9=n.c_rt_lib.hash_get_value(im8,c[20]);;
//line 235
int7=im9.as_int();
//line 235
im8=null;
//line 235
im9=null;
//line 235
im11=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 235
im12=n.c_rt_lib.hash_get_value(im11,c[21]);;
//line 235
int10=im12.as_int();
//line 235
im11=null;
//line 235
im12=null;
//line 235
bool6=int7!=int10;
//line 235
int7=null;
//line 235
int10=null;
//line 235
bool6=!bool6
//line 235
if (bool6) {label = 53; continue;}
//line 236
im13=c[50]
//line 237
im16=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 237
im17=n.c_rt_lib.hash_get_value(im16,c[21]);;
//line 237
int15=im17.as_int();
//line 237
im16=null;
//line 237
im17=null;
//line 237
im19=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 237
im20=n.c_rt_lib.hash_get_value(im19,c[20]);;
//line 237
int18=im20.as_int();
//line 237
im19=null;
//line 237
im20=null;
//line 237
bool14=int15>int18;
//line 237
int15=null;
//line 237
int18=null;
//line 237
bool14=!bool14
//line 237
if (bool14) {label = 44; continue;}
//line 238
im13=c[51]
//line 239
label = 44; continue;
//line 239
case 44:
//line 239
bool14=null;
//line 241
im21=n.c_rt_lib.ov_mk_arg(c[6],im13);;
//line 241
var call_12_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_12_1,im21);im1=call_12_1.value;call_12_1=null;;
//line 241
im21=null;
//line 242
bool6=null;
//line 242
im13=null;
//line 242
___arg__0.value = im0;___arg__1.value = im1;return null;
//line 243
label = 53; continue;
//line 243
case 53:
//line 243
bool6=null;
//line 243
im13=null;
//line 245
im24=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 245
int23=n.c_rt_lib.array_len(im24);;
//line 245
im24=null;
//line 245
int23=-int23
//line 245
int25=1;
//line 245
int22=Math.floor(int23-int25);
//line 245
int23=null;
//line 245
int25=null;
//line 247
int26=0;
//line 247
case 65:
//line 247
im29=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 247
int28=n.c_rt_lib.array_len(im29);;
//line 247
im29=null;
//line 247
bool27=int26<int28;
//line 247
int28=null;
//line 247
bool27=!bool27
//line 247
if (bool27) {label = 131; continue;}
//line 248
im32=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 248
im33=im32.get_index(int26);
//line 248
bool30=n.c_rt_lib.check_true_native(im33);;
//line 248
im32=null;
//line 248
im33=null;
//line 248
if (bool30) {label = 86; continue;}
//line 248
im35=n.c_rt_lib.hash_get_value(im0,c[4]);;
//line 248
im34=im35.get_index(int26);
//line 248
im35=null;
//line 248
im36=n.c_rt_lib.hash_get_value(im34,c[33]);;
//line 248
bool30=n.c_rt_lib.check_true_native(im36);;
//line 248
im34=null;
//line 248
im36=null;
//line 248
case 86:
//line 248
if (bool30) {label = 95; continue;}
//line 248
im38=n.c_rt_lib.hash_get_value(im0,c[4]);;
//line 248
im37=im38.get_index(int26);
//line 248
im38=null;
//line 248
im39=n.c_rt_lib.hash_get_value(im37,c[34]);;
//line 248
bool30=n.c_rt_lib.check_true_native(im39);;
//line 248
im37=null;
//line 248
im39=null;
//line 248
case 95:
//line 248
bool31=!bool30
//line 248
if (bool31) {label = 119; continue;}
//line 249
im43=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 249
im44=n.c_rt_lib.hash_get_value(im43,c[20]);;
//line 249
int42=im44.as_int();
//line 249
im43=null;
//line 249
im44=null;
//line 249
int41=Math.floor(int26-int42);
//line 249
int42=null;
//line 249
int40=_prv_abs(int41);
//line 249
int41=null;
//line 249
im48=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 249
im49=n.c_rt_lib.hash_get_value(im48,c[20]);;
//line 249
int47=im49.as_int();
//line 249
im48=null;
//line 249
im49=null;
//line 249
int46=Math.floor(int22-int47);
//line 249
int47=null;
//line 249
int45=_prv_abs(int46);
//line 249
int46=null;
//line 249
bool30=int40<int45;
//line 249
int40=null;
//line 249
int45=null;
//line 249
case 119:
//line 249
bool31=null;
//line 249
bool30=!bool30
//line 249
if (bool30) {label = 125; continue;}
//line 250
int22=int26
//line 251
label = 125; continue;
//line 251
case 125:
//line 251
bool30=null;
//line 247
int50=1;
//line 247
int26=Math.floor(int26+int50);
//line 247
int50=null;
//line 252
label = 65; continue;
//line 252
case 131:
//line 254
im54=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 254
int53=n.c_rt_lib.array_len(im54);;
//line 254
im54=null;
//line 254
int53=-int53
//line 254
int55=1;
//line 254
int52=Math.floor(int53-int55);
//line 254
int53=null;
//line 254
int55=null;
//line 254
bool51=int22!=int52;
//line 254
int52=null;
//line 254
bool51=!bool51
//line 254
if (bool51) {label = 177; continue;}
//line 255
im56=c[19];
//line 255
im56=n.c_rt_lib.get_ref_hash(im0,im56);
//line 255
im57=n.imm_int(int22)
//line 255
var call_34_1=new n.imm_ref(im56);n.c_rt_lib.hash_set_value(call_34_1,c[21],im57);im56=call_34_1.value;call_34_1=null;;
//line 255
string58=c[19];
//line 255
var call_35_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_35_1,string58,im56);im0=call_35_1.value;call_35_1=null;
//line 255
im56=null;
//line 255
im57=null;
//line 255
string58=null;
//line 257
im59=c[52]
//line 258
im62=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 258
im63=n.c_rt_lib.hash_get_value(im62,c[21]);;
//line 258
int61=im63.as_int();
//line 258
im62=null;
//line 258
im63=null;
//line 258
im65=n.c_rt_lib.hash_get_value(im0,c[19]);;
//line 258
im66=n.c_rt_lib.hash_get_value(im65,c[20]);;
//line 258
int64=im66.as_int();
//line 258
im65=null;
//line 258
im66=null;
//line 258
bool60=int61>int64;
//line 258
int61=null;
//line 258
int64=null;
//line 258
bool60=!bool60
//line 258
if (bool60) {label = 171; continue;}
//line 259
im59=c[53]
//line 260
label = 171; continue;
//line 260
case 171:
//line 260
bool60=null;
//line 262
im67=n.c_rt_lib.ov_mk_arg(c[6],im59);;
//line 262
var call_41_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_41_1,im67);im1=call_41_1.value;call_41_1=null;;
//line 262
im67=null;
//line 263
label = 177; continue;
//line 263
case 177:
//line 263
bool51=null;
//line 263
im59=null;
//line 263
int22=null;
//line 263
int26=null;
//line 263
bool27=null;
//line 263
___arg__0.value = im0;___arg__1.value = im1;return null;
}}}

function _prv_handleDoorsTimer(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=___arg__2.value;
n.check_null(im2);
var bool3=null;
var int4=null;
var im5=null;
var im6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 267
im5=n.c_rt_lib.hash_get_value(im0,c[45]);;
//line 267
int4=im5.as_int();
//line 267
im5=null;
//line 267
bool3=int1==int4;
//line 267
int4=null;
//line 267
bool3=!bool3
//line 267
if (bool3) {label = 13; continue;}
//line 268
im7=c[54]
//line 268
im6=n.c_rt_lib.ov_mk_arg(c[6],im7);;
//line 268
im7=null;
//line 268
var call_2_1=new n.imm_ref(im2);n.c_rt_lib.array_push(call_2_1,im6);im2=call_2_1.value;call_2_1=null;;
//line 268
im6=null;
//line 269
label = 13; continue;
//line 269
case 13:
//line 269
bool3=null;
//line 269
int1=null;
//line 269
___arg__0.value = im0;___arg__2.value = im2;return null;
}}}

function _prv_abs(___arg__0) {
var int0=___arg__0;
n.check_null(int0);
var int1=null;
var bool2=null;
var int3=null;
var label=null;
while (1) { switch (label) {
default:
//line 273
int3=0;
//line 273
bool2=int0>=int3;
//line 273
int3=null;
//line 273
if (bool2) {label = 7; continue;}
//line 273
int1=int0
//line 273
int1=-int1
//line 273
label = 9; continue;
//line 273
case 7:
//line 273
int1=int0
//line 273
case 9:
//line 273
bool2=null;
//line 273
int0=null;
//line 273
return int1;
}}}

function _prv__singleton_prv_fun_initState() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 277
im0=c[55]
//line 277
return im0;
}}}
var _singleton_val__prv__singleton_prv_fun_initState;
n.elevatorLogic.initState=function() {
if (_singleton_val__prv__singleton_prv_fun_initState===undefined) {
_singleton_val__prv__singleton_prv_fun_initState=_prv__singleton_prv_fun_initState();
}
return _singleton_val__prv__singleton_prv_fun_initState;
}

n.elevatorLogic.__dyn_initState=function(arr) {
var ret = n.elevatorLogic.initState()
return ret;
}
var c=[];
c[0] = n.imm_str("Uninit");c[1] = n.imm_str("Init");c[2] = n.imm_str("NOMATCHALERT");c[3] = n.imm_str("InternalButtons");c[4] = n.imm_str("ExternalButtons");c[5] = n.imm_str("Sensors");c[6] = n.imm_str("ElevatorEngine");c[7] = n.imm_str("DoorsTimer");c[8] = n.imm_str("InitState");c[9] = n.imm_str("Floors");c[10] = n.imm_str("Pressed");c[11] = n.imm_str("Floor");c[12] = n.imm_str("Type");c[13] = n.imm_str("Velocity");c[14] = n.imm_str("DoorsOpened");c[15] = n.imm_str("DoorsClosed");c[16] = n.imm_str("TimeOut");c[17] = n.imm_str("CallId");c[18] = n.imm_ov_js_str("Closed",null);c[19] = n.imm_str("Elevator");c[20] = n.imm_str("Position");c[21] = n.imm_str("Destination");c[22] = n.imm_str("Doors");c[23] = n.imm_str("Open");c[24] = n.imm_ov_js_str("Opening",null);c[25] = n.imm_ov_js_str("OpenDoors",null);c[26] = n.imm_str("TurnOff");c[27] = n.imm_str("TurnOn");c[28] = n.imm_ov_js_str("Closing",null);c[29] = n.imm_ov_js_str("CloseDoors",null);c[30] = n.imm_str("Closed");c[31] = n.imm_ov_js_str("StartMovingDown",null);c[32] = n.imm_ov_js_str("StartMovingUp",null);c[33] = n.imm_str("Up");c[34] = n.imm_str("Down");c[35] = n.imm_ov_js_str("Opening",null);c[36] = n.imm_ov_js_str("OpenDoors",null);c[37] = n.imm_ov_js_str("Closing",null);c[38] = n.imm_ov_js_str("CloseDoors",null);c[39] = n.imm_ov_js_str("StartMovingDown",null);c[40] = n.imm_ov_js_str("StartMovingUp",null);c[41] = n.imm_ov_js_str("Opening",null);c[42] = n.imm_ov_js_str("OpenDoors",null);c[43] = n.imm_ov_js_str("StopMovingAtNextFloor",null);c[44] = n.imm_ov_js_str("Open",null);c[45] = n.imm_str("LastDoorsTimerCallId");c[46] = n.imm_str("StartTimer");c[47] = n.imm_ov_js_str("Down",null);c[48] = n.imm_ov_js_str("Up",null);c[49] = n.imm_ov_js_str("Closed",null);c[50] = n.imm_ov_js_str("StartMovingDown",null);c[51] = n.imm_ov_js_str("StartMovingUp",null);c[52] = n.imm_ov_js_str("StartMovingDown",null);c[53] = n.imm_ov_js_str("StartMovingUp",null);c[54] = n.imm_ov_js_str("CloseDoors",null);c[55] = n.imm_ov_js_str("Uninit",null);})(nl=nl || {}); 
