import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployLoadbalancer} from './deploy'

const config = getConfig()
const NAMESPACE = config.namespace.name
const FUSIONAUTH_SERVICE = 'fusionauth-customer-os'

function fusionauthCheck() :boolean {
  return (shell.exec(`kubectl get service ${FUSIONAUTH_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
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

  return true
}

export function uninstallFusionAuth(verbose:boolean) :boolean {
  const helmUninstall = `helm uninstall ${FUSIONAUTH_SERVICE} --namespace ${NAMESPACE}`
  if (verbose) console.log(`[EXEC] ${helmUninstall}`)
  const result = shell.exec(helmUninstall, {silent: !verbose})
  if (result.code !== 0) {
    error.logError(result.stderr, 'Unable to helm uninstall fusion auth')
    return false
  }

  return true
}
