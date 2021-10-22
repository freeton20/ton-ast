const fs = require('fs');

function getErrorLenght(errorString) {
    if (!errorString) return null;

    let errorStringCounter = errorString.match(/[\^]/g);
    if (errorStringCounter == null) {
        return null;
    }
    return errorStringCounter.length;
}

function getErrorFilePath(string) {
    let filePath = string.match(/\s([\w\.\/]+\.sol):/);
    if (filePath == null || !filePath[1]) return null;

    if (fs.existsSync(filePath[1])) {
        return filePath[1];
    }
   return null;
}

function formatErrorsForVSCode(string) {
    if (!string) return;

    let arr = string.split("\n\n");

    let a = arr.map(value => {
        return value.split("\n")
    })

    a = a.filter(value => {
        if (value.length < 5) return false;
        return true;
    })
    return a.map((value) => {
        let coord = value[1] ? value[1].match(/\d+:\d+/) : null;
        if (coord !== null) coord = coord[0].split(":");
        let severity = value[0].match(/Warning/) ? 'Warning' : 'Error';
        let raw = !coord ? null : Number(coord[0]);
        let position = !coord ? null : Number(coord[1]);
        let errorLenght = getErrorLenght(value[4]);
        let source = getErrorFilePath(value.join("\n"));
        return {
            info: value.join('\n'),
            coord: {
                raw,
                position
            },
            errorLenght,
            severity,
            source
        }
    })
}
module.exports = {
    formatErrorsForVSCode
}