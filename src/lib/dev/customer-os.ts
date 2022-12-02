import * as shell from 'shelljs'
import * as error from './errors'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'

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

export function installCustomerOsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (customerOsApiCheck()) return true
  const DEPLOYMENT = location + config.customerOs.apiDeployment
  const SERVICE = location + config.customerOs.apiService
  const LOADBALANCER = location + config.customerOs.apiLoadbalancer
  const CUSTOMER_OS_API_IMAGE_NAME = 'customer-os-api'

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  let image: string | null = config.customerOs.apiImage + imageVersion

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server'
    buildLocalImage(buildPath, CUSTOMER_OS_API_IMAGE_NAME, verbose)
    image = null
  }

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
  const MESSAGE_STORE_API_IMAGE_NAME = 'message-store'

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  if (location !== config.setupDir) {
    const buildPath = location + '/packages/server'
    buildLocalImage(buildPath, MESSAGE_STORE_API_IMAGE_NAME, verbose)
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

export function pingCustomerOsApi() :boolean {
  return shell.exec('curl localhost:10000/health', {silent: true}).code === 0
}

export function pingMessageStoreApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 9009', {silent: true}).code === 0
}
