import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'

const config = getConfig()
const NAMESPACE = config.namespace.name
const FUSIONAUTH_SERVICE = 'fusionauth-customer-os'

function fusionauthCheck() :boolean {
  return (shell.exec(`kubectl get service ${FUSIONAUTH_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installFusionAuth(verbose :boolean, location = config.setupDir) :boolean {
  if (fusionauthCheck()) return true
  const HELM_VALUES_PATH = location + config.customerOs.fusionauthHelmValues

  shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})
  const fa = shell.exec(`helm install ${FUSIONAUTH_SERVICE} fusionauth/fusionauth -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (fa.code !== 0) {
    error.logError(fa.stderr, 'Unable to complete helm install of fusion auth', true)
    return false
  }

  return true
}
