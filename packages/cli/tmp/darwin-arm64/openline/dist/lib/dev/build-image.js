"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLocalImage = void 0;
const shell = require("shelljs");
const logs_1 = require("../logs");
const dependencies_1 = require("../dependencies");
function buildLocalImage(path, context, imageName, verbose) {
    const dockerBuild = `docker build -t ${imageName} -f ${path}/Dockerfile ${context}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', dockerBuild);
    const buildExecution = shell.exec(dockerBuild, { silent: !verbose });
    if (buildExecution.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', buildExecution.stderr, 'dev:build-image:buildLocalImage');
        return false;
    }
    if ((0, dependencies_1.getPlatform)() === 'linux') {
        const pushCmd = 'k3d image import ' + imageName + ' -c development';
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', pushCmd);
        const push = shell.exec(pushCmd, { silent: !verbose });
        if (push.code !== 0) {
            (0, logs_1.logTerminal)('ERROR', push.stderr, 'dev:build-image:buildLocalImage');
            return false;
        }
    }
    return true;
}
exports.buildLocalImage = buildLocalImage;
