import * as shell from 'shelljs'
import * as error from './errors'
import * as fs from 'node:fs'
import {getConfig} from '../../config/dev'
import {grabFile} from './deploy'

const config = getConfig()
const NAMESPACE = config.namespace.name
const FUSIONAUTH_SERVICE = 'fusionauth-customer-os'

function fusionauthCheck() :boolean {
  return (shell.exec(`kubectl get service ${FUSIONAUTH_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installFusionAuth(verbose :boolean, location = config.setupDir) :boolean {
  if (fusionauthCheck()) return true
  let cleanup = false
  const HELM_VALUES_PATH = location + config.customerOs.fusionauthHelmValues

  if (!fs.existsSync(HELM_VALUES_PATH)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const remoteFile = config.customerOs.githubPath + config.customerOs.fusionauthHelmValues
    const file = grabFile(remoteFile, HELM_VALUES_PATH, verbose)
    cleanup = true
    if (!file) return false
  }

  shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})
  const fa = shell.exec(`helm install ${FUSIONAUTH_SERVICE} fusionauth/fusionauth -f ${HELM_VALUES_PATH} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (fa.code !== 0) {
    error.logError(fa.stderr, 'Unable to complete helm install of fusion auth', true)
    return false
  }

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
