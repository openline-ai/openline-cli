import {exit} from 'node:process'
import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {logTerminal} from '../logs'

const config = getConfig()
const CLI_RAW_REPO = config.cli.rawRepo

export function namespaceCheck() :boolean {
  const NAMESPACE = config.namespace.name
  return (shell.exec(`kubectl get ns ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNamespace(verbose: boolean, location = config.setupDir) :boolean {
  if (namespaceCheck()) return true
  const NAMESPACE_PATH = CLI_RAW_REPO + config.namespace.file
  const kubeCreateNamespace = `kubectl create -f ${NAMESPACE_PATH}`
  if (verbose) logTerminal('EXEC', kubeCreateNamespace)
  const ns = shell.exec(kubeCreateNamespace, {silent: !verbose})
  if (ns.code !== 0) {
    logTerminal('ERROR', ns.stderr)
    exit(1)
  }

  return true
}
