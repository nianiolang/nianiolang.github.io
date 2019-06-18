---
layout: default
title: Using NianioLang with existing C code 
---

# Get all dependencies

### Debian / Ubuntu
* `sudo apt-get install git`
### Cygwin
During installation select all of packages below:
* `make`
* `gcc-core`
* `gdb`
* `git`

# Download and build NianioLang
* `git clone https://github.com/nianiolang/nl2.git`
* `cd nl2`
* `make`

# Prepare NianioLang library files
NianioLang library needs to be initialized before running compiled scripts.
After running commands below, static files containing NianioLang library will be placed in `nl_lib_dir` (by default `nl_lib`).
* `cd` to project directory
* `bash /path/to/nl2/nl_init_c.sh [nl_lib_dir]`

# Create basic nianio function
* Create directory for NianioLang sources
  * `mkdir nl_sources`
* Create and open file `nl_sources/nianio.nl` with your favourite text editor
* Define nianio function implementing simple counter

```
def nianio::nianio(ref state, cmd) {
	var extcmds = [];
	match (cmd) case :inc(var number) {
		state->number += number;
	} case :print {
		extcmds []= :print_text(state->number);
	}
	return extcmds;
}
```
* Define function creating intial nianio state

```
def nianio::initial_state() {
	return {
		number => 0,
	};
}
```
* Compile module `nianio.nl`
  * `/path/to/nl2/mk_cache.exe nl_sources/ nl_lib/ --c --o cache_nl/`

At this point, file `cache_nl/nianio.c` contains C code generated from `nianio.nl`.

# Call nianio function from C code
* Create and open file `main.c` with containing C code which will interact with NL functions.
In this example we send to nianio three commands `:inc(1)` and one command `:print`.

```
#include <stdio.h>
#include "cache_nl/nianio.h"
#include "nl_lib/c_rt_lib.h"

int main() {
    c_rt_lib0init();

    ImmT state = NULL;
    ImmT cmd = NULL;
    ImmT extcmds = NULL;
    ImmT print_text = NULL;

    c_rt_lib0move(&state, nianio0initial_state());

    c_rt_lib0move(&cmd, c_rt_lib0ov_mk_arg(c_rt_lib0string_new("inc"), c_rt_lib0int_new(1)));
    c_rt_lib0move(&extcmds, nianio0nianio(&state, cmd));
    c_rt_lib0move(&extcmds, nianio0nianio(&state, cmd));
    c_rt_lib0move(&extcmds, nianio0nianio(&state, cmd));

    c_rt_lib0move(&cmd, c_rt_lib0ov_mk_none(c_rt_lib0string_new("print")));
    c_rt_lib0move(&extcmds, nianio0nianio(&state, cmd));

    print_text = c_rt_lib0string_new("print_text");
    for (int i = 0; i < c_rt_lib0array_len(extcmds); i++) {
        ImmT extcmd = NULL;
        c_rt_lib0move(&extcmd, c_rt_lib0array_get(extcmds, i));
        if (c_rt_lib0ov_is(extcmd, print_text)) {
            ImmT as_print_text = NULL;
            c_rt_lib0move(&as_print_text, c_rt_lib0ov_as(extcmd, print_text));
            printf("%lld\n", getIntFromImm(as_print_text));
            c_rt_lib0clear(&as_print_text);
        }
        c_rt_lib0clear(&extcmd);
    }   

    c_rt_lib0clear(&print_text);
    c_rt_lib0clear(&extcmds);
    c_rt_lib0clear(&state);
    c_rt_lib0clear(&cmd);

    return 0;
}
```
*Details of C interface are described in section below.*
* Compile `main.c` with all NL generated files:
```
gcc main.c nl_lib/*.c cache_nl/*.c -Inl_lib -Icache_nl -lm -o main
```
* Run newly created executable
```
./main
```
* Expected output:
```
3
```
# C interface for NL
* NL variables have type `ImmT`
* NL functions are called `module0function`
* Maintaining reference counter
  * Variables need to be initialized with `NULL`.
  * Assignment from rvalue (e.g. function result) to variable is done by calling `c_rt_lib0move(ImmT* dst, ImmT src)`.
  * Assignment from one variable to other is done by calling `c_rt_lib0copy(ImmT* dst, ImmT src)`. This performs lazy copy of a variable.
  * After variable is no longer used it's neccessary to call `c_rt_lib0clear(ImmT* var)` on it.
* Integers
  * Create NL integer: `ImmT c_rt_lib0int_new(long long value)`
  * Get C integer from NL: `long long getIntFromImm(ImmT nl_int)`
* Strings
  * Create NL string: `ImmT c_rt_lib0string_new(const char *str)`
  * Access NL string (read only): `((NlString*)nl_str)->s`
* Arrays
  * Create empty NL array: `ImmT c_rt_lib0array_new()`
  * Push to NL array: `c_rt_lib0array_push(ImmT *arr, ImmT el)`
  * Get element from array: `ImmT c_rt_lib0array_get(ImmT arr, long long index)`
  * Set array element: `c_rt_lib0array_set(ImmT *arr, long long index, ImmT new_value)`
* Hashes / records
  * Create empty NL hash: `ImmT c_rt_lib0hash_new()`
  * Set hash value at key: `c_rt_lib0hash_set_value(ImmT *hash, ImmT key, ImmT value)`
  * Get hash value at key: `ImmT c_rt_lib0hash_get_value(ImmT hash, ImmT key)`
* Variants
  * Create NL variant with value: `ImmT c_rt_lib0ov_mk_arg(ImmT name, ImmT value)`
  * Create NL variant without value: `ImmT c_rt_lib0ov_mk_none(ImmT name)`
  * `is` operation: `bool c_rt_lib0ov_is(ImmT variant, ImmT name)`
  * `as` operation: `ImmT c_rt_lib0ov_as(ImmT variant, ImmT name)`


# Nianio function development
* During development of nianio function, after each change in NianioLang files it is necessary to recompile them by calling 
```
/path/to/nl2/mk_cache.exe nl_sources/ nl_lib/ --c --o cache_nl/
gcc main.c nl_lib/*.c cache_nl/*.c -Inl_lib -Icache_nl -lm -o main
```
In long run it can be tedious, so it is possible to use NianioLang compiler
to automatically check for changes and recompile necessary files.
To run automatic compilation use command
```
/path/to/nl2/mk_cache.exe nl_sources/ nl_lib/ --c --o cache_nl/ --idex 'gcc main.c nl_lib/*.c cache_nl/*.c -Inl_lib -Icache_nl -lm -o main'
```
`--idex` argument specifies command to be run after each recompilation of NL files ‒ in this case recompilation of C
files, which were changed by recompiling NL sources.

**Note: `make ide` does not detect changes in C files. 
After changing C files it is needed to save some NL file to trigger recompilation.**

# Type checking
After adding types to NL code, compiler will statically check types of all function calls issued from NianioLang code.
Checking argument types for functions called from C is possible only in runtime.
To do that, add `ptd::ensure` call at the beginning of each function called from C:
```
def nianio::nianio(ref state : @nianio::state, cmd : @nianio::cmd) : @nianio::ext_cmds {
	ptd::ensure(@nianio::state, state);
	ptd::ensure(@nianio::cmd, cmd);
	var ext_cmds = [];
	...
	return ext_cmds;
}
```

# Own types
Own types are types parallel to ptd with usage restricted to passing by ref
(no copying, returning or passing by value is allowed).
Thanks to that compiler is able to generate efficient target code. Main use case of own types is nianio state.
To make state own, first define state type and use it in nianio function declaration
```
use ptd;
use own;

def nianio::state() {
	return own::rec({
		number => ptd::int(),
	});
}

def nianio::nianio(ref state : @nianio::state, cmd) {
	...
}
```
Because own types cannot be returned from function, initializing function has to take state as a ref argument and 
fill it with initial values
```
def nianio::init_state(ref state : @nianio::state) {
    state = {
        number => 0,
    };
}
```
Finally, in C create state variable of type `module0function0type` and use init function to initialize C state variable.
Then it can be passed to nianio function as before.
To destroy it at the and of program use `module0function0type0clear` instead of `c_rt_lib0clear`.
```
int main() {
...
    nianio0state0type state = {};
    nianio0init_state(&state);
...
    nianio0state0type0clear(state);
}
```


# Debugging
To enable debugging symbols, add flag `-g` to gcc compilation command.
