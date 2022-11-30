import * as shell from 'shelljs'
import * as fs from 'node:fs'
import {getConfig} from '../../config/dev'
import {grabFile} from './deploy'
import * as error from './errors'

const config = getConfig()

export function namespaceCheck() :boolean {
  const NAMESPACE = config.namespace.name
  return (shell.exec(`kubectl get ns ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installNamespace(verbose: boolean, location = config.setupDir) :boolean {
  if (namespaceCheck()) return true
  let cleanup = false
  const NAMESPACE_PATH = location + config.namespace.file

  if (!fs.existsSync(NAMESPACE_PATH)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const remoteFile = config.customerOs.githubPath + config.namespace.file
    const file = grabFile(remoteFile, NAMESPACE_PATH, verbose)
    cleanup = true
    if (!file) return false
  }

  const ns = shell.exec(`kubectl create -f ./${NAMESPACE_PATH}`, {silent: !verbose})
  if (ns.code !== 0) {
    error.logError(ns.stderr, `Unable to create namespace from ./${NAMESPACE_PATH}`, true)
    return false
  }

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
