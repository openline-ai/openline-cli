"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class Dev extends core_1.Command {
    async run() {
        await this.parse(Dev);
    }
}
exports.default = Dev;
Dev.description = 'starts and stops local development server for openline applications';
Dev.examples = [];
