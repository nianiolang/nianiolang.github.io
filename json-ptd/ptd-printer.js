const TAB = '\t';
const SPACE = ' ';
const EOL = '\n';

const EOL_TRIGGER = 3;

function prettyPrinter(data) {
    result = print(data, "", 1, true);
    return result.replaceAll('} ', '}');
}

function print(data, result, tabAmount, isTopLevel) {
    if (isObject(data)) {
        const isArray = Array.isArray(data);
        const fields = Object.keys(data);
        const isWrapped = (fields.length > EOL_TRIGGER) || (fields.length > 1 && !areFieldsValueSimple(data)) || (isTopLevel && !isArray);

        result += isArray ? '[' : '{' + SPACE;
        if (isArray && !isWrapped && !isObject(data[0])) result += SPACE;

        for (let i = 0; i < fields.length; i++) {
            if (isWrapped) result += EOL + TAB.repeat(tabAmount);
            if (!isArray) result += '"' + fields[i] + '"' + SPACE + ':' + SPACE;
            result = print(data[fields[i]], result, isWrapped ? tabAmount + 1 : tabAmount, false);
            if (i !== fields.length - 1)  {
                result += ',';
                if (!isWrapped) result += SPACE;
            } else {
                result += SPACE;
            }
        }
        
        if (isWrapped) result += EOL + TAB.repeat(tabAmount - 1);
        result += isArray ? ']' : '}';
    } else if (typeof data === 'number' || typeof data === 'boolean' || data === null) {
        result += data;
    } else {
        result += '"' + data.replaceAll('"', '\\"') + '"';
    }
    return result;
}

function areFieldsValueSimple(data) {
    const fields = Object.keys(data);
    for (const f of fields) {
        if (typeof data[f] === 'object' &&  data[f] !== null) return false;
    }
    return true;
}

function isObject(data) {
    if (typeof data === 'object' && data !== null) return true;
    else return false;
}