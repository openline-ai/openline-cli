import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import * as error from './errors'

const config = getConfig()

export function namespaceCheck() :boolean {
  const NAMESPACE = config.namespace.name
  return (shell.exec(`kubectl get ns ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNamespace(verbose: boolean, location = config.setupDir) :boolean {
  if (namespaceCheck()) return true
  const NAMESPACE_PATH = location + config.namespace.file
  const kubeCreateNamespace = `kubectl create -f ${NAMESPACE_PATH}`
  if (verbose) console.log(`[EXEC] ${kubeCreateNamespace}`)
  const ns = shell.exec(kubeCreateNamespace, {silent: !verbose})
  if (ns.code !== 0) {
    error.logError(ns.stderr, `Unable to create namespace from ${NAMESPACE_PATH}`, true)
    return false
  }

  return true
}
