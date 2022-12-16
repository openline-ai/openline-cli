"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const colima = require("../../lib/dev/colima");
const k3d = require("../../lib/dev/k3d");
const dependencies_1 = require("../../lib/dependencies");
class DevStop extends core_1.Command {
    async run() {
        const { flags } = await this.parse(DevStop);
        switch ((0, dependencies_1.getPlatform)()) {
            case 'mac':
                colima.stopColima(flags.verbose);
                break;
            case 'linux':
                k3d.stopK3d(flags.verbose);
                break;
        }
    }
}
exports.default = DevStop;
DevStop.description = 'Stops the Openline development server & saves current config.';
DevStop.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevStop.flags = {
    verbose: core_1.Flags.boolean({ char: 'v' }),
};
DevStop.args = [];
