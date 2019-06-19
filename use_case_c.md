---
layout: default
title: Using NianioLang with C code 
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

# Assumptions
During this tutorial we will use `~/nl2/` directory for NL compiler files and `~/project/` directory for
newly created project files.

# Download and build NianioLang
```
cd ~/
git clone https://github.com/nianiolang/nl2.git
cd nl2
make
```
After executing those commands directory `~/nl2` should contain file `mk_cache.exe` ‒ main compiler executable.

# Prepare NianioLang library files
NianioLang library needs to be initialized before running compiled scripts.
```
mkdir ~/project
cd ~/project
bash ~/nl2/nl_init_c.sh nl_lib
```
Expected directory tree after executing commands above:
```
~/project
└── nl_lib
    ├── array.nl
    ├── boolean.nl
    ├── boolean_t.nl
    ├── c_fe_lib.c
    ├── c_fe_lib.h
    ...
```

# Create basic nianio function
* Create directory for NianioLang sources
```
cd ~/project
mkdir nl_sources
```
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
```
~/nl2/mk_cache.exe ~/project/nl_sources/ ~/project/nl_lib/ --c --o ~/project/nl_out/
```

Executing this command will generate result C files for NL lib and `nianio.nl` in `~/project/nl_out`.
Expected project structure at this point:
```
~/project
├── nl_lib
│   ├── array.nl
│   ├── boolean.nl
│   ├── boolean_t.nl
│   ├── c_fe_lib.c
│   ├── c_fe_lib.h
│   ...
├── nl_out
│   ├── array.c
│   ├── array.h
│   ├── boolean.c
│   ├── boolean.h
│   ...
│   ├── nianio.c
│   ├── nianio.h
│   ...
└── nl_sources
    └── nianio.nl
```

# Call nianio function from C code
* Create and open file `~/project/main.c`, containing C code which will interact with NL functions.
In this example we send to nianio three commands `:inc(1)` and one command `:print`.

```
#include <stdio.h>
#include "nl_out/nianio.h"
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
* Compile `~/project/main.c` with all NL generated files:
```
gcc ~/project/main.c ~/project/nl_lib/*.c ~/project/nl_out/*.c -I$HOME/project/nl_lib -I$HOME/project/nl_out -lm -o ~/project/main
```
Complete project directory structure:
```
~/project
├── main
├── main.c
├── nl_lib
│   ├── array.nl
│   ├── boolean.nl
│   ├── boolean_t.nl
│   ├── c_fe_lib.c
│   ├── c_fe_lib.h
│   ...
├── nl_out
│   ├── array.c
│   ├── array.h
│   ├── boolean.c
│   ├── boolean.h
│   ...
│   ├── nianio.c
│   ├── nianio.h
│   ...
└── nl_sources
    └── nianio.nl
```

* Run newly created executable
```
~/project/main
```
* Expected output:
```
3
```
* Complete, ready to be built project: <a href="project_c.zip?raw=true" download>project_c.zip</a>

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
~/nl2/mk_cache.exe ~/project/nl_sources/ ~/project/nl_lib/ --c --o ~/project/nl_out/
gcc ~/project/main.c ~/project/nl_lib/*.c ~/project/nl_out/*.c -I$HOME/project/nl_lib -I$HOME/project/nl_out -lm -o ~/project/main
```
In long run it can be tedious, so it is possible to use NianioLang compiler
to automatically check for changes and recompile necessary files.
To run automatic compilation use command
```
~/nl2/mk_cache.exe ~/project/nl_sources/ ~/project/nl_lib/ --c --o ~/project/nl_out/ --idex 'gcc ~/project/main.c ~/project/nl_lib/*.c ~/project/nl_out/*.c -I$HOME/project/nl_lib -I$HOME/project/nl_out -lm -o ~/project/main'
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
