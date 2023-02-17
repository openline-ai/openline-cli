import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'

const config = getConfig()
const NAMESPACE = config.namespace.name
const CUSTOMER_OS_API = 'customer-os-api-service'
const MESSAGE_STORE_API = 'message-store-api-service'
const SETTING_API = 'settings-api-service'
const FILE_STORAGE_API = 'file-store-api-service'

function customerOsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CUSTOMER_OS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function messageStoreApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${MESSAGE_STORE_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function settingsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${SETTING_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function fileStoreApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${FILE_STORAGE_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installCustomerOsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (customerOsApiCheck()) {
    logTerminal('SUCCESS', 'customer-os-api already running')
    return true
  }

  const DEPLOYMENT = location + config.customerOs.apiDeployment
  const SERVICE = location + config.customerOs.apiService
  const LOADBALANCER = location + config.customerOs.apiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.customerOs.apiImage + imageVersion

  if (location !== config.setupDir) {
    // Need to come back to this after we standardize Dockerfiles
    const buildPath = location + '/packages/server/customer-os-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath, imageName: image, verbose })
    if (build === false) return false
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'customer-os-api successfully installed')
  return true
}

export function installMessageStoreApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (messageStoreApiCheck()) {
    logTerminal('SUCCESS', 'message-store-api already running')
    return true
  }
  const DEPLOYMENT = location + config.customerOs.messageStoreDeployment
  const SERVICE = location + config.customerOs.messageStoreService
  const LOADBALANCER = location + config.customerOs.messageStoreLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.messageStoreImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/message-store-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath + '/../', imageName: image, verbose })
    if (build === false) return false
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'message-store-api successfully installed')
  return true
}

export function installSettingsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (settingsApiCheck()) {
    logTerminal('SUCCESS', 'settings-api already running')
    return true
  }
  const DEPLOYMENT = location + config.customerOs.settingsDeployment
  const SERVICE = location + config.customerOs.settingsService
  const LOADBALANCER = location + config.customerOs.settingsLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.settingsImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/settings-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath + '/../', imageName: image, verbose })
    if (build === false) return false
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'settings-api successfully installed')
  return true
}

export function installfileStoreApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (fileStoreApiCheck()) {
    logTerminal('SUCCESS', 'file-store-api already running')
    return true
  }
  const DEPLOYMENT = location + config.customerOs.fileStoreDeployment
  const SERVICE = location + config.customerOs.fileStoreService
  const LOADBALANCER = location + config.customerOs.fileStoreLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.settingsImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/file-store-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath + '/../', imageName: image, verbose })
    if (build === false) return false
    image = null
  }

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'file-store-api successfully installed')
  return true
}

export function pingCustomerOsApi() :boolean {
  return shell.exec('curl localhost:10000/health', {silent: true}).code === 0
}

export function pingMessageStoreApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 9009', {silent: true}).code === 0
}

export function pingSettingsApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 10002', {silent: true}).code === 0
}

export function pingfileStoreApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 10001', {silent: true}).code === 0
}
