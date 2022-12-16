"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTerminal = void 0;
const colors = require("colors"); // eslint-disable-line no-restricted-imports
function logTerminal(type, description, location) {
    if (type.toUpperCase() === 'ERROR') {
        type = colors.red.bold(`[${type.toUpperCase()}]`);
    }
    else if (type.toUpperCase() === 'SUCCESS') {
        type = '🦦 ';
    }
    else if (type.toUpperCase() === 'EXEC') {
        type = colors.grey(`[${type.toUpperCase()}]`);
        description = colors.grey(description);
    }
    else {
        type = colors.cyan(`[${type.toUpperCase()}]`);
    }
    console.log(type, description);
    if (location) {
        location = colors.italic(location);
        console.log(location);
    }
}
exports.logTerminal = logTerminal;
