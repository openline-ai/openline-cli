import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployLoadbalancer} from './deploy'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const FUSIONAUTH_SERVICE = 'fusionauth-customer-os'

function fusionauthCheck() :boolean {
  return (shell.exec(`kubectl get service ${FUSIONAUTH_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function hostsCheck() :boolean {
  const check = shell.exec('grep fusionauth-customer-os.openline.svc.cluster.local /etc/hosts', {silent: true}).stdout
  if (check === '') return false
  return true
}

function addHosts(verbose: boolean) :boolean {
  if (hostsCheck()) return true
  const cmd = 'sudo bash -c "echo 127.0.0.1 fusionauth-customer-os.openline.svc.cluster.local >> /etc/hosts"'
  console.log('⏳ updating host file with fusionauth configuration')
  console.log('❗️ this requires sudo permissions and is required for fusionauth to work')
  console.log('❗️ if granted, the following command will execute...')
  console.log(`==> ${cmd}`)
  return (shell.exec(cmd, {silent: !verbose}).code === 0)
}

export function installFusionAuth(verbose :boolean, location = config.setupDir) :boolean {
  if (fusionauthCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.fusionauthHelmValues
  const LOADBALANCER_PATH = location + config.customerOs.fusionauthLoadbalancer

  const helmAdd = 'helm repo add fusionauth https://fusionauth.github.io/charts'
  if (verbose) console.log(`[EXEC] ${helmAdd}`)
  shell.exec(helmAdd, {silent: !verbose})

  const helmInstall = `helm install ${FUSIONAUTH_SERVICE} fusionauth/fusionauth -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${helmInstall}`)
  const fa = shell.exec(helmInstall, {silent: !verbose})
  if (fa.code !== 0) {
    error.logError(fa.stderr, 'Unable to complete helm install of fusion auth', true)
    return false
  }

  const lb = deployLoadbalancer(LOADBALANCER_PATH, verbose)
  if (!lb) {
    error.logError('Error deploying loadbalancer for FusionAuth', 'Try again')
    return false
  }

  if (!addHosts(verbose)) return false

  return true
}

export function uninstallFusionAuth(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${FUSIONAUTH_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', helmUninstall)
  const result = shell.exec(helmUninstall, {silent: true})
  if (result.code === 0) {
    logTerminal('SUCCESS', 'auth deployment successfully uninstalled')
  } else {
    logTerminal('ERROR', result.stderr, 'dev:auth:uninstallFusionAuth')
    return false
  }

  return true
}

export function pingFusionAuth() :boolean {
  return shell.exec('curl --max-time 2 localhost:9011/health', {silent: true}).code === 0
}
