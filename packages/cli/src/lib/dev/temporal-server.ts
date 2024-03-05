import * as shell from 'shelljs'
import { getConfig } from '../../config/dev'
import { deployDeployment } from './deploy'
import { logTerminal } from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const TEMPORAL_SERVER = 'temporal'
const CLI_RAW_REPO = "~/work/openline-cli/" // config.cli.rawRepo

function temporalServerCheck(): boolean {
    return (shell.exec(`kubectl get service ${TEMPORAL_SERVER} -n ${NAMESPACE}`, { silent: true }).code === 0)
}

export function installTemporalServer(verbose: boolean, location = config.setupDir, imageVersion = 'latest'): boolean {
    if (temporalServerCheck()) return true

    const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.temporalServerDeployment

    const deploy = deployDeployment(DEPLOYMENT, verbose)
    if (deploy === false) return false

    logTerminal('INFO', 'temporal grpc server listening on localhost:7233')
    //kubectl port-forward service/temporal-ui 8233:8233
    logTerminal('INFO', 'temporal web ui listening on localhost:8233')
    logTerminal('SUCCESS', 'temporal successfully installed')
    return true
}

export function pingTemporalServer(): boolean {
    // "temporal workflow list" is a command that lists all workflows in the temporal server
    let podname = shell.exec(`kubectl get pods -n ${NAMESPACE} -l io.kompose.service=temporal-admin-tools -o jsonpath='{.items[0].metadata.name}' `, { silent: true }).stdout
    return shell.exec(`kubectl exec -it -n ${NAMESPACE} ${podname} -- tctl workflow list`, { silent: true }).code === 0
    //return shell.exec(`kubectl exec -n ${NAMESPACE} -it $(kubectl get pods -n ${NAMESPACE} -l app=temporal-server -o jsonpath='{.items[0].metadata.name}') -- temporal --ns openline workflow list`, { silent: true }).code === 0
    //return shell.exec(`temporal workflow list`, { silent: true }).code === 0
}

export function runLocalTemporalServer(verbose: boolean): boolean {
    logTerminal('WARNING', 'running temporal-server...')
    shell.exec("temporal server start-dev", { silent: true, async: true })
    logTerminal('SUCCESS', 'temporal-server successfully initiated')
    logTerminal('INFO', 'server listening on localhost:7233')
    logTerminal('INFO', 'web listening on localhost:8233')
    logTerminal('INFO', 'If temporal stops running by end of deploy, run "openline dev start temporal-server"')
    return true
}

export function registerTemporalNamespace(namespace: string): boolean {
    let podname = shell.exec(`kubectl get pods -n ${NAMESPACE} -l io.kompose.service=temporal-admin-tools -o jsonpath='{.items[0].metadata.name}' `, { silent: true }).stdout
    return shell.exec(`kubectl exec -it ${podname} -- tctl --ns ${namespace} namespace register -rd 1`, { silent: true }).code === 0
}