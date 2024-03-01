import * as shell from 'shelljs'
import { getConfig } from '../../config/dev'
import { deployImage, Yaml } from './deploy'
import { logTerminal } from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const TEMPORAL_SERVER = 'temporal-server'
const CLI_RAW_REPO = config.cli.rawRepo

function temporalServerCheck(): boolean {
    return (shell.exec(`kubectl get service ${TEMPORAL_SERVER} -n ${NAMESPACE}`, { silent: true }).code === 0)
}

export function installCustomerOsTemporalServer(verbose: boolean): boolean {
    if (temporalServerCheck()) {
        logTerminal('SUCCESS', 'temporal-server is already running')
        return true
    }
    // This command automatically starts the Temporal Web UI, creates a default Namespace, and creates an in-memory database.
    const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.temporalServerDeployment
    const SERVICE = CLI_RAW_REPO + config.customerOs.temporalServerService
    const LOADBALANCER = CLI_RAW_REPO + config.customerOs.temporalServerLoadbalancer

    const installConfig: Yaml = {
        deployYaml: DEPLOYMENT,
        serviceYaml: SERVICE,
        loadbalancerYaml: LOADBALANCER,
    }
    const deploy = deployImage(null, installConfig, verbose)
    if (deploy === false) return false

    logTerminal('SUCCESS', 'temporal-server successfully installed')
    return true
}