/*  
 *  (c) Atinea Sp. z o. o.
 *  Stamp: AJF 2014-02-14
*/
var nl_init;

(function(_outer_namespace) {
_outer_namespace.c_rt_lib_init = function(_namespace, undefined) {
	_namespace.c_rt_lib = {};

	(function() {
		var formatter = {
			header: function(x, config) {
				if (typeof config !== 'undefined' && typeof config.imm_disallow !== 'undefined') {
					return null;
				}
				if (typeof x.get_imm_type === 'function') {
					if (x.get_imm_type() == 'int' || x.get_imm_type() == 'string') {
						return ['object', {'object' : x.as_js_str()}];
					}
					return ["span", {}, "Imm: " +   x.get_imm_type()];
				} else {
					return null;
				}
			},
			hasBody: function(x) {
				if (typeof x.get_imm_type === 'function') {
					return true;
				} else {
					return false;
				}
			},
			body: function(x) {
				var object = ["li", {}, 
					['span', {}, 'object: '], 
					['object', {'object' : x, 'config' : {imm_disallow : true}}]];
				var list = ['ol', {}];
				if (x.get_imm_type() == 'ov') {
					list.push(["li", {}, 
							['span', {}, "name : "],
							['object', {'object' : x.ov_get_label()}], 
						]);
					list.push(
						["li", {}, 
							['span', {}, 'value: '], 
							['object', {'object' : x.ov_get_value()}]
						]);
				} else if (x.get_imm_type() == 'int' || x.get_imm_type() == 'string') {
				} else if (x.get_imm_type() == 'array') {
					list.push(x.get_debug_body());
				} else if (x.get_imm_type() == 'hash') {
					list.push(x.get_debug_body());
				}
				list.push(object);
				return list;
			}
		};
		if (typeof window != 'undefined') {
			window.devtoolsFormatters = [formatter];
		}
	  })();

	_namespace.imm_ref = function(x) {
		this.value = x;
	}

	function fromUtf8Array(byte_string) {
		var out = "", i = 0, len = byte_string.length;
		while(i < len) {
			var c = byte_string.charCodeAt(i++);
			switch (c >> 4) { 
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					out += String.fromCharCode(c);
					break;
				case 12: case 13:
					var char2 = byte_string.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					var char2 = byte_string.charCodeAt(i++);
					var char3 = byte_string.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) |
								   ((char2 & 0x3F) << 6) |
								   ((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}
	function toUTF8Array(str) {
		var utf8 = '';
		for (var i = 0; i < str.length; i++) {
			var charcode = str.charCodeAt(i);
			if (charcode < 0x80) {
				utf8 += String.fromCharCode(charcode);
			} else if (charcode < 0x800) {
				utf8 += String.fromCharCode(0xc0 | (charcode >> 6));
				utf8 += String.fromCharCode(0x80 | (charcode & 0x3f));
			} else if (charcode < 0xd800 || charcode >= 0xe000) {
				utf8 += String.fromCharCode(0xe0 | (charcode >> 12));
				utf8 += String.fromCharCode(0x80 | ((charcode>>6) & 0x3f));
				utf8 += String.fromCharCode(0x80 | (charcode & 0x3f));
			} else {
				i++;
				charcode = (0x10000 + (((charcode & 0x3ff)<<10) | (str.charCodeAt(i) & 0x3ff)));
				utf8 += String.fromCharCode(0xf0 | (charcode >> 18));
				utf8 += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
				utf8 += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
				utf8 += String.fromCharCode(0x80 | (charcode & 0x3f));
			}
		}
		return utf8;
	}

	var from_utf8_counter = 0;
	var from_utf8_counter_len = 0;
	var to_utf8_counter = 0;
	var to_utf8_counter_len = 0;


	//NL -> JS
	function from_utf8(str) {
		++from_utf8_counter;
		from_utf8_counter_len += str.length;
		return fromUtf8Array(str);
	}

	//JS -> NL
	function to_utf8(str) {
		++to_utf8_counter;
		to_utf8_counter_len += str.length;
		return toUTF8Array(str);
	}

	_namespace.imm_deep = function(value) {
		if (typeof value == 'string') {
			return _namespace.imm_str(value);
		} else if (typeof value == 'number') {
			return _namespace.imm_int(value);
		} else if (typeof value == 'boolean') {
			return _namespace.c_rt_lib.native_to_nl(value);
		} else if (value instanceof Array) {
			var arr = [];
			for (var i = 0; i < value.length; ++i) {
				arr.push(_namespace.imm_deep(value[i]));
			}
			return _namespace.imm_arr(arr);
		} else if (value instanceof Object) {
			var keys = {};
			for (var key in value) {
				keys[key] = _namespace.imm_deep(value[key]);
			}
			return _namespace.imm_hash(keys);
		} else {
			_namespace.nl_die();
		}
	}

	var arr_counter = 0;
	var push_counter = 0;
	var arr_copy_counter = 0;
	var arr_copy_counter_size = 0;
	_namespace.imm_print_debug = function() {
		return 'arr_counter: ' + arr_counter + "\n" +
			'push_counter: ' + push_counter + "\n" +
			'arr_copy_counter: ' + arr_copy_counter + "\n" +
			'arr_copy_counter_size: ' + arr_copy_counter_size + "\n";
	}

	_namespace.imm_arr = function(v) {
		if (v instanceof Array) {
		} else {
			_namespace.nl_die();
		}

		return new arr_priv(v.slice());
	}

	function arr_priv(v_priv) {
		this.value = v_priv;
		this.max_len = -1;
	};

	arr_priv.prototype.update_value = function() {
		if (this.max_len != -1) {
			this.value = this.value.slice(0, this.max_len);
			arr_copy_counter_size += this.max_len;
			this.max_len = -1;
			++arr_counter;
		}
	}

	arr_priv.prototype.new_array = function() {
		this.update_value();
		++arr_copy_counter;
		return this.value.slice();
	}

	arr_priv.prototype.check_index = function(idx) {
		this.update_value();
		if (idx < 0 || idx >= this.value.length) {
			_namespace.nl_die();
		}
	}

	arr_priv.prototype.get_index = function(idx) {
		this.update_value();
		this.check_index(idx);
		return this.value[idx];
	}

	arr_priv.prototype.set_index = function(idx, value) {
		this.update_value();
		var ret = this.new_array();
		this.check_index(idx);
		ret[idx] = value;
		return _namespace.imm_arr(ret);
	}

	arr_priv.prototype.len = function() {
		this.update_value();
		return this.value.length;
	}

	arr_priv.prototype.push = function(el) {
		this.update_value();
		_namespace.check_null(el);
		this.max_len = this.value.length;
		this.value.push(el);
		++push_counter;
		return new arr_priv(this.value);
	}

	arr_priv.prototype.get_imm_type = function() {
		return 'array';
	}

	arr_priv.prototype.subarray = function(begin, length) {
		this.update_value();
		return new arr_priv(this.value.slice(begin, begin + length));
	}

	arr_priv.prototype.pop = function() {
		this.update_value();
		var ret  = this.new_array();
		ret.pop();
		return new arr_priv(ret);
	}

	arr_priv.prototype.as_arr = function() {
		this.update_value();
		return this.new_array();
	}

	arr_priv.prototype.get_debug_body = function() {
		return ['li', {}, ['span', {}, 'array'],  ['object', {'object' : this.value}]];
	}

	_namespace.imm_ov_js_str = function(str, value) {
		return _namespace.imm_ov(_namespace.imm_str(str), value);
	}

	_namespace.imm_ov = function(n, v) {
		return new ov_priv(n, v);
	}

	function ov_priv(n, v) {
		if (typeof v === 'undefined') {
			v = null;
		}
		this.name = n;
		this.value = v;
		if (this.name.get_imm_type() != 'string') {
			_namespace.nl_die();
		}
	}

	ov_priv.prototype.ov_is = function(label) {
		return this.name.as_byte_string() == label.as_byte_string();
	}

	ov_priv.prototype.ov_has_value = function() {
		return this.value !== null;
	}

	ov_priv.prototype.ov_get_label = function() {
		return this.name;
	}

	ov_priv.prototype.ov_as = function(label) {
		if (this.value === null || this.name.as_byte_string() != label.as_byte_string()) {
			_namespace.nl_die();
		}
		return this.value;
	}

	ov_priv.prototype.ov_get_value = function() {
		return this.value;
	}

	ov_priv.prototype.ov_has_value_nl = function() {
		return this.ov_has_value();
	}
	
	ov_priv.prototype.ov_is_nl = function(label) {
		return this.ov_is(label);
	}

	ov_priv.prototype.get_imm_type = function() {
		return 'ov';
	}

	_namespace.imm_str = function(v) {
		if (typeof v === "string") {
		} else if (typeof v == "number") {
			v = parseFloat(v.toPrecision(15)).toString();
		} else {
			_namespace.nl_die();
		}
		return _namespace.imm_from_byte_string(to_utf8(v));
	}

	_namespace.imm_from_byte_string = function(v) {
		return new str_priv(v);
	}
	
	function str_priv(v) {
		if (typeof v === "string") {
		} else if (typeof v == "number") {
			v = parseFloat(v.toPrecision(15)).toString();
		} else {
			_namespace.nl_die();
		}
		this.value = v;
	}

	str_priv.prototype.as_js_str = function() {
		return from_utf8(this.value);
	}

	str_priv.prototype.as_float = function() {
		return parseFloat(this.value);
	}

	str_priv.prototype.as_int = function() {
		_namespace.nl_die();
	}
	str_priv.prototype.get_imm_type = function() {
		return 'string';
	}

	str_priv.prototype.as_byte_string = function() {
		return this.value;
	}

	
	_namespace.imm_int = function(v) {
		if (isNaN(parseInt(v))) _namespace.nl_die();
		return new _namespace.imm_int_p(parseInt(v));
	}

	_namespace.imm_int_p = function(v) {
		this.v = v;
	}

	_namespace.imm_int_p.prototype.as_js_str = function() {
		return this.v.toString();
	}

	_namespace.imm_int_p.prototype.as_float = function() {
		return this.v;
	}

	_namespace.imm_int_p.prototype.as_int = function() {
		return this.v;
	}

	_namespace.imm_int_p.prototype.get_imm_type = function() {
		return 'int';
	}

	_namespace.imm_int_p.prototype.as_byte_string = function() {
		return this.v.toString();
	}

	function hash_copy(hash) {
		var ret = {};
		for (var key in hash) {
			ret[to_utf8(key)] = hash[key];
		}
		return ret;
	}

	function byte_hash_copy(hash) {
		var ret = {};
		for (var key in hash) {
			ret[key] = hash[key];
		}
		return ret;
	}

	var set_value_counter = 0;
	var copy_counter = 0;
	var copy_counter_size = 0;
	var old_copies = 0;

	_namespace.imm_hash_debug = function() {
		return "set_value_counter: " + set_value_counter + "\n" +
			"copy_counter: " + copy_counter + "\n" +
			"copy_counter_size: " + copy_counter_size + "\n" + 
			"old_copies" + old_copies + "\n";
	}

	function hash_len(hash) {
		return Object.keys(hash).length;
	}

	_namespace.imm_hash = function(v) {
		return new priv_hash(hash_copy(v));
	}

	function priv_hash(priv_v) {
		this.value = priv_v;

		this._old_hash = undefined;
		this._old_key = undefined;
		this._old_value = undefined;
	}

			
	priv_hash.prototype.update_hash = function() {
		if (this.value === undefined) {
			var tmp_hash = this;
			var hash_stack = [tmp_hash];
			while (tmp_hash.value === undefined) {
				++copy_counter;
				tmp_hash = tmp_hash._old_hash;
				hash_stack.push(tmp_hash);
			}
			hash_stack.pop();
			while (hash_stack.length > 0) {
				var current_hash = hash_stack.pop();
				current_hash.value = byte_hash_copy(current_hash._old_hash.value);
				if (current_hash._old_value === undefined) {
					delete current_hash.value[current_hash._old_key];
				} else {
					current_hash.value[current_hash._old_key] = current_hash._old_value;
				}
				current_hash._old_key = undefined;
				current_hash._old_hash = undefined;
				current_hash._old_value = undefined;
			} 
		}
	}

	priv_hash.prototype.new_hash = function() {
		++copy_counter;
		this.update_hash();
		return byte_hash_copy(this.value);
	}

	priv_hash.prototype.get_value_byte_str = function(key) {
		this.update_hash();
		var ret = this.value[key];
		_namespace.check_null(ret);
		return ret;
	}

	priv_hash.prototype.set_value_byte_str = function(key, hash_value) {
		
		this.update_hash();
		_namespace.check_null(hash_value);
		this._old_key = key;
		this._old_value = this.value[key];
		this.value[key] = hash_value;
		this._old_hash = new priv_hash(this.value);
		this.value = undefined;
		++set_value_counter;
		return this._old_hash;
	}

	priv_hash.prototype.has_key = function(key) {
		this.update_hash();
		return key.as_byte_string() in this.value;
	}

	priv_hash.prototype.get_value = function(key) {
		this.update_hash();
		if (key.get_imm_type() != 'string') _namespace.nl_die();
		return this.get_value_byte_str(key.as_byte_string());
	}

	priv_hash.prototype.set_value = function(key, value) {
		this.update_hash();
		return this.set_value_byte_str(key.as_byte_string(), value);
	}

	priv_hash.prototype.delete_key = function(key) {
		this.update_hash();
		var ret = this.new_hash();
		var byte_str = key.as_byte_string();
		delete ret[byte_str];
		return new priv_hash(ret);
	}

	priv_hash.prototype.get_imm_type = function() {
		return 'hash';
	}

	priv_hash.prototype.hash_size = function() {
		this.update_hash();
		return hash_len(this.value);
	}

	priv_hash.prototype.get_debug_body = function() {
		return ['li', {}, ['span', {}, 'hash: '],  ['object', {'object' : this.value}]];
	}

	priv_hash.prototype.get_keys = function() {
		this.update_hash();
		var keys = [];
		for (var key in this.value) {
			keys.push(_namespace.imm_from_byte_string(key));
		}
		return _namespace.imm_arr(keys);
	}

	_namespace.nl_die = function() {
		throw new Error("DIE");
	}

	_namespace.c_rt_lib.array_len = function(arr) {
		return arr.len();
	}

	_namespace.check_null = function(el) {
		if (typeof el === 'undefined') {
			_namespace.nl_die();
		}
	}

	_namespace.c_rt_lib.get_ref_arr = function(arr, ind) {
		return arr.get_index(ind);
	}

	_namespace.c_rt_lib.set_ref_arr = function(/*ref*/arr, ind, value) {
		arr.value = arr.value.set_index(ind, value);
	}


	_namespace.c_rt_lib.hash_get_value = function(hash, key) {
		return hash.get_value(key);
	}

	_namespace.c_rt_lib.hash_set_value = function(/*ref*/hash, key, value) {
		hash.value = hash.value.set_value(key, value);
	}

	_namespace.c_rt_lib.get_ref_hash = function(hash, key) {
		return _namespace.c_rt_lib.hash_get_value(hash, key);
	}

	_namespace.c_rt_lib.set_ref_hash = function(/*ref*/hash, key, value) {
		_namespace.c_rt_lib.hash_set_value(hash, key, value);
	}

	_namespace.c_rt_lib.init_iter = function(hash) {
		return _namespace.imm_hash({
			keys : hash.get_keys(),
			position : _namespace.imm_int(0)});
	}

	_namespace.c_rt_lib.get_key_iter = function(iter) {
		return iter.get_value_byte_str('keys').get_index(iter.get_value_byte_str('position').as_int());
	}

	_namespace.c_rt_lib.is_end_hash = function(iter) {
		return iter.get_value_byte_str('position').as_int() >= 
				iter.get_value_byte_str('keys').len();
	}

	_namespace.c_rt_lib.next_iter = function(iter) {
		return iter.set_value_byte_str('position', 
				_namespace.imm_int(iter.get_value_byte_str('position').as_int() + 1));
	}

	_namespace.c_rt_lib.ov_as = function(ov, name) {
		return ov.ov_as(name);
	}

    _namespace.c_rt_lib.ov_is = function (ov, name) {
		return ov.ov_is_nl(name);
	}

	_namespace.c_rt_lib.ov_has_value = function(ov) {
		return _namespace.c_rt_lib.native_to_nl(ov.ov_has_value_nl());
	}

	_namespace.c_rt_lib.ov_get_value = function(ov) {
		return ov.ov_get_value();
	}

	_namespace.c_rt_lib.ov_get_element = function(ov) {
		return ov.ov_get_label();
	}

	_namespace.c_rt_lib.ov_arg_new = function(name, arg){
		return _namespace.imm_ov(name, arg);
	}

	_namespace.c_rt_lib.ov_none_new = function(name) {
		return _namespace.imm_ov(name, null);
	}

	_namespace.c_rt_lib.ov_mk_arg = function(name, val) {
		return _namespace.imm_ov(name, val);
	}

	_namespace.c_rt_lib.ov_mk_none = function(name) {
		return _namespace.imm_ov_js_str(name, null);
	}

	_namespace.c_rt_lib.check_true = function(bool) {
		return _namespace.c_rt_lib.check_true_native(bool) ? 1 : 0;
	}

	_namespace.c_rt_lib.check_true_native = function(bool) {
		if (bool === c_rt_lib_true) {
			return true;
		} else if (bool === c_rt_lib_false) {
			return false;
		} else {
			return bool.ov_get_label().as_byte_string() == 'TRUE';
		}
	}

	_namespace.c_rt_lib.to_nl = function(bool){
		return _namespace.c_rt_lib.native_to_nl(bool.as_int());
	}


	var c_rt_lib_true = _namespace.c_rt_lib.ov_mk_none('TRUE');
	var c_rt_lib_false = _namespace.c_rt_lib.ov_mk_none('FALSE');

	_namespace.c_rt_lib.get_false = function() {
		return c_rt_lib_false;
	}

	_namespace.c_rt_lib.get_true = function() {
		return c_rt_lib_true;
	}

	_namespace.c_rt_lib.native_to_nl = function(bool) {
		return bool ? _namespace.c_rt_lib.get_true() : _namespace.c_rt_lib.get_false();
	}

	_namespace.c_rt_lib.array_push = function(/*ref*/arr, el) {
		arr.value = arr.value.push(el);
	}

	_namespace.c_rt_lib.imm_to_float = function(el) {
		return el.as_float();
	}

	_namespace.c_rt_lib.imm_to_int = function(el) {
		return el.as_int();
	}

	var concat_counter = 0;
	_namespace.c_rt_lib.concat = function(l, r) {
		++concat_counter;
		return _namespace.imm_from_byte_string(l.as_byte_string() + r.as_byte_string());
	}

	_namespace.c_rt_lib.eq = function(l, r) {
		return l.as_byte_string() == r.as_byte_string();
	}

	_namespace.c_rt_lib.ne = function(l, r) {
		return l.as_byte_string() != r.as_byte_string();
	}

	_namespace.c_rt_lib.float_round = function(imm_s) {
		return _namespace.imm_str(Math.round(Number(imm_s.as_byte_string())));
	}

	_namespace.c_rt_lib.float_fixed_str = function(imm_s) {
		return _namespace.imm_str(Number(imm_s.as_byte_string()).toFixed(20));
	}

	_namespace.c_rt_lib.bool_not = function(arg) {
		return _namespace.c_rt_lib.native_to_nl(!_namespace.c_rt_lib.check_true_native(arg));
	}

	_namespace.c_rt_lib.str_float_add = function(lhs, rhs) {
		return _namespace.imm_str(lhs.as_float() + rhs.as_float());
	}

	_namespace.c_rt_lib.str_float_mul = function(lhs, rhs) {
		return _namespace.imm_str(lhs.as_float() * rhs.as_float());
	}

	_namespace.c_rt_lib.str_float_sub = function(lhs, rhs) {
		return _namespace.imm_str(lhs.as_float() - rhs.as_float());
	}

	_namespace.c_rt_lib.str_float_div = function(lhs, rhs) {
		return _namespace.imm_str(lhs.as_float() / rhs.as_float());
	}

	_namespace.c_rt_lib.str_float_eq = function(lhs, rhs) {
		return lhs.as_float() == rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_ne = function(lhs, rhs) {
		return lhs.as_float() != rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_gt = function(lhs, rhs) {
		return lhs.as_float() > rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_lt = function(lhs, rhs) {
		return lhs.as_float() < rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_geq = function(lhs, rhs) {
		return lhs.as_float() >= rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_leq = function(lhs, rhs) {
		return lhs.as_float() <= rhs.as_float();
	}

	_namespace.c_rt_lib.str_float_mod = function(lhs, rhs) {
		return _namespace.imm_str(lhs.as_float() % rhs.as_float());
	}

	_namespace.js_to_imm = function(obj) {
		if (typeof obj === 'boolean') {
			return _namespace.c_rt_lib.native_to_nl(obj);
		} else if(typeof obj === 'number') {
			return _namespace.imm_int(obj);
		} else if(typeof obj === 'string') {
			return _namespace.imm_str(obj);
		} else if(typeof obj === 'object') {
			if (obj.constructor === Array) {
				var arr = [];
				for (var i = 0; i < obj.length; i++) {
					arr.push(_namespace.js_to_imm(obj[i]));
				}
				return _namespace.imm_arr(arr);
			} else if (Object.keys(obj).length == 1 && 'name' in obj) {
				return _namespace.c_rt_lib.ov_mk_none(obj.name);
			} else if (Object.keys(obj).length == 2 && 'name' in obj && 'value' in obj) {
				return _namespace.c_rt_lib.ov_mk_arg(_namespace.imm_str(obj.name), _namespace.js_to_imm(obj.value));
			} else {
				var keys = {};
				for (var key in obj) {
					keys[key] = _namespace.js_to_imm(obj[key]);
				}
				return _namespace.imm_hash(keys);
			}
		} else {
			_namespace.nl_die();
		}
	}

	_namespace.imm_to_js = function(imm) {
		if (imm.get_imm_type() == 'array') {
			var arr = [];
			for (var i = 0; i < imm.value.length; i++) {
				arr.push(_namespace.imm_to_js(imm.value[i]));
			}
			return arr;
		} else if (imm.get_imm_type() == 'hash') {
			var keys = {};
			for (var key in imm.value) {
				keys[key] = _namespace.imm_to_js(imm.value[key])
			}
			return keys;
		} else if (imm.get_imm_type() == 'int') {
			return imm.as_int();
		} else if (imm.get_imm_type() == 'string') {
			return imm.as_js_str();
		} else if (imm.get_imm_type() == 'ov') {
			if(imm.value === null) {
				return {
					name: imm.name.as_js_str(),
				};
			} else if (imm.value == 'TRUE') {
				return true;
			} else if (imm.value == 'FALSE') {
				return false;
			} else {
				return {
					name: imm.name.as_js_str(),
					value: _namespace.imm_to_js(imm.value)
				};
			}
		} else {
			_namespace.nl_die();
		}
	}

    _namespace.json_to_imm = function (obj) {
        if (typeof obj === 'boolean') {
            return _namespace.c_rt_lib.native_to_nl(obj);
        } else if (typeof obj === 'number') {
            return _namespace.imm_int(obj);
        } else if (typeof obj === 'string') {
            return _namespace.imm_str(obj);
        } else if (typeof obj === 'object') {
            if (obj.constructor === Array) {
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    arr.push(_namespace.json_to_imm(obj[i]));
                }
                return _namespace.imm_arr(arr);
            } else if (Object.keys(obj).length == 1 && Object.keys(obj)[0].startsWith('ov.')) {
                var name = Object.keys(obj)[0].substring(3);
                if (obj[Object.keys(obj)[0]] == null) {
                    return _namespace.c_rt_lib.ov_mk_none(name);
                } else {
                    return _namespace.c_rt_lib.ov_mk_arg(_namespace.imm_str(name), _namespace.json_to_imm(obj[Object.keys(obj)[0]]));
                }
            } else {
                var keys = {};
                for (var key in obj) {
                    keys[key] = _namespace.json_to_imm(obj[key]);
                }
                return _namespace.imm_hash(keys);
            }
        } else {
            _namespace.nl_die();
        }
    }

    _namespace.imm_to_json = function (imm) {
        if (imm.get_imm_type() == 'array') {
            var arr = [];
            for (var i = 0; i < imm.value.length; i++) {
                arr.push(_namespace.imm_to_json(imm.value[i]));
            }
            return arr;
        } else if (imm.get_imm_type() == 'hash') {
            var keys = {};
            for (var key in imm.value) {
                keys[key] = _namespace.imm_to_json(imm.value[key])
            }
            return keys;
        } else if (imm.get_imm_type() == 'int') {
            return imm.as_int();
        } else if (imm.get_imm_type() == 'string') {
            return imm.as_js_str();
        } else if (imm.get_imm_type() == 'ov') {
            if (imm.name.value == 'TRUE') {
                return true;
            } else if (imm.name.value == 'FALSE') {
                return false;
            } else if (imm.value === null) {
                return {
                    [`ov.${imm.name.as_js_str()}`]: null,
                };
            } else {
                return {
                    [`ov.${imm.name.as_js_str()}`]: _namespace.imm_to_json(imm.value),
                };
            }
        } else {
            _namespace.nl_die();
        }
    }

}})(nl_init=nl_init || {});
/*  
 *  (c) Atinea Sp. z o. o.
 *  Stamp: AJF 2014-02-14
*/
var nl_init;

(function(_outer_namespace) {
_outer_namespace.c_std_lib_init = function(_namespace, undefined) {
	_namespace.c_std_lib = {};

	_namespace.c_std_lib.fast_substr = function(sarr, start, length) {
		if (sarr.len() != 1)
			nl_die();
		return _namespace.c_std_lib.string_sub(sarr.get_index(0), start, length);
	}

	_namespace.c_std_lib.array_sub = function(array, begin, length) {
		return array.subarray(begin, length);
	}

	_namespace.c_std_lib.array_sort = function(arr, func) {
		var result = arr.as_arr();
		var f = window[_namespace.c_std_lib_priv.get_fun_name(func)];
		result.sort(function(a, b) {
			return _namespace.c_rt_lib.check_true_native(f(a, b));
		});
		return _namespace.imm_arr(result);
	}

	_namespace.c_std_lib.array_push = function(/*ref*/arr, el) {
		arr.value = arr.value.push(el);
	}

	_namespace.c_std_lib.array_len = function(arr) {
		return _namespace.c_rt_lib.array_len(arr);
	}

	_namespace.c_std_lib.array_pop = function(/*ref*/arr) {
		arr.value = arr.value.pop();
	}

	_namespace.c_std_lib.hash_get_value = function(hash, key) {
		return _namespace.c_rt_lib.hash_get_value(hash, key);
	}

	_namespace.c_std_lib.hash_has_key = function(hash, key) {
		return hash.has_key(key);
	}

	_namespace.c_std_lib.hash_set_value = function(/*ref*/hash, key, value) {
		_namespace.c_rt_lib.hash_set_value(hash, key, value);
	}

	_namespace.c_std_lib.hash_delete = function(/*ref*/hash, key) {
		hash.value = hash.value.delete_key(key);
	}

	_namespace.c_std_lib.hash_size = function(hash) {
		return hash.hash_size();
	}

	_namespace.c_std_lib.string_chr = function(code) {
		return _namespace.imm_str(String.fromCharCode(code));
	}

	_namespace.c_std_lib.string_ord = function(str) {
		return str.as_byte_string().charCodeAt(0);
	}

	_namespace.c_std_lib.string_length = function(s) {
		return s.as_byte_string().length;
	}

	_namespace.c_std_lib.string_index = function(str, substr, start) {
		return str.as_byte_string().indexOf(substr.as_byte_string(), start);
	}

	_namespace.c_std_lib.string_sub = function(str, start, length) {
		return _namespace.imm_from_byte_string(str.as_byte_string().substring(start, start + length));
	}

	_namespace.c_std_lib.string_replace = function(str, old, new_part) {
		var find = old.as_byte_string().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		return _namespace.imm_from_byte_string(str.as_byte_string().replace(new RegExp(find, 'g'), new_part.as_byte_string()));
	}

	_namespace.c_std_lib.string_escape2hex31 = function(str) {
		var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
		var byte_str = str.as_byte_string();
		var result = '';
		var i = 0;
		var last = 0;
		while (i < byte_str.length) {
			while (i < byte_str.length && byte_str.charCodeAt(i) >= 32)
				++i;
			var x = '';
			if (i < byte_str.length)
				x = '\\x' + digits[Math.floor(byte_str.charCodeAt(i) / 16)] + digits[byte_str.charCodeAt(i) % 16];
			result += byte_str.substring(last, i) + x;
			last = ++i;
		}
		return _namespace.imm_from_byte_string(result);
	}

	_namespace.c_std_lib.string_compare = function(a, b) {
		if (a.as_byte_string() != b.as_byte_string())
			return a.as_byte_string() > b.as_byte_string() ? 1 : -1;
		return 0;
	}

	_namespace.c_std_lib.is_array = function(imm) {
		return imm.get_imm_type() == 'array';
	}

	_namespace.c_std_lib.is_hash = function(imm) {
		return imm.get_imm_type() == 'hash';
	}

	_namespace.c_std_lib.is_int = function(imm) {
		return imm.get_imm_type() == 'int';
	}

	_namespace.c_std_lib.is_string = function(imm) {
		return imm.get_imm_type() == 'string';
	}

	_namespace.c_std_lib.is_printable = function(imm) {
		return imm.get_imm_type() == 'int' || imm.get_imm_type() == 'string';
	}

	_namespace.c_std_lib.is_variant = function(imm) {
		return imm.get_imm_type() == 'ov';
	}

	_namespace.c_std_lib.exec = function(func, /*ref*/arr) {
		func = func.ov_as(_namespace.imm_str('ref'));
		return _namespace[func.get_value_byte_str('module').as_byte_string()]['__dyn_' + func.get_value_byte_str('name').as_byte_string()].apply(null, [arr]);
	}

	_namespace.c_std_lib.int_to_string = function(imm) {
		return _namespace.imm_str(imm);
	}

	_namespace.c_std_lib.try_string_to_int = function(imm) {
		if (isNaN(parseInt(imm.as_js_str())))
			return _namespace.imm_ov_js_str('err', _namespace.imm_str('Invalid number'));
		return _namespace.imm_ov_js_str('ok', _namespace.imm_int(imm.as_js_str()));
	}

	_namespace.c_std_lib.print = function(imm) {
		console.log(imm.as_js_str());
	}
}})(nl_init = nl_init || {});
var nl;
(function(n , undefined) {
n.array={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.array.subarray=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var int2=___arg__2;
n.check_null(int2);
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 9
im3=n.c_std_lib.array_sub(im0,int1,int2);
//line 9
im0=null;
//line 9
int1=null;
//line 9
int2=null;
//line 9
return im3;
//line 9
im0=null;
//line 9
int1=null;
//line 9
int2=null;
//line 9
im3=null;
//line 9
return null;
}}}

n.array.__dyn_subarray=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1).as_int();
var arg2=arr.value.get_index(2).as_int();
var ret = n.array.subarray(arg0, arg1, arg2)
return ret;
}

n.array.reverse=function(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=null;
var int2=null;
var int3=null;
var int4=null;
var bool5=null;
var im6=null;
var int7=null;
var int8=null;
var int9=null;
var int10=null;
var label=null;
while (1) { switch (label) {
default:
//line 13
im1=n.imm_arr([]);
//line 14
int2=n.c_rt_lib.array_len(im0);;
//line 14
int3=0;
//line 14
int4=1;
//line 14
case 4:
//line 14
bool5=int3>=int2;
//line 14
if (bool5) {label = 20; continue;}
//line 15
int9=n.c_rt_lib.array_len(im0);;
//line 15
int8=Math.floor(int9-int3);
//line 15
int9=null;
//line 15
int10=1;
//line 15
int7=Math.floor(int8-int10);
//line 15
int8=null;
//line 15
int10=null;
//line 15
im6=im0.get_index(int7);
//line 15
int7=null;
//line 15
var call_2_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_2_1,im6);im1=call_2_1.value;call_2_1=null;;
//line 15
im6=null;
//line 16
int3=Math.floor(int3+int4);
//line 16
label = 4; continue;
//line 16
case 20:
//line 17
im0=im1
//line 17
im1=null;
//line 17
int2=null;
//line 17
int3=null;
//line 17
int4=null;
//line 17
bool5=null;
//line 17
___arg__0.value = im0;return null;
}}}

n.array.__dyn_reverse=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var ret = n.array.reverse(arg0)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.join=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var int5=null;
var int6=null;
var int7=null;
var bool8=null;
var im9=null;
var bool10=null;
var label=null;
while (1) { switch (label) {
default:
//line 21
im2=c[0];
//line 22
bool3=true;
//line 23
int5=0;
//line 23
int6=1;
//line 23
int7=n.c_rt_lib.array_len(im1);;
//line 23
case 5:
//line 23
bool8=int5>=int7;
//line 23
if (bool8) {label = 23; continue;}
//line 23
im9=im1.get_index(int5);
//line 23
im4=im9
//line 24
bool10=bool3
//line 24
bool10=!bool10
//line 24
bool10=!bool10
//line 24
if (bool10) {label = 16; continue;}
//line 24
im2=n.c_rt_lib.concat(im2,im0);;
//line 24
label = 16; continue;
//line 24
case 16:
//line 24
bool10=null;
//line 25
im2=n.c_rt_lib.concat(im2,im4);;
//line 26
bool3=false;
//line 26
im4=null;
//line 27
int5=Math.floor(int5+int6);
//line 27
label = 5; continue;
//line 27
case 23:
//line 28
im0=null;
//line 28
im1=null;
//line 28
bool3=null;
//line 28
im4=null;
//line 28
int5=null;
//line 28
int6=null;
//line 28
int7=null;
//line 28
bool8=null;
//line 28
im9=null;
//line 28
return im2;
//line 28
im0=null;
//line 28
im1=null;
//line 28
im2=null;
//line 28
bool3=null;
//line 28
im4=null;
//line 28
int5=null;
//line 28
int6=null;
//line 28
int7=null;
//line 28
bool8=null;
//line 28
im9=null;
//line 28
return null;
}}}

n.array.__dyn_join=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.array.join(arg0, arg1)
return ret;
}

n.array.remove=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=null;
var int3=null;
var int4=null;
var int5=null;
var bool6=null;
var int7=null;
var im8=null;
var int9=null;
var label=null;
while (1) { switch (label) {
default:
//line 32
int3=0;
//line 32
im2=n.array.subarray(im0,int3,int1);
//line 32
int3=null;
//line 33
int5=1;
//line 33
int4=Math.floor(int1+int5);
//line 33
int5=null;
//line 33
case 6:
//line 33
int7=n.c_rt_lib.array_len(im0);;
//line 33
bool6=int4<int7;
//line 33
int7=null;
//line 33
bool6=!bool6
//line 33
if (bool6) {label = 19; continue;}
//line 34
im8=im0.get_index(int4);
//line 34
var call_2_1=new n.imm_ref(im2);n.array.push(call_2_1,im8);im2=call_2_1.value;call_2_1=null;
//line 34
im8=null;
//line 33
int9=1;
//line 33
int4=Math.floor(int4+int9);
//line 33
int9=null;
//line 35
label = 6; continue;
//line 35
case 19:
//line 36
im0=im2
//line 36
int1=null;
//line 36
im2=null;
//line 36
int4=null;
//line 36
bool6=null;
//line 36
___arg__0.value = im0;return null;
}}}

n.array.__dyn_remove=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1).as_int();
var ret = n.array.remove(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.insert=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var int4=null;
var im5=null;
var bool6=null;
var int7=null;
var int8=null;
var im9=null;
var int10=null;
var int11=null;
var int12=null;
var int13=null;
var label=null;
while (1) { switch (label) {
default:
//line 40
int4=0;
//line 40
im3=n.array.subarray(im0,int4,int1);
//line 40
int4=null;
//line 41
var call_1_1=new n.imm_ref(im3);n.array.push(call_1_1,im2);im3=call_1_1.value;call_1_1=null;
//line 42
im5=n.imm_int(int1)
//line 42
case 5:
//line 42
int7=n.c_rt_lib.array_len(im0);;
//line 42
int8=im5.as_int();
//line 42
bool6=int8<int7;
//line 42
int7=null;
//line 42
int8=null;
//line 42
bool6=!bool6
//line 42
if (bool6) {label = 26; continue;}
//line 43
int10=im5.as_int();
//line 43
im9=im0.get_index(int10);
//line 43
int10=null;
//line 43
var call_3_1=new n.imm_ref(im3);n.array.push(call_3_1,im9);im3=call_3_1.value;call_3_1=null;
//line 43
im9=null;
//line 42
int11=1;
//line 42
int12=im5.as_int();
//line 42
int13=Math.floor(int12+int11);
//line 42
im5=n.imm_int(int13)
//line 42
int11=null;
//line 42
int12=null;
//line 42
int13=null;
//line 44
label = 5; continue;
//line 44
case 26:
//line 45
im0=im3
//line 45
int1=null;
//line 45
im2=null;
//line 45
im3=null;
//line 45
im5=null;
//line 45
bool6=null;
//line 45
___arg__0.value = im0;return null;
}}}

n.array.__dyn_insert=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1).as_int();
var arg2=arr.value.get_index(2);
var ret = n.array.insert(arg0, arg1, arg2)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.push=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var label=null;
while (1) { switch (label) {
default:
//line 49
var call_0_1=new n.imm_ref(im0);n.c_std_lib.array_push(call_0_1,im1);im0=call_0_1.value;call_0_1=null;
//line 49
im1=null;
//line 49
___arg__0.value = im0;return null;
}}}

n.array.__dyn_push=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.array.push(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.add=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 53
im2=im0
//line 54
var call_0_1=new n.imm_ref(im2);n.array.push(call_0_1,im1);im2=call_0_1.value;call_0_1=null;
//line 55
im0=null;
//line 55
im1=null;
//line 55
return im2;
//line 55
im0=null;
//line 55
im1=null;
//line 55
im2=null;
//line 55
return null;
}}}

n.array.__dyn_add=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.array.add(arg0, arg1)
return ret;
}

n.array.unshift=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 59
im2=n.imm_arr([im1,]);
//line 60
var call_0_1=new n.imm_ref(im2);n.array.append(call_0_1,im0);im2=call_0_1.value;call_0_1=null;
//line 61
im0=im2
//line 61
im1=null;
//line 61
im2=null;
//line 61
___arg__0.value = im0;return null;
}}}

n.array.__dyn_unshift=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.array.unshift(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.shift=function(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=null;
var int2=null;
var bool3=null;
var int4=null;
var im5=null;
var int6=null;
var label=null;
while (1) { switch (label) {
default:
//line 65
im1=n.imm_arr([]);
//line 66
int2=1;
//line 66
case 2:
//line 66
int4=n.c_rt_lib.array_len(im0);;
//line 66
bool3=int2<int4;
//line 66
int4=null;
//line 66
bool3=!bool3
//line 66
if (bool3) {label = 15; continue;}
//line 67
im5=im0.get_index(int2);
//line 67
var call_1_1=new n.imm_ref(im1);n.c_rt_lib.array_push(call_1_1,im5);im1=call_1_1.value;call_1_1=null;;
//line 67
im5=null;
//line 66
int6=1;
//line 66
int2=Math.floor(int2+int6);
//line 66
int6=null;
//line 68
label = 2; continue;
//line 68
case 15:
//line 69
int2=null;
//line 69
bool3=null;
//line 69
___arg__0.value = im0;return im1;
//line 69
im1=null;
//line 69
int2=null;
//line 69
bool3=null;
//line 69
___arg__0.value = im0;return null;
}}}

n.array.__dyn_shift=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var ret = n.array.shift(arg0)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.pop=function(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var label=null;
while (1) { switch (label) {
default:
//line 73
var call_0_1=new n.imm_ref(im0);n.c_std_lib.array_pop(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 73
___arg__0.value = im0;return null;
}}}

n.array.__dyn_pop=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var ret = n.array.pop(arg0)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.append=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var int3=null;
var int4=null;
var int5=null;
var bool6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 77
int3=0;
//line 77
int4=1;
//line 77
int5=n.c_rt_lib.array_len(im1);;
//line 77
case 3:
//line 77
bool6=int3>=int5;
//line 77
if (bool6) {label = 12; continue;}
//line 77
im7=im1.get_index(int3);
//line 77
im2=im7
//line 78
var call_1_1=new n.imm_ref(im0);n.array.push(call_1_1,im2);im0=call_1_1.value;call_1_1=null;
//line 78
im2=null;
//line 79
int3=Math.floor(int3+int4);
//line 79
label = 3; continue;
//line 79
case 12:
//line 79
im1=null;
//line 79
im2=null;
//line 79
int3=null;
//line 79
int4=null;
//line 79
int5=null;
//line 79
bool6=null;
//line 79
im7=null;
//line 79
___arg__0.value = im0;return null;
}}}

n.array.__dyn_append=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.array.append(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.join_arr=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 83
im2=im0
//line 84
var call_0_1=new n.imm_ref(im2);n.array.append(call_0_1,im1);im2=call_0_1.value;call_0_1=null;
//line 85
im0=null;
//line 85
im1=null;
//line 85
return im2;
//line 85
im0=null;
//line 85
im1=null;
//line 85
im2=null;
//line 85
return null;
}}}

n.array.__dyn_join_arr=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.array.join_arr(arg0, arg1)
return ret;
}

n.array.len=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var label=null;
while (1) { switch (label) {
default:
//line 89
int1=n.c_std_lib.array_len(im0);
//line 89
im0=null;
//line 89
return int1;
//line 89
im0=null;
//line 89
int1=null;
//line 89
return null;
}}}

n.array.__dyn_len=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.imm_int(n.array.len(arg0))
return ret;
}

n.array.is_empty=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var int2=null;
var int3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 93
int2=n.c_rt_lib.array_len(im0);;
//line 93
int3=0;
//line 93
bool1=int2==int3;
//line 93
int2=null;
//line 93
int3=null;
//line 93
im4=n.c_rt_lib.native_to_nl(bool1)
//line 93
im0=null;
//line 93
bool1=null;
//line 93
return im4;
//line 93
im0=null;
//line 93
bool1=null;
//line 93
im4=null;
//line 93
return null;
}}}

n.array.__dyn_is_empty=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.array.is_empty(arg0)
return ret;
}

n.array.cmp=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 97
int3=n.c_std_lib.string_compare(im0,im1);
//line 97
int4=0;
//line 97
bool2=int3<int4;
//line 97
int3=null;
//line 97
int4=null;
//line 97
im5=n.c_rt_lib.native_to_nl(bool2)
//line 97
im0=null;
//line 97
im1=null;
//line 97
bool2=null;
//line 97
return im5;
//line 97
im0=null;
//line 97
im1=null;
//line 97
bool2=null;
//line 97
im5=null;
//line 97
return null;
}}}

n.array.__dyn_cmp=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.array.cmp(arg0, arg1)
return ret;
}

n.array.sort=function(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 101
im1=n.imm_hash({"module":n.imm_str("array"),"name":n.imm_str("cmp"),});
//line 101
im1=n.c_rt_lib.ov_mk_arg(c[1],im1);;
//line 101
var call_1_1=new n.imm_ref(im0);_prv_sort(call_1_1,im1);im0=call_1_1.value;call_1_1=null;
//line 101
im1=null;
//line 101
___arg__0.value = im0;return null;
}}}

n.array.__dyn_sort=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var ret = n.array.sort(arg0)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.sort_comparator=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var label=null;
while (1) { switch (label) {
default:
//line 105
var call_0_1=new n.imm_ref(im0);_prv_sort(call_0_1,im1);im0=call_0_1.value;call_0_1=null;
//line 105
im1=null;
//line 105
___arg__0.value = im0;return null;
}}}

n.array.__dyn_sort_comparator=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.array.sort_comparator(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.array.equal=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var bool5=null;
var int6=null;
var int7=null;
var int8=null;
var bool9=null;
var bool10=null;
var im11=null;
var im12=null;
var bool13=null;
var bool14=null;
var label=null;
while (1) { switch (label) {
default:
//line 109
int3=n.c_rt_lib.array_len(im0);;
//line 109
int4=n.c_rt_lib.array_len(im1);;
//line 109
bool2=int3==int4;
//line 109
int3=null;
//line 109
int4=null;
//line 109
bool2=!bool2
//line 109
bool2=!bool2
//line 109
if (bool2) {label = 14; continue;}
//line 109
bool5=false;
//line 109
im0=null;
//line 109
im1=null;
//line 109
bool2=null;
//line 109
return bool5;
//line 109
label = 14; continue;
//line 109
case 14:
//line 109
bool2=null;
//line 109
bool5=null;
//line 110
int6=n.c_rt_lib.array_len(im0);;
//line 110
int7=0;
//line 110
int8=1;
//line 110
case 20:
//line 110
bool9=int7>=int6;
//line 110
if (bool9) {label = 46; continue;}
//line 111
im11=im0.get_index(int7);
//line 111
im12=im1.get_index(int7);
//line 111
bool10=n.c_rt_lib.eq(im11, im12)
//line 111
im11=null;
//line 111
im12=null;
//line 111
bool10=!bool10
//line 111
bool10=!bool10
//line 111
if (bool10) {label = 41; continue;}
//line 111
bool13=false;
//line 111
im0=null;
//line 111
im1=null;
//line 111
int6=null;
//line 111
int7=null;
//line 111
int8=null;
//line 111
bool9=null;
//line 111
bool10=null;
//line 111
return bool13;
//line 111
label = 41; continue;
//line 111
case 41:
//line 111
bool10=null;
//line 111
bool13=null;
//line 112
int7=Math.floor(int7+int8);
//line 112
label = 20; continue;
//line 112
case 46:
//line 113
bool14=true;
//line 113
im0=null;
//line 113
im1=null;
//line 113
int6=null;
//line 113
int7=null;
//line 113
int8=null;
//line 113
bool9=null;
//line 113
return bool14;
//line 113
im0=null;
//line 113
im1=null;
//line 113
int6=null;
//line 113
int7=null;
//line 113
int8=null;
//line 113
bool9=null;
//line 113
bool14=null;
//line 113
return null;
}}}

n.array.__dyn_equal=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.array.equal(arg0, arg1))
return ret;
}

function _prv_sort(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var int3=null;
var bool4=null;
var int5=null;
var int6=null;
var int7=null;
var bool8=null;
var int9=null;
var int10=null;
var int11=null;
var bool12=null;
var int13=null;
var int14=null;
var int15=null;
var bool16=null;
var int17=null;
var int18=null;
var bool19=null;
var int20=null;
var int21=null;
var bool22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var int30=null;
var int31=null;
var int32=null;
var int33=null;
var int34=null;
var bool35=null;
var int36=null;
var int37=null;
var im38=null;
var int39=null;
var int40=null;
var int41=null;
var bool42=null;
var bool43=null;
var im44=null;
var int45=null;
var im46=null;
var int47=null;
var im48=null;
var im49=null;
var im50=null;
var im51=null;
var int52=null;
var im53=null;
var int54=null;
var int55=null;
var int56=null;
var int57=null;
var bool58=null;
var im59=null;
var im60=null;
var int61=null;
var int62=null;
var label=null;
while (1) { switch (label) {
default:
//line 117
int2=n.c_rt_lib.array_len(im0);;
//line 118
int3=2;
//line 118
case 2:
//line 118
int6=2;
//line 118
int5=Math.floor(int6*int2);
//line 118
int6=null;
//line 118
bool4=int3<int5;
//line 118
int5=null;
//line 118
bool4=!bool4
//line 118
if (bool4) {label = 217; continue;}
//line 119
int7=0;
//line 119
case 11:
//line 119
bool8=int7<int2;
//line 119
bool8=!bool8
//line 119
if (bool8) {label = 200; continue;}
//line 120
int10=Math.floor(int7+int3);
//line 120
int11=1;
//line 120
int9=Math.floor(int10-int11);
//line 120
int10=null;
//line 120
int11=null;
//line 121
int14=1;
//line 121
int13=Math.floor(int2-int14);
//line 121
int14=null;
//line 121
bool12=int9>int13;
//line 121
int13=null;
//line 121
bool12=!bool12
//line 121
if (bool12) {label = 31; continue;}
//line 121
int15=1;
//line 121
int9=Math.floor(int2-int15);
//line 121
int15=null;
//line 121
label = 31; continue;
//line 121
case 31:
//line 121
bool12=null;
//line 122
int17=Math.floor(int9-int7);
//line 122
int18=0;
//line 122
bool16=int17<=int18;
//line 122
int17=null;
//line 122
int18=null;
//line 122
bool16=!bool16
//line 122
if (bool16) {label = 44; continue;}
//line 122
int9=null;
//line 122
bool16=null;
//line 122
label = 197; continue;
//line 122
label = 44; continue;
//line 122
case 44:
//line 122
bool16=null;
//line 123
int20=Math.floor(int9-int7);
//line 123
int21=1;
//line 123
bool19=int20==int21;
//line 123
int20=null;
//line 123
int21=null;
//line 123
bool19=!bool19
//line 123
if (bool19) {label = 83; continue;}
//line 124
im23=im0.get_index(int7);
//line 124
im24=im0.get_index(int9);
//line 124
im25=_prv_exec(im1,im23,im24);
//line 124
bool22=n.c_rt_lib.check_true_native(im25);;
//line 124
im23=null;
//line 124
im24=null;
//line 124
im25=null;
//line 124
bool22=!bool22
//line 124
if (bool22) {label = 67; continue;}
//line 124
int9=null;
//line 124
bool19=null;
//line 124
bool22=null;
//line 124
label = 197; continue;
//line 124
label = 67; continue;
//line 124
case 67:
//line 124
bool22=null;
//line 125
im26=im0.get_index(int7);
//line 126
im27=im0.get_index(int9);
//line 126
im28=im27
//line 126
var call_3_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_arr(call_3_1,int7,im28);im0=call_3_1.value;call_3_1=null;;
//line 126
im27=null;
//line 126
im28=null;
//line 127
im29=im26
//line 127
var call_4_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_arr(call_4_1,int9,im29);im0=call_4_1.value;call_4_1=null;;
//line 127
im29=null;
//line 128
int9=null;
//line 128
bool19=null;
//line 128
im26=null;
//line 128
label = 197; continue;
//line 129
label = 83; continue;
//line 129
case 83:
//line 129
bool19=null;
//line 129
im26=null;
//line 130
int33=1;
//line 130
int32=Math.floor(int3-int33);
//line 130
int33=null;
//line 130
int34=2;
//line 130
int31=Math.floor(int32/int34);
//line 130
int32=null;
//line 130
int34=null;
//line 130
int30=Math.floor(int7+int31);
//line 130
int31=null;
//line 131
int37=1;
//line 131
int36=Math.floor(int2-int37);
//line 131
int37=null;
//line 131
bool35=int30>int36;
//line 131
int36=null;
//line 131
bool35=!bool35
//line 131
if (bool35) {label = 107; continue;}
//line 131
int9=null;
//line 131
int30=null;
//line 131
bool35=null;
//line 131
label = 197; continue;
//line 131
label = 107; continue;
//line 131
case 107:
//line 131
bool35=null;
//line 132
im38=n.imm_arr([]);
//line 133
int39=int7
//line 134
int41=1;
//line 134
int40=Math.floor(int30+int41);
//line 134
int41=null;
//line 135
case 114:
//line 135
bool42=int39<=int30;
//line 135
if (bool42) {label = 118; continue;}
//line 135
bool42=int40<=int9;
//line 135
case 118:
//line 135
bool42=!bool42
//line 135
if (bool42) {label = 170; continue;}
//line 136
bool43=int39>int30;
//line 136
bool43=!bool43
//line 136
if (bool43) {label = 131; continue;}
//line 137
im44=im0.get_index(int40);
//line 137
var call_5_1=new n.imm_ref(im38);n.array.push(call_5_1,im44);im38=call_5_1.value;call_5_1=null;
//line 137
im44=null;
//line 138
int45=1;
//line 138
int40=Math.floor(int40+int45);
//line 138
int45=null;
//line 139
label = 167; continue;
//line 139
case 131:
//line 139
bool43=int40>int9;
//line 139
bool43=!bool43
//line 139
if (bool43) {label = 142; continue;}
//line 140
im46=im0.get_index(int39);
//line 140
var call_6_1=new n.imm_ref(im38);n.array.push(call_6_1,im46);im38=call_6_1.value;call_6_1=null;
//line 140
im46=null;
//line 141
int47=1;
//line 141
int39=Math.floor(int39+int47);
//line 141
int47=null;
//line 142
label = 167; continue;
//line 142
case 142:
//line 142
im48=im0.get_index(int39);
//line 142
im49=im0.get_index(int40);
//line 142
im50=_prv_exec(im1,im48,im49);
//line 142
bool43=n.c_rt_lib.check_true_native(im50);;
//line 142
im48=null;
//line 142
im49=null;
//line 142
im50=null;
//line 142
bool43=!bool43
//line 142
if (bool43) {label = 159; continue;}
//line 143
im51=im0.get_index(int39);
//line 143
var call_9_1=new n.imm_ref(im38);n.array.push(call_9_1,im51);im38=call_9_1.value;call_9_1=null;
//line 143
im51=null;
//line 144
int52=1;
//line 144
int39=Math.floor(int39+int52);
//line 144
int52=null;
//line 145
label = 167; continue;
//line 145
case 159:
//line 146
im53=im0.get_index(int40);
//line 146
var call_10_1=new n.imm_ref(im38);n.array.push(call_10_1,im53);im38=call_10_1.value;call_10_1=null;
//line 146
im53=null;
//line 147
int54=1;
//line 147
int40=Math.floor(int40+int54);
//line 147
int54=null;
//line 148
label = 167; continue;
//line 148
case 167:
//line 148
bool43=null;
//line 149
label = 114; continue;
//line 149
case 170:
//line 150
int55=n.c_rt_lib.array_len(im38);;
//line 150
int56=0;
//line 150
int57=1;
//line 150
case 174:
//line 150
bool58=int56>=int55;
//line 150
if (bool58) {label = 186; continue;}
//line 150
im59=im38.get_index(int56);
//line 150
int61=Math.floor(int7+int56);
//line 150
im60=im59
//line 150
var call_12_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_arr(call_12_1,int61,im60);im0=call_12_1.value;call_12_1=null;;
//line 150
im59=null;
//line 150
im60=null;
//line 150
int61=null;
//line 150
int56=Math.floor(int56+int57);
//line 150
label = 174; continue;
//line 150
case 186:
//line 150
int9=null;
//line 150
int30=null;
//line 150
im38=null;
//line 150
int39=null;
//line 150
int40=null;
//line 150
bool42=null;
//line 150
int55=null;
//line 150
int56=null;
//line 150
int57=null;
//line 150
bool58=null;
//line 150
case 197:
//line 119
int7=Math.floor(int7+int3);
//line 151
label = 11; continue;
//line 151
case 200:
//line 151
int7=null;
//line 151
bool8=null;
//line 151
int9=null;
//line 151
int30=null;
//line 151
im38=null;
//line 151
int39=null;
//line 151
int40=null;
//line 151
bool42=null;
//line 151
int55=null;
//line 151
int56=null;
//line 151
int57=null;
//line 151
bool58=null;
//line 118
int62=2;
//line 118
int3=Math.floor(int3*int62);
//line 118
int62=null;
//line 152
label = 2; continue;
//line 152
case 217:
//line 152
im1=null;
//line 152
int2=null;
//line 152
int3=null;
//line 152
bool4=null;
//line 152
int7=null;
//line 152
bool8=null;
//line 152
int9=null;
//line 152
int30=null;
//line 152
im38=null;
//line 152
int39=null;
//line 152
int40=null;
//line 152
bool42=null;
//line 152
int55=null;
//line 152
int56=null;
//line 152
int57=null;
//line 152
bool58=null;
//line 152
___arg__0.value = im0;return null;
}}}

function _prv_exec(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 156
im3=n.imm_arr([im1,im2,]);
//line 157
var call_0_2=new n.imm_ref(im3);im4=n.c_std_lib.exec(im0,call_0_2);im3=call_0_2.value;call_0_2=null;
//line 157
im0=null;
//line 157
im1=null;
//line 157
im2=null;
//line 157
im3=null;
//line 157
return im4;
//line 157
im0=null;
//line 157
im1=null;
//line 157
im2=null;
//line 157
im3=null;
//line 157
im4=null;
//line 157
return null;
}}}
var c=[];
c[0] = n.imm_str("");c[1] = n.imm_str("ref");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.boolean={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.boolean.to_nl=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 7
im2=c[0];
//line 7
bool1=n.c_rt_lib.eq(im0, im2)
//line 7
im2=null;
//line 7
im3=n.c_rt_lib.native_to_nl(bool1)
//line 7
im0=null;
//line 7
bool1=null;
//line 7
return im3;
//line 7
im0=null;
//line 7
bool1=null;
//line 7
im3=null;
//line 7
return null;
}}}

n.boolean.__dyn_to_nl=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.boolean.to_nl(arg0)
return ret;
}

n.boolean.check_true=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 11
bool2=n.c_rt_lib.check_true_native(im0);;
//line 11
if (bool2) {label = 4; continue;}
//line 11
int1=0;
//line 11
label = 6; continue;
//line 11
case 4:
//line 11
int1=1;
//line 11
case 6:
//line 11
bool2=null;
//line 11
im3=n.imm_int(int1)
//line 11
im0=null;
//line 11
int1=null;
//line 11
return im3;
//line 11
im0=null;
//line 11
int1=null;
//line 11
im3=null;
//line 11
return null;
}}}

n.boolean.__dyn_check_true=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.boolean.check_true(arg0)
return ret;
}
var c=[];
c[0] = n.imm_str("1");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.boolean_t={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

function _prv__singleton_prv_fun_type() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 9
im0=n.ptd.bool();
//line 9
return im0;
//line 9
im0=null;
//line 9
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_type;
n.boolean_t.type=function() {
if (_singleton_val__prv__singleton_prv_fun_type===undefined) {
_singleton_val__prv__singleton_prv_fun_type=_prv__singleton_prv_fun_type();
}
return _singleton_val__prv__singleton_prv_fun_type;
}

n.boolean_t.__dyn_type=function(arr) {
var ret = n.boolean_t.type()
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.console={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.console.println=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 10
im2=n.string.lf();
//line 10
im1=n.c_rt_lib.concat(im0,im2);;
//line 10
im2=null;
//line 10
n.c_olympic_io.print(im1);
//line 10
im1=null;
//line 10
im0=null;
//line 10
return null;
}}}

n.console.__dyn_println=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.console.println(arg0)
return ret;
}

n.console.print=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var label=null;
while (1) { switch (label) {
default:
//line 14
n.c_olympic_io.print(im0);
//line 14
im0=null;
//line 14
return null;
}}}

n.console.__dyn_print=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.console.print(arg0)
return ret;
}

n.console.readln=function() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 18
im0=n.c_olympic_io.readln();
//line 18
return im0;
}}}

n.console.__dyn_readln=function(arr) {
var ret = n.console.readln()
return ret;
}

n.console.read_int=function() {
var int0=null;
var label=null;
while (1) { switch (label) {
default:
//line 22
int0=n.c_olympic_io.read_int();
//line 22
return int0;
}}}

n.console.__dyn_read_int=function(arr) {
var ret = n.imm_int(n.console.read_int())
return ret;
}

n.console.read_char=function() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 26
im0=n.c_olympic_io.read_char();
//line 26
return im0;
}}}

n.console.__dyn_read_char=function(arr) {
var ret = n.console.read_char()
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.dfile={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.dfile.deep_eq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var bool3=null;
var bool4=null;
var im5=null;
var bool6=null;
var int7=null;
var int8=null;
var bool9=null;
var im10=null;
var im11=null;
var bool12=null;
var im13=null;
var im14=null;
var bool15=null;
var bool16=null;
var im17=null;
var bool18=null;
var im19=null;
var im20=null;
var bool21=null;
var im22=null;
var bool23=null;
var bool24=null;
var im25=null;
var bool26=null;
var int27=null;
var int28=null;
var bool29=null;
var im30=null;
var int31=null;
var int32=null;
var int33=null;
var bool34=null;
var bool35=null;
var im36=null;
var im37=null;
var im38=null;
var bool39=null;
var im40=null;
var bool41=null;
var bool42=null;
var im43=null;
var bool44=null;
var bool45=null;
var im46=null;
var im47=null;
var bool48=null;
var im49=null;
var im50=null;
var bool51=null;
var im52=null;
var bool53=null;
var im54=null;
var im55=null;
var bool56=null;
var im57=null;
var bool58=null;
var im59=null;
var bool60=null;
var im61=null;
var im62=null;
var im63=null;
var bool64=null;
var im65=null;
var bool66=null;
var bool67=null;
var im68=null;
var bool69=null;
var im70=null;
var bool71=null;
var bool72=null;
var im73=null;
var bool74=null;
var int75=null;
var int76=null;
var im77=null;
var im78=null;
var bool79=null;
var im80=null;
var label=null;
while (1) { switch (label) {
default:
//line 16
bool2=n.nl.is_hash(im0);
//line 16
bool2=!bool2
//line 16
if (bool2) {label = 97; continue;}
//line 17
bool3=n.nl.is_hash(im1);
//line 17
bool3=!bool3
//line 17
bool3=!bool3
//line 17
if (bool3) {label = 16; continue;}
//line 17
bool4=false;
//line 17
im5=n.c_rt_lib.native_to_nl(bool4)
//line 17
im0=null;
//line 17
im1=null;
//line 17
bool2=null;
//line 17
bool3=null;
//line 17
bool4=null;
//line 17
return im5;
//line 17
label = 16; continue;
//line 17
case 16:
//line 17
bool3=null;
//line 17
bool4=null;
//line 17
im5=null;
//line 18
int7=n.hash.size(im0);
//line 18
int8=n.hash.size(im1);
//line 18
bool6=int7==int8;
//line 18
int7=null;
//line 18
int8=null;
//line 18
bool6=!bool6
//line 18
bool6=!bool6
//line 18
if (bool6) {label = 37; continue;}
//line 18
bool9=false;
//line 18
im10=n.c_rt_lib.native_to_nl(bool9)
//line 18
im0=null;
//line 18
im1=null;
//line 18
bool2=null;
//line 18
bool6=null;
//line 18
bool9=null;
//line 18
return im10;
//line 18
label = 37; continue;
//line 18
case 37:
//line 18
bool6=null;
//line 18
bool9=null;
//line 18
im10=null;
//line 19
im14=n.c_rt_lib.init_iter(im0);;
//line 19
case 42:
//line 19
bool12=n.c_rt_lib.is_end_hash(im14);;
//line 19
if (bool12) {label = 95; continue;}
//line 19
im11=n.c_rt_lib.get_key_iter(im14);;
//line 19
im13=n.c_rt_lib.hash_get_value(im0,im11);
//line 20
bool15=n.hash.has_key(im1,im11);
//line 20
bool15=!bool15
//line 20
bool15=!bool15
//line 20
if (bool15) {label = 64; continue;}
//line 20
bool16=false;
//line 20
im17=n.c_rt_lib.native_to_nl(bool16)
//line 20
im0=null;
//line 20
im1=null;
//line 20
bool2=null;
//line 20
im11=null;
//line 20
bool12=null;
//line 20
im13=null;
//line 20
im14=null;
//line 20
bool15=null;
//line 20
bool16=null;
//line 20
return im17;
//line 20
label = 64; continue;
//line 20
case 64:
//line 20
bool15=null;
//line 20
bool16=null;
//line 20
im17=null;
//line 21
im19=n.c_rt_lib.hash_get_value(im1,im11);
//line 21
im20=n.dfile.deep_eq(im13,im19);
//line 21
bool18=n.c_rt_lib.check_true_native(im20);;
//line 21
im19=null;
//line 21
im20=null;
//line 21
bool18=!bool18
//line 21
bool18=!bool18
//line 21
if (bool18) {label = 89; continue;}
//line 21
bool21=false;
//line 21
im22=n.c_rt_lib.native_to_nl(bool21)
//line 21
im0=null;
//line 21
im1=null;
//line 21
bool2=null;
//line 21
im11=null;
//line 21
bool12=null;
//line 21
im13=null;
//line 21
im14=null;
//line 21
bool18=null;
//line 21
bool21=null;
//line 21
return im22;
//line 21
label = 89; continue;
//line 21
case 89:
//line 21
bool18=null;
//line 21
bool21=null;
//line 21
im22=null;
//line 22
im14=n.c_rt_lib.next_iter(im14);;
//line 22
label = 42; continue;
//line 22
case 95:
//line 23
label = 437; continue;
//line 23
case 97:
//line 23
bool2=n.nl.is_array(im0);
//line 23
bool2=!bool2
//line 23
if (bool2) {label = 188; continue;}
//line 24
bool23=n.nl.is_array(im1);
//line 24
bool23=!bool23
//line 24
bool23=!bool23
//line 24
if (bool23) {label = 118; continue;}
//line 24
bool24=false;
//line 24
im25=n.c_rt_lib.native_to_nl(bool24)
//line 24
im0=null;
//line 24
im1=null;
//line 24
bool2=null;
//line 24
im11=null;
//line 24
bool12=null;
//line 24
im13=null;
//line 24
im14=null;
//line 24
bool23=null;
//line 24
bool24=null;
//line 24
return im25;
//line 24
label = 118; continue;
//line 24
case 118:
//line 24
bool23=null;
//line 24
bool24=null;
//line 24
im25=null;
//line 25
int27=n.c_rt_lib.array_len(im0);;
//line 25
int28=n.c_rt_lib.array_len(im1);;
//line 25
bool26=int27==int28;
//line 25
int27=null;
//line 25
int28=null;
//line 25
bool26=!bool26
//line 25
bool26=!bool26
//line 25
if (bool26) {label = 143; continue;}
//line 25
bool29=false;
//line 25
im30=n.c_rt_lib.native_to_nl(bool29)
//line 25
im0=null;
//line 25
im1=null;
//line 25
bool2=null;
//line 25
im11=null;
//line 25
bool12=null;
//line 25
im13=null;
//line 25
im14=null;
//line 25
bool26=null;
//line 25
bool29=null;
//line 25
return im30;
//line 25
label = 143; continue;
//line 25
case 143:
//line 25
bool26=null;
//line 25
bool29=null;
//line 25
im30=null;
//line 26
int31=n.c_rt_lib.array_len(im0);;
//line 26
int32=0;
//line 26
int33=1;
//line 26
case 150:
//line 26
bool34=int32>=int31;
//line 26
if (bool34) {label = 186; continue;}
//line 27
im36=im0.get_index(int32);
//line 27
im37=im1.get_index(int32);
//line 27
im38=n.dfile.deep_eq(im36,im37);
//line 27
bool35=n.c_rt_lib.check_true_native(im38);;
//line 27
im36=null;
//line 27
im37=null;
//line 27
im38=null;
//line 27
bool35=!bool35
//line 27
bool35=!bool35
//line 27
if (bool35) {label = 180; continue;}
//line 27
bool39=false;
//line 27
im40=n.c_rt_lib.native_to_nl(bool39)
//line 27
im0=null;
//line 27
im1=null;
//line 27
bool2=null;
//line 27
im11=null;
//line 27
bool12=null;
//line 27
im13=null;
//line 27
im14=null;
//line 27
int31=null;
//line 27
int32=null;
//line 27
int33=null;
//line 27
bool34=null;
//line 27
bool35=null;
//line 27
bool39=null;
//line 27
return im40;
//line 27
label = 180; continue;
//line 27
case 180:
//line 27
bool35=null;
//line 27
bool39=null;
//line 27
im40=null;
//line 28
int32=Math.floor(int32+int33);
//line 28
label = 150; continue;
//line 28
case 186:
//line 29
label = 437; continue;
//line 29
case 188:
//line 29
bool2=n.nl.is_variant(im0);
//line 29
bool2=!bool2
//line 29
if (bool2) {label = 335; continue;}
//line 30
bool41=n.nl.is_variant(im1);
//line 30
bool41=!bool41
//line 30
bool41=!bool41
//line 30
if (bool41) {label = 213; continue;}
//line 30
bool42=false;
//line 30
im43=n.c_rt_lib.native_to_nl(bool42)
//line 30
im0=null;
//line 30
im1=null;
//line 30
bool2=null;
//line 30
im11=null;
//line 30
bool12=null;
//line 30
im13=null;
//line 30
im14=null;
//line 30
int31=null;
//line 30
int32=null;
//line 30
int33=null;
//line 30
bool34=null;
//line 30
bool41=null;
//line 30
bool42=null;
//line 30
return im43;
//line 30
label = 213; continue;
//line 30
case 213:
//line 30
bool41=null;
//line 30
bool42=null;
//line 30
im43=null;
//line 31
im46=n.ov.has_value(im0);
//line 31
bool44=n.c_rt_lib.check_true_native(im46);;
//line 31
im46=null;
//line 31
bool45=!bool44
//line 31
if (bool45) {label = 225; continue;}
//line 31
im47=n.ov.has_value(im1);
//line 31
bool44=n.c_rt_lib.check_true_native(im47);;
//line 31
im47=null;
//line 31
case 225:
//line 31
bool45=null;
//line 31
if (bool44) {label = 240; continue;}
//line 32
im49=n.ov.has_value(im0);
//line 32
bool44=n.c_rt_lib.check_true_native(im49);;
//line 32
im49=null;
//line 32
bool44=!bool44
//line 32
bool48=!bool44
//line 32
if (bool48) {label = 238; continue;}
//line 32
im50=n.ov.has_value(im1);
//line 32
bool44=n.c_rt_lib.check_true_native(im50);;
//line 32
im50=null;
//line 32
bool44=!bool44
//line 32
case 238:
//line 32
bool48=null;
//line 32
case 240:
//line 32
bool44=!bool44
//line 32
bool44=!bool44
//line 32
if (bool44) {label = 261; continue;}
//line 31
bool51=false;
//line 31
im52=n.c_rt_lib.native_to_nl(bool51)
//line 31
im0=null;
//line 31
im1=null;
//line 31
bool2=null;
//line 31
im11=null;
//line 31
bool12=null;
//line 31
im13=null;
//line 31
im14=null;
//line 31
int31=null;
//line 31
int32=null;
//line 31
int33=null;
//line 31
bool34=null;
//line 31
bool44=null;
//line 31
bool51=null;
//line 31
return im52;
//line 31
label = 261; continue;
//line 31
case 261:
//line 31
bool44=null;
//line 31
bool51=null;
//line 31
im52=null;
//line 33
im54=n.ov.get_element(im0);
//line 33
im55=n.ov.get_element(im1);
//line 33
bool53=n.c_rt_lib.eq(im54, im55)
//line 33
im54=null;
//line 33
im55=null;
//line 33
bool53=!bool53
//line 33
bool53=!bool53
//line 33
if (bool53) {label = 290; continue;}
//line 33
bool56=false;
//line 33
im57=n.c_rt_lib.native_to_nl(bool56)
//line 33
im0=null;
//line 33
im1=null;
//line 33
bool2=null;
//line 33
im11=null;
//line 33
bool12=null;
//line 33
im13=null;
//line 33
im14=null;
//line 33
int31=null;
//line 33
int32=null;
//line 33
int33=null;
//line 33
bool34=null;
//line 33
bool53=null;
//line 33
bool56=null;
//line 33
return im57;
//line 33
label = 290; continue;
//line 33
case 290:
//line 33
bool53=null;
//line 33
bool56=null;
//line 33
im57=null;
//line 34
im59=n.ov.has_value(im0);
//line 34
bool58=n.c_rt_lib.check_true_native(im59);;
//line 34
im59=null;
//line 34
bool58=!bool58
//line 34
if (bool58) {label = 332; continue;}
//line 35
im61=n.ov.get_value(im0);
//line 35
im62=n.ov.get_value(im1);
//line 35
im63=n.dfile.deep_eq(im61,im62);
//line 35
bool60=n.c_rt_lib.check_true_native(im63);;
//line 35
im61=null;
//line 35
im62=null;
//line 35
im63=null;
//line 35
bool60=!bool60
//line 35
bool60=!bool60
//line 35
if (bool60) {label = 327; continue;}
//line 35
bool64=false;
//line 35
im65=n.c_rt_lib.native_to_nl(bool64)
//line 35
im0=null;
//line 35
im1=null;
//line 35
bool2=null;
//line 35
im11=null;
//line 35
bool12=null;
//line 35
im13=null;
//line 35
im14=null;
//line 35
int31=null;
//line 35
int32=null;
//line 35
int33=null;
//line 35
bool34=null;
//line 35
bool58=null;
//line 35
bool60=null;
//line 35
bool64=null;
//line 35
return im65;
//line 35
label = 327; continue;
//line 35
case 327:
//line 35
bool60=null;
//line 35
bool64=null;
//line 35
im65=null;
//line 36
label = 332; continue;
//line 36
case 332:
//line 36
bool58=null;
//line 37
label = 437; continue;
//line 37
case 335:
//line 37
bool2=n.nl.is_string(im0);
//line 37
bool2=!bool2
//line 37
if (bool2) {label = 380; continue;}
//line 38
bool66=n.nl.is_string(im1);
//line 38
bool66=!bool66
//line 38
bool66=!bool66
//line 38
if (bool66) {label = 360; continue;}
//line 38
bool67=false;
//line 38
im68=n.c_rt_lib.native_to_nl(bool67)
//line 38
im0=null;
//line 38
im1=null;
//line 38
bool2=null;
//line 38
im11=null;
//line 38
bool12=null;
//line 38
im13=null;
//line 38
im14=null;
//line 38
int31=null;
//line 38
int32=null;
//line 38
int33=null;
//line 38
bool34=null;
//line 38
bool66=null;
//line 38
bool67=null;
//line 38
return im68;
//line 38
label = 360; continue;
//line 38
case 360:
//line 38
bool66=null;
//line 38
bool67=null;
//line 38
im68=null;
//line 39
bool69=n.c_rt_lib.eq(im0, im1)
//line 39
im70=n.c_rt_lib.native_to_nl(bool69)
//line 39
im0=null;
//line 39
im1=null;
//line 39
bool2=null;
//line 39
im11=null;
//line 39
bool12=null;
//line 39
im13=null;
//line 39
im14=null;
//line 39
int31=null;
//line 39
int32=null;
//line 39
int33=null;
//line 39
bool34=null;
//line 39
bool69=null;
//line 39
return im70;
//line 40
label = 437; continue;
//line 40
case 380:
//line 40
bool2=n.nl.is_int(im0);
//line 40
bool2=!bool2
//line 40
if (bool2) {label = 433; continue;}
//line 41
bool71=n.nl.is_int(im1);
//line 41
bool71=!bool71
//line 41
bool71=!bool71
//line 41
if (bool71) {label = 407; continue;}
//line 41
bool72=false;
//line 41
im73=n.c_rt_lib.native_to_nl(bool72)
//line 41
im0=null;
//line 41
im1=null;
//line 41
bool2=null;
//line 41
im11=null;
//line 41
bool12=null;
//line 41
im13=null;
//line 41
im14=null;
//line 41
int31=null;
//line 41
int32=null;
//line 41
int33=null;
//line 41
bool34=null;
//line 41
bool69=null;
//line 41
im70=null;
//line 41
bool71=null;
//line 41
bool72=null;
//line 41
return im73;
//line 41
label = 407; continue;
//line 41
case 407:
//line 41
bool71=null;
//line 41
bool72=null;
//line 41
im73=null;
//line 42
int75=im0.as_int();
//line 42
int76=im1.as_int();
//line 42
bool74=int75==int76;
//line 42
int75=null;
//line 42
int76=null;
//line 42
im77=n.c_rt_lib.native_to_nl(bool74)
//line 42
im0=null;
//line 42
im1=null;
//line 42
bool2=null;
//line 42
im11=null;
//line 42
bool12=null;
//line 42
im13=null;
//line 42
im14=null;
//line 42
int31=null;
//line 42
int32=null;
//line 42
int33=null;
//line 42
bool34=null;
//line 42
bool69=null;
//line 42
im70=null;
//line 42
bool74=null;
//line 42
return im77;
//line 43
label = 437; continue;
//line 43
case 433:
//line 44
im78=n.imm_arr([]);
//line 44
n.nl_die();
//line 45
label = 437; continue;
//line 45
case 437:
//line 45
bool2=null;
//line 45
im11=null;
//line 45
bool12=null;
//line 45
im13=null;
//line 45
im14=null;
//line 45
int31=null;
//line 45
int32=null;
//line 45
int33=null;
//line 45
bool34=null;
//line 45
bool69=null;
//line 45
im70=null;
//line 45
bool74=null;
//line 45
im77=null;
//line 45
im78=null;
//line 46
bool79=true;
//line 46
im80=n.c_rt_lib.native_to_nl(bool79)
//line 46
im0=null;
//line 46
im1=null;
//line 46
bool79=null;
//line 46
return im80;
//line 46
im0=null;
//line 46
im1=null;
//line 46
bool79=null;
//line 46
im80=null;
//line 46
return null;
}}}

n.dfile.__dyn_deep_eq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile.deep_eq(arg0, arg1)
return ret;
}

n.dfile.rs=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var bool5=null;
var bool6=null;
var int7=null;
var int8=null;
var im9=null;
var label=null;
while (1) { switch (label) {
default:
//line 50
im3=c[0];
//line 50
im4=n.imm_hash({});
//line 50
im2=n.imm_hash({"str":im3,"objects":im4,});
//line 50
im3=null;
//line 50
im4=null;
//line 51
int7=0;
//line 51
int8=im1.as_int();
//line 51
bool5=int8!=int7;
//line 51
int7=null;
//line 51
int8=null;
//line 51
bool6=!bool5
//line 51
if (bool6) {label = 13; continue;}
//line 51
bool5=_prv_is_simple_string(im0);
//line 51
case 13:
//line 51
bool6=null;
//line 51
bool5=!bool5
//line 51
if (bool5) {label = 19; continue;}
//line 52
var call_1_1=new n.imm_ref(im2);_prv_sp(call_1_1,im0);im2=call_1_1.value;call_1_1=null;
//line 53
label = 22; continue;
//line 53
case 19:
//line 54
var call_2_1=new n.imm_ref(im2);_prv_sprintstr(call_2_1,im0);im2=call_2_1.value;call_2_1=null;
//line 55
label = 22; continue;
//line 55
case 22:
//line 55
bool5=null;
//line 56
im9=n.c_rt_lib.hash_get_value(im2,c[1]);;
//line 56
im0=null;
//line 56
im1=null;
//line 56
im2=null;
//line 56
return im9;
//line 56
im0=null;
//line 56
im1=null;
//line 56
im2=null;
//line 56
im9=null;
//line 56
return null;
}}}

n.dfile.__dyn_rs=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile.rs(arg0, arg1)
return ret;
}

n.dfile.ssave=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var int4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 60
im2=c[0];
//line 60
im3=n.imm_hash({});
//line 60
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 60
im2=null;
//line 60
im3=null;
//line 61
int4=0;
//line 61
bool5=false;
//line 61
var call_0_1=new n.imm_ref(im1);_prv_sprint(call_0_1,im0,int4,bool5);im1=call_0_1.value;call_0_1=null;
//line 61
int4=null;
//line 61
bool5=null;
//line 62
im6=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 62
im0=null;
//line 62
im1=null;
//line 62
return im6;
}}}

n.dfile.__dyn_ssave=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile.ssave(arg0)
return ret;
}

n.dfile.debug=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var int4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 66
im2=c[0];
//line 66
im3=n.imm_hash({});
//line 66
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 66
im2=null;
//line 66
im3=null;
//line 67
int4=0;
//line 67
bool5=true;
//line 67
var call_0_1=new n.imm_ref(im1);_prv_sprint(call_0_1,im0,int4,bool5);im1=call_0_1.value;call_0_1=null;
//line 67
int4=null;
//line 67
bool5=null;
//line 68
im6=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 68
im0=null;
//line 68
im1=null;
//line 68
return im6;
}}}

n.dfile.__dyn_debug=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile.debug(arg0)
return ret;
}

n.dfile.ssave_net_format=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 72
im2=c[0];
//line 72
im3=n.imm_hash({});
//line 72
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 72
im2=null;
//line 72
im3=null;
//line 73
var call_0_1=new n.imm_ref(im1);_prv_print_net_format(call_0_1,im0);im1=call_0_1.value;call_0_1=null;
//line 74
im4=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 74
im0=null;
//line 74
im1=null;
//line 74
return im4;
}}}

n.dfile.__dyn_ssave_net_format=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile.ssave_net_format(arg0)
return ret;
}

function _prv_eat_ws(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=null;
var int2=null;
var im3=null;
var int4=null;
var im5=null;
var int6=null;
var im7=null;
var bool8=null;
var int9=null;
var int10=null;
var int11=null;
var int12=null;
var im13=null;
var int14=null;
var int15=null;
var int16=null;
var string17=null;
var label=null;
while (1) { switch (label) {
default:
//line 78
case 0:
//line 79
im3=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 79
int2=im3.as_int();
//line 79
im3=null;
//line 79
im5=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 79
int4=im5.as_int();
//line 79
im5=null;
//line 79
bool1=int2==int4;
//line 79
int2=null;
//line 79
int4=null;
//line 79
bool1=!bool1
//line 79
if (bool1) {label = 15; continue;}
//line 79
bool1=null;
//line 79
___arg__0.value = im0;return null;
//line 79
label = 15; continue;
//line 79
case 15:
//line 79
bool1=null;
//line 80
var call_2_1=new n.imm_ref(im0);im7=_prv_get_char(call_2_1);im0=call_2_1.value;call_2_1=null;
//line 80
int6=n.string.ord(im7);
//line 80
im7=null;
//line 81
int9=9;
//line 81
bool8=int6==int9;
//line 81
int9=null;
//line 81
if (bool8) {label = 27; continue;}
//line 81
int10=10;
//line 81
bool8=int6==int10;
//line 81
int10=null;
//line 81
case 27:
//line 81
if (bool8) {label = 32; continue;}
//line 81
int11=13;
//line 81
bool8=int6==int11;
//line 81
int11=null;
//line 81
case 32:
//line 81
if (bool8) {label = 37; continue;}
//line 81
int12=32;
//line 81
bool8=int6==int12;
//line 81
int12=null;
//line 81
case 37:
//line 81
bool8=!bool8
//line 81
if (bool8) {label = 54; continue;}
//line 82
im13=c[2];
//line 82
im13=n.c_rt_lib.get_ref_hash(im0,im13);
//line 82
int14=1;
//line 82
int15=im13.as_int();
//line 82
int16=Math.floor(int15+int14);
//line 82
im13=n.imm_int(int16)
//line 82
string17=c[2];
//line 82
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string17,im13);im0=call_5_1.value;call_5_1=null;
//line 82
im13=null;
//line 82
int14=null;
//line 82
int15=null;
//line 82
int16=null;
//line 82
string17=null;
//line 83
label = 59; continue;
//line 83
case 54:
//line 84
int6=null;
//line 84
bool8=null;
//line 84
___arg__0.value = im0;return null;
//line 85
label = 59; continue;
//line 85
case 59:
//line 85
bool8=null;
//line 85
int6=null;
//line 78
label = 0; continue;
//line 78
int6=null;
//line 78
___arg__0.value = im0;return null;
}}}

function _prv_get_char(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=null;
var im2=null;
var int3=null;
var im4=null;
var int5=null;
var label=null;
while (1) { switch (label) {
default:
//line 90
im2=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 90
im4=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 90
int3=im4.as_int();
//line 90
im4=null;
//line 90
int5=1;
//line 90
im1=n.c_std_lib.fast_substr(im2,int3,int5);
//line 90
im2=null;
//line 90
int3=null;
//line 90
int5=null;
//line 90
___arg__0.value = im0;return im1;
}}}

function _prv_is_ov(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var int4=null;
var im5=null;
var int6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 94
im3=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 94
im5=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 94
int4=im5.as_int();
//line 94
im5=null;
//line 94
int6=7;
//line 94
im2=n.c_std_lib.fast_substr(im3,int4,int6);
//line 94
im3=null;
//line 94
int4=null;
//line 94
int6=null;
//line 94
im7=c[4];
//line 94
bool1=n.c_rt_lib.eq(im2, im7)
//line 94
im2=null;
//line 94
im7=null;
//line 94
___arg__0.value = im0;return bool1;
}}}

function _prv_eat_non_ws(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=null;
var int3=null;
var im4=null;
var bool5=null;
var int6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var string13=null;
var im14=null;
var im15=null;
var bool16=null;
var im17=null;
var im18=null;
var int19=null;
var int20=null;
var int21=null;
var string22=null;
var bool23=null;
var int24=null;
var im25=null;
var bool26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var int31=null;
var im32=null;
var string33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 98
im2=c[0];
//line 99
im4=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 99
int3=im4.as_int();
//line 99
im4=null;
//line 100
im7=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 100
int6=im7.as_int();
//line 100
im7=null;
//line 100
bool5=int6>=int3;
//line 100
int6=null;
//line 100
bool5=!bool5
//line 100
if (bool5) {label = 30; continue;}
//line 101
bool1=true;
//line 102
im10=c[5];
//line 102
im12=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 102
int11=im12.as_int();
//line 102
im12=null;
//line 102
string13=n.imm_int(int11)
//line 102
im9=n.c_rt_lib.concat(im10,string13);;
//line 102
im10=null;
//line 102
int11=null;
//line 102
string13=null;
//line 102
im14=c[6];
//line 102
im8=n.c_rt_lib.concat(im9,im14);;
//line 102
im9=null;
//line 102
im14=null;
//line 102
im2=null;
//line 102
int3=null;
//line 102
bool5=null;
//line 102
___arg__0.value = im0;___arg__1.value = bool1;return im8;
//line 103
label = 30; continue;
//line 103
case 30:
//line 103
bool5=null;
//line 103
im8=null;
//line 104
case 33:
//line 105
var call_5_1=new n.imm_ref(im0);im15=_prv_get_char(call_5_1);im0=call_5_1.value;call_5_1=null;
//line 106
bool16=n.string.is_letter(im15);
//line 106
if (bool16) {label = 38; continue;}
//line 106
bool16=n.string.is_digit(im15);
//line 106
case 38:
//line 106
if (bool16) {label = 43; continue;}
//line 106
im17=c[7];
//line 106
bool16=n.c_rt_lib.eq(im15, im17)
//line 106
im17=null;
//line 106
case 43:
//line 106
bool16=!bool16
//line 106
bool16=!bool16
//line 106
if (bool16) {label = 51; continue;}
//line 106
im15=null;
//line 106
bool16=null;
//line 106
label = 82; continue;
//line 106
label = 51; continue;
//line 106
case 51:
//line 106
bool16=null;
//line 107
im18=c[2];
//line 107
im18=n.c_rt_lib.get_ref_hash(im0,im18);
//line 107
int19=1;
//line 107
int20=im18.as_int();
//line 107
int21=Math.floor(int20+int19);
//line 107
im18=n.imm_int(int21)
//line 107
string22=c[2];
//line 107
var call_9_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_9_1,string22,im18);im0=call_9_1.value;call_9_1=null;
//line 107
im18=null;
//line 107
int19=null;
//line 107
int20=null;
//line 107
int21=null;
//line 107
string22=null;
//line 108
im2=n.c_rt_lib.concat(im2,im15);;
//line 109
im25=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 109
int24=im25.as_int();
//line 109
im25=null;
//line 109
bool23=int24>=int3;
//line 109
int24=null;
//line 109
bool23=!bool23
//line 109
if (bool23) {label = 78; continue;}
//line 109
im15=null;
//line 109
bool23=null;
//line 109
label = 82; continue;
//line 109
label = 78; continue;
//line 109
case 78:
//line 109
bool23=null;
//line 109
im15=null;
//line 104
label = 33; continue;
//line 104
case 82:
//line 111
im27=c[0];
//line 111
bool26=n.c_rt_lib.eq(im2, im27)
//line 111
im27=null;
//line 111
bool26=!bool26
//line 111
if (bool26) {label = 108; continue;}
//line 112
bool1=true;
//line 113
im30=c[5];
//line 113
im32=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 113
int31=im32.as_int();
//line 113
im32=null;
//line 113
string33=n.imm_int(int31)
//line 113
im29=n.c_rt_lib.concat(im30,string33);;
//line 113
im30=null;
//line 113
int31=null;
//line 113
string33=null;
//line 113
im34=c[6];
//line 113
im28=n.c_rt_lib.concat(im29,im34);;
//line 113
im29=null;
//line 113
im34=null;
//line 113
im2=null;
//line 113
int3=null;
//line 113
im15=null;
//line 113
bool26=null;
//line 113
___arg__0.value = im0;___arg__1.value = bool1;return im28;
//line 114
label = 108; continue;
//line 114
case 108:
//line 114
bool26=null;
//line 114
im28=null;
//line 115
int3=null;
//line 115
im15=null;
//line 115
___arg__0.value = im0;___arg__1.value = bool1;return im2;
}}}

function _prv_parse_scalar(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var int8=null;
var int9=null;
var int10=null;
var string11=null;
var bool12=null;
var im13=null;
var bool14=null;
var im15=null;
var int16=null;
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
var label=null;
while (1) { switch (label) {
default:
//line 119
var call_0_1=new n.imm_ref(im0);_prv_eat_ws(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 121
var call_1_1=new n.imm_ref(im0);im5=_prv_get_char(call_1_1);im0=call_1_1.value;call_1_1=null;
//line 121
im6=c[8];
//line 121
bool4=n.c_rt_lib.eq(im5, im6)
//line 121
im5=null;
//line 121
im6=null;
//line 121
bool4=!bool4
//line 121
if (bool4) {label = 23; continue;}
//line 122
im7=c[2];
//line 122
im7=n.c_rt_lib.get_ref_hash(im0,im7);
//line 122
int8=1;
//line 122
int9=im7.as_int();
//line 122
int10=Math.floor(int9+int8);
//line 122
im7=n.imm_int(int10)
//line 122
string11=c[2];
//line 122
var call_3_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_3_1,string11,im7);im0=call_3_1.value;call_3_1=null;
//line 122
im7=null;
//line 122
int8=null;
//line 122
int9=null;
//line 122
int10=null;
//line 122
string11=null;
//line 123
var call_4_1=new n.imm_ref(im0);var call_4_2=new n.imm_ref(bool1);im3=_prv_finish_quoted_scalar(call_4_1,call_4_2);im0=call_4_1.value;call_4_1=null;bool1=call_4_2.value;call_4_2=null;
//line 124
label = 26; continue;
//line 124
case 23:
//line 125
var call_5_1=new n.imm_ref(im0);var call_5_2=new n.imm_ref(bool1);im3=_prv_eat_non_ws(call_5_1,call_5_2);im0=call_5_1.value;call_5_1=null;bool1=call_5_2.value;call_5_2=null;
//line 126
label = 26; continue;
//line 126
case 26:
//line 126
bool4=null;
//line 127
bool12=n.c_rt_lib.ov_is(im2,c[9]);;
//line 127
if (bool12) {label = 31; continue;}
//line 127
bool12=n.c_rt_lib.ov_is(im2,c[10]);;
//line 127
case 31:
//line 127
bool12=!bool12
//line 127
if (bool12) {label = 38; continue;}
//line 128
im2=null;
//line 128
bool12=null;
//line 128
___arg__0.value = im0;___arg__1.value = bool1;return im3;
//line 129
label = 109; continue;
//line 129
case 38:
//line 129
bool12=n.c_rt_lib.ov_is(im2,c[11]);;
//line 129
bool12=!bool12
//line 129
if (bool12) {label = 84; continue;}
//line 130
im13=n.string_utils.get_integer(im3);
//line 130
bool14=n.c_rt_lib.ov_is(im13,c[12]);;
//line 130
if (bool14) {label = 50; continue;}
//line 132
bool14=n.c_rt_lib.ov_is(im13,c[13]);;
//line 132
if (bool14) {label = 64; continue;}
//line 132
im15=c[14];
//line 132
im15=n.imm_arr([im15,im13,]);
//line 132
n.nl_die();
//line 130
case 50:
//line 130
im17=n.c_rt_lib.ov_as(im13,c[12]);;
//line 130
int16=im17.as_int();
//line 131
im18=n.imm_int(int16)
//line 131
im2=null;
//line 131
im3=null;
//line 131
bool12=null;
//line 131
im13=null;
//line 131
bool14=null;
//line 131
im15=null;
//line 131
int16=null;
//line 131
im17=null;
//line 131
___arg__0.value = im0;___arg__1.value = bool1;return im18;
//line 132
label = 82; continue;
//line 132
case 64:
//line 132
im20=n.c_rt_lib.ov_as(im13,c[13]);;
//line 132
im19=im20
//line 133
bool1=true;
//line 134
im21=c[15];
//line 134
im2=null;
//line 134
im3=null;
//line 134
bool12=null;
//line 134
im13=null;
//line 134
bool14=null;
//line 134
im15=null;
//line 134
int16=null;
//line 134
im17=null;
//line 134
im18=null;
//line 134
im19=null;
//line 134
im20=null;
//line 134
___arg__0.value = im0;___arg__1.value = bool1;return im21;
//line 135
label = 82; continue;
//line 135
case 82:
//line 136
label = 109; continue;
//line 136
case 84:
//line 137
bool1=true;
//line 138
im24=c[16];
//line 138
im25=n.dfile.ssave(im2);
//line 138
im23=n.c_rt_lib.concat(im24,im25);;
//line 138
im24=null;
//line 138
im25=null;
//line 138
im26=c[17];
//line 138
im22=n.c_rt_lib.concat(im23,im26);;
//line 138
im23=null;
//line 138
im26=null;
//line 138
im2=null;
//line 138
im3=null;
//line 138
bool12=null;
//line 138
im13=null;
//line 138
bool14=null;
//line 138
im15=null;
//line 138
int16=null;
//line 138
im17=null;
//line 138
im18=null;
//line 138
im19=null;
//line 138
im20=null;
//line 138
im21=null;
//line 138
___arg__0.value = im0;___arg__1.value = bool1;return im22;
//line 139
label = 109; continue;
//line 139
case 109:
//line 139
bool12=null;
//line 139
im13=null;
//line 139
bool14=null;
//line 139
im15=null;
//line 139
int16=null;
//line 139
im17=null;
//line 139
im18=null;
//line 139
im19=null;
//line 139
im20=null;
//line 139
im21=null;
//line 139
im22=null;
//line 139
im2=null;
//line 139
im3=null;
//line 139
___arg__0.value = im0;___arg__1.value = bool1;return null;
}}}

function _prv_finish_quoted_scalar(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=null;
var bool3=null;
var int4=null;
var im5=null;
var int6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var string13=null;
var im14=null;
var im15=null;
var im16=null;
var int17=null;
var int18=null;
var int19=null;
var string20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var bool25=null;
var label=null;
while (1) { switch (label) {
default:
//line 144
im2=c[0];
//line 145
case 1:
//line 146
im5=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 146
int4=im5.as_int();
//line 146
im5=null;
//line 146
im7=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 146
int6=im7.as_int();
//line 146
im7=null;
//line 146
bool3=int4>=int6;
//line 146
int4=null;
//line 146
int6=null;
//line 146
bool3=!bool3
//line 146
if (bool3) {label = 31; continue;}
//line 147
bool1=true;
//line 148
im10=c[5];
//line 148
im12=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 148
int11=im12.as_int();
//line 148
im12=null;
//line 148
string13=n.imm_int(int11)
//line 148
im9=n.c_rt_lib.concat(im10,string13);;
//line 148
im10=null;
//line 148
int11=null;
//line 148
string13=null;
//line 148
im14=c[18];
//line 148
im8=n.c_rt_lib.concat(im9,im14);;
//line 148
im9=null;
//line 148
im14=null;
//line 148
im2=null;
//line 148
bool3=null;
//line 148
___arg__0.value = im0;___arg__1.value = bool1;return im8;
//line 149
label = 31; continue;
//line 149
case 31:
//line 149
bool3=null;
//line 149
im8=null;
//line 150
var call_5_1=new n.imm_ref(im0);im15=_prv_get_char(call_5_1);im0=call_5_1.value;call_5_1=null;
//line 151
im16=c[2];
//line 151
im16=n.c_rt_lib.get_ref_hash(im0,im16);
//line 151
int17=1;
//line 151
int18=im16.as_int();
//line 151
int19=Math.floor(int18+int17);
//line 151
im16=n.imm_int(int19)
//line 151
string20=c[2];
//line 151
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string20,im16);im0=call_7_1.value;call_7_1=null;
//line 151
im16=null;
//line 151
int17=null;
//line 151
int18=null;
//line 151
int19=null;
//line 151
string20=null;
//line 152
im22=c[8];
//line 152
bool21=n.c_rt_lib.eq(im15, im22)
//line 152
im22=null;
//line 152
bool21=!bool21
//line 152
if (bool21) {label = 57; continue;}
//line 153
im15=null;
//line 153
bool21=null;
//line 153
label = 85; continue;
//line 154
label = 80; continue;
//line 154
case 57:
//line 154
im23=c[19];
//line 154
bool21=n.c_rt_lib.eq(im15, im23)
//line 154
im23=null;
//line 154
bool21=!bool21
//line 154
if (bool21) {label = 77; continue;}
//line 155
var call_8_1=new n.imm_ref(im0);var call_8_2=new n.imm_ref(bool1);im24=_prv_finish_escape_seq(call_8_1,call_8_2);im0=call_8_1.value;call_8_1=null;bool1=call_8_2.value;call_8_2=null;
//line 156
bool25=bool1
//line 156
bool25=!bool25
//line 156
if (bool25) {label = 73; continue;}
//line 156
im2=null;
//line 156
im15=null;
//line 156
bool21=null;
//line 156
bool25=null;
//line 156
___arg__0.value = im0;___arg__1.value = bool1;return im24;
//line 156
label = 73; continue;
//line 156
case 73:
//line 156
bool25=null;
//line 157
im2=n.c_rt_lib.concat(im2,im24);;
//line 158
label = 80; continue;
//line 158
case 77:
//line 159
im2=n.c_rt_lib.concat(im2,im15);;
//line 160
label = 80; continue;
//line 160
case 80:
//line 160
bool21=null;
//line 160
im24=null;
//line 160
im15=null;
//line 145
label = 1; continue;
//line 145
case 85:
//line 162
im15=null;
//line 162
___arg__0.value = im0;___arg__1.value = bool1;return im2;
}}}

function _prv_finish_escape_seq(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var bool2=null;
var int3=null;
var im4=null;
var int5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var int10=null;
var im11=null;
var string12=null;
var im13=null;
var im14=null;
var im15=null;
var int16=null;
var int17=null;
var int18=null;
var string19=null;
var bool20=null;
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
var im32=null;
var bool33=null;
var im34=null;
var bool35=null;
var im36=null;
var im37=null;
var im38=null;
var int39=null;
var im40=null;
var int41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var int46=null;
var int47=null;
var im48=null;
var int49=null;
var string50=null;
var im51=null;
var label=null;
while (1) { switch (label) {
default:
//line 166
im4=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 166
int3=im4.as_int();
//line 166
im4=null;
//line 166
im6=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 166
int5=im6.as_int();
//line 166
im6=null;
//line 166
bool2=int3>=int5;
//line 166
int3=null;
//line 166
int5=null;
//line 166
bool2=!bool2
//line 166
if (bool2) {label = 28; continue;}
//line 167
bool1=true;
//line 168
im9=c[5];
//line 168
im11=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 168
int10=im11.as_int();
//line 168
im11=null;
//line 168
string12=n.imm_int(int10)
//line 168
im8=n.c_rt_lib.concat(im9,string12);;
//line 168
im9=null;
//line 168
int10=null;
//line 168
string12=null;
//line 168
im13=c[20];
//line 168
im7=n.c_rt_lib.concat(im8,im13);;
//line 168
im8=null;
//line 168
im13=null;
//line 168
bool2=null;
//line 168
___arg__0.value = im0;___arg__1.value = bool1;return im7;
//line 169
label = 28; continue;
//line 169
case 28:
//line 169
bool2=null;
//line 169
im7=null;
//line 170
var call_5_1=new n.imm_ref(im0);im14=_prv_get_char(call_5_1);im0=call_5_1.value;call_5_1=null;
//line 171
im15=c[2];
//line 171
im15=n.c_rt_lib.get_ref_hash(im0,im15);
//line 171
int16=1;
//line 171
int17=im15.as_int();
//line 171
int18=Math.floor(int17+int16);
//line 171
im15=n.imm_int(int18)
//line 171
string19=c[2];
//line 171
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string19,im15);im0=call_7_1.value;call_7_1=null;
//line 171
im15=null;
//line 171
int16=null;
//line 171
int17=null;
//line 171
int18=null;
//line 171
string19=null;
//line 172
im21=c[21];
//line 172
bool20=n.c_rt_lib.eq(im14, im21)
//line 172
im21=null;
//line 172
bool20=!bool20
//line 172
if (bool20) {label = 55; continue;}
//line 173
im22=n.string.lf();
//line 173
im14=null;
//line 173
bool20=null;
//line 173
___arg__0.value = im0;___arg__1.value = bool1;return im22;
//line 174
label = 193; continue;
//line 174
case 55:
//line 174
im23=c[22];
//line 174
bool20=n.c_rt_lib.eq(im14, im23)
//line 174
im23=null;
//line 174
bool20=!bool20
//line 174
if (bool20) {label = 67; continue;}
//line 175
im24=n.string.r();
//line 175
im14=null;
//line 175
bool20=null;
//line 175
im22=null;
//line 175
___arg__0.value = im0;___arg__1.value = bool1;return im24;
//line 176
label = 193; continue;
//line 176
case 67:
//line 176
im25=c[23];
//line 176
bool20=n.c_rt_lib.eq(im14, im25)
//line 176
im25=null;
//line 176
bool20=!bool20
//line 176
if (bool20) {label = 80; continue;}
//line 177
im26=n.string.tab();
//line 177
im14=null;
//line 177
bool20=null;
//line 177
im22=null;
//line 177
im24=null;
//line 177
___arg__0.value = im0;___arg__1.value = bool1;return im26;
//line 178
label = 193; continue;
//line 178
case 80:
//line 178
im27=c[19];
//line 178
bool20=n.c_rt_lib.eq(im14, im27)
//line 178
im27=null;
//line 178
if (bool20) {label = 88; continue;}
//line 178
im28=c[8];
//line 178
bool20=n.c_rt_lib.eq(im14, im28)
//line 178
im28=null;
//line 178
case 88:
//line 178
if (bool20) {label = 93; continue;}
//line 178
im29=c[24];
//line 178
bool20=n.c_rt_lib.eq(im14, im29)
//line 178
im29=null;
//line 178
case 93:
//line 178
if (bool20) {label = 98; continue;}
//line 178
im30=c[25];
//line 178
bool20=n.c_rt_lib.eq(im14, im30)
//line 178
im30=null;
//line 178
case 98:
//line 178
bool20=!bool20
//line 178
if (bool20) {label = 107; continue;}
//line 179
bool20=null;
//line 179
im22=null;
//line 179
im24=null;
//line 179
im26=null;
//line 179
___arg__0.value = im0;___arg__1.value = bool1;return im14;
//line 180
label = 193; continue;
//line 180
case 107:
//line 180
im31=c[26];
//line 180
bool20=n.c_rt_lib.eq(im14, im31)
//line 180
im31=null;
//line 180
bool20=!bool20
//line 180
if (bool20) {label = 164; continue;}
//line 181
var call_11_1=new n.imm_ref(im0);var call_11_2=new n.imm_ref(bool1);im32=_prv_eat_hex_digit(call_11_1,call_11_2);im0=call_11_1.value;call_11_1=null;bool1=call_11_2.value;call_11_2=null;
//line 182
bool33=bool1
//line 182
bool33=!bool33
//line 182
if (bool33) {label = 125; continue;}
//line 182
im14=null;
//line 182
bool20=null;
//line 182
im22=null;
//line 182
im24=null;
//line 182
im26=null;
//line 182
bool33=null;
//line 182
___arg__0.value = im0;___arg__1.value = bool1;return im32;
//line 182
label = 125; continue;
//line 182
case 125:
//line 182
bool33=null;
//line 183
var call_12_1=new n.imm_ref(im0);var call_12_2=new n.imm_ref(bool1);im34=_prv_eat_hex_digit(call_12_1,call_12_2);im0=call_12_1.value;call_12_1=null;bool1=call_12_2.value;call_12_2=null;
//line 184
bool35=bool1
//line 184
bool35=!bool35
//line 184
if (bool35) {label = 140; continue;}
//line 184
im14=null;
//line 184
bool20=null;
//line 184
im22=null;
//line 184
im24=null;
//line 184
im26=null;
//line 184
im32=null;
//line 184
bool35=null;
//line 184
___arg__0.value = im0;___arg__1.value = bool1;return im34;
//line 184
label = 140; continue;
//line 184
case 140:
//line 184
bool35=null;
//line 185
im37=n.ptd.string();
//line 185
int39=n.string.ord(im32);
//line 185
im40=n.imm_int(int39)
//line 185
int41=n.string.ord(im34);
//line 185
im42=n.imm_int(int41)
//line 185
im38=n.string_utils.hex2char(im40,im42);
//line 185
int39=null;
//line 185
im40=null;
//line 185
int41=null;
//line 185
im42=null;
//line 185
im36=n.ptd.ensure(im37,im38);
//line 185
im37=null;
//line 185
im38=null;
//line 185
im14=null;
//line 185
bool20=null;
//line 185
im22=null;
//line 185
im24=null;
//line 185
im26=null;
//line 185
im32=null;
//line 185
im34=null;
//line 185
___arg__0.value = im0;___arg__1.value = bool1;return im36;
//line 186
label = 193; continue;
//line 186
case 164:
//line 187
bool1=true;
//line 188
im45=c[5];
//line 188
im48=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 188
int47=im48.as_int();
//line 188
im48=null;
//line 188
int49=1;
//line 188
int46=Math.floor(int47-int49);
//line 188
int47=null;
//line 188
int49=null;
//line 188
string50=n.imm_int(int46)
//line 188
im44=n.c_rt_lib.concat(im45,string50);;
//line 188
im45=null;
//line 188
int46=null;
//line 188
string50=null;
//line 188
im51=c[20];
//line 188
im43=n.c_rt_lib.concat(im44,im51);;
//line 188
im44=null;
//line 188
im51=null;
//line 188
im14=null;
//line 188
bool20=null;
//line 188
im22=null;
//line 188
im24=null;
//line 188
im26=null;
//line 188
im32=null;
//line 188
im34=null;
//line 188
im36=null;
//line 188
___arg__0.value = im0;___arg__1.value = bool1;return im43;
//line 189
label = 193; continue;
//line 189
case 193:
//line 189
bool20=null;
//line 189
im22=null;
//line 189
im24=null;
//line 189
im26=null;
//line 189
im32=null;
//line 189
im34=null;
//line 189
im36=null;
//line 189
im43=null;
}}}

function _prv_eat_hex_digit(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var im6=null;
var int7=null;
var im8=null;
var string9=null;
var im10=null;
var im11=null;
var int12=null;
var int13=null;
var int14=null;
var string15=null;
var label=null;
while (1) { switch (label) {
default:
//line 193
var call_0_1=new n.imm_ref(im0);im2=_prv_get_char(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 194
bool3=n.string.is_hex_digit(im2);
//line 194
bool3=!bool3
//line 194
bool3=!bool3
//line 194
if (bool3) {label = 23; continue;}
//line 195
bool1=true;
//line 196
im6=c[5];
//line 196
im8=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 196
int7=im8.as_int();
//line 196
im8=null;
//line 196
string9=n.imm_int(int7)
//line 196
im5=n.c_rt_lib.concat(im6,string9);;
//line 196
im6=null;
//line 196
int7=null;
//line 196
string9=null;
//line 196
im10=c[27];
//line 196
im4=n.c_rt_lib.concat(im5,im10);;
//line 196
im5=null;
//line 196
im10=null;
//line 196
im2=null;
//line 196
bool3=null;
//line 196
___arg__0.value = im0;___arg__1.value = bool1;return im4;
//line 197
label = 23; continue;
//line 197
case 23:
//line 197
bool3=null;
//line 197
im4=null;
//line 198
im11=c[2];
//line 198
im11=n.c_rt_lib.get_ref_hash(im0,im11);
//line 198
int12=1;
//line 198
int13=im11.as_int();
//line 198
int14=Math.floor(int13+int12);
//line 198
im11=n.imm_int(int14)
//line 198
string15=c[2];
//line 198
var call_6_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_6_1,string15,im11);im0=call_6_1.value;call_6_1=null;
//line 198
im11=null;
//line 198
int12=null;
//line 198
int13=null;
//line 198
int14=null;
//line 198
string15=null;
//line 199
___arg__0.value = im0;___arg__1.value = bool1;return im2;
}}}

function _prv_match_s(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var bool3=null;
var im4=null;
var im5=null;
var int6=null;
var im7=null;
var im8=null;
var int9=null;
var int10=null;
var string11=null;
var bool12=null;
var bool13=null;
var label=null;
while (1) { switch (label) {
default:
//line 203
int2=n.string.length(im1);
//line 204
im5=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 204
im7=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 204
int6=im7.as_int();
//line 204
im7=null;
//line 204
im4=n.c_std_lib.fast_substr(im5,int6,int2);
//line 204
im5=null;
//line 204
int6=null;
//line 204
bool3=n.c_rt_lib.eq(im4, im1)
//line 204
im4=null;
//line 204
bool3=!bool3
//line 204
if (bool3) {label = 29; continue;}
//line 205
im8=c[2];
//line 205
im8=n.c_rt_lib.get_ref_hash(im0,im8);
//line 205
int9=im8.as_int();
//line 205
int10=Math.floor(int9+int2);
//line 205
im8=n.imm_int(int10)
//line 205
string11=c[2];
//line 205
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string11,im8);im0=call_5_1.value;call_5_1=null;
//line 205
im8=null;
//line 205
int9=null;
//line 205
int10=null;
//line 205
string11=null;
//line 206
bool12=true;
//line 206
im1=null;
//line 206
int2=null;
//line 206
bool3=null;
//line 206
___arg__0.value = im0;return bool12;
//line 207
label = 37; continue;
//line 207
case 29:
//line 208
bool13=false;
//line 208
im1=null;
//line 208
int2=null;
//line 208
bool3=null;
//line 208
bool12=null;
//line 208
___arg__0.value = im0;return bool13;
//line 209
label = 37; continue;
//line 209
case 37:
//line 209
bool3=null;
//line 209
bool12=null;
//line 209
bool13=null;
}}}

function _prv__singleton_prv_fun_state_t() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 213
im3=n.ptd.string();
//line 213
im2=n.ptd.arr(im3);
//line 213
im3=null;
//line 213
im4=n.ptd.int();
//line 213
im5=n.ptd.int();
//line 213
im1=n.imm_hash({"str":im2,"len":im4,"pos":im5,});
//line 213
im2=null;
//line 213
im4=null;
//line 213
im5=null;
//line 213
im0=n.ptd.rec(im1);
//line 213
im1=null;
//line 213
return im0;
//line 213
im0=null;
//line 213
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_state_t;
n.dfile.state_t=function() {
if (_singleton_val__prv__singleton_prv_fun_state_t===undefined) {
_singleton_val__prv__singleton_prv_fun_state_t=_prv__singleton_prv_fun_state_t();
}
return _singleton_val__prv__singleton_prv_fun_state_t;
}

n.dfile.__dyn_state_t=function(arr) {
var ret = n.dfile.state_t()
return ret;
}

function _prv_parse(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var bool8=null;
var im9=null;
var int10=null;
var im11=null;
var int12=null;
var int13=null;
var string14=null;
var im15=null;
var bool16=null;
var im17=null;
var im18=null;
var im19=null;
var bool20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var int26=null;
var im27=null;
var string28=null;
var im29=null;
var im30=null;
var bool31=null;
var bool32=null;
var im33=null;
var im34=null;
var im35=null;
var im36=null;
var im37=null;
var im38=null;
var im39=null;
var im40=null;
var im41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var bool46=null;
var bool47=null;
var im48=null;
var im49=null;
var im50=null;
var im51=null;
var int52=null;
var im53=null;
var string54=null;
var im55=null;
var im56=null;
var int57=null;
var im58=null;
var int59=null;
var int60=null;
var string61=null;
var im62=null;
var bool63=null;
var im64=null;
var im65=null;
var bool66=null;
var im67=null;
var im68=null;
var im69=null;
var im70=null;
var im71=null;
var im72=null;
var im73=null;
var im74=null;
var im75=null;
var bool76=null;
var bool77=null;
var im78=null;
var im79=null;
var im80=null;
var im81=null;
var int82=null;
var im83=null;
var string84=null;
var im85=null;
var bool86=null;
var im87=null;
var int88=null;
var im89=null;
var int90=null;
var int91=null;
var string92=null;
var im93=null;
var im94=null;
var bool95=null;
var bool96=null;
var im97=null;
var im98=null;
var bool99=null;
var bool100=null;
var im101=null;
var im102=null;
var im103=null;
var bool104=null;
var im105=null;
var im106=null;
var im107=null;
var im108=null;
var im109=null;
var im110=null;
var im111=null;
var im112=null;
var im113=null;
var im114=null;
var im115=null;
var im116=null;
var im117=null;
var im118=null;
var im119=null;
var bool120=null;
var bool121=null;
var im122=null;
var im123=null;
var im124=null;
var im125=null;
var int126=null;
var im127=null;
var string128=null;
var im129=null;
var im130=null;
var bool131=null;
var im132=null;
var im133=null;
var im134=null;
var im135=null;
var int136=null;
var im137=null;
var string138=null;
var im139=null;
var im140=null;
var im141=null;
var label=null;
while (1) { switch (label) {
default:
//line 217
var call_0_1=new n.imm_ref(im0);_prv_eat_ws(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 218
var call_1_1=new n.imm_ref(im0);im3=_prv_get_char(call_1_1);im0=call_1_1.value;call_1_1=null;
//line 219
case 2:
//line 219
bool4=n.c_rt_lib.ov_is(im2,c[28]);;
//line 219
bool4=!bool4
//line 219
if (bool4) {label = 15; continue;}
//line 220
im5=n.imm_arr([]);
//line 221
im6=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 221
im6=n.c_rt_lib.ov_mk_arg(c[28],im6);;
//line 221
var call_4_2=new n.imm_ref(im5);im7=n.c_std_lib.exec(im2,call_4_2);im5=call_4_2.value;call_4_2=null;
//line 221
im2=n.ptd.ensure_only_static_do_not_touch_without_permission(im6,im7);
//line 221
im6=null;
//line 221
im7=null;
//line 221
im5=null;
//line 222
label = 2; continue;
//line 222
case 15:
//line 223
im9=c[29];
//line 223
bool8=n.c_rt_lib.eq(im3, im9)
//line 223
im9=null;
//line 223
bool8=!bool8
//line 223
if (bool8) {label = 248; continue;}
//line 224
int10=1;
//line 224
im11=c[2];
//line 224
im11=n.c_rt_lib.get_ref_hash(im0,im11);
//line 224
int12=im11.as_int();
//line 224
int13=Math.floor(int12+int10);
//line 224
im11=n.imm_int(int13)
//line 224
string14=c[2];
//line 224
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string14,im11);im0=call_7_1.value;call_7_1=null;
//line 224
int10=null;
//line 224
im11=null;
//line 224
int12=null;
//line 224
int13=null;
//line 224
string14=null;
//line 225
im15=n.imm_hash({});
//line 226
var call_8_1=new n.imm_ref(im0);_prv_eat_ws(call_8_1);im0=call_8_1.value;call_8_1=null;
//line 227
case 36:
//line 227
im17=c[30];
//line 227
var call_9_1=new n.imm_ref(im0);bool16=_prv_match_s(call_9_1,im17);im0=call_9_1.value;call_9_1=null;
//line 227
im17=null;
//line 227
bool16=!bool16
//line 227
bool16=!bool16
//line 227
if (bool16) {label = 235; continue;}
//line 228
im19=n.ptd.string();
//line 228
var call_11_1=new n.imm_ref(im0);var call_11_2=new n.imm_ref(bool1);im18=_prv_parse_scalar(call_11_1,call_11_2,im19);im0=call_11_1.value;call_11_1=null;bool1=call_11_2.value;call_11_2=null;
//line 228
im19=null;
//line 229
bool20=bool1
//line 229
bool20=!bool20
//line 229
if (bool20) {label = 59; continue;}
//line 229
im2=null;
//line 229
im3=null;
//line 229
bool4=null;
//line 229
im5=null;
//line 229
bool8=null;
//line 229
im15=null;
//line 229
bool16=null;
//line 229
bool20=null;
//line 229
___arg__0.value = im0;___arg__1.value = bool1;return im18;
//line 229
label = 59; continue;
//line 229
case 59:
//line 229
bool20=null;
//line 230
var call_12_1=new n.imm_ref(im0);_prv_eat_ws(call_12_1);im0=call_12_1.value;call_12_1=null;
//line 231
im22=c[31];
//line 231
var call_13_1=new n.imm_ref(im0);bool21=_prv_match_s(call_13_1,im22);im0=call_13_1.value;call_13_1=null;
//line 231
im22=null;
//line 231
bool21=!bool21
//line 231
bool21=!bool21
//line 231
if (bool21) {label = 93; continue;}
//line 232
bool1=true;
//line 233
im25=c[5];
//line 233
im27=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 233
int26=im27.as_int();
//line 233
im27=null;
//line 233
string28=n.imm_int(int26)
//line 233
im24=n.c_rt_lib.concat(im25,string28);;
//line 233
im25=null;
//line 233
int26=null;
//line 233
string28=null;
//line 233
im29=c[32];
//line 233
im23=n.c_rt_lib.concat(im24,im29);;
//line 233
im24=null;
//line 233
im29=null;
//line 233
im2=null;
//line 233
im3=null;
//line 233
bool4=null;
//line 233
im5=null;
//line 233
bool8=null;
//line 233
im15=null;
//line 233
bool16=null;
//line 233
im18=null;
//line 233
bool21=null;
//line 233
___arg__0.value = im0;___arg__1.value = bool1;return im23;
//line 234
label = 93; continue;
//line 234
case 93:
//line 234
bool21=null;
//line 234
im23=null;
//line 236
bool31=n.c_rt_lib.ov_is(im2,c[33]);;
//line 236
bool31=!bool31
//line 236
if (bool31) {label = 130; continue;}
//line 237
im33=n.c_rt_lib.ov_as(im2,c[33]);;
//line 237
bool32=n.hash.has_key(im33,im18);
//line 237
im33=null;
//line 237
bool32=!bool32
//line 237
if (bool32) {label = 108; continue;}
//line 238
im34=n.c_rt_lib.ov_as(im2,c[33]);;
//line 238
im30=n.c_rt_lib.hash_get_value(im34,im18);
//line 238
im34=null;
//line 239
label = 126; continue;
//line 239
case 108:
//line 240
bool1=true;
//line 241
im36=c[34];
//line 241
im35=n.c_rt_lib.concat(im36,im18);;
//line 241
im36=null;
//line 241
im2=null;
//line 241
im3=null;
//line 241
bool4=null;
//line 241
im5=null;
//line 241
bool8=null;
//line 241
im15=null;
//line 241
bool16=null;
//line 241
im18=null;
//line 241
im30=null;
//line 241
bool31=null;
//line 241
bool32=null;
//line 241
___arg__0.value = im0;___arg__1.value = bool1;return im35;
//line 242
label = 126; continue;
//line 242
case 126:
//line 242
bool32=null;
//line 242
im35=null;
//line 243
label = 171; continue;
//line 243
case 130:
//line 243
bool31=n.c_rt_lib.ov_is(im2,c[35]);;
//line 243
bool31=!bool31
//line 243
if (bool31) {label = 136; continue;}
//line 244
im30=n.c_rt_lib.ov_as(im2,c[35]);;
//line 245
label = 171; continue;
//line 245
case 136:
//line 245
bool31=n.c_rt_lib.ov_is(im2,c[10]);;
//line 245
bool31=!bool31
//line 245
if (bool31) {label = 142; continue;}
//line 246
im30=c[36]
//line 247
label = 171; continue;
//line 247
case 142:
//line 248
bool1=true;
//line 249
im40=c[16];
//line 249
im41=n.dfile.ssave(im2);
//line 249
im39=n.c_rt_lib.concat(im40,im41);;
//line 249
im40=null;
//line 249
im41=null;
//line 249
im42=c[37];
//line 249
im38=n.c_rt_lib.concat(im39,im42);;
//line 249
im39=null;
//line 249
im42=null;
//line 249
im44=c[38]
//line 249
im43=n.dfile.ssave(im44);
//line 249
im44=null;
//line 249
im37=n.c_rt_lib.concat(im38,im43);;
//line 249
im38=null;
//line 249
im43=null;
//line 249
im2=null;
//line 249
im3=null;
//line 249
bool4=null;
//line 249
im5=null;
//line 249
bool8=null;
//line 249
im15=null;
//line 249
bool16=null;
//line 249
im18=null;
//line 249
im30=null;
//line 249
bool31=null;
//line 249
___arg__0.value = im0;___arg__1.value = bool1;return im37;
//line 250
label = 171; continue;
//line 250
case 171:
//line 250
bool31=null;
//line 250
im37=null;
//line 251
var call_31_1=new n.imm_ref(im0);var call_31_2=new n.imm_ref(bool1);im45=_prv_parse(call_31_1,call_31_2,im30);im0=call_31_1.value;call_31_1=null;bool1=call_31_2.value;call_31_2=null;
//line 252
bool46=bool1
//line 252
bool46=!bool46
//line 252
if (bool46) {label = 190; continue;}
//line 252
im2=null;
//line 252
im3=null;
//line 252
bool4=null;
//line 252
im5=null;
//line 252
bool8=null;
//line 252
im15=null;
//line 252
bool16=null;
//line 252
im18=null;
//line 252
im30=null;
//line 252
bool46=null;
//line 252
___arg__0.value = im0;___arg__1.value = bool1;return im45;
//line 252
label = 190; continue;
//line 252
case 190:
//line 252
bool46=null;
//line 253
var call_32_1=new n.imm_ref(im15);n.hash.set_value(call_32_1,im18,im45);im15=call_32_1.value;call_32_1=null;
//line 254
var call_33_1=new n.imm_ref(im0);_prv_eat_ws(call_33_1);im0=call_33_1.value;call_33_1=null;
//line 255
im48=c[39];
//line 255
var call_34_1=new n.imm_ref(im0);bool47=_prv_match_s(call_34_1,im48);im0=call_34_1.value;call_34_1=null;
//line 255
im48=null;
//line 255
bool47=!bool47
//line 255
bool47=!bool47
//line 255
if (bool47) {label = 227; continue;}
//line 256
bool1=true;
//line 257
im51=c[5];
//line 257
im53=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 257
int52=im53.as_int();
//line 257
im53=null;
//line 257
string54=n.imm_int(int52)
//line 257
im50=n.c_rt_lib.concat(im51,string54);;
//line 257
im51=null;
//line 257
int52=null;
//line 257
string54=null;
//line 257
im55=c[40];
//line 257
im49=n.c_rt_lib.concat(im50,im55);;
//line 257
im50=null;
//line 257
im55=null;
//line 257
im2=null;
//line 257
im3=null;
//line 257
bool4=null;
//line 257
im5=null;
//line 257
bool8=null;
//line 257
im15=null;
//line 257
bool16=null;
//line 257
im18=null;
//line 257
im30=null;
//line 257
im45=null;
//line 257
bool47=null;
//line 257
___arg__0.value = im0;___arg__1.value = bool1;return im49;
//line 258
label = 227; continue;
//line 258
case 227:
//line 258
bool47=null;
//line 258
im49=null;
//line 259
var call_38_1=new n.imm_ref(im0);_prv_eat_ws(call_38_1);im0=call_38_1.value;call_38_1=null;
//line 259
im18=null;
//line 259
im30=null;
//line 259
im45=null;
//line 260
label = 36; continue;
//line 260
case 235:
//line 261
var call_39_1=new n.imm_ref(im0);_prv_eat_ws(call_39_1);im0=call_39_1.value;call_39_1=null;
//line 262
im2=null;
//line 262
im3=null;
//line 262
bool4=null;
//line 262
im5=null;
//line 262
bool8=null;
//line 262
bool16=null;
//line 262
im18=null;
//line 262
im30=null;
//line 262
im45=null;
//line 262
___arg__0.value = im0;___arg__1.value = bool1;return im15;
//line 263
label = 782; continue;
//line 263
case 248:
//line 263
im56=c[41];
//line 263
bool8=n.c_rt_lib.eq(im3, im56)
//line 263
im56=null;
//line 263
bool8=!bool8
//line 263
if (bool8) {label = 407; continue;}
//line 264
int57=1;
//line 264
im58=c[2];
//line 264
im58=n.c_rt_lib.get_ref_hash(im0,im58);
//line 264
int59=im58.as_int();
//line 264
int60=Math.floor(int59+int57);
//line 264
im58=n.imm_int(int60)
//line 264
string61=c[2];
//line 264
var call_41_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_41_1,string61,im58);im0=call_41_1.value;call_41_1=null;
//line 264
int57=null;
//line 264
im58=null;
//line 264
int59=null;
//line 264
int60=null;
//line 264
string61=null;
//line 265
im62=n.imm_arr([]);
//line 266
var call_42_1=new n.imm_ref(im0);_prv_eat_ws(call_42_1);im0=call_42_1.value;call_42_1=null;
//line 267
case 269:
//line 267
im64=c[42];
//line 267
var call_43_1=new n.imm_ref(im0);bool63=_prv_match_s(call_43_1,im64);im0=call_43_1.value;call_43_1=null;
//line 267
im64=null;
//line 267
bool63=!bool63
//line 267
bool63=!bool63
//line 267
if (bool63) {label = 391; continue;}
//line 269
bool66=n.c_rt_lib.ov_is(im2,c[43]);;
//line 269
bool66=!bool66
//line 269
if (bool66) {label = 281; continue;}
//line 270
im65=n.c_rt_lib.ov_as(im2,c[43]);;
//line 271
label = 320; continue;
//line 271
case 281:
//line 271
bool66=n.c_rt_lib.ov_is(im2,c[10]);;
//line 271
bool66=!bool66
//line 271
if (bool66) {label = 287; continue;}
//line 272
im65=c[44]
//line 273
label = 320; continue;
//line 273
case 287:
//line 274
bool1=true;
//line 275
im70=c[16];
//line 275
im71=n.dfile.ssave(im2);
//line 275
im69=n.c_rt_lib.concat(im70,im71);;
//line 275
im70=null;
//line 275
im71=null;
//line 275
im72=c[37];
//line 275
im68=n.c_rt_lib.concat(im69,im72);;
//line 275
im69=null;
//line 275
im72=null;
//line 275
im74=c[45]
//line 275
im73=n.dfile.ssave(im74);
//line 275
im74=null;
//line 275
im67=n.c_rt_lib.concat(im68,im73);;
//line 275
im68=null;
//line 275
im73=null;
//line 275
im2=null;
//line 275
im3=null;
//line 275
bool4=null;
//line 275
im5=null;
//line 275
bool8=null;
//line 275
im15=null;
//line 275
bool16=null;
//line 275
im18=null;
//line 275
im30=null;
//line 275
im45=null;
//line 275
im62=null;
//line 275
bool63=null;
//line 275
im65=null;
//line 275
bool66=null;
//line 275
___arg__0.value = im0;___arg__1.value = bool1;return im67;
//line 276
label = 320; continue;
//line 276
case 320:
//line 276
bool66=null;
//line 276
im67=null;
//line 277
var call_52_1=new n.imm_ref(im0);var call_52_2=new n.imm_ref(bool1);im75=_prv_parse(call_52_1,call_52_2,im65);im0=call_52_1.value;call_52_1=null;bool1=call_52_2.value;call_52_2=null;
//line 278
bool76=bool1
//line 278
bool76=!bool76
//line 278
if (bool76) {label = 343; continue;}
//line 278
im2=null;
//line 278
im3=null;
//line 278
bool4=null;
//line 278
im5=null;
//line 278
bool8=null;
//line 278
im15=null;
//line 278
bool16=null;
//line 278
im18=null;
//line 278
im30=null;
//line 278
im45=null;
//line 278
im62=null;
//line 278
bool63=null;
//line 278
im65=null;
//line 278
bool76=null;
//line 278
___arg__0.value = im0;___arg__1.value = bool1;return im75;
//line 278
label = 343; continue;
//line 278
case 343:
//line 278
bool76=null;
//line 279
var call_53_1=new n.imm_ref(im62);n.array.push(call_53_1,im75);im62=call_53_1.value;call_53_1=null;
//line 280
var call_54_1=new n.imm_ref(im0);_prv_eat_ws(call_54_1);im0=call_54_1.value;call_54_1=null;
//line 281
im78=c[39];
//line 281
var call_55_1=new n.imm_ref(im0);bool77=_prv_match_s(call_55_1,im78);im0=call_55_1.value;call_55_1=null;
//line 281
im78=null;
//line 281
bool77=!bool77
//line 281
bool77=!bool77
//line 281
if (bool77) {label = 384; continue;}
//line 282
bool1=true;
//line 283
im81=c[5];
//line 283
im83=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 283
int82=im83.as_int();
//line 283
im83=null;
//line 283
string84=n.imm_int(int82)
//line 283
im80=n.c_rt_lib.concat(im81,string84);;
//line 283
im81=null;
//line 283
int82=null;
//line 283
string84=null;
//line 283
im85=c[40];
//line 283
im79=n.c_rt_lib.concat(im80,im85);;
//line 283
im80=null;
//line 283
im85=null;
//line 283
im2=null;
//line 283
im3=null;
//line 283
bool4=null;
//line 283
im5=null;
//line 283
bool8=null;
//line 283
im15=null;
//line 283
bool16=null;
//line 283
im18=null;
//line 283
im30=null;
//line 283
im45=null;
//line 283
im62=null;
//line 283
bool63=null;
//line 283
im65=null;
//line 283
im75=null;
//line 283
bool77=null;
//line 283
___arg__0.value = im0;___arg__1.value = bool1;return im79;
//line 284
label = 384; continue;
//line 284
case 384:
//line 284
bool77=null;
//line 284
im79=null;
//line 285
var call_59_1=new n.imm_ref(im0);_prv_eat_ws(call_59_1);im0=call_59_1.value;call_59_1=null;
//line 285
im65=null;
//line 285
im75=null;
//line 286
label = 269; continue;
//line 286
case 391:
//line 287
im2=null;
//line 287
im3=null;
//line 287
bool4=null;
//line 287
im5=null;
//line 287
bool8=null;
//line 287
im15=null;
//line 287
bool16=null;
//line 287
im18=null;
//line 287
im30=null;
//line 287
im45=null;
//line 287
bool63=null;
//line 287
im65=null;
//line 287
im75=null;
//line 287
___arg__0.value = im0;___arg__1.value = bool1;return im62;
//line 288
label = 782; continue;
//line 288
case 407:
//line 288
im87=c[46];
//line 288
bool8=n.c_rt_lib.eq(im3, im87)
//line 288
im87=null;
//line 288
bool86=!bool8
//line 288
if (bool86) {label = 414; continue;}
//line 288
var call_60_1=new n.imm_ref(im0);bool8=_prv_is_ov(call_60_1);im0=call_60_1.value;call_60_1=null;
//line 288
case 414:
//line 288
bool86=null;
//line 288
bool8=!bool8
//line 288
if (bool8) {label = 762; continue;}
//line 289
int88=7;
//line 289
im89=c[2];
//line 289
im89=n.c_rt_lib.get_ref_hash(im0,im89);
//line 289
int90=im89.as_int();
//line 289
int91=Math.floor(int90+int88);
//line 289
im89=n.imm_int(int91)
//line 289
string92=c[2];
//line 289
var call_62_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_62_1,string92,im89);im0=call_62_1.value;call_62_1=null;
//line 289
int88=null;
//line 289
im89=null;
//line 289
int90=null;
//line 289
int91=null;
//line 289
string92=null;
//line 290
im94=n.ptd.string();
//line 290
var call_64_1=new n.imm_ref(im0);var call_64_2=new n.imm_ref(bool1);im93=_prv_parse_scalar(call_64_1,call_64_2,im94);im0=call_64_1.value;call_64_1=null;bool1=call_64_2.value;call_64_2=null;
//line 290
im94=null;
//line 291
bool95=bool1
//line 291
bool95=!bool95
//line 291
if (bool95) {label = 454; continue;}
//line 291
im2=null;
//line 291
im3=null;
//line 291
bool4=null;
//line 291
im5=null;
//line 291
bool8=null;
//line 291
im15=null;
//line 291
bool16=null;
//line 291
im18=null;
//line 291
im30=null;
//line 291
im45=null;
//line 291
im62=null;
//line 291
bool63=null;
//line 291
im65=null;
//line 291
im75=null;
//line 291
bool95=null;
//line 291
___arg__0.value = im0;___arg__1.value = bool1;return im93;
//line 291
label = 454; continue;
//line 291
case 454:
//line 291
bool95=null;
//line 292
var call_65_1=new n.imm_ref(im0);_prv_eat_ws(call_65_1);im0=call_65_1.value;call_65_1=null;
//line 293
im97=c[39];
//line 293
var call_66_1=new n.imm_ref(im0);bool96=_prv_match_s(call_66_1,im97);im0=call_66_1.value;call_66_1=null;
//line 293
im97=null;
//line 293
bool96=!bool96
//line 293
if (bool96) {label = 696; continue;}
//line 295
bool99=n.c_rt_lib.ov_is(im2,c[47]);;
//line 295
bool99=!bool99
//line 295
if (bool99) {label = 558; continue;}
//line 296
im101=n.c_rt_lib.ov_as(im2,c[47]);;
//line 296
bool100=n.hash.has_key(im101,im93);
//line 296
im101=null;
//line 296
bool100=!bool100
//line 296
if (bool100) {label = 516; continue;}
//line 297
im103=n.c_rt_lib.ov_as(im2,c[47]);;
//line 297
im102=n.c_rt_lib.hash_get_value(im103,im93);
//line 297
im103=null;
//line 297
bool104=n.c_rt_lib.ov_is(im102,c[48]);;
//line 297
if (bool104) {label = 480; continue;}
//line 299
bool104=n.c_rt_lib.ov_is(im102,c[49]);;
//line 299
if (bool104) {label = 485; continue;}
//line 299
im105=c[14];
//line 299
im105=n.imm_arr([im105,im102,]);
//line 299
n.nl_die();
//line 297
case 480:
//line 297
im107=n.c_rt_lib.ov_as(im102,c[48]);;
//line 297
im106=im107
//line 298
im98=im106
//line 299
label = 514; continue;
//line 299
case 485:
//line 300
bool1=true;
//line 301
im108=c[50];
//line 301
im2=null;
//line 301
im3=null;
//line 301
bool4=null;
//line 301
im5=null;
//line 301
bool8=null;
//line 301
im15=null;
//line 301
bool16=null;
//line 301
im18=null;
//line 301
im30=null;
//line 301
im45=null;
//line 301
im62=null;
//line 301
bool63=null;
//line 301
im65=null;
//line 301
im75=null;
//line 301
im93=null;
//line 301
bool96=null;
//line 301
im98=null;
//line 301
bool99=null;
//line 301
bool100=null;
//line 301
im102=null;
//line 301
bool104=null;
//line 301
im105=null;
//line 301
im106=null;
//line 301
im107=null;
//line 301
___arg__0.value = im0;___arg__1.value = bool1;return im108;
//line 302
label = 514; continue;
//line 302
case 514:
//line 303
label = 548; continue;
//line 303
case 516:
//line 304
bool1=true;
//line 305
im110=c[51];
//line 305
im109=n.c_rt_lib.concat(im110,im93);;
//line 305
im110=null;
//line 305
im2=null;
//line 305
im3=null;
//line 305
bool4=null;
//line 305
im5=null;
//line 305
bool8=null;
//line 305
im15=null;
//line 305
bool16=null;
//line 305
im18=null;
//line 305
im30=null;
//line 305
im45=null;
//line 305
im62=null;
//line 305
bool63=null;
//line 305
im65=null;
//line 305
im75=null;
//line 305
im93=null;
//line 305
bool96=null;
//line 305
im98=null;
//line 305
bool99=null;
//line 305
bool100=null;
//line 305
im102=null;
//line 305
bool104=null;
//line 305
im105=null;
//line 305
im106=null;
//line 305
im107=null;
//line 305
im108=null;
//line 305
___arg__0.value = im0;___arg__1.value = bool1;return im109;
//line 306
label = 548; continue;
//line 306
case 548:
//line 306
bool100=null;
//line 306
im102=null;
//line 306
bool104=null;
//line 306
im105=null;
//line 306
im106=null;
//line 306
im107=null;
//line 306
im108=null;
//line 306
im109=null;
//line 307
label = 601; continue;
//line 307
case 558:
//line 307
bool99=n.c_rt_lib.ov_is(im2,c[10]);;
//line 307
bool99=!bool99
//line 307
if (bool99) {label = 564; continue;}
//line 308
im98=c[52]
//line 309
label = 601; continue;
//line 309
case 564:
//line 310
bool1=true;
//line 311
im114=c[16];
//line 311
im115=n.dfile.ssave(im2);
//line 311
im113=n.c_rt_lib.concat(im114,im115);;
//line 311
im114=null;
//line 311
im115=null;
//line 311
im116=c[37];
//line 311
im112=n.c_rt_lib.concat(im113,im116);;
//line 311
im113=null;
//line 311
im116=null;
//line 311
im118=c[53]
//line 311
im117=n.dfile.ssave(im118);
//line 311
im118=null;
//line 311
im111=n.c_rt_lib.concat(im112,im117);;
//line 311
im112=null;
//line 311
im117=null;
//line 311
im2=null;
//line 311
im3=null;
//line 311
bool4=null;
//line 311
im5=null;
//line 311
bool8=null;
//line 311
im15=null;
//line 311
bool16=null;
//line 311
im18=null;
//line 311
im30=null;
//line 311
im45=null;
//line 311
im62=null;
//line 311
bool63=null;
//line 311
im65=null;
//line 311
im75=null;
//line 311
im93=null;
//line 311
bool96=null;
//line 311
im98=null;
//line 311
bool99=null;
//line 311
___arg__0.value = im0;___arg__1.value = bool1;return im111;
//line 312
label = 601; continue;
//line 312
case 601:
//line 312
bool99=null;
//line 312
im111=null;
//line 313
var call_82_1=new n.imm_ref(im0);var call_82_2=new n.imm_ref(bool1);im119=_prv_parse(call_82_1,call_82_2,im98);im0=call_82_1.value;call_82_1=null;bool1=call_82_2.value;call_82_2=null;
//line 314
bool120=bool1
//line 314
bool120=!bool120
//line 314
if (bool120) {label = 628; continue;}
//line 314
im2=null;
//line 314
im3=null;
//line 314
bool4=null;
//line 314
im5=null;
//line 314
bool8=null;
//line 314
im15=null;
//line 314
bool16=null;
//line 314
im18=null;
//line 314
im30=null;
//line 314
im45=null;
//line 314
im62=null;
//line 314
bool63=null;
//line 314
im65=null;
//line 314
im75=null;
//line 314
im93=null;
//line 314
bool96=null;
//line 314
im98=null;
//line 314
bool120=null;
//line 314
___arg__0.value = im0;___arg__1.value = bool1;return im119;
//line 314
label = 628; continue;
//line 314
case 628:
//line 314
bool120=null;
//line 315
var call_83_1=new n.imm_ref(im0);_prv_eat_ws(call_83_1);im0=call_83_1.value;call_83_1=null;
//line 316
im122=c[54];
//line 316
var call_84_1=new n.imm_ref(im0);bool121=_prv_match_s(call_84_1,im122);im0=call_84_1.value;call_84_1=null;
//line 316
im122=null;
//line 316
bool121=!bool121
//line 316
bool121=!bool121
//line 316
if (bool121) {label = 672; continue;}
//line 317
bool1=true;
//line 318
im125=c[5];
//line 318
im127=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 318
int126=im127.as_int();
//line 318
im127=null;
//line 318
string128=n.imm_int(int126)
//line 318
im124=n.c_rt_lib.concat(im125,string128);;
//line 318
im125=null;
//line 318
int126=null;
//line 318
string128=null;
//line 318
im129=c[55];
//line 318
im123=n.c_rt_lib.concat(im124,im129);;
//line 318
im124=null;
//line 318
im129=null;
//line 318
im2=null;
//line 318
im3=null;
//line 318
bool4=null;
//line 318
im5=null;
//line 318
bool8=null;
//line 318
im15=null;
//line 318
bool16=null;
//line 318
im18=null;
//line 318
im30=null;
//line 318
im45=null;
//line 318
im62=null;
//line 318
bool63=null;
//line 318
im65=null;
//line 318
im75=null;
//line 318
im93=null;
//line 318
bool96=null;
//line 318
im98=null;
//line 318
im119=null;
//line 318
bool121=null;
//line 318
___arg__0.value = im0;___arg__1.value = bool1;return im123;
//line 319
label = 672; continue;
//line 319
case 672:
//line 319
bool121=null;
//line 319
im123=null;
//line 320
im130=n.ov.mk_val(im93,im119);
//line 320
im2=null;
//line 320
im3=null;
//line 320
bool4=null;
//line 320
im5=null;
//line 320
bool8=null;
//line 320
im15=null;
//line 320
bool16=null;
//line 320
im18=null;
//line 320
im30=null;
//line 320
im45=null;
//line 320
im62=null;
//line 320
bool63=null;
//line 320
im65=null;
//line 320
im75=null;
//line 320
im93=null;
//line 320
bool96=null;
//line 320
im98=null;
//line 320
im119=null;
//line 320
___arg__0.value = im0;___arg__1.value = bool1;return im130;
//line 321
label = 696; continue;
//line 321
case 696:
//line 321
bool96=null;
//line 321
im98=null;
//line 321
im119=null;
//line 321
im130=null;
//line 322
var call_89_1=new n.imm_ref(im0);_prv_eat_ws(call_89_1);im0=call_89_1.value;call_89_1=null;
//line 323
im132=c[54];
//line 323
var call_90_1=new n.imm_ref(im0);bool131=_prv_match_s(call_90_1,im132);im0=call_90_1.value;call_90_1=null;
//line 323
im132=null;
//line 323
bool131=!bool131
//line 323
bool131=!bool131
//line 323
if (bool131) {label = 740; continue;}
//line 324
bool1=true;
//line 325
im135=c[5];
//line 325
im137=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 325
int136=im137.as_int();
//line 325
im137=null;
//line 325
string138=n.imm_int(int136)
//line 325
im134=n.c_rt_lib.concat(im135,string138);;
//line 325
im135=null;
//line 325
int136=null;
//line 325
string138=null;
//line 325
im139=c[55];
//line 325
im133=n.c_rt_lib.concat(im134,im139);;
//line 325
im134=null;
//line 325
im139=null;
//line 325
im2=null;
//line 325
im3=null;
//line 325
bool4=null;
//line 325
im5=null;
//line 325
bool8=null;
//line 325
im15=null;
//line 325
bool16=null;
//line 325
im18=null;
//line 325
im30=null;
//line 325
im45=null;
//line 325
im62=null;
//line 325
bool63=null;
//line 325
im65=null;
//line 325
im75=null;
//line 325
im93=null;
//line 325
bool131=null;
//line 325
___arg__0.value = im0;___arg__1.value = bool1;return im133;
//line 326
label = 740; continue;
//line 326
case 740:
//line 326
bool131=null;
//line 326
im133=null;
//line 327
var call_94_1=new n.imm_ref(im0);_prv_eat_ws(call_94_1);im0=call_94_1.value;call_94_1=null;
//line 328
im140=n.ov.mk(im93);
//line 328
im2=null;
//line 328
im3=null;
//line 328
bool4=null;
//line 328
im5=null;
//line 328
bool8=null;
//line 328
im15=null;
//line 328
bool16=null;
//line 328
im18=null;
//line 328
im30=null;
//line 328
im45=null;
//line 328
im62=null;
//line 328
bool63=null;
//line 328
im65=null;
//line 328
im75=null;
//line 328
im93=null;
//line 328
___arg__0.value = im0;___arg__1.value = bool1;return im140;
//line 329
label = 782; continue;
//line 329
case 762:
//line 330
var call_96_1=new n.imm_ref(im0);var call_96_2=new n.imm_ref(bool1);im141=_prv_parse_scalar(call_96_1,call_96_2,im2);im0=call_96_1.value;call_96_1=null;bool1=call_96_2.value;call_96_2=null;
//line 330
im2=null;
//line 330
im3=null;
//line 330
bool4=null;
//line 330
im5=null;
//line 330
bool8=null;
//line 330
im15=null;
//line 330
bool16=null;
//line 330
im18=null;
//line 330
im30=null;
//line 330
im45=null;
//line 330
im62=null;
//line 330
bool63=null;
//line 330
im65=null;
//line 330
im75=null;
//line 330
im93=null;
//line 330
im140=null;
//line 330
___arg__0.value = im0;___arg__1.value = bool1;return im141;
//line 331
label = 782; continue;
//line 331
case 782:
//line 331
bool8=null;
//line 331
im15=null;
//line 331
bool16=null;
//line 331
im18=null;
//line 331
im30=null;
//line 331
im45=null;
//line 331
im62=null;
//line 331
bool63=null;
//line 331
im65=null;
//line 331
im75=null;
//line 331
im93=null;
//line 331
im140=null;
//line 331
im141=null;
//line 331
im2=null;
//line 331
im3=null;
//line 331
bool4=null;
//line 331
im5=null;
//line 331
___arg__0.value = im0;___arg__1.value = bool1;return null;
}}}

n.dfile.sload=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var bool2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 335
im3=n.dfile.try_sload(im0);
//line 335
bool2=n.c_rt_lib.ov_is(im3,c[12]);;
//line 335
if (bool2) {label = 5; continue;}
//line 335
im3=n.c_rt_lib.ov_mk_arg(c[56],im3);;
//line 335
n.nl_die();
//line 335
case 5:
//line 335
im1=n.c_rt_lib.ov_as(im3,c[12]);;
//line 336
im0=null;
//line 336
bool2=null;
//line 336
im3=null;
//line 336
return im1;
//line 336
im0=null;
//line 336
im1=null;
//line 336
bool2=null;
//line 336
im3=null;
//line 336
return null;
}}}

n.dfile.__dyn_sload=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile.sload(arg0)
return ret;
}

n.dfile.sload_with_type=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 340
im4=n.dfile.try_sload_with_type(im0,im1);
//line 340
bool3=n.c_rt_lib.ov_is(im4,c[12]);;
//line 340
if (bool3) {label = 5; continue;}
//line 340
im4=n.c_rt_lib.ov_mk_arg(c[56],im4);;
//line 340
n.nl_die();
//line 340
case 5:
//line 340
im2=n.c_rt_lib.ov_as(im4,c[12]);;
//line 341
im0=null;
//line 341
im1=null;
//line 341
bool3=null;
//line 341
im4=null;
//line 341
return im2;
//line 341
im0=null;
//line 341
im1=null;
//line 341
im2=null;
//line 341
bool3=null;
//line 341
im4=null;
//line 341
return null;
}}}

n.dfile.__dyn_sload_with_type=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile.sload_with_type(arg0, arg1)
return ret;
}

n.dfile.sload_with_type_only_dynamic=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 345
im4=n.dfile.try_sload_with_type(im0,im1);
//line 345
bool3=n.c_rt_lib.ov_is(im4,c[12]);;
//line 345
if (bool3) {label = 5; continue;}
//line 345
im4=n.c_rt_lib.ov_mk_arg(c[56],im4);;
//line 345
n.nl_die();
//line 345
case 5:
//line 345
im2=n.c_rt_lib.ov_as(im4,c[12]);;
//line 346
im0=null;
//line 346
im1=null;
//line 346
bool3=null;
//line 346
im4=null;
//line 346
return im2;
//line 346
im0=null;
//line 346
im1=null;
//line 346
im2=null;
//line 346
bool3=null;
//line 346
im4=null;
//line 346
return null;
}}}

n.dfile.__dyn_sload_with_type_only_dynamic=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile.sload_with_type_only_dynamic(arg0, arg1)
return ret;
}

n.dfile.try_sload=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 350
im2=n.ptd.ptd_im();
//line 350
im1=n.dfile.try_sload_with_type(im2,im0);
//line 350
im2=null;
//line 350
im0=null;
//line 350
return im1;
}}}

n.dfile.__dyn_try_sload=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile.try_sload(arg0)
return ret;
}

n.dfile.try_sload_with_type=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var int6=null;
var im7=null;
var int8=null;
var im9=null;
var bool10=null;
var im11=null;
var bool12=null;
var bool13=null;
var int14=null;
var im15=null;
var int16=null;
var im17=null;
var im18=null;
var im19=null;
var int20=null;
var im21=null;
var string22=null;
var im23=null;
var bool24=null;
var im25=null;
var im26=null;
var im27=null;
var label=null;
while (1) { switch (label) {
default:
//line 354
im3=n.ptd.string();
//line 354
im2=n.ptd.ensure(im3,im1);
//line 354
im3=null;
//line 355
im5=n.imm_arr([im2,]);
//line 355
int6=0;
//line 355
im7=n.imm_int(int6)
//line 355
int8=n.string.length(im2);
//line 355
im9=n.imm_int(int8)
//line 355
im4=n.imm_hash({"str":im5,"pos":im7,"len":im9,});
//line 355
im5=null;
//line 355
int6=null;
//line 355
im7=null;
//line 355
int8=null;
//line 355
im9=null;
//line 356
bool10=false;
//line 357
var call_3_1=new n.imm_ref(im4);_prv_eat_ws(call_3_1);im4=call_3_1.value;call_3_1=null;
//line 358
var call_4_1=new n.imm_ref(im4);var call_4_2=new n.imm_ref(bool10);im11=_prv_parse(call_4_1,call_4_2,im0);im4=call_4_1.value;call_4_1=null;bool10=call_4_2.value;call_4_2=null;
//line 359
var call_5_1=new n.imm_ref(im4);_prv_eat_ws(call_5_1);im4=call_5_1.value;call_5_1=null;
//line 360
bool12=bool10
//line 360
bool12=!bool12
//line 360
bool13=!bool12
//line 360
if (bool13) {label = 31; continue;}
//line 360
im15=n.c_rt_lib.hash_get_value(im4,c[2]);;
//line 360
int14=im15.as_int();
//line 360
im15=null;
//line 360
im17=n.c_rt_lib.hash_get_value(im4,c[3]);;
//line 360
int16=im17.as_int();
//line 360
im17=null;
//line 360
bool12=int14!=int16;
//line 360
int14=null;
//line 360
int16=null;
//line 360
case 31:
//line 360
bool13=null;
//line 360
bool12=!bool12
//line 360
if (bool12) {label = 50; continue;}
//line 361
bool10=true;
//line 362
im19=c[5];
//line 362
im21=n.c_rt_lib.hash_get_value(im4,c[2]);;
//line 362
int20=im21.as_int();
//line 362
im21=null;
//line 362
string22=n.imm_int(int20)
//line 362
im18=n.c_rt_lib.concat(im19,string22);;
//line 362
im19=null;
//line 362
int20=null;
//line 362
string22=null;
//line 362
im23=c[57];
//line 362
im11=n.c_rt_lib.concat(im18,im23);;
//line 362
im18=null;
//line 362
im23=null;
//line 363
label = 50; continue;
//line 363
case 50:
//line 363
bool12=null;
//line 364
bool24=bool10
//line 364
bool24=!bool24
//line 364
if (bool24) {label = 68; continue;}
//line 365
im25=n.ptd.string();
//line 365
im11=n.ptd.ensure(im25,im11);
//line 365
im25=null;
//line 366
im26=n.c_rt_lib.ov_mk_arg(c[13],im11);;
//line 366
im0=null;
//line 366
im1=null;
//line 366
im2=null;
//line 366
im4=null;
//line 366
bool10=null;
//line 366
im11=null;
//line 366
bool24=null;
//line 366
return im26;
//line 367
label = 80; continue;
//line 367
case 68:
//line 368
im27=n.c_rt_lib.ov_mk_arg(c[12],im11);;
//line 368
im0=null;
//line 368
im1=null;
//line 368
im2=null;
//line 368
im4=null;
//line 368
bool10=null;
//line 368
im11=null;
//line 368
bool24=null;
//line 368
im26=null;
//line 368
return im27;
//line 369
label = 80; continue;
//line 369
case 80:
//line 369
bool24=null;
//line 369
im26=null;
//line 369
im27=null;
}}}

n.dfile.__dyn_try_sload_with_type=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile.try_sload_with_type(arg0, arg1)
return ret;
}

function _prv__singleton_prv_fun_state_out() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 373
im2=n.ptd.string();
//line 373
im4=n.ptd.bool();
//line 373
im3=n.ptd.hash(im4);
//line 373
im4=null;
//line 373
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 373
im2=null;
//line 373
im3=null;
//line 373
im0=n.ptd.rec(im1);
//line 373
im1=null;
//line 373
return im0;
//line 373
im0=null;
//line 373
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_state_out;
n.dfile.state_out=function() {
if (_singleton_val__prv__singleton_prv_fun_state_out===undefined) {
_singleton_val__prv__singleton_prv_fun_state_out=_prv__singleton_prv_fun_state_out();
}
return _singleton_val__prv__singleton_prv_fun_state_out;
}

n.dfile.__dyn_state_out=function(arr) {
var ret = n.dfile.state_out()
return ret;
}

function _prv_sp(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var string3=null;
var label=null;
while (1) { switch (label) {
default:
//line 377
im2=c[1];
//line 377
im2=n.c_rt_lib.get_ref_hash(im0,im2);
//line 377
im2=n.c_rt_lib.concat(im2,im1);;
//line 377
string3=c[1];
//line 377
var call_2_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_2_1,string3,im2);im0=call_2_1.value;call_2_1=null;
//line 377
im2=null;
//line 377
string3=null;
//line 377
im1=null;
//line 377
___arg__0.value = im0;return null;
}}}

function _prv_sprintstr(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var label=null;
while (1) { switch (label) {
default:
//line 381
im2=c[0];
//line 381
im1=n.c_rt_lib.concat(im1,im2);;
//line 381
im2=null;
//line 382
im3=c[19];
//line 382
im4=c[58];
//line 382
im1=n.string.replace(im1,im3,im4);
//line 382
im3=null;
//line 382
im4=null;
//line 383
im5=c[8];
//line 383
im6=c[59];
//line 383
im1=n.string.replace(im1,im5,im6);
//line 383
im5=null;
//line 383
im6=null;
//line 384
im9=c[8];
//line 384
im8=n.c_rt_lib.concat(im9,im1);;
//line 384
im9=null;
//line 384
im10=c[8];
//line 384
im7=n.c_rt_lib.concat(im8,im10);;
//line 384
im8=null;
//line 384
im10=null;
//line 384
var call_5_1=new n.imm_ref(im0);_prv_sp(call_5_1,im7);im0=call_5_1.value;call_5_1=null;
//line 384
im7=null;
//line 384
im1=null;
//line 384
___arg__0.value = im0;return null;
}}}

function _prv_is_simple_string(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var int3=null;
var bool4=null;
var bool5=null;
var im6=null;
var int7=null;
var im8=null;
var int9=null;
var im10=null;
var im11=null;
var int12=null;
var im13=null;
var int14=null;
var im15=null;
var im16=null;
var bool17=null;
var int18=null;
var int19=null;
var bool20=null;
var im21=null;
var im22=null;
var int23=null;
var im24=null;
var bool25=null;
var im26=null;
var bool27=null;
var bool28=null;
var label=null;
while (1) { switch (label) {
default:
//line 388
int1=n.string.length(im0);
//line 389
int3=0;
//line 389
bool2=int1==int3;
//line 389
int3=null;
//line 389
bool2=!bool2
//line 389
if (bool2) {label = 12; continue;}
//line 389
bool4=false;
//line 389
im0=null;
//line 389
int1=null;
//line 389
bool2=null;
//line 389
return bool4;
//line 389
label = 12; continue;
//line 389
case 12:
//line 389
bool2=null;
//line 389
bool4=null;
//line 390
int7=0;
//line 390
im8=n.imm_int(int7)
//line 390
int9=1;
//line 390
im10=n.imm_int(int9)
//line 390
im6=n.string.substr(im0,im8,im10);
//line 390
int7=null;
//line 390
im8=null;
//line 390
int9=null;
//line 390
im10=null;
//line 390
bool5=n.string.is_letter(im6);
//line 390
im6=null;
//line 390
if (bool5) {label = 40; continue;}
//line 390
int12=0;
//line 390
im13=n.imm_int(int12)
//line 390
int14=1;
//line 390
im15=n.imm_int(int14)
//line 390
im11=n.string.substr(im0,im13,im15);
//line 390
int12=null;
//line 390
im13=null;
//line 390
int14=null;
//line 390
im15=null;
//line 390
im16=c[7];
//line 390
bool5=n.c_rt_lib.eq(im11, im16)
//line 390
im11=null;
//line 390
im16=null;
//line 390
case 40:
//line 390
bool5=!bool5
//line 390
bool5=!bool5
//line 390
if (bool5) {label = 50; continue;}
//line 390
bool17=false;
//line 390
im0=null;
//line 390
int1=null;
//line 390
bool5=null;
//line 390
return bool17;
//line 390
label = 50; continue;
//line 390
case 50:
//line 390
bool5=null;
//line 390
bool17=null;
//line 391
int18=0;
//line 391
int19=1;
//line 391
case 55:
//line 391
bool20=int18>=int1;
//line 391
if (bool20) {label = 93; continue;}
//line 392
im22=n.imm_int(int18)
//line 392
int23=1;
//line 392
im24=n.imm_int(int23)
//line 392
im21=n.string.substr(im0,im22,im24);
//line 392
im22=null;
//line 392
int23=null;
//line 392
im24=null;
//line 393
bool25=n.string.is_letter(im21);
//line 393
if (bool25) {label = 68; continue;}
//line 393
bool25=n.string.is_digit(im21);
//line 393
case 68:
//line 393
if (bool25) {label = 73; continue;}
//line 393
im26=c[7];
//line 393
bool25=n.c_rt_lib.eq(im21, im26)
//line 393
im26=null;
//line 393
case 73:
//line 393
bool25=!bool25
//line 393
bool25=!bool25
//line 393
if (bool25) {label = 87; continue;}
//line 393
bool27=false;
//line 393
im0=null;
//line 393
int1=null;
//line 393
int18=null;
//line 393
int19=null;
//line 393
bool20=null;
//line 393
im21=null;
//line 393
bool25=null;
//line 393
return bool27;
//line 393
label = 87; continue;
//line 393
case 87:
//line 393
bool25=null;
//line 393
bool27=null;
//line 393
im21=null;
//line 394
int18=Math.floor(int18+int19);
//line 394
label = 55; continue;
//line 394
case 93:
//line 395
bool28=true;
//line 395
im0=null;
//line 395
int1=null;
//line 395
int18=null;
//line 395
int19=null;
//line 395
bool20=null;
//line 395
im21=null;
//line 395
return bool28;
}}}

function _prv_sprint_hash_key(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 399
bool2=_prv_is_simple_string(im1);
//line 399
bool2=!bool2
//line 399
if (bool2) {label = 5; continue;}
//line 400
var call_1_1=new n.imm_ref(im0);_prv_sp(call_1_1,im1);im0=call_1_1.value;call_1_1=null;
//line 401
label = 8; continue;
//line 401
case 5:
//line 402
var call_2_1=new n.imm_ref(im0);_prv_sprintstr(call_2_1,im1);im0=call_2_1.value;call_2_1=null;
//line 403
label = 8; continue;
//line 403
case 8:
//line 403
bool2=null;
//line 403
im1=null;
//line 403
___arg__0.value = im0;return null;
}}}

function _prv_get_ind(___arg__0) {
var int0=___arg__0;
n.check_null(int0);
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 407
im2=n.string.tab();
//line 407
im3=n.imm_int(int0)
//line 407
im1=n.string.char_times(im2,im3);
//line 407
im2=null;
//line 407
im3=null;
//line 407
int0=null;
//line 407
return im1;
}}}

function _prv_sprint_hash(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=___arg__2;
n.check_null(int2);
var bool3=___arg__3;
n.check_null(bool3);
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var int9=null;
var int10=null;
var int11=null;
var bool12=null;
var im13=null;
var im14=null;
var im15=null;
var int16=null;
var int17=null;
var im18=null;
var int19=null;
var int20=null;
var im21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var label=null;
while (1) { switch (label) {
default:
//line 412
im5=c[29];
//line 412
im6=n.string.lf();
//line 412
im4=n.c_rt_lib.concat(im5,im6);;
//line 412
im5=null;
//line 412
im6=null;
//line 412
var call_2_1=new n.imm_ref(im0);_prv_sp(call_2_1,im4);im0=call_2_1.value;call_2_1=null;
//line 412
im4=null;
//line 413
im7=n.hash.keys(im1);
//line 414
var call_4_1=new n.imm_ref(im7);n.array.sort(call_4_1);im7=call_4_1.value;call_4_1=null;
//line 415
int9=0;
//line 415
int10=1;
//line 415
int11=n.c_rt_lib.array_len(im7);;
//line 415
case 12:
//line 415
bool12=int9>=int11;
//line 415
if (bool12) {label = 44; continue;}
//line 415
im13=im7.get_index(int9);
//line 415
im8=im13
//line 416
im14=n.hash.get_value(im1,im8);
//line 417
int17=1;
//line 417
int16=Math.floor(int2+int17);
//line 417
int17=null;
//line 417
im15=_prv_get_ind(int16);
//line 417
int16=null;
//line 417
var call_8_1=new n.imm_ref(im0);_prv_sp(call_8_1,im15);im0=call_8_1.value;call_8_1=null;
//line 417
im15=null;
//line 418
var call_9_1=new n.imm_ref(im0);_prv_sprint_hash_key(call_9_1,im8);im0=call_9_1.value;call_9_1=null;
//line 419
im18=c[60];
//line 419
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im18);im0=call_10_1.value;call_10_1=null;
//line 419
im18=null;
//line 420
int20=1;
//line 420
int19=Math.floor(int2+int20);
//line 420
int20=null;
//line 420
var call_11_1=new n.imm_ref(im0);_prv_sprint(call_11_1,im14,int19,bool3);im0=call_11_1.value;call_11_1=null;
//line 420
int19=null;
//line 421
im22=c[39];
//line 421
im23=n.string.lf();
//line 421
im21=n.c_rt_lib.concat(im22,im23);;
//line 421
im22=null;
//line 421
im23=null;
//line 421
var call_14_1=new n.imm_ref(im0);_prv_sp(call_14_1,im21);im0=call_14_1.value;call_14_1=null;
//line 421
im21=null;
//line 421
im8=null;
//line 422
int9=Math.floor(int9+int10);
//line 422
label = 12; continue;
//line 422
case 44:
//line 423
im25=_prv_get_ind(int2);
//line 423
im26=c[30];
//line 423
im24=n.c_rt_lib.concat(im25,im26);;
//line 423
im25=null;
//line 423
im26=null;
//line 423
var call_17_1=new n.imm_ref(im0);_prv_sp(call_17_1,im24);im0=call_17_1.value;call_17_1=null;
//line 423
im24=null;
//line 423
im1=null;
//line 423
int2=null;
//line 423
bool3=null;
//line 423
im7=null;
//line 423
im8=null;
//line 423
int9=null;
//line 423
int10=null;
//line 423
int11=null;
//line 423
bool12=null;
//line 423
im13=null;
//line 423
im14=null;
//line 423
___arg__0.value = im0;return null;
}}}

function _prv_handle_debug(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var bool7=null;
var im8=null;
var string9=null;
var bool10=null;
var label=null;
while (1) { switch (label) {
default:
//line 427
bool2=n.nl.is_hash(im1);
//line 427
if (bool2) {label = 3; continue;}
//line 427
bool2=n.nl.is_array(im1);
//line 427
case 3:
//line 427
bool3=!bool2
//line 427
if (bool3) {label = 9; continue;}
//line 427
im4=n.c_rt_lib.hash_get_value(im0,c[61]);;
//line 427
bool2=n.hash.has_key(im4,im1);
//line 427
im4=null;
//line 427
case 9:
//line 427
bool3=null;
//line 427
bool2=!bool2
//line 427
if (bool2) {label = 19; continue;}
//line 428
var call_4_1=new n.imm_ref(im0);_prv_sp(call_4_1,im1);im0=call_4_1.value;call_4_1=null;
//line 429
bool5=true;
//line 429
im1=null;
//line 429
bool2=null;
//line 429
___arg__0.value = im0;return bool5;
//line 430
label = 37; continue;
//line 430
case 19:
//line 431
im6=c[61];
//line 431
im6=n.c_rt_lib.get_ref_hash(im0,im6);
//line 431
bool7=true;
//line 431
im8=n.c_rt_lib.native_to_nl(bool7)
//line 431
var call_6_1=new n.imm_ref(im6);n.hash.set_value(call_6_1,im1,im8);im6=call_6_1.value;call_6_1=null;
//line 431
string9=c[61];
//line 431
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string9,im6);im0=call_7_1.value;call_7_1=null;
//line 431
im6=null;
//line 431
bool7=null;
//line 431
im8=null;
//line 431
string9=null;
//line 432
bool10=false;
//line 432
im1=null;
//line 432
bool2=null;
//line 432
bool5=null;
//line 432
___arg__0.value = im0;return bool10;
//line 433
label = 37; continue;
//line 433
case 37:
//line 433
bool2=null;
//line 433
bool5=null;
//line 433
bool10=null;
}}}

function _prv_sprint(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=___arg__2;
n.check_null(int2);
var bool3=___arg__3;
n.check_null(bool3);
var bool4=null;
var bool5=null;
var bool6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var int11=null;
var int12=null;
var int13=null;
var bool14=null;
var im15=null;
var im16=null;
var int17=null;
var int18=null;
var int19=null;
var int20=null;
var im21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var bool29=null;
var im30=null;
var im31=null;
var im32=null;
var im33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 438
bool4=bool3
//line 438
bool5=!bool4
//line 438
if (bool5) {label = 4; continue;}
//line 438
var call_0_1=new n.imm_ref(im0);bool4=_prv_handle_debug(call_0_1,im1);im0=call_0_1.value;call_0_1=null;
//line 438
case 4:
//line 438
bool5=null;
//line 438
bool4=!bool4
//line 438
if (bool4) {label = 14; continue;}
//line 438
im1=null;
//line 438
int2=null;
//line 438
bool3=null;
//line 438
bool4=null;
//line 438
___arg__0.value = im0;return null;
//line 438
label = 14; continue;
//line 438
case 14:
//line 438
bool4=null;
//line 439
bool6=n.nl.is_int(im1);
//line 439
if (bool6) {label = 19; continue;}
//line 439
bool6=n.nl.is_string(im1);
//line 439
case 19:
//line 439
bool6=!bool6
//line 439
if (bool6) {label = 24; continue;}
//line 440
var call_3_1=new n.imm_ref(im0);_prv_sprintstr(call_3_1,im1);im0=call_3_1.value;call_3_1=null;
//line 441
label = 112; continue;
//line 441
case 24:
//line 441
bool6=n.nl.is_array(im1);
//line 441
bool6=!bool6
//line 441
if (bool6) {label = 74; continue;}
//line 442
im8=c[41];
//line 442
im9=n.string.lf();
//line 442
im7=n.c_rt_lib.concat(im8,im9);;
//line 442
im8=null;
//line 442
im9=null;
//line 442
var call_7_1=new n.imm_ref(im0);_prv_sp(call_7_1,im7);im0=call_7_1.value;call_7_1=null;
//line 442
im7=null;
//line 443
int11=0;
//line 443
int12=1;
//line 443
int13=n.c_rt_lib.array_len(im1);;
//line 443
case 38:
//line 443
bool14=int11>=int13;
//line 443
if (bool14) {label = 65; continue;}
//line 443
im15=im1.get_index(int11);
//line 443
im10=im15
//line 444
int18=1;
//line 444
int17=Math.floor(int2+int18);
//line 444
int18=null;
//line 444
im16=_prv_get_ind(int17);
//line 444
int17=null;
//line 444
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im16);im0=call_10_1.value;call_10_1=null;
//line 444
im16=null;
//line 445
int20=1;
//line 445
int19=Math.floor(int2+int20);
//line 445
int20=null;
//line 445
var call_11_1=new n.imm_ref(im0);_prv_sprint(call_11_1,im10,int19,bool3);im0=call_11_1.value;call_11_1=null;
//line 445
int19=null;
//line 446
im22=c[39];
//line 446
im23=n.string.lf();
//line 446
im21=n.c_rt_lib.concat(im22,im23);;
//line 446
im22=null;
//line 446
im23=null;
//line 446
var call_14_1=new n.imm_ref(im0);_prv_sp(call_14_1,im21);im0=call_14_1.value;call_14_1=null;
//line 446
im21=null;
//line 446
im10=null;
//line 447
int11=Math.floor(int11+int12);
//line 447
label = 38; continue;
//line 447
case 65:
//line 448
im25=_prv_get_ind(int2);
//line 448
im26=c[42];
//line 448
im24=n.c_rt_lib.concat(im25,im26);;
//line 448
im25=null;
//line 448
im26=null;
//line 448
var call_17_1=new n.imm_ref(im0);_prv_sp(call_17_1,im24);im0=call_17_1.value;call_17_1=null;
//line 448
im24=null;
//line 449
label = 112; continue;
//line 449
case 74:
//line 449
bool6=n.nl.is_hash(im1);
//line 449
bool6=!bool6
//line 449
if (bool6) {label = 80; continue;}
//line 450
var call_19_1=new n.imm_ref(im0);_prv_sprint_hash(call_19_1,im1,int2,bool3);im0=call_19_1.value;call_19_1=null;
//line 451
label = 112; continue;
//line 451
case 80:
//line 451
bool6=n.nl.is_variant(im1);
//line 451
bool6=!bool6
//line 451
if (bool6) {label = 108; continue;}
//line 452
im27=c[4];
//line 452
var call_21_1=new n.imm_ref(im0);_prv_sp(call_21_1,im27);im0=call_21_1.value;call_21_1=null;
//line 452
im27=null;
//line 453
im28=n.ov.get_element(im1);
//line 453
var call_23_1=new n.imm_ref(im0);_prv_sprintstr(call_23_1,im28);im0=call_23_1.value;call_23_1=null;
//line 453
im28=null;
//line 454
im30=n.ov.has_value(im1);
//line 454
bool29=n.c_rt_lib.check_true_native(im30);;
//line 454
im30=null;
//line 454
bool29=!bool29
//line 454
if (bool29) {label = 102; continue;}
//line 455
im31=c[62];
//line 455
var call_26_1=new n.imm_ref(im0);_prv_sp(call_26_1,im31);im0=call_26_1.value;call_26_1=null;
//line 455
im31=null;
//line 456
im32=n.ov.get_value(im1);
//line 456
var call_28_1=new n.imm_ref(im0);_prv_sprint(call_28_1,im32,int2,bool3);im0=call_28_1.value;call_28_1=null;
//line 456
im32=null;
//line 457
label = 102; continue;
//line 457
case 102:
//line 457
bool29=null;
//line 458
im33=c[54];
//line 458
var call_29_1=new n.imm_ref(im0);_prv_sp(call_29_1,im33);im0=call_29_1.value;call_29_1=null;
//line 458
im33=null;
//line 459
label = 112; continue;
//line 459
case 108:
//line 460
im34=n.imm_arr([]);
//line 460
n.nl_die();
//line 461
label = 112; continue;
//line 461
case 112:
//line 461
bool6=null;
//line 461
im10=null;
//line 461
int11=null;
//line 461
int12=null;
//line 461
int13=null;
//line 461
bool14=null;
//line 461
im15=null;
//line 461
im34=null;
//line 461
im1=null;
//line 461
int2=null;
//line 461
bool3=null;
//line 461
___arg__0.value = im0;return null;
}}}

function _prv_print_net_formatstr(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
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
var label=null;
while (1) { switch (label) {
default:
//line 465
im2=c[0];
//line 465
im1=n.c_rt_lib.concat(im1,im2);;
//line 465
im2=null;
//line 466
im3=c[19];
//line 466
im4=c[58];
//line 466
im1=n.string.replace(im1,im3,im4);
//line 466
im3=null;
//line 466
im4=null;
//line 467
im5=n.string.lf();
//line 467
im6=c[63];
//line 467
im1=n.string.replace(im1,im5,im6);
//line 467
im5=null;
//line 467
im6=null;
//line 468
im7=n.string.r();
//line 468
im8=c[64];
//line 468
im1=n.string.replace(im1,im7,im8);
//line 468
im7=null;
//line 468
im8=null;
//line 469
im9=c[8];
//line 469
im10=c[59];
//line 469
im1=n.string.replace(im1,im9,im10);
//line 469
im9=null;
//line 469
im10=null;
//line 470
im1=n.string_utils.escape2hex31(im1);
//line 471
im13=c[8];
//line 471
im12=n.c_rt_lib.concat(im13,im1);;
//line 471
im13=null;
//line 471
im14=c[8];
//line 471
im11=n.c_rt_lib.concat(im12,im14);;
//line 471
im12=null;
//line 471
im14=null;
//line 471
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im11);im0=call_10_1.value;call_10_1=null;
//line 471
im11=null;
//line 471
im1=null;
//line 471
___arg__0.value = im0;return null;
}}}

function _prv_print_net_format(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var int5=null;
var int6=null;
var int7=null;
var bool8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var int15=null;
var int16=null;
var int17=null;
var bool18=null;
var im19=null;
var im20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var bool29=null;
var im30=null;
var im31=null;
var im32=null;
var im33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 475
bool2=n.nl.is_int(im1);
//line 475
if (bool2) {label = 3; continue;}
//line 475
bool2=n.nl.is_string(im1);
//line 475
case 3:
//line 475
bool2=!bool2
//line 475
if (bool2) {label = 8; continue;}
//line 476
var call_2_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_2_1,im1);im0=call_2_1.value;call_2_1=null;
//line 477
label = 113; continue;
//line 477
case 8:
//line 477
bool2=n.nl.is_array(im1);
//line 477
bool2=!bool2
//line 477
if (bool2) {label = 35; continue;}
//line 478
im3=c[41];
//line 478
var call_4_1=new n.imm_ref(im0);_prv_sp(call_4_1,im3);im0=call_4_1.value;call_4_1=null;
//line 478
im3=null;
//line 479
int5=0;
//line 479
int6=1;
//line 479
int7=n.c_rt_lib.array_len(im1);;
//line 479
case 18:
//line 479
bool8=int5>=int7;
//line 479
if (bool8) {label = 30; continue;}
//line 479
im9=im1.get_index(int5);
//line 479
im4=im9
//line 480
var call_6_1=new n.imm_ref(im0);_prv_print_net_format(call_6_1,im4);im0=call_6_1.value;call_6_1=null;
//line 481
im10=c[39];
//line 481
var call_7_1=new n.imm_ref(im0);_prv_sp(call_7_1,im10);im0=call_7_1.value;call_7_1=null;
//line 481
im10=null;
//line 481
im4=null;
//line 482
int5=Math.floor(int5+int6);
//line 482
label = 18; continue;
//line 482
case 30:
//line 483
im11=c[42];
//line 483
var call_8_1=new n.imm_ref(im0);_prv_sp(call_8_1,im11);im0=call_8_1.value;call_8_1=null;
//line 483
im11=null;
//line 484
label = 113; continue;
//line 484
case 35:
//line 484
bool2=n.nl.is_hash(im1);
//line 484
bool2=!bool2
//line 484
if (bool2) {label = 81; continue;}
//line 485
im12=c[29];
//line 485
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im12);im0=call_10_1.value;call_10_1=null;
//line 485
im12=null;
//line 486
im13=n.hash.keys(im1);
//line 486
int15=0;
//line 486
int16=1;
//line 486
int17=n.c_rt_lib.array_len(im13);;
//line 486
case 46:
//line 486
bool18=int15>=int17;
//line 486
if (bool18) {label = 76; continue;}
//line 486
im19=im13.get_index(int15);
//line 486
im14=im19
//line 487
im20=n.hash.get_value(im1,im14);
//line 488
im23=c[0];
//line 488
im22=n.c_rt_lib.concat(im14,im23);;
//line 488
im23=null;
//line 488
bool21=_prv_is_simple_string(im22);
//line 488
im22=null;
//line 488
bool21=!bool21
//line 488
if (bool21) {label = 61; continue;}
//line 489
var call_16_1=new n.imm_ref(im0);_prv_sp(call_16_1,im14);im0=call_16_1.value;call_16_1=null;
//line 490
label = 64; continue;
//line 490
case 61:
//line 491
var call_17_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_17_1,im14);im0=call_17_1.value;call_17_1=null;
//line 492
label = 64; continue;
//line 492
case 64:
//line 492
bool21=null;
//line 493
im24=c[31];
//line 493
var call_18_1=new n.imm_ref(im0);_prv_sp(call_18_1,im24);im0=call_18_1.value;call_18_1=null;
//line 493
im24=null;
//line 494
var call_19_1=new n.imm_ref(im0);_prv_print_net_format(call_19_1,im20);im0=call_19_1.value;call_19_1=null;
//line 495
im25=c[39];
//line 495
var call_20_1=new n.imm_ref(im0);_prv_sp(call_20_1,im25);im0=call_20_1.value;call_20_1=null;
//line 495
im25=null;
//line 495
im14=null;
//line 496
int15=Math.floor(int15+int16);
//line 496
label = 46; continue;
//line 496
case 76:
//line 497
im26=c[30];
//line 497
var call_21_1=new n.imm_ref(im0);_prv_sp(call_21_1,im26);im0=call_21_1.value;call_21_1=null;
//line 497
im26=null;
//line 498
label = 113; continue;
//line 498
case 81:
//line 498
bool2=n.nl.is_variant(im1);
//line 498
bool2=!bool2
//line 498
if (bool2) {label = 109; continue;}
//line 499
im27=c[4];
//line 499
var call_23_1=new n.imm_ref(im0);_prv_sp(call_23_1,im27);im0=call_23_1.value;call_23_1=null;
//line 499
im27=null;
//line 500
im28=n.ov.get_element(im1);
//line 500
var call_25_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_25_1,im28);im0=call_25_1.value;call_25_1=null;
//line 500
im28=null;
//line 501
im30=n.ov.has_value(im1);
//line 501
bool29=n.c_rt_lib.check_true_native(im30);;
//line 501
im30=null;
//line 501
bool29=!bool29
//line 501
if (bool29) {label = 103; continue;}
//line 502
im31=c[39];
//line 502
var call_28_1=new n.imm_ref(im0);_prv_sp(call_28_1,im31);im0=call_28_1.value;call_28_1=null;
//line 502
im31=null;
//line 503
im32=n.ov.get_value(im1);
//line 503
var call_30_1=new n.imm_ref(im0);_prv_print_net_format(call_30_1,im32);im0=call_30_1.value;call_30_1=null;
//line 503
im32=null;
//line 504
label = 103; continue;
//line 504
case 103:
//line 504
bool29=null;
//line 505
im33=c[54];
//line 505
var call_31_1=new n.imm_ref(im0);_prv_sp(call_31_1,im33);im0=call_31_1.value;call_31_1=null;
//line 505
im33=null;
//line 506
label = 113; continue;
//line 506
case 109:
//line 507
im34=n.imm_arr([im1,]);
//line 507
n.nl_die();
//line 508
label = 113; continue;
//line 508
case 113:
//line 508
bool2=null;
//line 508
im4=null;
//line 508
int5=null;
//line 508
int6=null;
//line 508
int7=null;
//line 508
bool8=null;
//line 508
im9=null;
//line 508
im13=null;
//line 508
im14=null;
//line 508
int15=null;
//line 508
int16=null;
//line 508
int17=null;
//line 508
bool18=null;
//line 508
im19=null;
//line 508
im20=null;
//line 508
im34=null;
//line 508
im1=null;
//line 508
___arg__0.value = im0;return null;
}}}
var c=[];
c[0] = n.imm_str("");c[1] = n.imm_str("str");c[2] = n.imm_str("pos");c[3] = n.imm_str("len");c[4] = n.imm_str("ov::mk(");c[5] = n.imm_str("pos ");c[6] = n.imm_str(": expected scalar");c[7] = n.imm_str("_");c[8] = n.imm_str("\"");c[9] = n.imm_str("ptd_string");c[10] = n.imm_str("ptd_im");c[11] = n.imm_str("ptd_int");c[12] = n.imm_str("ok");c[13] = n.imm_str("err");c[14] = n.imm_str("NOMATCHALERT");c[15] = n.imm_str("incorrect number");c[16] = n.imm_str("expected ");c[17] = n.imm_str(", got scalar");c[18] = n.imm_str(": expected \"");c[19] = n.imm_str("\\");c[20] = n.imm_str(": expected escape sequence");c[21] = n.imm_str("n");c[22] = n.imm_str("r");c[23] = n.imm_str("t");c[24] = n.imm_str("@");c[25] = n.imm_str("$");c[26] = n.imm_str("x");c[27] = n.imm_str(": expected hexadecimal digit");c[28] = n.imm_str("ref");c[29] = n.imm_str("{");c[30] = n.imm_str("}");c[31] = n.imm_str("=>");c[32] = n.imm_str(": expected =>");c[33] = n.imm_str("ptd_rec");c[34] = n.imm_str("unexpected hash key ");c[35] = n.imm_str("ptd_hash");c[36] = n.imm_ov_js_str("ptd_im",null);c[37] = n.imm_str(", got ");c[38] = n.imm_ov_js_str("ptd_hash",null);c[39] = n.imm_str(",");c[40] = n.imm_str(": expected ,");c[41] = n.imm_str("[");c[42] = n.imm_str("]");c[43] = n.imm_str("ptd_arr");c[44] = n.imm_ov_js_str("ptd_im",null);c[45] = n.imm_ov_js_str("ptd_hash",null);c[46] = n.imm_str("o");c[47] = n.imm_str("ptd_var");c[48] = n.imm_str("with_param");c[49] = n.imm_str("no_param");c[50] = n.imm_str("unexpected variant value");c[51] = n.imm_str("unexpected variant label ");c[52] = n.imm_ov_js_str("ptd_im",null);c[53] = n.imm_ov_js_str("ptd_hash",null);c[54] = n.imm_str(")");c[55] = n.imm_str(": expected )");c[56] = n.imm_str("ensure");c[57] = n.imm_str(": expected eof");c[58] = n.imm_str("\\\\");c[59] = n.imm_str("\\\"");c[60] = n.imm_str(" => ");c[61] = n.imm_str("objects");c[62] = n.imm_str(", ");c[63] = n.imm_str("\\n");c[64] = n.imm_str("\\r");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.dfile_dbg={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.dfile_dbg.deep_eq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 16
im3=n.dfile_dbg.ssave(im0);
//line 16
im4=n.dfile_dbg.ssave(im1);
//line 16
bool2=n.c_rt_lib.eq(im3, im4)
//line 16
im3=null;
//line 16
im4=null;
//line 16
im5=n.c_rt_lib.native_to_nl(bool2)
//line 16
im0=null;
//line 16
im1=null;
//line 16
bool2=null;
//line 16
return im5;
//line 16
im0=null;
//line 16
im1=null;
//line 16
bool2=null;
//line 16
im5=null;
//line 16
return null;
}}}

n.dfile_dbg.__dyn_deep_eq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile_dbg.deep_eq(arg0, arg1)
return ret;
}

n.dfile_dbg.rs=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var bool5=null;
var bool6=null;
var int7=null;
var int8=null;
var im9=null;
var label=null;
while (1) { switch (label) {
default:
//line 20
im3=c[0];
//line 20
im4=n.imm_hash({});
//line 20
im2=n.imm_hash({"str":im3,"objects":im4,});
//line 20
im3=null;
//line 20
im4=null;
//line 21
int7=0;
//line 21
int8=im1.as_int();
//line 21
bool5=int8!=int7;
//line 21
int7=null;
//line 21
int8=null;
//line 21
bool6=!bool5
//line 21
if (bool6) {label = 13; continue;}
//line 21
bool5=_prv_is_simple_string(im0);
//line 21
case 13:
//line 21
bool6=null;
//line 21
bool5=!bool5
//line 21
if (bool5) {label = 19; continue;}
//line 22
var call_1_1=new n.imm_ref(im2);_prv_sp(call_1_1,im0);im2=call_1_1.value;call_1_1=null;
//line 23
label = 22; continue;
//line 23
case 19:
//line 24
var call_2_1=new n.imm_ref(im2);_prv_sprintstr(call_2_1,im0);im2=call_2_1.value;call_2_1=null;
//line 25
label = 22; continue;
//line 25
case 22:
//line 25
bool5=null;
//line 26
im9=n.c_rt_lib.hash_get_value(im2,c[1]);;
//line 26
im0=null;
//line 26
im1=null;
//line 26
im2=null;
//line 26
return im9;
//line 26
im0=null;
//line 26
im1=null;
//line 26
im2=null;
//line 26
im9=null;
//line 26
return null;
}}}

n.dfile_dbg.__dyn_rs=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile_dbg.rs(arg0, arg1)
return ret;
}

n.dfile_dbg.ssave=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var int4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 30
im2=c[0];
//line 30
im3=n.imm_hash({});
//line 30
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 30
im2=null;
//line 30
im3=null;
//line 31
int4=0;
//line 31
bool5=false;
//line 31
var call_0_1=new n.imm_ref(im1);_prv_sprint(call_0_1,im0,int4,bool5);im1=call_0_1.value;call_0_1=null;
//line 31
int4=null;
//line 31
bool5=null;
//line 32
im6=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 32
im0=null;
//line 32
im1=null;
//line 32
return im6;
}}}

n.dfile_dbg.__dyn_ssave=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile_dbg.ssave(arg0)
return ret;
}

n.dfile_dbg.debug=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var int4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 36
im2=c[0];
//line 36
im3=n.imm_hash({});
//line 36
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 36
im2=null;
//line 36
im3=null;
//line 37
int4=0;
//line 37
bool5=true;
//line 37
var call_0_1=new n.imm_ref(im1);_prv_sprint(call_0_1,im0,int4,bool5);im1=call_0_1.value;call_0_1=null;
//line 37
int4=null;
//line 37
bool5=null;
//line 38
im6=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 38
im0=null;
//line 38
im1=null;
//line 38
return im6;
}}}

n.dfile_dbg.__dyn_debug=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile_dbg.debug(arg0)
return ret;
}

n.dfile_dbg.ssave_net_format=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 42
im2=c[0];
//line 42
im3=n.imm_hash({});
//line 42
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 42
im2=null;
//line 42
im3=null;
//line 43
var call_0_1=new n.imm_ref(im1);_prv_print_net_format(call_0_1,im0);im1=call_0_1.value;call_0_1=null;
//line 44
im4=n.c_rt_lib.hash_get_value(im1,c[1]);;
//line 44
im0=null;
//line 44
im1=null;
//line 44
return im4;
}}}

n.dfile_dbg.__dyn_ssave_net_format=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile_dbg.ssave_net_format(arg0)
return ret;
}

function _prv_eat_ws(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=null;
var int2=null;
var im3=null;
var int4=null;
var im5=null;
var int6=null;
var im7=null;
var bool8=null;
var int9=null;
var int10=null;
var int11=null;
var int12=null;
var im13=null;
var int14=null;
var int15=null;
var int16=null;
var string17=null;
var label=null;
while (1) { switch (label) {
default:
//line 48
case 0:
//line 49
im3=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 49
int2=im3.as_int();
//line 49
im3=null;
//line 49
im5=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 49
int4=im5.as_int();
//line 49
im5=null;
//line 49
bool1=int2==int4;
//line 49
int2=null;
//line 49
int4=null;
//line 49
bool1=!bool1
//line 49
if (bool1) {label = 15; continue;}
//line 49
bool1=null;
//line 49
___arg__0.value = im0;return null;
//line 49
label = 15; continue;
//line 49
case 15:
//line 49
bool1=null;
//line 50
var call_2_1=new n.imm_ref(im0);im7=_prv_get_char(call_2_1);im0=call_2_1.value;call_2_1=null;
//line 50
int6=n.string.ord(im7);
//line 50
im7=null;
//line 51
int9=9;
//line 51
bool8=int6==int9;
//line 51
int9=null;
//line 51
if (bool8) {label = 27; continue;}
//line 51
int10=10;
//line 51
bool8=int6==int10;
//line 51
int10=null;
//line 51
case 27:
//line 51
if (bool8) {label = 32; continue;}
//line 51
int11=13;
//line 51
bool8=int6==int11;
//line 51
int11=null;
//line 51
case 32:
//line 51
if (bool8) {label = 37; continue;}
//line 51
int12=32;
//line 51
bool8=int6==int12;
//line 51
int12=null;
//line 51
case 37:
//line 51
bool8=!bool8
//line 51
if (bool8) {label = 54; continue;}
//line 52
im13=c[2];
//line 52
im13=n.c_rt_lib.get_ref_hash(im0,im13);
//line 52
int14=1;
//line 52
int15=im13.as_int();
//line 52
int16=Math.floor(int15+int14);
//line 52
im13=n.imm_int(int16)
//line 52
string17=c[2];
//line 52
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string17,im13);im0=call_5_1.value;call_5_1=null;
//line 52
im13=null;
//line 52
int14=null;
//line 52
int15=null;
//line 52
int16=null;
//line 52
string17=null;
//line 53
label = 59; continue;
//line 53
case 54:
//line 54
int6=null;
//line 54
bool8=null;
//line 54
___arg__0.value = im0;return null;
//line 55
label = 59; continue;
//line 55
case 59:
//line 55
bool8=null;
//line 55
int6=null;
//line 48
label = 0; continue;
//line 48
int6=null;
//line 48
___arg__0.value = im0;return null;
}}}

function _prv_get_char(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=null;
var im2=null;
var int3=null;
var im4=null;
var int5=null;
var label=null;
while (1) { switch (label) {
default:
//line 60
im2=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 60
im4=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 60
int3=im4.as_int();
//line 60
im4=null;
//line 60
int5=1;
//line 60
im1=n.c_std_lib.fast_substr(im2,int3,int5);
//line 60
im2=null;
//line 60
int3=null;
//line 60
int5=null;
//line 60
___arg__0.value = im0;return im1;
}}}

function _prv_is_ov(___arg__0) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var int4=null;
var im5=null;
var int6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 64
im3=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 64
im5=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 64
int4=im5.as_int();
//line 64
im5=null;
//line 64
int6=7;
//line 64
im2=n.c_std_lib.fast_substr(im3,int4,int6);
//line 64
im3=null;
//line 64
int4=null;
//line 64
int6=null;
//line 64
im7=c[4];
//line 64
bool1=n.c_rt_lib.eq(im2, im7)
//line 64
im2=null;
//line 64
im7=null;
//line 64
___arg__0.value = im0;return bool1;
}}}

function _prv_eat_non_ws(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=null;
var int3=null;
var im4=null;
var bool5=null;
var int6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var string13=null;
var im14=null;
var im15=null;
var bool16=null;
var im17=null;
var im18=null;
var int19=null;
var int20=null;
var int21=null;
var string22=null;
var bool23=null;
var int24=null;
var im25=null;
var bool26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var int31=null;
var im32=null;
var string33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 68
im2=c[0];
//line 69
im4=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 69
int3=im4.as_int();
//line 69
im4=null;
//line 70
im7=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 70
int6=im7.as_int();
//line 70
im7=null;
//line 70
bool5=int6>=int3;
//line 70
int6=null;
//line 70
bool5=!bool5
//line 70
if (bool5) {label = 30; continue;}
//line 71
bool1=true;
//line 72
im10=c[5];
//line 72
im12=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 72
int11=im12.as_int();
//line 72
im12=null;
//line 72
string13=n.imm_int(int11)
//line 72
im9=n.c_rt_lib.concat(im10,string13);;
//line 72
im10=null;
//line 72
int11=null;
//line 72
string13=null;
//line 72
im14=c[6];
//line 72
im8=n.c_rt_lib.concat(im9,im14);;
//line 72
im9=null;
//line 72
im14=null;
//line 72
im2=null;
//line 72
int3=null;
//line 72
bool5=null;
//line 72
___arg__0.value = im0;___arg__1.value = bool1;return im8;
//line 73
label = 30; continue;
//line 73
case 30:
//line 73
bool5=null;
//line 73
im8=null;
//line 74
case 33:
//line 75
var call_5_1=new n.imm_ref(im0);im15=_prv_get_char(call_5_1);im0=call_5_1.value;call_5_1=null;
//line 76
bool16=n.string.is_letter(im15);
//line 76
if (bool16) {label = 38; continue;}
//line 76
bool16=n.string.is_digit(im15);
//line 76
case 38:
//line 76
if (bool16) {label = 43; continue;}
//line 76
im17=c[7];
//line 76
bool16=n.c_rt_lib.eq(im15, im17)
//line 76
im17=null;
//line 76
case 43:
//line 76
bool16=!bool16
//line 76
bool16=!bool16
//line 76
if (bool16) {label = 51; continue;}
//line 76
im15=null;
//line 76
bool16=null;
//line 76
label = 82; continue;
//line 76
label = 51; continue;
//line 76
case 51:
//line 76
bool16=null;
//line 77
im18=c[2];
//line 77
im18=n.c_rt_lib.get_ref_hash(im0,im18);
//line 77
int19=1;
//line 77
int20=im18.as_int();
//line 77
int21=Math.floor(int20+int19);
//line 77
im18=n.imm_int(int21)
//line 77
string22=c[2];
//line 77
var call_9_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_9_1,string22,im18);im0=call_9_1.value;call_9_1=null;
//line 77
im18=null;
//line 77
int19=null;
//line 77
int20=null;
//line 77
int21=null;
//line 77
string22=null;
//line 78
im2=n.c_rt_lib.concat(im2,im15);;
//line 79
im25=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 79
int24=im25.as_int();
//line 79
im25=null;
//line 79
bool23=int24>=int3;
//line 79
int24=null;
//line 79
bool23=!bool23
//line 79
if (bool23) {label = 78; continue;}
//line 79
im15=null;
//line 79
bool23=null;
//line 79
label = 82; continue;
//line 79
label = 78; continue;
//line 79
case 78:
//line 79
bool23=null;
//line 79
im15=null;
//line 74
label = 33; continue;
//line 74
case 82:
//line 81
im27=c[0];
//line 81
bool26=n.c_rt_lib.eq(im2, im27)
//line 81
im27=null;
//line 81
bool26=!bool26
//line 81
if (bool26) {label = 108; continue;}
//line 82
bool1=true;
//line 83
im30=c[5];
//line 83
im32=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 83
int31=im32.as_int();
//line 83
im32=null;
//line 83
string33=n.imm_int(int31)
//line 83
im29=n.c_rt_lib.concat(im30,string33);;
//line 83
im30=null;
//line 83
int31=null;
//line 83
string33=null;
//line 83
im34=c[6];
//line 83
im28=n.c_rt_lib.concat(im29,im34);;
//line 83
im29=null;
//line 83
im34=null;
//line 83
im2=null;
//line 83
int3=null;
//line 83
im15=null;
//line 83
bool26=null;
//line 83
___arg__0.value = im0;___arg__1.value = bool1;return im28;
//line 84
label = 108; continue;
//line 84
case 108:
//line 84
bool26=null;
//line 84
im28=null;
//line 85
int3=null;
//line 85
im15=null;
//line 85
___arg__0.value = im0;___arg__1.value = bool1;return im2;
}}}

function _prv_parse_scalar(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var int8=null;
var int9=null;
var int10=null;
var string11=null;
var bool12=null;
var int13=null;
var im14=null;
var int15=null;
var im16=null;
var im17=null;
var im18=null;
var im19=null;
var int20=null;
var im21=null;
var string22=null;
var im23=null;
var im24=null;
var im25=null;
var int26=null;
var int27=null;
var int28=null;
var string29=null;
var bool30=null;
var im31=null;
var bool32=null;
var im33=null;
var im34=null;
var bool35=null;
var im36=null;
var im37=null;
var im38=null;
var im39=null;
var im40=null;
var im41=null;
var im42=null;
var int43=null;
var int44=null;
var int45=null;
var string46=null;
var bool47=null;
var im48=null;
var bool49=null;
var im50=null;
var int51=null;
var im52=null;
var im53=null;
var im54=null;
var im55=null;
var im56=null;
var im57=null;
var im58=null;
var im59=null;
var im60=null;
var im61=null;
var label=null;
while (1) { switch (label) {
default:
//line 89
var call_0_1=new n.imm_ref(im0);_prv_eat_ws(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 90
im3=c[0];
//line 91
var call_1_1=new n.imm_ref(im0);im5=_prv_get_char(call_1_1);im0=call_1_1.value;call_1_1=null;
//line 91
im6=c[8];
//line 91
bool4=n.c_rt_lib.eq(im5, im6)
//line 91
im5=null;
//line 91
im6=null;
//line 91
bool4=!bool4
//line 91
if (bool4) {label = 146; continue;}
//line 92
im7=c[2];
//line 92
im7=n.c_rt_lib.get_ref_hash(im0,im7);
//line 92
int8=1;
//line 92
int9=im7.as_int();
//line 92
int10=Math.floor(int9+int8);
//line 92
im7=n.imm_int(int10)
//line 92
string11=c[2];
//line 92
var call_3_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_3_1,string11,im7);im0=call_3_1.value;call_3_1=null;
//line 92
im7=null;
//line 92
int8=null;
//line 92
int9=null;
//line 92
int10=null;
//line 92
string11=null;
//line 93
case 22:
//line 94
im14=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 94
int13=im14.as_int();
//line 94
im14=null;
//line 94
im16=n.c_rt_lib.hash_get_value(im0,c[3]);;
//line 94
int15=im16.as_int();
//line 94
im16=null;
//line 94
bool12=int13>=int15;
//line 94
int13=null;
//line 94
int15=null;
//line 94
bool12=!bool12
//line 94
if (bool12) {label = 54; continue;}
//line 95
bool1=true;
//line 96
im19=c[5];
//line 96
im21=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 96
int20=im21.as_int();
//line 96
im21=null;
//line 96
string22=n.imm_int(int20)
//line 96
im18=n.c_rt_lib.concat(im19,string22);;
//line 96
im19=null;
//line 96
int20=null;
//line 96
string22=null;
//line 96
im23=c[9];
//line 96
im17=n.c_rt_lib.concat(im18,im23);;
//line 96
im18=null;
//line 96
im23=null;
//line 96
im2=null;
//line 96
im3=null;
//line 96
bool4=null;
//line 96
bool12=null;
//line 96
___arg__0.value = im0;___arg__1.value = bool1;return im17;
//line 97
label = 54; continue;
//line 97
case 54:
//line 97
bool12=null;
//line 97
im17=null;
//line 98
var call_9_1=new n.imm_ref(im0);im24=_prv_get_char(call_9_1);im0=call_9_1.value;call_9_1=null;
//line 99
im25=c[2];
//line 99
im25=n.c_rt_lib.get_ref_hash(im0,im25);
//line 99
int26=1;
//line 99
int27=im25.as_int();
//line 99
int28=Math.floor(int27+int26);
//line 99
im25=n.imm_int(int28)
//line 99
string29=c[2];
//line 99
var call_11_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_11_1,string29,im25);im0=call_11_1.value;call_11_1=null;
//line 99
im25=null;
//line 99
int26=null;
//line 99
int27=null;
//line 99
int28=null;
//line 99
string29=null;
//line 100
im31=c[8];
//line 100
bool30=n.c_rt_lib.eq(im24, im31)
//line 100
im31=null;
//line 100
bool30=!bool30
//line 100
if (bool30) {label = 80; continue;}
//line 100
im24=null;
//line 100
bool30=null;
//line 100
label = 144; continue;
//line 100
label = 80; continue;
//line 100
case 80:
//line 100
bool30=null;
//line 101
im33=c[10];
//line 101
bool32=n.c_rt_lib.eq(im24, im33)
//line 101
im33=null;
//line 101
bool32=!bool32
//line 101
if (bool32) {label = 136; continue;}
//line 102
var call_12_1=new n.imm_ref(im0);im34=_prv_get_char(call_12_1);im0=call_12_1.value;call_12_1=null;
//line 103
im36=c[11];
//line 103
bool35=n.c_rt_lib.eq(im34, im36)
//line 103
im36=null;
//line 103
bool35=!bool35
//line 103
if (bool35) {label = 97; continue;}
//line 104
im37=n.string.lf();
//line 104
im3=n.c_rt_lib.concat(im3,im37);;
//line 104
im37=null;
//line 105
label = 120; continue;
//line 105
case 97:
//line 105
im38=c[12];
//line 105
bool35=n.c_rt_lib.eq(im34, im38)
//line 105
im38=null;
//line 105
bool35=!bool35
//line 105
if (bool35) {label = 107; continue;}
//line 106
im39=n.string.r();
//line 106
im3=n.c_rt_lib.concat(im3,im39);;
//line 106
im39=null;
//line 107
label = 120; continue;
//line 107
case 107:
//line 107
im40=c[13];
//line 107
bool35=n.c_rt_lib.eq(im34, im40)
//line 107
im40=null;
//line 107
bool35=!bool35
//line 107
if (bool35) {label = 117; continue;}
//line 108
im41=n.string.tab();
//line 108
im3=n.c_rt_lib.concat(im3,im41);;
//line 108
im41=null;
//line 109
label = 120; continue;
//line 109
case 117:
//line 110
im3=n.c_rt_lib.concat(im3,im34);;
//line 111
label = 120; continue;
//line 111
case 120:
//line 111
bool35=null;
//line 112
im42=c[2];
//line 112
im42=n.c_rt_lib.get_ref_hash(im0,im42);
//line 112
int43=1;
//line 112
int44=im42.as_int();
//line 112
int45=Math.floor(int44+int43);
//line 112
im42=n.imm_int(int45)
//line 112
string46=c[2];
//line 112
var call_21_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_21_1,string46,im42);im0=call_21_1.value;call_21_1=null;
//line 112
im42=null;
//line 112
int43=null;
//line 112
int44=null;
//line 112
int45=null;
//line 112
string46=null;
//line 113
label = 139; continue;
//line 113
case 136:
//line 114
im3=n.c_rt_lib.concat(im3,im24);;
//line 115
label = 139; continue;
//line 115
case 139:
//line 115
bool32=null;
//line 115
im34=null;
//line 115
im24=null;
//line 93
label = 22; continue;
//line 93
case 144:
//line 117
label = 149; continue;
//line 117
case 146:
//line 118
var call_23_1=new n.imm_ref(im0);var call_23_2=new n.imm_ref(bool1);im3=_prv_eat_non_ws(call_23_1,call_23_2);im0=call_23_1.value;call_23_1=null;bool1=call_23_2.value;call_23_2=null;
//line 119
label = 149; continue;
//line 119
case 149:
//line 119
bool4=null;
//line 119
im24=null;
//line 120
bool47=n.c_rt_lib.ov_is(im2,c[14]);;
//line 120
if (bool47) {label = 155; continue;}
//line 120
bool47=n.c_rt_lib.ov_is(im2,c[15]);;
//line 120
case 155:
//line 120
bool47=!bool47
//line 120
if (bool47) {label = 162; continue;}
//line 121
im2=null;
//line 121
bool47=null;
//line 121
___arg__0.value = im0;___arg__1.value = bool1;return im3;
//line 122
label = 233; continue;
//line 122
case 162:
//line 122
bool47=n.c_rt_lib.ov_is(im2,c[16]);;
//line 122
bool47=!bool47
//line 122
if (bool47) {label = 208; continue;}
//line 123
im48=n.string_utils.get_integer(im3);
//line 123
bool49=n.c_rt_lib.ov_is(im48,c[17]);;
//line 123
if (bool49) {label = 174; continue;}
//line 125
bool49=n.c_rt_lib.ov_is(im48,c[18]);;
//line 125
if (bool49) {label = 188; continue;}
//line 125
im50=c[19];
//line 125
im50=n.imm_arr([im50,im48,]);
//line 125
n.nl_die();
//line 123
case 174:
//line 123
im52=n.c_rt_lib.ov_as(im48,c[17]);;
//line 123
int51=im52.as_int();
//line 124
im53=n.imm_int(int51)
//line 124
im2=null;
//line 124
im3=null;
//line 124
bool47=null;
//line 124
im48=null;
//line 124
bool49=null;
//line 124
im50=null;
//line 124
int51=null;
//line 124
im52=null;
//line 124
___arg__0.value = im0;___arg__1.value = bool1;return im53;
//line 125
label = 206; continue;
//line 125
case 188:
//line 125
im55=n.c_rt_lib.ov_as(im48,c[18]);;
//line 125
im54=im55
//line 126
bool1=true;
//line 127
im56=c[20];
//line 127
im2=null;
//line 127
im3=null;
//line 127
bool47=null;
//line 127
im48=null;
//line 127
bool49=null;
//line 127
im50=null;
//line 127
int51=null;
//line 127
im52=null;
//line 127
im53=null;
//line 127
im54=null;
//line 127
im55=null;
//line 127
___arg__0.value = im0;___arg__1.value = bool1;return im56;
//line 128
label = 206; continue;
//line 128
case 206:
//line 129
label = 233; continue;
//line 129
case 208:
//line 130
bool1=true;
//line 131
im59=c[21];
//line 131
im60=n.dfile_dbg.ssave(im2);
//line 131
im58=n.c_rt_lib.concat(im59,im60);;
//line 131
im59=null;
//line 131
im60=null;
//line 131
im61=c[22];
//line 131
im57=n.c_rt_lib.concat(im58,im61);;
//line 131
im58=null;
//line 131
im61=null;
//line 131
im2=null;
//line 131
im3=null;
//line 131
bool47=null;
//line 131
im48=null;
//line 131
bool49=null;
//line 131
im50=null;
//line 131
int51=null;
//line 131
im52=null;
//line 131
im53=null;
//line 131
im54=null;
//line 131
im55=null;
//line 131
im56=null;
//line 131
___arg__0.value = im0;___arg__1.value = bool1;return im57;
//line 132
label = 233; continue;
//line 132
case 233:
//line 132
bool47=null;
//line 132
im48=null;
//line 132
bool49=null;
//line 132
im50=null;
//line 132
int51=null;
//line 132
im52=null;
//line 132
im53=null;
//line 132
im54=null;
//line 132
im55=null;
//line 132
im56=null;
//line 132
im57=null;
//line 132
im2=null;
//line 132
im3=null;
//line 132
___arg__0.value = im0;___arg__1.value = bool1;return null;
}}}

function _prv_match_s(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var bool3=null;
var im4=null;
var im5=null;
var int6=null;
var im7=null;
var im8=null;
var int9=null;
var int10=null;
var string11=null;
var bool12=null;
var bool13=null;
var label=null;
while (1) { switch (label) {
default:
//line 136
int2=n.string.length(im1);
//line 137
im5=n.c_rt_lib.hash_get_value(im0,c[1]);;
//line 137
im7=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 137
int6=im7.as_int();
//line 137
im7=null;
//line 137
im4=n.c_std_lib.fast_substr(im5,int6,int2);
//line 137
im5=null;
//line 137
int6=null;
//line 137
bool3=n.c_rt_lib.eq(im4, im1)
//line 137
im4=null;
//line 137
bool3=!bool3
//line 137
if (bool3) {label = 29; continue;}
//line 138
im8=c[2];
//line 138
im8=n.c_rt_lib.get_ref_hash(im0,im8);
//line 138
int9=im8.as_int();
//line 138
int10=Math.floor(int9+int2);
//line 138
im8=n.imm_int(int10)
//line 138
string11=c[2];
//line 138
var call_5_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_5_1,string11,im8);im0=call_5_1.value;call_5_1=null;
//line 138
im8=null;
//line 138
int9=null;
//line 138
int10=null;
//line 138
string11=null;
//line 139
bool12=true;
//line 139
im1=null;
//line 139
int2=null;
//line 139
bool3=null;
//line 139
___arg__0.value = im0;return bool12;
//line 140
label = 37; continue;
//line 140
case 29:
//line 141
bool13=false;
//line 141
im1=null;
//line 141
int2=null;
//line 141
bool3=null;
//line 141
bool12=null;
//line 141
___arg__0.value = im0;return bool13;
//line 142
label = 37; continue;
//line 142
case 37:
//line 142
bool3=null;
//line 142
bool12=null;
//line 142
bool13=null;
}}}

function _prv__singleton_prv_fun_state_t() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 146
im3=n.ptd.string();
//line 146
im2=n.ptd.arr(im3);
//line 146
im3=null;
//line 146
im4=n.ptd.int();
//line 146
im5=n.ptd.int();
//line 146
im1=n.imm_hash({"str":im2,"len":im4,"pos":im5,});
//line 146
im2=null;
//line 146
im4=null;
//line 146
im5=null;
//line 146
im0=n.ptd.rec(im1);
//line 146
im1=null;
//line 146
return im0;
//line 146
im0=null;
//line 146
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_state_t;
n.dfile_dbg.state_t=function() {
if (_singleton_val__prv__singleton_prv_fun_state_t===undefined) {
_singleton_val__prv__singleton_prv_fun_state_t=_prv__singleton_prv_fun_state_t();
}
return _singleton_val__prv__singleton_prv_fun_state_t;
}

n.dfile_dbg.__dyn_state_t=function(arr) {
var ret = n.dfile_dbg.state_t()
return ret;
}

function _prv_parse(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var bool1=___arg__1.value;
n.check_null(bool1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var bool8=null;
var im9=null;
var int10=null;
var im11=null;
var int12=null;
var int13=null;
var string14=null;
var im15=null;
var bool16=null;
var im17=null;
var im18=null;
var im19=null;
var bool20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var int26=null;
var im27=null;
var string28=null;
var im29=null;
var im30=null;
var bool31=null;
var bool32=null;
var im33=null;
var im34=null;
var im35=null;
var im36=null;
var im37=null;
var im38=null;
var im39=null;
var im40=null;
var im41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var bool46=null;
var bool47=null;
var im48=null;
var im49=null;
var im50=null;
var im51=null;
var int52=null;
var im53=null;
var string54=null;
var im55=null;
var im56=null;
var int57=null;
var im58=null;
var int59=null;
var int60=null;
var string61=null;
var im62=null;
var bool63=null;
var im64=null;
var im65=null;
var bool66=null;
var im67=null;
var im68=null;
var im69=null;
var im70=null;
var im71=null;
var im72=null;
var im73=null;
var im74=null;
var im75=null;
var bool76=null;
var bool77=null;
var im78=null;
var im79=null;
var im80=null;
var im81=null;
var int82=null;
var im83=null;
var string84=null;
var im85=null;
var bool86=null;
var im87=null;
var int88=null;
var im89=null;
var int90=null;
var int91=null;
var string92=null;
var im93=null;
var im94=null;
var bool95=null;
var bool96=null;
var im97=null;
var im98=null;
var bool99=null;
var bool100=null;
var im101=null;
var im102=null;
var im103=null;
var bool104=null;
var im105=null;
var im106=null;
var im107=null;
var im108=null;
var im109=null;
var im110=null;
var im111=null;
var im112=null;
var im113=null;
var im114=null;
var im115=null;
var im116=null;
var im117=null;
var im118=null;
var im119=null;
var bool120=null;
var bool121=null;
var im122=null;
var im123=null;
var im124=null;
var im125=null;
var int126=null;
var im127=null;
var string128=null;
var im129=null;
var im130=null;
var bool131=null;
var im132=null;
var im133=null;
var im134=null;
var im135=null;
var int136=null;
var im137=null;
var string138=null;
var im139=null;
var im140=null;
var im141=null;
var label=null;
while (1) { switch (label) {
default:
//line 150
var call_0_1=new n.imm_ref(im0);_prv_eat_ws(call_0_1);im0=call_0_1.value;call_0_1=null;
//line 151
var call_1_1=new n.imm_ref(im0);im3=_prv_get_char(call_1_1);im0=call_1_1.value;call_1_1=null;
//line 152
case 2:
//line 152
bool4=n.c_rt_lib.ov_is(im2,c[23]);;
//line 152
bool4=!bool4
//line 152
if (bool4) {label = 15; continue;}
//line 153
im5=n.imm_arr([]);
//line 154
im6=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 154
im6=n.c_rt_lib.ov_mk_arg(c[23],im6);;
//line 154
var call_4_2=new n.imm_ref(im5);im7=n.c_std_lib.exec(im2,call_4_2);im5=call_4_2.value;call_4_2=null;
//line 154
im2=n.ptd.ensure(im6,im7);
//line 154
im6=null;
//line 154
im7=null;
//line 154
im5=null;
//line 155
label = 2; continue;
//line 155
case 15:
//line 156
im9=c[24];
//line 156
bool8=n.c_rt_lib.eq(im3, im9)
//line 156
im9=null;
//line 156
bool8=!bool8
//line 156
if (bool8) {label = 247; continue;}
//line 157
int10=1;
//line 157
im11=c[2];
//line 157
im11=n.c_rt_lib.get_ref_hash(im0,im11);
//line 157
int12=im11.as_int();
//line 157
int13=Math.floor(int12+int10);
//line 157
im11=n.imm_int(int13)
//line 157
string14=c[2];
//line 157
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string14,im11);im0=call_7_1.value;call_7_1=null;
//line 157
int10=null;
//line 157
im11=null;
//line 157
int12=null;
//line 157
int13=null;
//line 157
string14=null;
//line 158
im15=n.imm_hash({});
//line 159
var call_8_1=new n.imm_ref(im0);_prv_eat_ws(call_8_1);im0=call_8_1.value;call_8_1=null;
//line 160
case 36:
//line 160
im17=c[25];
//line 160
var call_9_1=new n.imm_ref(im0);bool16=_prv_match_s(call_9_1,im17);im0=call_9_1.value;call_9_1=null;
//line 160
im17=null;
//line 160
bool16=!bool16
//line 160
bool16=!bool16
//line 160
if (bool16) {label = 235; continue;}
//line 161
im19=n.ptd.string();
//line 161
var call_11_1=new n.imm_ref(im0);var call_11_2=new n.imm_ref(bool1);im18=_prv_parse_scalar(call_11_1,call_11_2,im19);im0=call_11_1.value;call_11_1=null;bool1=call_11_2.value;call_11_2=null;
//line 161
im19=null;
//line 162
bool20=bool1
//line 162
bool20=!bool20
//line 162
if (bool20) {label = 59; continue;}
//line 162
im2=null;
//line 162
im3=null;
//line 162
bool4=null;
//line 162
im5=null;
//line 162
bool8=null;
//line 162
im15=null;
//line 162
bool16=null;
//line 162
bool20=null;
//line 162
___arg__0.value = im0;___arg__1.value = bool1;return im18;
//line 162
label = 59; continue;
//line 162
case 59:
//line 162
bool20=null;
//line 163
var call_12_1=new n.imm_ref(im0);_prv_eat_ws(call_12_1);im0=call_12_1.value;call_12_1=null;
//line 164
im22=c[26];
//line 164
var call_13_1=new n.imm_ref(im0);bool21=_prv_match_s(call_13_1,im22);im0=call_13_1.value;call_13_1=null;
//line 164
im22=null;
//line 164
bool21=!bool21
//line 164
bool21=!bool21
//line 164
if (bool21) {label = 93; continue;}
//line 165
bool1=true;
//line 166
im25=c[5];
//line 166
im27=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 166
int26=im27.as_int();
//line 166
im27=null;
//line 166
string28=n.imm_int(int26)
//line 166
im24=n.c_rt_lib.concat(im25,string28);;
//line 166
im25=null;
//line 166
int26=null;
//line 166
string28=null;
//line 166
im29=c[27];
//line 166
im23=n.c_rt_lib.concat(im24,im29);;
//line 166
im24=null;
//line 166
im29=null;
//line 166
im2=null;
//line 166
im3=null;
//line 166
bool4=null;
//line 166
im5=null;
//line 166
bool8=null;
//line 166
im15=null;
//line 166
bool16=null;
//line 166
im18=null;
//line 166
bool21=null;
//line 166
___arg__0.value = im0;___arg__1.value = bool1;return im23;
//line 167
label = 93; continue;
//line 167
case 93:
//line 167
bool21=null;
//line 167
im23=null;
//line 169
bool31=n.c_rt_lib.ov_is(im2,c[28]);;
//line 169
bool31=!bool31
//line 169
if (bool31) {label = 130; continue;}
//line 170
im33=n.c_rt_lib.ov_as(im2,c[28]);;
//line 170
bool32=n.hash.has_key(im33,im18);
//line 170
im33=null;
//line 170
bool32=!bool32
//line 170
if (bool32) {label = 108; continue;}
//line 171
im34=n.c_rt_lib.ov_as(im2,c[28]);;
//line 171
im30=n.c_rt_lib.hash_get_value(im34,im18);
//line 171
im34=null;
//line 172
label = 126; continue;
//line 172
case 108:
//line 173
bool1=true;
//line 174
im36=c[29];
//line 174
im35=n.c_rt_lib.concat(im36,im18);;
//line 174
im36=null;
//line 174
im2=null;
//line 174
im3=null;
//line 174
bool4=null;
//line 174
im5=null;
//line 174
bool8=null;
//line 174
im15=null;
//line 174
bool16=null;
//line 174
im18=null;
//line 174
im30=null;
//line 174
bool31=null;
//line 174
bool32=null;
//line 174
___arg__0.value = im0;___arg__1.value = bool1;return im35;
//line 175
label = 126; continue;
//line 175
case 126:
//line 175
bool32=null;
//line 175
im35=null;
//line 176
label = 171; continue;
//line 176
case 130:
//line 176
bool31=n.c_rt_lib.ov_is(im2,c[30]);;
//line 176
bool31=!bool31
//line 176
if (bool31) {label = 136; continue;}
//line 177
im30=n.c_rt_lib.ov_as(im2,c[30]);;
//line 178
label = 171; continue;
//line 178
case 136:
//line 178
bool31=n.c_rt_lib.ov_is(im2,c[15]);;
//line 178
bool31=!bool31
//line 178
if (bool31) {label = 142; continue;}
//line 179
im30=c[31]
//line 180
label = 171; continue;
//line 180
case 142:
//line 181
bool1=true;
//line 182
im40=c[21];
//line 182
im41=n.dfile_dbg.ssave(im2);
//line 182
im39=n.c_rt_lib.concat(im40,im41);;
//line 182
im40=null;
//line 182
im41=null;
//line 182
im42=c[32];
//line 182
im38=n.c_rt_lib.concat(im39,im42);;
//line 182
im39=null;
//line 182
im42=null;
//line 182
im44=c[33]
//line 182
im43=n.dfile_dbg.ssave(im44);
//line 182
im44=null;
//line 182
im37=n.c_rt_lib.concat(im38,im43);;
//line 182
im38=null;
//line 182
im43=null;
//line 182
im2=null;
//line 182
im3=null;
//line 182
bool4=null;
//line 182
im5=null;
//line 182
bool8=null;
//line 182
im15=null;
//line 182
bool16=null;
//line 182
im18=null;
//line 182
im30=null;
//line 182
bool31=null;
//line 182
___arg__0.value = im0;___arg__1.value = bool1;return im37;
//line 183
label = 171; continue;
//line 183
case 171:
//line 183
bool31=null;
//line 183
im37=null;
//line 184
var call_31_1=new n.imm_ref(im0);var call_31_2=new n.imm_ref(bool1);im45=_prv_parse(call_31_1,call_31_2,im30);im0=call_31_1.value;call_31_1=null;bool1=call_31_2.value;call_31_2=null;
//line 185
bool46=bool1
//line 185
bool46=!bool46
//line 185
if (bool46) {label = 190; continue;}
//line 185
im2=null;
//line 185
im3=null;
//line 185
bool4=null;
//line 185
im5=null;
//line 185
bool8=null;
//line 185
im15=null;
//line 185
bool16=null;
//line 185
im18=null;
//line 185
im30=null;
//line 185
bool46=null;
//line 185
___arg__0.value = im0;___arg__1.value = bool1;return im45;
//line 185
label = 190; continue;
//line 185
case 190:
//line 185
bool46=null;
//line 186
var call_32_1=new n.imm_ref(im15);n.hash.set_value(call_32_1,im18,im45);im15=call_32_1.value;call_32_1=null;
//line 187
var call_33_1=new n.imm_ref(im0);_prv_eat_ws(call_33_1);im0=call_33_1.value;call_33_1=null;
//line 188
im48=c[34];
//line 188
var call_34_1=new n.imm_ref(im0);bool47=_prv_match_s(call_34_1,im48);im0=call_34_1.value;call_34_1=null;
//line 188
im48=null;
//line 188
bool47=!bool47
//line 188
bool47=!bool47
//line 188
if (bool47) {label = 227; continue;}
//line 189
bool1=true;
//line 190
im51=c[5];
//line 190
im53=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 190
int52=im53.as_int();
//line 190
im53=null;
//line 190
string54=n.imm_int(int52)
//line 190
im50=n.c_rt_lib.concat(im51,string54);;
//line 190
im51=null;
//line 190
int52=null;
//line 190
string54=null;
//line 190
im55=c[35];
//line 190
im49=n.c_rt_lib.concat(im50,im55);;
//line 190
im50=null;
//line 190
im55=null;
//line 190
im2=null;
//line 190
im3=null;
//line 190
bool4=null;
//line 190
im5=null;
//line 190
bool8=null;
//line 190
im15=null;
//line 190
bool16=null;
//line 190
im18=null;
//line 190
im30=null;
//line 190
im45=null;
//line 190
bool47=null;
//line 190
___arg__0.value = im0;___arg__1.value = bool1;return im49;
//line 191
label = 227; continue;
//line 191
case 227:
//line 191
bool47=null;
//line 191
im49=null;
//line 192
var call_38_1=new n.imm_ref(im0);_prv_eat_ws(call_38_1);im0=call_38_1.value;call_38_1=null;
//line 192
im18=null;
//line 192
im30=null;
//line 192
im45=null;
//line 193
label = 36; continue;
//line 193
case 235:
//line 194
im2=null;
//line 194
im3=null;
//line 194
bool4=null;
//line 194
im5=null;
//line 194
bool8=null;
//line 194
bool16=null;
//line 194
im18=null;
//line 194
im30=null;
//line 194
im45=null;
//line 194
___arg__0.value = im0;___arg__1.value = bool1;return im15;
//line 195
label = 780; continue;
//line 195
case 247:
//line 195
im56=c[36];
//line 195
bool8=n.c_rt_lib.eq(im3, im56)
//line 195
im56=null;
//line 195
bool8=!bool8
//line 195
if (bool8) {label = 405; continue;}
//line 196
int57=1;
//line 196
im58=c[2];
//line 196
im58=n.c_rt_lib.get_ref_hash(im0,im58);
//line 196
int59=im58.as_int();
//line 196
int60=Math.floor(int59+int57);
//line 196
im58=n.imm_int(int60)
//line 196
string61=c[2];
//line 196
var call_40_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_40_1,string61,im58);im0=call_40_1.value;call_40_1=null;
//line 196
int57=null;
//line 196
im58=null;
//line 196
int59=null;
//line 196
int60=null;
//line 196
string61=null;
//line 197
im62=n.imm_arr([]);
//line 198
var call_41_1=new n.imm_ref(im0);_prv_eat_ws(call_41_1);im0=call_41_1.value;call_41_1=null;
//line 199
case 268:
//line 199
im64=c[37];
//line 199
var call_42_1=new n.imm_ref(im0);bool63=_prv_match_s(call_42_1,im64);im0=call_42_1.value;call_42_1=null;
//line 199
im64=null;
//line 199
bool63=!bool63
//line 199
bool63=!bool63
//line 199
if (bool63) {label = 389; continue;}
//line 201
bool66=n.c_rt_lib.ov_is(im2,c[38]);;
//line 201
bool66=!bool66
//line 201
if (bool66) {label = 280; continue;}
//line 202
im65=n.c_rt_lib.ov_as(im2,c[38]);;
//line 203
label = 319; continue;
//line 203
case 280:
//line 203
bool66=n.c_rt_lib.ov_is(im2,c[15]);;
//line 203
bool66=!bool66
//line 203
if (bool66) {label = 286; continue;}
//line 204
im65=c[39]
//line 205
label = 319; continue;
//line 205
case 286:
//line 206
bool1=true;
//line 207
im70=c[21];
//line 207
im71=n.dfile_dbg.ssave(im2);
//line 207
im69=n.c_rt_lib.concat(im70,im71);;
//line 207
im70=null;
//line 207
im71=null;
//line 207
im72=c[32];
//line 207
im68=n.c_rt_lib.concat(im69,im72);;
//line 207
im69=null;
//line 207
im72=null;
//line 207
im74=c[40]
//line 207
im73=n.dfile_dbg.ssave(im74);
//line 207
im74=null;
//line 207
im67=n.c_rt_lib.concat(im68,im73);;
//line 207
im68=null;
//line 207
im73=null;
//line 207
im2=null;
//line 207
im3=null;
//line 207
bool4=null;
//line 207
im5=null;
//line 207
bool8=null;
//line 207
im15=null;
//line 207
bool16=null;
//line 207
im18=null;
//line 207
im30=null;
//line 207
im45=null;
//line 207
im62=null;
//line 207
bool63=null;
//line 207
im65=null;
//line 207
bool66=null;
//line 207
___arg__0.value = im0;___arg__1.value = bool1;return im67;
//line 208
label = 319; continue;
//line 208
case 319:
//line 208
bool66=null;
//line 208
im67=null;
//line 209
var call_51_1=new n.imm_ref(im0);var call_51_2=new n.imm_ref(bool1);im75=_prv_parse(call_51_1,call_51_2,im65);im0=call_51_1.value;call_51_1=null;bool1=call_51_2.value;call_51_2=null;
//line 210
bool76=bool1
//line 210
bool76=!bool76
//line 210
if (bool76) {label = 342; continue;}
//line 210
im2=null;
//line 210
im3=null;
//line 210
bool4=null;
//line 210
im5=null;
//line 210
bool8=null;
//line 210
im15=null;
//line 210
bool16=null;
//line 210
im18=null;
//line 210
im30=null;
//line 210
im45=null;
//line 210
im62=null;
//line 210
bool63=null;
//line 210
im65=null;
//line 210
bool76=null;
//line 210
___arg__0.value = im0;___arg__1.value = bool1;return im75;
//line 210
label = 342; continue;
//line 210
case 342:
//line 210
bool76=null;
//line 211
var call_52_1=new n.imm_ref(im62);n.array.push(call_52_1,im75);im62=call_52_1.value;call_52_1=null;
//line 212
im78=c[34];
//line 212
var call_53_1=new n.imm_ref(im0);bool77=_prv_match_s(call_53_1,im78);im0=call_53_1.value;call_53_1=null;
//line 212
im78=null;
//line 212
bool77=!bool77
//line 212
bool77=!bool77
//line 212
if (bool77) {label = 382; continue;}
//line 213
bool1=true;
//line 214
im81=c[5];
//line 214
im83=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 214
int82=im83.as_int();
//line 214
im83=null;
//line 214
string84=n.imm_int(int82)
//line 214
im80=n.c_rt_lib.concat(im81,string84);;
//line 214
im81=null;
//line 214
int82=null;
//line 214
string84=null;
//line 214
im85=c[35];
//line 214
im79=n.c_rt_lib.concat(im80,im85);;
//line 214
im80=null;
//line 214
im85=null;
//line 214
im2=null;
//line 214
im3=null;
//line 214
bool4=null;
//line 214
im5=null;
//line 214
bool8=null;
//line 214
im15=null;
//line 214
bool16=null;
//line 214
im18=null;
//line 214
im30=null;
//line 214
im45=null;
//line 214
im62=null;
//line 214
bool63=null;
//line 214
im65=null;
//line 214
im75=null;
//line 214
bool77=null;
//line 214
___arg__0.value = im0;___arg__1.value = bool1;return im79;
//line 215
label = 382; continue;
//line 215
case 382:
//line 215
bool77=null;
//line 215
im79=null;
//line 216
var call_57_1=new n.imm_ref(im0);_prv_eat_ws(call_57_1);im0=call_57_1.value;call_57_1=null;
//line 216
im65=null;
//line 216
im75=null;
//line 217
label = 268; continue;
//line 217
case 389:
//line 218
im2=null;
//line 218
im3=null;
//line 218
bool4=null;
//line 218
im5=null;
//line 218
bool8=null;
//line 218
im15=null;
//line 218
bool16=null;
//line 218
im18=null;
//line 218
im30=null;
//line 218
im45=null;
//line 218
bool63=null;
//line 218
im65=null;
//line 218
im75=null;
//line 218
___arg__0.value = im0;___arg__1.value = bool1;return im62;
//line 219
label = 780; continue;
//line 219
case 405:
//line 219
im87=c[41];
//line 219
bool8=n.c_rt_lib.eq(im3, im87)
//line 219
im87=null;
//line 219
bool86=!bool8
//line 219
if (bool86) {label = 412; continue;}
//line 219
var call_58_1=new n.imm_ref(im0);bool8=_prv_is_ov(call_58_1);im0=call_58_1.value;call_58_1=null;
//line 219
case 412:
//line 219
bool86=null;
//line 219
bool8=!bool8
//line 219
if (bool8) {label = 760; continue;}
//line 220
int88=7;
//line 220
im89=c[2];
//line 220
im89=n.c_rt_lib.get_ref_hash(im0,im89);
//line 220
int90=im89.as_int();
//line 220
int91=Math.floor(int90+int88);
//line 220
im89=n.imm_int(int91)
//line 220
string92=c[2];
//line 220
var call_60_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_60_1,string92,im89);im0=call_60_1.value;call_60_1=null;
//line 220
int88=null;
//line 220
im89=null;
//line 220
int90=null;
//line 220
int91=null;
//line 220
string92=null;
//line 221
im94=n.ptd.string();
//line 221
var call_62_1=new n.imm_ref(im0);var call_62_2=new n.imm_ref(bool1);im93=_prv_parse_scalar(call_62_1,call_62_2,im94);im0=call_62_1.value;call_62_1=null;bool1=call_62_2.value;call_62_2=null;
//line 221
im94=null;
//line 222
bool95=bool1
//line 222
bool95=!bool95
//line 222
if (bool95) {label = 452; continue;}
//line 222
im2=null;
//line 222
im3=null;
//line 222
bool4=null;
//line 222
im5=null;
//line 222
bool8=null;
//line 222
im15=null;
//line 222
bool16=null;
//line 222
im18=null;
//line 222
im30=null;
//line 222
im45=null;
//line 222
im62=null;
//line 222
bool63=null;
//line 222
im65=null;
//line 222
im75=null;
//line 222
bool95=null;
//line 222
___arg__0.value = im0;___arg__1.value = bool1;return im93;
//line 222
label = 452; continue;
//line 222
case 452:
//line 222
bool95=null;
//line 223
var call_63_1=new n.imm_ref(im0);_prv_eat_ws(call_63_1);im0=call_63_1.value;call_63_1=null;
//line 224
im97=c[34];
//line 224
var call_64_1=new n.imm_ref(im0);bool96=_prv_match_s(call_64_1,im97);im0=call_64_1.value;call_64_1=null;
//line 224
im97=null;
//line 224
bool96=!bool96
//line 224
if (bool96) {label = 694; continue;}
//line 226
bool99=n.c_rt_lib.ov_is(im2,c[42]);;
//line 226
bool99=!bool99
//line 226
if (bool99) {label = 556; continue;}
//line 227
im101=n.c_rt_lib.ov_as(im2,c[42]);;
//line 227
bool100=n.hash.has_key(im101,im93);
//line 227
im101=null;
//line 227
bool100=!bool100
//line 227
if (bool100) {label = 514; continue;}
//line 228
im103=n.c_rt_lib.ov_as(im2,c[42]);;
//line 228
im102=n.c_rt_lib.hash_get_value(im103,im93);
//line 228
im103=null;
//line 228
bool104=n.c_rt_lib.ov_is(im102,c[43]);;
//line 228
if (bool104) {label = 478; continue;}
//line 230
bool104=n.c_rt_lib.ov_is(im102,c[44]);;
//line 230
if (bool104) {label = 483; continue;}
//line 230
im105=c[19];
//line 230
im105=n.imm_arr([im105,im102,]);
//line 230
n.nl_die();
//line 228
case 478:
//line 228
im107=n.c_rt_lib.ov_as(im102,c[43]);;
//line 228
im106=im107
//line 229
im98=im106
//line 230
label = 512; continue;
//line 230
case 483:
//line 231
bool1=true;
//line 232
im108=c[45];
//line 232
im2=null;
//line 232
im3=null;
//line 232
bool4=null;
//line 232
im5=null;
//line 232
bool8=null;
//line 232
im15=null;
//line 232
bool16=null;
//line 232
im18=null;
//line 232
im30=null;
//line 232
im45=null;
//line 232
im62=null;
//line 232
bool63=null;
//line 232
im65=null;
//line 232
im75=null;
//line 232
im93=null;
//line 232
bool96=null;
//line 232
im98=null;
//line 232
bool99=null;
//line 232
bool100=null;
//line 232
im102=null;
//line 232
bool104=null;
//line 232
im105=null;
//line 232
im106=null;
//line 232
im107=null;
//line 232
___arg__0.value = im0;___arg__1.value = bool1;return im108;
//line 233
label = 512; continue;
//line 233
case 512:
//line 234
label = 546; continue;
//line 234
case 514:
//line 235
bool1=true;
//line 236
im110=c[46];
//line 236
im109=n.c_rt_lib.concat(im110,im93);;
//line 236
im110=null;
//line 236
im2=null;
//line 236
im3=null;
//line 236
bool4=null;
//line 236
im5=null;
//line 236
bool8=null;
//line 236
im15=null;
//line 236
bool16=null;
//line 236
im18=null;
//line 236
im30=null;
//line 236
im45=null;
//line 236
im62=null;
//line 236
bool63=null;
//line 236
im65=null;
//line 236
im75=null;
//line 236
im93=null;
//line 236
bool96=null;
//line 236
im98=null;
//line 236
bool99=null;
//line 236
bool100=null;
//line 236
im102=null;
//line 236
bool104=null;
//line 236
im105=null;
//line 236
im106=null;
//line 236
im107=null;
//line 236
im108=null;
//line 236
___arg__0.value = im0;___arg__1.value = bool1;return im109;
//line 237
label = 546; continue;
//line 237
case 546:
//line 237
bool100=null;
//line 237
im102=null;
//line 237
bool104=null;
//line 237
im105=null;
//line 237
im106=null;
//line 237
im107=null;
//line 237
im108=null;
//line 237
im109=null;
//line 238
label = 599; continue;
//line 238
case 556:
//line 238
bool99=n.c_rt_lib.ov_is(im2,c[15]);;
//line 238
bool99=!bool99
//line 238
if (bool99) {label = 562; continue;}
//line 239
im98=c[47]
//line 240
label = 599; continue;
//line 240
case 562:
//line 241
bool1=true;
//line 242
im114=c[21];
//line 242
im115=n.dfile_dbg.ssave(im2);
//line 242
im113=n.c_rt_lib.concat(im114,im115);;
//line 242
im114=null;
//line 242
im115=null;
//line 242
im116=c[32];
//line 242
im112=n.c_rt_lib.concat(im113,im116);;
//line 242
im113=null;
//line 242
im116=null;
//line 242
im118=c[48]
//line 242
im117=n.dfile_dbg.ssave(im118);
//line 242
im118=null;
//line 242
im111=n.c_rt_lib.concat(im112,im117);;
//line 242
im112=null;
//line 242
im117=null;
//line 242
im2=null;
//line 242
im3=null;
//line 242
bool4=null;
//line 242
im5=null;
//line 242
bool8=null;
//line 242
im15=null;
//line 242
bool16=null;
//line 242
im18=null;
//line 242
im30=null;
//line 242
im45=null;
//line 242
im62=null;
//line 242
bool63=null;
//line 242
im65=null;
//line 242
im75=null;
//line 242
im93=null;
//line 242
bool96=null;
//line 242
im98=null;
//line 242
bool99=null;
//line 242
___arg__0.value = im0;___arg__1.value = bool1;return im111;
//line 243
label = 599; continue;
//line 243
case 599:
//line 243
bool99=null;
//line 243
im111=null;
//line 244
var call_80_1=new n.imm_ref(im0);var call_80_2=new n.imm_ref(bool1);im119=_prv_parse(call_80_1,call_80_2,im98);im0=call_80_1.value;call_80_1=null;bool1=call_80_2.value;call_80_2=null;
//line 245
bool120=bool1
//line 245
bool120=!bool120
//line 245
if (bool120) {label = 626; continue;}
//line 245
im2=null;
//line 245
im3=null;
//line 245
bool4=null;
//line 245
im5=null;
//line 245
bool8=null;
//line 245
im15=null;
//line 245
bool16=null;
//line 245
im18=null;
//line 245
im30=null;
//line 245
im45=null;
//line 245
im62=null;
//line 245
bool63=null;
//line 245
im65=null;
//line 245
im75=null;
//line 245
im93=null;
//line 245
bool96=null;
//line 245
im98=null;
//line 245
bool120=null;
//line 245
___arg__0.value = im0;___arg__1.value = bool1;return im119;
//line 245
label = 626; continue;
//line 245
case 626:
//line 245
bool120=null;
//line 246
var call_81_1=new n.imm_ref(im0);_prv_eat_ws(call_81_1);im0=call_81_1.value;call_81_1=null;
//line 247
im122=c[49];
//line 247
var call_82_1=new n.imm_ref(im0);bool121=_prv_match_s(call_82_1,im122);im0=call_82_1.value;call_82_1=null;
//line 247
im122=null;
//line 247
bool121=!bool121
//line 247
bool121=!bool121
//line 247
if (bool121) {label = 670; continue;}
//line 248
bool1=true;
//line 249
im125=c[5];
//line 249
im127=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 249
int126=im127.as_int();
//line 249
im127=null;
//line 249
string128=n.imm_int(int126)
//line 249
im124=n.c_rt_lib.concat(im125,string128);;
//line 249
im125=null;
//line 249
int126=null;
//line 249
string128=null;
//line 249
im129=c[50];
//line 249
im123=n.c_rt_lib.concat(im124,im129);;
//line 249
im124=null;
//line 249
im129=null;
//line 249
im2=null;
//line 249
im3=null;
//line 249
bool4=null;
//line 249
im5=null;
//line 249
bool8=null;
//line 249
im15=null;
//line 249
bool16=null;
//line 249
im18=null;
//line 249
im30=null;
//line 249
im45=null;
//line 249
im62=null;
//line 249
bool63=null;
//line 249
im65=null;
//line 249
im75=null;
//line 249
im93=null;
//line 249
bool96=null;
//line 249
im98=null;
//line 249
im119=null;
//line 249
bool121=null;
//line 249
___arg__0.value = im0;___arg__1.value = bool1;return im123;
//line 250
label = 670; continue;
//line 250
case 670:
//line 250
bool121=null;
//line 250
im123=null;
//line 251
im130=n.ov.mk_val(im93,im119);
//line 251
im2=null;
//line 251
im3=null;
//line 251
bool4=null;
//line 251
im5=null;
//line 251
bool8=null;
//line 251
im15=null;
//line 251
bool16=null;
//line 251
im18=null;
//line 251
im30=null;
//line 251
im45=null;
//line 251
im62=null;
//line 251
bool63=null;
//line 251
im65=null;
//line 251
im75=null;
//line 251
im93=null;
//line 251
bool96=null;
//line 251
im98=null;
//line 251
im119=null;
//line 251
___arg__0.value = im0;___arg__1.value = bool1;return im130;
//line 252
label = 694; continue;
//line 252
case 694:
//line 252
bool96=null;
//line 252
im98=null;
//line 252
im119=null;
//line 252
im130=null;
//line 253
var call_87_1=new n.imm_ref(im0);_prv_eat_ws(call_87_1);im0=call_87_1.value;call_87_1=null;
//line 254
im132=c[49];
//line 254
var call_88_1=new n.imm_ref(im0);bool131=_prv_match_s(call_88_1,im132);im0=call_88_1.value;call_88_1=null;
//line 254
im132=null;
//line 254
bool131=!bool131
//line 254
bool131=!bool131
//line 254
if (bool131) {label = 738; continue;}
//line 255
bool1=true;
//line 256
im135=c[5];
//line 256
im137=n.c_rt_lib.hash_get_value(im0,c[2]);;
//line 256
int136=im137.as_int();
//line 256
im137=null;
//line 256
string138=n.imm_int(int136)
//line 256
im134=n.c_rt_lib.concat(im135,string138);;
//line 256
im135=null;
//line 256
int136=null;
//line 256
string138=null;
//line 256
im139=c[50];
//line 256
im133=n.c_rt_lib.concat(im134,im139);;
//line 256
im134=null;
//line 256
im139=null;
//line 256
im2=null;
//line 256
im3=null;
//line 256
bool4=null;
//line 256
im5=null;
//line 256
bool8=null;
//line 256
im15=null;
//line 256
bool16=null;
//line 256
im18=null;
//line 256
im30=null;
//line 256
im45=null;
//line 256
im62=null;
//line 256
bool63=null;
//line 256
im65=null;
//line 256
im75=null;
//line 256
im93=null;
//line 256
bool131=null;
//line 256
___arg__0.value = im0;___arg__1.value = bool1;return im133;
//line 257
label = 738; continue;
//line 257
case 738:
//line 257
bool131=null;
//line 257
im133=null;
//line 258
var call_92_1=new n.imm_ref(im0);_prv_eat_ws(call_92_1);im0=call_92_1.value;call_92_1=null;
//line 259
im140=n.ov.mk(im93);
//line 259
im2=null;
//line 259
im3=null;
//line 259
bool4=null;
//line 259
im5=null;
//line 259
bool8=null;
//line 259
im15=null;
//line 259
bool16=null;
//line 259
im18=null;
//line 259
im30=null;
//line 259
im45=null;
//line 259
im62=null;
//line 259
bool63=null;
//line 259
im65=null;
//line 259
im75=null;
//line 259
im93=null;
//line 259
___arg__0.value = im0;___arg__1.value = bool1;return im140;
//line 260
label = 780; continue;
//line 260
case 760:
//line 261
var call_94_1=new n.imm_ref(im0);var call_94_2=new n.imm_ref(bool1);im141=_prv_parse_scalar(call_94_1,call_94_2,im2);im0=call_94_1.value;call_94_1=null;bool1=call_94_2.value;call_94_2=null;
//line 261
im2=null;
//line 261
im3=null;
//line 261
bool4=null;
//line 261
im5=null;
//line 261
bool8=null;
//line 261
im15=null;
//line 261
bool16=null;
//line 261
im18=null;
//line 261
im30=null;
//line 261
im45=null;
//line 261
im62=null;
//line 261
bool63=null;
//line 261
im65=null;
//line 261
im75=null;
//line 261
im93=null;
//line 261
im140=null;
//line 261
___arg__0.value = im0;___arg__1.value = bool1;return im141;
//line 262
label = 780; continue;
//line 262
case 780:
//line 262
bool8=null;
//line 262
im15=null;
//line 262
bool16=null;
//line 262
im18=null;
//line 262
im30=null;
//line 262
im45=null;
//line 262
im62=null;
//line 262
bool63=null;
//line 262
im65=null;
//line 262
im75=null;
//line 262
im93=null;
//line 262
im140=null;
//line 262
im141=null;
//line 262
im2=null;
//line 262
im3=null;
//line 262
bool4=null;
//line 262
im5=null;
//line 262
___arg__0.value = im0;___arg__1.value = bool1;return null;
}}}

n.dfile_dbg.sload=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var bool2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 266
im3=n.dfile_dbg.try_sload(im0);
//line 266
bool2=n.c_rt_lib.ov_is(im3,c[17]);;
//line 266
if (bool2) {label = 5; continue;}
//line 266
im3=n.c_rt_lib.ov_mk_arg(c[51],im3);;
//line 266
n.nl_die();
//line 266
case 5:
//line 266
im1=n.c_rt_lib.ov_as(im3,c[17]);;
//line 267
im0=null;
//line 267
bool2=null;
//line 267
im3=null;
//line 267
return im1;
//line 267
im0=null;
//line 267
im1=null;
//line 267
bool2=null;
//line 267
im3=null;
//line 267
return null;
}}}

n.dfile_dbg.__dyn_sload=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile_dbg.sload(arg0)
return ret;
}

n.dfile_dbg.sload_type=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 271
im4=n.dfile_dbg.try_sload_type(im0,im1);
//line 271
bool3=n.c_rt_lib.ov_is(im4,c[17]);;
//line 271
if (bool3) {label = 5; continue;}
//line 271
im4=n.c_rt_lib.ov_mk_arg(c[51],im4);;
//line 271
n.nl_die();
//line 271
case 5:
//line 271
im2=n.c_rt_lib.ov_as(im4,c[17]);;
//line 272
im0=null;
//line 272
im1=null;
//line 272
bool3=null;
//line 272
im4=null;
//line 272
return im2;
//line 272
im0=null;
//line 272
im1=null;
//line 272
im2=null;
//line 272
bool3=null;
//line 272
im4=null;
//line 272
return null;
}}}

n.dfile_dbg.__dyn_sload_type=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile_dbg.sload_type(arg0, arg1)
return ret;
}

n.dfile_dbg.try_sload=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 276
im2=n.ptd.ptd_im();
//line 276
im1=n.dfile_dbg.try_sload_type(im0,im2);
//line 276
im2=null;
//line 276
im0=null;
//line 276
return im1;
}}}

n.dfile_dbg.__dyn_try_sload=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.dfile_dbg.try_sload(arg0)
return ret;
}

n.dfile_dbg.try_sload_type=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var int6=null;
var im7=null;
var int8=null;
var im9=null;
var bool10=null;
var im11=null;
var im12=null;
var bool13=null;
var bool14=null;
var int15=null;
var im16=null;
var int17=null;
var im18=null;
var im19=null;
var im20=null;
var int21=null;
var im22=null;
var string23=null;
var im24=null;
var bool25=null;
var im26=null;
var im27=null;
var im28=null;
var label=null;
while (1) { switch (label) {
default:
//line 280
im3=n.ptd.string();
//line 280
im2=n.ptd.ensure(im3,im0);
//line 280
im3=null;
//line 281
im5=n.imm_arr([im2,]);
//line 281
int6=0;
//line 281
im7=n.imm_int(int6)
//line 281
int8=n.string.length(im2);
//line 281
im9=n.imm_int(int8)
//line 281
im4=n.imm_hash({"str":im5,"pos":im7,"len":im9,});
//line 281
im5=null;
//line 281
int6=null;
//line 281
im7=null;
//line 281
int8=null;
//line 281
im9=null;
//line 282
bool10=false;
//line 283
im11=c[52];
//line 283
var call_3_1=new n.imm_ref(im4);_prv_match_s(call_3_1,im11);im4=call_3_1.value;call_3_1=null;
//line 283
im11=null;
//line 284
var call_4_1=new n.imm_ref(im4);_prv_eat_ws(call_4_1);im4=call_4_1.value;call_4_1=null;
//line 285
var call_5_1=new n.imm_ref(im4);var call_5_2=new n.imm_ref(bool10);im12=_prv_parse(call_5_1,call_5_2,im1);im4=call_5_1.value;call_5_1=null;bool10=call_5_2.value;call_5_2=null;
//line 286
var call_6_1=new n.imm_ref(im4);_prv_eat_ws(call_6_1);im4=call_6_1.value;call_6_1=null;
//line 287
bool13=bool10
//line 287
bool13=!bool13
//line 287
bool14=!bool13
//line 287
if (bool14) {label = 34; continue;}
//line 287
im16=n.c_rt_lib.hash_get_value(im4,c[2]);;
//line 287
int15=im16.as_int();
//line 287
im16=null;
//line 287
im18=n.c_rt_lib.hash_get_value(im4,c[3]);;
//line 287
int17=im18.as_int();
//line 287
im18=null;
//line 287
bool13=int15!=int17;
//line 287
int15=null;
//line 287
int17=null;
//line 287
case 34:
//line 287
bool14=null;
//line 287
bool13=!bool13
//line 287
if (bool13) {label = 53; continue;}
//line 288
bool10=true;
//line 289
im20=c[5];
//line 289
im22=n.c_rt_lib.hash_get_value(im4,c[2]);;
//line 289
int21=im22.as_int();
//line 289
im22=null;
//line 289
string23=n.imm_int(int21)
//line 289
im19=n.c_rt_lib.concat(im20,string23);;
//line 289
im20=null;
//line 289
int21=null;
//line 289
string23=null;
//line 289
im24=c[53];
//line 289
im12=n.c_rt_lib.concat(im19,im24);;
//line 289
im19=null;
//line 289
im24=null;
//line 290
label = 53; continue;
//line 290
case 53:
//line 290
bool13=null;
//line 291
bool25=bool10
//line 291
bool25=!bool25
//line 291
if (bool25) {label = 71; continue;}
//line 292
im26=n.ptd.string();
//line 292
im12=n.ptd.ensure(im26,im12);
//line 292
im26=null;
//line 293
im27=n.c_rt_lib.ov_mk_arg(c[18],im12);;
//line 293
im0=null;
//line 293
im1=null;
//line 293
im2=null;
//line 293
im4=null;
//line 293
bool10=null;
//line 293
im12=null;
//line 293
bool25=null;
//line 293
return im27;
//line 294
label = 83; continue;
//line 294
case 71:
//line 295
im28=n.c_rt_lib.ov_mk_arg(c[17],im12);;
//line 295
im0=null;
//line 295
im1=null;
//line 295
im2=null;
//line 295
im4=null;
//line 295
bool10=null;
//line 295
im12=null;
//line 295
bool25=null;
//line 295
im27=null;
//line 295
return im28;
//line 296
label = 83; continue;
//line 296
case 83:
//line 296
bool25=null;
//line 296
im27=null;
//line 296
im28=null;
}}}

n.dfile_dbg.__dyn_try_sload_type=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.dfile_dbg.try_sload_type(arg0, arg1)
return ret;
}

function _prv__singleton_prv_fun_state_out() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 300
im2=n.ptd.string();
//line 300
im4=n.ptd.bool();
//line 300
im3=n.ptd.hash(im4);
//line 300
im4=null;
//line 300
im1=n.imm_hash({"str":im2,"objects":im3,});
//line 300
im2=null;
//line 300
im3=null;
//line 300
im0=n.ptd.rec(im1);
//line 300
im1=null;
//line 300
return im0;
//line 300
im0=null;
//line 300
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_state_out;
n.dfile_dbg.state_out=function() {
if (_singleton_val__prv__singleton_prv_fun_state_out===undefined) {
_singleton_val__prv__singleton_prv_fun_state_out=_prv__singleton_prv_fun_state_out();
}
return _singleton_val__prv__singleton_prv_fun_state_out;
}

n.dfile_dbg.__dyn_state_out=function(arr) {
var ret = n.dfile_dbg.state_out()
return ret;
}

function _prv_sp(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var string3=null;
var label=null;
while (1) { switch (label) {
default:
//line 304
im2=c[1];
//line 304
im2=n.c_rt_lib.get_ref_hash(im0,im2);
//line 304
im2=n.c_rt_lib.concat(im2,im1);;
//line 304
string3=c[1];
//line 304
var call_2_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_2_1,string3,im2);im0=call_2_1.value;call_2_1=null;
//line 304
im2=null;
//line 304
string3=null;
//line 304
im1=null;
//line 304
___arg__0.value = im0;return null;
}}}

function _prv_sprintstr(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
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
var label=null;
while (1) { switch (label) {
default:
//line 308
im2=c[0];
//line 308
im1=n.c_rt_lib.concat(im1,im2);;
//line 308
im2=null;
//line 309
im3=c[10];
//line 309
im4=c[54];
//line 309
im1=n.string.replace(im1,im3,im4);
//line 309
im3=null;
//line 309
im4=null;
//line 310
im5=c[55];
//line 310
im6=c[56];
//line 310
im1=n.string.replace(im1,im5,im6);
//line 310
im5=null;
//line 310
im6=null;
//line 311
im7=c[57];
//line 311
im8=c[58];
//line 311
im1=n.string.replace(im1,im7,im8);
//line 311
im7=null;
//line 311
im8=null;
//line 312
im9=c[8];
//line 312
im10=c[59];
//line 312
im1=n.string.replace(im1,im9,im10);
//line 312
im9=null;
//line 312
im10=null;
//line 313
im13=c[8];
//line 313
im12=n.c_rt_lib.concat(im13,im1);;
//line 313
im13=null;
//line 313
im14=c[8];
//line 313
im11=n.c_rt_lib.concat(im12,im14);;
//line 313
im12=null;
//line 313
im14=null;
//line 313
var call_7_1=new n.imm_ref(im0);_prv_sp(call_7_1,im11);im0=call_7_1.value;call_7_1=null;
//line 313
im11=null;
//line 313
im1=null;
//line 313
___arg__0.value = im0;return null;
}}}

function _prv_is_simple_string(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var int3=null;
var bool4=null;
var bool5=null;
var im6=null;
var int7=null;
var im8=null;
var int9=null;
var im10=null;
var im11=null;
var int12=null;
var im13=null;
var int14=null;
var im15=null;
var im16=null;
var bool17=null;
var int18=null;
var int19=null;
var bool20=null;
var im21=null;
var im22=null;
var int23=null;
var im24=null;
var bool25=null;
var im26=null;
var bool27=null;
var bool28=null;
var label=null;
while (1) { switch (label) {
default:
//line 317
int1=n.string.length(im0);
//line 318
int3=0;
//line 318
bool2=int1==int3;
//line 318
int3=null;
//line 318
bool2=!bool2
//line 318
if (bool2) {label = 12; continue;}
//line 318
bool4=false;
//line 318
im0=null;
//line 318
int1=null;
//line 318
bool2=null;
//line 318
return bool4;
//line 318
label = 12; continue;
//line 318
case 12:
//line 318
bool2=null;
//line 318
bool4=null;
//line 319
int7=0;
//line 319
im8=n.imm_int(int7)
//line 319
int9=1;
//line 319
im10=n.imm_int(int9)
//line 319
im6=n.string.substr(im0,im8,im10);
//line 319
int7=null;
//line 319
im8=null;
//line 319
int9=null;
//line 319
im10=null;
//line 319
bool5=n.string.is_letter(im6);
//line 319
im6=null;
//line 319
if (bool5) {label = 40; continue;}
//line 319
int12=0;
//line 319
im13=n.imm_int(int12)
//line 319
int14=1;
//line 319
im15=n.imm_int(int14)
//line 319
im11=n.string.substr(im0,im13,im15);
//line 319
int12=null;
//line 319
im13=null;
//line 319
int14=null;
//line 319
im15=null;
//line 319
im16=c[7];
//line 319
bool5=n.c_rt_lib.eq(im11, im16)
//line 319
im11=null;
//line 319
im16=null;
//line 319
case 40:
//line 319
bool5=!bool5
//line 319
bool5=!bool5
//line 319
if (bool5) {label = 50; continue;}
//line 319
bool17=false;
//line 319
im0=null;
//line 319
int1=null;
//line 319
bool5=null;
//line 319
return bool17;
//line 319
label = 50; continue;
//line 319
case 50:
//line 319
bool5=null;
//line 319
bool17=null;
//line 320
int18=0;
//line 320
int19=1;
//line 320
case 55:
//line 320
bool20=int18>=int1;
//line 320
if (bool20) {label = 93; continue;}
//line 321
im22=n.imm_int(int18)
//line 321
int23=1;
//line 321
im24=n.imm_int(int23)
//line 321
im21=n.string.substr(im0,im22,im24);
//line 321
im22=null;
//line 321
int23=null;
//line 321
im24=null;
//line 322
bool25=n.string.is_letter(im21);
//line 322
if (bool25) {label = 68; continue;}
//line 322
bool25=n.string.is_digit(im21);
//line 322
case 68:
//line 322
if (bool25) {label = 73; continue;}
//line 322
im26=c[7];
//line 322
bool25=n.c_rt_lib.eq(im21, im26)
//line 322
im26=null;
//line 322
case 73:
//line 322
bool25=!bool25
//line 322
bool25=!bool25
//line 322
if (bool25) {label = 87; continue;}
//line 322
bool27=false;
//line 322
im0=null;
//line 322
int1=null;
//line 322
int18=null;
//line 322
int19=null;
//line 322
bool20=null;
//line 322
im21=null;
//line 322
bool25=null;
//line 322
return bool27;
//line 322
label = 87; continue;
//line 322
case 87:
//line 322
bool25=null;
//line 322
bool27=null;
//line 322
im21=null;
//line 323
int18=Math.floor(int18+int19);
//line 323
label = 55; continue;
//line 323
case 93:
//line 324
bool28=true;
//line 324
im0=null;
//line 324
int1=null;
//line 324
int18=null;
//line 324
int19=null;
//line 324
bool20=null;
//line 324
im21=null;
//line 324
return bool28;
}}}

function _prv_sprint_hash_key(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 328
bool2=_prv_is_simple_string(im1);
//line 328
bool2=!bool2
//line 328
if (bool2) {label = 5; continue;}
//line 329
var call_1_1=new n.imm_ref(im0);_prv_sp(call_1_1,im1);im0=call_1_1.value;call_1_1=null;
//line 330
label = 8; continue;
//line 330
case 5:
//line 331
var call_2_1=new n.imm_ref(im0);_prv_sprintstr(call_2_1,im1);im0=call_2_1.value;call_2_1=null;
//line 332
label = 8; continue;
//line 332
case 8:
//line 332
bool2=null;
//line 332
im1=null;
//line 332
___arg__0.value = im0;return null;
}}}

function _prv_get_ind(___arg__0) {
var int0=___arg__0;
n.check_null(int0);
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 336
im2=n.string.tab();
//line 336
im3=n.imm_int(int0)
//line 336
im1=n.string.char_times(im2,im3);
//line 336
im2=null;
//line 336
im3=null;
//line 336
int0=null;
//line 336
return im1;
}}}

function _prv_sprint_hash(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=___arg__2;
n.check_null(int2);
var bool3=___arg__3;
n.check_null(bool3);
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var int9=null;
var int10=null;
var int11=null;
var bool12=null;
var im13=null;
var im14=null;
var im15=null;
var int16=null;
var int17=null;
var im18=null;
var int19=null;
var int20=null;
var im21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var label=null;
while (1) { switch (label) {
default:
//line 341
im5=c[24];
//line 341
im6=n.string.lf();
//line 341
im4=n.c_rt_lib.concat(im5,im6);;
//line 341
im5=null;
//line 341
im6=null;
//line 341
var call_2_1=new n.imm_ref(im0);_prv_sp(call_2_1,im4);im0=call_2_1.value;call_2_1=null;
//line 341
im4=null;
//line 342
im7=n.hash.keys(im1);
//line 343
var call_4_1=new n.imm_ref(im7);n.array.sort(call_4_1);im7=call_4_1.value;call_4_1=null;
//line 344
int9=0;
//line 344
int10=1;
//line 344
int11=n.c_rt_lib.array_len(im7);;
//line 344
case 12:
//line 344
bool12=int9>=int11;
//line 344
if (bool12) {label = 44; continue;}
//line 344
im13=im7.get_index(int9);
//line 344
im8=im13
//line 345
im14=n.hash.get_value(im1,im8);
//line 346
int17=1;
//line 346
int16=Math.floor(int2+int17);
//line 346
int17=null;
//line 346
im15=_prv_get_ind(int16);
//line 346
int16=null;
//line 346
var call_8_1=new n.imm_ref(im0);_prv_sp(call_8_1,im15);im0=call_8_1.value;call_8_1=null;
//line 346
im15=null;
//line 347
var call_9_1=new n.imm_ref(im0);_prv_sprint_hash_key(call_9_1,im8);im0=call_9_1.value;call_9_1=null;
//line 348
im18=c[60];
//line 348
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im18);im0=call_10_1.value;call_10_1=null;
//line 348
im18=null;
//line 349
int20=1;
//line 349
int19=Math.floor(int2+int20);
//line 349
int20=null;
//line 349
var call_11_1=new n.imm_ref(im0);_prv_sprint(call_11_1,im14,int19,bool3);im0=call_11_1.value;call_11_1=null;
//line 349
int19=null;
//line 350
im22=c[34];
//line 350
im23=n.string.lf();
//line 350
im21=n.c_rt_lib.concat(im22,im23);;
//line 350
im22=null;
//line 350
im23=null;
//line 350
var call_14_1=new n.imm_ref(im0);_prv_sp(call_14_1,im21);im0=call_14_1.value;call_14_1=null;
//line 350
im21=null;
//line 350
im8=null;
//line 351
int9=Math.floor(int9+int10);
//line 351
label = 12; continue;
//line 351
case 44:
//line 352
im25=_prv_get_ind(int2);
//line 352
im26=c[25];
//line 352
im24=n.c_rt_lib.concat(im25,im26);;
//line 352
im25=null;
//line 352
im26=null;
//line 352
var call_17_1=new n.imm_ref(im0);_prv_sp(call_17_1,im24);im0=call_17_1.value;call_17_1=null;
//line 352
im24=null;
//line 352
im1=null;
//line 352
int2=null;
//line 352
bool3=null;
//line 352
im7=null;
//line 352
im8=null;
//line 352
int9=null;
//line 352
int10=null;
//line 352
int11=null;
//line 352
bool12=null;
//line 352
im13=null;
//line 352
im14=null;
//line 352
___arg__0.value = im0;return null;
}}}

function _prv_handle_debug(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var bool7=null;
var im8=null;
var string9=null;
var bool10=null;
var label=null;
while (1) { switch (label) {
default:
//line 356
bool2=n.nl.is_hash(im1);
//line 356
if (bool2) {label = 3; continue;}
//line 356
bool2=n.nl.is_array(im1);
//line 356
case 3:
//line 356
bool3=!bool2
//line 356
if (bool3) {label = 9; continue;}
//line 356
im4=n.c_rt_lib.hash_get_value(im0,c[61]);;
//line 356
bool2=n.hash.has_key(im4,im1);
//line 356
im4=null;
//line 356
case 9:
//line 356
bool3=null;
//line 356
bool2=!bool2
//line 356
if (bool2) {label = 19; continue;}
//line 357
var call_4_1=new n.imm_ref(im0);_prv_sp(call_4_1,im1);im0=call_4_1.value;call_4_1=null;
//line 358
bool5=true;
//line 358
im1=null;
//line 358
bool2=null;
//line 358
___arg__0.value = im0;return bool5;
//line 359
label = 37; continue;
//line 359
case 19:
//line 360
im6=c[61];
//line 360
im6=n.c_rt_lib.get_ref_hash(im0,im6);
//line 360
bool7=true;
//line 360
im8=n.c_rt_lib.native_to_nl(bool7)
//line 360
var call_6_1=new n.imm_ref(im6);n.hash.set_value(call_6_1,im1,im8);im6=call_6_1.value;call_6_1=null;
//line 360
string9=c[61];
//line 360
var call_7_1=new n.imm_ref(im0);n.c_rt_lib.set_ref_hash(call_7_1,string9,im6);im0=call_7_1.value;call_7_1=null;
//line 360
im6=null;
//line 360
bool7=null;
//line 360
im8=null;
//line 360
string9=null;
//line 361
bool10=false;
//line 361
im1=null;
//line 361
bool2=null;
//line 361
bool5=null;
//line 361
___arg__0.value = im0;return bool10;
//line 362
label = 37; continue;
//line 362
case 37:
//line 362
bool2=null;
//line 362
bool5=null;
//line 362
bool10=null;
}}}

function _prv_sprint(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=___arg__2;
n.check_null(int2);
var bool3=___arg__3;
n.check_null(bool3);
var bool4=null;
var bool5=null;
var bool6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var int15=null;
var int16=null;
var int17=null;
var bool18=null;
var im19=null;
var im20=null;
var int21=null;
var int22=null;
var int23=null;
var int24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var im31=null;
var im32=null;
var bool33=null;
var im34=null;
var im35=null;
var im36=null;
var im37=null;
var im38=null;
var label=null;
while (1) { switch (label) {
default:
//line 367
bool4=bool3
//line 367
bool5=!bool4
//line 367
if (bool5) {label = 4; continue;}
//line 367
var call_0_1=new n.imm_ref(im0);bool4=_prv_handle_debug(call_0_1,im1);im0=call_0_1.value;call_0_1=null;
//line 367
case 4:
//line 367
bool5=null;
//line 367
bool4=!bool4
//line 367
if (bool4) {label = 14; continue;}
//line 367
im1=null;
//line 367
int2=null;
//line 367
bool3=null;
//line 367
bool4=null;
//line 367
___arg__0.value = im0;return null;
//line 367
label = 14; continue;
//line 367
case 14:
//line 367
bool4=null;
//line 368
bool6=n.nl.is_int(im1);
//line 368
bool6=!bool6
//line 368
if (bool6) {label = 27; continue;}
//line 369
im7=c[62];
//line 369
var call_2_1=new n.imm_ref(im0);_prv_sp(call_2_1,im7);im0=call_2_1.value;call_2_1=null;
//line 369
im7=null;
//line 370
var call_3_1=new n.imm_ref(im0);_prv_sprintstr(call_3_1,im1);im0=call_3_1.value;call_3_1=null;
//line 371
im8=c[49];
//line 371
var call_4_1=new n.imm_ref(im0);_prv_sp(call_4_1,im8);im0=call_4_1.value;call_4_1=null;
//line 371
im8=null;
//line 372
label = 127; continue;
//line 372
case 27:
//line 372
bool6=n.nl.is_string(im1);
//line 372
bool6=!bool6
//line 372
if (bool6) {label = 39; continue;}
//line 373
im9=c[63];
//line 373
var call_6_1=new n.imm_ref(im0);_prv_sp(call_6_1,im9);im0=call_6_1.value;call_6_1=null;
//line 373
im9=null;
//line 374
var call_7_1=new n.imm_ref(im0);_prv_sprintstr(call_7_1,im1);im0=call_7_1.value;call_7_1=null;
//line 375
im10=c[49];
//line 375
var call_8_1=new n.imm_ref(im0);_prv_sp(call_8_1,im10);im0=call_8_1.value;call_8_1=null;
//line 375
im10=null;
//line 376
label = 127; continue;
//line 376
case 39:
//line 376
bool6=n.nl.is_array(im1);
//line 376
bool6=!bool6
//line 376
if (bool6) {label = 89; continue;}
//line 377
im12=c[36];
//line 377
im13=n.string.lf();
//line 377
im11=n.c_rt_lib.concat(im12,im13);;
//line 377
im12=null;
//line 377
im13=null;
//line 377
var call_12_1=new n.imm_ref(im0);_prv_sp(call_12_1,im11);im0=call_12_1.value;call_12_1=null;
//line 377
im11=null;
//line 378
int15=0;
//line 378
int16=1;
//line 378
int17=n.c_rt_lib.array_len(im1);;
//line 378
case 53:
//line 378
bool18=int15>=int17;
//line 378
if (bool18) {label = 80; continue;}
//line 378
im19=im1.get_index(int15);
//line 378
im14=im19
//line 379
int22=1;
//line 379
int21=Math.floor(int2+int22);
//line 379
int22=null;
//line 379
im20=_prv_get_ind(int21);
//line 379
int21=null;
//line 379
var call_15_1=new n.imm_ref(im0);_prv_sp(call_15_1,im20);im0=call_15_1.value;call_15_1=null;
//line 379
im20=null;
//line 380
int24=1;
//line 380
int23=Math.floor(int2+int24);
//line 380
int24=null;
//line 380
var call_16_1=new n.imm_ref(im0);_prv_sprint(call_16_1,im14,int23,bool3);im0=call_16_1.value;call_16_1=null;
//line 380
int23=null;
//line 381
im26=c[34];
//line 381
im27=n.string.lf();
//line 381
im25=n.c_rt_lib.concat(im26,im27);;
//line 381
im26=null;
//line 381
im27=null;
//line 381
var call_19_1=new n.imm_ref(im0);_prv_sp(call_19_1,im25);im0=call_19_1.value;call_19_1=null;
//line 381
im25=null;
//line 381
im14=null;
//line 382
int15=Math.floor(int15+int16);
//line 382
label = 53; continue;
//line 382
case 80:
//line 383
im29=_prv_get_ind(int2);
//line 383
im30=c[37];
//line 383
im28=n.c_rt_lib.concat(im29,im30);;
//line 383
im29=null;
//line 383
im30=null;
//line 383
var call_22_1=new n.imm_ref(im0);_prv_sp(call_22_1,im28);im0=call_22_1.value;call_22_1=null;
//line 383
im28=null;
//line 384
label = 127; continue;
//line 384
case 89:
//line 384
bool6=n.nl.is_hash(im1);
//line 384
bool6=!bool6
//line 384
if (bool6) {label = 95; continue;}
//line 385
var call_24_1=new n.imm_ref(im0);_prv_sprint_hash(call_24_1,im1,int2,bool3);im0=call_24_1.value;call_24_1=null;
//line 386
label = 127; continue;
//line 386
case 95:
//line 386
bool6=n.nl.is_variant(im1);
//line 386
bool6=!bool6
//line 386
if (bool6) {label = 123; continue;}
//line 387
im31=c[4];
//line 387
var call_26_1=new n.imm_ref(im0);_prv_sp(call_26_1,im31);im0=call_26_1.value;call_26_1=null;
//line 387
im31=null;
//line 388
im32=n.ov.get_element(im1);
//line 388
var call_28_1=new n.imm_ref(im0);_prv_sprintstr(call_28_1,im32);im0=call_28_1.value;call_28_1=null;
//line 388
im32=null;
//line 389
im34=n.ov.has_value(im1);
//line 389
bool33=n.c_rt_lib.check_true_native(im34);;
//line 389
im34=null;
//line 389
bool33=!bool33
//line 389
if (bool33) {label = 117; continue;}
//line 390
im35=c[64];
//line 390
var call_31_1=new n.imm_ref(im0);_prv_sp(call_31_1,im35);im0=call_31_1.value;call_31_1=null;
//line 390
im35=null;
//line 391
im36=n.ov.get_value(im1);
//line 391
var call_33_1=new n.imm_ref(im0);_prv_sprint(call_33_1,im36,int2,bool3);im0=call_33_1.value;call_33_1=null;
//line 391
im36=null;
//line 392
label = 117; continue;
//line 392
case 117:
//line 392
bool33=null;
//line 393
im37=c[49];
//line 393
var call_34_1=new n.imm_ref(im0);_prv_sp(call_34_1,im37);im0=call_34_1.value;call_34_1=null;
//line 393
im37=null;
//line 394
label = 127; continue;
//line 394
case 123:
//line 395
im38=n.imm_arr([]);
//line 395
n.nl_die();
//line 396
label = 127; continue;
//line 396
case 127:
//line 396
bool6=null;
//line 396
im14=null;
//line 396
int15=null;
//line 396
int16=null;
//line 396
int17=null;
//line 396
bool18=null;
//line 396
im19=null;
//line 396
im38=null;
//line 396
im1=null;
//line 396
int2=null;
//line 396
bool3=null;
//line 396
___arg__0.value = im0;return null;
}}}

function _prv_print_net_formatstr(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
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
var label=null;
while (1) { switch (label) {
default:
//line 400
im2=c[0];
//line 400
im1=n.c_rt_lib.concat(im1,im2);;
//line 400
im2=null;
//line 401
im3=c[10];
//line 401
im4=c[54];
//line 401
im1=n.string.replace(im1,im3,im4);
//line 401
im3=null;
//line 401
im4=null;
//line 402
im5=n.string.lf();
//line 402
im6=c[65];
//line 402
im1=n.string.replace(im1,im5,im6);
//line 402
im5=null;
//line 402
im6=null;
//line 403
im7=c[55];
//line 403
im8=c[56];
//line 403
im1=n.string.replace(im1,im7,im8);
//line 403
im7=null;
//line 403
im8=null;
//line 404
im9=c[57];
//line 404
im10=c[58];
//line 404
im1=n.string.replace(im1,im9,im10);
//line 404
im9=null;
//line 404
im10=null;
//line 405
im11=c[8];
//line 405
im12=c[59];
//line 405
im1=n.string.replace(im1,im11,im12);
//line 405
im11=null;
//line 405
im12=null;
//line 406
im15=c[8];
//line 406
im14=n.c_rt_lib.concat(im15,im1);;
//line 406
im15=null;
//line 406
im16=c[8];
//line 406
im13=n.c_rt_lib.concat(im14,im16);;
//line 406
im14=null;
//line 406
im16=null;
//line 406
var call_9_1=new n.imm_ref(im0);_prv_sp(call_9_1,im13);im0=call_9_1.value;call_9_1=null;
//line 406
im13=null;
//line 406
im1=null;
//line 406
___arg__0.value = im0;return null;
}}}

function _prv_print_net_format(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var int5=null;
var int6=null;
var int7=null;
var bool8=null;
var im9=null;
var im10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var int15=null;
var int16=null;
var int17=null;
var bool18=null;
var im19=null;
var im20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var bool29=null;
var im30=null;
var im31=null;
var im32=null;
var im33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 410
bool2=n.nl.is_int(im1);
//line 410
if (bool2) {label = 3; continue;}
//line 410
bool2=n.nl.is_string(im1);
//line 410
case 3:
//line 410
bool2=!bool2
//line 410
if (bool2) {label = 8; continue;}
//line 411
var call_2_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_2_1,im1);im0=call_2_1.value;call_2_1=null;
//line 412
label = 113; continue;
//line 412
case 8:
//line 412
bool2=n.nl.is_array(im1);
//line 412
bool2=!bool2
//line 412
if (bool2) {label = 35; continue;}
//line 413
im3=c[36];
//line 413
var call_4_1=new n.imm_ref(im0);_prv_sp(call_4_1,im3);im0=call_4_1.value;call_4_1=null;
//line 413
im3=null;
//line 414
int5=0;
//line 414
int6=1;
//line 414
int7=n.c_rt_lib.array_len(im1);;
//line 414
case 18:
//line 414
bool8=int5>=int7;
//line 414
if (bool8) {label = 30; continue;}
//line 414
im9=im1.get_index(int5);
//line 414
im4=im9
//line 415
var call_6_1=new n.imm_ref(im0);_prv_print_net_format(call_6_1,im4);im0=call_6_1.value;call_6_1=null;
//line 416
im10=c[34];
//line 416
var call_7_1=new n.imm_ref(im0);_prv_sp(call_7_1,im10);im0=call_7_1.value;call_7_1=null;
//line 416
im10=null;
//line 416
im4=null;
//line 417
int5=Math.floor(int5+int6);
//line 417
label = 18; continue;
//line 417
case 30:
//line 418
im11=c[37];
//line 418
var call_8_1=new n.imm_ref(im0);_prv_sp(call_8_1,im11);im0=call_8_1.value;call_8_1=null;
//line 418
im11=null;
//line 419
label = 113; continue;
//line 419
case 35:
//line 419
bool2=n.nl.is_hash(im1);
//line 419
bool2=!bool2
//line 419
if (bool2) {label = 81; continue;}
//line 420
im12=c[24];
//line 420
var call_10_1=new n.imm_ref(im0);_prv_sp(call_10_1,im12);im0=call_10_1.value;call_10_1=null;
//line 420
im12=null;
//line 421
im13=n.hash.keys(im1);
//line 421
int15=0;
//line 421
int16=1;
//line 421
int17=n.c_rt_lib.array_len(im13);;
//line 421
case 46:
//line 421
bool18=int15>=int17;
//line 421
if (bool18) {label = 76; continue;}
//line 421
im19=im13.get_index(int15);
//line 421
im14=im19
//line 422
im20=n.hash.get_value(im1,im14);
//line 423
im23=c[0];
//line 423
im22=n.c_rt_lib.concat(im14,im23);;
//line 423
im23=null;
//line 423
bool21=_prv_is_simple_string(im22);
//line 423
im22=null;
//line 423
bool21=!bool21
//line 423
if (bool21) {label = 61; continue;}
//line 424
var call_16_1=new n.imm_ref(im0);_prv_sp(call_16_1,im14);im0=call_16_1.value;call_16_1=null;
//line 425
label = 64; continue;
//line 425
case 61:
//line 426
var call_17_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_17_1,im14);im0=call_17_1.value;call_17_1=null;
//line 427
label = 64; continue;
//line 427
case 64:
//line 427
bool21=null;
//line 428
im24=c[26];
//line 428
var call_18_1=new n.imm_ref(im0);_prv_sp(call_18_1,im24);im0=call_18_1.value;call_18_1=null;
//line 428
im24=null;
//line 429
var call_19_1=new n.imm_ref(im0);_prv_print_net_format(call_19_1,im20);im0=call_19_1.value;call_19_1=null;
//line 430
im25=c[34];
//line 430
var call_20_1=new n.imm_ref(im0);_prv_sp(call_20_1,im25);im0=call_20_1.value;call_20_1=null;
//line 430
im25=null;
//line 430
im14=null;
//line 431
int15=Math.floor(int15+int16);
//line 431
label = 46; continue;
//line 431
case 76:
//line 432
im26=c[25];
//line 432
var call_21_1=new n.imm_ref(im0);_prv_sp(call_21_1,im26);im0=call_21_1.value;call_21_1=null;
//line 432
im26=null;
//line 433
label = 113; continue;
//line 433
case 81:
//line 433
bool2=n.nl.is_variant(im1);
//line 433
bool2=!bool2
//line 433
if (bool2) {label = 109; continue;}
//line 434
im27=c[4];
//line 434
var call_23_1=new n.imm_ref(im0);_prv_sp(call_23_1,im27);im0=call_23_1.value;call_23_1=null;
//line 434
im27=null;
//line 435
im28=n.ov.get_element(im1);
//line 435
var call_25_1=new n.imm_ref(im0);_prv_print_net_formatstr(call_25_1,im28);im0=call_25_1.value;call_25_1=null;
//line 435
im28=null;
//line 436
im30=n.ov.has_value(im1);
//line 436
bool29=n.c_rt_lib.check_true_native(im30);;
//line 436
im30=null;
//line 436
bool29=!bool29
//line 436
if (bool29) {label = 103; continue;}
//line 437
im31=c[34];
//line 437
var call_28_1=new n.imm_ref(im0);_prv_sp(call_28_1,im31);im0=call_28_1.value;call_28_1=null;
//line 437
im31=null;
//line 438
im32=n.ov.get_value(im1);
//line 438
var call_30_1=new n.imm_ref(im0);_prv_print_net_format(call_30_1,im32);im0=call_30_1.value;call_30_1=null;
//line 438
im32=null;
//line 439
label = 103; continue;
//line 439
case 103:
//line 439
bool29=null;
//line 440
im33=c[49];
//line 440
var call_31_1=new n.imm_ref(im0);_prv_sp(call_31_1,im33);im0=call_31_1.value;call_31_1=null;
//line 440
im33=null;
//line 441
label = 113; continue;
//line 441
case 109:
//line 442
im34=n.imm_arr([im1,]);
//line 442
n.nl_die();
//line 443
label = 113; continue;
//line 443
case 113:
//line 443
bool2=null;
//line 443
im4=null;
//line 443
int5=null;
//line 443
int6=null;
//line 443
int7=null;
//line 443
bool8=null;
//line 443
im9=null;
//line 443
im13=null;
//line 443
im14=null;
//line 443
int15=null;
//line 443
int16=null;
//line 443
int17=null;
//line 443
bool18=null;
//line 443
im19=null;
//line 443
im20=null;
//line 443
im34=null;
//line 443
im1=null;
//line 443
___arg__0.value = im0;return null;
}}}
var c=[];
c[0] = n.imm_str("");c[1] = n.imm_str("str");c[2] = n.imm_str("pos");c[3] = n.imm_str("len");c[4] = n.imm_str("ov::mk(");c[5] = n.imm_str("pos ");c[6] = n.imm_str(": expected scalar");c[7] = n.imm_str("_");c[8] = n.imm_str("\"");c[9] = n.imm_str(": expected \"");c[10] = n.imm_str("\\");c[11] = n.imm_str("n");c[12] = n.imm_str("r");c[13] = n.imm_str("t");c[14] = n.imm_str("ptd_string");c[15] = n.imm_str("ptd_im");c[16] = n.imm_str("ptd_int");c[17] = n.imm_str("ok");c[18] = n.imm_str("err");c[19] = n.imm_str("NOMATCHALERT");c[20] = n.imm_str("incorrect number");c[21] = n.imm_str("expected ");c[22] = n.imm_str(", got scalar");c[23] = n.imm_str("ref");c[24] = n.imm_str("{");c[25] = n.imm_str("}");c[26] = n.imm_str("=>");c[27] = n.imm_str(": expected =>");c[28] = n.imm_str("ptd_rec");c[29] = n.imm_str("unexpected hash key ");c[30] = n.imm_str("ptd_hash");c[31] = n.imm_ov_js_str("ptd_im",null);c[32] = n.imm_str(", got ");c[33] = n.imm_ov_js_str("ptd_hash",null);c[34] = n.imm_str(",");c[35] = n.imm_str(": expected ,");c[36] = n.imm_str("[");c[37] = n.imm_str("]");c[38] = n.imm_str("ptd_arr");c[39] = n.imm_ov_js_str("ptd_im",null);c[40] = n.imm_ov_js_str("ptd_hash",null);c[41] = n.imm_str("o");c[42] = n.imm_str("ptd_var");c[43] = n.imm_str("with_param");c[44] = n.imm_str("no_param");c[45] = n.imm_str("unexpected variant value");c[46] = n.imm_str("unexpected variant label ");c[47] = n.imm_ov_js_str("ptd_im",null);c[48] = n.imm_ov_js_str("ptd_hash",null);c[49] = n.imm_str(")");c[50] = n.imm_str(": expected )");c[51] = n.imm_str("ensure");c[52] = n.imm_str("use utf8;");c[53] = n.imm_str(": expected eof");c[54] = n.imm_str("\\\\");c[55] = n.imm_str("$");c[56] = n.imm_str("\\$");c[57] = n.imm_str("@");c[58] = n.imm_str("\\@");c[59] = n.imm_str("\\\"");c[60] = n.imm_str(" => ");c[61] = n.imm_str("objects");c[62] = n.imm_str("int(");c[63] = n.imm_str("string(");c[64] = n.imm_str(", ");c[65] = n.imm_str("\\n");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.enum={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.enum.eq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var im5=null;
var bool6=null;
var im7=null;
var im8=null;
var label=null;
while (1) { switch (label) {
default:
//line 10
im3=n.ov.has_value(im0);
//line 10
bool2=n.c_rt_lib.check_true_native(im3);;
//line 10
im3=null;
//line 10
if (bool2) {label = 7; continue;}
//line 10
im4=n.ov.has_value(im1);
//line 10
bool2=n.c_rt_lib.check_true_native(im4);;
//line 10
im4=null;
//line 10
case 7:
//line 10
bool2=!bool2
//line 10
if (bool2) {label = 13; continue;}
//line 10
im5=n.imm_arr([]);
//line 10
n.nl_die();
//line 10
label = 13; continue;
//line 10
case 13:
//line 10
bool2=null;
//line 10
im5=null;
//line 11
im7=n.ov.get_element(im0);
//line 11
im8=n.ov.get_element(im1);
//line 11
bool6=n.c_rt_lib.eq(im7, im8)
//line 11
im7=null;
//line 11
im8=null;
//line 11
im0=null;
//line 11
im1=null;
//line 11
return bool6;
}}}

n.enum.__dyn_eq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.enum.eq(arg0, arg1))
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.float={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.float.add=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 10
im3=n.ptd.string();
//line 10
im4=n.c_rt_lib.str_float_add(im0,im1);
//line 10
im2=n.ptd.ensure(im3,im4);
//line 10
im3=null;
//line 10
im4=null;
//line 10
im0=null;
//line 10
im1=null;
//line 10
return im2;
}}}

n.float.__dyn_add=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.float.add(arg0, arg1)
return ret;
}

n.float.mul=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 14
im3=n.ptd.string();
//line 14
im4=n.c_rt_lib.str_float_mul(im0,im1);
//line 14
im2=n.ptd.ensure(im3,im4);
//line 14
im3=null;
//line 14
im4=null;
//line 14
im0=null;
//line 14
im1=null;
//line 14
return im2;
}}}

n.float.__dyn_mul=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.float.mul(arg0, arg1)
return ret;
}

n.float.sub=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 18
im3=n.ptd.string();
//line 18
im4=n.c_rt_lib.str_float_sub(im0,im1);
//line 18
im2=n.ptd.ensure(im3,im4);
//line 18
im3=null;
//line 18
im4=null;
//line 18
im0=null;
//line 18
im1=null;
//line 18
return im2;
}}}

n.float.__dyn_sub=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.float.sub(arg0, arg1)
return ret;
}

n.float.div=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 22
im3=n.ptd.string();
//line 22
im4=n.c_rt_lib.str_float_div(im0,im1);
//line 22
im2=n.ptd.ensure(im3,im4);
//line 22
im3=null;
//line 22
im4=null;
//line 22
im0=null;
//line 22
im1=null;
//line 22
return im2;
}}}

n.float.__dyn_div=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.float.div(arg0, arg1)
return ret;
}

n.float.mod=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 26
im3=n.ptd.string();
//line 26
im4=n.c_rt_lib.str_float_mod(im0,im1);
//line 26
im2=n.ptd.ensure(im3,im4);
//line 26
im3=null;
//line 26
im4=null;
//line 26
im0=null;
//line 26
im1=null;
//line 26
return im2;
}}}

n.float.__dyn_mod=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.float.mod(arg0, arg1)
return ret;
}

n.float.eq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 30
bool2=n.c_rt_lib.str_float_eq(im0,im1);
//line 30
im0=null;
//line 30
im1=null;
//line 30
return bool2;
}}}

n.float.__dyn_eq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.eq(arg0, arg1))
return ret;
}

n.float.ne=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 34
bool2=n.c_rt_lib.str_float_ne(im0,im1);
//line 34
im0=null;
//line 34
im1=null;
//line 34
return bool2;
}}}

n.float.__dyn_ne=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.ne(arg0, arg1))
return ret;
}

n.float.gt=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 38
bool2=n.c_rt_lib.str_float_gt(im0,im1);
//line 38
im0=null;
//line 38
im1=null;
//line 38
return bool2;
}}}

n.float.__dyn_gt=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.gt(arg0, arg1))
return ret;
}

n.float.lt=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 42
bool2=n.c_rt_lib.str_float_lt(im0,im1);
//line 42
im0=null;
//line 42
im1=null;
//line 42
return bool2;
}}}

n.float.__dyn_lt=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.lt(arg0, arg1))
return ret;
}

n.float.geq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 46
bool2=n.c_rt_lib.str_float_geq(im0,im1);
//line 46
im0=null;
//line 46
im1=null;
//line 46
return bool2;
}}}

n.float.__dyn_geq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.geq(arg0, arg1))
return ret;
}

n.float.leq=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 50
bool2=n.c_rt_lib.str_float_leq(im0,im1);
//line 50
im0=null;
//line 50
im1=null;
//line 50
return bool2;
}}}

n.float.__dyn_leq=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.float.leq(arg0, arg1))
return ret;
}

n.float.round=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 54
im2=n.ptd.string();
//line 54
im3=n.c_rt_lib.float_round(im0);
//line 54
im1=n.ptd.ensure(im2,im3);
//line 54
im2=null;
//line 54
im3=null;
//line 54
im0=null;
//line 54
return im1;
}}}

n.float.__dyn_round=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.float.round(arg0)
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.func={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.func.func_t=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 13
im4=n.ptd.string();
//line 14
im5=n.ptd.string();
//line 14
im3=n.imm_hash({"module":im4,"name":im5,});
//line 14
im4=null;
//line 14
im5=null;
//line 14
im2=n.ptd.rec(im3);
//line 14
im3=null;
//line 14
im1=n.imm_hash({"ref":im2,});
//line 14
im2=null;
//line 14
im0=n.ptd.var(im1);
//line 14
im1=null;
//line 14
return im0;
//line 14
im0=null;
//line 14
return null;
}}}

n.func.__dyn_func_t=function(arr) {
var ret = n.func.func_t()
return ret;
}

n.func.exec=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 20
var call_0_2=new n.imm_ref(im1);im2=n.c_std_lib.exec(im0,call_0_2);im1=call_0_2.value;call_0_2=null;
//line 20
im0=null;
//line 20
im1=null;
//line 20
return im2;
//line 20
im0=null;
//line 20
im1=null;
//line 20
im2=null;
//line 20
return null;
}}}

n.func.__dyn_exec=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.func.exec(arg0, arg1)
return ret;
}

n.func.exec_ref=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 24
var call_0_2=new n.imm_ref(im1);im2=n.c_std_lib.exec(im0,call_0_2);im1=call_0_2.value;call_0_2=null;
//line 24
im0=null;
//line 24
___arg__1.value = im1;return im2;
//line 24
im0=null;
//line 24
im2=null;
//line 24
___arg__1.value = im1;return null;
}}}

n.func.__dyn_exec_ref=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=new n.imm_ref(arr.value.get_index(1));;
var ret = n.func.exec_ref(arg0, arg1)
arr.value = arr.value.set_index(1, arg1.value);
return ret;
}

n.func.exec_with_ref_arg=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2.value;
n.check_null(im2);
var im3=null;
var int4=null;
var int5=null;
var int6=null;
var label=null;
while (1) { switch (label) {
default:
//line 28
var call_0_1=new n.imm_ref(im1);n.array.push(call_0_1,im2);im1=call_0_1.value;call_0_1=null;
//line 29
im2=c[0];
//line 30
var call_1_2=new n.imm_ref(im1);im3=n.func.exec_ref(im0,call_1_2);im1=call_1_2.value;call_1_2=null;
//line 31
int5=n.c_rt_lib.array_len(im1);;
//line 31
int6=1;
//line 31
int4=Math.floor(int5-int6);
//line 31
int5=null;
//line 31
int6=null;
//line 31
im2=im1.get_index(int4);
//line 31
int4=null;
//line 32
im0=null;
//line 32
im1=null;
//line 32
___arg__2.value = im2;return im3;
//line 32
im0=null;
//line 32
im1=null;
//line 32
im3=null;
//line 32
___arg__2.value = im2;return null;
}}}

n.func.__dyn_exec_with_ref_arg=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=new n.imm_ref(arr.value.get_index(2));;
var ret = n.func.exec_with_ref_arg(arg0, arg1, arg2)
arr.value = arr.value.set_index(2, arg2.value);
return ret;
}
var c=[];
c[0] = n.imm_int(0);})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.hash={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.hash.get_value=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 9
im2=n.c_std_lib.hash_get_value(im0,im1);
//line 9
im0=null;
//line 9
im1=null;
//line 9
return im2;
//line 9
im0=null;
//line 9
im1=null;
//line 9
im2=null;
//line 9
return null;
}}}

n.hash.__dyn_get_value=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.hash.get_value(arg0, arg1)
return ret;
}

n.hash.has_key=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 13
bool2=n.c_std_lib.hash_has_key(im0,im1);
//line 13
im0=null;
//line 13
im1=null;
//line 13
return bool2;
//line 13
im0=null;
//line 13
im1=null;
//line 13
bool2=null;
//line 13
return null;
}}}

n.hash.__dyn_has_key=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.hash.has_key(arg0, arg1))
return ret;
}

n.hash.set_value=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var label=null;
while (1) { switch (label) {
default:
//line 17
var call_0_1=new n.imm_ref(im0);n.c_std_lib.hash_set_value(call_0_1,im1,im2);im0=call_0_1.value;call_0_1=null;
//line 17
im1=null;
//line 17
im2=null;
//line 17
___arg__0.value = im0;return null;
}}}

n.hash.__dyn_set_value=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.hash.set_value(arg0, arg1, arg2)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.hash.delete=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var label=null;
while (1) { switch (label) {
default:
//line 21
var call_0_1=new n.imm_ref(im0);n.c_std_lib.hash_delete(call_0_1,im1);im0=call_0_1.value;call_0_1=null;
//line 21
im1=null;
//line 21
___arg__0.value = im0;return null;
}}}

n.hash.__dyn_delete=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.hash.delete(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.hash.size=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var label=null;
while (1) { switch (label) {
default:
//line 25
int1=n.c_std_lib.hash_size(im0);
//line 25
im0=null;
//line 25
return int1;
//line 25
im0=null;
//line 25
int1=null;
//line 25
return null;
}}}

n.hash.__dyn_size=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.imm_int(n.hash.size(arg0))
return ret;
}

n.hash.keys=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 29
im1=n.imm_arr([]);
//line 30
im5=n.c_rt_lib.init_iter(im0);;
//line 30
case 2:
//line 30
bool3=n.c_rt_lib.is_end_hash(im5);;
//line 30
if (bool3) {label = 10; continue;}
//line 30
im2=n.c_rt_lib.get_key_iter(im5);;
//line 30
im4=n.c_rt_lib.hash_get_value(im0,im2);
//line 31
var call_4_1=new n.imm_ref(im1);n.c_std_lib.array_push(call_4_1,im2);im1=call_4_1.value;call_4_1=null;
//line 32
im5=n.c_rt_lib.next_iter(im5);;
//line 32
label = 2; continue;
//line 32
case 10:
//line 33
im0=null;
//line 33
im2=null;
//line 33
bool3=null;
//line 33
im4=null;
//line 33
im5=null;
//line 33
return im1;
//line 33
im0=null;
//line 33
im1=null;
//line 33
im2=null;
//line 33
bool3=null;
//line 33
im4=null;
//line 33
im5=null;
//line 33
return null;
}}}

n.hash.__dyn_keys=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.hash.keys(arg0)
return ret;
}

n.hash.values=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 37
im1=n.imm_arr([]);
//line 38
im5=n.c_rt_lib.init_iter(im0);;
//line 38
case 2:
//line 38
bool3=n.c_rt_lib.is_end_hash(im5);;
//line 38
if (bool3) {label = 10; continue;}
//line 38
im2=n.c_rt_lib.get_key_iter(im5);;
//line 38
im4=n.c_rt_lib.hash_get_value(im0,im2);
//line 39
var call_4_1=new n.imm_ref(im1);n.c_std_lib.array_push(call_4_1,im4);im1=call_4_1.value;call_4_1=null;
//line 40
im5=n.c_rt_lib.next_iter(im5);;
//line 40
label = 2; continue;
//line 40
case 10:
//line 41
im0=null;
//line 41
im2=null;
//line 41
bool3=null;
//line 41
im4=null;
//line 41
im5=null;
//line 41
return im1;
//line 41
im0=null;
//line 41
im1=null;
//line 41
im2=null;
//line 41
bool3=null;
//line 41
im4=null;
//line 41
im5=null;
//line 41
return null;
}}}

n.hash.__dyn_values=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.hash.values(arg0)
return ret;
}

n.hash.merge=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 45
im2=im0
//line 46
var call_0_1=new n.imm_ref(im2);n.hash.add_all(call_0_1,im1);im2=call_0_1.value;call_0_1=null;
//line 47
im0=null;
//line 47
im1=null;
//line 47
return im2;
//line 47
im0=null;
//line 47
im1=null;
//line 47
im2=null;
//line 47
return null;
}}}

n.hash.__dyn_merge=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.hash.merge(arg0, arg1)
return ret;
}

n.hash.add_all=function(___arg__0, ___arg__1) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 51
im5=n.c_rt_lib.init_iter(im1);;
//line 51
case 1:
//line 51
bool3=n.c_rt_lib.is_end_hash(im5);;
//line 51
if (bool3) {label = 9; continue;}
//line 51
im2=n.c_rt_lib.get_key_iter(im5);;
//line 51
im4=n.c_rt_lib.hash_get_value(im1,im2);
//line 51
var call_4_1=new n.imm_ref(im0);n.hash.set_value(call_4_1,im2,im4);im0=call_4_1.value;call_4_1=null;
//line 51
im5=n.c_rt_lib.next_iter(im5);;
//line 51
label = 1; continue;
//line 51
case 9:
//line 51
im1=null;
//line 51
im2=null;
//line 51
bool3=null;
//line 51
im4=null;
//line 51
im5=null;
//line 51
___arg__0.value = im0;return null;
}}}

n.hash.__dyn_add_all=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var ret = n.hash.add_all(arg0, arg1)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.hash.set2keys=function(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3;
n.check_null(im3);
var im4=null;
var bool5=null;
var int6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 55
bool5=n.hash.has_key(im0,im1);
//line 55
if (bool5) {label = 4; continue;}
//line 55
im4=n.imm_hash({});
//line 55
label = 6; continue;
//line 55
case 4:
//line 55
im4=n.hash.get_value(im0,im1);
//line 55
case 6:
//line 55
bool5=null;
//line 56
int6=0;
//line 56
im7=n.imm_int(int6)
//line 56
var call_2_1=new n.imm_ref(im0);n.hash.set_value(call_2_1,im1,im7);im0=call_2_1.value;call_2_1=null;
//line 56
int6=null;
//line 56
im7=null;
//line 57
var call_3_1=new n.imm_ref(im4);n.hash.set_value(call_3_1,im2,im3);im4=call_3_1.value;call_3_1=null;
//line 58
var call_4_1=new n.imm_ref(im0);n.hash.set_value(call_4_1,im1,im4);im0=call_4_1.value;call_4_1=null;
//line 58
im1=null;
//line 58
im2=null;
//line 58
im3=null;
//line 58
im4=null;
//line 58
___arg__0.value = im0;return null;
}}}

n.hash.__dyn_set2keys=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var arg3=arr.value.get_index(3);
var ret = n.hash.set2keys(arg0, arg1, arg2, arg3)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}

n.hash.has2keys=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var bool3=null;
var bool4=null;
var im5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 62
bool3=n.hash.has_key(im0,im1);
//line 62
bool4=!bool3
//line 62
if (bool4) {label = 6; continue;}
//line 62
im5=n.hash.get_value(im0,im1);
//line 62
bool3=n.hash.has_key(im5,im2);
//line 62
im5=null;
//line 62
case 6:
//line 62
bool4=null;
//line 62
im6=n.c_rt_lib.native_to_nl(bool3)
//line 62
im0=null;
//line 62
im1=null;
//line 62
im2=null;
//line 62
bool3=null;
//line 62
return im6;
//line 62
im0=null;
//line 62
im1=null;
//line 62
im2=null;
//line 62
bool3=null;
//line 62
im6=null;
//line 62
return null;
}}}

n.hash.__dyn_has2keys=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.hash.has2keys(arg0, arg1, arg2)
return ret;
}

n.hash.get2keys=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 66
im4=n.hash.get_value(im0,im1);
//line 66
im3=n.hash.get_value(im4,im2);
//line 66
im4=null;
//line 66
im0=null;
//line 66
im1=null;
//line 66
im2=null;
//line 66
return im3;
//line 66
im0=null;
//line 66
im1=null;
//line 66
im2=null;
//line 66
im3=null;
//line 66
return null;
}}}

n.hash.__dyn_get2keys=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.hash.get2keys(arg0, arg1, arg2)
return ret;
}

n.hash.set3keys=function(___arg__0, ___arg__1, ___arg__2, ___arg__3, ___arg__4) {
var im0=___arg__0.value;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3;
n.check_null(im3);
var im4=___arg__4;
n.check_null(im4);
var im5=null;
var bool6=null;
var int7=null;
var im8=null;
var label=null;
while (1) { switch (label) {
default:
//line 70
bool6=n.hash.has_key(im0,im1);
//line 70
if (bool6) {label = 4; continue;}
//line 70
im5=n.imm_hash({});
//line 70
label = 6; continue;
//line 70
case 4:
//line 70
im5=n.hash.get_value(im0,im1);
//line 70
case 6:
//line 70
bool6=null;
//line 71
int7=0;
//line 71
im8=n.imm_int(int7)
//line 71
var call_2_1=new n.imm_ref(im0);n.hash.set_value(call_2_1,im1,im8);im0=call_2_1.value;call_2_1=null;
//line 71
int7=null;
//line 71
im8=null;
//line 72
var call_3_1=new n.imm_ref(im5);n.hash.set2keys(call_3_1,im2,im3,im4);im5=call_3_1.value;call_3_1=null;
//line 73
var call_4_1=new n.imm_ref(im0);n.hash.set_value(call_4_1,im1,im5);im0=call_4_1.value;call_4_1=null;
//line 73
im1=null;
//line 73
im2=null;
//line 73
im3=null;
//line 73
im4=null;
//line 73
im5=null;
//line 73
___arg__0.value = im0;return null;
}}}

n.hash.__dyn_set3keys=function(arr) {
var arg0=new n.imm_ref(arr.value.get_index(0));;
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var arg3=arr.value.get_index(3);
var arg4=arr.value.get_index(4);
var ret = n.hash.set3keys(arg0, arg1, arg2, arg3, arg4)
arr.value = arr.value.set_index(0, arg0.value);
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.nl={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.nl.is_array=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 10
bool2=n.c_std_lib.is_array(im0);
//line 10
if (bool2) {label = 4; continue;}
//line 10
bool1=false;
//line 10
label = 6; continue;
//line 10
case 4:
//line 10
bool1=true;
//line 10
case 6:
//line 10
bool2=null;
//line 10
im0=null;
//line 10
return bool1;
}}}

n.nl.__dyn_is_array=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_array(arg0))
return ret;
}

n.nl.is_hash=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 14
bool2=n.c_std_lib.is_hash(im0);
//line 14
if (bool2) {label = 4; continue;}
//line 14
bool1=false;
//line 14
label = 6; continue;
//line 14
case 4:
//line 14
bool1=true;
//line 14
case 6:
//line 14
bool2=null;
//line 14
im0=null;
//line 14
return bool1;
}}}

n.nl.__dyn_is_hash=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_hash(arg0))
return ret;
}

n.nl.is_int=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 18
bool2=n.c_std_lib.is_int(im0);
//line 18
if (bool2) {label = 4; continue;}
//line 18
bool1=false;
//line 18
label = 6; continue;
//line 18
case 4:
//line 18
bool1=true;
//line 18
case 6:
//line 18
bool2=null;
//line 18
im0=null;
//line 18
return bool1;
}}}

n.nl.__dyn_is_int=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_int(arg0))
return ret;
}

n.nl.is_string=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 22
bool2=n.c_std_lib.is_string(im0);
//line 22
if (bool2) {label = 4; continue;}
//line 22
bool1=false;
//line 22
label = 6; continue;
//line 22
case 4:
//line 22
bool1=true;
//line 22
case 6:
//line 22
bool2=null;
//line 22
im0=null;
//line 22
return bool1;
}}}

n.nl.__dyn_is_string=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_string(arg0))
return ret;
}

n.nl.is_printable=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 26
bool2=n.c_std_lib.is_printable(im0);
//line 26
if (bool2) {label = 4; continue;}
//line 26
bool1=false;
//line 26
label = 6; continue;
//line 26
case 4:
//line 26
bool1=true;
//line 26
case 6:
//line 26
bool2=null;
//line 26
im0=null;
//line 26
return bool1;
}}}

n.nl.__dyn_is_printable=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_printable(arg0))
return ret;
}

n.nl.is_variant=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 30
bool2=n.c_std_lib.is_variant(im0);
//line 30
if (bool2) {label = 4; continue;}
//line 30
bool1=false;
//line 30
label = 6; continue;
//line 30
case 4:
//line 30
bool1=true;
//line 30
case 6:
//line 30
bool2=null;
//line 30
im0=null;
//line 30
return bool1;
}}}

n.nl.__dyn_is_variant=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_variant(arg0))
return ret;
}

n.nl.is_bool=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 34
bool1=n.c_std_lib.is_variant(im0);
//line 34
bool2=!bool1
//line 34
if (bool2) {label = 14; continue;}
//line 35
im3=n.ov.get_element(im0);
//line 35
im4=c[0];
//line 35
bool1=n.c_rt_lib.eq(im3, im4)
//line 35
im3=null;
//line 35
im4=null;
//line 35
if (bool1) {label = 14; continue;}
//line 35
im5=n.ov.get_element(im0);
//line 35
im6=c[1];
//line 35
bool1=n.c_rt_lib.eq(im5, im6)
//line 35
im5=null;
//line 35
im6=null;
//line 35
case 14:
//line 35
bool2=null;
//line 35
im0=null;
//line 35
return bool1;
}}}

n.nl.__dyn_is_bool=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.nl.is_bool(arg0))
return ret;
}

n.nl.print=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var label=null;
while (1) { switch (label) {
default:
//line 39
n.c_std_lib.print(im0);
//line 39
im0=null;
//line 39
return null;
}}}

n.nl.__dyn_print=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.nl.print(arg0)
return ret;
}

n.nl.debug_die=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 44
im1=n.imm_arr([]);
//line 44
n.nl_die();
//line 44
im0=null;
//line 44
im1=null;
//line 44
return null;
}}}

n.nl.__dyn_debug_die=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.nl.debug_die(arg0)
return ret;
}
var c=[];
c[0] = n.imm_str("TRUE");c[1] = n.imm_str("FALSE");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.ov={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.ov.mk=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 9
im1=n.c_rt_lib.ov_none_new(im0);
//line 9
im0=null;
//line 9
return im1;
//line 9
im0=null;
//line 9
im1=null;
//line 9
return null;
}}}

n.ov.__dyn_mk=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ov.mk(arg0)
return ret;
}

n.ov.mk_val=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 13
im2=n.c_rt_lib.ov_arg_new(im0,im1);
//line 13
im0=null;
//line 13
im1=null;
//line 13
return im2;
//line 13
im0=null;
//line 13
im1=null;
//line 13
im2=null;
//line 13
return null;
}}}

n.ov.__dyn_mk_val=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ov.mk_val(arg0, arg1)
return ret;
}

n.ov.has_value=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 17
im1=n.c_rt_lib.ov_has_value(im0);
//line 17
im0=null;
//line 17
return im1;
//line 17
im0=null;
//line 17
im1=null;
//line 17
return null;
}}}

n.ov.__dyn_has_value=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ov.has_value(arg0)
return ret;
}

n.ov.get_element=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 21
im1=n.c_rt_lib.ov_get_element(im0);
//line 21
im0=null;
//line 21
return im1;
//line 21
im0=null;
//line 21
im1=null;
//line 21
return null;
}}}

n.ov.__dyn_get_element=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ov.get_element(arg0)
return ret;
}

n.ov.get_value=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 25
im1=n.c_rt_lib.ov_get_value(im0);
//line 25
im0=null;
//line 25
return im1;
//line 25
im0=null;
//line 25
im1=null;
//line 25
return null;
}}}

n.ov.__dyn_get_value=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ov.get_value(arg0)
return ret;
}

n.ov.is=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var label=null;
while (1) { switch (label) {
default:
//line 29
bool2=n.c_rt_lib.ov_is(im0,im1);
//line 29
im0=null;
//line 29
im1=null;
//line 29
return bool2;
//line 29
im0=null;
//line 29
im1=null;
//line 29
bool2=null;
//line 29
return null;
}}}

n.ov.__dyn_is=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.ov.is(arg0, arg1))
return ret;
}

n.ov.as=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 33
im2=n.c_rt_lib.ov_as(im0,im1);
//line 33
im0=null;
//line 33
im1=null;
//line 33
return im2;
//line 33
im0=null;
//line 33
im1=null;
//line 33
im2=null;
//line 33
return null;
}}}

n.ov.__dyn_as=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ov.as(arg0, arg1)
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.own={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.own.arr=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 4
im1=n.c_rt_lib.ov_mk_arg(c[0],im0);;
//line 4
im0=null;
//line 4
return im1;
}}}

n.own.__dyn_arr=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.own.arr(arg0)
return ret;
}

n.own.rec=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 8
im1=n.c_rt_lib.ov_mk_arg(c[1],im0);;
//line 8
im0=null;
//line 8
return im1;
}}}

n.own.__dyn_rec=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.own.rec(arg0)
return ret;
}

n.own.hash=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 12
im1=n.c_rt_lib.ov_mk_arg(c[2],im0);;
//line 12
im0=null;
//line 12
return im1;
}}}

n.own.__dyn_hash=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.own.hash(arg0)
return ret;
}

n.own.var=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var im6=null;
var bool7=null;
var im8=null;
var im9=null;
var im10=null;
var im11=null;
var label=null;
while (1) { switch (label) {
default:
//line 16
im1=n.imm_hash({});
//line 17
im5=n.c_rt_lib.init_iter(im0);;
//line 17
case 2:
//line 17
bool3=n.c_rt_lib.is_end_hash(im5);;
//line 17
if (bool3) {label = 23; continue;}
//line 17
im2=n.c_rt_lib.get_key_iter(im5);;
//line 17
im4=n.c_rt_lib.hash_get_value(im0,im2);
//line 19
bool7=n.c_rt_lib.ov_is(im4,c[3]);;
//line 19
bool7=!bool7
//line 19
if (bool7) {label = 12; continue;}
//line 20
im6=c[4]
//line 21
label = 15; continue;
//line 21
case 12:
//line 22
im6=n.c_rt_lib.ov_mk_arg(c[5],im4);;
//line 23
label = 15; continue;
//line 23
case 15:
//line 23
bool7=null;
//line 24
im8=im6
//line 24
var call_6_1=new n.imm_ref(im1);n.c_rt_lib.hash_set_value(call_6_1,im2,im8);im1=call_6_1.value;call_6_1=null;
//line 24
im8=null;
//line 24
im6=null;
//line 25
im5=n.c_rt_lib.next_iter(im5);;
//line 25
label = 2; continue;
//line 25
case 23:
//line 26
im10=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 26
im10=n.c_rt_lib.ov_mk_arg(c[6],im10);;
//line 26
im11=n.c_rt_lib.ov_mk_arg(c[7],im1);;
//line 26
im9=n.ptd.ensure_only_static_do_not_touch_without_permission(im10,im11);
//line 26
im10=null;
//line 26
im11=null;
//line 26
im0=null;
//line 26
im1=null;
//line 26
im2=null;
//line 26
bool3=null;
//line 26
im4=null;
//line 26
im5=null;
//line 26
im6=null;
//line 26
return im9;
}}}

n.own.__dyn_var=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.own.var(arg0)
return ret;
}

n.own.to_im=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var label=null;
while (1) { switch (label) {
default:
//line 30
return im0;
//line 30
im0=null;
//line 30
return null;
}}}

n.own.__dyn_to_im=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.own.to_im(arg0)
return ret;
}
var c=[];
c[0] = n.imm_str("own_arr");c[1] = n.imm_str("own_rec");c[2] = n.imm_str("own_hash");c[3] = n.imm_str("ptd_var_none");c[4] = n.imm_ov_js_str("no_param",null);c[5] = n.imm_str("with_param");c[6] = n.imm_str("ref");c[7] = n.imm_str("own_var");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.own_array={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.own_array.len=function(___arg__0) {
var arr0=___arg__0.value;
n.check_null(arr0);
var label=null;
while (1) { switch (label) {
default:
//line 2
___arg__0.value = arr0;return null;
}}}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.ptd={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.ptd.arr=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 12
im1=n.c_rt_lib.ov_mk_arg(c[0],im0);;
//line 12
im0=null;
//line 12
return im1;
}}}

n.ptd.__dyn_arr=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.arr(arg0)
return ret;
}

n.ptd.rec=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 16
im1=n.c_rt_lib.ov_mk_arg(c[1],im0);;
//line 16
im0=null;
//line 16
return im1;
}}}

n.ptd.__dyn_rec=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.rec(arg0)
return ret;
}

function _prv__singleton_prv_fun_int() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 20
im0=c[2]
//line 20
return im0;
}}}
var _singleton_val__prv__singleton_prv_fun_int;
n.ptd.int=function() {
if (_singleton_val__prv__singleton_prv_fun_int===undefined) {
_singleton_val__prv__singleton_prv_fun_int=_prv__singleton_prv_fun_int();
}
return _singleton_val__prv__singleton_prv_fun_int;
}

n.ptd.__dyn_int=function(arr) {
var ret = n.ptd.int()
return ret;
}

function _prv__singleton_prv_fun_string() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 24
im0=c[3]
//line 24
return im0;
}}}
var _singleton_val__prv__singleton_prv_fun_string;
n.ptd.string=function() {
if (_singleton_val__prv__singleton_prv_fun_string===undefined) {
_singleton_val__prv__singleton_prv_fun_string=_prv__singleton_prv_fun_string();
}
return _singleton_val__prv__singleton_prv_fun_string;
}

n.ptd.__dyn_string=function(arr) {
var ret = n.ptd.string()
return ret;
}

function _prv__singleton_prv_fun_bool() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 28
im0=c[4]
//line 28
return im0;
}}}
var _singleton_val__prv__singleton_prv_fun_bool;
n.ptd.bool=function() {
if (_singleton_val__prv__singleton_prv_fun_bool===undefined) {
_singleton_val__prv__singleton_prv_fun_bool=_prv__singleton_prv_fun_bool();
}
return _singleton_val__prv__singleton_prv_fun_bool;
}

n.ptd.__dyn_bool=function(arr) {
var ret = n.ptd.bool()
return ret;
}

function _prv__singleton_prv_fun_none() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 32
im0=c[5]
//line 32
return im0;
//line 32
im0=null;
//line 32
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_none;
n.ptd.none=function() {
if (_singleton_val__prv__singleton_prv_fun_none===undefined) {
_singleton_val__prv__singleton_prv_fun_none=_prv__singleton_prv_fun_none();
}
return _singleton_val__prv__singleton_prv_fun_none;
}

n.ptd.__dyn_none=function(arr) {
var ret = n.ptd.none()
return ret;
}

function _prv__singleton_prv_fun_void() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 36
im0=c[6]
//line 36
return im0;
//line 36
im0=null;
//line 36
return null;
}}}
var _singleton_val__prv__singleton_prv_fun_void;
n.ptd.void=function() {
if (_singleton_val__prv__singleton_prv_fun_void===undefined) {
_singleton_val__prv__singleton_prv_fun_void=_prv__singleton_prv_fun_void();
}
return _singleton_val__prv__singleton_prv_fun_void;
}

n.ptd.__dyn_void=function(arr) {
var ret = n.ptd.void()
return ret;
}

n.ptd.hash=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 40
im1=n.c_rt_lib.ov_mk_arg(c[7],im0);;
//line 40
im0=null;
//line 40
return im1;
}}}

n.ptd.__dyn_hash=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.hash(arg0)
return ret;
}

function _prv__singleton_prv_fun_ptd_im() {
var im0=null;
var label=null;
while (1) { switch (label) {
default:
//line 44
im0=c[8]
//line 44
return im0;
}}}
var _singleton_val__prv__singleton_prv_fun_ptd_im;
n.ptd.ptd_im=function() {
if (_singleton_val__prv__singleton_prv_fun_ptd_im===undefined) {
_singleton_val__prv__singleton_prv_fun_ptd_im=_prv__singleton_prv_fun_ptd_im();
}
return _singleton_val__prv__singleton_prv_fun_ptd_im;
}

n.ptd.__dyn_ptd_im=function(arr) {
var ret = n.ptd.ptd_im()
return ret;
}

n.ptd.var=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var im6=null;
var bool7=null;
var im8=null;
var im9=null;
var im10=null;
var label=null;
while (1) { switch (label) {
default:
//line 48
im1=n.imm_hash({});
//line 49
im5=n.c_rt_lib.init_iter(im0);;
//line 49
case 2:
//line 49
bool3=n.c_rt_lib.is_end_hash(im5);;
//line 49
if (bool3) {label = 21; continue;}
//line 49
im2=n.c_rt_lib.get_key_iter(im5);;
//line 49
im4=n.c_rt_lib.hash_get_value(im0,im2);
//line 51
bool7=n.c_rt_lib.ov_is(im4,c[9]);;
//line 51
bool7=!bool7
//line 51
if (bool7) {label = 12; continue;}
//line 52
im6=c[10]
//line 53
label = 15; continue;
//line 53
case 12:
//line 54
im6=n.c_rt_lib.ov_mk_arg(c[11],im4);;
//line 55
label = 15; continue;
//line 55
case 15:
//line 55
bool7=null;
//line 56
var call_6_1=new n.imm_ref(im1);n.hash.set_value(call_6_1,im2,im6);im1=call_6_1.value;call_6_1=null;
//line 56
im6=null;
//line 57
im5=n.c_rt_lib.next_iter(im5);;
//line 57
label = 2; continue;
//line 57
case 21:
//line 58
im9=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 58
im9=n.c_rt_lib.ov_mk_arg(c[12],im9);;
//line 58
im10=n.c_rt_lib.ov_mk_arg(c[13],im1);;
//line 58
im8=n.ptd.ensure_only_static_do_not_touch_without_permission(im9,im10);
//line 58
im9=null;
//line 58
im10=null;
//line 58
im0=null;
//line 58
im1=null;
//line 58
im2=null;
//line 58
bool3=null;
//line 58
im4=null;
//line 58
im5=null;
//line 58
im6=null;
//line 58
return im8;
}}}

n.ptd.__dyn_var=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.var(arg0)
return ret;
}

n.ptd.meta_type=function() {
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
var label=null;
while (1) { switch (label) {
default:
//line 63
im3=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 63
im3=n.c_rt_lib.ov_mk_arg(c[12],im3);;
//line 63
im2=n.ptd.hash(im3);
//line 63
im3=null;
//line 64
im4=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 64
im4=n.c_rt_lib.ov_mk_arg(c[12],im4);;
//line 65
im5=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 65
im5=n.c_rt_lib.ov_mk_arg(c[12],im5);;
//line 66
im9=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 66
im9=n.c_rt_lib.ov_mk_arg(c[12],im9);;
//line 66
im10=n.ptd.none();
//line 66
im8=n.imm_hash({"with_param":im9,"no_param":im10,});
//line 66
im9=null;
//line 66
im10=null;
//line 66
im7=n.ptd.var(im8);
//line 66
im8=null;
//line 66
im6=n.ptd.hash(im7);
//line 66
im7=null;
//line 68
im13=n.ptd.string();
//line 69
im14=n.ptd.string();
//line 69
im12=n.imm_hash({"module":im13,"name":im14,});
//line 69
im13=null;
//line 69
im14=null;
//line 69
im11=n.ptd.rec(im12);
//line 69
im12=null;
//line 71
im15=n.ptd.none();
//line 72
im16=n.ptd.none();
//line 73
im17=n.ptd.none();
//line 74
im18=n.ptd.none();
//line 75
im20=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 75
im20=n.c_rt_lib.ov_mk_arg(c[12],im20);;
//line 75
im19=n.ptd.hash(im20);
//line 75
im20=null;
//line 76
im21=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 76
im21=n.c_rt_lib.ov_mk_arg(c[12],im21);;
//line 77
im22=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 77
im22=n.c_rt_lib.ov_mk_arg(c[12],im22);;
//line 78
im26=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("meta_type"),});
//line 78
im26=n.c_rt_lib.ov_mk_arg(c[12],im26);;
//line 78
im27=n.ptd.none();
//line 78
im25=n.imm_hash({"with_param":im26,"no_param":im27,});
//line 78
im26=null;
//line 78
im27=null;
//line 78
im24=n.ptd.var(im25);
//line 78
im25=null;
//line 78
im23=n.ptd.hash(im24);
//line 78
im24=null;
//line 78
im1=n.imm_hash({"ptd_rec":im2,"ptd_hash":im4,"ptd_arr":im5,"ptd_var":im6,"ref":im11,"ptd_int":im15,"ptd_string":im16,"ptd_bool":im17,"ptd_im":im18,"own_rec":im19,"own_hash":im21,"own_arr":im22,"own_var":im23,});
//line 78
im2=null;
//line 78
im4=null;
//line 78
im5=null;
//line 78
im6=null;
//line 78
im11=null;
//line 78
im15=null;
//line 78
im16=null;
//line 78
im17=null;
//line 78
im18=null;
//line 78
im19=null;
//line 78
im21=null;
//line 78
im22=null;
//line 78
im23=null;
//line 78
im0=n.ptd.var(im1);
//line 78
im1=null;
//line 78
return im0;
//line 78
im0=null;
//line 78
return null;
}}}

n.ptd.__dyn_meta_type=function(arr) {
var ret = n.ptd.meta_type()
return ret;
}

n.ptd.ensure=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 83
im2=n.imm_arr([]);
//line 84
var call_0_3=new n.imm_ref(im2);im4=n.ptd.ensure_dyn(im0,im1,call_0_3);im2=call_0_3.value;call_0_3=null;
//line 84
bool3=n.c_rt_lib.ov_is(im4,c[14]);;
//line 84
if (bool3) {label = 6; continue;}
//line 84
im4=n.c_rt_lib.ov_mk_arg(c[15],im4);;
//line 84
n.nl_die();
//line 84
case 6:
//line 85
im0=null;
//line 85
im2=null;
//line 85
bool3=null;
//line 85
im4=null;
//line 85
return im1;
//line 85
im0=null;
//line 85
im1=null;
//line 85
im2=null;
//line 85
bool3=null;
//line 85
im4=null;
//line 85
return null;
}}}

n.ptd.__dyn_ensure=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.ensure(arg0, arg1)
return ret;
}

n.ptd.ensure_with_cast=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 89
im2=n.imm_arr([]);
//line 90
bool5=true;
//line 90
im6=n.c_rt_lib.native_to_nl(bool5)
//line 90
var call_0_4=new n.imm_ref(im2);im4=_prv_ensure_dyn(im0,im1,im6,call_0_4);im2=call_0_4.value;call_0_4=null;
//line 90
bool5=null;
//line 90
im6=null;
//line 90
bool3=n.c_rt_lib.ov_is(im4,c[14]);;
//line 90
if (bool3) {label = 10; continue;}
//line 90
im4=n.c_rt_lib.ov_mk_arg(c[15],im4);;
//line 90
n.nl_die();
//line 90
case 10:
//line 90
im1=n.c_rt_lib.ov_as(im4,c[14]);;
//line 91
im0=null;
//line 91
im2=null;
//line 91
bool3=null;
//line 91
im4=null;
//line 91
return im1;
//line 91
im0=null;
//line 91
im1=null;
//line 91
im2=null;
//line 91
bool3=null;
//line 91
im4=null;
//line 91
return null;
}}}

n.ptd.__dyn_ensure_with_cast=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.ensure_with_cast(arg0, arg1)
return ret;
}

n.ptd.try_ensure=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 95
im2=n.imm_arr([]);
//line 96
var call_0_3=new n.imm_ref(im2);im4=n.ptd.ensure_dyn(im0,im1,call_0_3);im2=call_0_3.value;call_0_3=null;
//line 96
bool3=n.c_rt_lib.ov_is(im4,c[14]);;
//line 96
if (bool3) {label = 9; continue;}
//line 96
im0=null;
//line 96
im1=null;
//line 96
im2=null;
//line 96
bool3=null;
//line 96
return im4;
//line 96
case 9:
//line 97
im5=n.c_rt_lib.ov_mk_arg(c[14],im1);;
//line 97
im0=null;
//line 97
im1=null;
//line 97
im2=null;
//line 97
bool3=null;
//line 97
im4=null;
//line 97
return im5;
//line 97
im0=null;
//line 97
im1=null;
//line 97
im2=null;
//line 97
bool3=null;
//line 97
im4=null;
//line 97
im5=null;
//line 97
return null;
}}}

n.ptd.__dyn_try_ensure=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.try_ensure(arg0, arg1)
return ret;
}

n.ptd.ensure_only_dynamic=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var label=null;
while (1) { switch (label) {
default:
//line 101
im2=n.imm_arr([]);
//line 102
var call_0_3=new n.imm_ref(im2);im4=n.ptd.ensure_dyn(im0,im1,call_0_3);im2=call_0_3.value;call_0_3=null;
//line 102
bool3=n.c_rt_lib.ov_is(im4,c[14]);;
//line 102
if (bool3) {label = 6; continue;}
//line 102
im4=n.c_rt_lib.ov_mk_arg(c[15],im4);;
//line 102
n.nl_die();
//line 102
case 6:
//line 103
im0=null;
//line 103
im2=null;
//line 103
bool3=null;
//line 103
im4=null;
//line 103
return im1;
//line 103
im0=null;
//line 103
im1=null;
//line 103
im2=null;
//line 103
bool3=null;
//line 103
im4=null;
//line 103
return null;
}}}

n.ptd.__dyn_ensure_only_dynamic=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.ensure_only_dynamic(arg0, arg1)
return ret;
}

n.ptd.ensure_only_dynamic_with_cast=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 107
im2=n.imm_arr([]);
//line 108
bool5=true;
//line 108
im6=n.c_rt_lib.native_to_nl(bool5)
//line 108
var call_0_4=new n.imm_ref(im2);im4=_prv_ensure_dyn(im0,im1,im6,call_0_4);im2=call_0_4.value;call_0_4=null;
//line 108
bool5=null;
//line 108
im6=null;
//line 108
bool3=n.c_rt_lib.ov_is(im4,c[14]);;
//line 108
if (bool3) {label = 10; continue;}
//line 108
im4=n.c_rt_lib.ov_mk_arg(c[15],im4);;
//line 108
n.nl_die();
//line 108
case 10:
//line 109
im0=null;
//line 109
im2=null;
//line 109
bool3=null;
//line 109
im4=null;
//line 109
return im1;
//line 109
im0=null;
//line 109
im1=null;
//line 109
im2=null;
//line 109
bool3=null;
//line 109
im4=null;
//line 109
return null;
}}}

n.ptd.__dyn_ensure_only_dynamic_with_cast=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.ensure_only_dynamic_with_cast(arg0, arg1)
return ret;
}

n.ptd.ensure_only_static_do_not_touch_without_permission=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var label=null;
while (1) { switch (label) {
default:
//line 114
im0=null;
//line 114
return im1;
//line 114
im0=null;
//line 114
im1=null;
//line 114
return null;
}}}

n.ptd.__dyn_ensure_only_static_do_not_touch_without_permission=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.ensure_only_static_do_not_touch_without_permission(arg0, arg1)
return ret;
}

n.ptd.ensure_dyn=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2.value;
n.check_null(im2);
var im3=null;
var bool4=null;
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 118
bool4=false;
//line 118
im5=n.c_rt_lib.native_to_nl(bool4)
//line 118
var call_0_4=new n.imm_ref(im2);im3=_prv_ensure_dyn(im0,im1,im5,call_0_4);im2=call_0_4.value;call_0_4=null;
//line 118
bool4=null;
//line 118
im5=null;
//line 118
im0=null;
//line 118
im1=null;
//line 118
___arg__2.value = im2;return im3;
}}}

n.ptd.__dyn_ensure_dyn=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=new n.imm_ref(arr.value.get_index(2));;
var ret = n.ptd.ensure_dyn(arg0, arg1, arg2)
arr.value = arr.value.set_index(2, arg2.value);
return ret;
}

function _prv_ensure_dyn(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3.value;
n.check_null(im3);
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var bool9=null;
var im10=null;
var im11=null;
var im12=null;
var bool13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var bool18=null;
var im19=null;
var im20=null;
var bool21=null;
var im22=null;
var im23=null;
var im24=null;
var im25=null;
var bool26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var int31=null;
var int32=null;
var int33=null;
var bool34=null;
var im35=null;
var im36=null;
var im37=null;
var bool38=null;
var im39=null;
var im40=null;
var im41=null;
var bool42=null;
var im43=null;
var im44=null;
var im45=null;
var bool46=null;
var int47=null;
var int48=null;
var im49=null;
var im50=null;
var im51=null;
var im52=null;
var im53=null;
var bool54=null;
var im55=null;
var im56=null;
var bool57=null;
var im58=null;
var im59=null;
var im60=null;
var im61=null;
var im62=null;
var im63=null;
var bool64=null;
var im65=null;
var im66=null;
var im67=null;
var bool68=null;
var bool69=null;
var int70=null;
var bool71=null;
var im72=null;
var im73=null;
var im74=null;
var im75=null;
var im76=null;
var bool77=null;
var im78=null;
var im79=null;
var im80=null;
var im81=null;
var bool82=null;
var im83=null;
var im84=null;
var im85=null;
var im86=null;
var im87=null;
var im88=null;
var im89=null;
var bool90=null;
var im91=null;
var im92=null;
var im93=null;
var bool94=null;
var im95=null;
var im96=null;
var im97=null;
var im98=null;
var im99=null;
var bool100=null;
var im101=null;
var im102=null;
var bool103=null;
var im104=null;
var im105=null;
var im106=null;
var im107=null;
var bool108=null;
var bool109=null;
var int110=null;
var bool111=null;
var im112=null;
var im113=null;
var im114=null;
var im115=null;
var im116=null;
var bool117=null;
var im118=null;
var im119=null;
var im120=null;
var bool121=null;
var im122=null;
var im123=null;
var im124=null;
var im125=null;
var bool126=null;
var bool127=null;
var im128=null;
var im129=null;
var im130=null;
var im131=null;
var im132=null;
var im133=null;
var im134=null;
var im135=null;
var im136=null;
var label=null;
while (1) { switch (label) {
default:
//line 122
bool4=n.c_std_lib.is_variant(im0);
//line 122
bool4=!bool4
//line 122
bool4=!bool4
//line 122
if (bool4) {label = 15; continue;}
//line 122
im7=c[16];
//line 122
im6=n.imm_hash({"err":im7,"path":im3,});
//line 122
im7=null;
//line 122
im5=n.c_rt_lib.ov_mk_arg(c[17],im6);;
//line 122
im6=null;
//line 122
im0=null;
//line 122
im1=null;
//line 122
im2=null;
//line 122
bool4=null;
//line 122
___arg__3.value = im3;return im5;
//line 122
label = 15; continue;
//line 122
case 15:
//line 122
bool4=null;
//line 122
im5=null;
//line 124
bool9=n.c_rt_lib.ov_is(im0,c[7]);;
//line 124
if (bool9) {label = 39; continue;}
//line 133
bool9=n.c_rt_lib.ov_is(im0,c[0]);;
//line 133
if (bool9) {label = 102; continue;}
//line 142
bool9=n.c_rt_lib.ov_is(im0,c[1]);;
//line 142
if (bool9) {label = 187; continue;}
//line 154
bool9=n.c_rt_lib.ov_is(im0,c[18]);;
//line 154
if (bool9) {label = 395; continue;}
//line 158
bool9=n.c_rt_lib.ov_is(im0,c[13]);;
//line 158
if (bool9) {label = 462; continue;}
//line 173
bool9=n.c_rt_lib.ov_is(im0,c[19]);;
//line 173
if (bool9) {label = 772; continue;}
//line 177
bool9=n.c_rt_lib.ov_is(im0,c[20]);;
//line 177
if (bool9) {label = 850; continue;}
//line 179
bool9=n.c_rt_lib.ov_is(im0,c[12]);;
//line 179
if (bool9) {label = 853; continue;}
//line 183
bool9=n.c_rt_lib.ov_is(im0,c[21]);;
//line 183
if (bool9) {label = 918; continue;}
//line 183
im10=c[22];
//line 183
im10=n.imm_arr([im10,im0,]);
//line 183
n.nl_die();
//line 124
case 39:
//line 124
im12=n.c_rt_lib.ov_as(im0,c[7]);;
//line 124
im11=im12
//line 125
bool13=n.c_std_lib.is_hash(im1);
//line 125
bool13=!bool13
//line 125
bool13=!bool13
//line 125
if (bool13) {label = 62; continue;}
//line 125
im16=c[23];
//line 125
im15=n.imm_hash({"err":im16,"path":im3,});
//line 125
im16=null;
//line 125
im14=n.c_rt_lib.ov_mk_arg(c[17],im15);;
//line 125
im15=null;
//line 125
im0=null;
//line 125
im1=null;
//line 125
im2=null;
//line 125
im8=null;
//line 125
bool9=null;
//line 125
im10=null;
//line 125
im11=null;
//line 125
im12=null;
//line 125
bool13=null;
//line 125
___arg__3.value = im3;return im14;
//line 125
label = 62; continue;
//line 125
case 62:
//line 125
bool13=null;
//line 125
im14=null;
//line 126
im8=n.imm_hash({});
//line 127
im20=n.c_rt_lib.init_iter(im1);;
//line 127
case 67:
//line 127
bool18=n.c_rt_lib.is_end_hash(im20);;
//line 127
if (bool18) {label = 99; continue;}
//line 127
im17=n.c_rt_lib.get_key_iter(im20);;
//line 127
im19=n.c_rt_lib.hash_get_value(im1,im17);
//line 128
var call_18_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_18_1,im17);im3=call_18_1.value;call_18_1=null;;
//line 129
var call_19_4=new n.imm_ref(im3);im22=_prv_ensure_dyn(im11,im19,im2,call_19_4);im3=call_19_4.value;call_19_4=null;
//line 129
bool21=n.c_rt_lib.ov_is(im22,c[14]);;
//line 129
if (bool21) {label = 90; continue;}
//line 129
im0=null;
//line 129
im1=null;
//line 129
im2=null;
//line 129
im8=null;
//line 129
bool9=null;
//line 129
im10=null;
//line 129
im11=null;
//line 129
im12=null;
//line 129
im17=null;
//line 129
bool18=null;
//line 129
im19=null;
//line 129
im20=null;
//line 129
bool21=null;
//line 129
___arg__3.value = im3;return im22;
//line 129
case 90:
//line 129
im23=n.c_rt_lib.ov_as(im22,c[14]);;
//line 129
var call_22_1=new n.imm_ref(im8);n.c_rt_lib.hash_set_value(call_22_1,im17,im23);im8=call_22_1.value;call_22_1=null;
//line 130
var call_23_1=new n.imm_ref(im3);n.array.pop(call_23_1);im3=call_23_1.value;call_23_1=null;
//line 130
bool21=null;
//line 130
im22=null;
//line 130
im23=null;
//line 131
im20=n.c_rt_lib.next_iter(im20);;
//line 131
label = 67; continue;
//line 131
case 99:
//line 132
im1=im8
//line 133
label = 1067; continue;
//line 133
case 102:
//line 133
im25=n.c_rt_lib.ov_as(im0,c[0]);;
//line 133
im24=im25
//line 134
bool26=n.c_std_lib.is_array(im1);
//line 134
bool26=!bool26
//line 134
bool26=!bool26
//line 134
if (bool26) {label = 134; continue;}
//line 134
im29=c[24];
//line 134
im28=n.imm_hash({"err":im29,"path":im3,});
//line 134
im29=null;
//line 134
im27=n.c_rt_lib.ov_mk_arg(c[17],im28);;
//line 134
im28=null;
//line 134
im0=null;
//line 134
im1=null;
//line 134
im2=null;
//line 134
im8=null;
//line 134
bool9=null;
//line 134
im10=null;
//line 134
im11=null;
//line 134
im12=null;
//line 134
im17=null;
//line 134
bool18=null;
//line 134
im19=null;
//line 134
im20=null;
//line 134
bool21=null;
//line 134
im22=null;
//line 134
im23=null;
//line 134
im24=null;
//line 134
im25=null;
//line 134
bool26=null;
//line 134
___arg__3.value = im3;return im27;
//line 134
label = 134; continue;
//line 134
case 134:
//line 134
bool26=null;
//line 134
im27=null;
//line 135
im8=n.imm_arr([]);
//line 136
int31=0;
//line 136
int32=1;
//line 136
int33=n.c_rt_lib.array_len(im1);;
//line 136
case 141:
//line 136
bool34=int31>=int33;
//line 136
if (bool34) {label = 185; continue;}
//line 136
im35=im1.get_index(int31);
//line 136
im30=im35
//line 137
im36=c[25];
//line 137
var call_29_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_29_1,im36);im3=call_29_1.value;call_29_1=null;;
//line 137
im36=null;
//line 138
var call_30_4=new n.imm_ref(im3);im39=_prv_ensure_dyn(im24,im30,im2,call_30_4);im3=call_30_4.value;call_30_4=null;
//line 138
bool38=n.c_rt_lib.ov_is(im39,c[14]);;
//line 138
if (bool38) {label = 178; continue;}
//line 138
im0=null;
//line 138
im1=null;
//line 138
im2=null;
//line 138
im8=null;
//line 138
bool9=null;
//line 138
im10=null;
//line 138
im11=null;
//line 138
im12=null;
//line 138
im17=null;
//line 138
bool18=null;
//line 138
im19=null;
//line 138
im20=null;
//line 138
bool21=null;
//line 138
im22=null;
//line 138
im23=null;
//line 138
im24=null;
//line 138
im25=null;
//line 138
im30=null;
//line 138
int31=null;
//line 138
int32=null;
//line 138
int33=null;
//line 138
bool34=null;
//line 138
im35=null;
//line 138
im37=null;
//line 138
bool38=null;
//line 138
___arg__3.value = im3;return im39;
//line 138
case 178:
//line 138
im37=n.c_rt_lib.ov_as(im39,c[14]);;
//line 139
var call_33_1=new n.imm_ref(im8);n.c_rt_lib.array_push(call_33_1,im37);im8=call_33_1.value;call_33_1=null;;
//line 140
var call_34_1=new n.imm_ref(im3);n.array.pop(call_34_1);im3=call_34_1.value;call_34_1=null;
//line 140
im30=null;
//line 141
int31=Math.floor(int31+int32);
//line 141
label = 141; continue;
//line 141
case 185:
//line 142
label = 1067; continue;
//line 142
case 187:
//line 142
im41=n.c_rt_lib.ov_as(im0,c[1]);;
//line 142
im40=im41
//line 143
bool42=n.c_std_lib.is_hash(im1);
//line 143
bool42=!bool42
//line 143
bool42=!bool42
//line 143
if (bool42) {label = 230; continue;}
//line 143
im45=c[26];
//line 143
im44=n.imm_hash({"err":im45,"path":im3,});
//line 143
im45=null;
//line 143
im43=n.c_rt_lib.ov_mk_arg(c[17],im44);;
//line 143
im44=null;
//line 143
im0=null;
//line 143
im1=null;
//line 143
im2=null;
//line 143
im8=null;
//line 143
bool9=null;
//line 143
im10=null;
//line 143
im11=null;
//line 143
im12=null;
//line 143
im17=null;
//line 143
bool18=null;
//line 143
im19=null;
//line 143
im20=null;
//line 143
bool21=null;
//line 143
im22=null;
//line 143
im23=null;
//line 143
im24=null;
//line 143
im25=null;
//line 143
im30=null;
//line 143
int31=null;
//line 143
int32=null;
//line 143
int33=null;
//line 143
bool34=null;
//line 143
im35=null;
//line 143
im37=null;
//line 143
bool38=null;
//line 143
im39=null;
//line 143
im40=null;
//line 143
im41=null;
//line 143
bool42=null;
//line 143
___arg__3.value = im3;return im43;
//line 143
label = 230; continue;
//line 143
case 230:
//line 143
bool42=null;
//line 143
im43=null;
//line 144
int47=n.hash.size(im40);
//line 144
int48=n.hash.size(im1);
//line 144
bool46=int47==int48;
//line 144
int47=null;
//line 144
int48=null;
//line 144
bool46=!bool46
//line 144
bool46=!bool46
//line 144
if (bool46) {label = 277; continue;}
//line 144
im51=c[27];
//line 144
im50=n.imm_hash({"err":im51,"path":im3,});
//line 144
im51=null;
//line 144
im49=n.c_rt_lib.ov_mk_arg(c[17],im50);;
//line 144
im50=null;
//line 144
im0=null;
//line 144
im1=null;
//line 144
im2=null;
//line 144
im8=null;
//line 144
bool9=null;
//line 144
im10=null;
//line 144
im11=null;
//line 144
im12=null;
//line 144
im17=null;
//line 144
bool18=null;
//line 144
im19=null;
//line 144
im20=null;
//line 144
bool21=null;
//line 144
im22=null;
//line 144
im23=null;
//line 144
im24=null;
//line 144
im25=null;
//line 144
im30=null;
//line 144
int31=null;
//line 144
int32=null;
//line 144
int33=null;
//line 144
bool34=null;
//line 144
im35=null;
//line 144
im37=null;
//line 144
bool38=null;
//line 144
im39=null;
//line 144
im40=null;
//line 144
im41=null;
//line 144
bool46=null;
//line 144
___arg__3.value = im3;return im49;
//line 144
label = 277; continue;
//line 144
case 277:
//line 144
bool46=null;
//line 144
im49=null;
//line 145
im52=c[28];
//line 145
var call_41_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_41_1,im52);im3=call_41_1.value;call_41_1=null;;
//line 145
im52=null;
//line 146
im8=n.imm_hash({});
//line 147
im56=n.c_rt_lib.init_iter(im40);;
//line 147
case 285:
//line 147
bool54=n.c_rt_lib.is_end_hash(im56);;
//line 147
if (bool54) {label = 392; continue;}
//line 147
im53=n.c_rt_lib.get_key_iter(im56);;
//line 147
im55=n.c_rt_lib.hash_get_value(im40,im53);
//line 148
var call_46_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_46_1,im53);im3=call_46_1.value;call_46_1=null;;
//line 149
bool57=n.hash.has_key(im1,im53);
//line 149
bool57=!bool57
//line 149
bool57=!bool57
//line 149
if (bool57) {label = 341; continue;}
//line 149
im62=c[29];
//line 149
im61=n.c_rt_lib.concat(im62,im53);;
//line 149
im62=null;
//line 149
im63=c[30];
//line 149
im60=n.c_rt_lib.concat(im61,im63);;
//line 149
im61=null;
//line 149
im63=null;
//line 149
im59=n.imm_hash({"err":im60,"path":im3,});
//line 149
im60=null;
//line 149
im58=n.c_rt_lib.ov_mk_arg(c[17],im59);;
//line 149
im59=null;
//line 149
im0=null;
//line 149
im1=null;
//line 149
im2=null;
//line 149
im8=null;
//line 149
bool9=null;
//line 149
im10=null;
//line 149
im11=null;
//line 149
im12=null;
//line 149
im17=null;
//line 149
bool18=null;
//line 149
im19=null;
//line 149
im20=null;
//line 149
bool21=null;
//line 149
im22=null;
//line 149
im23=null;
//line 149
im24=null;
//line 149
im25=null;
//line 149
im30=null;
//line 149
int31=null;
//line 149
int32=null;
//line 149
int33=null;
//line 149
bool34=null;
//line 149
im35=null;
//line 149
im37=null;
//line 149
bool38=null;
//line 149
im39=null;
//line 149
im40=null;
//line 149
im41=null;
//line 149
im53=null;
//line 149
bool54=null;
//line 149
im55=null;
//line 149
im56=null;
//line 149
bool57=null;
//line 149
___arg__3.value = im3;return im58;
//line 149
label = 341; continue;
//line 149
case 341:
//line 149
bool57=null;
//line 149
im58=null;
//line 150
im66=n.hash.get_value(im1,im53);
//line 150
var call_52_4=new n.imm_ref(im3);im65=_prv_ensure_dyn(im55,im66,im2,call_52_4);im3=call_52_4.value;call_52_4=null;
//line 150
im66=null;
//line 150
bool64=n.c_rt_lib.ov_is(im65,c[14]);;
//line 150
if (bool64) {label = 383; continue;}
//line 150
im0=null;
//line 150
im1=null;
//line 150
im2=null;
//line 150
im8=null;
//line 150
bool9=null;
//line 150
im10=null;
//line 150
im11=null;
//line 150
im12=null;
//line 150
im17=null;
//line 150
bool18=null;
//line 150
im19=null;
//line 150
im20=null;
//line 150
bool21=null;
//line 150
im22=null;
//line 150
im23=null;
//line 150
im24=null;
//line 150
im25=null;
//line 150
im30=null;
//line 150
int31=null;
//line 150
int32=null;
//line 150
int33=null;
//line 150
bool34=null;
//line 150
im35=null;
//line 150
im37=null;
//line 150
bool38=null;
//line 150
im39=null;
//line 150
im40=null;
//line 150
im41=null;
//line 150
im53=null;
//line 150
bool54=null;
//line 150
im55=null;
//line 150
im56=null;
//line 150
bool64=null;
//line 150
___arg__3.value = im3;return im65;
//line 150
case 383:
//line 150
im67=n.c_rt_lib.ov_as(im65,c[14]);;
//line 150
var call_55_1=new n.imm_ref(im8);n.c_rt_lib.hash_set_value(call_55_1,im53,im67);im8=call_55_1.value;call_55_1=null;
//line 151
var call_56_1=new n.imm_ref(im3);n.array.pop(call_56_1);im3=call_56_1.value;call_56_1=null;
//line 151
bool64=null;
//line 151
im65=null;
//line 151
im67=null;
//line 152
im56=n.c_rt_lib.next_iter(im56);;
//line 152
label = 285; continue;
//line 152
case 392:
//line 153
var call_58_1=new n.imm_ref(im3);n.array.pop(call_58_1);im3=call_58_1.value;call_58_1=null;
//line 154
label = 1067; continue;
//line 154
case 395:
//line 155
bool68=n.c_rt_lib.check_true_native(im2);;
//line 155
bool69=!bool68
//line 155
if (bool69) {label = 400; continue;}
//line 155
bool68=n.c_std_lib.is_int(im1);
//line 155
case 400:
//line 155
bool69=null;
//line 155
bool68=!bool68
//line 155
if (bool68) {label = 408; continue;}
//line 155
int70=im1.as_int();
//line 155
im1=n.c_std_lib.int_to_string(int70);
//line 155
int70=null;
//line 155
label = 408; continue;
//line 155
case 408:
//line 155
bool68=null;
//line 156
bool71=n.c_std_lib.is_string(im1);
//line 156
bool71=!bool71
//line 156
bool71=!bool71
//line 156
if (bool71) {label = 457; continue;}
//line 156
im74=c[31];
//line 156
im73=n.imm_hash({"err":im74,"path":im3,});
//line 156
im74=null;
//line 156
im72=n.c_rt_lib.ov_mk_arg(c[17],im73);;
//line 156
im73=null;
//line 156
im0=null;
//line 156
im1=null;
//line 156
im2=null;
//line 156
im8=null;
//line 156
bool9=null;
//line 156
im10=null;
//line 156
im11=null;
//line 156
im12=null;
//line 156
im17=null;
//line 156
bool18=null;
//line 156
im19=null;
//line 156
im20=null;
//line 156
bool21=null;
//line 156
im22=null;
//line 156
im23=null;
//line 156
im24=null;
//line 156
im25=null;
//line 156
im30=null;
//line 156
int31=null;
//line 156
int32=null;
//line 156
int33=null;
//line 156
bool34=null;
//line 156
im35=null;
//line 156
im37=null;
//line 156
bool38=null;
//line 156
im39=null;
//line 156
im40=null;
//line 156
im41=null;
//line 156
im53=null;
//line 156
bool54=null;
//line 156
im55=null;
//line 156
im56=null;
//line 156
bool64=null;
//line 156
im65=null;
//line 156
im67=null;
//line 156
bool71=null;
//line 156
___arg__3.value = im3;return im72;
//line 156
label = 457; continue;
//line 156
case 457:
//line 156
bool71=null;
//line 156
im72=null;
//line 157
im8=im1
//line 158
label = 1067; continue;
//line 158
case 462:
//line 158
im76=n.c_rt_lib.ov_as(im0,c[13]);;
//line 158
im75=im76
//line 159
bool77=n.c_std_lib.is_variant(im1);
//line 159
bool77=!bool77
//line 159
bool77=!bool77
//line 159
if (bool77) {label = 514; continue;}
//line 159
im80=c[32];
//line 159
im79=n.imm_hash({"err":im80,"path":im3,});
//line 159
im80=null;
//line 159
im78=n.c_rt_lib.ov_mk_arg(c[17],im79);;
//line 159
im79=null;
//line 159
im0=null;
//line 159
im1=null;
//line 159
im2=null;
//line 159
im8=null;
//line 159
bool9=null;
//line 159
im10=null;
//line 159
im11=null;
//line 159
im12=null;
//line 159
im17=null;
//line 159
bool18=null;
//line 159
im19=null;
//line 159
im20=null;
//line 159
bool21=null;
//line 159
im22=null;
//line 159
im23=null;
//line 159
im24=null;
//line 159
im25=null;
//line 159
im30=null;
//line 159
int31=null;
//line 159
int32=null;
//line 159
int33=null;
//line 159
bool34=null;
//line 159
im35=null;
//line 159
im37=null;
//line 159
bool38=null;
//line 159
im39=null;
//line 159
im40=null;
//line 159
im41=null;
//line 159
im53=null;
//line 159
bool54=null;
//line 159
im55=null;
//line 159
im56=null;
//line 159
bool64=null;
//line 159
im65=null;
//line 159
im67=null;
//line 159
im75=null;
//line 159
im76=null;
//line 159
bool77=null;
//line 159
___arg__3.value = im3;return im78;
//line 159
label = 514; continue;
//line 159
case 514:
//line 159
bool77=null;
//line 159
im78=null;
//line 160
im81=n.ov.get_element(im1);
//line 161
bool82=n.hash.has_key(im75,im81);
//line 161
bool82=!bool82
//line 161
bool82=!bool82
//line 161
if (bool82) {label = 574; continue;}
//line 161
im87=c[33];
//line 161
im86=n.c_rt_lib.concat(im87,im81);;
//line 161
im87=null;
//line 161
im88=c[34];
//line 161
im85=n.c_rt_lib.concat(im86,im88);;
//line 161
im86=null;
//line 161
im88=null;
//line 161
im84=n.imm_hash({"err":im85,"path":im3,});
//line 161
im85=null;
//line 161
im83=n.c_rt_lib.ov_mk_arg(c[17],im84);;
//line 161
im84=null;
//line 161
im0=null;
//line 161
im1=null;
//line 161
im2=null;
//line 161
im8=null;
//line 161
bool9=null;
//line 161
im10=null;
//line 161
im11=null;
//line 161
im12=null;
//line 161
im17=null;
//line 161
bool18=null;
//line 161
im19=null;
//line 161
im20=null;
//line 161
bool21=null;
//line 161
im22=null;
//line 161
im23=null;
//line 161
im24=null;
//line 161
im25=null;
//line 161
im30=null;
//line 161
int31=null;
//line 161
int32=null;
//line 161
int33=null;
//line 161
bool34=null;
//line 161
im35=null;
//line 161
im37=null;
//line 161
bool38=null;
//line 161
im39=null;
//line 161
im40=null;
//line 161
im41=null;
//line 161
im53=null;
//line 161
bool54=null;
//line 161
im55=null;
//line 161
im56=null;
//line 161
bool64=null;
//line 161
im65=null;
//line 161
im67=null;
//line 161
im75=null;
//line 161
im76=null;
//line 161
im81=null;
//line 161
bool82=null;
//line 161
___arg__3.value = im3;return im83;
//line 161
label = 574; continue;
//line 161
case 574:
//line 161
bool82=null;
//line 161
im83=null;
//line 162
var call_72_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_72_1,im81);im3=call_72_1.value;call_72_1=null;;
//line 163
im89=n.hash.get_value(im75,im81);
//line 164
bool90=n.c_rt_lib.ov_is(im89,c[11]);;
//line 164
if (bool90) {label = 586; continue;}
//line 168
bool90=n.c_rt_lib.ov_is(im89,c[35]);;
//line 168
if (bool90) {label = 704; continue;}
//line 168
im91=c[22];
//line 168
im91=n.imm_arr([im91,im89,]);
//line 168
n.nl_die();
//line 164
case 586:
//line 164
im93=n.c_rt_lib.ov_as(im89,c[11]);;
//line 164
im92=im93
//line 165
im95=n.ov.has_value(im1);
//line 165
bool94=n.c_rt_lib.check_true_native(im95);;
//line 165
im95=null;
//line 165
bool94=!bool94
//line 165
bool94=!bool94
//line 165
if (bool94) {label = 646; continue;}
//line 165
im98=c[36];
//line 165
im97=n.imm_hash({"err":im98,"path":im3,});
//line 165
im98=null;
//line 165
im96=n.c_rt_lib.ov_mk_arg(c[17],im97);;
//line 165
im97=null;
//line 165
im0=null;
//line 165
im1=null;
//line 165
im2=null;
//line 165
im8=null;
//line 165
bool9=null;
//line 165
im10=null;
//line 165
im11=null;
//line 165
im12=null;
//line 165
im17=null;
//line 165
bool18=null;
//line 165
im19=null;
//line 165
im20=null;
//line 165
bool21=null;
//line 165
im22=null;
//line 165
im23=null;
//line 165
im24=null;
//line 165
im25=null;
//line 165
im30=null;
//line 165
int31=null;
//line 165
int32=null;
//line 165
int33=null;
//line 165
bool34=null;
//line 165
im35=null;
//line 165
im37=null;
//line 165
bool38=null;
//line 165
im39=null;
//line 165
im40=null;
//line 165
im41=null;
//line 165
im53=null;
//line 165
bool54=null;
//line 165
im55=null;
//line 165
im56=null;
//line 165
bool64=null;
//line 165
im65=null;
//line 165
im67=null;
//line 165
im75=null;
//line 165
im76=null;
//line 165
im81=null;
//line 165
im89=null;
//line 165
bool90=null;
//line 165
im91=null;
//line 165
im92=null;
//line 165
im93=null;
//line 165
bool94=null;
//line 165
___arg__3.value = im3;return im96;
//line 165
label = 646; continue;
//line 165
case 646:
//line 165
bool94=null;
//line 165
im96=null;
//line 166
im102=n.ov.get_value(im1);
//line 166
var call_81_4=new n.imm_ref(im3);im101=_prv_ensure_dyn(im92,im102,im2,call_81_4);im3=call_81_4.value;call_81_4=null;
//line 166
im102=null;
//line 166
bool100=n.c_rt_lib.ov_is(im101,c[14]);;
//line 166
if (bool100) {label = 700; continue;}
//line 166
im0=null;
//line 166
im1=null;
//line 166
im2=null;
//line 166
im8=null;
//line 166
bool9=null;
//line 166
im10=null;
//line 166
im11=null;
//line 166
im12=null;
//line 166
im17=null;
//line 166
bool18=null;
//line 166
im19=null;
//line 166
im20=null;
//line 166
bool21=null;
//line 166
im22=null;
//line 166
im23=null;
//line 166
im24=null;
//line 166
im25=null;
//line 166
im30=null;
//line 166
int31=null;
//line 166
int32=null;
//line 166
int33=null;
//line 166
bool34=null;
//line 166
im35=null;
//line 166
im37=null;
//line 166
bool38=null;
//line 166
im39=null;
//line 166
im40=null;
//line 166
im41=null;
//line 166
im53=null;
//line 166
bool54=null;
//line 166
im55=null;
//line 166
im56=null;
//line 166
bool64=null;
//line 166
im65=null;
//line 166
im67=null;
//line 166
im75=null;
//line 166
im76=null;
//line 166
im81=null;
//line 166
im89=null;
//line 166
bool90=null;
//line 166
im91=null;
//line 166
im92=null;
//line 166
im93=null;
//line 166
im99=null;
//line 166
bool100=null;
//line 166
___arg__3.value = im3;return im101;
//line 166
case 700:
//line 166
im99=n.c_rt_lib.ov_as(im101,c[14]);;
//line 167
im8=n.ov.mk_val(im81,im99);
//line 168
label = 769; continue;
//line 168
case 704:
//line 169
im104=n.ov.has_value(im1);
//line 169
bool103=n.c_rt_lib.check_true_native(im104);;
//line 169
im104=null;
//line 169
bool103=!bool103
//line 169
if (bool103) {label = 764; continue;}
//line 169
im107=c[37];
//line 169
im106=n.imm_hash({"err":im107,"path":im3,});
//line 169
im107=null;
//line 169
im105=n.c_rt_lib.ov_mk_arg(c[17],im106);;
//line 169
im106=null;
//line 169
im0=null;
//line 169
im1=null;
//line 169
im2=null;
//line 169
im8=null;
//line 169
bool9=null;
//line 169
im10=null;
//line 169
im11=null;
//line 169
im12=null;
//line 169
im17=null;
//line 169
bool18=null;
//line 169
im19=null;
//line 169
im20=null;
//line 169
bool21=null;
//line 169
im22=null;
//line 169
im23=null;
//line 169
im24=null;
//line 169
im25=null;
//line 169
im30=null;
//line 169
int31=null;
//line 169
int32=null;
//line 169
int33=null;
//line 169
bool34=null;
//line 169
im35=null;
//line 169
im37=null;
//line 169
bool38=null;
//line 169
im39=null;
//line 169
im40=null;
//line 169
im41=null;
//line 169
im53=null;
//line 169
bool54=null;
//line 169
im55=null;
//line 169
im56=null;
//line 169
bool64=null;
//line 169
im65=null;
//line 169
im67=null;
//line 169
im75=null;
//line 169
im76=null;
//line 169
im81=null;
//line 169
im89=null;
//line 169
bool90=null;
//line 169
im91=null;
//line 169
im92=null;
//line 169
im93=null;
//line 169
im99=null;
//line 169
bool100=null;
//line 169
im101=null;
//line 169
bool103=null;
//line 169
___arg__3.value = im3;return im105;
//line 169
label = 764; continue;
//line 169
case 764:
//line 169
bool103=null;
//line 169
im105=null;
//line 170
im8=n.ov.mk(im81);
//line 171
label = 769; continue;
//line 171
case 769:
//line 172
var call_89_1=new n.imm_ref(im3);n.array.pop(call_89_1);im3=call_89_1.value;call_89_1=null;
//line 173
label = 1067; continue;
//line 173
case 772:
//line 174
bool108=n.c_rt_lib.check_true_native(im2);;
//line 174
bool109=!bool108
//line 174
if (bool109) {label = 777; continue;}
//line 174
bool108=n.c_std_lib.is_string(im1);
//line 174
case 777:
//line 174
bool109=null;
//line 174
bool108=!bool108
//line 174
if (bool108) {label = 785; continue;}
//line 174
int110=n.ptd.string_to_int(im1);
//line 174
im1=n.imm_int(int110)
//line 174
int110=null;
//line 174
label = 785; continue;
//line 174
case 785:
//line 174
bool108=null;
//line 175
bool111=n.c_std_lib.is_int(im1);
//line 175
bool111=!bool111
//line 175
bool111=!bool111
//line 175
if (bool111) {label = 845; continue;}
//line 175
im114=c[38];
//line 175
im113=n.imm_hash({"err":im114,"path":im3,});
//line 175
im114=null;
//line 175
im112=n.c_rt_lib.ov_mk_arg(c[17],im113);;
//line 175
im113=null;
//line 175
im0=null;
//line 175
im1=null;
//line 175
im2=null;
//line 175
im8=null;
//line 175
bool9=null;
//line 175
im10=null;
//line 175
im11=null;
//line 175
im12=null;
//line 175
im17=null;
//line 175
bool18=null;
//line 175
im19=null;
//line 175
im20=null;
//line 175
bool21=null;
//line 175
im22=null;
//line 175
im23=null;
//line 175
im24=null;
//line 175
im25=null;
//line 175
im30=null;
//line 175
int31=null;
//line 175
int32=null;
//line 175
int33=null;
//line 175
bool34=null;
//line 175
im35=null;
//line 175
im37=null;
//line 175
bool38=null;
//line 175
im39=null;
//line 175
im40=null;
//line 175
im41=null;
//line 175
im53=null;
//line 175
bool54=null;
//line 175
im55=null;
//line 175
im56=null;
//line 175
bool64=null;
//line 175
im65=null;
//line 175
im67=null;
//line 175
im75=null;
//line 175
im76=null;
//line 175
im81=null;
//line 175
im89=null;
//line 175
bool90=null;
//line 175
im91=null;
//line 175
im92=null;
//line 175
im93=null;
//line 175
im99=null;
//line 175
bool100=null;
//line 175
im101=null;
//line 175
bool111=null;
//line 175
___arg__3.value = im3;return im112;
//line 175
label = 845; continue;
//line 175
case 845:
//line 175
bool111=null;
//line 175
im112=null;
//line 176
im8=im1
//line 177
label = 1067; continue;
//line 177
case 850:
//line 178
im8=im1
//line 179
label = 1067; continue;
//line 179
case 853:
//line 179
im116=n.c_rt_lib.ov_as(im0,c[12]);;
//line 179
im115=im116
//line 180
var call_96_1=new n.imm_ref(im3);n.c_rt_lib.array_push(call_96_1,im115);im3=call_96_1.value;call_96_1=null;;
//line 181
im120=n.imm_arr([]);
//line 181
im119=_prv_exec(im0,im120);
//line 181
im120=null;
//line 181
var call_98_4=new n.imm_ref(im3);im118=_prv_ensure_dyn(im119,im1,im2,call_98_4);im3=call_98_4.value;call_98_4=null;
//line 181
im119=null;
//line 181
bool117=n.c_rt_lib.ov_is(im118,c[14]);;
//line 181
if (bool117) {label = 914; continue;}
//line 181
im0=null;
//line 181
im1=null;
//line 181
im2=null;
//line 181
im8=null;
//line 181
bool9=null;
//line 181
im10=null;
//line 181
im11=null;
//line 181
im12=null;
//line 181
im17=null;
//line 181
bool18=null;
//line 181
im19=null;
//line 181
im20=null;
//line 181
bool21=null;
//line 181
im22=null;
//line 181
im23=null;
//line 181
im24=null;
//line 181
im25=null;
//line 181
im30=null;
//line 181
int31=null;
//line 181
int32=null;
//line 181
int33=null;
//line 181
bool34=null;
//line 181
im35=null;
//line 181
im37=null;
//line 181
bool38=null;
//line 181
im39=null;
//line 181
im40=null;
//line 181
im41=null;
//line 181
im53=null;
//line 181
bool54=null;
//line 181
im55=null;
//line 181
im56=null;
//line 181
bool64=null;
//line 181
im65=null;
//line 181
im67=null;
//line 181
im75=null;
//line 181
im76=null;
//line 181
im81=null;
//line 181
im89=null;
//line 181
bool90=null;
//line 181
im91=null;
//line 181
im92=null;
//line 181
im93=null;
//line 181
im99=null;
//line 181
bool100=null;
//line 181
im101=null;
//line 181
im115=null;
//line 181
im116=null;
//line 181
bool117=null;
//line 181
___arg__3.value = im3;return im118;
//line 181
case 914:
//line 181
im8=n.c_rt_lib.ov_as(im118,c[14]);;
//line 182
var call_101_1=new n.imm_ref(im3);n.array.pop(call_101_1);im3=call_101_1.value;call_101_1=null;
//line 183
label = 1067; continue;
//line 183
case 918:
//line 184
bool121=n.c_std_lib.is_variant(im1);
//line 184
bool121=!bool121
//line 184
bool121=!bool121
//line 184
if (bool121) {label = 981; continue;}
//line 184
im124=c[39];
//line 184
im123=n.imm_hash({"err":im124,"path":im3,});
//line 184
im124=null;
//line 184
im122=n.c_rt_lib.ov_mk_arg(c[17],im123);;
//line 184
im123=null;
//line 184
im0=null;
//line 184
im1=null;
//line 184
im2=null;
//line 184
im8=null;
//line 184
bool9=null;
//line 184
im10=null;
//line 184
im11=null;
//line 184
im12=null;
//line 184
im17=null;
//line 184
bool18=null;
//line 184
im19=null;
//line 184
im20=null;
//line 184
bool21=null;
//line 184
im22=null;
//line 184
im23=null;
//line 184
im24=null;
//line 184
im25=null;
//line 184
im30=null;
//line 184
int31=null;
//line 184
int32=null;
//line 184
int33=null;
//line 184
bool34=null;
//line 184
im35=null;
//line 184
im37=null;
//line 184
bool38=null;
//line 184
im39=null;
//line 184
im40=null;
//line 184
im41=null;
//line 184
im53=null;
//line 184
bool54=null;
//line 184
im55=null;
//line 184
im56=null;
//line 184
bool64=null;
//line 184
im65=null;
//line 184
im67=null;
//line 184
im75=null;
//line 184
im76=null;
//line 184
im81=null;
//line 184
im89=null;
//line 184
bool90=null;
//line 184
im91=null;
//line 184
im92=null;
//line 184
im93=null;
//line 184
im99=null;
//line 184
bool100=null;
//line 184
im101=null;
//line 184
im115=null;
//line 184
im116=null;
//line 184
bool117=null;
//line 184
im118=null;
//line 184
bool121=null;
//line 184
___arg__3.value = im3;return im122;
//line 184
label = 981; continue;
//line 184
case 981:
//line 184
bool121=null;
//line 184
im122=null;
//line 185
im125=n.ov.get_element(im1);
//line 186
im128=c[40];
//line 186
bool126=n.c_rt_lib.ne(im125, im128)
//line 186
im128=null;
//line 186
bool127=!bool126
//line 186
if (bool127) {label = 993; continue;}
//line 186
im129=c[41];
//line 186
bool126=n.c_rt_lib.ne(im125, im129)
//line 186
im129=null;
//line 186
case 993:
//line 186
bool127=null;
//line 186
bool126=!bool126
//line 186
if (bool126) {label = 1062; continue;}
//line 187
im134=c[42];
//line 187
im133=n.c_rt_lib.concat(im134,im125);;
//line 187
im134=null;
//line 187
im135=c[43];
//line 187
im132=n.c_rt_lib.concat(im133,im135);;
//line 187
im133=null;
//line 187
im135=null;
//line 187
im131=n.imm_hash({"err":im132,"path":im3,});
//line 187
im132=null;
//line 187
im130=n.c_rt_lib.ov_mk_arg(c[17],im131);;
//line 187
im131=null;
//line 187
im0=null;
//line 187
im1=null;
//line 187
im2=null;
//line 187
im8=null;
//line 187
bool9=null;
//line 187
im10=null;
//line 187
im11=null;
//line 187
im12=null;
//line 187
im17=null;
//line 187
bool18=null;
//line 187
im19=null;
//line 187
im20=null;
//line 187
bool21=null;
//line 187
im22=null;
//line 187
im23=null;
//line 187
im24=null;
//line 187
im25=null;
//line 187
im30=null;
//line 187
int31=null;
//line 187
int32=null;
//line 187
int33=null;
//line 187
bool34=null;
//line 187
im35=null;
//line 187
im37=null;
//line 187
bool38=null;
//line 187
im39=null;
//line 187
im40=null;
//line 187
im41=null;
//line 187
im53=null;
//line 187
bool54=null;
//line 187
im55=null;
//line 187
im56=null;
//line 187
bool64=null;
//line 187
im65=null;
//line 187
im67=null;
//line 187
im75=null;
//line 187
im76=null;
//line 187
im81=null;
//line 187
im89=null;
//line 187
bool90=null;
//line 187
im91=null;
//line 187
im92=null;
//line 187
im93=null;
//line 187
im99=null;
//line 187
bool100=null;
//line 187
im101=null;
//line 187
im115=null;
//line 187
im116=null;
//line 187
bool117=null;
//line 187
im118=null;
//line 187
im125=null;
//line 187
bool126=null;
//line 187
___arg__3.value = im3;return im130;
//line 188
label = 1062; continue;
//line 188
case 1062:
//line 188
bool126=null;
//line 188
im130=null;
//line 189
im8=im1
//line 190
label = 1067; continue;
//line 190
case 1067:
//line 191
im136=n.c_rt_lib.ov_mk_arg(c[14],im8);;
//line 191
im0=null;
//line 191
im1=null;
//line 191
im2=null;
//line 191
im8=null;
//line 191
bool9=null;
//line 191
im10=null;
//line 191
im11=null;
//line 191
im12=null;
//line 191
im17=null;
//line 191
bool18=null;
//line 191
im19=null;
//line 191
im20=null;
//line 191
bool21=null;
//line 191
im22=null;
//line 191
im23=null;
//line 191
im24=null;
//line 191
im25=null;
//line 191
im30=null;
//line 191
int31=null;
//line 191
int32=null;
//line 191
int33=null;
//line 191
bool34=null;
//line 191
im35=null;
//line 191
im37=null;
//line 191
bool38=null;
//line 191
im39=null;
//line 191
im40=null;
//line 191
im41=null;
//line 191
im53=null;
//line 191
bool54=null;
//line 191
im55=null;
//line 191
im56=null;
//line 191
bool64=null;
//line 191
im65=null;
//line 191
im67=null;
//line 191
im75=null;
//line 191
im76=null;
//line 191
im81=null;
//line 191
im89=null;
//line 191
bool90=null;
//line 191
im91=null;
//line 191
im92=null;
//line 191
im93=null;
//line 191
im99=null;
//line 191
bool100=null;
//line 191
im101=null;
//line 191
im115=null;
//line 191
im116=null;
//line 191
bool117=null;
//line 191
im118=null;
//line 191
im125=null;
//line 191
___arg__3.value = im3;return im136;
}}}

n.ptd.is_ref_type=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var im5=null;
var bool6=null;
var bool7=null;
var im8=null;
var im9=null;
var bool10=null;
var bool11=null;
var im12=null;
var im13=null;
var bool14=null;
var im15=null;
var bool16=null;
var im17=null;
var im18=null;
var bool19=null;
var im20=null;
var bool21=null;
var im22=null;
var bool23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var im31=null;
var im32=null;
var bool33=null;
var im34=null;
var label=null;
while (1) { switch (label) {
default:
//line 195
bool2=n.c_rt_lib.ov_is(im0,c[12]);;
//line 195
if (bool2) {label = 15; continue;}
//line 205
bool2=n.c_rt_lib.ov_is(im0,c[20]);;
//line 205
if (bool2) {label = 125; continue;}
//line 206
bool2=n.c_rt_lib.ov_is(im0,c[0]);;
//line 206
if (bool2) {label = 127; continue;}
//line 207
bool2=n.c_rt_lib.ov_is(im0,c[13]);;
//line 207
if (bool2) {label = 131; continue;}
//line 208
bool2=n.c_rt_lib.ov_is(im0,c[1]);;
//line 208
if (bool2) {label = 135; continue;}
//line 209
bool2=n.c_rt_lib.ov_is(im0,c[7]);;
//line 209
if (bool2) {label = 139; continue;}
//line 209
im3=c[22];
//line 209
im3=n.imm_arr([im3,im0,]);
//line 209
n.nl_die();
//line 195
case 15:
//line 195
im5=n.c_rt_lib.ov_as(im0,c[12]);;
//line 195
im4=im5
//line 196
bool6=n.c_rt_lib.ov_is(im1,c[12]);;
//line 196
bool6=!bool6
//line 196
bool6=!bool6
//line 196
if (bool6) {label = 34; continue;}
//line 196
bool7=false;
//line 196
im8=n.c_rt_lib.native_to_nl(bool7)
//line 196
im0=null;
//line 196
im1=null;
//line 196
bool2=null;
//line 196
im3=null;
//line 196
im4=null;
//line 196
im5=null;
//line 196
bool6=null;
//line 196
bool7=null;
//line 196
return im8;
//line 196
label = 34; continue;
//line 196
case 34:
//line 196
bool6=null;
//line 196
bool7=null;
//line 196
im8=null;
//line 197
im9=n.c_rt_lib.ov_as(im1,c[12]);;
//line 198
bool10=n.c_std_lib.is_hash(im9);
//line 198
bool10=!bool10
//line 198
if (bool10) {label = 95; continue;}
//line 199
im12=n.c_rt_lib.hash_get_value(im9,c[44]);;
//line 199
im13=n.c_rt_lib.hash_get_value(im4,c[44]);;
//line 199
bool11=n.c_rt_lib.eq(im12, im13)
//line 199
im12=null;
//line 199
im13=null;
//line 199
bool11=!bool11
//line 199
bool11=!bool11
//line 199
if (bool11) {label = 64; continue;}
//line 199
bool14=false;
//line 199
im15=n.c_rt_lib.native_to_nl(bool14)
//line 199
im0=null;
//line 199
im1=null;
//line 199
bool2=null;
//line 199
im3=null;
//line 199
im4=null;
//line 199
im5=null;
//line 199
im9=null;
//line 199
bool10=null;
//line 199
bool11=null;
//line 199
bool14=null;
//line 199
return im15;
//line 199
label = 64; continue;
//line 199
case 64:
//line 199
bool11=null;
//line 199
bool14=null;
//line 199
im15=null;
//line 200
im17=n.c_rt_lib.hash_get_value(im9,c[45]);;
//line 200
im18=n.c_rt_lib.hash_get_value(im4,c[45]);;
//line 200
bool16=n.c_rt_lib.eq(im17, im18)
//line 200
im17=null;
//line 200
im18=null;
//line 200
bool16=!bool16
//line 200
bool16=!bool16
//line 200
if (bool16) {label = 90; continue;}
//line 200
bool19=false;
//line 200
im20=n.c_rt_lib.native_to_nl(bool19)
//line 200
im0=null;
//line 200
im1=null;
//line 200
bool2=null;
//line 200
im3=null;
//line 200
im4=null;
//line 200
im5=null;
//line 200
im9=null;
//line 200
bool10=null;
//line 200
bool16=null;
//line 200
bool19=null;
//line 200
return im20;
//line 200
label = 90; continue;
//line 200
case 90:
//line 200
bool16=null;
//line 200
bool19=null;
//line 200
im20=null;
//line 201
label = 109; continue;
//line 201
case 95:
//line 202
bool21=n.c_rt_lib.eq(im9, im4)
//line 202
im22=n.c_rt_lib.native_to_nl(bool21)
//line 202
im0=null;
//line 202
im1=null;
//line 202
bool2=null;
//line 202
im3=null;
//line 202
im4=null;
//line 202
im5=null;
//line 202
im9=null;
//line 202
bool10=null;
//line 202
bool21=null;
//line 202
return im22;
//line 203
label = 109; continue;
//line 203
case 109:
//line 203
bool10=null;
//line 203
bool21=null;
//line 203
im22=null;
//line 204
bool23=true;
//line 204
im24=n.c_rt_lib.native_to_nl(bool23)
//line 204
im0=null;
//line 204
im1=null;
//line 204
bool2=null;
//line 204
im3=null;
//line 204
im4=null;
//line 204
im5=null;
//line 204
im9=null;
//line 204
bool23=null;
//line 204
return im24;
//line 205
label = 143; continue;
//line 205
case 125:
//line 206
label = 143; continue;
//line 206
case 127:
//line 206
im26=n.c_rt_lib.ov_as(im0,c[0]);;
//line 206
im25=im26
//line 207
label = 143; continue;
//line 207
case 131:
//line 207
im28=n.c_rt_lib.ov_as(im0,c[13]);;
//line 207
im27=im28
//line 208
label = 143; continue;
//line 208
case 135:
//line 208
im30=n.c_rt_lib.ov_as(im0,c[1]);;
//line 208
im29=im30
//line 209
label = 143; continue;
//line 209
case 139:
//line 209
im32=n.c_rt_lib.ov_as(im0,c[7]);;
//line 209
im31=im32
//line 210
label = 143; continue;
//line 210
case 143:
//line 211
bool33=false;
//line 211
im34=n.c_rt_lib.native_to_nl(bool33)
//line 211
im0=null;
//line 211
im1=null;
//line 211
bool2=null;
//line 211
im3=null;
//line 211
im4=null;
//line 211
im5=null;
//line 211
im9=null;
//line 211
bool23=null;
//line 211
im24=null;
//line 211
im25=null;
//line 211
im26=null;
//line 211
im27=null;
//line 211
im28=null;
//line 211
im29=null;
//line 211
im30=null;
//line 211
im31=null;
//line 211
im32=null;
//line 211
bool33=null;
//line 211
return im34;
//line 211
im0=null;
//line 211
im1=null;
//line 211
bool2=null;
//line 211
im3=null;
//line 211
im4=null;
//line 211
im5=null;
//line 211
im9=null;
//line 211
bool23=null;
//line 211
im24=null;
//line 211
im25=null;
//line 211
im26=null;
//line 211
im27=null;
//line 211
im28=null;
//line 211
im29=null;
//line 211
im30=null;
//line 211
im31=null;
//line 211
im32=null;
//line 211
bool33=null;
//line 211
im34=null;
//line 211
return null;
}}}

n.ptd.__dyn_is_ref_type=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.is_ref_type(arg0, arg1)
return ret;
}

function _prv_exec(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 215
var call_0_2=new n.imm_ref(im1);im2=n.c_std_lib.exec(im0,call_0_2);im1=call_0_2.value;call_0_2=null;
//line 215
im0=null;
//line 215
im1=null;
//line 215
return im2;
//line 215
im0=null;
//line 215
im1=null;
//line 215
im2=null;
//line 215
return null;
}}}

n.ptd.cast_t=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 220
im2=n.ptd.ptd_im();
//line 221
im3=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("cast_error_t"),});
//line 221
im3=n.c_rt_lib.ov_mk_arg(c[12],im3);;
//line 221
im1=n.imm_hash({"ok":im2,"err":im3,});
//line 221
im2=null;
//line 221
im3=null;
//line 221
im0=n.ptd.var(im1);
//line 221
im1=null;
//line 221
return im0;
//line 221
im0=null;
//line 221
return null;
}}}

n.ptd.__dyn_cast_t=function(arr) {
var ret = n.ptd.cast_t()
return ret;
}

n.ptd.try_cast=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 226
im2=n.ptd.try_dynamic_cast(im0,im1);
//line 226
im0=null;
//line 226
im1=null;
//line 226
return im2;
}}}

n.ptd.__dyn_try_cast=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.try_cast(arg0, arg1)
return ret;
}

n.ptd.try_dynamic_cast=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var int4=null;
var int5=null;
var im6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 229
im2=_prv_try_dynamic_cast(im0,im1);
//line 230
int4=n.c_rt_lib.array_len(im2);;
//line 230
int5=0;
//line 230
bool3=int4==int5;
//line 230
int4=null;
//line 230
int5=null;
//line 230
bool3=!bool3
//line 230
if (bool3) {label = 15; continue;}
//line 231
im6=n.c_rt_lib.ov_mk_arg(c[14],im1);;
//line 231
im0=null;
//line 231
im1=null;
//line 231
im2=null;
//line 231
bool3=null;
//line 231
return im6;
//line 232
label = 15; continue;
//line 232
case 15:
//line 232
bool3=null;
//line 232
im6=null;
//line 233
im7=n.c_rt_lib.ov_mk_arg(c[17],im2);;
//line 233
im0=null;
//line 233
im1=null;
//line 233
im2=null;
//line 233
return im7;
}}}

n.ptd.__dyn_try_dynamic_cast=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.ptd.try_dynamic_cast(arg0, arg1)
return ret;
}

n.ptd.imm_kind_t=function() {
var im0=null;
var im1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 238
im2=n.ptd.none();
//line 239
im3=n.ptd.none();
//line 240
im4=n.ptd.none();
//line 241
im5=n.ptd.none();
//line 242
im6=n.ptd.none();
//line 242
im1=n.imm_hash({"int":im2,"string":im3,"hash":im4,"variant":im5,"array":im6,});
//line 242
im2=null;
//line 242
im3=null;
//line 242
im4=null;
//line 242
im5=null;
//line 242
im6=null;
//line 242
im0=n.ptd.var(im1);
//line 242
im1=null;
//line 242
return im0;
//line 242
im0=null;
//line 242
return null;
}}}

n.ptd.__dyn_imm_kind_t=function(arr) {
var ret = n.ptd.imm_kind_t()
return ret;
}

n.ptd.cast_error_t=function() {
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
var label=null;
while (1) { switch (label) {
default:
//line 249
im5=n.ptd.string();
//line 250
im6=n.ptd.int();
//line 251
im7=n.ptd.string();
//line 252
im8=n.ptd.string();
//line 253
im9=n.ptd.ptd_im();
//line 253
im4=n.imm_hash({"hash_key":im5,"array_index":im6,"rec_key":im7,"variant_value":im8,"type_ref":im9,});
//line 253
im5=null;
//line 253
im6=null;
//line 253
im7=null;
//line 253
im8=null;
//line 253
im9=null;
//line 253
im3=n.ptd.var(im4);
//line 253
im4=null;
//line 256
im12=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 256
im12=n.c_rt_lib.ov_mk_arg(c[12],im12);;
//line 257
im13=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 257
im13=n.c_rt_lib.ov_mk_arg(c[12],im13);;
//line 258
im14=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 258
im14=n.c_rt_lib.ov_mk_arg(c[12],im14);;
//line 259
im15=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 259
im15=n.c_rt_lib.ov_mk_arg(c[12],im15);;
//line 260
im16=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 260
im16=n.c_rt_lib.ov_mk_arg(c[12],im16);;
//line 261
im17=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 261
im17=n.c_rt_lib.ov_mk_arg(c[12],im17);;
//line 262
im18=n.imm_hash({"module":n.imm_str("ptd"),"name":n.imm_str("imm_kind_t"),});
//line 262
im18=n.c_rt_lib.ov_mk_arg(c[12],im18);;
//line 263
im19=n.ptd.int();
//line 264
im20=n.ptd.string();
//line 265
im21=n.ptd.string();
//line 266
im22=n.ptd.string();
//line 267
im23=n.ptd.string();
//line 267
im11=n.imm_hash({"is_not_type":im12,"hash_expected":im13,"array_expected":im14,"rec_expected":im15,"int_expected":im16,"string_expected":im17,"variant_expected":im18,"rec_size":im19,"no_key":im20,"unknown_case":im21,"has_value":im22,"no_value":im23,});
//line 267
im12=null;
//line 267
im13=null;
//line 267
im14=null;
//line 267
im15=null;
//line 267
im16=null;
//line 267
im17=null;
//line 267
im18=null;
//line 267
im19=null;
//line 267
im20=null;
//line 267
im21=null;
//line 267
im22=null;
//line 267
im23=null;
//line 267
im10=n.ptd.var(im11);
//line 267
im11=null;
//line 267
im2=n.imm_hash({"path":im3,"error":im10,});
//line 267
im3=null;
//line 267
im10=null;
//line 267
im1=n.ptd.var(im2);
//line 267
im2=null;
//line 267
im0=n.ptd.arr(im1);
//line 267
im1=null;
//line 267
return im0;
//line 267
im0=null;
//line 267
return null;
}}}

n.ptd.__dyn_cast_error_t=function(arr) {
var ret = n.ptd.cast_error_t()
return ret;
}

n.ptd.get_imm_kind=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var bool3=null;
var im4=null;
var bool5=null;
var im6=null;
var bool7=null;
var im8=null;
var bool9=null;
var im10=null;
var im11=null;
var label=null;
while (1) { switch (label) {
default:
//line 272
bool1=n.c_std_lib.is_int(im0);
//line 272
bool1=!bool1
//line 272
if (bool1) {label = 8; continue;}
//line 272
im2=c[46]
//line 272
im0=null;
//line 272
bool1=null;
//line 272
return im2;
//line 272
label = 8; continue;
//line 272
case 8:
//line 272
bool1=null;
//line 272
im2=null;
//line 273
bool3=n.c_std_lib.is_string(im0);
//line 273
bool3=!bool3
//line 273
if (bool3) {label = 19; continue;}
//line 273
im4=c[47]
//line 273
im0=null;
//line 273
bool3=null;
//line 273
return im4;
//line 273
label = 19; continue;
//line 273
case 19:
//line 273
bool3=null;
//line 273
im4=null;
//line 274
bool5=n.c_std_lib.is_variant(im0);
//line 274
bool5=!bool5
//line 274
if (bool5) {label = 30; continue;}
//line 274
im6=c[48]
//line 274
im0=null;
//line 274
bool5=null;
//line 274
return im6;
//line 274
label = 30; continue;
//line 274
case 30:
//line 274
bool5=null;
//line 274
im6=null;
//line 275
bool7=n.c_std_lib.is_hash(im0);
//line 275
bool7=!bool7
//line 275
if (bool7) {label = 41; continue;}
//line 275
im8=c[49]
//line 275
im0=null;
//line 275
bool7=null;
//line 275
return im8;
//line 275
label = 41; continue;
//line 275
case 41:
//line 275
bool7=null;
//line 275
im8=null;
//line 276
bool9=n.c_std_lib.is_array(im0);
//line 276
bool9=!bool9
//line 276
if (bool9) {label = 52; continue;}
//line 276
im10=c[50]
//line 276
im0=null;
//line 276
bool9=null;
//line 276
return im10;
//line 276
label = 52; continue;
//line 276
case 52:
//line 276
bool9=null;
//line 276
im10=null;
//line 277
im11=n.imm_arr([]);
//line 277
n.nl_die();
}}}

n.ptd.__dyn_get_imm_kind=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.get_imm_kind(arg0)
return ret;
}

function _prv_try_dynamic_cast(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var bool7=null;
var im8=null;
var im9=null;
var im10=null;
var bool11=null;
var im12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var bool17=null;
var im18=null;
var im19=null;
var im20=null;
var bool21=null;
var int22=null;
var int23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var bool28=null;
var im29=null;
var im30=null;
var im31=null;
var im32=null;
var int33=null;
var int34=null;
var int35=null;
var bool36=null;
var im37=null;
var im38=null;
var bool39=null;
var int40=null;
var int41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var im46=null;
var bool47=null;
var im48=null;
var im49=null;
var im50=null;
var im51=null;
var bool52=null;
var int53=null;
var int54=null;
var im55=null;
var im56=null;
var im57=null;
var int58=null;
var im59=null;
var im60=null;
var bool61=null;
var im62=null;
var im63=null;
var bool64=null;
var im65=null;
var im66=null;
var im67=null;
var im68=null;
var im69=null;
var bool70=null;
var int71=null;
var int72=null;
var im73=null;
var im74=null;
var bool75=null;
var im76=null;
var im77=null;
var im78=null;
var im79=null;
var bool80=null;
var im81=null;
var im82=null;
var im83=null;
var im84=null;
var im85=null;
var im86=null;
var bool87=null;
var im88=null;
var im89=null;
var im90=null;
var im91=null;
var im92=null;
var bool93=null;
var im94=null;
var im95=null;
var im96=null;
var im97=null;
var im98=null;
var im99=null;
var bool100=null;
var im101=null;
var im102=null;
var im103=null;
var bool104=null;
var im105=null;
var im106=null;
var im107=null;
var im108=null;
var im109=null;
var im110=null;
var im111=null;
var im112=null;
var bool113=null;
var int114=null;
var int115=null;
var im116=null;
var im117=null;
var im118=null;
var im119=null;
var bool120=null;
var im121=null;
var im122=null;
var im123=null;
var im124=null;
var im125=null;
var im126=null;
var im127=null;
var im128=null;
var im129=null;
var im130=null;
var im131=null;
var bool132=null;
var int133=null;
var int134=null;
var im135=null;
var im136=null;
var im137=null;
var label=null;
while (1) { switch (label) {
default:
//line 280
bool2=n.c_std_lib.is_variant(im0);
//line 280
bool2=!bool2
//line 280
bool2=!bool2
//line 280
if (bool2) {label = 16; continue;}
//line 280
im6=n.ptd.get_imm_kind(im0);
//line 280
im5=n.c_rt_lib.ov_mk_arg(c[51],im6);;
//line 280
im6=null;
//line 280
im4=n.c_rt_lib.ov_mk_arg(c[52],im5);;
//line 280
im5=null;
//line 280
im3=n.imm_arr([im4,]);
//line 280
im4=null;
//line 280
im0=null;
//line 280
im1=null;
//line 280
bool2=null;
//line 280
return im3;
//line 280
label = 16; continue;
//line 280
case 16:
//line 280
bool2=null;
//line 280
im3=null;
//line 281
bool7=n.c_rt_lib.ov_is(im0,c[7]);;
//line 281
if (bool7) {label = 38; continue;}
//line 290
bool7=n.c_rt_lib.ov_is(im0,c[0]);;
//line 290
if (bool7) {label = 103; continue;}
//line 299
bool7=n.c_rt_lib.ov_is(im0,c[1]);;
//line 299
if (bool7) {label = 186; continue;}
//line 310
bool7=n.c_rt_lib.ov_is(im0,c[19]);;
//line 310
if (bool7) {label = 363; continue;}
//line 312
bool7=n.c_rt_lib.ov_is(im0,c[18]);;
//line 312
if (bool7) {label = 407; continue;}
//line 314
bool7=n.c_rt_lib.ov_is(im0,c[13]);;
//line 314
if (bool7) {label = 451; continue;}
//line 329
bool7=n.c_rt_lib.ov_is(im0,c[20]);;
//line 329
if (bool7) {label = 727; continue;}
//line 330
bool7=n.c_rt_lib.ov_is(im0,c[12]);;
//line 330
if (bool7) {label = 729; continue;}
//line 330
im8=c[22];
//line 330
im8=n.imm_arr([im8,im0,]);
//line 330
n.nl_die();
//line 281
case 38:
//line 281
im10=n.c_rt_lib.ov_as(im0,c[7]);;
//line 281
im9=im10
//line 282
bool11=n.c_std_lib.is_hash(im1);
//line 282
bool11=!bool11
//line 282
bool11=!bool11
//line 282
if (bool11) {label = 61; continue;}
//line 282
im15=n.ptd.get_imm_kind(im0);
//line 282
im14=n.c_rt_lib.ov_mk_arg(c[53],im15);;
//line 282
im15=null;
//line 282
im13=n.c_rt_lib.ov_mk_arg(c[52],im14);;
//line 282
im14=null;
//line 282
im12=n.imm_arr([im13,]);
//line 282
im13=null;
//line 282
im0=null;
//line 282
im1=null;
//line 282
bool7=null;
//line 282
im8=null;
//line 282
im9=null;
//line 282
im10=null;
//line 282
bool11=null;
//line 282
return im12;
//line 282
label = 61; continue;
//line 282
case 61:
//line 282
bool11=null;
//line 282
im12=null;
//line 283
im19=n.c_rt_lib.init_iter(im1);;
//line 283
case 65:
//line 283
bool17=n.c_rt_lib.is_end_hash(im19);;
//line 283
if (bool17) {label = 101; continue;}
//line 283
im16=n.c_rt_lib.get_key_iter(im19);;
//line 283
im18=n.c_rt_lib.hash_get_value(im1,im16);
//line 284
im20=_prv_try_dynamic_cast(im9,im18);
//line 285
int22=n.c_rt_lib.array_len(im20);;
//line 285
int23=0;
//line 285
bool21=int22>int23;
//line 285
int22=null;
//line 285
int23=null;
//line 285
bool21=!bool21
//line 285
if (bool21) {label = 96; continue;}
//line 286
im25=n.c_rt_lib.ov_mk_arg(c[54],im16);;
//line 286
im24=n.c_rt_lib.ov_mk_arg(c[55],im25);;
//line 286
im25=null;
//line 286
var call_25_1=new n.imm_ref(im20);n.array.push(call_25_1,im24);im20=call_25_1.value;call_25_1=null;
//line 286
im24=null;
//line 287
im0=null;
//line 287
im1=null;
//line 287
bool7=null;
//line 287
im8=null;
//line 287
im9=null;
//line 287
im10=null;
//line 287
im16=null;
//line 287
bool17=null;
//line 287
im18=null;
//line 287
im19=null;
//line 287
bool21=null;
//line 287
return im20;
//line 288
label = 96; continue;
//line 288
case 96:
//line 288
bool21=null;
//line 288
im20=null;
//line 289
im19=n.c_rt_lib.next_iter(im19);;
//line 289
label = 65; continue;
//line 289
case 101:
//line 290
label = 791; continue;
//line 290
case 103:
//line 290
im27=n.c_rt_lib.ov_as(im0,c[0]);;
//line 290
im26=im27
//line 291
bool28=n.c_std_lib.is_array(im1);
//line 291
bool28=!bool28
//line 291
bool28=!bool28
//line 291
if (bool28) {label = 133; continue;}
//line 291
im32=n.ptd.get_imm_kind(im0);
//line 291
im31=n.c_rt_lib.ov_mk_arg(c[56],im32);;
//line 291
im32=null;
//line 291
im30=n.c_rt_lib.ov_mk_arg(c[52],im31);;
//line 291
im31=null;
//line 291
im29=n.imm_arr([im30,]);
//line 291
im30=null;
//line 291
im0=null;
//line 291
im1=null;
//line 291
bool7=null;
//line 291
im8=null;
//line 291
im9=null;
//line 291
im10=null;
//line 291
im16=null;
//line 291
bool17=null;
//line 291
im18=null;
//line 291
im19=null;
//line 291
im20=null;
//line 291
im26=null;
//line 291
im27=null;
//line 291
bool28=null;
//line 291
return im29;
//line 291
label = 133; continue;
//line 291
case 133:
//line 291
bool28=null;
//line 291
im29=null;
//line 292
int33=n.c_rt_lib.array_len(im1);;
//line 292
int34=0;
//line 292
int35=1;
//line 292
case 139:
//line 292
bool36=int34>=int33;
//line 292
if (bool36) {label = 184; continue;}
//line 293
im38=im1.get_index(int34);
//line 293
im37=_prv_try_dynamic_cast(im26,im38);
//line 293
im38=null;
//line 294
int40=n.c_rt_lib.array_len(im37);;
//line 294
int41=0;
//line 294
bool39=int40>int41;
//line 294
int40=null;
//line 294
int41=null;
//line 294
bool39=!bool39
//line 294
if (bool39) {label = 179; continue;}
//line 295
im44=n.imm_int(int34)
//line 295
im43=n.c_rt_lib.ov_mk_arg(c[57],im44);;
//line 295
im44=null;
//line 295
im42=n.c_rt_lib.ov_mk_arg(c[55],im43);;
//line 295
im43=null;
//line 295
var call_37_1=new n.imm_ref(im37);n.array.push(call_37_1,im42);im37=call_37_1.value;call_37_1=null;
//line 295
im42=null;
//line 296
im0=null;
//line 296
im1=null;
//line 296
bool7=null;
//line 296
im8=null;
//line 296
im9=null;
//line 296
im10=null;
//line 296
im16=null;
//line 296
bool17=null;
//line 296
im18=null;
//line 296
im19=null;
//line 296
im20=null;
//line 296
im26=null;
//line 296
im27=null;
//line 296
int33=null;
//line 296
int34=null;
//line 296
int35=null;
//line 296
bool36=null;
//line 296
bool39=null;
//line 296
return im37;
//line 297
label = 179; continue;
//line 297
case 179:
//line 297
bool39=null;
//line 297
im37=null;
//line 298
int34=Math.floor(int34+int35);
//line 298
label = 139; continue;
//line 298
case 184:
//line 299
label = 791; continue;
//line 299
case 186:
//line 299
im46=n.c_rt_lib.ov_as(im0,c[1]);;
//line 299
im45=im46
//line 300
bool47=n.c_std_lib.is_hash(im1);
//line 300
bool47=!bool47
//line 300
bool47=!bool47
//line 300
if (bool47) {label = 223; continue;}
//line 300
im51=n.ptd.get_imm_kind(im0);
//line 300
im50=n.c_rt_lib.ov_mk_arg(c[58],im51);;
//line 300
im51=null;
//line 300
im49=n.c_rt_lib.ov_mk_arg(c[52],im50);;
//line 300
im50=null;
//line 300
im48=n.imm_arr([im49,]);
//line 300
im49=null;
//line 300
im0=null;
//line 300
im1=null;
//line 300
bool7=null;
//line 300
im8=null;
//line 300
im9=null;
//line 300
im10=null;
//line 300
im16=null;
//line 300
bool17=null;
//line 300
im18=null;
//line 300
im19=null;
//line 300
im20=null;
//line 300
im26=null;
//line 300
im27=null;
//line 300
int33=null;
//line 300
int34=null;
//line 300
int35=null;
//line 300
bool36=null;
//line 300
im37=null;
//line 300
im45=null;
//line 300
im46=null;
//line 300
bool47=null;
//line 300
return im48;
//line 300
label = 223; continue;
//line 300
case 223:
//line 300
bool47=null;
//line 300
im48=null;
//line 301
int53=n.hash.size(im45);
//line 301
int54=n.hash.size(im1);
//line 301
bool52=int53==int54;
//line 301
int53=null;
//line 301
int54=null;
//line 301
bool52=!bool52
//line 301
bool52=!bool52
//line 301
if (bool52) {label = 266; continue;}
//line 301
int58=n.hash.size(im1);
//line 301
im59=n.imm_int(int58)
//line 301
im57=n.c_rt_lib.ov_mk_arg(c[59],im59);;
//line 301
int58=null;
//line 301
im59=null;
//line 301
im56=n.c_rt_lib.ov_mk_arg(c[52],im57);;
//line 301
im57=null;
//line 301
im55=n.imm_arr([im56,]);
//line 301
im56=null;
//line 301
im0=null;
//line 301
im1=null;
//line 301
bool7=null;
//line 301
im8=null;
//line 301
im9=null;
//line 301
im10=null;
//line 301
im16=null;
//line 301
bool17=null;
//line 301
im18=null;
//line 301
im19=null;
//line 301
im20=null;
//line 301
im26=null;
//line 301
im27=null;
//line 301
int33=null;
//line 301
int34=null;
//line 301
int35=null;
//line 301
bool36=null;
//line 301
im37=null;
//line 301
im45=null;
//line 301
im46=null;
//line 301
bool52=null;
//line 301
return im55;
//line 301
label = 266; continue;
//line 301
case 266:
//line 301
bool52=null;
//line 301
im55=null;
//line 302
im63=n.c_rt_lib.init_iter(im45);;
//line 302
case 270:
//line 302
bool61=n.c_rt_lib.is_end_hash(im63);;
//line 302
if (bool61) {label = 361; continue;}
//line 302
im60=n.c_rt_lib.get_key_iter(im63);;
//line 302
im62=n.c_rt_lib.hash_get_value(im45,im60);
//line 303
bool64=n.hash.has_key(im1,im60);
//line 303
bool64=!bool64
//line 303
bool64=!bool64
//line 303
if (bool64) {label = 311; continue;}
//line 303
im67=n.c_rt_lib.ov_mk_arg(c[60],im60);;
//line 303
im66=n.c_rt_lib.ov_mk_arg(c[52],im67);;
//line 303
im67=null;
//line 303
im65=n.imm_arr([im66,]);
//line 303
im66=null;
//line 303
im0=null;
//line 303
im1=null;
//line 303
bool7=null;
//line 303
im8=null;
//line 303
im9=null;
//line 303
im10=null;
//line 303
im16=null;
//line 303
bool17=null;
//line 303
im18=null;
//line 303
im19=null;
//line 303
im20=null;
//line 303
im26=null;
//line 303
im27=null;
//line 303
int33=null;
//line 303
int34=null;
//line 303
int35=null;
//line 303
bool36=null;
//line 303
im37=null;
//line 303
im45=null;
//line 303
im46=null;
//line 303
im60=null;
//line 303
bool61=null;
//line 303
im62=null;
//line 303
im63=null;
//line 303
bool64=null;
//line 303
return im65;
//line 303
label = 311; continue;
//line 303
case 311:
//line 303
bool64=null;
//line 303
im65=null;
//line 304
im69=n.hash.get_value(im1,im60);
//line 304
im68=_prv_try_dynamic_cast(im62,im69);
//line 304
im69=null;
//line 305
int71=n.c_rt_lib.array_len(im68);;
//line 305
int72=0;
//line 305
bool70=int71>int72;
//line 305
int71=null;
//line 305
int72=null;
//line 305
bool70=!bool70
//line 305
if (bool70) {label = 356; continue;}
//line 306
im74=n.c_rt_lib.ov_mk_arg(c[61],im60);;
//line 306
im73=n.c_rt_lib.ov_mk_arg(c[55],im74);;
//line 306
im74=null;
//line 306
var call_60_1=new n.imm_ref(im68);n.array.push(call_60_1,im73);im68=call_60_1.value;call_60_1=null;
//line 306
im73=null;
//line 307
im0=null;
//line 307
im1=null;
//line 307
bool7=null;
//line 307
im8=null;
//line 307
im9=null;
//line 307
im10=null;
//line 307
im16=null;
//line 307
bool17=null;
//line 307
im18=null;
//line 307
im19=null;
//line 307
im20=null;
//line 307
im26=null;
//line 307
im27=null;
//line 307
int33=null;
//line 307
int34=null;
//line 307
int35=null;
//line 307
bool36=null;
//line 307
im37=null;
//line 307
im45=null;
//line 307
im46=null;
//line 307
im60=null;
//line 307
bool61=null;
//line 307
im62=null;
//line 307
im63=null;
//line 307
bool70=null;
//line 307
return im68;
//line 308
label = 356; continue;
//line 308
case 356:
//line 308
bool70=null;
//line 308
im68=null;
//line 309
im63=n.c_rt_lib.next_iter(im63);;
//line 309
label = 270; continue;
//line 309
case 361:
//line 310
label = 791; continue;
//line 310
case 363:
//line 311
bool75=n.c_std_lib.is_int(im1);
//line 311
bool75=!bool75
//line 311
bool75=!bool75
//line 311
if (bool75) {label = 403; continue;}
//line 311
im79=n.ptd.get_imm_kind(im0);
//line 311
im78=n.c_rt_lib.ov_mk_arg(c[62],im79);;
//line 311
im79=null;
//line 311
im77=n.c_rt_lib.ov_mk_arg(c[52],im78);;
//line 311
im78=null;
//line 311
im76=n.imm_arr([im77,]);
//line 311
im77=null;
//line 311
im0=null;
//line 311
im1=null;
//line 311
bool7=null;
//line 311
im8=null;
//line 311
im9=null;
//line 311
im10=null;
//line 311
im16=null;
//line 311
bool17=null;
//line 311
im18=null;
//line 311
im19=null;
//line 311
im20=null;
//line 311
im26=null;
//line 311
im27=null;
//line 311
int33=null;
//line 311
int34=null;
//line 311
int35=null;
//line 311
bool36=null;
//line 311
im37=null;
//line 311
im45=null;
//line 311
im46=null;
//line 311
im60=null;
//line 311
bool61=null;
//line 311
im62=null;
//line 311
im63=null;
//line 311
im68=null;
//line 311
bool75=null;
//line 311
return im76;
//line 311
label = 403; continue;
//line 311
case 403:
//line 311
bool75=null;
//line 311
im76=null;
//line 312
label = 791; continue;
//line 312
case 407:
//line 313
bool80=n.c_std_lib.is_string(im1);
//line 313
bool80=!bool80
//line 313
bool80=!bool80
//line 313
if (bool80) {label = 447; continue;}
//line 313
im84=n.ptd.get_imm_kind(im0);
//line 313
im83=n.c_rt_lib.ov_mk_arg(c[63],im84);;
//line 313
im84=null;
//line 313
im82=n.c_rt_lib.ov_mk_arg(c[52],im83);;
//line 313
im83=null;
//line 313
im81=n.imm_arr([im82,]);
//line 313
im82=null;
//line 313
im0=null;
//line 313
im1=null;
//line 313
bool7=null;
//line 313
im8=null;
//line 313
im9=null;
//line 313
im10=null;
//line 313
im16=null;
//line 313
bool17=null;
//line 313
im18=null;
//line 313
im19=null;
//line 313
im20=null;
//line 313
im26=null;
//line 313
im27=null;
//line 313
int33=null;
//line 313
int34=null;
//line 313
int35=null;
//line 313
bool36=null;
//line 313
im37=null;
//line 313
im45=null;
//line 313
im46=null;
//line 313
im60=null;
//line 313
bool61=null;
//line 313
im62=null;
//line 313
im63=null;
//line 313
im68=null;
//line 313
bool80=null;
//line 313
return im81;
//line 313
label = 447; continue;
//line 313
case 447:
//line 313
bool80=null;
//line 313
im81=null;
//line 314
label = 791; continue;
//line 314
case 451:
//line 314
im86=n.c_rt_lib.ov_as(im0,c[13]);;
//line 314
im85=im86
//line 315
bool87=n.c_std_lib.is_variant(im1);
//line 315
bool87=!bool87
//line 315
bool87=!bool87
//line 315
if (bool87) {label = 495; continue;}
//line 315
im91=n.ptd.get_imm_kind(im0);
//line 315
im90=n.c_rt_lib.ov_mk_arg(c[64],im91);;
//line 315
im91=null;
//line 315
im89=n.c_rt_lib.ov_mk_arg(c[52],im90);;
//line 315
im90=null;
//line 315
im88=n.imm_arr([im89,]);
//line 315
im89=null;
//line 315
im0=null;
//line 315
im1=null;
//line 315
bool7=null;
//line 315
im8=null;
//line 315
im9=null;
//line 315
im10=null;
//line 315
im16=null;
//line 315
bool17=null;
//line 315
im18=null;
//line 315
im19=null;
//line 315
im20=null;
//line 315
im26=null;
//line 315
im27=null;
//line 315
int33=null;
//line 315
int34=null;
//line 315
int35=null;
//line 315
bool36=null;
//line 315
im37=null;
//line 315
im45=null;
//line 315
im46=null;
//line 315
im60=null;
//line 315
bool61=null;
//line 315
im62=null;
//line 315
im63=null;
//line 315
im68=null;
//line 315
im85=null;
//line 315
im86=null;
//line 315
bool87=null;
//line 315
return im88;
//line 315
label = 495; continue;
//line 315
case 495:
//line 315
bool87=null;
//line 315
im88=null;
//line 316
im92=n.ov.get_element(im1);
//line 317
bool93=n.hash.has_key(im85,im92);
//line 317
bool93=!bool93
//line 317
bool93=!bool93
//line 317
if (bool93) {label = 543; continue;}
//line 317
im98=c[65];
//line 317
im97=n.c_rt_lib.concat(im92,im98);;
//line 317
im98=null;
//line 317
im96=n.c_rt_lib.ov_mk_arg(c[66],im97);;
//line 317
im97=null;
//line 317
im95=n.c_rt_lib.ov_mk_arg(c[52],im96);;
//line 317
im96=null;
//line 317
im94=n.imm_arr([im95,]);
//line 317
im95=null;
//line 317
im0=null;
//line 317
im1=null;
//line 317
bool7=null;
//line 317
im8=null;
//line 317
im9=null;
//line 317
im10=null;
//line 317
im16=null;
//line 317
bool17=null;
//line 317
im18=null;
//line 317
im19=null;
//line 317
im20=null;
//line 317
im26=null;
//line 317
im27=null;
//line 317
int33=null;
//line 317
int34=null;
//line 317
int35=null;
//line 317
bool36=null;
//line 317
im37=null;
//line 317
im45=null;
//line 317
im46=null;
//line 317
im60=null;
//line 317
bool61=null;
//line 317
im62=null;
//line 317
im63=null;
//line 317
im68=null;
//line 317
im85=null;
//line 317
im86=null;
//line 317
im92=null;
//line 317
bool93=null;
//line 317
return im94;
//line 317
label = 543; continue;
//line 317
case 543:
//line 317
bool93=null;
//line 317
im94=null;
//line 318
im99=n.hash.get_value(im85,im92);
//line 319
bool100=n.c_rt_lib.ov_is(im99,c[11]);;
//line 319
if (bool100) {label = 554; continue;}
//line 326
bool100=n.c_rt_lib.ov_is(im99,c[35]);;
//line 326
if (bool100) {label = 669; continue;}
//line 326
im101=c[22];
//line 326
im101=n.imm_arr([im101,im99,]);
//line 326
n.nl_die();
//line 319
case 554:
//line 319
im103=n.c_rt_lib.ov_as(im99,c[11]);;
//line 319
im102=im103
//line 320
im105=n.ov.has_value(im1);
//line 320
bool104=n.c_rt_lib.check_true_native(im105);;
//line 320
im105=null;
//line 320
bool104=!bool104
//line 320
bool104=!bool104
//line 320
if (bool104) {label = 608; continue;}
//line 320
im110=c[65];
//line 320
im109=n.c_rt_lib.concat(im92,im110);;
//line 320
im110=null;
//line 320
im108=n.c_rt_lib.ov_mk_arg(c[67],im109);;
//line 320
im109=null;
//line 320
im107=n.c_rt_lib.ov_mk_arg(c[52],im108);;
//line 320
im108=null;
//line 320
im106=n.imm_arr([im107,]);
//line 320
im107=null;
//line 320
im0=null;
//line 320
im1=null;
//line 320
bool7=null;
//line 320
im8=null;
//line 320
im9=null;
//line 320
im10=null;
//line 320
im16=null;
//line 320
bool17=null;
//line 320
im18=null;
//line 320
im19=null;
//line 320
im20=null;
//line 320
im26=null;
//line 320
im27=null;
//line 320
int33=null;
//line 320
int34=null;
//line 320
int35=null;
//line 320
bool36=null;
//line 320
im37=null;
//line 320
im45=null;
//line 320
im46=null;
//line 320
im60=null;
//line 320
bool61=null;
//line 320
im62=null;
//line 320
im63=null;
//line 320
im68=null;
//line 320
im85=null;
//line 320
im86=null;
//line 320
im92=null;
//line 320
im99=null;
//line 320
bool100=null;
//line 320
im101=null;
//line 320
im102=null;
//line 320
im103=null;
//line 320
bool104=null;
//line 320
return im106;
//line 320
label = 608; continue;
//line 320
case 608:
//line 320
bool104=null;
//line 320
im106=null;
//line 321
im112=n.ov.get_value(im1);
//line 321
im111=_prv_try_dynamic_cast(im102,im112);
//line 321
im112=null;
//line 322
int114=n.c_rt_lib.array_len(im111);;
//line 322
int115=0;
//line 322
bool113=int114>int115;
//line 322
int114=null;
//line 322
int115=null;
//line 322
bool113=!bool113
//line 322
if (bool113) {label = 666; continue;}
//line 323
im119=c[65];
//line 323
im118=n.c_rt_lib.concat(im92,im119);;
//line 323
im119=null;
//line 323
im117=n.c_rt_lib.ov_mk_arg(c[68],im118);;
//line 323
im118=null;
//line 323
im116=n.c_rt_lib.ov_mk_arg(c[55],im117);;
//line 323
im117=null;
//line 323
var call_95_1=new n.imm_ref(im111);n.array.push(call_95_1,im116);im111=call_95_1.value;call_95_1=null;
//line 323
im116=null;
//line 324
im0=null;
//line 324
im1=null;
//line 324
bool7=null;
//line 324
im8=null;
//line 324
im9=null;
//line 324
im10=null;
//line 324
im16=null;
//line 324
bool17=null;
//line 324
im18=null;
//line 324
im19=null;
//line 324
im20=null;
//line 324
im26=null;
//line 324
im27=null;
//line 324
int33=null;
//line 324
int34=null;
//line 324
int35=null;
//line 324
bool36=null;
//line 324
im37=null;
//line 324
im45=null;
//line 324
im46=null;
//line 324
im60=null;
//line 324
bool61=null;
//line 324
im62=null;
//line 324
im63=null;
//line 324
im68=null;
//line 324
im85=null;
//line 324
im86=null;
//line 324
im92=null;
//line 324
im99=null;
//line 324
bool100=null;
//line 324
im101=null;
//line 324
im102=null;
//line 324
im103=null;
//line 324
bool113=null;
//line 324
return im111;
//line 325
label = 666; continue;
//line 325
case 666:
//line 325
bool113=null;
//line 326
label = 725; continue;
//line 326
case 669:
//line 327
im121=n.ov.has_value(im1);
//line 327
bool120=n.c_rt_lib.check_true_native(im121);;
//line 327
im121=null;
//line 327
bool120=!bool120
//line 327
if (bool120) {label = 721; continue;}
//line 327
im126=c[65];
//line 327
im125=n.c_rt_lib.concat(im92,im126);;
//line 327
im126=null;
//line 327
im124=n.c_rt_lib.ov_mk_arg(c[69],im125);;
//line 327
im125=null;
//line 327
im123=n.c_rt_lib.ov_mk_arg(c[52],im124);;
//line 327
im124=null;
//line 327
im122=n.imm_arr([im123,]);
//line 327
im123=null;
//line 327
im0=null;
//line 327
im1=null;
//line 327
bool7=null;
//line 327
im8=null;
//line 327
im9=null;
//line 327
im10=null;
//line 327
im16=null;
//line 327
bool17=null;
//line 327
im18=null;
//line 327
im19=null;
//line 327
im20=null;
//line 327
im26=null;
//line 327
im27=null;
//line 327
int33=null;
//line 327
int34=null;
//line 327
int35=null;
//line 327
bool36=null;
//line 327
im37=null;
//line 327
im45=null;
//line 327
im46=null;
//line 327
im60=null;
//line 327
bool61=null;
//line 327
im62=null;
//line 327
im63=null;
//line 327
im68=null;
//line 327
im85=null;
//line 327
im86=null;
//line 327
im92=null;
//line 327
im99=null;
//line 327
bool100=null;
//line 327
im101=null;
//line 327
im102=null;
//line 327
im103=null;
//line 327
im111=null;
//line 327
bool120=null;
//line 327
return im122;
//line 327
label = 721; continue;
//line 327
case 721:
//line 327
bool120=null;
//line 327
im122=null;
//line 328
label = 725; continue;
//line 328
case 725:
//line 329
label = 791; continue;
//line 329
case 727:
//line 330
label = 791; continue;
//line 330
case 729:
//line 330
im128=n.c_rt_lib.ov_as(im0,c[12]);;
//line 330
im127=im128
//line 331
im131=n.imm_arr([]);
//line 331
im130=_prv_exec(im0,im131);
//line 331
im131=null;
//line 331
im129=_prv_try_dynamic_cast(im130,im1);
//line 331
im130=null;
//line 332
int133=n.c_rt_lib.array_len(im129);;
//line 332
int134=0;
//line 332
bool132=int133>int134;
//line 332
int133=null;
//line 332
int134=null;
//line 332
bool132=!bool132
//line 332
if (bool132) {label = 788; continue;}
//line 333
im136=n.c_rt_lib.ov_mk_arg(c[70],im127);;
//line 333
im135=n.c_rt_lib.ov_mk_arg(c[55],im136);;
//line 333
im136=null;
//line 333
var call_107_1=new n.imm_ref(im129);n.array.push(call_107_1,im135);im129=call_107_1.value;call_107_1=null;
//line 333
im135=null;
//line 334
im0=null;
//line 334
im1=null;
//line 334
bool7=null;
//line 334
im8=null;
//line 334
im9=null;
//line 334
im10=null;
//line 334
im16=null;
//line 334
bool17=null;
//line 334
im18=null;
//line 334
im19=null;
//line 334
im20=null;
//line 334
im26=null;
//line 334
im27=null;
//line 334
int33=null;
//line 334
int34=null;
//line 334
int35=null;
//line 334
bool36=null;
//line 334
im37=null;
//line 334
im45=null;
//line 334
im46=null;
//line 334
im60=null;
//line 334
bool61=null;
//line 334
im62=null;
//line 334
im63=null;
//line 334
im68=null;
//line 334
im85=null;
//line 334
im86=null;
//line 334
im92=null;
//line 334
im99=null;
//line 334
bool100=null;
//line 334
im101=null;
//line 334
im102=null;
//line 334
im103=null;
//line 334
im111=null;
//line 334
im127=null;
//line 334
im128=null;
//line 334
bool132=null;
//line 334
return im129;
//line 335
label = 788; continue;
//line 335
case 788:
//line 335
bool132=null;
//line 336
label = 791; continue;
//line 336
case 791:
//line 337
im137=n.imm_arr([]);
//line 337
im0=null;
//line 337
im1=null;
//line 337
bool7=null;
//line 337
im8=null;
//line 337
im9=null;
//line 337
im10=null;
//line 337
im16=null;
//line 337
bool17=null;
//line 337
im18=null;
//line 337
im19=null;
//line 337
im20=null;
//line 337
im26=null;
//line 337
im27=null;
//line 337
int33=null;
//line 337
int34=null;
//line 337
int35=null;
//line 337
bool36=null;
//line 337
im37=null;
//line 337
im45=null;
//line 337
im46=null;
//line 337
im60=null;
//line 337
bool61=null;
//line 337
im62=null;
//line 337
im63=null;
//line 337
im68=null;
//line 337
im85=null;
//line 337
im86=null;
//line 337
im92=null;
//line 337
im99=null;
//line 337
bool100=null;
//line 337
im101=null;
//line 337
im102=null;
//line 337
im103=null;
//line 337
im111=null;
//line 337
im127=null;
//line 337
im128=null;
//line 337
im129=null;
//line 337
return im137;
}}}

n.ptd.reconstruct_nl_with_args=function(___arg__0, ___arg__1, ___arg__2, ___arg__3, ___arg__4) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3;
n.check_null(im3);
var im4=___arg__4;
n.check_null(im4);
var im5=null;
var label=null;
while (1) { switch (label) {
default:
//line 341
im5=n.ptd.ptd_reconstruct_nl_with_args(im0,im1,im2,im3,im4);
//line 341
im0=null;
//line 341
im1=null;
//line 341
im2=null;
//line 341
im3=null;
//line 341
im4=null;
//line 341
return im5;
//line 341
im0=null;
//line 341
im1=null;
//line 341
im2=null;
//line 341
im3=null;
//line 341
im4=null;
//line 341
im5=null;
//line 341
return null;
}}}

n.ptd.__dyn_reconstruct_nl_with_args=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var arg3=arr.value.get_index(3);
var arg4=arr.value.get_index(4);
var ret = n.ptd.reconstruct_nl_with_args(arg0, arg1, arg2, arg3, arg4)
return ret;
}

n.ptd.ptd_reconstruct_nl_with_args=function(___arg__0, ___arg__1, ___arg__2, ___arg__3, ___arg__4) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3;
n.check_null(im3);
var im4=___arg__4;
n.check_null(im4);
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var label=null;
while (1) { switch (label) {
default:
//line 345
im5=n.imm_arr([im2,]);
//line 346
im8=n.ptd.ptd_im();
//line 346
im7=n.ptd.arr(im8);
//line 346
im8=null;
//line 346
im6=n.ptd.ensure(im7,im4);
//line 346
im7=null;
//line 346
var call_3_1=new n.imm_ref(im5);n.array.append(call_3_1,im6);im5=call_3_1.value;call_3_1=null;
//line 346
im6=null;
//line 347
im9=_prv_reconstruct(im0,im1,im3,im5);
//line 347
im0=null;
//line 347
im1=null;
//line 347
im2=null;
//line 347
im3=null;
//line 347
im4=null;
//line 347
im5=null;
//line 347
return im9;
//line 347
im0=null;
//line 347
im1=null;
//line 347
im2=null;
//line 347
im3=null;
//line 347
im4=null;
//line 347
im5=null;
//line 347
im9=null;
//line 347
return null;
}}}

n.ptd.__dyn_ptd_reconstruct_nl_with_args=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var arg3=arr.value.get_index(3);
var arg4=arr.value.get_index(4);
var ret = n.ptd.ptd_reconstruct_nl_with_args(arg0, arg1, arg2, arg3, arg4)
return ret;
}

function _prv_reconstruct(___arg__0, ___arg__1, ___arg__2, ___arg__3) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=___arg__3;
n.check_null(im3);
var bool4=null;
var im5=null;
var im6=null;
var im7=null;
var im8=null;
var im9=null;
var bool10=null;
var im11=null;
var im12=null;
var im13=null;
var im14=null;
var bool15=null;
var im16=null;
var im17=null;
var im18=null;
var im19=null;
var im20=null;
var im21=null;
var bool22=null;
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
var im33=null;
var int34=null;
var int35=null;
var int36=null;
var bool37=null;
var im38=null;
var im39=null;
var bool40=null;
var im41=null;
var im42=null;
var im43=null;
var im44=null;
var im45=null;
var bool46=null;
var im47=null;
var im48=null;
var im49=null;
var bool50=null;
var im51=null;
var im52=null;
var im53=null;
var im54=null;
var im55=null;
var im56=null;
var im57=null;
var im58=null;
var im59=null;
var im60=null;
var im61=null;
var bool62=null;
var im63=null;
var im64=null;
var im65=null;
var im66=null;
var im67=null;
var im68=null;
var im69=null;
var im70=null;
var im71=null;
var im72=null;
var label=null;
while (1) { switch (label) {
default:
//line 354
bool4=n.c_rt_lib.ov_is(im1,c[7]);;
//line 354
if (bool4) {label = 21; continue;}
//line 362
bool4=n.c_rt_lib.ov_is(im1,c[1]);;
//line 362
if (bool4) {label = 79; continue;}
//line 370
bool4=n.c_rt_lib.ov_is(im1,c[0]);;
//line 370
if (bool4) {label = 155; continue;}
//line 378
bool4=n.c_rt_lib.ov_is(im1,c[13]);;
//line 378
if (bool4) {label = 253; continue;}
//line 387
bool4=n.c_rt_lib.ov_is(im1,c[19]);;
//line 387
if (bool4) {label = 403; continue;}
//line 389
bool4=n.c_rt_lib.ov_is(im1,c[18]);;
//line 389
if (bool4) {label = 448; continue;}
//line 391
bool4=n.c_rt_lib.ov_is(im1,c[21]);;
//line 391
if (bool4) {label = 494; continue;}
//line 393
bool4=n.c_rt_lib.ov_is(im1,c[20]);;
//line 393
if (bool4) {label = 541; continue;}
//line 395
bool4=n.c_rt_lib.ov_is(im1,c[12]);;
//line 395
if (bool4) {label = 589; continue;}
//line 395
im5=c[22];
//line 395
im5=n.imm_arr([im5,im1,]);
//line 395
n.nl_die();
//line 354
case 21:
//line 354
im7=n.c_rt_lib.ov_as(im1,c[7]);;
//line 354
im6=im7
//line 355
im8=n.imm_hash({});
//line 356
im12=n.c_rt_lib.init_iter(im0);;
//line 356
case 26:
//line 356
bool10=n.c_rt_lib.is_end_hash(im12);;
//line 356
if (bool10) {label = 61; continue;}
//line 356
im9=n.c_rt_lib.get_key_iter(im12);;
//line 356
im11=n.c_rt_lib.hash_get_value(im0,im9);
//line 357
im14=n.hash.get_value(im6,im9);
//line 357
im13=_prv_reconstruct(im11,im14,im2,im3);
//line 357
im14=null;
//line 358
bool15=n.c_rt_lib.ov_is(im13,c[71]);;
//line 358
bool15=!bool15
//line 358
if (bool15) {label = 53; continue;}
//line 358
im0=null;
//line 358
im1=null;
//line 358
im2=null;
//line 358
im3=null;
//line 358
bool4=null;
//line 358
im5=null;
//line 358
im6=null;
//line 358
im7=null;
//line 358
im8=null;
//line 358
im9=null;
//line 358
bool10=null;
//line 358
im11=null;
//line 358
im12=null;
//line 358
bool15=null;
//line 358
return im13;
//line 358
label = 53; continue;
//line 358
case 53:
//line 358
bool15=null;
//line 359
im16=n.c_rt_lib.ov_as(im13,c[72]);;
//line 359
var call_18_1=new n.imm_ref(im8);n.hash.set_value(call_18_1,im9,im16);im8=call_18_1.value;call_18_1=null;
//line 359
im16=null;
//line 359
im13=null;
//line 360
im12=n.c_rt_lib.next_iter(im12);;
//line 360
label = 26; continue;
//line 360
case 61:
//line 361
im17=n.c_rt_lib.ov_mk_arg(c[72],im8);;
//line 361
im0=null;
//line 361
im1=null;
//line 361
im2=null;
//line 361
im3=null;
//line 361
bool4=null;
//line 361
im5=null;
//line 361
im6=null;
//line 361
im7=null;
//line 361
im8=null;
//line 361
im9=null;
//line 361
bool10=null;
//line 361
im11=null;
//line 361
im12=null;
//line 361
im13=null;
//line 361
return im17;
//line 362
label = 792; continue;
//line 362
case 79:
//line 362
im19=n.c_rt_lib.ov_as(im1,c[1]);;
//line 362
im18=im19
//line 363
im20=n.imm_hash({});
//line 364
im24=n.c_rt_lib.init_iter(im0);;
//line 364
case 84:
//line 364
bool22=n.c_rt_lib.is_end_hash(im24);;
//line 364
if (bool22) {label = 128; continue;}
//line 364
im21=n.c_rt_lib.get_key_iter(im24);;
//line 364
im23=n.c_rt_lib.hash_get_value(im0,im21);
//line 365
im26=n.hash.get_value(im18,im21);
//line 365
im25=_prv_reconstruct(im23,im26,im2,im3);
//line 365
im26=null;
//line 366
bool27=n.c_rt_lib.ov_is(im25,c[71]);;
//line 366
bool27=!bool27
//line 366
if (bool27) {label = 120; continue;}
//line 366
im0=null;
//line 366
im1=null;
//line 366
im2=null;
//line 366
im3=null;
//line 366
bool4=null;
//line 366
im5=null;
//line 366
im6=null;
//line 366
im7=null;
//line 366
im8=null;
//line 366
im9=null;
//line 366
bool10=null;
//line 366
im11=null;
//line 366
im12=null;
//line 366
im13=null;
//line 366
im17=null;
//line 366
im18=null;
//line 366
im19=null;
//line 366
im20=null;
//line 366
im21=null;
//line 366
bool22=null;
//line 366
im23=null;
//line 366
im24=null;
//line 366
bool27=null;
//line 366
return im25;
//line 366
label = 120; continue;
//line 366
case 120:
//line 366
bool27=null;
//line 367
im28=n.c_rt_lib.ov_as(im25,c[72]);;
//line 367
var call_30_1=new n.imm_ref(im20);n.hash.set_value(call_30_1,im21,im28);im20=call_30_1.value;call_30_1=null;
//line 367
im28=null;
//line 367
im25=null;
//line 368
im24=n.c_rt_lib.next_iter(im24);;
//line 368
label = 84; continue;
//line 368
case 128:
//line 369
im29=n.c_rt_lib.ov_mk_arg(c[72],im20);;
//line 369
im0=null;
//line 369
im1=null;
//line 369
im2=null;
//line 369
im3=null;
//line 369
bool4=null;
//line 369
im5=null;
//line 369
im6=null;
//line 369
im7=null;
//line 369
im8=null;
//line 369
im9=null;
//line 369
bool10=null;
//line 369
im11=null;
//line 369
im12=null;
//line 369
im13=null;
//line 369
im17=null;
//line 369
im18=null;
//line 369
im19=null;
//line 369
im20=null;
//line 369
im21=null;
//line 369
bool22=null;
//line 369
im23=null;
//line 369
im24=null;
//line 369
im25=null;
//line 369
return im29;
//line 370
label = 792; continue;
//line 370
case 155:
//line 370
im31=n.c_rt_lib.ov_as(im1,c[0]);;
//line 370
im30=im31
//line 371
im32=n.imm_arr([]);
//line 372
int34=0;
//line 372
int35=1;
//line 372
int36=n.c_rt_lib.array_len(im0);;
//line 372
case 162:
//line 372
bool37=int34>=int36;
//line 372
if (bool37) {label = 215; continue;}
//line 372
im38=im0.get_index(int34);
//line 372
im33=im38
//line 373
im39=_prv_reconstruct(im33,im30,im2,im3);
//line 374
bool40=n.c_rt_lib.ov_is(im39,c[71]);;
//line 374
bool40=!bool40
//line 374
if (bool40) {label = 207; continue;}
//line 374
im0=null;
//line 374
im1=null;
//line 374
im2=null;
//line 374
im3=null;
//line 374
bool4=null;
//line 374
im5=null;
//line 374
im6=null;
//line 374
im7=null;
//line 374
im8=null;
//line 374
im9=null;
//line 374
bool10=null;
//line 374
im11=null;
//line 374
im12=null;
//line 374
im13=null;
//line 374
im17=null;
//line 374
im18=null;
//line 374
im19=null;
//line 374
im20=null;
//line 374
im21=null;
//line 374
bool22=null;
//line 374
im23=null;
//line 374
im24=null;
//line 374
im25=null;
//line 374
im29=null;
//line 374
im30=null;
//line 374
im31=null;
//line 374
im32=null;
//line 374
im33=null;
//line 374
int34=null;
//line 374
int35=null;
//line 374
int36=null;
//line 374
bool37=null;
//line 374
im38=null;
//line 374
bool40=null;
//line 374
return im39;
//line 374
label = 207; continue;
//line 374
case 207:
//line 374
bool40=null;
//line 375
im41=n.c_rt_lib.ov_as(im39,c[72]);;
//line 375
var call_38_1=new n.imm_ref(im32);n.array.push(call_38_1,im41);im32=call_38_1.value;call_38_1=null;
//line 375
im41=null;
//line 375
im33=null;
//line 376
int34=Math.floor(int34+int35);
//line 376
label = 162; continue;
//line 376
case 215:
//line 377
im42=n.c_rt_lib.ov_mk_arg(c[72],im32);;
//line 377
im0=null;
//line 377
im1=null;
//line 377
im2=null;
//line 377
im3=null;
//line 377
bool4=null;
//line 377
im5=null;
//line 377
im6=null;
//line 377
im7=null;
//line 377
im8=null;
//line 377
im9=null;
//line 377
bool10=null;
//line 377
im11=null;
//line 377
im12=null;
//line 377
im13=null;
//line 377
im17=null;
//line 377
im18=null;
//line 377
im19=null;
//line 377
im20=null;
//line 377
im21=null;
//line 377
bool22=null;
//line 377
im23=null;
//line 377
im24=null;
//line 377
im25=null;
//line 377
im29=null;
//line 377
im30=null;
//line 377
im31=null;
//line 377
im32=null;
//line 377
im33=null;
//line 377
int34=null;
//line 377
int35=null;
//line 377
int36=null;
//line 377
bool37=null;
//line 377
im38=null;
//line 377
im39=null;
//line 377
return im42;
//line 378
label = 792; continue;
//line 378
case 253:
//line 378
im44=n.c_rt_lib.ov_as(im1,c[13]);;
//line 378
im43=im44
//line 379
im45=n.ov.get_element(im0);
//line 380
im1=n.hash.get_value(im43,im45);
//line 381
bool46=n.c_rt_lib.ov_is(im1,c[35]);;
//line 381
bool46=!bool46
//line 381
if (bool46) {label = 303; continue;}
//line 381
im47=n.c_rt_lib.ov_mk_arg(c[72],im0);;
//line 381
im0=null;
//line 381
im1=null;
//line 381
im2=null;
//line 381
im3=null;
//line 381
bool4=null;
//line 381
im5=null;
//line 381
im6=null;
//line 381
im7=null;
//line 381
im8=null;
//line 381
im9=null;
//line 381
bool10=null;
//line 381
im11=null;
//line 381
im12=null;
//line 381
im13=null;
//line 381
im17=null;
//line 381
im18=null;
//line 381
im19=null;
//line 381
im20=null;
//line 381
im21=null;
//line 381
bool22=null;
//line 381
im23=null;
//line 381
im24=null;
//line 381
im25=null;
//line 381
im29=null;
//line 381
im30=null;
//line 381
im31=null;
//line 381
im32=null;
//line 381
im33=null;
//line 381
int34=null;
//line 381
int35=null;
//line 381
int36=null;
//line 381
bool37=null;
//line 381
im38=null;
//line 381
im39=null;
//line 381
im42=null;
//line 381
im43=null;
//line 381
im44=null;
//line 381
im45=null;
//line 381
bool46=null;
//line 381
return im47;
//line 381
label = 303; continue;
//line 381
case 303:
//line 381
bool46=null;
//line 381
im47=null;
//line 382
im0=n.ov.get_value(im0);
//line 383
im48=n.c_rt_lib.ov_as(im1,c[11]);;
//line 384
im49=_prv_reconstruct(im0,im48,im2,im3);
//line 385
bool50=n.c_rt_lib.ov_is(im49,c[71]);;
//line 385
bool50=!bool50
//line 385
if (bool50) {label = 354; continue;}
//line 385
im0=null;
//line 385
im1=null;
//line 385
im2=null;
//line 385
im3=null;
//line 385
bool4=null;
//line 385
im5=null;
//line 385
im6=null;
//line 385
im7=null;
//line 385
im8=null;
//line 385
im9=null;
//line 385
bool10=null;
//line 385
im11=null;
//line 385
im12=null;
//line 385
im13=null;
//line 385
im17=null;
//line 385
im18=null;
//line 385
im19=null;
//line 385
im20=null;
//line 385
im21=null;
//line 385
bool22=null;
//line 385
im23=null;
//line 385
im24=null;
//line 385
im25=null;
//line 385
im29=null;
//line 385
im30=null;
//line 385
im31=null;
//line 385
im32=null;
//line 385
im33=null;
//line 385
int34=null;
//line 385
int35=null;
//line 385
int36=null;
//line 385
bool37=null;
//line 385
im38=null;
//line 385
im39=null;
//line 385
im42=null;
//line 385
im43=null;
//line 385
im44=null;
//line 385
im45=null;
//line 385
im48=null;
//line 385
bool50=null;
//line 385
return im49;
//line 385
label = 354; continue;
//line 385
case 354:
//line 385
bool50=null;
//line 386
im53=n.c_rt_lib.ov_as(im49,c[72]);;
//line 386
im52=n.ov.mk_val(im45,im53);
//line 386
im53=null;
//line 386
im51=n.c_rt_lib.ov_mk_arg(c[72],im52);;
//line 386
im52=null;
//line 386
im0=null;
//line 386
im1=null;
//line 386
im2=null;
//line 386
im3=null;
//line 386
bool4=null;
//line 386
im5=null;
//line 386
im6=null;
//line 386
im7=null;
//line 386
im8=null;
//line 386
im9=null;
//line 386
bool10=null;
//line 386
im11=null;
//line 386
im12=null;
//line 386
im13=null;
//line 386
im17=null;
//line 386
im18=null;
//line 386
im19=null;
//line 386
im20=null;
//line 386
im21=null;
//line 386
bool22=null;
//line 386
im23=null;
//line 386
im24=null;
//line 386
im25=null;
//line 386
im29=null;
//line 386
im30=null;
//line 386
im31=null;
//line 386
im32=null;
//line 386
im33=null;
//line 386
int34=null;
//line 386
int35=null;
//line 386
int36=null;
//line 386
bool37=null;
//line 386
im38=null;
//line 386
im39=null;
//line 386
im42=null;
//line 386
im43=null;
//line 386
im44=null;
//line 386
im45=null;
//line 386
im48=null;
//line 386
im49=null;
//line 386
return im51;
//line 387
label = 792; continue;
//line 387
case 403:
//line 388
im54=n.c_rt_lib.ov_mk_arg(c[72],im0);;
//line 388
im0=null;
//line 388
im1=null;
//line 388
im2=null;
//line 388
im3=null;
//line 388
bool4=null;
//line 388
im5=null;
//line 388
im6=null;
//line 388
im7=null;
//line 388
im8=null;
//line 388
im9=null;
//line 388
bool10=null;
//line 388
im11=null;
//line 388
im12=null;
//line 388
im13=null;
//line 388
im17=null;
//line 388
im18=null;
//line 388
im19=null;
//line 388
im20=null;
//line 388
im21=null;
//line 388
bool22=null;
//line 388
im23=null;
//line 388
im24=null;
//line 388
im25=null;
//line 388
im29=null;
//line 388
im30=null;
//line 388
im31=null;
//line 388
im32=null;
//line 388
im33=null;
//line 388
int34=null;
//line 388
int35=null;
//line 388
int36=null;
//line 388
bool37=null;
//line 388
im38=null;
//line 388
im39=null;
//line 388
im42=null;
//line 388
im43=null;
//line 388
im44=null;
//line 388
im45=null;
//line 388
im48=null;
//line 388
im49=null;
//line 388
im51=null;
//line 388
return im54;
//line 389
label = 792; continue;
//line 389
case 448:
//line 390
im55=n.c_rt_lib.ov_mk_arg(c[72],im0);;
//line 390
im0=null;
//line 390
im1=null;
//line 390
im2=null;
//line 390
im3=null;
//line 390
bool4=null;
//line 390
im5=null;
//line 390
im6=null;
//line 390
im7=null;
//line 390
im8=null;
//line 390
im9=null;
//line 390
bool10=null;
//line 390
im11=null;
//line 390
im12=null;
//line 390
im13=null;
//line 390
im17=null;
//line 390
im18=null;
//line 390
im19=null;
//line 390
im20=null;
//line 390
im21=null;
//line 390
bool22=null;
//line 390
im23=null;
//line 390
im24=null;
//line 390
im25=null;
//line 390
im29=null;
//line 390
im30=null;
//line 390
im31=null;
//line 390
im32=null;
//line 390
im33=null;
//line 390
int34=null;
//line 390
int35=null;
//line 390
int36=null;
//line 390
bool37=null;
//line 390
im38=null;
//line 390
im39=null;
//line 390
im42=null;
//line 390
im43=null;
//line 390
im44=null;
//line 390
im45=null;
//line 390
im48=null;
//line 390
im49=null;
//line 390
im51=null;
//line 390
im54=null;
//line 390
return im55;
//line 391
label = 792; continue;
//line 391
case 494:
//line 392
im56=n.c_rt_lib.ov_mk_arg(c[72],im0);;
//line 392
im0=null;
//line 392
im1=null;
//line 392
im2=null;
//line 392
im3=null;
//line 392
bool4=null;
//line 392
im5=null;
//line 392
im6=null;
//line 392
im7=null;
//line 392
im8=null;
//line 392
im9=null;
//line 392
bool10=null;
//line 392
im11=null;
//line 392
im12=null;
//line 392
im13=null;
//line 392
im17=null;
//line 392
im18=null;
//line 392
im19=null;
//line 392
im20=null;
//line 392
im21=null;
//line 392
bool22=null;
//line 392
im23=null;
//line 392
im24=null;
//line 392
im25=null;
//line 392
im29=null;
//line 392
im30=null;
//line 392
im31=null;
//line 392
im32=null;
//line 392
im33=null;
//line 392
int34=null;
//line 392
int35=null;
//line 392
int36=null;
//line 392
bool37=null;
//line 392
im38=null;
//line 392
im39=null;
//line 392
im42=null;
//line 392
im43=null;
//line 392
im44=null;
//line 392
im45=null;
//line 392
im48=null;
//line 392
im49=null;
//line 392
im51=null;
//line 392
im54=null;
//line 392
im55=null;
//line 392
return im56;
//line 393
label = 792; continue;
//line 393
case 541:
//line 394
im57=n.c_rt_lib.ov_mk_arg(c[72],im0);;
//line 394
im0=null;
//line 394
im1=null;
//line 394
im2=null;
//line 394
im3=null;
//line 394
bool4=null;
//line 394
im5=null;
//line 394
im6=null;
//line 394
im7=null;
//line 394
im8=null;
//line 394
im9=null;
//line 394
bool10=null;
//line 394
im11=null;
//line 394
im12=null;
//line 394
im13=null;
//line 394
im17=null;
//line 394
im18=null;
//line 394
im19=null;
//line 394
im20=null;
//line 394
im21=null;
//line 394
bool22=null;
//line 394
im23=null;
//line 394
im24=null;
//line 394
im25=null;
//line 394
im29=null;
//line 394
im30=null;
//line 394
im31=null;
//line 394
im32=null;
//line 394
im33=null;
//line 394
int34=null;
//line 394
int35=null;
//line 394
int36=null;
//line 394
bool37=null;
//line 394
im38=null;
//line 394
im39=null;
//line 394
im42=null;
//line 394
im43=null;
//line 394
im44=null;
//line 394
im45=null;
//line 394
im48=null;
//line 394
im49=null;
//line 394
im51=null;
//line 394
im54=null;
//line 394
im55=null;
//line 394
im56=null;
//line 394
return im57;
//line 395
label = 792; continue;
//line 395
case 589:
//line 395
im59=n.c_rt_lib.ov_as(im1,c[12]);;
//line 395
im58=im59
//line 396
im60=n.imm_arr([im0,im1,]);
//line 397
var call_57_1=new n.imm_ref(im60);n.array.append(call_57_1,im3);im60=call_57_1.value;call_57_1=null;
//line 398
im61=_prv_exec(im2,im60);
//line 399
bool62=n.c_rt_lib.ov_is(im61,c[72]);;
//line 399
if (bool62) {label = 604; continue;}
//line 401
bool62=n.c_rt_lib.ov_is(im61,c[71]);;
//line 401
if (bool62) {label = 663; continue;}
//line 403
bool62=n.c_rt_lib.ov_is(im61,c[73]);;
//line 403
if (bool62) {label = 725; continue;}
//line 403
im63=c[22];
//line 403
im63=n.imm_arr([im63,im61,]);
//line 403
n.nl_die();
//line 399
case 604:
//line 399
im65=n.c_rt_lib.ov_as(im61,c[72]);;
//line 399
im64=im65
//line 400
im66=n.c_rt_lib.ov_mk_arg(c[72],im64);;
//line 400
im0=null;
//line 400
im1=null;
//line 400
im2=null;
//line 400
im3=null;
//line 400
bool4=null;
//line 400
im5=null;
//line 400
im6=null;
//line 400
im7=null;
//line 400
im8=null;
//line 400
im9=null;
//line 400
bool10=null;
//line 400
im11=null;
//line 400
im12=null;
//line 400
im13=null;
//line 400
im17=null;
//line 400
im18=null;
//line 400
im19=null;
//line 400
im20=null;
//line 400
im21=null;
//line 400
bool22=null;
//line 400
im23=null;
//line 400
im24=null;
//line 400
im25=null;
//line 400
im29=null;
//line 400
im30=null;
//line 400
im31=null;
//line 400
im32=null;
//line 400
im33=null;
//line 400
int34=null;
//line 400
int35=null;
//line 400
int36=null;
//line 400
bool37=null;
//line 400
im38=null;
//line 400
im39=null;
//line 400
im42=null;
//line 400
im43=null;
//line 400
im44=null;
//line 400
im45=null;
//line 400
im48=null;
//line 400
im49=null;
//line 400
im51=null;
//line 400
im54=null;
//line 400
im55=null;
//line 400
im56=null;
//line 400
im57=null;
//line 400
im58=null;
//line 400
im59=null;
//line 400
im60=null;
//line 400
im61=null;
//line 400
bool62=null;
//line 400
im63=null;
//line 400
im64=null;
//line 400
im65=null;
//line 400
return im66;
//line 401
label = 790; continue;
//line 401
case 663:
//line 401
im68=n.c_rt_lib.ov_as(im61,c[71]);;
//line 401
im67=im68
//line 402
im69=n.c_rt_lib.ov_mk_arg(c[71],im67);;
//line 402
im0=null;
//line 402
im1=null;
//line 402
im2=null;
//line 402
im3=null;
//line 402
bool4=null;
//line 402
im5=null;
//line 402
im6=null;
//line 402
im7=null;
//line 402
im8=null;
//line 402
im9=null;
//line 402
bool10=null;
//line 402
im11=null;
//line 402
im12=null;
//line 402
im13=null;
//line 402
im17=null;
//line 402
im18=null;
//line 402
im19=null;
//line 402
im20=null;
//line 402
im21=null;
//line 402
bool22=null;
//line 402
im23=null;
//line 402
im24=null;
//line 402
im25=null;
//line 402
im29=null;
//line 402
im30=null;
//line 402
im31=null;
//line 402
im32=null;
//line 402
im33=null;
//line 402
int34=null;
//line 402
int35=null;
//line 402
int36=null;
//line 402
bool37=null;
//line 402
im38=null;
//line 402
im39=null;
//line 402
im42=null;
//line 402
im43=null;
//line 402
im44=null;
//line 402
im45=null;
//line 402
im48=null;
//line 402
im49=null;
//line 402
im51=null;
//line 402
im54=null;
//line 402
im55=null;
//line 402
im56=null;
//line 402
im57=null;
//line 402
im58=null;
//line 402
im59=null;
//line 402
im60=null;
//line 402
im61=null;
//line 402
bool62=null;
//line 402
im63=null;
//line 402
im64=null;
//line 402
im65=null;
//line 402
im66=null;
//line 402
im67=null;
//line 402
im68=null;
//line 402
return im69;
//line 403
label = 790; continue;
//line 403
case 725:
//line 404
im72=n.imm_arr([]);
//line 404
im71=_prv_exec(im1,im72);
//line 404
im72=null;
//line 404
im70=_prv_reconstruct(im0,im71,im2,im3);
//line 404
im71=null;
//line 404
im0=null;
//line 404
im1=null;
//line 404
im2=null;
//line 404
im3=null;
//line 404
bool4=null;
//line 404
im5=null;
//line 404
im6=null;
//line 404
im7=null;
//line 404
im8=null;
//line 404
im9=null;
//line 404
bool10=null;
//line 404
im11=null;
//line 404
im12=null;
//line 404
im13=null;
//line 404
im17=null;
//line 404
im18=null;
//line 404
im19=null;
//line 404
im20=null;
//line 404
im21=null;
//line 404
bool22=null;
//line 404
im23=null;
//line 404
im24=null;
//line 404
im25=null;
//line 404
im29=null;
//line 404
im30=null;
//line 404
im31=null;
//line 404
im32=null;
//line 404
im33=null;
//line 404
int34=null;
//line 404
int35=null;
//line 404
int36=null;
//line 404
bool37=null;
//line 404
im38=null;
//line 404
im39=null;
//line 404
im42=null;
//line 404
im43=null;
//line 404
im44=null;
//line 404
im45=null;
//line 404
im48=null;
//line 404
im49=null;
//line 404
im51=null;
//line 404
im54=null;
//line 404
im55=null;
//line 404
im56=null;
//line 404
im57=null;
//line 404
im58=null;
//line 404
im59=null;
//line 404
im60=null;
//line 404
im61=null;
//line 404
bool62=null;
//line 404
im63=null;
//line 404
im64=null;
//line 404
im65=null;
//line 404
im66=null;
//line 404
im67=null;
//line 404
im68=null;
//line 404
im69=null;
//line 404
return im70;
//line 405
label = 790; continue;
//line 405
case 790:
//line 406
label = 792; continue;
//line 406
case 792:
}}}

n.ptd.int_to_string=function(___arg__0) {
var int0=___arg__0;
n.check_null(int0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 410
im1=n.c_std_lib.int_to_string(int0);
//line 410
int0=null;
//line 410
return im1;
}}}

n.ptd.__dyn_int_to_string=function(arr) {
var arg0=arr.value.get_index(0).as_int();
var ret = n.ptd.int_to_string(arg0)
return ret;
}

n.ptd.string_to_int=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var bool2=null;
var im3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 414
im3=n.ptd.try_string_to_int(im0);
//line 414
bool2=n.c_rt_lib.ov_is(im3,c[14]);;
//line 414
if (bool2) {label = 5; continue;}
//line 414
im3=n.c_rt_lib.ov_mk_arg(c[15],im3);;
//line 414
n.nl_die();
//line 414
case 5:
//line 414
im1=n.c_rt_lib.ov_as(im3,c[14]);;
//line 415
int4=im1.as_int();
//line 415
im0=null;
//line 415
im1=null;
//line 415
bool2=null;
//line 415
im3=null;
//line 415
return int4;
}}}

n.ptd.__dyn_string_to_int=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.imm_int(n.ptd.string_to_int(arg0))
return ret;
}

n.ptd.try_string_to_int=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 419
im1=n.c_std_lib.try_string_to_int(im0);
//line 419
im0=null;
//line 419
return im1;
}}}

n.ptd.__dyn_try_string_to_int=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.ptd.try_string_to_int(arg0)
return ret;
}
var c=[];
c[0] = n.imm_str("ptd_arr");c[1] = n.imm_str("ptd_rec");c[2] = n.imm_ov_js_str("ptd_int",null);c[3] = n.imm_ov_js_str("ptd_string",null);c[4] = n.imm_ov_js_str("ptd_bool",null);c[5] = n.imm_ov_js_str("ptd_var_none",null);c[6] = n.imm_ov_js_str("ptd_void",null);c[7] = n.imm_str("ptd_hash");c[8] = n.imm_ov_js_str("ptd_im",null);c[9] = n.imm_str("ptd_var_none");c[10] = n.imm_ov_js_str("no_param",null);c[11] = n.imm_str("with_param");c[12] = n.imm_str("ref");c[13] = n.imm_str("ptd_var");c[14] = n.imm_str("ok");c[15] = n.imm_str("ensure");c[16] = n.imm_str("1 Not ov reference in ensure");c[17] = n.imm_str("err");c[18] = n.imm_str("ptd_string");c[19] = n.imm_str("ptd_int");c[20] = n.imm_str("ptd_im");c[21] = n.imm_str("ptd_bool");c[22] = n.imm_str("NOMATCHALERT");c[23] = n.imm_str("2 HASH ref expected ");c[24] = n.imm_str("3 ARRAY ref expected ");c[25] = n.imm_str(":arr");c[26] = n.imm_str("4 HASH ref expected ");c[27] = n.imm_str("5 keys amount mismatch in ptd_rec");c[28] = n.imm_str(":hash");c[29] = n.imm_str("6 key ");c[30] = n.imm_str(" not exists in hash");c[31] = n.imm_str("8 wrong string ref ");c[32] = n.imm_str("9 not ov ref");c[33] = n.imm_str("10 Case ");c[34] = n.imm_str(" not allowed in variant. ");c[35] = n.imm_str("no_param");c[36] = n.imm_str("12 with_param ov has no value");c[37] = n.imm_str("11 no_param ov has value");c[38] = n.imm_str("13 wrong int ");c[39] = n.imm_str("14 not bool ref");c[40] = n.imm_str("TRUE");c[41] = n.imm_str("FALSE");c[42] = n.imm_str("15 Case ");c[43] = n.imm_str(" not allowed in bool");c[44] = n.imm_str("module");c[45] = n.imm_str("name");c[46] = n.imm_ov_js_str("int",null);c[47] = n.imm_ov_js_str("string",null);c[48] = n.imm_ov_js_str("variant",null);c[49] = n.imm_ov_js_str("hash",null);c[50] = n.imm_ov_js_str("array",null);c[51] = n.imm_str("is_not_type");c[52] = n.imm_str("error");c[53] = n.imm_str("hash_expected");c[54] = n.imm_str("hash_key");c[55] = n.imm_str("path");c[56] = n.imm_str("array_expected");c[57] = n.imm_str("array_index");c[58] = n.imm_str("rec_expected");c[59] = n.imm_str("rec_size");c[60] = n.imm_str("no_key");c[61] = n.imm_str("rec_key");c[62] = n.imm_str("int_expected");c[63] = n.imm_str("string_expected");c[64] = n.imm_str("variant_expected");c[65] = n.imm_str("");c[66] = n.imm_str("unknown_case");c[67] = n.imm_str("no_value");c[68] = n.imm_str("variant_value");c[69] = n.imm_str("has_value");c[70] = n.imm_str("type_ref");c[71] = n.imm_str("to_return");c[72] = n.imm_str("new_value");c[73] = n.imm_str("none");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.singleton={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.singleton.sigleton_do_not_use_without_approval=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var label=null;
while (1) { switch (label) {
default:
//line 9
return im0;
//line 9
im0=null;
//line 9
return null;
}}}

n.singleton.__dyn_sigleton_do_not_use_without_approval=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.singleton.sigleton_do_not_use_without_approval(arg0)
return ret;
}
var c=[];
})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.string={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.string.lf=function() {
var im0=null;
var int1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 11
int1=10;
//line 11
im2=n.imm_int(int1)
//line 11
im0=n.string.chr(im2);
//line 11
int1=null;
//line 11
im2=null;
//line 11
return im0;
}}}

n.string.__dyn_lf=function(arr) {
var ret = n.string.lf()
return ret;
}

n.string.tab=function() {
var im0=null;
var int1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 15
int1=9;
//line 15
im2=n.imm_int(int1)
//line 15
im0=n.string.chr(im2);
//line 15
int1=null;
//line 15
im2=null;
//line 15
return im0;
}}}

n.string.__dyn_tab=function(arr) {
var ret = n.string.tab()
return ret;
}

n.string.r=function() {
var im0=null;
var int1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 19
int1=13;
//line 19
im2=n.imm_int(int1)
//line 19
im0=n.string.chr(im2);
//line 19
int1=null;
//line 19
im2=null;
//line 19
return im0;
}}}

n.string.__dyn_r=function(arr) {
var ret = n.string.r()
return ret;
}

n.string.f=function() {
var im0=null;
var int1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 23
int1=12;
//line 23
im2=n.imm_int(int1)
//line 23
im0=n.string.chr(im2);
//line 23
int1=null;
//line 23
im2=null;
//line 23
return im0;
}}}

n.string.__dyn_f=function(arr) {
var ret = n.string.f()
return ret;
}

n.string.non_breaking_space=function() {
var im0=null;
var im1=null;
var int2=null;
var im3=null;
var im4=null;
var int5=null;
var im6=null;
var label=null;
while (1) { switch (label) {
default:
//line 27
int2=194;
//line 27
im3=n.imm_int(int2)
//line 27
im1=n.string.chr(im3);
//line 27
int2=null;
//line 27
im3=null;
//line 27
int5=160;
//line 27
im6=n.imm_int(int5)
//line 27
im4=n.string.chr(im6);
//line 27
int5=null;
//line 27
im6=null;
//line 27
im0=n.imm_arr([im1,im4,]);
//line 27
im1=null;
//line 27
im4=null;
//line 27
return im0;
}}}

n.string.__dyn_non_breaking_space=function(arr) {
var ret = n.string.non_breaking_space()
return ret;
}

n.string.char_times=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var int3=null;
var int4=null;
var bool5=null;
var int6=null;
var label=null;
while (1) { switch (label) {
default:
//line 31
im2=c[0];
//line 32
int3=0;
//line 32
int4=1;
//line 32
case 3:
//line 32
int6=im1.as_int();
//line 32
bool5=int3>=int6;
//line 32
if (bool5) {label = 10; continue;}
//line 32
im2=n.c_rt_lib.concat(im2,im0);;
//line 32
int3=Math.floor(int3+int4);
//line 32
label = 3; continue;
//line 32
case 10:
//line 33
im0=null;
//line 33
im1=null;
//line 33
int3=null;
//line 33
int4=null;
//line 33
bool5=null;
//line 33
int6=null;
//line 33
return im2;
}}}

n.string.__dyn_char_times=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string.char_times(arg0, arg1)
return ret;
}

n.string.split=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var int3=null;
var int4=null;
var int5=null;
var int6=null;
var int7=null;
var bool8=null;
var int9=null;
var im10=null;
var bool11=null;
var bool12=null;
var int13=null;
var im14=null;
var im15=null;
var int16=null;
var im17=null;
var im18=null;
var im19=null;
var int20=null;
var im21=null;
var label=null;
while (1) { switch (label) {
default:
//line 37
im2=n.imm_arr([]);
//line 38
int3=0;
//line 39
int4=n.string.length(im0);
//line 40
int5=n.string.length(im1);
//line 41
case 4:
//line 42
int7=1;
//line 42
int6=Math.floor(int3+int7);
//line 42
int7=null;
//line 43
int9=0;
//line 43
bool8=int4==int9;
//line 43
int9=null;
//line 43
bool8=!bool8
//line 43
bool8=!bool8
//line 43
if (bool8) {label = 18; continue;}
//line 43
im10=n.imm_int(int3)
//line 43
int6=n.string.index(im1,im0,im10);
//line 43
im10=null;
//line 43
label = 18; continue;
//line 43
case 18:
//line 43
bool8=null;
//line 44
bool11=int6>int5;
//line 44
bool11=!bool11
//line 44
if (bool11) {label = 27; continue;}
//line 44
int6=null;
//line 44
bool11=null;
//line 44
label = 63; continue;
//line 44
label = 27; continue;
//line 44
case 27:
//line 44
bool11=null;
//line 45
int13=0;
//line 45
bool12=int6<int13;
//line 45
int13=null;
//line 45
bool12=!bool12
//line 45
if (bool12) {label = 47; continue;}
//line 46
im15=n.imm_int(int3)
//line 46
int16=Math.floor(int5-int3);
//line 46
im17=n.imm_int(int16)
//line 46
im14=n.string.substr(im1,im15,im17);
//line 46
im15=null;
//line 46
int16=null;
//line 46
im17=null;
//line 46
var call_4_1=new n.imm_ref(im2);n.array.push(call_4_1,im14);im2=call_4_1.value;call_4_1=null;
//line 46
im14=null;
//line 47
int6=null;
//line 47
bool12=null;
//line 47
label = 63; continue;
//line 48
label = 59; continue;
//line 48
case 47:
//line 49
im19=n.imm_int(int3)
//line 49
int20=Math.floor(int6-int3);
//line 49
im21=n.imm_int(int20)
//line 49
im18=n.string.substr(im1,im19,im21);
//line 49
im19=null;
//line 49
int20=null;
//line 49
im21=null;
//line 49
var call_6_1=new n.imm_ref(im2);n.array.push(call_6_1,im18);im2=call_6_1.value;call_6_1=null;
//line 49
im18=null;
//line 50
int3=Math.floor(int6+int4);
//line 51
label = 59; continue;
//line 51
case 59:
//line 51
bool12=null;
//line 51
int6=null;
//line 41
label = 4; continue;
//line 41
case 63:
//line 53
im0=null;
//line 53
im1=null;
//line 53
int3=null;
//line 53
int4=null;
//line 53
int5=null;
//line 53
int6=null;
//line 53
return im2;
}}}

n.string.__dyn_split=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string.split(arg0, arg1)
return ret;
}

n.string.split_limit=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var bool4=null;
var int5=null;
var int6=null;
var im7=null;
var im8=null;
var int9=null;
var int10=null;
var int11=null;
var int12=null;
var int13=null;
var int14=null;
var int15=null;
var int16=null;
var im17=null;
var int18=null;
var int19=null;
var int20=null;
var int21=null;
var label=null;
while (1) { switch (label) {
default:
//line 57
im3=n.string.split(im0,im1);
//line 58
int5=n.c_rt_lib.array_len(im3);;
//line 58
int6=im2.as_int();
//line 58
bool4=int5>int6;
//line 58
int5=null;
//line 58
int6=null;
//line 58
bool4=!bool4
//line 58
if (bool4) {label = 45; continue;}
//line 59
int10=1;
//line 59
int11=im2.as_int();
//line 59
int9=Math.floor(int11-int10);
//line 59
int10=null;
//line 59
int11=null;
//line 59
int14=n.c_rt_lib.array_len(im3);;
//line 59
int15=im2.as_int();
//line 59
int13=Math.floor(int14-int15);
//line 59
int14=null;
//line 59
int15=null;
//line 59
int16=1;
//line 59
int12=Math.floor(int13+int16);
//line 59
int13=null;
//line 59
int16=null;
//line 59
im8=n.array.subarray(im3,int9,int12);
//line 59
int9=null;
//line 59
int12=null;
//line 59
im7=n.array.join(im0,im8);
//line 59
im8=null;
//line 60
int18=0;
//line 60
int20=1;
//line 60
int21=im2.as_int();
//line 60
int19=Math.floor(int21-int20);
//line 60
int20=null;
//line 60
int21=null;
//line 60
im17=n.array.subarray(im3,int18,int19);
//line 60
int18=null;
//line 60
int19=null;
//line 61
var call_6_1=new n.imm_ref(im17);n.array.push(call_6_1,im7);im17=call_6_1.value;call_6_1=null;
//line 62
im0=null;
//line 62
im1=null;
//line 62
im2=null;
//line 62
im3=null;
//line 62
bool4=null;
//line 62
im7=null;
//line 62
return im17;
//line 63
label = 54; continue;
//line 63
case 45:
//line 64
im0=null;
//line 64
im1=null;
//line 64
im2=null;
//line 64
bool4=null;
//line 64
im7=null;
//line 64
im17=null;
//line 64
return im3;
//line 65
label = 54; continue;
//line 65
case 54:
//line 65
bool4=null;
//line 65
im7=null;
//line 65
im17=null;
}}}

n.string.__dyn_split_limit=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.string.split_limit(arg0, arg1, arg2)
return ret;
}

n.string.to_array=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 69
im2=c[0];
//line 69
im1=n.string.split(im2,im0);
//line 69
im2=null;
//line 69
im0=null;
//line 69
return im1;
}}}

n.string.__dyn_to_array=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string.to_array(arg0)
return ret;
}

n.string.length=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var label=null;
while (1) { switch (label) {
default:
//line 73
int1=n.c_std_lib.string_length(im0);
//line 73
im0=null;
//line 73
return int1;
}}}

n.string.__dyn_length=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.imm_int(n.string.length(arg0))
return ret;
}

n.string.get_char_code=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var int3=null;
var label=null;
while (1) { switch (label) {
default:
//line 77
int3=im1.as_int();
//line 77
int2=n.c_std_lib.string_get_char_code(im0,int3);
//line 77
int3=null;
//line 77
im0=null;
//line 77
im1=null;
//line 77
return int2;
}}}

n.string.__dyn_get_char_code=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.imm_int(n.string.get_char_code(arg0, arg1))
return ret;
}

n.string.substr=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var im4=null;
var int5=null;
var int6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 81
int5=im1.as_int();
//line 81
int6=im2.as_int();
//line 81
im4=n.c_std_lib.string_sub(im0,int5,int6);
//line 81
int5=null;
//line 81
int6=null;
//line 81
im7=c[0];
//line 81
im3=n.c_rt_lib.concat(im4,im7);;
//line 81
im4=null;
//line 81
im7=null;
//line 81
im0=null;
//line 81
im1=null;
//line 81
im2=null;
//line 81
return im3;
}}}

n.string.__dyn_substr=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.string.substr(arg0, arg1, arg2)
return ret;
}

n.string.substr2=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var int4=null;
var int5=null;
var int6=null;
var int7=null;
var im8=null;
var label=null;
while (1) { switch (label) {
default:
//line 85
int4=im1.as_int();
//line 85
int6=n.string.length(im0);
//line 85
int7=im1.as_int();
//line 85
int5=Math.floor(int6-int7);
//line 85
int6=null;
//line 85
int7=null;
//line 85
im3=n.c_std_lib.string_sub(im0,int4,int5);
//line 85
int4=null;
//line 85
int5=null;
//line 85
im8=c[0];
//line 85
im2=n.c_rt_lib.concat(im3,im8);;
//line 85
im3=null;
//line 85
im8=null;
//line 85
im0=null;
//line 85
im1=null;
//line 85
return im2;
}}}

n.string.__dyn_substr2=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string.substr2(arg0, arg1)
return ret;
}

n.string.lc=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var int2=null;
var int3=null;
var int4=null;
var bool5=null;
var int6=null;
var im7=null;
var bool8=null;
var bool9=null;
var int10=null;
var int11=null;
var int12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var label=null;
while (1) { switch (label) {
default:
//line 89
im1=n.string.to_array(im0);
//line 90
int2=n.c_rt_lib.array_len(im1);;
//line 90
int3=0;
//line 90
int4=1;
//line 90
case 4:
//line 90
bool5=int3>=int2;
//line 90
if (bool5) {label = 38; continue;}
//line 91
im7=im1.get_index(int3);
//line 91
int6=n.string.ord(im7);
//line 91
im7=null;
//line 92
int10=65;
//line 92
bool8=int6>=int10;
//line 92
int10=null;
//line 92
bool9=!bool8
//line 92
if (bool9) {label = 18; continue;}
//line 92
int11=90;
//line 92
bool8=int6<=int11;
//line 92
int11=null;
//line 92
case 18:
//line 92
bool9=null;
//line 92
bool8=!bool8
//line 92
if (bool8) {label = 33; continue;}
//line 93
int12=32;
//line 93
int6=Math.floor(int6+int12);
//line 93
int12=null;
//line 94
im14=n.imm_int(int6)
//line 94
im13=n.string.chr(im14);
//line 94
im14=null;
//line 94
im15=im13
//line 94
var call_4_1=new n.imm_ref(im1);n.c_rt_lib.set_ref_arr(call_4_1,int3,im15);im1=call_4_1.value;call_4_1=null;;
//line 94
im13=null;
//line 94
im15=null;
//line 95
label = 33; continue;
//line 95
case 33:
//line 95
bool8=null;
//line 95
int6=null;
//line 96
int3=Math.floor(int3+int4);
//line 96
label = 4; continue;
//line 96
case 38:
//line 97
im17=c[0];
//line 97
im16=n.array.join(im17,im1);
//line 97
im17=null;
//line 97
im0=null;
//line 97
im1=null;
//line 97
int2=null;
//line 97
int3=null;
//line 97
int4=null;
//line 97
bool5=null;
//line 97
int6=null;
//line 97
return im16;
}}}

n.string.__dyn_lc=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string.lc(arg0)
return ret;
}

n.string.uc=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var int2=null;
var int3=null;
var int4=null;
var bool5=null;
var int6=null;
var im7=null;
var bool8=null;
var bool9=null;
var int10=null;
var int11=null;
var int12=null;
var im13=null;
var im14=null;
var im15=null;
var im16=null;
var im17=null;
var label=null;
while (1) { switch (label) {
default:
//line 101
im1=n.string.to_array(im0);
//line 102
int2=n.c_rt_lib.array_len(im1);;
//line 102
int3=0;
//line 102
int4=1;
//line 102
case 4:
//line 102
bool5=int3>=int2;
//line 102
if (bool5) {label = 38; continue;}
//line 103
im7=im1.get_index(int3);
//line 103
int6=n.string.ord(im7);
//line 103
im7=null;
//line 104
int10=97;
//line 104
bool8=int6>=int10;
//line 104
int10=null;
//line 104
bool9=!bool8
//line 104
if (bool9) {label = 18; continue;}
//line 104
int11=122;
//line 104
bool8=int6<=int11;
//line 104
int11=null;
//line 104
case 18:
//line 104
bool9=null;
//line 104
bool8=!bool8
//line 104
if (bool8) {label = 33; continue;}
//line 105
int12=32;
//line 105
int6=Math.floor(int6-int12);
//line 105
int12=null;
//line 106
im14=n.imm_int(int6)
//line 106
im13=n.string.chr(im14);
//line 106
im14=null;
//line 106
im15=im13
//line 106
var call_4_1=new n.imm_ref(im1);n.c_rt_lib.set_ref_arr(call_4_1,int3,im15);im1=call_4_1.value;call_4_1=null;;
//line 106
im13=null;
//line 106
im15=null;
//line 107
label = 33; continue;
//line 107
case 33:
//line 107
bool8=null;
//line 107
int6=null;
//line 108
int3=Math.floor(int3+int4);
//line 108
label = 4; continue;
//line 108
case 38:
//line 109
im17=c[0];
//line 109
im16=n.array.join(im17,im1);
//line 109
im17=null;
//line 109
im0=null;
//line 109
im1=null;
//line 109
int2=null;
//line 109
int3=null;
//line 109
int4=null;
//line 109
bool5=null;
//line 109
int6=null;
//line 109
return im16;
}}}

n.string.__dyn_uc=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string.uc(arg0)
return ret;
}

n.string.index2=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var int3=null;
var label=null;
while (1) { switch (label) {
default:
//line 113
int3=0;
//line 113
int2=n.c_std_lib.string_index(im0,im1,int3);
//line 113
int3=null;
//line 113
im0=null;
//line 113
im1=null;
//line 113
return int2;
}}}

n.string.__dyn_index2=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.imm_int(n.string.index2(arg0, arg1))
return ret;
}

n.string.index=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 117
int4=im2.as_int();
//line 117
int3=n.c_std_lib.string_index(im0,im1,int4);
//line 117
int4=null;
//line 117
im0=null;
//line 117
im1=null;
//line 117
im2=null;
//line 117
return int3;
}}}

n.string.__dyn_index=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.imm_int(n.string.index(arg0, arg1, arg2))
return ret;
}

n.string.contain_lc=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 121
im0=n.string.lc(im0);
//line 122
int3=n.string.index2(im0,im1);
//line 122
int4=0;
//line 122
bool2=int3>=int4;
//line 122
int3=null;
//line 122
int4=null;
//line 122
im0=null;
//line 122
im1=null;
//line 122
return bool2;
}}}

n.string.__dyn_contain_lc=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.string.contain_lc(arg0, arg1))
return ret;
}

n.string.replace=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 126
im3=n.c_std_lib.string_replace(im0,im1,im2);
//line 126
im0=null;
//line 126
im1=null;
//line 126
im2=null;
//line 126
return im3;
}}}

n.string.__dyn_replace=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.string.replace(arg0, arg1, arg2)
return ret;
}

n.string.replace_arr=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var int3=null;
var bool4=null;
var int5=null;
var im6=null;
var int7=null;
var bool8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var im13=null;
var label=null;
while (1) { switch (label) {
default:
//line 130
int3=n.c_rt_lib.array_len(im1);;
//line 131
int5=n.c_rt_lib.array_len(im2);;
//line 131
bool4=int3==int5;
//line 131
int5=null;
//line 131
bool4=!bool4
//line 131
bool4=!bool4
//line 131
if (bool4) {label = 10; continue;}
//line 131
im6=n.imm_arr([]);
//line 131
n.nl_die();
//line 131
label = 10; continue;
//line 131
case 10:
//line 131
bool4=null;
//line 131
im6=null;
//line 132
int7=0;
//line 132
case 14:
//line 132
bool8=int7<int3;
//line 132
bool8=!bool8
//line 132
if (bool8) {label = 27; continue;}
//line 133
im9=im1.get_index(int7);
//line 133
im10=im2.get_index(int7);
//line 133
im0=n.string.replace(im0,im9,im10);
//line 133
im9=null;
//line 133
im10=null;
//line 132
int11=1;
//line 132
int7=Math.floor(int7+int11);
//line 132
int11=null;
//line 134
label = 14; continue;
//line 134
case 27:
//line 135
im13=n.ptd.string();
//line 135
im12=n.ptd.ensure(im13,im0);
//line 135
im13=null;
//line 135
im0=null;
//line 135
im1=null;
//line 135
im2=null;
//line 135
int3=null;
//line 135
int7=null;
//line 135
bool8=null;
//line 135
return im12;
}}}

n.string.__dyn_replace_arr=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.string.replace_arr(arg0, arg1, arg2)
return ret;
}

n.string.ord=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var label=null;
while (1) { switch (label) {
default:
//line 139
int1=n.c_std_lib.string_ord(im0);
//line 139
im0=null;
//line 139
return int1;
}}}

n.string.__dyn_ord=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.imm_int(n.string.ord(arg0))
return ret;
}

n.string.is_digit=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var label=null;
while (1) { switch (label) {
default:
//line 143
int1=n.string.ord(im0);
//line 144
int4=48;
//line 144
bool2=int1>=int4;
//line 144
int4=null;
//line 144
bool3=!bool2
//line 144
if (bool3) {label = 9; continue;}
//line 144
int5=57;
//line 144
bool2=int1<=int5;
//line 144
int5=null;
//line 144
case 9:
//line 144
bool3=null;
//line 144
im0=null;
//line 144
int1=null;
//line 144
return bool2;
}}}

n.string.__dyn_is_digit=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string.is_digit(arg0))
return ret;
}

n.string.is_hex_digit=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var bool6=null;
var int7=null;
var int8=null;
var bool9=null;
var int10=null;
var int11=null;
var label=null;
while (1) { switch (label) {
default:
//line 148
int1=n.string.ord(im0);
//line 149
int4=48;
//line 149
bool2=int1>=int4;
//line 149
int4=null;
//line 149
bool3=!bool2
//line 149
if (bool3) {label = 9; continue;}
//line 149
int5=57;
//line 149
bool2=int1<=int5;
//line 149
int5=null;
//line 149
case 9:
//line 149
bool3=null;
//line 149
if (bool2) {label = 22; continue;}
//line 149
int7=65;
//line 149
bool2=int1>=int7;
//line 149
int7=null;
//line 149
bool6=!bool2
//line 149
if (bool6) {label = 20; continue;}
//line 149
int8=70;
//line 149
bool2=int1<=int8;
//line 149
int8=null;
//line 149
case 20:
//line 149
bool6=null;
//line 149
case 22:
//line 149
if (bool2) {label = 34; continue;}
//line 149
int10=97;
//line 149
bool2=int1>=int10;
//line 149
int10=null;
//line 149
bool9=!bool2
//line 149
if (bool9) {label = 32; continue;}
//line 149
int11=102;
//line 149
bool2=int1<=int11;
//line 149
int11=null;
//line 149
case 32:
//line 149
bool9=null;
//line 149
case 34:
//line 149
im0=null;
//line 149
int1=null;
//line 149
return bool2;
}}}

n.string.__dyn_is_hex_digit=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string.is_hex_digit(arg0))
return ret;
}

n.string.is_letter=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var bool6=null;
var int7=null;
var int8=null;
var label=null;
while (1) { switch (label) {
default:
//line 153
int1=n.string.ord(im0);
//line 154
int4=97;
//line 154
bool2=int1>=int4;
//line 154
int4=null;
//line 154
bool3=!bool2
//line 154
if (bool3) {label = 9; continue;}
//line 154
int5=122;
//line 154
bool2=int1<=int5;
//line 154
int5=null;
//line 154
case 9:
//line 154
bool3=null;
//line 154
if (bool2) {label = 22; continue;}
//line 154
int7=65;
//line 154
bool2=int1>=int7;
//line 154
int7=null;
//line 154
bool6=!bool2
//line 154
if (bool6) {label = 20; continue;}
//line 154
int8=90;
//line 154
bool2=int1<=int8;
//line 154
int8=null;
//line 154
case 20:
//line 154
bool6=null;
//line 154
case 22:
//line 154
im0=null;
//line 154
int1=null;
//line 154
return bool2;
}}}

n.string.__dyn_is_letter=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string.is_letter(arg0))
return ret;
}

n.string.encode_utf16=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var label=null;
while (1) { switch (label) {
default:
//line 158
im1=n.c_std_lib.string_encode_utf16(im0);
//line 158
im0=null;
//line 158
return im1;
//line 158
im0=null;
//line 158
im1=null;
//line 158
return null;
}}}

n.string.__dyn_encode_utf16=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string.encode_utf16(arg0)
return ret;
}

n.string.decode_utf16=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var label=null;
while (1) { switch (label) {
default:
//line 162
im2=n.c_std_lib.string_decode_utf16(im0,im1);
//line 162
im0=null;
//line 162
im1=null;
//line 162
return im2;
//line 162
im0=null;
//line 162
im1=null;
//line 162
im2=null;
//line 162
return null;
}}}

n.string.__dyn_decode_utf16=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string.decode_utf16(arg0, arg1)
return ret;
}

n.string.is_empty=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var int2=null;
var int3=null;
var label=null;
while (1) { switch (label) {
default:
//line 166
int2=n.string.length(im0);
//line 166
int3=0;
//line 166
bool1=int2==int3;
//line 166
int2=null;
//line 166
int3=null;
//line 166
im0=null;
//line 166
return bool1;
}}}

n.string.__dyn_is_empty=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string.is_empty(arg0))
return ret;
}

n.string.chr=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var int2=null;
var label=null;
while (1) { switch (label) {
default:
//line 170
int2=im0.as_int();
//line 170
im1=n.c_std_lib.string_chr(int2);
//line 170
int2=null;
//line 170
im0=null;
//line 170
return im1;
}}}

n.string.__dyn_chr=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string.chr(arg0)
return ret;
}

n.string.lt=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 174
int3=n.string.compare(im0,im1);
//line 174
int4=0;
//line 174
bool2=int3<int4;
//line 174
int3=null;
//line 174
int4=null;
//line 174
im0=null;
//line 174
im1=null;
//line 174
return bool2;
}}}

n.string.__dyn_lt=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.string.lt(arg0, arg1))
return ret;
}

n.string.gt=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 178
int3=n.string.compare(im0,im1);
//line 178
int4=0;
//line 178
bool2=int3>int4;
//line 178
int3=null;
//line 178
int4=null;
//line 178
im0=null;
//line 178
im1=null;
//line 178
return bool2;
}}}

n.string.__dyn_gt=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.string.gt(arg0, arg1))
return ret;
}

n.string.compare=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var label=null;
while (1) { switch (label) {
default:
//line 182
int2=n.c_std_lib.string_compare(im0,im1);
//line 182
im0=null;
//line 182
im1=null;
//line 182
return int2;
}}}

n.string.__dyn_compare=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.imm_int(n.string.compare(arg0, arg1))
return ret;
}

n.string.le=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 186
int3=n.string.compare(im0,im1);
//line 186
int4=0;
//line 186
bool2=int3<=int4;
//line 186
int3=null;
//line 186
int4=null;
//line 186
im0=null;
//line 186
im1=null;
//line 186
return bool2;
}}}

n.string.__dyn_le=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.string.le(arg0, arg1))
return ret;
}

n.string.ge=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var int3=null;
var int4=null;
var label=null;
while (1) { switch (label) {
default:
//line 190
int3=n.string.compare(im0,im1);
//line 190
int4=0;
//line 190
bool2=int3>=int4;
//line 190
int3=null;
//line 190
int4=null;
//line 190
im0=null;
//line 190
im1=null;
//line 190
return bool2;
}}}

n.string.__dyn_ge=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.c_rt_lib.native_to_nl(n.string.ge(arg0, arg1))
return ret;
}
var c=[];
c[0] = n.imm_str("");})(nl=nl || {}); 
var nl;
(function(n , undefined) {
n.string_utils={};
if (nl.c_rt_lib === undefined) { nl_init.c_rt_lib_init(nl=nl || {}); }
if (nl.c_std_lib === undefined) { nl_init.c_std_lib_init(nl=nl || {}); }

n.string_utils.is_int=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var bool2=null;
var int3=null;
var int4=null;
var int5=null;
var int6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 13
int3=n.string.ord(im0);
//line 13
int4=47;
//line 13
bool1=int3>int4;
//line 13
int3=null;
//line 13
int4=null;
//line 13
bool2=!bool1
//line 13
if (bool2) {label = 12; continue;}
//line 13
int5=n.string.ord(im0);
//line 13
int6=58;
//line 13
bool1=int5<int6;
//line 13
int5=null;
//line 13
int6=null;
//line 13
case 12:
//line 13
bool2=null;
//line 13
im7=n.c_rt_lib.native_to_nl(bool1)
//line 13
im0=null;
//line 13
bool1=null;
//line 13
return im7;
//line 13
im0=null;
//line 13
bool1=null;
//line 13
im7=null;
//line 13
return null;
}}}

n.string_utils.__dyn_is_int=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.is_int(arg0)
return ret;
}

n.string_utils.is_whitespace=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var label=null;
while (1) { switch (label) {
default:
//line 17
im2=c[0];
//line 17
bool1=n.c_rt_lib.eq(im0, im2)
//line 17
im2=null;
//line 17
if (bool1) {label = 7; continue;}
//line 17
im3=n.string.lf();
//line 17
bool1=n.c_rt_lib.eq(im0, im3)
//line 17
im3=null;
//line 17
case 7:
//line 17
if (bool1) {label = 12; continue;}
//line 17
im4=n.string.tab();
//line 17
bool1=n.c_rt_lib.eq(im0, im4)
//line 17
im4=null;
//line 17
case 12:
//line 17
if (bool1) {label = 17; continue;}
//line 17
im5=n.string.r();
//line 17
bool1=n.c_rt_lib.eq(im0, im5)
//line 17
im5=null;
//line 17
case 17:
//line 17
if (bool1) {label = 22; continue;}
//line 17
im6=n.string.f();
//line 17
bool1=n.c_rt_lib.eq(im0, im6)
//line 17
im6=null;
//line 17
case 22:
//line 17
im7=n.c_rt_lib.native_to_nl(bool1)
//line 17
im0=null;
//line 17
bool1=null;
//line 17
return im7;
//line 17
im0=null;
//line 17
bool1=null;
//line 17
im7=null;
//line 17
return null;
}}}

n.string_utils.__dyn_is_whitespace=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.is_whitespace(arg0)
return ret;
}

n.string_utils.is_alpha=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var int1=null;
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var bool6=null;
var int7=null;
var int8=null;
var im9=null;
var label=null;
while (1) { switch (label) {
default:
//line 21
int1=n.string.ord(im0);
//line 22
int4=64;
//line 22
bool2=int1>int4;
//line 22
int4=null;
//line 22
bool3=!bool2
//line 22
if (bool3) {label = 9; continue;}
//line 22
int5=91;
//line 22
bool2=int1<int5;
//line 22
int5=null;
//line 22
case 9:
//line 22
bool3=null;
//line 22
if (bool2) {label = 22; continue;}
//line 22
int7=96;
//line 22
bool2=int1>int7;
//line 22
int7=null;
//line 22
bool6=!bool2
//line 22
if (bool6) {label = 20; continue;}
//line 22
int8=123;
//line 22
bool2=int1<int8;
//line 22
int8=null;
//line 22
case 20:
//line 22
bool6=null;
//line 22
case 22:
//line 22
im9=n.c_rt_lib.native_to_nl(bool2)
//line 22
im0=null;
//line 22
int1=null;
//line 22
bool2=null;
//line 22
return im9;
//line 22
im0=null;
//line 22
int1=null;
//line 22
bool2=null;
//line 22
im9=null;
//line 22
return null;
}}}

n.string_utils.__dyn_is_alpha=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.is_alpha(arg0)
return ret;
}

n.string_utils.get_integer=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var int8=null;
var int9=null;
var bool10=null;
var im11=null;
var int12=null;
var im13=null;
var int14=null;
var int15=null;
var int16=null;
var int17=null;
var im18=null;
var int19=null;
var int20=null;
var int21=null;
var bool22=null;
var im23=null;
var bool24=null;
var im25=null;
var im26=null;
var im27=null;
var int28=null;
var int29=null;
var int30=null;
var int31=null;
var im32=null;
var im33=null;
var int34=null;
var im35=null;
var label=null;
while (1) { switch (label) {
default:
//line 26
im2=c[1];
//line 26
bool1=n.c_rt_lib.eq(im0, im2)
//line 26
im2=null;
//line 26
if (bool1) {label = 7; continue;}
//line 26
im3=c[2];
//line 26
bool1=n.c_rt_lib.eq(im0, im3)
//line 26
im3=null;
//line 26
case 7:
//line 26
bool1=!bool1
//line 26
if (bool1) {label = 17; continue;}
//line 26
im5=c[1];
//line 26
im4=n.c_rt_lib.ov_mk_arg(c[3],im5);;
//line 26
im5=null;
//line 26
im0=null;
//line 26
bool1=null;
//line 26
return im4;
//line 26
label = 17; continue;
//line 26
case 17:
//line 26
bool1=null;
//line 26
im4=null;
//line 27
im7=c[1];
//line 27
im6=n.string.split(im7,im0);
//line 27
im7=null;
//line 28
int8=0;
//line 29
int9=1;
//line 30
int12=0;
//line 30
im11=im6.get_index(int12);
//line 30
int12=null;
//line 30
im13=c[2];
//line 30
bool10=n.c_rt_lib.eq(im11, im13)
//line 30
im11=null;
//line 30
im13=null;
//line 30
bool10=!bool10
//line 30
if (bool10) {label = 46; continue;}
//line 31
int14=1;
//line 31
int16=n.c_rt_lib.array_len(im6);;
//line 31
int17=1;
//line 31
int15=Math.floor(int16-int17);
//line 31
int16=null;
//line 31
int17=null;
//line 31
im6=n.array.subarray(im6,int14,int15);
//line 31
int14=null;
//line 31
int15=null;
//line 32
int9=1;
//line 32
int9=-int9
//line 33
label = 46; continue;
//line 33
case 46:
//line 33
bool10=null;
//line 34
int19=0;
//line 34
int20=1;
//line 34
int21=n.c_rt_lib.array_len(im6);;
//line 34
case 51:
//line 34
bool22=int19>=int21;
//line 34
if (bool22) {label = 96; continue;}
//line 34
im23=im6.get_index(int19);
//line 34
im18=im23
//line 35
im25=n.string_utils.is_int(im18);
//line 35
bool24=n.c_rt_lib.check_true_native(im25);;
//line 35
im25=null;
//line 35
bool24=!bool24
//line 35
bool24=!bool24
//line 35
if (bool24) {label = 78; continue;}
//line 35
im27=c[1];
//line 35
im26=n.c_rt_lib.ov_mk_arg(c[3],im27);;
//line 35
im27=null;
//line 35
im0=null;
//line 35
im6=null;
//line 35
int8=null;
//line 35
int9=null;
//line 35
im18=null;
//line 35
int19=null;
//line 35
int20=null;
//line 35
int21=null;
//line 35
bool22=null;
//line 35
im23=null;
//line 35
bool24=null;
//line 35
return im26;
//line 35
label = 78; continue;
//line 35
case 78:
//line 35
bool24=null;
//line 35
im26=null;
//line 36
int28=10;
//line 36
int8=Math.floor(int8*int28);
//line 36
int28=null;
//line 37
int30=n.string.ord(im18);
//line 37
im32=c[4];
//line 37
int31=n.string.ord(im32);
//line 37
im32=null;
//line 37
int29=Math.floor(int30-int31);
//line 37
int30=null;
//line 37
int31=null;
//line 37
int8=Math.floor(int8+int29);
//line 37
int29=null;
//line 37
im18=null;
//line 38
int19=Math.floor(int19+int20);
//line 38
label = 51; continue;
//line 38
case 96:
//line 39
int34=Math.floor(int9*int8);
//line 39
im35=n.imm_int(int34)
//line 39
im33=n.c_rt_lib.ov_mk_arg(c[5],im35);;
//line 39
int34=null;
//line 39
im35=null;
//line 39
im0=null;
//line 39
im6=null;
//line 39
int8=null;
//line 39
int9=null;
//line 39
im18=null;
//line 39
int19=null;
//line 39
int20=null;
//line 39
int21=null;
//line 39
bool22=null;
//line 39
im23=null;
//line 39
return im33;
}}}

n.string_utils.__dyn_get_integer=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.get_integer(arg0)
return ret;
}

n.string_utils.is_integer=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var bool2=null;
var bool3=null;
var bool4=null;
var im5=null;
var bool6=null;
var int7=null;
var bool8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var im13=null;
var int14=null;
var bool15=null;
var im16=null;
var im17=null;
var int18=null;
var im19=null;
var im20=null;
var bool21=null;
var bool22=null;
var label=null;
while (1) { switch (label) {
default:
//line 43
im1=c[1];
//line 43
im0=n.c_rt_lib.concat(im0,im1);;
//line 43
im1=null;
//line 44
bool2=n.string_utils.is_integer_possibly_leading_zeros(im0);
//line 44
bool2=!bool2
//line 44
bool2=!bool2
//line 44
if (bool2) {label = 12; continue;}
//line 44
bool3=false;
//line 44
im0=null;
//line 44
bool2=null;
//line 44
return bool3;
//line 44
label = 12; continue;
//line 44
case 12:
//line 44
bool2=null;
//line 44
bool3=null;
//line 45
im5=c[4];
//line 45
bool4=n.c_rt_lib.eq(im0, im5)
//line 45
im5=null;
//line 45
bool4=!bool4
//line 45
if (bool4) {label = 25; continue;}
//line 45
bool6=true;
//line 45
im0=null;
//line 45
bool4=null;
//line 45
return bool6;
//line 45
label = 25; continue;
//line 45
case 25:
//line 45
bool4=null;
//line 45
bool6=null;
//line 46
int7=0;
//line 47
im10=n.imm_int(int7)
//line 47
int11=1;
//line 47
im12=n.imm_int(int11)
//line 47
im9=n.string.substr(im0,im10,im12);
//line 47
im10=null;
//line 47
int11=null;
//line 47
im12=null;
//line 47
im13=c[2];
//line 47
bool8=n.c_rt_lib.eq(im9, im13)
//line 47
im9=null;
//line 47
im13=null;
//line 47
bool8=!bool8
//line 47
if (bool8) {label = 46; continue;}
//line 47
int14=1;
//line 47
int7=Math.floor(int7+int14);
//line 47
int14=null;
//line 47
label = 46; continue;
//line 47
case 46:
//line 47
bool8=null;
//line 48
im17=n.imm_int(int7)
//line 48
int18=1;
//line 48
im19=n.imm_int(int18)
//line 48
im16=n.string.substr(im0,im17,im19);
//line 48
im17=null;
//line 48
int18=null;
//line 48
im19=null;
//line 48
im20=c[4];
//line 48
bool15=n.c_rt_lib.eq(im16, im20)
//line 48
im16=null;
//line 48
im20=null;
//line 48
bool15=!bool15
//line 48
if (bool15) {label = 67; continue;}
//line 48
bool21=false;
//line 48
im0=null;
//line 48
int7=null;
//line 48
bool15=null;
//line 48
return bool21;
//line 48
label = 67; continue;
//line 48
case 67:
//line 48
bool15=null;
//line 48
bool21=null;
//line 49
bool22=true;
//line 49
im0=null;
//line 49
int7=null;
//line 49
return bool22;
}}}

n.string_utils.__dyn_is_integer=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string_utils.is_integer(arg0))
return ret;
}

n.string_utils.is_integer_possibly_leading_zeros=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var int3=null;
var int4=null;
var bool5=null;
var im6=null;
var im7=null;
var int8=null;
var im9=null;
var im10=null;
var int11=null;
var bool12=null;
var bool13=null;
var bool14=null;
var bool15=null;
var im16=null;
var im17=null;
var int18=null;
var im19=null;
var bool20=null;
var int21=null;
var bool22=null;
var label=null;
while (1) { switch (label) {
default:
//line 53
im2=c[1];
//line 53
im1=n.c_rt_lib.concat(im0,im2);;
//line 53
im2=null;
//line 54
int3=n.string.length(im1);
//line 55
int4=0;
//line 56
im7=n.imm_int(int4)
//line 56
int8=1;
//line 56
im9=n.imm_int(int8)
//line 56
im6=n.string.substr(im1,im7,im9);
//line 56
im7=null;
//line 56
int8=null;
//line 56
im9=null;
//line 56
im10=c[2];
//line 56
bool5=n.c_rt_lib.eq(im6, im10)
//line 56
im6=null;
//line 56
im10=null;
//line 56
bool5=!bool5
//line 56
if (bool5) {label = 22; continue;}
//line 56
int11=1;
//line 56
int4=Math.floor(int4+int11);
//line 56
int11=null;
//line 56
label = 22; continue;
//line 56
case 22:
//line 56
bool5=null;
//line 57
bool12=int4==int3;
//line 57
bool12=!bool12
//line 57
if (bool12) {label = 35; continue;}
//line 57
bool13=false;
//line 57
im0=null;
//line 57
im1=null;
//line 57
int3=null;
//line 57
int4=null;
//line 57
bool12=null;
//line 57
return bool13;
//line 57
label = 35; continue;
//line 57
case 35:
//line 57
bool12=null;
//line 57
bool13=null;
//line 58
case 38:
//line 58
bool14=int4<int3;
//line 58
bool14=!bool14
//line 58
if (bool14) {label = 70; continue;}
//line 59
im17=n.imm_int(int4)
//line 59
int18=1;
//line 59
im19=n.imm_int(int18)
//line 59
im16=n.string.substr(im1,im17,im19);
//line 59
im17=null;
//line 59
int18=null;
//line 59
im19=null;
//line 59
bool15=n.string.is_digit(im16);
//line 59
im16=null;
//line 59
bool15=!bool15
//line 59
bool15=!bool15
//line 59
if (bool15) {label = 63; continue;}
//line 59
bool20=false;
//line 59
im0=null;
//line 59
im1=null;
//line 59
int3=null;
//line 59
int4=null;
//line 59
bool14=null;
//line 59
bool15=null;
//line 59
return bool20;
//line 59
label = 63; continue;
//line 59
case 63:
//line 59
bool15=null;
//line 59
bool20=null;
//line 58
int21=1;
//line 58
int4=Math.floor(int4+int21);
//line 58
int21=null;
//line 60
label = 38; continue;
//line 60
case 70:
//line 61
bool22=true;
//line 61
im0=null;
//line 61
im1=null;
//line 61
int3=null;
//line 61
int4=null;
//line 61
bool14=null;
//line 61
return bool22;
}}}

n.string_utils.__dyn_is_integer_possibly_leading_zeros=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string_utils.is_integer_possibly_leading_zeros(arg0))
return ret;
}

n.string_utils.is_float=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var int3=null;
var bool4=null;
var int5=null;
var bool6=null;
var int7=null;
var bool8=null;
var im9=null;
var im10=null;
var int11=null;
var im12=null;
var im13=null;
var int14=null;
var bool15=null;
var bool16=null;
var im17=null;
var im18=null;
var int19=null;
var im20=null;
var int21=null;
var bool22=null;
var int23=null;
var int24=null;
var int25=null;
var bool26=null;
var bool27=null;
var im28=null;
var im29=null;
var int30=null;
var im31=null;
var im32=null;
var bool33=null;
var int34=null;
var bool35=null;
var bool36=null;
var im37=null;
var im38=null;
var int39=null;
var im40=null;
var bool41=null;
var int42=null;
var bool43=null;
var label=null;
while (1) { switch (label) {
default:
//line 65
im2=c[1];
//line 65
im1=n.c_rt_lib.concat(im0,im2);;
//line 65
im2=null;
//line 66
int3=n.string.length(im1);
//line 67
int5=3;
//line 67
bool4=int3<int5;
//line 67
int5=null;
//line 67
bool4=!bool4
//line 67
if (bool4) {label = 16; continue;}
//line 67
bool6=false;
//line 67
im0=null;
//line 67
im1=null;
//line 67
int3=null;
//line 67
bool4=null;
//line 67
return bool6;
//line 67
label = 16; continue;
//line 67
case 16:
//line 67
bool4=null;
//line 67
bool6=null;
//line 68
int7=0;
//line 69
im10=n.imm_int(int7)
//line 69
int11=1;
//line 69
im12=n.imm_int(int11)
//line 69
im9=n.string.substr(im1,im10,im12);
//line 69
im10=null;
//line 69
int11=null;
//line 69
im12=null;
//line 69
im13=c[2];
//line 69
bool8=n.c_rt_lib.eq(im9, im13)
//line 69
im9=null;
//line 69
im13=null;
//line 69
bool8=!bool8
//line 69
if (bool8) {label = 37; continue;}
//line 69
int14=1;
//line 69
int7=Math.floor(int7+int14);
//line 69
int14=null;
//line 69
label = 37; continue;
//line 69
case 37:
//line 69
bool8=null;
//line 70
int7=int7
//line 70
case 40:
//line 70
bool15=int7<int3;
//line 70
bool15=!bool15
//line 70
if (bool15) {label = 65; continue;}
//line 71
im18=n.imm_int(int7)
//line 71
int19=1;
//line 71
im20=n.imm_int(int19)
//line 71
im17=n.string.substr(im1,im18,im20);
//line 71
im18=null;
//line 71
int19=null;
//line 71
im20=null;
//line 71
bool16=n.string.is_digit(im17);
//line 71
im17=null;
//line 71
bool16=!bool16
//line 71
bool16=!bool16
//line 71
if (bool16) {label = 59; continue;}
//line 71
bool16=null;
//line 71
label = 65; continue;
//line 71
label = 59; continue;
//line 71
case 59:
//line 71
bool16=null;
//line 70
int21=1;
//line 70
int7=Math.floor(int7+int21);
//line 70
int21=null;
//line 72
label = 40; continue;
//line 72
case 65:
//line 73
int23=1;
//line 73
bool22=int7<int23;
//line 73
int23=null;
//line 73
if (bool22) {label = 75; continue;}
//line 73
int25=2;
//line 73
int24=Math.floor(int7+int25);
//line 73
int25=null;
//line 73
bool22=int24>int3;
//line 73
int24=null;
//line 73
case 75:
//line 73
bool22=!bool22
//line 73
if (bool22) {label = 87; continue;}
//line 73
bool26=false;
//line 73
im0=null;
//line 73
im1=null;
//line 73
int3=null;
//line 73
int7=null;
//line 73
bool15=null;
//line 73
bool22=null;
//line 73
return bool26;
//line 73
label = 87; continue;
//line 73
case 87:
//line 73
bool22=null;
//line 73
bool26=null;
//line 74
im29=n.imm_int(int7)
//line 74
int30=1;
//line 74
im31=n.imm_int(int30)
//line 74
im28=n.string.substr(im1,im29,im31);
//line 74
im29=null;
//line 74
int30=null;
//line 74
im31=null;
//line 74
im32=c[6];
//line 74
bool27=n.c_rt_lib.eq(im28, im32)
//line 74
im28=null;
//line 74
im32=null;
//line 74
bool27=!bool27
//line 74
bool27=!bool27
//line 74
if (bool27) {label = 113; continue;}
//line 74
bool33=false;
//line 74
im0=null;
//line 74
im1=null;
//line 74
int3=null;
//line 74
int7=null;
//line 74
bool15=null;
//line 74
bool27=null;
//line 74
return bool33;
//line 74
label = 113; continue;
//line 74
case 113:
//line 74
bool27=null;
//line 74
bool33=null;
//line 75
int34=1;
//line 75
int7=Math.floor(int7+int34);
//line 75
int34=null;
//line 75
case 119:
//line 75
bool35=int7<int3;
//line 75
bool35=!bool35
//line 75
if (bool35) {label = 152; continue;}
//line 76
im38=n.imm_int(int7)
//line 76
int39=1;
//line 76
im40=n.imm_int(int39)
//line 76
im37=n.string.substr(im1,im38,im40);
//line 76
im38=null;
//line 76
int39=null;
//line 76
im40=null;
//line 76
bool36=n.string.is_digit(im37);
//line 76
im37=null;
//line 76
bool36=!bool36
//line 76
bool36=!bool36
//line 76
if (bool36) {label = 145; continue;}
//line 76
bool41=false;
//line 76
im0=null;
//line 76
im1=null;
//line 76
int3=null;
//line 76
int7=null;
//line 76
bool15=null;
//line 76
bool35=null;
//line 76
bool36=null;
//line 76
return bool41;
//line 76
label = 145; continue;
//line 76
case 145:
//line 76
bool36=null;
//line 76
bool41=null;
//line 75
int42=1;
//line 75
int7=Math.floor(int7+int42);
//line 75
int42=null;
//line 77
label = 119; continue;
//line 77
case 152:
//line 78
bool43=true;
//line 78
im0=null;
//line 78
im1=null;
//line 78
int3=null;
//line 78
int7=null;
//line 78
bool15=null;
//line 78
bool35=null;
//line 78
return bool43;
}}}

n.string_utils.__dyn_is_float=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string_utils.is_float(arg0))
return ret;
}

n.string_utils.is_number=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var bool3=null;
var label=null;
while (1) { switch (label) {
default:
//line 82
im2=c[1];
//line 82
im1=n.c_rt_lib.concat(im0,im2);;
//line 82
im2=null;
//line 83
bool3=n.string_utils.is_integer(im1);
//line 83
if (bool3) {label = 6; continue;}
//line 83
bool3=n.string_utils.is_float(im1);
//line 83
case 6:
//line 83
im0=null;
//line 83
im1=null;
//line 83
return bool3;
}}}

n.string_utils.__dyn_is_number=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.c_rt_lib.native_to_nl(n.string_utils.is_number(arg0))
return ret;
}

n.string_utils.get_number=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var bool8=null;
var im9=null;
var int10=null;
var im11=null;
var int12=null;
var int13=null;
var int14=null;
var int15=null;
var bool16=null;
var im17=null;
var int18=null;
var im19=null;
var im20=null;
var bool21=null;
var im22=null;
var int23=null;
var int24=null;
var int25=null;
var bool26=null;
var im27=null;
var bool28=null;
var im29=null;
var bool30=null;
var bool31=null;
var im32=null;
var im33=null;
var bool34=null;
var im35=null;
var im36=null;
var im37=null;
var label=null;
while (1) { switch (label) {
default:
//line 87
im2=c[1];
//line 87
bool1=n.c_rt_lib.eq(im0, im2)
//line 87
im2=null;
//line 87
if (bool1) {label = 7; continue;}
//line 87
im3=c[2];
//line 87
bool1=n.c_rt_lib.eq(im0, im3)
//line 87
im3=null;
//line 87
case 7:
//line 87
bool1=!bool1
//line 87
if (bool1) {label = 15; continue;}
//line 87
im4=c[7]
//line 87
im0=null;
//line 87
bool1=null;
//line 87
return im4;
//line 87
label = 15; continue;
//line 87
case 15:
//line 87
bool1=null;
//line 87
im4=null;
//line 88
im6=c[1];
//line 88
im5=n.string.split(im6,im0);
//line 88
im6=null;
//line 89
im7=c[1];
//line 90
int10=0;
//line 90
im9=im5.get_index(int10);
//line 90
int10=null;
//line 90
im11=c[2];
//line 90
bool8=n.c_rt_lib.eq(im9, im11)
//line 90
im9=null;
//line 90
im11=null;
//line 90
bool8=!bool8
//line 90
if (bool8) {label = 63; continue;}
//line 91
int12=1;
//line 91
int14=n.c_rt_lib.array_len(im5);;
//line 91
int15=1;
//line 91
int13=Math.floor(int14-int15);
//line 91
int14=null;
//line 91
int15=null;
//line 91
im5=n.array.subarray(im5,int12,int13);
//line 91
int12=null;
//line 91
int13=null;
//line 92
int18=0;
//line 92
im17=im5.get_index(int18);
//line 92
int18=null;
//line 92
im19=n.string_utils.is_int(im17);
//line 92
bool16=n.c_rt_lib.check_true_native(im19);;
//line 92
im17=null;
//line 92
im19=null;
//line 92
bool16=!bool16
//line 92
bool16=!bool16
//line 92
if (bool16) {label = 58; continue;}
//line 92
im20=c[8]
//line 92
im0=null;
//line 92
im5=null;
//line 92
im7=null;
//line 92
bool8=null;
//line 92
bool16=null;
//line 92
return im20;
//line 92
label = 58; continue;
//line 92
case 58:
//line 92
bool16=null;
//line 92
im20=null;
//line 93
im7=c[2];
//line 94
label = 63; continue;
//line 94
case 63:
//line 94
bool8=null;
//line 95
bool21=false;
//line 96
int23=0;
//line 96
int24=1;
//line 96
int25=n.c_rt_lib.array_len(im5);;
//line 96
case 69:
//line 96
bool26=int23>=int25;
//line 96
if (bool26) {label = 119; continue;}
//line 96
im27=im5.get_index(int23);
//line 96
im22=im27
//line 97
im29=n.string_utils.is_int(im22);
//line 97
bool28=n.c_rt_lib.check_true_native(im29);;
//line 97
im29=null;
//line 97
bool28=!bool28
//line 97
bool28=!bool28
//line 97
if (bool28) {label = 113; continue;}
//line 98
im32=c[6];
//line 98
bool30=n.c_rt_lib.eq(im22, im32)
//line 98
im32=null;
//line 98
bool31=!bool30
//line 98
if (bool31) {label = 87; continue;}
//line 98
bool30=bool21
//line 98
bool30=!bool30
//line 98
case 87:
//line 98
bool31=null;
//line 98
bool30=!bool30
//line 98
if (bool30) {label = 93; continue;}
//line 99
bool21=true;
//line 100
label = 109; continue;
//line 100
case 93:
//line 101
im33=c[9]
//line 101
im0=null;
//line 101
im5=null;
//line 101
im7=null;
//line 101
bool21=null;
//line 101
im22=null;
//line 101
int23=null;
//line 101
int24=null;
//line 101
int25=null;
//line 101
bool26=null;
//line 101
im27=null;
//line 101
bool28=null;
//line 101
bool30=null;
//line 101
return im33;
//line 102
label = 109; continue;
//line 102
case 109:
//line 102
bool30=null;
//line 102
im33=null;
//line 103
label = 113; continue;
//line 103
case 113:
//line 103
bool28=null;
//line 104
im7=n.c_rt_lib.concat(im7,im22);;
//line 104
im22=null;
//line 105
int23=Math.floor(int23+int24);
//line 105
label = 69; continue;
//line 105
case 119:
//line 106
im35=c[6];
//line 106
bool34=n.c_rt_lib.eq(im7, im35)
//line 106
im35=null;
//line 106
bool34=!bool34
//line 106
if (bool34) {label = 139; continue;}
//line 106
im36=c[10]
//line 106
im0=null;
//line 106
im5=null;
//line 106
im7=null;
//line 106
bool21=null;
//line 106
im22=null;
//line 106
int23=null;
//line 106
int24=null;
//line 106
int25=null;
//line 106
bool26=null;
//line 106
im27=null;
//line 106
bool34=null;
//line 106
return im36;
//line 106
label = 139; continue;
//line 106
case 139:
//line 106
bool34=null;
//line 106
im36=null;
//line 107
im37=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 107
im0=null;
//line 107
im5=null;
//line 107
im7=null;
//line 107
bool21=null;
//line 107
im22=null;
//line 107
int23=null;
//line 107
int24=null;
//line 107
int25=null;
//line 107
bool26=null;
//line 107
im27=null;
//line 107
return im37;
}}}

n.string_utils.__dyn_get_number=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.get_number(arg0)
return ret;
}

function _prv_eat_ws(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var im6=null;
var int7=null;
var im8=null;
var int9=null;
var int10=null;
var int11=null;
var bool12=null;
var int13=null;
var int14=null;
var im15=null;
var label=null;
while (1) { switch (label) {
default:
//line 111
case 0:
//line 111
int4=n.c_rt_lib.array_len(im0);;
//line 111
int5=im1.as_int();
//line 111
bool2=int5<int4;
//line 111
int4=null;
//line 111
int5=null;
//line 111
bool3=!bool2
//line 111
if (bool3) {label = 15; continue;}
//line 111
int7=im1.as_int();
//line 111
im6=im0.get_index(int7);
//line 111
int7=null;
//line 111
im8=n.string_utils.is_whitespace(im6);
//line 111
bool2=n.c_rt_lib.check_true_native(im8);;
//line 111
im6=null;
//line 111
im8=null;
//line 111
case 15:
//line 111
bool3=null;
//line 111
bool2=!bool2
//line 111
if (bool2) {label = 27; continue;}
//line 111
int9=1;
//line 111
int10=im1.as_int();
//line 111
int11=Math.floor(int10+int9);
//line 111
im1=n.imm_int(int11)
//line 111
int9=null;
//line 111
int10=null;
//line 111
int11=null;
//line 111
label = 0; continue;
//line 111
case 27:
//line 112
int13=n.c_rt_lib.array_len(im0);;
//line 112
int14=im1.as_int();
//line 112
bool12=int14==int13;
//line 112
int13=null;
//line 112
int14=null;
//line 112
im15=n.c_rt_lib.native_to_nl(bool12)
//line 112
im0=null;
//line 112
bool2=null;
//line 112
bool12=null;
//line 112
___arg__1.value = im1;return im15;
//line 112
im0=null;
//line 112
bool2=null;
//line 112
bool12=null;
//line 112
im15=null;
//line 112
___arg__1.value = im1;return null;
}}}

function _prv_get_number(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var im2=null;
var bool3=null;
var im4=null;
var int5=null;
var im6=null;
var int7=null;
var int8=null;
var int9=null;
var bool10=null;
var bool11=null;
var int12=null;
var int13=null;
var im14=null;
var int15=null;
var bool16=null;
var im17=null;
var bool18=null;
var im19=null;
var int20=null;
var int21=null;
var int22=null;
var bool23=null;
var im24=null;
var im25=null;
var im26=null;
var im27=null;
var im28=null;
var label=null;
while (1) { switch (label) {
default:
//line 116
im2=c[1];
//line 117
int5=im1.as_int();
//line 117
im4=im0.get_index(int5);
//line 117
int5=null;
//line 117
im6=c[2];
//line 117
bool3=n.c_rt_lib.eq(im4, im6)
//line 117
im4=null;
//line 117
im6=null;
//line 117
bool3=!bool3
//line 117
if (bool3) {label = 19; continue;}
//line 118
int7=1;
//line 118
int8=im1.as_int();
//line 118
int9=Math.floor(int8+int7);
//line 118
im1=n.imm_int(int9)
//line 118
int7=null;
//line 118
int8=null;
//line 118
int9=null;
//line 119
im2=c[2];
//line 120
label = 19; continue;
//line 120
case 19:
//line 120
bool3=null;
//line 121
bool10=false;
//line 122
case 22:
//line 122
int12=n.c_rt_lib.array_len(im0);;
//line 122
int13=im1.as_int();
//line 122
bool11=int13<int12;
//line 122
int12=null;
//line 122
int13=null;
//line 122
bool11=!bool11
//line 122
if (bool11) {label = 68; continue;}
//line 123
int15=im1.as_int();
//line 123
im14=im0.get_index(int15);
//line 123
int15=null;
//line 124
im17=n.string_utils.is_int(im14);
//line 124
bool16=n.c_rt_lib.check_true_native(im17);;
//line 124
im17=null;
//line 124
bool16=!bool16
//line 124
bool16=!bool16
//line 124
if (bool16) {label = 56; continue;}
//line 125
im19=c[6];
//line 125
bool18=n.c_rt_lib.ne(im14, im19)
//line 125
im19=null;
//line 125
if (bool18) {label = 44; continue;}
//line 125
bool18=bool10
//line 125
case 44:
//line 125
bool18=!bool18
//line 125
if (bool18) {label = 52; continue;}
//line 125
im14=null;
//line 125
bool16=null;
//line 125
bool18=null;
//line 125
label = 68; continue;
//line 125
label = 52; continue;
//line 125
case 52:
//line 125
bool18=null;
//line 126
bool10=true;
//line 127
label = 56; continue;
//line 127
case 56:
//line 127
bool16=null;
//line 128
im2=n.c_rt_lib.concat(im2,im14);;
//line 129
int20=1;
//line 129
int21=im1.as_int();
//line 129
int22=Math.floor(int21+int20);
//line 129
im1=n.imm_int(int22)
//line 129
int20=null;
//line 129
int21=null;
//line 129
int22=null;
//line 129
im14=null;
//line 130
label = 22; continue;
//line 130
case 68:
//line 131
im24=c[1];
//line 131
bool23=n.c_rt_lib.eq(im2, im24)
//line 131
im24=null;
//line 131
if (bool23) {label = 76; continue;}
//line 131
im25=c[2];
//line 131
bool23=n.c_rt_lib.eq(im2, im25)
//line 131
im25=null;
//line 131
case 76:
//line 131
bool23=!bool23
//line 131
if (bool23) {label = 90; continue;}
//line 131
im27=c[1];
//line 131
im26=n.c_rt_lib.ov_mk_arg(c[3],im27);;
//line 131
im27=null;
//line 131
im0=null;
//line 131
im2=null;
//line 131
bool10=null;
//line 131
bool11=null;
//line 131
im14=null;
//line 131
bool23=null;
//line 131
___arg__1.value = im1;return im26;
//line 131
label = 90; continue;
//line 131
case 90:
//line 131
bool23=null;
//line 131
im26=null;
//line 132
im28=n.c_rt_lib.ov_mk_arg(c[5],im2);;
//line 132
im0=null;
//line 132
im2=null;
//line 132
bool10=null;
//line 132
bool11=null;
//line 132
im14=null;
//line 132
___arg__1.value = im1;return im28;
}}}

function _prv_cal_expr(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1.value;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var bool3=null;
var im4=null;
var im5=null;
var im6=null;
var im7=null;
var bool8=null;
var im9=null;
var int10=null;
var im11=null;
var int12=null;
var int13=null;
var int14=null;
var bool15=null;
var im16=null;
var int17=null;
var im18=null;
var bool19=null;
var im20=null;
var im21=null;
var im22=null;
var bool23=null;
var im24=null;
var int25=null;
var im26=null;
var im27=null;
var im28=null;
var int29=null;
var int30=null;
var int31=null;
var bool32=null;
var im33=null;
var bool34=null;
var im35=null;
var im36=null;
var im37=null;
var int38=null;
var bool39=null;
var im40=null;
var bool41=null;
var int42=null;
var int43=null;
var im44=null;
var int45=null;
var int46=null;
var int47=null;
var im48=null;
var bool49=null;
var im50=null;
var int51=null;
var im52=null;
var im53=null;
var bool54=null;
var int55=null;
var int56=null;
var im57=null;
var int58=null;
var int59=null;
var int60=null;
var im61=null;
var bool62=null;
var im63=null;
var int64=null;
var im65=null;
var im66=null;
var bool67=null;
var int68=null;
var int69=null;
var im70=null;
var int71=null;
var int72=null;
var int73=null;
var im74=null;
var bool75=null;
var im76=null;
var int77=null;
var im78=null;
var im79=null;
var bool80=null;
var int81=null;
var int82=null;
var im83=null;
var int84=null;
var int85=null;
var int86=null;
var im87=null;
var bool88=null;
var im89=null;
var int90=null;
var im91=null;
var im92=null;
var bool93=null;
var int94=null;
var int95=null;
var im96=null;
var int97=null;
var int98=null;
var int99=null;
var im100=null;
var bool101=null;
var im102=null;
var int103=null;
var im104=null;
var im105=null;
var bool106=null;
var int107=null;
var int108=null;
var im109=null;
var im110=null;
var im111=null;
var im112=null;
var im113=null;
var im114=null;
var label=null;
while (1) { switch (label) {
default:
//line 136
var call_0_2=new n.imm_ref(im1);im4=_prv_eat_ws(im0,call_0_2);im1=call_0_2.value;call_0_2=null;
//line 136
bool3=n.c_rt_lib.check_true_native(im4);;
//line 136
im4=null;
//line 136
bool3=!bool3
//line 136
if (bool3) {label = 13; continue;}
//line 136
im6=c[1];
//line 136
im5=n.c_rt_lib.ov_mk_arg(c[3],im6);;
//line 136
im6=null;
//line 136
im0=null;
//line 136
im2=null;
//line 136
bool3=null;
//line 136
___arg__1.value = im1;return im5;
//line 136
label = 13; continue;
//line 136
case 13:
//line 136
bool3=null;
//line 136
im5=null;
//line 138
int10=im1.as_int();
//line 138
im9=im0.get_index(int10);
//line 138
int10=null;
//line 138
im11=c[11];
//line 138
bool8=n.c_rt_lib.eq(im9, im11)
//line 138
im9=null;
//line 138
im11=null;
//line 138
bool8=!bool8
//line 138
if (bool8) {label = 100; continue;}
//line 139
int12=1;
//line 139
int13=im1.as_int();
//line 139
int14=Math.floor(int13+int12);
//line 139
im1=n.imm_int(int14)
//line 139
int12=null;
//line 139
int13=null;
//line 139
int14=null;
//line 140
int17=0;
//line 140
im18=n.imm_int(int17)
//line 140
var call_3_2=new n.imm_ref(im1);im16=_prv_cal_expr(im0,call_3_2,im18);im1=call_3_2.value;call_3_2=null;
//line 140
int17=null;
//line 140
im18=null;
//line 140
bool15=n.c_rt_lib.ov_is(im16,c[5]);;
//line 140
if (bool15) {label = 45; continue;}
//line 140
im0=null;
//line 140
im2=null;
//line 140
im7=null;
//line 140
bool8=null;
//line 140
bool15=null;
//line 140
___arg__1.value = im1;return im16;
//line 140
case 45:
//line 140
im7=n.c_rt_lib.ov_as(im16,c[5]);;
//line 141
var call_6_2=new n.imm_ref(im1);im20=_prv_eat_ws(im0,call_6_2);im1=call_6_2.value;call_6_2=null;
//line 141
bool19=n.c_rt_lib.check_true_native(im20);;
//line 141
im20=null;
//line 141
bool19=!bool19
//line 141
if (bool19) {label = 64; continue;}
//line 141
im22=c[1];
//line 141
im21=n.c_rt_lib.ov_mk_arg(c[3],im22);;
//line 141
im22=null;
//line 141
im0=null;
//line 141
im2=null;
//line 141
im7=null;
//line 141
bool8=null;
//line 141
bool15=null;
//line 141
im16=null;
//line 141
bool19=null;
//line 141
___arg__1.value = im1;return im21;
//line 141
label = 64; continue;
//line 141
case 64:
//line 141
bool19=null;
//line 141
im21=null;
//line 142
int25=im1.as_int();
//line 142
im24=im0.get_index(int25);
//line 142
int25=null;
//line 142
im26=c[12];
//line 142
bool23=n.c_rt_lib.eq(im24, im26)
//line 142
im24=null;
//line 142
im26=null;
//line 142
bool23=!bool23
//line 142
bool23=!bool23
//line 142
if (bool23) {label = 89; continue;}
//line 142
im28=c[1];
//line 142
im27=n.c_rt_lib.ov_mk_arg(c[3],im28);;
//line 142
im28=null;
//line 142
im0=null;
//line 142
im2=null;
//line 142
im7=null;
//line 142
bool8=null;
//line 142
bool15=null;
//line 142
im16=null;
//line 142
bool23=null;
//line 142
___arg__1.value = im1;return im27;
//line 142
label = 89; continue;
//line 142
case 89:
//line 142
bool23=null;
//line 142
im27=null;
//line 143
int29=1;
//line 143
int30=im1.as_int();
//line 143
int31=Math.floor(int30+int29);
//line 143
im1=n.imm_int(int31)
//line 143
int29=null;
//line 143
int30=null;
//line 143
int31=null;
//line 144
label = 115; continue;
//line 144
case 100:
//line 145
var call_10_2=new n.imm_ref(im1);im33=_prv_get_number(im0,call_10_2);im1=call_10_2.value;call_10_2=null;
//line 145
bool32=n.c_rt_lib.ov_is(im33,c[5]);;
//line 145
if (bool32) {label = 112; continue;}
//line 145
im0=null;
//line 145
im2=null;
//line 145
im7=null;
//line 145
bool8=null;
//line 145
bool15=null;
//line 145
im16=null;
//line 145
bool32=null;
//line 145
___arg__1.value = im1;return im33;
//line 145
case 112:
//line 145
im7=n.c_rt_lib.ov_as(im33,c[5]);;
//line 146
label = 115; continue;
//line 146
case 115:
//line 146
bool8=null;
//line 146
bool15=null;
//line 146
im16=null;
//line 146
bool32=null;
//line 146
im33=null;
//line 147
case 121:
//line 148
var call_13_2=new n.imm_ref(im1);im35=_prv_eat_ws(im0,call_13_2);im1=call_13_2.value;call_13_2=null;
//line 148
bool34=n.c_rt_lib.check_true_native(im35);;
//line 148
im35=null;
//line 148
bool34=!bool34
//line 148
if (bool34) {label = 134; continue;}
//line 148
im36=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 148
im0=null;
//line 148
im2=null;
//line 148
im7=null;
//line 148
bool34=null;
//line 148
___arg__1.value = im1;return im36;
//line 148
label = 134; continue;
//line 148
case 134:
//line 148
bool34=null;
//line 148
im36=null;
//line 149
int38=im1.as_int();
//line 149
im37=im0.get_index(int38);
//line 149
int38=null;
//line 150
im40=c[13];
//line 150
bool39=n.c_rt_lib.eq(im37, im40)
//line 150
im40=null;
//line 150
bool39=!bool39
//line 150
if (bool39) {label = 190; continue;}
//line 151
int42=5;
//line 151
int43=im2.as_int();
//line 151
bool41=int43>=int42;
//line 151
int42=null;
//line 151
int43=null;
//line 151
bool41=!bool41
//line 151
if (bool41) {label = 161; continue;}
//line 151
im44=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 151
im0=null;
//line 151
im2=null;
//line 151
im7=null;
//line 151
im37=null;
//line 151
bool39=null;
//line 151
bool41=null;
//line 151
___arg__1.value = im1;return im44;
//line 151
label = 161; continue;
//line 151
case 161:
//line 151
bool41=null;
//line 151
im44=null;
//line 152
int45=1;
//line 152
int46=im1.as_int();
//line 152
int47=Math.floor(int46+int45);
//line 152
im1=n.imm_int(int47)
//line 152
int45=null;
//line 152
int46=null;
//line 152
int47=null;
//line 153
int51=5;
//line 153
im52=n.imm_int(int51)
//line 153
var call_17_2=new n.imm_ref(im1);im50=_prv_cal_expr(im0,call_17_2,im52);im1=call_17_2.value;call_17_2=null;
//line 153
int51=null;
//line 153
im52=null;
//line 153
bool49=n.c_rt_lib.ov_is(im50,c[5]);;
//line 153
if (bool49) {label = 186; continue;}
//line 153
im0=null;
//line 153
im2=null;
//line 153
im7=null;
//line 153
im37=null;
//line 153
bool39=null;
//line 153
im48=null;
//line 153
bool49=null;
//line 153
___arg__1.value = im1;return im50;
//line 153
case 186:
//line 153
im48=n.c_rt_lib.ov_as(im50,c[5]);;
//line 154
im7=n.float.mul(im7,im48);
//line 155
label = 546; continue;
//line 155
case 190:
//line 155
im53=c[14];
//line 155
bool39=n.c_rt_lib.eq(im37, im53)
//line 155
im53=null;
//line 155
bool39=!bool39
//line 155
if (bool39) {label = 247; continue;}
//line 156
int55=5;
//line 156
int56=im2.as_int();
//line 156
bool54=int56>=int55;
//line 156
int55=null;
//line 156
int56=null;
//line 156
bool54=!bool54
//line 156
if (bool54) {label = 215; continue;}
//line 156
im57=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 156
im0=null;
//line 156
im2=null;
//line 156
im7=null;
//line 156
im37=null;
//line 156
bool39=null;
//line 156
im48=null;
//line 156
bool49=null;
//line 156
im50=null;
//line 156
bool54=null;
//line 156
___arg__1.value = im1;return im57;
//line 156
label = 215; continue;
//line 156
case 215:
//line 156
bool54=null;
//line 156
im57=null;
//line 157
int58=1;
//line 157
int59=im1.as_int();
//line 157
int60=Math.floor(int59+int58);
//line 157
im1=n.imm_int(int60)
//line 157
int58=null;
//line 157
int59=null;
//line 157
int60=null;
//line 158
int64=5;
//line 158
im65=n.imm_int(int64)
//line 158
var call_22_2=new n.imm_ref(im1);im63=_prv_cal_expr(im0,call_22_2,im65);im1=call_22_2.value;call_22_2=null;
//line 158
int64=null;
//line 158
im65=null;
//line 158
bool62=n.c_rt_lib.ov_is(im63,c[5]);;
//line 158
if (bool62) {label = 243; continue;}
//line 158
im0=null;
//line 158
im2=null;
//line 158
im7=null;
//line 158
im37=null;
//line 158
bool39=null;
//line 158
im48=null;
//line 158
bool49=null;
//line 158
im50=null;
//line 158
im61=null;
//line 158
bool62=null;
//line 158
___arg__1.value = im1;return im63;
//line 158
case 243:
//line 158
im61=n.c_rt_lib.ov_as(im63,c[5]);;
//line 159
im7=n.float.div(im7,im61);
//line 160
label = 546; continue;
//line 160
case 247:
//line 160
im66=c[15];
//line 160
bool39=n.c_rt_lib.eq(im37, im66)
//line 160
im66=null;
//line 160
bool39=!bool39
//line 160
if (bool39) {label = 310; continue;}
//line 161
int68=5;
//line 161
int69=im2.as_int();
//line 161
bool67=int69>=int68;
//line 161
int68=null;
//line 161
int69=null;
//line 161
bool67=!bool67
//line 161
if (bool67) {label = 275; continue;}
//line 161
im70=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 161
im0=null;
//line 161
im2=null;
//line 161
im7=null;
//line 161
im37=null;
//line 161
bool39=null;
//line 161
im48=null;
//line 161
bool49=null;
//line 161
im50=null;
//line 161
im61=null;
//line 161
bool62=null;
//line 161
im63=null;
//line 161
bool67=null;
//line 161
___arg__1.value = im1;return im70;
//line 161
label = 275; continue;
//line 161
case 275:
//line 161
bool67=null;
//line 161
im70=null;
//line 162
int71=1;
//line 162
int72=im1.as_int();
//line 162
int73=Math.floor(int72+int71);
//line 162
im1=n.imm_int(int73)
//line 162
int71=null;
//line 162
int72=null;
//line 162
int73=null;
//line 163
int77=5;
//line 163
im78=n.imm_int(int77)
//line 163
var call_27_2=new n.imm_ref(im1);im76=_prv_cal_expr(im0,call_27_2,im78);im1=call_27_2.value;call_27_2=null;
//line 163
int77=null;
//line 163
im78=null;
//line 163
bool75=n.c_rt_lib.ov_is(im76,c[5]);;
//line 163
if (bool75) {label = 306; continue;}
//line 163
im0=null;
//line 163
im2=null;
//line 163
im7=null;
//line 163
im37=null;
//line 163
bool39=null;
//line 163
im48=null;
//line 163
bool49=null;
//line 163
im50=null;
//line 163
im61=null;
//line 163
bool62=null;
//line 163
im63=null;
//line 163
im74=null;
//line 163
bool75=null;
//line 163
___arg__1.value = im1;return im76;
//line 163
case 306:
//line 163
im74=n.c_rt_lib.ov_as(im76,c[5]);;
//line 164
im7=n.float.mod(im7,im74);
//line 165
label = 546; continue;
//line 165
case 310:
//line 165
im79=c[16];
//line 165
bool39=n.c_rt_lib.eq(im37, im79)
//line 165
im79=null;
//line 165
bool39=!bool39
//line 165
if (bool39) {label = 379; continue;}
//line 166
int81=2;
//line 166
int82=im2.as_int();
//line 166
bool80=int82>=int81;
//line 166
int81=null;
//line 166
int82=null;
//line 166
bool80=!bool80
//line 166
if (bool80) {label = 341; continue;}
//line 166
im83=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 166
im0=null;
//line 166
im2=null;
//line 166
im7=null;
//line 166
im37=null;
//line 166
bool39=null;
//line 166
im48=null;
//line 166
bool49=null;
//line 166
im50=null;
//line 166
im61=null;
//line 166
bool62=null;
//line 166
im63=null;
//line 166
im74=null;
//line 166
bool75=null;
//line 166
im76=null;
//line 166
bool80=null;
//line 166
___arg__1.value = im1;return im83;
//line 166
label = 341; continue;
//line 166
case 341:
//line 166
bool80=null;
//line 166
im83=null;
//line 167
int84=1;
//line 167
int85=im1.as_int();
//line 167
int86=Math.floor(int85+int84);
//line 167
im1=n.imm_int(int86)
//line 167
int84=null;
//line 167
int85=null;
//line 167
int86=null;
//line 168
int90=2;
//line 168
im91=n.imm_int(int90)
//line 168
var call_32_2=new n.imm_ref(im1);im89=_prv_cal_expr(im0,call_32_2,im91);im1=call_32_2.value;call_32_2=null;
//line 168
int90=null;
//line 168
im91=null;
//line 168
bool88=n.c_rt_lib.ov_is(im89,c[5]);;
//line 168
if (bool88) {label = 375; continue;}
//line 168
im0=null;
//line 168
im2=null;
//line 168
im7=null;
//line 168
im37=null;
//line 168
bool39=null;
//line 168
im48=null;
//line 168
bool49=null;
//line 168
im50=null;
//line 168
im61=null;
//line 168
bool62=null;
//line 168
im63=null;
//line 168
im74=null;
//line 168
bool75=null;
//line 168
im76=null;
//line 168
im87=null;
//line 168
bool88=null;
//line 168
___arg__1.value = im1;return im89;
//line 168
case 375:
//line 168
im87=n.c_rt_lib.ov_as(im89,c[5]);;
//line 169
im7=n.float.add(im7,im87);
//line 170
label = 546; continue;
//line 170
case 379:
//line 170
im92=c[2];
//line 170
bool39=n.c_rt_lib.eq(im37, im92)
//line 170
im92=null;
//line 170
bool39=!bool39
//line 170
if (bool39) {label = 454; continue;}
//line 171
int94=2;
//line 171
int95=im2.as_int();
//line 171
bool93=int95>=int94;
//line 171
int94=null;
//line 171
int95=null;
//line 171
bool93=!bool93
//line 171
if (bool93) {label = 413; continue;}
//line 171
im96=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 171
im0=null;
//line 171
im2=null;
//line 171
im7=null;
//line 171
im37=null;
//line 171
bool39=null;
//line 171
im48=null;
//line 171
bool49=null;
//line 171
im50=null;
//line 171
im61=null;
//line 171
bool62=null;
//line 171
im63=null;
//line 171
im74=null;
//line 171
bool75=null;
//line 171
im76=null;
//line 171
im87=null;
//line 171
bool88=null;
//line 171
im89=null;
//line 171
bool93=null;
//line 171
___arg__1.value = im1;return im96;
//line 171
label = 413; continue;
//line 171
case 413:
//line 171
bool93=null;
//line 171
im96=null;
//line 172
int97=1;
//line 172
int98=im1.as_int();
//line 172
int99=Math.floor(int98+int97);
//line 172
im1=n.imm_int(int99)
//line 172
int97=null;
//line 172
int98=null;
//line 172
int99=null;
//line 173
int103=2;
//line 173
im104=n.imm_int(int103)
//line 173
var call_37_2=new n.imm_ref(im1);im102=_prv_cal_expr(im0,call_37_2,im104);im1=call_37_2.value;call_37_2=null;
//line 173
int103=null;
//line 173
im104=null;
//line 173
bool101=n.c_rt_lib.ov_is(im102,c[5]);;
//line 173
if (bool101) {label = 450; continue;}
//line 173
im0=null;
//line 173
im2=null;
//line 173
im7=null;
//line 173
im37=null;
//line 173
bool39=null;
//line 173
im48=null;
//line 173
bool49=null;
//line 173
im50=null;
//line 173
im61=null;
//line 173
bool62=null;
//line 173
im63=null;
//line 173
im74=null;
//line 173
bool75=null;
//line 173
im76=null;
//line 173
im87=null;
//line 173
bool88=null;
//line 173
im89=null;
//line 173
im100=null;
//line 173
bool101=null;
//line 173
___arg__1.value = im1;return im102;
//line 173
case 450:
//line 173
im100=n.c_rt_lib.ov_as(im102,c[5]);;
//line 174
im7=n.float.sub(im7,im100);
//line 175
label = 546; continue;
//line 175
case 454:
//line 175
im105=c[12];
//line 175
bool39=n.c_rt_lib.eq(im37, im105)
//line 175
im105=null;
//line 175
bool39=!bool39
//line 175
if (bool39) {label = 519; continue;}
//line 176
int107=0;
//line 176
int108=im2.as_int();
//line 176
bool106=int108<int107;
//line 176
int107=null;
//line 176
int108=null;
//line 176
bool106=!bool106
//line 176
if (bool106) {label = 493; continue;}
//line 176
im110=c[1];
//line 176
im109=n.c_rt_lib.ov_mk_arg(c[3],im110);;
//line 176
im110=null;
//line 176
im0=null;
//line 176
im2=null;
//line 176
im7=null;
//line 176
im37=null;
//line 176
bool39=null;
//line 176
im48=null;
//line 176
bool49=null;
//line 176
im50=null;
//line 176
im61=null;
//line 176
bool62=null;
//line 176
im63=null;
//line 176
im74=null;
//line 176
bool75=null;
//line 176
im76=null;
//line 176
im87=null;
//line 176
bool88=null;
//line 176
im89=null;
//line 176
im100=null;
//line 176
bool101=null;
//line 176
im102=null;
//line 176
bool106=null;
//line 176
___arg__1.value = im1;return im109;
//line 176
label = 493; continue;
//line 176
case 493:
//line 176
bool106=null;
//line 176
im109=null;
//line 177
im111=n.c_rt_lib.ov_mk_arg(c[5],im7);;
//line 177
im0=null;
//line 177
im2=null;
//line 177
im7=null;
//line 177
im37=null;
//line 177
bool39=null;
//line 177
im48=null;
//line 177
bool49=null;
//line 177
im50=null;
//line 177
im61=null;
//line 177
bool62=null;
//line 177
im63=null;
//line 177
im74=null;
//line 177
bool75=null;
//line 177
im76=null;
//line 177
im87=null;
//line 177
bool88=null;
//line 177
im89=null;
//line 177
im100=null;
//line 177
bool101=null;
//line 177
im102=null;
//line 177
___arg__1.value = im1;return im111;
//line 178
label = 546; continue;
//line 178
case 519:
//line 179
im113=c[1];
//line 179
im112=n.c_rt_lib.ov_mk_arg(c[3],im113);;
//line 179
im113=null;
//line 179
im0=null;
//line 179
im2=null;
//line 179
im7=null;
//line 179
im37=null;
//line 179
bool39=null;
//line 179
im48=null;
//line 179
bool49=null;
//line 179
im50=null;
//line 179
im61=null;
//line 179
bool62=null;
//line 179
im63=null;
//line 179
im74=null;
//line 179
bool75=null;
//line 179
im76=null;
//line 179
im87=null;
//line 179
bool88=null;
//line 179
im89=null;
//line 179
im100=null;
//line 179
bool101=null;
//line 179
im102=null;
//line 179
im111=null;
//line 179
___arg__1.value = im1;return im112;
//line 180
label = 546; continue;
//line 180
case 546:
//line 180
bool39=null;
//line 180
im48=null;
//line 180
bool49=null;
//line 180
im50=null;
//line 180
im61=null;
//line 180
bool62=null;
//line 180
im63=null;
//line 180
im74=null;
//line 180
bool75=null;
//line 180
im76=null;
//line 180
im87=null;
//line 180
bool88=null;
//line 180
im89=null;
//line 180
im100=null;
//line 180
bool101=null;
//line 180
im102=null;
//line 180
im111=null;
//line 180
im112=null;
//line 180
im37=null;
//line 147
label = 121; continue;
//line 182
im114=n.imm_arr([]);
//line 182
n.nl_die();
}}}

n.string_utils.eval_number=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var im4=null;
var bool5=null;
var im6=null;
var int7=null;
var im8=null;
var int9=null;
var int10=null;
var int11=null;
var int12=null;
var im13=null;
var im14=null;
var int15=null;
var int16=null;
var int17=null;
var bool18=null;
var im19=null;
var bool20=null;
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
var im32=null;
var int33=null;
var im34=null;
var bool35=null;
var im36=null;
var im37=null;
var im38=null;
var im39=null;
var im40=null;
var im41=null;
var label=null;
while (1) { switch (label) {
default:
//line 186
im2=c[1];
//line 186
bool1=n.c_rt_lib.eq(im0, im2)
//line 186
im2=null;
//line 186
bool1=!bool1
//line 186
if (bool1) {label = 8; continue;}
//line 186
bool1=null;
//line 186
return im0;
//line 186
label = 8; continue;
//line 186
case 8:
//line 186
bool1=null;
//line 187
im4=c[1];
//line 187
im3=n.string.split(im4,im0);
//line 187
im4=null;
//line 188
int7=0;
//line 188
im6=im3.get_index(int7);
//line 188
int7=null;
//line 188
im8=c[17];
//line 188
bool5=n.c_rt_lib.ne(im6, im8)
//line 188
im6=null;
//line 188
im8=null;
//line 188
bool5=!bool5
//line 188
if (bool5) {label = 26; continue;}
//line 188
im3=null;
//line 188
bool5=null;
//line 188
return im0;
//line 188
label = 26; continue;
//line 188
case 26:
//line 188
bool5=null;
//line 189
int9=1;
//line 189
int11=n.c_rt_lib.array_len(im3);;
//line 189
int12=1;
//line 189
int10=Math.floor(int11-int12);
//line 189
int11=null;
//line 189
int12=null;
//line 189
im3=n.array.subarray(im3,int9,int10);
//line 189
int9=null;
//line 189
int10=null;
//line 190
im13=c[1];
//line 191
int15=0;
//line 191
int16=1;
//line 191
int17=n.c_rt_lib.array_len(im3);;
//line 191
case 41:
//line 191
bool18=int15>=int17;
//line 191
if (bool18) {label = 104; continue;}
//line 191
im19=im3.get_index(int15);
//line 191
im14=im19
//line 194
im21=n.string_utils.is_int(im14);
//line 194
bool20=n.c_rt_lib.check_true_native(im21);;
//line 194
im21=null;
//line 194
if (bool20) {label = 53; continue;}
//line 194
im22=c[2];
//line 194
bool20=n.c_rt_lib.eq(im14, im22)
//line 194
im22=null;
//line 194
case 53:
//line 194
if (bool20) {label = 58; continue;}
//line 194
im23=c[6];
//line 194
bool20=n.c_rt_lib.eq(im14, im23)
//line 194
im23=null;
//line 194
case 58:
//line 194
if (bool20) {label = 63; continue;}
//line 194
im24=c[16];
//line 194
bool20=n.c_rt_lib.eq(im14, im24)
//line 194
im24=null;
//line 194
case 63:
//line 194
if (bool20) {label = 68; continue;}
//line 194
im25=c[14];
//line 194
bool20=n.c_rt_lib.eq(im14, im25)
//line 194
im25=null;
//line 194
case 68:
//line 194
if (bool20) {label = 73; continue;}
//line 194
im26=c[11];
//line 194
bool20=n.c_rt_lib.eq(im14, im26)
//line 194
im26=null;
//line 194
case 73:
//line 194
if (bool20) {label = 78; continue;}
//line 195
im27=c[12];
//line 195
bool20=n.c_rt_lib.eq(im14, im27)
//line 195
im27=null;
//line 195
case 78:
//line 195
if (bool20) {label = 83; continue;}
//line 195
im28=c[13];
//line 195
bool20=n.c_rt_lib.eq(im14, im28)
//line 195
im28=null;
//line 195
case 83:
//line 195
bool20=!bool20
//line 195
bool20=!bool20
//line 195
if (bool20) {label = 98; continue;}
//line 192
im3=null;
//line 192
im13=null;
//line 192
im14=null;
//line 192
int15=null;
//line 192
int16=null;
//line 192
int17=null;
//line 192
bool18=null;
//line 192
im19=null;
//line 192
bool20=null;
//line 192
return im0;
//line 192
label = 98; continue;
//line 192
case 98:
//line 192
bool20=null;
//line 196
im13=n.c_rt_lib.concat(im13,im14);;
//line 196
im14=null;
//line 197
int15=Math.floor(int15+int16);
//line 197
label = 41; continue;
//line 197
case 104:
//line 198
im30=c[1];
//line 198
im29=n.string.split(im30,im13);
//line 198
im30=null;
//line 199
im31=c[18];
//line 200
int33=1;
//line 200
int33=-int33
//line 200
im34=n.imm_int(int33)
//line 200
var call_8_2=new n.imm_ref(im31);im32=_prv_cal_expr(im29,call_8_2,im34);im31=call_8_2.value;call_8_2=null;
//line 200
int33=null;
//line 200
im34=null;
//line 200
bool35=n.c_rt_lib.ov_is(im32,c[3]);;
//line 200
if (bool35) {label = 122; continue;}
//line 202
bool35=n.c_rt_lib.ov_is(im32,c[5]);;
//line 202
if (bool35) {label = 144; continue;}
//line 202
im36=c[19];
//line 202
im36=n.imm_arr([im36,im32,]);
//line 202
n.nl_die();
//line 200
case 122:
//line 200
im38=n.c_rt_lib.ov_as(im32,c[3]);;
//line 200
im37=im38
//line 201
im39=c[1];
//line 201
im0=null;
//line 201
im3=null;
//line 201
im13=null;
//line 201
im14=null;
//line 201
int15=null;
//line 201
int16=null;
//line 201
int17=null;
//line 201
bool18=null;
//line 201
im19=null;
//line 201
im29=null;
//line 201
im31=null;
//line 201
im32=null;
//line 201
bool35=null;
//line 201
im36=null;
//line 201
im37=null;
//line 201
im38=null;
//line 201
return im39;
//line 202
label = 167; continue;
//line 202
case 144:
//line 202
im41=n.c_rt_lib.ov_as(im32,c[5]);;
//line 202
im40=im41
//line 203
im0=null;
//line 203
im3=null;
//line 203
im13=null;
//line 203
im14=null;
//line 203
int15=null;
//line 203
int16=null;
//line 203
int17=null;
//line 203
bool18=null;
//line 203
im19=null;
//line 203
im29=null;
//line 203
im31=null;
//line 203
im32=null;
//line 203
bool35=null;
//line 203
im36=null;
//line 203
im37=null;
//line 203
im38=null;
//line 203
im39=null;
//line 203
im41=null;
//line 203
return im40;
//line 204
label = 167; continue;
//line 204
case 167:
}}}

n.string_utils.__dyn_eval_number=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.eval_number(arg0)
return ret;
}

n.string_utils.get_date=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var bool4=null;
var bool5=null;
var bool6=null;
var int7=null;
var int8=null;
var im9=null;
var int10=null;
var im11=null;
var int12=null;
var im13=null;
var int14=null;
var im15=null;
var im16=null;
var int17=null;
var im18=null;
var int19=null;
var int20=null;
var im21=null;
var int22=null;
var int23=null;
var im24=null;
var int25=null;
var im26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var label=null;
while (1) { switch (label) {
default:
//line 211
im2=n.string.split(im1,im0);
//line 214
int7=n.c_rt_lib.array_len(im2);;
//line 214
int8=3;
//line 214
bool3=int7==int8;
//line 214
int7=null;
//line 214
int8=null;
//line 214
bool6=!bool3
//line 214
if (bool6) {label = 13; continue;}
//line 215
int10=0;
//line 215
im9=im2.get_index(int10);
//line 215
int10=null;
//line 215
bool3=n.string_utils.is_integer_possibly_leading_zeros(im9);
//line 215
im9=null;
//line 215
case 13:
//line 215
bool6=null;
//line 215
bool5=!bool3
//line 215
if (bool5) {label = 22; continue;}
//line 216
int12=1;
//line 216
im11=im2.get_index(int12);
//line 216
int12=null;
//line 216
bool3=n.string_utils.is_integer_possibly_leading_zeros(im11);
//line 216
im11=null;
//line 216
case 22:
//line 216
bool5=null;
//line 216
bool4=!bool3
//line 216
if (bool4) {label = 31; continue;}
//line 217
int14=2;
//line 217
im13=im2.get_index(int14);
//line 217
int14=null;
//line 217
bool3=n.string_utils.is_integer_possibly_leading_zeros(im13);
//line 217
im13=null;
//line 217
case 31:
//line 217
bool4=null;
//line 217
bool3=!bool3
//line 217
bool3=!bool3
//line 217
if (bool3) {label = 45; continue;}
//line 212
im16=c[1];
//line 212
im15=n.c_rt_lib.ov_mk_arg(c[3],im16);;
//line 212
im16=null;
//line 212
im0=null;
//line 212
im1=null;
//line 212
im2=null;
//line 212
bool3=null;
//line 212
return im15;
//line 212
label = 45; continue;
//line 212
case 45:
//line 212
bool3=null;
//line 212
im15=null;
//line 218
int19=0;
//line 218
im18=im2.get_index(int19);
//line 218
int19=null;
//line 218
int17=n.ptd.string_to_int(im18);
//line 218
im18=null;
//line 219
int22=1;
//line 219
im21=im2.get_index(int22);
//line 219
int22=null;
//line 219
int20=n.ptd.string_to_int(im21);
//line 219
im21=null;
//line 220
int25=2;
//line 220
im24=im2.get_index(int25);
//line 220
int25=null;
//line 220
int23=n.ptd.string_to_int(im24);
//line 220
im24=null;
//line 221
im28=n.imm_int(int17)
//line 221
im29=n.imm_int(int20)
//line 221
im30=n.imm_int(int23)
//line 221
im27=n.imm_hash({"first":im28,"second":im29,"third":im30,});
//line 221
im28=null;
//line 221
im29=null;
//line 221
im30=null;
//line 221
im26=n.c_rt_lib.ov_mk_arg(c[5],im27);;
//line 221
im27=null;
//line 221
im0=null;
//line 221
im1=null;
//line 221
im2=null;
//line 221
int17=null;
//line 221
int20=null;
//line 221
int23=null;
//line 221
return im26;
}}}

n.string_utils.__dyn_get_date=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string_utils.get_date(arg0, arg1)
return ret;
}

n.string_utils.change=function(___arg__0, ___arg__1, ___arg__2) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=___arg__2;
n.check_null(im2);
var im3=null;
var im4=null;
var im5=null;
var im6=null;
var int7=null;
var int8=null;
var int9=null;
var bool10=null;
var im11=null;
var im12=null;
var bool13=null;
var label=null;
while (1) { switch (label) {
default:
//line 225
im3=c[1];
//line 226
im5=c[1];
//line 226
im4=n.string.split(im5,im0);
//line 226
im5=null;
//line 226
int7=0;
//line 226
int8=1;
//line 226
int9=n.c_rt_lib.array_len(im4);;
//line 226
case 7:
//line 226
bool10=int7>=int9;
//line 226
if (bool10) {label = 25; continue;}
//line 226
im11=im4.get_index(int7);
//line 226
im6=im11
//line 227
bool13=n.c_rt_lib.eq(im6, im1)
//line 227
if (bool13) {label = 16; continue;}
//line 227
im12=im6
//line 227
label = 18; continue;
//line 227
case 16:
//line 227
im12=im2
//line 227
case 18:
//line 227
bool13=null;
//line 227
im3=n.c_rt_lib.concat(im3,im12);;
//line 227
im12=null;
//line 227
im6=null;
//line 228
int7=Math.floor(int7+int8);
//line 228
label = 7; continue;
//line 228
case 25:
//line 229
im0=null;
//line 229
im1=null;
//line 229
im2=null;
//line 229
im4=null;
//line 229
im6=null;
//line 229
int7=null;
//line 229
int8=null;
//line 229
int9=null;
//line 229
bool10=null;
//line 229
im11=null;
//line 229
return im3;
}}}

n.string_utils.__dyn_change=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var arg2=arr.value.get_index(2);
var ret = n.string_utils.change(arg0, arg1, arg2)
return ret;
}

n.string_utils.erase_tail_whitespace=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var int4=null;
var int5=null;
var int6=null;
var bool7=null;
var bool8=null;
var int9=null;
var im10=null;
var im11=null;
var int12=null;
var im13=null;
var im14=null;
var int15=null;
var im16=null;
var int17=null;
var im18=null;
var int19=null;
var int20=null;
var im21=null;
var label=null;
while (1) { switch (label) {
default:
//line 233
im2=c[1];
//line 233
bool1=n.c_rt_lib.eq(im0, im2)
//line 233
im2=null;
//line 233
bool1=!bool1
//line 233
if (bool1) {label = 10; continue;}
//line 233
im3=c[1];
//line 233
im0=null;
//line 233
bool1=null;
//line 233
return im3;
//line 233
label = 10; continue;
//line 233
case 10:
//line 233
bool1=null;
//line 233
im3=null;
//line 234
int5=n.string.length(im0);
//line 234
int6=1;
//line 234
int4=Math.floor(int5-int6);
//line 234
int5=null;
//line 234
int6=null;
//line 235
case 18:
//line 235
int9=0;
//line 235
bool7=int4>=int9;
//line 235
int9=null;
//line 235
bool8=!bool7
//line 235
if (bool8) {label = 35; continue;}
//line 235
im11=n.imm_int(int4)
//line 235
int12=1;
//line 235
im13=n.imm_int(int12)
//line 235
im10=n.string.substr(im0,im11,im13);
//line 235
im11=null;
//line 235
int12=null;
//line 235
im13=null;
//line 235
im14=n.string_utils.is_whitespace(im10);
//line 235
bool7=n.c_rt_lib.check_true_native(im14);;
//line 235
im10=null;
//line 235
im14=null;
//line 235
case 35:
//line 235
bool8=null;
//line 235
bool7=!bool7
//line 235
if (bool7) {label = 43; continue;}
//line 236
int15=1;
//line 236
int4=Math.floor(int4-int15);
//line 236
int15=null;
//line 237
label = 18; continue;
//line 237
case 43:
//line 238
int17=0;
//line 238
im18=n.imm_int(int17)
//line 238
int20=1;
//line 238
int19=Math.floor(int4+int20);
//line 238
int20=null;
//line 238
im21=n.imm_int(int19)
//line 238
im16=n.string.substr(im0,im18,im21);
//line 238
int17=null;
//line 238
im18=null;
//line 238
int19=null;
//line 238
im21=null;
//line 238
im0=null;
//line 238
int4=null;
//line 238
bool7=null;
//line 238
return im16;
}}}

n.string_utils.__dyn_erase_tail_whitespace=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.erase_tail_whitespace(arg0)
return ret;
}

n.string_utils.erase_tail_zeroes=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var int4=null;
var int5=null;
var int6=null;
var bool7=null;
var bool8=null;
var int9=null;
var im10=null;
var im11=null;
var int12=null;
var im13=null;
var int14=null;
var im15=null;
var int16=null;
var int17=null;
var im18=null;
var label=null;
while (1) { switch (label) {
default:
//line 242
im2=c[1];
//line 242
bool1=n.c_rt_lib.eq(im0, im2)
//line 242
im2=null;
//line 242
bool1=!bool1
//line 242
if (bool1) {label = 8; continue;}
//line 242
bool1=null;
//line 242
return im0;
//line 242
label = 8; continue;
//line 242
case 8:
//line 242
bool1=null;
//line 243
im3=n.string.to_array(im0);
//line 244
int5=n.c_rt_lib.array_len(im3);;
//line 244
int6=1;
//line 244
int4=Math.floor(int5-int6);
//line 244
int5=null;
//line 244
int6=null;
//line 245
case 16:
//line 245
int9=0;
//line 245
bool7=int4>=int9;
//line 245
int9=null;
//line 245
bool8=!bool7
//line 245
if (bool8) {label = 27; continue;}
//line 245
im10=im3.get_index(int4);
//line 245
im11=c[4];
//line 245
bool7=n.c_rt_lib.eq(im10, im11)
//line 245
im10=null;
//line 245
im11=null;
//line 245
case 27:
//line 245
bool8=null;
//line 245
bool7=!bool7
//line 245
if (bool7) {label = 35; continue;}
//line 246
int12=1;
//line 246
int4=Math.floor(int4-int12);
//line 246
int12=null;
//line 247
label = 16; continue;
//line 247
case 35:
//line 248
int14=0;
//line 248
im15=n.imm_int(int14)
//line 248
int17=1;
//line 248
int16=Math.floor(int4+int17);
//line 248
int17=null;
//line 248
im18=n.imm_int(int16)
//line 248
im13=n.string.substr(im0,im15,im18);
//line 248
int14=null;
//line 248
im15=null;
//line 248
int16=null;
//line 248
im18=null;
//line 248
im0=null;
//line 248
im3=null;
//line 248
int4=null;
//line 248
bool7=null;
//line 248
return im13;
}}}

n.string_utils.__dyn_erase_tail_zeroes=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.erase_tail_zeroes(arg0)
return ret;
}

n.string_utils.erase_leading_zeroes=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var bool1=null;
var im2=null;
var im3=null;
var int4=null;
var bool5=null;
var bool6=null;
var int7=null;
var im8=null;
var im9=null;
var int10=null;
var im11=null;
var bool12=null;
var int13=null;
var im14=null;
var label=null;
while (1) { switch (label) {
default:
//line 252
im2=c[1];
//line 252
bool1=n.c_rt_lib.eq(im0, im2)
//line 252
im2=null;
//line 252
bool1=!bool1
//line 252
if (bool1) {label = 8; continue;}
//line 252
bool1=null;
//line 252
return im0;
//line 252
label = 8; continue;
//line 252
case 8:
//line 252
bool1=null;
//line 253
im3=n.string.to_array(im0);
//line 254
int4=0;
//line 255
case 12:
//line 255
int7=n.c_rt_lib.array_len(im3);;
//line 255
bool5=int4<int7;
//line 255
int7=null;
//line 255
bool6=!bool5
//line 255
if (bool6) {label = 23; continue;}
//line 255
im8=im3.get_index(int4);
//line 255
im9=c[4];
//line 255
bool5=n.c_rt_lib.eq(im8, im9)
//line 255
im8=null;
//line 255
im9=null;
//line 255
case 23:
//line 255
bool6=null;
//line 255
bool5=!bool5
//line 255
if (bool5) {label = 31; continue;}
//line 256
int10=1;
//line 256
int4=Math.floor(int4+int10);
//line 256
int10=null;
//line 257
label = 12; continue;
//line 257
case 31:
//line 258
int13=n.c_rt_lib.array_len(im3);;
//line 258
bool12=int4!=int13;
//line 258
int13=null;
//line 258
if (bool12) {label = 38; continue;}
//line 260
im11=c[4];
//line 260
label = 42; continue;
//line 260
case 38:
//line 259
im14=n.imm_int(int4)
//line 259
im11=n.string.substr2(im0,im14);
//line 259
im14=null;
//line 259
case 42:
//line 259
bool12=null;
//line 259
im0=null;
//line 259
im3=null;
//line 259
int4=null;
//line 259
bool5=null;
//line 259
return im11;
}}}

n.string_utils.__dyn_erase_leading_zeroes=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.erase_leading_zeroes(arg0)
return ret;
}

n.string_utils.char2hex=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
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
var int20=null;
var int21=null;
var int22=null;
var im23=null;
var int24=null;
var int25=null;
var int26=null;
var label=null;
while (1) { switch (label) {
default:
//line 264
im2=c[4];
//line 264
im3=c[20];
//line 264
im4=c[21];
//line 264
im5=c[22];
//line 264
im6=c[23];
//line 264
im7=c[24];
//line 264
im8=c[25];
//line 264
im9=c[26];
//line 264
im10=c[27];
//line 264
im11=c[28];
//line 264
im12=c[29];
//line 264
im13=c[30];
//line 264
im14=c[31];
//line 264
im15=c[32];
//line 264
im16=c[33];
//line 264
im17=c[34];
//line 264
im1=n.imm_arr([im2,im3,im4,im5,im6,im7,im8,im9,im10,im11,im12,im13,im14,im15,im16,im17,]);
//line 264
im2=null;
//line 264
im3=null;
//line 264
im4=null;
//line 264
im5=null;
//line 264
im6=null;
//line 264
im7=null;
//line 264
im8=null;
//line 264
im9=null;
//line 264
im10=null;
//line 264
im11=null;
//line 264
im12=null;
//line 264
im13=null;
//line 264
im14=null;
//line 264
im15=null;
//line 264
im16=null;
//line 264
im17=null;
//line 265
int21=16;
//line 265
int22=im0.as_int();
//line 265
int20=Math.floor(int22/int21);
//line 265
int21=null;
//line 265
int22=null;
//line 265
im19=im1.get_index(int20);
//line 265
int20=null;
//line 265
int25=16;
//line 265
int26=im0.as_int();
//line 265
int24=Math.floor(int26%int25);
//line 265
int25=null;
//line 265
int26=null;
//line 265
im23=im1.get_index(int24);
//line 265
int24=null;
//line 265
im18=n.c_rt_lib.concat(im19,im23);;
//line 265
im19=null;
//line 265
im23=null;
//line 265
im0=null;
//line 265
im1=null;
//line 265
return im18;
//line 265
im0=null;
//line 265
im1=null;
//line 265
im18=null;
//line 265
return null;
}}}

n.string_utils.__dyn_char2hex=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.char2hex(arg0)
return ret;
}

n.string_utils.hex2char=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var int2=null;
var bool3=null;
var bool4=null;
var int5=null;
var int6=null;
var int7=null;
var int8=null;
var int9=null;
var int10=null;
var bool11=null;
var int12=null;
var int13=null;
var int14=null;
var int15=null;
var int16=null;
var int17=null;
var bool18=null;
var int19=null;
var int20=null;
var int21=null;
var int22=null;
var int23=null;
var int24=null;
var im25=null;
var int26=null;
var bool27=null;
var bool28=null;
var int29=null;
var int30=null;
var int31=null;
var int32=null;
var int33=null;
var int34=null;
var bool35=null;
var int36=null;
var int37=null;
var int38=null;
var int39=null;
var int40=null;
var int41=null;
var bool42=null;
var int43=null;
var int44=null;
var int45=null;
var int46=null;
var int47=null;
var int48=null;
var im49=null;
var im50=null;
var im51=null;
var label=null;
while (1) { switch (label) {
default:
//line 269
int2=0;
//line 270
int5=48;
//line 270
int6=im0.as_int();
//line 270
bool3=int6>=int5;
//line 270
int5=null;
//line 270
int6=null;
//line 270
bool4=!bool3
//line 270
if (bool4) {label = 13; continue;}
//line 270
int7=57;
//line 270
int8=im0.as_int();
//line 270
bool3=int8<=int7;
//line 270
int7=null;
//line 270
int8=null;
//line 270
case 13:
//line 270
bool4=null;
//line 270
bool3=!bool3
//line 270
if (bool3) {label = 24; continue;}
//line 271
int9=im0.as_int();
//line 271
int2=Math.floor(int2+int9);
//line 271
int9=null;
//line 272
int10=48;
//line 272
int2=Math.floor(int2-int10);
//line 272
int10=null;
//line 273
label = 76; continue;
//line 273
case 24:
//line 273
int12=65;
//line 273
int13=im0.as_int();
//line 273
bool3=int13>=int12;
//line 273
int12=null;
//line 273
int13=null;
//line 273
bool11=!bool3
//line 273
if (bool11) {label = 37; continue;}
//line 273
int14=70;
//line 273
int15=im0.as_int();
//line 273
bool3=int15<=int14;
//line 273
int14=null;
//line 273
int15=null;
//line 273
case 37:
//line 273
bool11=null;
//line 273
bool3=!bool3
//line 273
if (bool3) {label = 48; continue;}
//line 274
int16=im0.as_int();
//line 274
int2=Math.floor(int2+int16);
//line 274
int16=null;
//line 275
int17=55;
//line 275
int2=Math.floor(int2-int17);
//line 275
int17=null;
//line 276
label = 76; continue;
//line 276
case 48:
//line 276
int19=97;
//line 276
int20=im0.as_int();
//line 276
bool3=int20>=int19;
//line 276
int19=null;
//line 276
int20=null;
//line 276
bool18=!bool3
//line 276
if (bool18) {label = 61; continue;}
//line 276
int21=102;
//line 276
int22=im0.as_int();
//line 276
bool3=int22<=int21;
//line 276
int21=null;
//line 276
int22=null;
//line 276
case 61:
//line 276
bool18=null;
//line 276
bool3=!bool3
//line 276
if (bool3) {label = 72; continue;}
//line 277
int23=im0.as_int();
//line 277
int2=Math.floor(int2+int23);
//line 277
int23=null;
//line 278
int24=87;
//line 278
int2=Math.floor(int2-int24);
//line 278
int24=null;
//line 279
label = 76; continue;
//line 279
case 72:
//line 280
im25=n.imm_arr([]);
//line 280
n.nl_die();
//line 281
label = 76; continue;
//line 281
case 76:
//line 281
bool3=null;
//line 281
im25=null;
//line 282
int26=16;
//line 282
int2=Math.floor(int2*int26);
//line 282
int26=null;
//line 283
int29=48;
//line 283
int30=im1.as_int();
//line 283
bool27=int30>=int29;
//line 283
int29=null;
//line 283
int30=null;
//line 283
bool28=!bool27
//line 283
if (bool28) {label = 94; continue;}
//line 283
int31=57;
//line 283
int32=im1.as_int();
//line 283
bool27=int32<=int31;
//line 283
int31=null;
//line 283
int32=null;
//line 283
case 94:
//line 283
bool28=null;
//line 283
bool27=!bool27
//line 283
if (bool27) {label = 105; continue;}
//line 284
int33=im1.as_int();
//line 284
int2=Math.floor(int2+int33);
//line 284
int33=null;
//line 285
int34=48;
//line 285
int2=Math.floor(int2-int34);
//line 285
int34=null;
//line 286
label = 157; continue;
//line 286
case 105:
//line 286
int36=65;
//line 286
int37=im1.as_int();
//line 286
bool27=int37>=int36;
//line 286
int36=null;
//line 286
int37=null;
//line 286
bool35=!bool27
//line 286
if (bool35) {label = 118; continue;}
//line 286
int38=70;
//line 286
int39=im1.as_int();
//line 286
bool27=int39<=int38;
//line 286
int38=null;
//line 286
int39=null;
//line 286
case 118:
//line 286
bool35=null;
//line 286
bool27=!bool27
//line 286
if (bool27) {label = 129; continue;}
//line 287
int40=im1.as_int();
//line 287
int2=Math.floor(int2+int40);
//line 287
int40=null;
//line 288
int41=55;
//line 288
int2=Math.floor(int2-int41);
//line 288
int41=null;
//line 289
label = 157; continue;
//line 289
case 129:
//line 289
int43=97;
//line 289
int44=im1.as_int();
//line 289
bool27=int44>=int43;
//line 289
int43=null;
//line 289
int44=null;
//line 289
bool42=!bool27
//line 289
if (bool42) {label = 142; continue;}
//line 289
int45=102;
//line 289
int46=im1.as_int();
//line 289
bool27=int46<=int45;
//line 289
int45=null;
//line 289
int46=null;
//line 289
case 142:
//line 289
bool42=null;
//line 289
bool27=!bool27
//line 289
if (bool27) {label = 153; continue;}
//line 290
int47=im1.as_int();
//line 290
int2=Math.floor(int2+int47);
//line 290
int47=null;
//line 291
int48=87;
//line 291
int2=Math.floor(int2-int48);
//line 291
int48=null;
//line 292
label = 157; continue;
//line 292
case 153:
//line 293
im49=n.imm_arr([]);
//line 293
n.nl_die();
//line 294
label = 157; continue;
//line 294
case 157:
//line 294
bool27=null;
//line 294
im49=null;
//line 295
im51=n.imm_int(int2)
//line 295
im50=n.string.chr(im51);
//line 295
im51=null;
//line 295
im0=null;
//line 295
im1=null;
//line 295
int2=null;
//line 295
return im50;
//line 295
im0=null;
//line 295
im1=null;
//line 295
int2=null;
//line 295
im50=null;
//line 295
return null;
}}}

n.string_utils.__dyn_hex2char=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string_utils.hex2char(arg0, arg1)
return ret;
}

n.string_utils.escape2hex31=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 299
im2=n.ptd.string();
//line 299
im3=n.c_std_lib.string_escape2hex31(im0);
//line 299
im1=n.ptd.ensure(im2,im3);
//line 299
im2=null;
//line 299
im3=null;
//line 299
im0=null;
//line 299
return im1;
}}}

n.string_utils.__dyn_escape2hex31=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.escape2hex31(arg0)
return ret;
}

n.string_utils.float2str=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var int1=___arg__1;
n.check_null(int1);
var int2=null;
var int3=null;
var int4=null;
var bool5=null;
var int6=null;
var im7=null;
var im8=null;
var im9=null;
var im10=null;
var bool11=null;
var im12=null;
var int13=null;
var im14=null;
var int15=null;
var im16=null;
var im17=null;
var int18=null;
var im19=null;
var im20=null;
var int21=null;
var int22=null;
var im23=null;
var int24=null;
var bool25=null;
var int26=null;
var im27=null;
var im28=null;
var im29=null;
var im30=null;
var im31=null;
var int32=null;
var im33=null;
var int34=null;
var im35=null;
var im36=null;
var im37=null;
var int38=null;
var im39=null;
var im40=null;
var label=null;
while (1) { switch (label) {
default:
//line 303
int2=1;
//line 304
int3=0;
//line 304
int4=1;
//line 304
case 3:
//line 304
bool5=int3>=int1;
//line 304
if (bool5) {label = 11; continue;}
//line 305
int6=10;
//line 305
int2=Math.floor(int2*int6);
//line 305
int6=null;
//line 306
int3=Math.floor(int3+int4);
//line 306
label = 3; continue;
//line 306
case 11:
//line 307
im8=n.ptd.string();
//line 307
im9=n.ptd.int_to_string(int2);
//line 307
im7=n.ptd.ensure(im8,im9);
//line 307
im8=null;
//line 307
im9=null;
//line 307
im0=n.float.mul(im0,im7);
//line 307
im7=null;
//line 308
im0=n.float.round(im0);
//line 309
im10=c[1];
//line 310
int13=0;
//line 310
im14=n.imm_int(int13)
//line 310
int15=1;
//line 310
im16=n.imm_int(int15)
//line 310
im12=n.string.substr(im0,im14,im16);
//line 310
int13=null;
//line 310
im14=null;
//line 310
int15=null;
//line 310
im16=null;
//line 310
im17=c[2];
//line 310
bool11=n.c_rt_lib.eq(im12, im17)
//line 310
im12=null;
//line 310
im17=null;
//line 310
bool11=!bool11
//line 310
if (bool11) {label = 43; continue;}
//line 311
im10=c[2];
//line 312
int18=1;
//line 312
im19=n.imm_int(int18)
//line 312
im0=n.string.substr2(im0,im19);
//line 312
int18=null;
//line 312
im19=null;
//line 313
label = 43; continue;
//line 313
case 43:
//line 313
bool11=null;
//line 314
int22=1;
//line 314
int21=Math.floor(int1+int22);
//line 314
int22=null;
//line 314
im23=n.imm_int(int21)
//line 314
im20=n.string_utils.int2str_leading_digits(im0,im23);
//line 314
int21=null;
//line 314
im23=null;
//line 315
int24=n.string.length(im20);
//line 316
int26=0;
//line 316
bool25=int1==int26;
//line 316
int26=null;
//line 316
bool25=!bool25
//line 316
if (bool25) {label = 71; continue;}
//line 316
im27=n.c_rt_lib.concat(im10,im20);;
//line 316
im0=null;
//line 316
int1=null;
//line 316
int2=null;
//line 316
int3=null;
//line 316
int4=null;
//line 316
bool5=null;
//line 316
im10=null;
//line 316
im20=null;
//line 316
int24=null;
//line 316
bool25=null;
//line 316
return im27;
//line 316
label = 71; continue;
//line 316
case 71:
//line 316
bool25=null;
//line 316
im27=null;
//line 317
int32=0;
//line 317
im33=n.imm_int(int32)
//line 317
int34=Math.floor(int24-int1);
//line 317
im35=n.imm_int(int34)
//line 317
im31=n.string.substr(im20,im33,im35);
//line 317
int32=null;
//line 317
im33=null;
//line 317
int34=null;
//line 317
im35=null;
//line 317
im30=n.c_rt_lib.concat(im10,im31);;
//line 317
im31=null;
//line 317
im36=c[6];
//line 317
im29=n.c_rt_lib.concat(im30,im36);;
//line 317
im30=null;
//line 317
im36=null;
//line 317
int38=Math.floor(int24-int1);
//line 317
im39=n.imm_int(int38)
//line 317
im40=n.imm_int(int1)
//line 317
im37=n.string.substr(im20,im39,im40);
//line 317
int38=null;
//line 317
im39=null;
//line 317
im40=null;
//line 317
im28=n.c_rt_lib.concat(im29,im37);;
//line 317
im29=null;
//line 317
im37=null;
//line 317
im0=null;
//line 317
int1=null;
//line 317
int2=null;
//line 317
int3=null;
//line 317
int4=null;
//line 317
bool5=null;
//line 317
im10=null;
//line 317
im20=null;
//line 317
int24=null;
//line 317
return im28;
}}}

n.string_utils.__dyn_float2str=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1).as_int();
var ret = n.string_utils.float2str(arg0, arg1)
return ret;
}

n.string_utils.int2str_leading_digits=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var int5=null;
var int6=null;
var im7=null;
var int8=null;
var im9=null;
var int10=null;
var im11=null;
var label=null;
while (1) { switch (label) {
default:
//line 321
im3=c[35];
//line 321
im2=n.c_rt_lib.concat(im3,im0);;
//line 321
im3=null;
//line 322
int6=n.string.length(im2);
//line 322
int8=n.string.length(im0);
//line 322
im9=n.imm_int(int8)
//line 322
im7=_prv_max(im1,im9);
//line 322
int8=null;
//line 322
im9=null;
//line 322
int10=im7.as_int();
//line 322
int5=Math.floor(int6-int10);
//line 322
int6=null;
//line 322
im7=null;
//line 322
int10=null;
//line 322
im11=n.imm_int(int5)
//line 322
im4=n.string.substr2(im2,im11);
//line 322
int5=null;
//line 322
im11=null;
//line 322
im0=null;
//line 322
im1=null;
//line 322
im2=null;
//line 322
return im4;
//line 322
im0=null;
//line 322
im1=null;
//line 322
im2=null;
//line 322
im4=null;
//line 322
return null;
}}}

n.string_utils.__dyn_int2str_leading_digits=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string_utils.int2str_leading_digits(arg0, arg1)
return ret;
}

function _prv_max(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var bool3=null;
var int4=null;
var int5=null;
var label=null;
while (1) { switch (label) {
default:
//line 326
int4=im0.as_int();
//line 326
int5=im1.as_int();
//line 326
bool3=int4>int5;
//line 326
int4=null;
//line 326
int5=null;
//line 326
if (bool3) {label = 8; continue;}
//line 326
im2=im1
//line 326
label = 10; continue;
//line 326
case 8:
//line 326
im2=im0
//line 326
case 10:
//line 326
bool3=null;
//line 326
im0=null;
//line 326
im1=null;
//line 326
return im2;
//line 326
im0=null;
//line 326
im1=null;
//line 326
im2=null;
//line 326
return null;
}}}

n.string_utils.int2str=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var im2=null;
var im3=null;
var im4=null;
var int5=null;
var int6=null;
var int7=null;
var im8=null;
var label=null;
while (1) { switch (label) {
default:
//line 330
im3=c[35];
//line 330
im2=n.c_rt_lib.concat(im3,im0);;
//line 330
im3=null;
//line 331
int6=n.string.length(im2);
//line 331
int7=im1.as_int();
//line 331
int5=Math.floor(int6-int7);
//line 331
int6=null;
//line 331
int7=null;
//line 331
im8=n.imm_int(int5)
//line 331
im4=n.string.substr2(im2,im8);
//line 331
int5=null;
//line 331
im8=null;
//line 331
im0=null;
//line 331
im1=null;
//line 331
im2=null;
//line 331
return im4;
}}}

n.string_utils.__dyn_int2str=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string_utils.int2str(arg0, arg1)
return ret;
}

n.string_utils.starts_with=function(___arg__0, ___arg__1) {
var im0=___arg__0;
n.check_null(im0);
var im1=___arg__1;
n.check_null(im1);
var bool2=null;
var bool3=null;
var int4=null;
var int5=null;
var im6=null;
var int7=null;
var im8=null;
var int9=null;
var im10=null;
var im11=null;
var label=null;
while (1) { switch (label) {
default:
//line 335
int4=n.string.length(im0);
//line 335
int5=n.string.length(im1);
//line 335
bool2=int4>=int5;
//line 335
int4=null;
//line 335
int5=null;
//line 335
bool3=!bool2
//line 335
if (bool3) {label = 18; continue;}
//line 335
int7=0;
//line 335
im8=n.imm_int(int7)
//line 335
int9=n.string.length(im1);
//line 335
im10=n.imm_int(int9)
//line 335
im6=n.string.substr(im0,im8,im10);
//line 335
int7=null;
//line 335
im8=null;
//line 335
int9=null;
//line 335
im10=null;
//line 335
bool2=n.c_rt_lib.eq(im6, im1)
//line 335
im6=null;
//line 335
case 18:
//line 335
bool3=null;
//line 335
im11=n.c_rt_lib.native_to_nl(bool2)
//line 335
im0=null;
//line 335
im1=null;
//line 335
bool2=null;
//line 335
return im11;
//line 335
im0=null;
//line 335
im1=null;
//line 335
bool2=null;
//line 335
im11=null;
//line 335
return null;
}}}

n.string_utils.__dyn_starts_with=function(arr) {
var arg0=arr.value.get_index(0);
var arg1=arr.value.get_index(1);
var ret = n.string_utils.starts_with(arg0, arg1)
return ret;
}

n.string_utils.normalize_newlines=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
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
var label=null;
while (1) { switch (label) {
default:
//line 340
im4=n.string.r();
//line 340
im5=n.string.lf();
//line 340
im3=n.c_rt_lib.concat(im4,im5);;
//line 340
im4=null;
//line 340
im5=null;
//line 340
im6=n.string.r();
//line 340
im7=n.string.lf();
//line 340
im2=n.imm_arr([im3,im6,im7,]);
//line 340
im3=null;
//line 340
im6=null;
//line 340
im7=null;
//line 341
im9=n.string.lf();
//line 341
im10=n.string.lf();
//line 341
im12=n.string.r();
//line 341
im13=n.string.lf();
//line 341
im11=n.c_rt_lib.concat(im12,im13);;
//line 341
im12=null;
//line 341
im13=null;
//line 341
im8=n.imm_arr([im9,im10,im11,]);
//line 341
im9=null;
//line 341
im10=null;
//line 341
im11=null;
//line 341
im1=n.string.replace_arr(im0,im2,im8);
//line 341
im2=null;
//line 341
im8=null;
//line 343
im15=n.ptd.string();
//line 343
im14=n.ptd.ensure(im15,im1);
//line 343
im15=null;
//line 343
im0=null;
//line 343
im1=null;
//line 343
return im14;
}}}

n.string_utils.__dyn_normalize_newlines=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.normalize_newlines(arg0)
return ret;
}

n.string_utils.float2str_fixed=function(___arg__0) {
var im0=___arg__0;
n.check_null(im0);
var im1=null;
var im2=null;
var im3=null;
var label=null;
while (1) { switch (label) {
default:
//line 347
im2=n.ptd.string();
//line 347
im3=n.c_rt_lib.float_fixed_str(im0);
//line 347
im1=n.ptd.ensure(im2,im3);
//line 347
im2=null;
//line 347
im3=null;
//line 347
im0=null;
//line 347
return im1;
}}}

n.string_utils.__dyn_float2str_fixed=function(arr) {
var arg0=arr.value.get_index(0);
var ret = n.string_utils.float2str_fixed(arg0)
return ret;
}
var c=[];
c[0] = n.imm_str(" ");c[1] = n.imm_str("");c[2] = n.imm_str("-");c[3] = n.imm_str("err");c[4] = n.imm_str("0");c[5] = n.imm_str("ok");c[6] = n.imm_str(".");c[7] = n.imm_ov_js_str("err",null);c[8] = n.imm_ov_js_str("err",null);c[9] = n.imm_ov_js_str("err",null);c[10] = n.imm_ov_js_str("err",null);c[11] = n.imm_str("(");c[12] = n.imm_str(")");c[13] = n.imm_str("*");c[14] = n.imm_str("/");c[15] = n.imm_str("%");c[16] = n.imm_str("+");c[17] = n.imm_str("=");c[18] = n.imm_int(0);c[19] = n.imm_str("NOMATCHALERT");c[20] = n.imm_str("1");c[21] = n.imm_str("2");c[22] = n.imm_str("3");c[23] = n.imm_str("4");c[24] = n.imm_str("5");c[25] = n.imm_str("6");c[26] = n.imm_str("7");c[27] = n.imm_str("8");c[28] = n.imm_str("9");c[29] = n.imm_str("a");c[30] = n.imm_str("b");c[31] = n.imm_str("c");c[32] = n.imm_str("d");c[33] = n.imm_str("e");c[34] = n.imm_str("f");c[35] = n.imm_str("000000000000000000000000");})(nl=nl || {}); 
