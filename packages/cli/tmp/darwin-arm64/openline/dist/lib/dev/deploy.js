"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployLoadbalancer = exports.updateImageTag = exports.deployImage = void 0;
const shell = require("shelljs");
const replace = require("replace-in-file");
const dev_1 = require("../../config/dev");
const logs_1 = require("../logs");
const dependencies_1 = require("../dependencies");
const fs = require("node:fs");
const YAML = require("yaml");
const k3d = require("./k3d");
const config = (0, dev_1.getConfig)();
const NAMESPACE = config.namespace.name;
function deployImage(imageUrl, deployConfig, verbose = false) {
    if (verbose) {
        (0, logs_1.logTerminal)('INFO', 'deploying image', imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.toString());
    }
    if (imageUrl !== null) {
        const dockerPull = `docker pull ${imageUrl}`;
        if (verbose)
            (0, logs_1.logTerminal)('EXEC', dockerPull);
        const pull = shell.exec(dockerPull, { silent: true });
        if (pull.code !== 0) {
            (0, logs_1.logTerminal)('ERROR', pull.stderr, 'dev:deploy:deployImage');
            return false;
        }
        if ((0, dependencies_1.getPlatform)() === 'linux') {
            const pushCmd = 'k3d image import ' + imageUrl + ' -c development';
            if (verbose)
                (0, logs_1.logTerminal)('EXEC', pushCmd);
            const push = shell.exec(pushCmd, { silent: !verbose });
            if (push.code !== 0) {
                (0, logs_1.logTerminal)('ERROR', push.stderr, 'dev:deploy:tagImage');
                return false;
            }
        }
    }
    const kubeApplyDeployConfig = `kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubeApplyDeployConfig);
    const deploy = shell.exec(kubeApplyDeployConfig, { silent: !verbose });
    if (deploy.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', deploy.stderr, 'dev:deploy:deployImage');
        return false;
    }
    const kubeApplyServiceConfig = `kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubeApplyServiceConfig);
    const service = shell.exec(kubeApplyServiceConfig, { silent: !verbose });
    if (service.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', service.stderr, 'dev:deploy:deployImage');
        return false;
    }
    if ('loadbalancerYaml' in deployConfig && deployConfig.loadbalancerYaml !== null) {
        const lb = deployLoadbalancer(deployConfig.loadbalancerYaml ? deployConfig.loadbalancerYaml : '', verbose);
        if (!lb) {
            return false;
        }
    }
    return true;
}
exports.deployImage = deployImage;
function updateImageTag(deployFiles, imageVersion) {
    const options = {
        files: deployFiles,
        from: 'latest',
        to: imageVersion,
    };
    try {
        replace.sync(options);
    }
    catch (error) {
        (0, logs_1.logTerminal)('ERROR', error);
        return false;
    }
    return true;
}
exports.updateImageTag = updateImageTag;
function deployLoadbalancer(YamlConfigPath, verbose) {
    const kubeApplyLoadbalancer = `kubectl apply -f ${YamlConfigPath} --namespace ${NAMESPACE}`;
    if (verbose)
        (0, logs_1.logTerminal)('EXEC', kubeApplyLoadbalancer);
    const lb = shell.exec(kubeApplyLoadbalancer, { silent: !verbose });
    if (lb.code !== 0) {
        (0, logs_1.logTerminal)('ERROR', lb.stderr, 'dev:deploy:deployLoadbalancer');
        return false;
    }
    if ((0, dependencies_1.getPlatform)() === 'linux') {
        const file = fs.readFileSync(YamlConfigPath ? YamlConfigPath : '', 'utf8');
        const config = YAML.parse(file);
        for (const val of config.spec.ports) {
            if (!k3d.createPortForward(verbose, val.port, val.protocol)) {
                return false;
            }
        }
    }
    return true;
}
exports.deployLoadbalancer = deployLoadbalancer;
