"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const namespace_1 = require("../../lib/dev/namespace");
const shell = require("shelljs");
class DevStatus extends core_1.Command {
    async run() {
        // const {flags} = await this.parse(DevStatus)
        // let verbose = flags.verbose
        const isInstalled = (0, namespace_1.namespaceCheck)();
        if (isInstalled) {
            this.log('🦦 k8s cluster');
            shell.exec('kubectl get services');
            this.log('');
            shell.exec('kubectl get services -n openline');
            this.log('');
            this.log('🦦 k8s pods: openline');
            shell.exec('kubectl get pods -n openline -o wide');
            this.log('');
            this.log('🦦 k8s persistent volumes');
            shell.exec('kubectl get pv');
        }
        else {
            console.log('❌ Openline services are not running');
            console.log('🦦 Try running => openline dev start customer-os');
        }
    }
}
exports.default = DevStatus;
DevStatus.description = 'view current status of all Openline services';
DevStatus.examples = [
    '<%= config.bin %> <%= command.id %>',
];
DevStatus.flags = {
    verbose: core_1.Flags.boolean({ char: 'v' }),
};
DevStatus.args = [];
