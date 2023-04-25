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

const MESSAGE_TYPES = {
    "ERROR": "error",
    "INTERNAL": "internal",
    "SUCCESS": "success"
};

const MESSAGES = {
    "TYPELIB_EMPTY": "TypeLib is empty!",
    "TYPE_EMPTY": "Type is empty!",
    "VALUE_EMPTY": "Value is empty!",
    "TYPELIB_INTERNAL": "Internal error occured during typeLib parsing (incorrect JSON)!",
    "VALUE_INTERNAL": "Internal error occured during value parsing (incorrect JSON)!",
    "TYPELIB_ERROR": "TypeLib mismatch with metatype!",
    "TYPE_ERROR": "There is no corresponding type in TypeLib!",
    "ERROR": "The value does not correspond to the type!",
    "SUCCESS": "The value does conforms to the type!"
};

const COLORS = {
    "ERROR": "#f8d7da",
    "INTERNAL": "#fff3cd",
    "SUCCESS": "#d1e7dd"
}

const messageDiv = document.querySelector('.validator-message');

const typeLibTextArea = document.querySelector('#ptd-typelib');
const valueTextArea = document.querySelector('#ptd-value');
const typeInput = document.querySelector('#ptd-type');

function handleTypeLibChange() {
    try {
        const typeLib = typeLibTextArea.value;
        if (typeLib.length == 0) return;
        parsedTypeLib = JSON.parse(typeLib);
        typeInput.value = Object.keys(parsedTypeLib)[0];
    } catch {
        return;
    }
}

function handlePrettyPrint(isTypeLib) {
    const typeLib = typeLibTextArea.value;
    const value = valueTextArea.value;

    if (isTypeLib) {
        try {
            parsedTypeLib = JSON.parse(typeLib);
            typeLibTextArea.value = prettyPrinter(parsedTypeLib);
        } catch {
            showMessage(MESSAGES.TYPELIB_INTERNAL, MESSAGE_TYPES.INTERNAL);
            typeLibTextArea.style.background = COLORS.INTERNAL;
            return;
        }
    } else {
        try {
            parsedValue = JSON.parse(value);
            valueTextArea.value = prettyPrinter(parsedValue);
        } catch {
            showMessage(MESSAGES.VALUE_INTERNAL, MESSAGE_TYPES.INTERNAL);
            valueTextArea.style.background = COLORS.INTERNAL;
            return;
        }
    }
    clearFormatting();
}

function handleValidateClick() {
    const typeLib = typeLibTextArea.value;
    const value = valueTextArea.value;
    const typeName = typeInput.value;

    let parsedTypeLib = {};
    let parsedValue = {};

    // type checking
    if (typeName.length == 0) {
        showMessage(MESSAGES.TYPE_EMPTY, MESSAGE_TYPES.INTERNAL);
        typeInput.style.background = COLORS.INTERNAL;
        return;
    }

    // typeLib checking
    if (typeLib.length == 0) {
        showMessage(MESSAGES.TYPELIB_EMPTY, MESSAGE_TYPES.INTERNAL);
        typeLibTextArea.style.background = COLORS.INTERNAL;
        return;
    }

    try {
        parsedTypeLib = JSON.parse(typeLib);
    } catch {
        showMessage(MESSAGES.TYPELIB_INTERNAL, MESSAGE_TYPES.INTERNAL);
        typeLibTextArea.style.background = COLORS.INTERNAL;
        return;
    }

    if (!verify(parsedTypeLib, Object.keys(METATYPE)[0], METATYPE)) {
        showMessage(MESSAGES.TYPELIB_ERROR, MESSAGE_TYPES.ERROR);
        typeLibTextArea.style.background = COLORS.ERROR;
        return;
    }

    // does typeLibe contain type checking
    if (parsedTypeLib[typeName] === undefined) {
        showMessage(MESSAGES.TYPE_ERROR, MESSAGE_TYPES.ERROR);
        typeLibTextArea.style.background = COLORS.ERROR;
        typeInput.style.background = COLORS.ERROR;
        return;
    }

    // value checking
    if (value.length == 0) {
        showMessage(MESSAGES.VALUE_EMPTY, MESSAGE_TYPES.INTERNAL);
        valueTextArea.style.background = COLORS.INTERNAL;
        return;
    }

    try {
        parsedValue = JSON.parse(value);
    } catch {
        showMessage(MESSAGES.VALUE_INTERNAL, MESSAGE_TYPES.INTERNAL);
        valueTextArea.style.background = COLORS.INTERNAL;
        return;
    }

    // validation
    if (verify(parsedValue, typeName, parsedTypeLib)) {
        showMessage(MESSAGES.SUCCESS, MESSAGE_TYPES.SUCCESS);
        typeLibTextArea.style.background = COLORS.SUCCESS;
        typeInput.style.background = COLORS.SUCCESS;
        valueTextArea.style.background = COLORS.SUCCESS;
    } else {
        showMessage(MESSAGES.ERROR, MESSAGE_TYPES.ERROR);
        typeLibTextArea.style.background = COLORS.ERROR;
        typeInput.style.background = COLORS.ERROR;
        valueTextArea.style.background = COLORS.ERROR;
    }
    return;
}

function showMessage(message, messageType) {
    clearFormatting();
    if (messageType === MESSAGE_TYPES.ERROR) {
        messageDiv.classList.add('validator-error');
    } else if (messageType === MESSAGE_TYPES.INTERNAL) {
        messageDiv.classList.add('validator-internal');
    } else if (messageType === MESSAGE_TYPES.SUCCESS) {
        messageDiv.classList.add('validator-success');
    }

    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';   
}

function clearFormatting () {
    messageDiv.classList.remove('validator-error');
    messageDiv.classList.remove('validator-internal');
    messageDiv.classList.remove('validator-success');
    valueTextArea.style.background = '#ffffff';
    typeLibTextArea.style.background = '#ffffff';
    typeInput.style.background = '#ffffff';
    messageDiv.style.display = 'none';
}
