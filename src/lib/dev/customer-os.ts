import * as shell from 'shelljs'
import * as error from './errors'
import * as fs from 'node:fs'
import {getConfig} from '../../config/dev'
import {grabFile, updateImageTag} from './deploy'
import {deployImage, Yaml} from './deploy'

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
  let cleanup = false
  const DEPLOYMENT = location + config.customerOs.apiDeployment
  const SERVICE = location + config.customerOs.apiService
  const LOADBALANCER = location + config.customerOs.apiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion, verbose)
    if (!tag) return false
  }

  if (!fs.existsSync(DEPLOYMENT)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const deployFile = config.customerOs.githubPath + config.customerOs.apiDeployment
    const f1 = grabFile(deployFile, DEPLOYMENT, verbose)

    const serviceFile = config.customerOs.githubPath + config.customerOs.apiService
    const f2 = grabFile(serviceFile, SERVICE, verbose)

    const lbFile = config.customerOs.githubPath + config.customerOs.apiLoadbalancer
    const f3 = grabFile(lbFile, LOADBALANCER, verbose)

    cleanup = true
    if (!f1 || !f2 || !f3) return false
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

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}

export function installMessageStoreApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (messageStoreApiCheck()) return true
  let cleanup = false
  const DEPLOYMENT = location + config.customerOs.messageStoreDeployment
  const SERVICE = location + config.customerOs.messageStoreService
  const LOADBALANCER = location + config.customerOs.messageStoreLoadbalancer

  if (!fs.existsSync(DEPLOYMENT)) {
    const mkdir = shell.exec(`mkdir ${location}`, {silent: true})
    if (mkdir.code !== 0) return false

    const deployFile = config.customerOs.githubPath + config.customerOs.messageStoreDeployment
    const f1 = grabFile(deployFile, DEPLOYMENT, verbose)

    const serviceFile = config.customerOs.githubPath + config.customerOs.messageStoreService
    const f2 = grabFile(serviceFile, SERVICE, verbose)

    const lbFile = config.customerOs.githubPath + config.customerOs.messageStoreLoadbalancer
    const f3 = grabFile(lbFile, LOADBALANCER, verbose)

    cleanup = true
    if (!f1 || !f2 || !f3) return false
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

  if (cleanup) {
    shell.exec(`rm -r ${config.setupDir}`)
  }

  return true
}
