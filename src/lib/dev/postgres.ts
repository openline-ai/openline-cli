import * as shell from 'shelljs'
import * as error from './errors'
import * as fs from 'node:fs'
import {getConfig} from '../../config/dev'
import {grabFile} from './deploy'

const config = getConfig()
const NAMESPACE = config.namespace.name
const POSTGRESQL_SERVICE = 'postgresql-customer-os-dev'
const PERSISTENT_VOLUME = 'postgresql-customer-os-data'
const PERSISTENT_VOLUME_CLAIM = 'efs-postgresql-claim'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${POSTGRESQL_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function postgresqlPersistentVolumeCheck() :boolean {
  return (shell.exec(`kubectl get pv ${PERSISTENT_VOLUME} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function postgresqlPersistentVolumeClaimCheck() :boolean {
  return (shell.exec(`kubectl get pvc ${PERSISTENT_VOLUME_CLAIM} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installPostgresql(verbose: boolean, location = config.setupDir) :boolean {
  if (!setupPersistentVolume(verbose, location)) return false
  if (!setupPersistentVolumeClaim(verbose, location)) return false
  if (!deployPostgresql(verbose, location)) return false
  return true
}

function setupPersistentVolume(verbose: boolean, location = config.setupDir) : boolean {
  if (postgresqlPersistentVolumeCheck()) return true
  const PERSISTENT_VOLUME_PATH = location + config.customerOs.postgresqlPersistentVolume
  let cleanup = false

  if (!fs.existsSync(PERSISTENT_VOLUME_PATH)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const remoteFile = config.customerOs.githubPath + config.customerOs.postgresqlPersistentVolume
    const file = grabFile(remoteFile, PERSISTENT_VOLUME_PATH, verbose)
    cleanup = true
    if (!file) return false
  }

  const pv = shell.exec(`kubectl apply -f ${PERSISTENT_VOLUME_PATH} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pv.code !== 0) {
    error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume', true)
    return false
  }

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}

function setupPersistentVolumeClaim(verbose: boolean, location = config.setupDir) :boolean {
  if (postgresqlPersistentVolumeClaimCheck()) return true
  const PERSISTENT_VOLUME_CLAIM_PATH = location + config.customerOs.postgresqlPersistentVolumeClaim
  let cleanup = false

  if (!fs.existsSync(PERSISTENT_VOLUME_CLAIM_PATH)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const remoteFile = config.customerOs.githubPath + config.customerOs.postgresqlPersistentVolumeClaim
    const file = grabFile(remoteFile, PERSISTENT_VOLUME_CLAIM_PATH, verbose)
    cleanup = true
    if (!file) return false
  }

  const pvc = shell.exec(`kubectl apply -f ${PERSISTENT_VOLUME_CLAIM_PATH} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pvc.code !== 0) {
    error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim', true)
    return false
  }

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}

function deployPostgresql(verbose: boolean, location = config.setupDir) {
  if (postgresqlServiceCheck()) return true
  let cleanup = false
  const HELM_VALUES_PATH = location + config.customerOs.postgresqlHelmValues

  if (!fs.existsSync(HELM_VALUES_PATH)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const remoteFile = config.customerOs.githubPath + config.customerOs.postgresqlHelmValues
    const file = grabFile(remoteFile, HELM_VALUES_PATH, verbose)
    cleanup = true
    if (!file) return false
  }

  shell.exec('helm repo add bitnami https://charts.bitnami.com/bitnami', {silent: !verbose})
  const postgresql = shell.exec(`helm install --values ${HELM_VALUES_PATH} ${POSTGRESQL_SERVICE} bitnami/postgresql --namespace ${NAMESPACE}`, {silent: !verbose})
  if (postgresql.code !== 0) {
    error.logError(postgresql.stderr, 'Unable to complete helm install of postgresql', true)
    return false
  }

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
