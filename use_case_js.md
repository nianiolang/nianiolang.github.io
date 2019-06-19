---
layout: default
title: Using NianioLang with JS code 
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
bash ~/nl2/nl_init_js.sh nl_lib
```
Expected directory tree after executing commands above:
```
~/project
└── nl_lib
    └── nl_lib.js
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
~/nl2/mk_cache.exe ~/project/nl_sources/ --js --o ~/project/nl_out/
```
Executing this command will generate file `~/project/nl_out/nianio.js`. Expected project structure at this point:
```
~/project
├── nl_lib
│   └── nl_lib.js
├── nl_out
│   └── nianio.js
└── nl_sources
    └── nianio.nl
```

# Call nianio function from JS code
* Create and open file `~/project/index.html` with HTML template for simple counter.

```
<html>
	<head>
		<script src="nl_lib/nl_lib.js" type="text/javascript"></script>
		<script src="nl_out/nianio.js" type="text/javascript"></script>
	</head>
	<body>
		<span id='text'></span>
		<br>
		<button onclick='inc_clicked();'>Increment</button>
		<button onclick='print_clicked();'>Print</button>
	</body>
</html>
```
* Create variable for keeping nianio state and initialize it by calling `nianio::initial_state()`.
NianioLang functions can be called from JavaScript code by calling `nl.module.function()`.
To be able to pass `state` as ref to nianio, it is needed to call `nl.imm_ref()` on it.  

```
<script>
	var state = new nl.imm_ref(nl.nianio.initial_state()); // create and initialize nianio state
</script>
```
* Implement `onclick` handlers for buttons. They will simply call nianio function with state and appropriate command.
To call function with arguments from JS, it is needed to use `nl.js_to_imm()` function
to convert JavaScript variables to NianioLang variables. It converts JS ints/strings/bools/arrays to NL
ints/strings/bools/arrays, JS dictionaries with one key "name" to NL variants without value,
JS dictionaries with two keys "name" and "value" to NL variants with value and other JS dictionaries to NL records.

```
<script>
	function inc_clicked() {
		var extcmds = nl.nianio.nianio(state, nl.js_to_imm({name: 'inc', value: 1}));
		handle_extcmds(extcmds);
	}

	function print_clicked() {
		var extcmds = nl.nianio.nianio(state, nl.js_to_imm({name: 'print'}));
		handle_extcmds(extcmds);
	}
</script>
```
* Implement function `handle_extcmds()` which, given NL array of external commands, executes them.
To convert NL variables to JS variables we will use function `nl.imm_to_js()`, which is dual to `nl.js_to_imm()`.
In this example there is only one available external command ‒ `:print_text(text)`, which prints given text on page.

```
<script>
	function handle_extcmds(extcmds) {
		extcmds = nl.imm_to_js(extcmds);
		for (var i = 0; i < extcmds.length; i++) {
			if (extcmds[i].name == 'print_text') {
				document.getElementById('text').innerHTML = extcmds[i].value;
			}
		}
	}
</script>
```
* Complete `index.html` file is below.
It can be visited from browser to show working counter with logic implemented in NianioLang.

```
<html>
	<head>
		<script src="nl_lib/nl_lib.js" type="text/javascript"></script>
		<script src="nl_out/nianio.js" type="text/javascript"></script>
	</head>
	<body>
		<span id='text'></span>
		<br>
		<button onclick='inc_clicked();'>Increment</button>
		<button onclick='print_clicked();'>Print</button>
		<script>
			var state = new nl.imm_ref(nl.nianio.initial_state()); // create and initialize nianio state
				function inc_clicked() {
				var extcmds = nl.nianio.nianio(state, nl.js_to_imm({name: 'inc', value: 1}));
				handle_extcmds(extcmds);
			}

			function print_clicked() {
				var extcmds = nl.nianio.nianio(state, nl.js_to_imm({name: 'print'}));
				handle_extcmds(extcmds);
			}

			function handle_extcmds(extcmds) {
				extcmds = nl.imm_to_js(extcmds);
				for (var i = 0; i < extcmds.length; i++) {
					if (extcmds[i].name == 'print_text') {
						document.getElementById('text').innerHTML = extcmds[i].value;
					}
				}
			}
		</script>
	</body>
</html>
```
Complete project directory tree:
```
~/project
├── index.html
├── nl_lib
│   └── nl_lib.js
├── nl_out
│   └── nianio.js
└── nl_sources
    └── nianio.nl
```

# Nianio function development
* During development of nianio function, after each change in NianioLang files it is necessary to recompile them by calling 
```
/path/to/nl2/mk_cache.exe nl_sources/ --js --o nl_out/
```
In long run it can be tedious, so it is possible to use NianioLang compiler
to automatically check for changes and recompile necessary files.
To run automatic compilation use command
```
/path/to/nl2/mk_cache.exe nl_sources/ --js --o nl_out/ --ide
```
* To add another module, create new `.nl` file, compile project and include generated `.js` file to `index.html`:
```
<script src="nl_out/new_module.js" type="text/javascript"></script>
```

# Type checking
After adding types to NL code, compiler will statically check types of all function calls issued from NianioLang code.
Checking argument types for functions called from JS is possible only in runtime.
To do that, add `ptd::ensure` call at the beginning of each function called from JS:
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
Finally, in JS create dummy state variable and pass it to init function as ref
```
<script>
	var state = new nl.imm_ref(nl.js_to_imm({}));
	nl.nianio.init_state(state);
</script>
```


# Debugging
To enable debugging, add flag `--debug` to NL compilation command.
This allows to show NianioLang code in browser console, set brekpoints on it and peek variables values by moving mouse over 
identifier (the latter only in Chrome).
**Warning: with this option on, NianioLang sources will be available in static files directory. Do not use in production.**
