const METATYPE = {
    "metatype_lib" : { "ov.ptd_hash" : { "ov.ptd_ref" : "metatype" }}, 
    "metatype" : { "ov.ptd_var" : {
            "ptd_rec" : { "ov.with_param" : { "ov.ptd_hash" : { "ov.ptd_ref" : "metatype" }}},
            "ptd_arr" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }},
            "ptd_hash" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }},
            "ptd_var" : { "ov.with_param" : { "ov.ptd_hash" : { "ov.ptd_ref" : "variant_def"}}},
            "ptd_ref" : { "ov.with_param" : { "ov.ptd_utf8" : null } },
            "ptd_utf8" : { "ov.no_param" : null },
            "ptd_bytearray" : { "ov.no_param" : null },
            "ptd_int" : { "ov.no_param" : null },
            "ptd_double" : { "ov.no_param" : null },
            "ptd_decimal" : { "ov.with_param" : { "ov.ptd_rec" : {
                    "size" : { "ov.ptd_int" : null },
                    "scale" : { "ov.ptd_int" : null }
            }}}
    }},
    "variant_def" : { "ov.ptd_var" : {
            "no_param" : { "ov.no_param" : null },
            "with_param" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }}
    }}
}

const success = document.querySelector('.validator-success');
const error = document.querySelector('.validator-error');
const internal = document.querySelector('.validator-internal');

const typeTextArea = document.querySelector('#ptd-type');
const valueTextArea = document.querySelector('#ptd-value');

function handleValidateClick() {
    const type = typeTextArea.value;
    const value = valueTextArea.value;
    
    if (type.length === 0 || value.length === 0) {
        showInternal();
        return;
    } 
    try {
        const parsedValue = JSON.parse(value);
        const parsedTypeLib = JSON.parse(type);
        const typeName = Object.keys(parsedTypeLib)[0];
        if (verifyType(parsedTypeLib)) {
            verifyValue(parsedTypeLib, typeName, parsedValue);
        }
    } catch {
        showInternal();
    }
}

function verifyType(typeLib) {
    if(verify(typeLib, Object.keys(METATYPE)[0], METATYPE)) {
        return true;
    } else {
        showError('Type mismatch with metatype!');
        typeTextArea.style.background = '#f8d7da'
        return false;
    }
}

function verifyValue(typeLib, typeName, value) {
    if(verify(value, typeName, typeLib)) {
        showSuccess();
    } else {
        showError('The value does not correspond to the type!');
        valueTextArea.style.background = '#f8d7da'
    }
}

function showInternal() {
    valueTextArea.style.background = '#ffffff';
    typeTextArea.style.background = '#ffffff';
    error.style.display = 'none';
    success.style.display = 'none';
    internal.classList.add('fadeIn');
    internal.style.display = 'block';   
}

function showError(errorMessage) {
    valueTextArea.style.background = '#ffffff';
    typeTextArea.style.background = '#ffffff';
    internal.style.display = 'none';
    success.style.display = 'none';  
    error.innerHTML = errorMessage;
    error.classList.add('fadeIn');
    error.style.display = 'block';
}

function showSuccess() {
    valueTextArea.style.background = '#ffffff';
    typeTextArea.style.background = '#ffffff';
    error.style.display = 'none';
    internal.style.display = 'none';   
    success.classList.add('fadeIn');
    success.style.display = 'block';
}
