import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, updateImageTag, Yaml} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'
import {waitForFileToBeDownloaded} from "../../helpers/downloadChecker";

const config = getConfig()
const NAMESPACE = config.namespace.name
const CUSTOMER_OS_API = 'customer-os-api-service'
const SETTING_API = 'settings-api-service'
const FILE_STORAGE_API = 'file-store-api-service'
const EVENTS_PROCESSING_PLATFORM = 'events-processing-platform-service'
const COMMS_API = 'comms-api-service'
const VALIDATION_API = 'validation-api-service'
const USER_ADMIN_API = 'user-admin-api-service'
const CUSTOMER_OS_WEBHOOKS = 'customer-os-webhooks-service'
const CLI_RAW_REPO = config.cli.rawRepo


function customerOsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CUSTOMER_OS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function settingsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${SETTING_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function fileStoreApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${FILE_STORAGE_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}
function eventsProcessingPlatformCheck() :boolean {
  return (shell.exec(`kubectl get service ${EVENTS_PROCESSING_PLATFORM} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function commsApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${COMMS_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function validationApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${VALIDATION_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

function userAdminApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${USER_ADMIN_API} -n ${NAMESPACE}`, {silent: true}).code === 0)
}
function webhooksApiCheck() :boolean {
  return (shell.exec(`kubectl get service ${CUSTOMER_OS_WEBHOOKS} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installCustomerOsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (customerOsApiCheck()) {
    logTerminal('SUCCESS', 'customer-os-api already running')
    return true
  }

  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.apiDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.apiService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.apiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.customerOs.apiImage + imageVersion

  if (location !== config.setupDir) {
    // Need to come back to this after we standardize Dockerfiles
    const buildPath = CLI_RAW_REPO + '/packages/server/customer-os-api'

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

  logTerminal('SUCCESS', 'customer-os-api successfully installed')
  return true
}

export function installSettingsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (settingsApiCheck()) {
    logTerminal('SUCCESS', 'settings-api already running')
    return true
  }
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.settingsDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.settingsService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.settingsLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.settingsImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/settings-api'
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
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.fileStoreDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.fileStoreService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.fileStoreLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.fileStoreImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/file-store-api'
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
export function installEventsProcessingPlatform(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (eventsProcessingPlatformCheck()) {
    logTerminal('SUCCESS', 'events-processing-platform already running')
    return true
  }
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.eventsProcessingPlatformDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.eventsProcessingPlatformService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.eventsProcessingPlatformLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.eventsProcessingPlatformImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/events-processing-platform'
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

  logTerminal('SUCCESS', 'events-processing-platform successfully installed')
  return true
}

export function installCommsApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (commsApiCheck()) return true
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.commsApiDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.commsApiService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.commsApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.customerOs.commsApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = CLI_RAW_REPO + '/packages/server/comms-api'
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

  logTerminal('SUCCESS', 'comms-api successfully installed')
  return true
}

export function installValidationApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (validationApiCheck()) {
    logTerminal('SUCCESS', 'validation-api already running')
    return true
  }
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.validationApiDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.validationApiService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.validationApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.validationApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/validation-api'
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

  logTerminal('SUCCESS', 'validation-api successfully installed')
  return true
}

export function installUserAdminApi(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (userAdminApiCheck()) {
    logTerminal('SUCCESS', 'user-admin-api already running')
    return true
  }
  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.userAdminApiDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.userAdminApiService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.userAdminApiLoadbalancer
  const SECRETS = CLI_RAW_REPO + config.customerOs.userAdminApiSecrets

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.userAdminApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/user-admin-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath + '/../', imageName: image, verbose })
    if (build === false) return false
    image = null
  }
  const secretsFilename = waitForFileToBeDownloaded(SECRETS, verbose);

  shell.exec(`bash ${secretsFilename}`, {silent: false})
  const kubeApplySecretsConfig = `kubectl apply -f user-admin-api-secret.yaml --namespace ${NAMESPACE}`
  if (verbose) logTerminal('EXEC', kubeApplySecretsConfig)
  shell.exec(kubeApplySecretsConfig, {silent: !verbose})

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'user-admin-api successfully installed')
  return true
}
export function installWebhooks(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (webhooksApiCheck()) {
    logTerminal('SUCCESS', 'customer-os-webhooks already running')
    return true
  }

  const DEPLOYMENT = CLI_RAW_REPO + config.customerOs.webhooksDeployment
  const SERVICE = CLI_RAW_REPO + config.customerOs.webhooksService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.webhooksLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.fileStoreImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = CLI_RAW_REPO + '/packages/server/customer-os-webhooks'
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

  logTerminal('SUCCESS', 'customer-os-webhooks successfully installed')
  return true
}

export function waitForUserAdminAppPodToBeReady(verbose:boolean) {
  if (verbose) logTerminal('INFO', 'Waiting for user-admin-api pod to reach the Running state')
  let userAdminApiPodName
  do {
    userAdminApiPodName = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep user-admin-api`, {silent: true})
      .stdout
      .split(/\r?\n/)
      .filter(Boolean);
  } while (userAdminApiPodName.length < 1)
  if (verbose) logTerminal('SUCCESS', 'user-admin-api pod exists')

  let userAdminApiPodStatus;
  do {
    userAdminApiPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${userAdminApiPodName[0]} -o jsonpath='{.status.phase}'`, {silent: true})
    shell.exec('sleep 2')
  } while (userAdminApiPodStatus == "Pending")
  if (verbose) logTerminal('SUCCESS', 'user-admin-api pod status is not Pending anymore')

  let userAdminApiReadyStatus;
  do {
    userAdminApiReadyStatus = shell.exec(`kubectl -n ${NAMESPACE} logs ${userAdminApiPodName[0]}`, {silent: true})
    shell.exec('sleep 2')
  } while (!userAdminApiReadyStatus.includes("Listening and serving HTTP on :4001"))
  if (verbose) logTerminal('SUCCESS', 'user-admin-api pod is Running')
}

export function waitForCustomerOsApiPodToBeReady(verbose:boolean) {
  if (verbose) logTerminal('INFO', 'Waiting for customer-os-api pod to reach the Running state')
  let customerOsApiPodName
  do {
    customerOsApiPodName = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep customer-os-api`, {silent: true})
      .stdout
      .split(/\r?\n/)
      .filter(Boolean);
  } while (customerOsApiPodName.length < 1)
  if (verbose) logTerminal('SUCCESS', 'customer-os-api pod exists')

  let customerOsApiPodStatus;
  do {
    customerOsApiPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${customerOsApiPodName[0]} -o jsonpath='{.status.phase}'`, {silent: true})
    shell.exec('sleep 2')
  } while (customerOsApiPodStatus == "Pending")
  if (verbose) logTerminal('SUCCESS', 'customer-os-api pod status is not Pending anymore')

  let customerOsApiReadyStatus;
  do {
    customerOsApiReadyStatus = shell.exec(`kubectl -n ${NAMESPACE} logs ${customerOsApiPodName[0]}`, {silent: true})
    shell.exec('sleep 2')
  } while (!customerOsApiReadyStatus.includes("Listening and serving HTTP on :10000"))
  if (verbose) logTerminal('SUCCESS', 'customer-os-api pod is Running')
}

export function waitForEventsProcessingPlatformPodToBeReady(verbose:boolean) {
  if (verbose) logTerminal('INFO', 'Waiting for events-processing-platform pod to reach the Running state')
  let eventsProcessingPlatformPodName
  let restarts = 0
  do {
    eventsProcessingPlatformPodName = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep events-processing-platform`, {silent: true})
      .stdout
      .split(/\r?\n/)
      .filter(Boolean);
  } while (eventsProcessingPlatformPodName.length < 1)
  if (verbose) logTerminal('SUCCESS', 'events-processing-platform pod exists')

  let eventsProcessingPlatformPodStatus;
  do {
    eventsProcessingPlatformPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${eventsProcessingPlatformPodName[0]} -o jsonpath='{.status.phase}'`, {silent: true})
    shell.exec('sleep 2')
  } while (eventsProcessingPlatformPodStatus == "Pending")
  if (verbose) logTerminal('SUCCESS', 'events-processing-platform pod status is not Pending anymore')

  let eventsProcessingPlatformPodLogs;
  do {
    eventsProcessingPlatformPodLogs = shell.exec(`kubectl -n ${NAMESPACE} logs ${eventsProcessingPlatformPodName[0]}`, {silent: true})
    shell.exec('sleep 2')
  } while (!eventsProcessingPlatformPodLogs.includes("gRPC Server is listening on port"))
  if (verbose) logTerminal('SUCCESS', 'events-processing-platform pod is Running')
}

export function pingCustomerOsApi() :boolean {
  return shell.exec('curl localhost:10000/health', {silent: true}).code === 0
}

export function pingSettingsApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 10002', {silent: true}).code === 0
}

export function pingfileStoreApi() :boolean {
  return shell.exec('nc -zv -w5 localhost 10001', {silent: true}).code === 0
}

export function pingEventsStoreDb() :boolean {
  return shell.exec('nc -zv -w5 localhost 2113', {silent: true}).code === 0
}

export function pingEventsProcessingPlatform() :boolean {
  return shell.exec('nc -zv -w5 localhost 5001', {silent: true}).code === 0
}

export function pingJaeger() :boolean {
  return shell.exec('curl http://localhost:16686/health', {silent: true}).code === 0
}

export function pingCommsApi() :boolean {
  return shell.exec('curl localhost:8013/health', {silent: true}).code === 0
}

export function pingValidationApi() :boolean {
  return shell.exec('curl localhost:10003/health', {silent: true}).code === 0
}

export function pingUserAdminApi() :boolean {
  return shell.exec('curl localhost:4001/health', {silent: true}).code === 0
}

export function pingCustomerOsWebhooks() :boolean {
  return shell.exec('curl localhost:10004/health', {silent: true}).code === 0
}
