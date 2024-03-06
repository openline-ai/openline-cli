import * as shell from 'shelljs'
import { getConfig } from '../../config/dev'
import { deployDeployment } from './deploy'
import { logTerminal } from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const TEMPORAL_SERVER = 'temporal'
const CLI_RAW_REPO = config.cli.rawRepo

function temporalServerCheck(): boolean {
    return (shell.exec(`kubectl get service ${TEMPORAL_SERVER} -n ${NAMESPACE}`, { silent: true }).code === 0)
}

export function installTemporalServer(verbose: boolean, location = config.setupDir, imageVersion = 'latest'): boolean {
    if (temporalServerCheck()) return true

    const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.temporalServerDeployment

    const CERT_MGR_CMD = `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml`

    const CRD_CMD = `kubectl apply --server-side -f https://github.com/alexandrevilain/temporal-operator/releases/latest/download/temporal-operator.crds.yaml`
    const OPERATOR_CMD = `kubectl apply -f https://github.com/alexandrevilain/temporal-operator/releases/latest/download/temporal-operator.yaml`

    logTerminal('WARNING', 'installing cert-manager...')
    if (verbose) logTerminal('EXEC', CERT_MGR_CMD)
    let ok = shell.exec(CERT_MGR_CMD, { silent: true }).code === 0
    if (!ok) return false
    waitForCertManager(verbose)

    logTerminal('WARNING', 'installing temporal-server...')
    if (verbose) logTerminal('EXEC', CRD_CMD)
    ok = shell.exec(CRD_CMD, { silent: !verbose }).code === 0
    if (!ok) return false
    if (verbose) logTerminal('EXEC', OPERATOR_CMD)
    ok = shell.exec(OPERATOR_CMD, { silent: !verbose }).code === 0
    if (!ok) return false

    waitForCRD(verbose)

    const deploy = deployDeployment(DEPLOYMENT, verbose)
    if (deploy === false) return false

    waitForTemporal(verbose)

    logTerminal('INFO', 'temporal grpc server listening on localhost:7233')
    logTerminal('INFO', 'temporal web ui listening on localhost:8233')
    logTerminal('SUCCESS', 'temporal successfully installed')
    return true
}

export function pingTemporalServer(): boolean {
    let podname = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep temporal-frontend`, { silent: true }).stdout
    let status = shell.exec(`kubectl -n ${NAMESPACE} get pod ${podname} -o jsonpath='{.status.phase}'`, { silent: true }).stdout
    return status == "Running"
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

function waitForCRD(verbose: boolean) {
    if (verbose) logTerminal('INFO', 'Waiting for CRD pod to reach the Running state')
    let temporalOpPodName
    let restarts = 0
    do {
        temporalOpPodName = shell.exec(`kubectl -n temporal-system get pods --no-headers -o custom-columns=":metadata.name" | grep temporal-operator`, { silent: true })
            .stdout
            .split(/\r?\n/)
            .filter(Boolean);
    } while (temporalOpPodName.length < 1)
    if (verbose) logTerminal('SUCCESS', 'temporal-operator pod exists')

    let tmpOpPodStatus;
    do {
        tmpOpPodStatus = shell.exec(`kubectl -n temporal-system get pod ${temporalOpPodName[0]} -o jsonpath='{.status.phase}'`, { silent: true })
        shell.exec('sleep 2')
    } while (tmpOpPodStatus == "Pending" || tmpOpPodStatus == "ContainerCreating")
    if (verbose) logTerminal('SUCCESS', 'temporal-operator pod status is not Pending anymore')

    let tmpOpPodLogs;
    do {
        tmpOpPodLogs = shell.exec(`kubectl -n temporal-system logs ${temporalOpPodName[0]}`, { silent: true })
        shell.exec('sleep 2')
    } while (!tmpOpPodLogs.includes("Serving webhook server"))
    if (verbose) logTerminal('SUCCESS', 'temporal-operator pod is Running')
}

function waitForCertManager(verbose: boolean) {
    if (verbose) logTerminal('INFO', 'Waiting for cert-manager pod to reach the Running state')
    let certMgrPodName
    let restarts = 0
    do {
        certMgrPodName = shell.exec(`kubectl -n cert-manager get pods --no-headers -o custom-columns=":metadata.name" | grep cert-manager`, { silent: true })
            .stdout
            .split(/\r?\n/)
            .filter(Boolean);
    } while (certMgrPodName.length < 1)
    if (verbose) logTerminal('SUCCESS', 'cert-manager pod exists')

    let certMgrPodStatus;
    do {
        certMgrPodStatus = shell.exec(`kubectl -n cert-manager get pod ${certMgrPodName[0]} -o jsonpath='{.status.phase}'`, { silent: true })
        shell.exec('sleep 2')
    } while (certMgrPodStatus == "Pending")
    if (verbose) logTerminal('SUCCESS', 'cert-manager pod status is not Pending anymore')

    do {
        certMgrPodStatus = shell.exec(`kubectl -n cert-manager get pod ${certMgrPodName[0]} -o jsonpath='{.status.phase}'`, { silent: true })
        shell.exec('sleep 2')
    } while (certMgrPodStatus != "Running")
    let certWebhookPodName = shell.exec(`kubectl -n cert-manager get pods --no-headers -o custom-columns=":metadata.name" | grep cert-manager-webhook`, { silent: true })
        .stdout
        .split(/\r?\n/)
        .filter(Boolean);
    let certWebhookPodLogs;
    do {
        certWebhookPodLogs = shell.exec(`kubectl -n cert-manager logs ${certWebhookPodName[0]}`, { silent: true })
        shell.exec('sleep 2')
    } while (!certWebhookPodLogs.includes("listening for insecure healthz connections"))
    if (verbose) logTerminal('SUCCESS', 'cert-manager pod is Running')
}

function waitForTemporal(verbose: boolean) {
    if (verbose) logTerminal('INFO', 'Waiting for temporal-server pod to reach the Running state')
    let temporalPodName
    let restarts = 0
    do {
        temporalPodName = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep temporal-frontend`, { silent: true })
            .stdout
            .split(/\r?\n/)
            .filter(Boolean);
        if (verbose) logTerminal('SUCCESS', '...')
    } while (temporalPodName.length < 1)
    if (verbose) logTerminal('SUCCESS', 'temporal pod exists')

    let temporalPodStatus;
    do {
        temporalPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${temporalPodName[0]} -o jsonpath='{.status.phase}'`, { silent: true })
        shell.exec('sleep 2')
    } while (temporalPodStatus == "Pending")
    if (verbose) logTerminal('SUCCESS', 'temporal pod status is not Pending anymore')

    do {
        temporalPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${temporalPodName[0]} -o jsonpath='{.status.phase}'`, { silent: true })
        shell.exec('sleep 2')
    } while (temporalPodStatus != "Running")
    if (verbose) logTerminal('SUCCESS', 'temporal pod is Running')
}

