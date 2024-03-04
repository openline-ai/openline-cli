import * as shell from 'shelljs'
import { getConfig } from '../../config/dev'
import { deployImage, Yaml } from './deploy'
import { logTerminal } from '../logs'
import { log } from 'console'

const config = getConfig()
const NAMESPACE = config.namespace.name
const TEMPORAL_SERVER = 'temporal-server'
const CLI_RAW_REPO = "~/work/openline-cli/" // config.cli.rawRepo

function temporalServerCheck(): boolean {
    return (shell.exec(`kubectl get service ${TEMPORAL_SERVER} -n ${NAMESPACE}`, { silent: true }).code === 0)
}

export function pingTemporalServer(): boolean {
    return shell.exec(`temporal workflow list`, { silent: true }).code === 0
}

export function runTemporalServer(verbose: boolean): boolean {
    logTerminal('WARNING', 'running temporal-server...')
    shell.exec("temporal server start-dev", { silent: true, async: true })
    logTerminal('SUCCESS', 'temporal-server successfully installed')
    logTerminal('INFO', 'If temporal stops running by end of deploy, run "openline dev start temporal-server"')
    return true
}