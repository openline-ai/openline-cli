import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CUSTOMER_OS_API = 'customer-os-api-service'
const MESSAGE_STORE_API = 'message-store-service'

function customerOsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CUSTOMER_OS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function messageStoreApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${MESSAGE_STORE_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function buildLocalImage(path: string, imageName: string, verbose: boolean) :boolean {
  shell.exec(`echo ${path}  docker build -t ${imageName} .`, {silent: !verbose})
  const buildExecution = shell.exec(`cd  | docker build -t ${imageName} -f ${path}/Dockerfile ${path}`, {silent: !verbose})
  if (buildExecution.code !== 0) {
    error.logError(buildExecution.stderr, `Unable to build image in ${path}`, true)
    return false
  }

  return true
}

export function installCustomerOsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (customerOsApiCheck()) return true
  const DEPLOYMENT = location + config.customerOs.apiDeployment
  const SERVICE = location + config.customerOs.apiService
  const LOADBALANCER = location + config.customerOs.apiLoadbalancer
  const CUSTOMER_OS_API_NAME = 'customer-os-api'

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server/customer-os-api'
    buildLocalImage(buildPath, CUSTOMER_OS_API_NAME, verbose)
  }

  const image = config.customerOs.apiImage + imageVersion
  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy customerOS API', true)
    return false
  }

  return true
}

export function installMessageStoreApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (messageStoreApiCheck()) return true
  const DEPLOYMENT = location + config.customerOs.messageStoreDeployment
  const SERVICE = location + config.customerOs.messageStoreService
  const LOADBALANCER = location + config.customerOs.messageStoreLoadbalancer
  const MESSAGE_STORE_API_NAME = 'message-store'

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server/message-store'
    buildLocalImage(buildPath, MESSAGE_STORE_API_NAME, verbose)
  }

  const image = config.customerOs.messageStoreImage + imageVersion
  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) {
    error.logError('Error loading image', 'Unable to deploy message store API', true)
    return false
  }

  return true
}
