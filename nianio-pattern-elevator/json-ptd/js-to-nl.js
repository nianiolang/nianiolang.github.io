var nl;
(function (n) {
    function wrappedErrorMessage(ex, type) {
        if (type == null) return ex;
        const keys = Object.keys(type);
        if (keys.length == 0) return ex;
        ex.message = `${keys}->(${ex.message})`;
        return ex;
    }

    n.json_to_imm = function (json, type, typeLib) {
        try {
            if (json == null) {
                throw new Error('json == null');
            }
            if (type == null) {
                throw new Error('type == null');
            }

            if (Object.hasOwn(type, 'ov.ptd_int')) {
                if (typeof json !== 'number' || !Number.isInteger(json)) {
                    throw new Error(`JSON value is not a valid int: (${typeof json}) ${JSON.stringify(json)}`);
                }
                return n.imm_int(json);
            } else if (Object.hasOwn(type, 'ov.ptd_utf8')) {
                if (typeof json !== 'string') {
                    throw new Error(`JSON value is not a valid UTF-8 string: (${typeof json}) ${JSON.stringify(json)}`);
                }
                return n.imm_str(json);
            } else if (Object.hasOwn(type, 'ov.ptd_bool')) {
                if (typeof json !== 'boolean') {
                    throw new Error(`JSON value is not a valid boolean: (${typeof json}) ${JSON.stringify(json)}`);
                }
                return n.c_rt_lib.native_to_nl(json);
            } else if (Object.hasOwn(type, 'ov.ptd_rec')) {
                if (typeof json !== 'object' || json === null || Array.isArray(json)) {
                    throw new Error(`JSON value is not a valid record (object): (${typeof json}) ${JSON.stringify(json)}`);
                }
                var fields = type['ov.ptd_rec'];
                var jsonKeys = Object.keys(json);
                var fieldKeys = Object.keys(fields);
                if (jsonKeys.length !== fieldKeys.length) {
                    throw new Error(`Record field count mismatch. jsonKeys: ${JSON.stringify(jsonKeys)} typeKeys: ${JSON.stringify(fieldKeys)}`);
                }
                var immFields = {};
                for (var key in fields) {
                    if (!json.hasOwnProperty(key)) {
                        throw new Error(`Missing field in imm record: ${key}`);
                    }
                    immFields[key] = n.json_to_imm(json[key], fields[key], typeLib);
                }
                return n.imm_hash(immFields);
            } else if (Object.hasOwn(type, 'ov.ptd_arr')) {
                if (!Array.isArray(json)) {
                    throw new Error(`JSON value is not a valid array: (${typeof json}) ${JSON.stringify(json)}`);
                }
                var elemType = type['ov.ptd_arr'];
                var immArr = [];
                for (var i = 0; i < json.length; i++) {
                    immArr.push(n.json_to_imm(json[i], elemType, typeLib));
                }
                return n.imm_arr(immArr);
            } else if (Object.hasOwn(type, 'ov.ptd_hash')) {
                if (typeof json !== 'object' || json === null || Array.isArray(json)) {
                    throw new Error(`JSON value is not a valid hash (object): (${typeof json}) ${JSON.stringify(json)}`);
                }
                var elemType = type['ov.ptd_hash'];
                var immHash = {};
                for (var key in json) {
                    immHash[key] = n.json_to_imm(json[key], elemType, typeLib);
                }
                return n.imm_hash(immHash);
            } else if (Object.hasOwn(type, 'ov.ptd_var')) {
                if (typeof json !== 'object' || json === null) {
                    throw new Error(`JSON value is not a valid variant (object): (${typeof json}) ${JSON.stringify(json)}`);
                }
                var variants = type['ov.ptd_var'];
                var keys = Object.keys(json);
                if (keys.length !== 1) {
                    throw new Error(`Variant JSON must have exactly one key: ${JSON.stringify(keys)}`);
                }
                var variantKey = keys[0];
                if (!variantKey.startsWith('ov.')) {
                    throw new Error(`Variant key must start with "ov.": ${variantKey}`);
                }
                var label = variantKey.substring(3);
                if (!(label in variants)) {
                    throw new Error(`Unknown variant label: ${label}`);
                }
                var variantPtd = variants[label];
                if (Object.keys(variantPtd)[0] === 'ov.with_param') {
                    return n.c_rt_lib.ov_mk_arg(
                        n.imm_str(label),
                        n.json_to_imm(json[variantKey], variantPtd['ov.with_param'], typeLib)
                    );
                } else {
                    if (json[variantKey] !== null) {
                        throw new Error(`Variant ${label} must have null value`);
                    }
                    return n.c_rt_lib.ov_mk_none(label);
                }
            } else if (Object.hasOwn(type, 'ov.ptd_date')) {
                if (typeof json !== 'string') {
                    throw new Error(`JSON value is not a valid date string: (${typeof json}) ${JSON.stringify(json)}`);
                }
                var DateRegex = /^[0-9]{4}(-[0-9]{2}){2}( [0-9]{2}(:[0-9]{2}){2})?$/;
                if (!DateRegex.test(json) || isNaN(Date.parse(json))) {
                    throw new Error(`Invalid date format: ${json}`);
                }
                return n.imm_str(json);
            } else if (Object.hasOwn(type, 'ov.ptd_decimal')) {
                if (typeof json !== 'number') {
                    throw new Error(`JSON value is not a valid decimal number: (${typeof json}) ${JSON.stringify(json)}`);
                }
                var decInfo = type['ov.ptd_decimal'];
                if (Number(json.toFixed(decInfo['scale'])) !== json ||
                    (Math.trunc(json) !== 0 &&
                        Math.trunc(json).toString().length > decInfo['size'] - decInfo['scale'])) {
                    throw new Error(`Decimal value out of bounds: ${Math.trunc(json).toString().length}, size: ${decInfo['size']} scale: ${decInfo['scale']}`);
                }
                return n.imm_int(json);
            } else if (Object.hasOwn(type, 'ov.ptd_bytearray')) {
                if (typeof json !== 'string') {
                    throw new Error(`JSON value is not a valid bytearray (string): (${typeof json}) ${JSON.stringify(json)}`);
                }
                for (var i = 0; i < json.length; i++) {
                    var code = json.charCodeAt(i);
                    if (code < 0 || code > 255) {
                        throw new Error(`Bytearray contains invalid character code: ${code}`);
                    }
                }
                return n.imm_str(json);
            } else if (Object.hasOwn(type, 'ov.ptd_double')) {
                if (typeof json !== 'number') {
                    throw new Error(`JSON value is not a valid double: (${typeof json}) ${JSON.stringify(json)}`);
                }
                return n.imm_int(json);
            } else if (Object.hasOwn(type, 'ov.ptd_ref')) {
                return n.json_to_imm(json, typeLib[type['ov.ptd_ref']], typeLib);
            } else {
                throw new Error('Unsupported PTD type in json_to_imm conversion');
            }
        } catch (ex) {
            throw wrappedErrorMessage(ex, type);
        }
    };

    n.imm_to_json = function (imm, type, typeLib) {
        try {
            if (imm == null) {
                throw new Error('imm == null');
            }
            if (type == null) {
                throw new Error('type == null');
            }

            if (Object.hasOwn(type, 'ov.ptd_int')) {
                if (imm.get_imm_type() !== 'int') {
                    throw new Error(`Expected imm of type int: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                return imm.as_int();
            } else if (Object.hasOwn(type, 'ov.ptd_utf8')) {
                if (imm.get_imm_type() !== 'string') {
                    throw new Error(`Expected imm of type string: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                return imm.as_js_str();
            } else if (Object.hasOwn(type, 'ov.ptd_bool')) {
                if (imm.get_imm_type() !== 'ov') {
                    throw new Error(`Expected imm boolean variant: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                if (imm.name.value === 'TRUE') {
                    return true;
                } else if (imm.name.value === 'FALSE') {
                    return false;
                } else {
                    throw new Error('Invalid boolean variant label: ' + imm.name.value);
                }
            } else if (Object.hasOwn(type, 'ov.ptd_rec')) {
                if (imm.get_imm_type() !== 'hash') {
                    throw new Error(`Expected imm record (hash): (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var fields = type['ov.ptd_rec'];
                var jsonObj = {};
                var immKeys = Object.keys(imm.value);
                var fieldKeys = Object.keys(fields);
                if (immKeys.length !== fieldKeys.length) {
                    throw new Error(`Record field count mismatch. immKeys: ${JSON.stringify(immKeys)} typeKeys: ${JSON.stringify(fieldKeys)}`);
                }
                for (var key in fields) {
                    if (!imm.value.hasOwnProperty(key)) {
                        throw new Error(`Missing field in imm record: ${key}`);
                    }
                    jsonObj[key] = n.imm_to_json(imm.value[key], fields[key], typeLib);
                }
                return jsonObj;
            } else if (Object.hasOwn(type, 'ov.ptd_arr')) {
                if (imm.get_imm_type() !== 'array') {
                    throw new Error(`Expected imm array: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var elemType = type['ov.ptd_arr'];
                var arr = [];
                for (var i = 0; i < imm.value.length; i++) {
                    arr.push(n.imm_to_json(imm.value[i], elemType, typeLib));
                }
                return arr;
            } else if (Object.hasOwn(type, 'ov.ptd_hash')) {
                if (imm.get_imm_type() !== 'hash') {
                    throw new Error(`Expected imm hash: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var elemType = type['ov.ptd_hash'];
                var jsonObj = {};
                for (var key in imm.value) {
                    jsonObj[key] = n.imm_to_json(imm.value[key], elemType, typeLib);
                }
                return jsonObj;
            } else if (Object.hasOwn(type, 'ov.ptd_var')) {
                if (imm.get_imm_type() !== 'ov') {
                    throw new Error(`Expected imm variant: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var variants = type['ov.ptd_var'];
                var label = imm.name.as_js_str();
                if (!(label in variants)) {
                    throw new Error(`Unknown variant label: ${label}`);
                }
                var variantPtd = variants[label];
                if (Object.keys(variantPtd)[0] === 'ov.with_param') {
                    if (imm.value === null) {
                        throw new Error('Variant with parameter cannot be null');
                    }
                    return { ['ov.' + label]: n.imm_to_json(imm.value, variantPtd['ov.with_param'], typeLib) };
                } else {
                    if (imm.value !== null) {
                        throw new Error('Variant without parameter must have null value');
                    }
                    return { ['ov.' + label]: null };
                }
            } else if (Object.hasOwn(type, 'ov.ptd_date')) {
                if (imm.get_imm_type() !== 'string') {
                    throw new Error(`Expected imm date as string: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var dateStr = imm.as_js_str();
                var DateRegex = /^[0-9]{4}(-[0-9]{2}){2}( [0-9]{2}(:[0-9]{2}){2})?$/;
                if (!DateRegex.test(dateStr) || isNaN(Date.parse(dateStr))) {
                    throw new Error(`Invalid date format in imm: ${json}`);
                }
                return dateStr;
            } else if (Object.hasOwn(type, 'ov.ptd_decimal')) {
                if (imm.get_imm_type() !== 'int') {
                    throw new Error(`Expected imm decimal as int: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var decInfo = type['ov.ptd_decimal'];
                var value = imm.as_int();
                if (Number(value.toFixed(decInfo['scale'])) !== value ||
                    (Math.trunc(value) !== 0 &&
                        Math.trunc(value).toString().length > decInfo['size'] - decInfo['scale'])) {
                    throw new Error(`Decimal value out of bounds in imm: ${Math.trunc(json).toString().length}, size: ${decInfo['size']} scale: ${decInfo['scale']}`);
                }
                return value;
            } else if (Object.hasOwn(type, 'ov.ptd_bytearray')) {
                if (imm.get_imm_type() !== 'string') {
                    throw new Error(`Expected imm bytearray as string: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                var s = imm.as_js_str();
                for (var i = 0; i < s.length; i++) {
                    var code = s.charCodeAt(i);
                    if (code < 0 || code > 255) {
                        throw new Error(`Invalid byte in imm bytearray: ${code}`);
                    }
                }
                return s;
            } else if (Object.hasOwn(type, 'ov.ptd_double')) {
                if (imm.get_imm_type() !== 'int') {
                    throw new Error(`Expected imm double as int: (${imm.get_imm_type()}) ${JSON.stringify(imm)}`);
                }
                return imm.as_int();
            } else if (Object.hasOwn(type, 'ov.ptd_ref')) {
                return n.imm_to_json(json, typeLib[type['ov.ptd_ref']], typeLib);
            } else {
                throw new Error('Unsupported PTD type in imm_to_json conversion');
            }
        } catch (ex) {
            throw wrappedErrorMessage(ex, type);
        }
    };


})(nl = nl || {}); 