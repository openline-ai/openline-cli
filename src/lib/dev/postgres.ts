import * as shell from 'shelljs'
import * as error from './errors'
import * as fs from 'node:fs'
import {getConfig} from '../../config/dev'
import {grabFile} from './deploy'

const config = getConfig()
const NAMESPACE = config.namespace.name
const POSTGRESQL_SERVICE = 'postgresql-customer-os-dev'

function postgresqlCheck() :boolean {
  return (shell.exec(`kubectl get service ${POSTGRESQL_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installPostgresql(verbose: boolean, location = config.setupDir) {
  // to do
}

function setupPersistentVolume(verbose: boolean, location = config.setupDir) {
  // to do
  
}

function deployPostgresql(verbose: boolean, location = config.setupDir) {
  if (postgresqlCheck()) return true
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

  // setup PostgreSQL persistent volume
  const pv = shell.exec(`kubectl apply -f ./${SETUP_PATH}/postgresql-persistent-volume.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pv.code !== 0) {
    error.logError(pv.stderr, 'Unable to setup postgreSQL persistent volume', true)
    return false
  }
    
  const pvc = shell.exec(`kubectl apply -f ./${SETUP_PATH}/postgresql-persistent-volume-claim.yaml --namespace ${NAMESPACE}`, {silent: !verbose})
  if (pvc.code !== 0) {
    error.logError(pvc.stderr, 'Unable to setup postgreSQL persistent volume claim', true)
    return false
  }

  // install PostgreSQL
  const postgresql = shell.exec(`helm install --values ./${SETUP_PATH}/postgresql-values.yaml postgresql-customer-os-dev bitnami/postgresql --namespace ${NAMESPACE}`, {silent: !verbose})
  if (postgresql.code !== 0) {
    error.logError(postgresql.stderr, 'Unable to complete helm install of postgresql', true)
    return false
  }

  return true
}
