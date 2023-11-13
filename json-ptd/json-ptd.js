const jsonptd = {
    verify: function (value, typeName, typeLib) {
        if (!Object.hasOwn(typeLib, typeName)) return false;
        const type = typeLib[typeName];
        return this.verify_type(value, type, typeLib);
    },
    verify_type: function (value, type, typeLib) {
        if (value === null) return false;
        if (Object.hasOwn(type, 'ov.ptd_rec')) {
            const fieldHash = type['ov.ptd_rec'];
            const fieldNames = Object.keys(fieldHash);
            const valueKeys = Object.keys(value);
    
            if (fieldNames.length !== valueKeys.length) return false;
            for (const r of fieldNames) {
                if (!valueKeys.includes(r)) return false;
            }
            for (const tk of fieldNames) {
                if (!this.verify_type(value[tk], fieldHash[tk], typeLib)) return false;
            }
            return true;
    
        } else if (Object.hasOwn(type, 'ov.ptd_arr')) {
            const elemType = type['ov.ptd_arr'];
            if (!(value instanceof Array)) return false;
            for (const elem of value) {
                if (!this.verify_type(elem, elemType, typeLib)) return false;
            }
            return true;
    
        } else if (Object.hasOwn(type, 'ov.ptd_hash')) {
            const valueKeys = Object.keys(value);
            const elemType = type['ov.ptd_hash'];
    
            for (let i = 0; i < valueKeys.length; i++) {
                const keyValue = value[Object.keys(value)[i]];
                if (!this.verify_type(keyValue, elemType, typeLib)) return false;
            }
            return true;
    
        } else if (Object.hasOwn(type, 'ov.ptd_var')) {
            const fieldHash = type['ov.ptd_var'];
            const variantName = Object.keys(value)[0];
            if (variantName === undefined || !variantName.startsWith('ov.') || !(variantName.slice(3) in fieldHash)) return false;
    
            const variantType = fieldHash[variantName.slice(3)];
            const hasParam = Object.keys(variantType)[0] === 'ov.with_param';
    
            return hasParam ? this.verify_type(value[variantName], variantType['ov.with_param'], typeLib) : value[variantName] === null;
    
        } else if (Object.hasOwn(type, 'ov.ptd_ref')) {
            const refName = type['ov.ptd_ref'];
            return this.verify_type(value, typeLib[refName], typeLib);
    
        } else if (Object.hasOwn(type, 'ov.ptd_utf8')) {
            return typeof value === 'string';
    
        } else if (Object.hasOwn(type, 'ov.ptd_bytearray')) {
            if (typeof value !== 'string') return false;
            for (let i = 0; i < value.length; i++) {
                if (value.charCodeAt(i) < 0 || value.charCodeAt(i) > 255) return false;
            }
            return true;
    
        } else if (Object.hasOwn(type, 'ov.ptd_int')) {
            return Number.isInteger(value);
    
        } else if (Object.hasOwn(type, 'ov.ptd_double')) {
            return Number(value) === value;
    
        } else if (Object.hasOwn(type, 'ov.ptd_bool')) {
            return typeof value === 'boolean';
    
        } else if (Object.hasOwn(type, 'ov.ptd_date')) {
            if (typeof value !== 'string') return false;
            const DateRegex = new RegExp('^[0-9]{4}(-[0-9]{2}){2}( [0-9]{2}(:[0-9]{2}){2})?$');
            if(DateRegex.test(value) === false) return false;
            return !isNaN(Date.parse(value));
    
        } else if (Object.hasOwn(type, 'ov.ptd_decimal')) {
            const fieldHash = type['ov.ptd_decimal'];
            return Number(value.toFixed(fieldHash['scale'])) === value && 
                (Math.trunc(value) === 0 || Math.trunc(value).toString().length <= fieldHash['size'] - fieldHash['scale']);
        }
    
        return false;
    }
}