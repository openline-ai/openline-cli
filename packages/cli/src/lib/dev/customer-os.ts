import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {deployImage, Yaml, updateImageTag} from './deploy'
import {buildLocalImage} from './build-image'
import {logTerminal} from '../logs'
import FormData from "form-data";
import axios from "axios";

const config = getConfig()
const NAMESPACE = config.namespace.name
const CUSTOMER_OS_API = 'customer-os-api-service'
const SETTING_API = 'settings-api-service'
const FILE_STORAGE_API = 'file-store-api-service'
const EVENTS_PROCESSING_PLATFORM = 'events-processing-platform-service'
const COMMS_API = 'comms-api-service'
const VALIDATION_API = 'validation-api-service'
const USER_ADMIN_API = 'user-admin-api-service'


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

  let image: string | null  = config.customerOs.fileStoreImage + imageVersion

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
export function installEventsProcessingPlatform(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  if (eventsProcessingPlatformCheck()) {
    logTerminal('SUCCESS', 'events-processing-platform already running')
    return true
  }
  const DEPLOYMENT = location + config.customerOs.eventsProcessingPlatformDeployment
  const SERVICE = location + config.customerOs.eventsProcessingPlatformService
  const LOADBALANCER = location + config.customerOs.eventsProcessingPlatformLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.eventsProcessingPlatformImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/events-processing-platform'
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
  const DEPLOYMENT = location + config.customerOs.commsApiDeployment
  const SERVICE = location + config.customerOs.commsApiService
  const LOADBALANCER = location + config.customerOs.commsApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null = config.customerOs.commsApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this when Dockerfiles are standardized
    const buildPath = location + '/packages/server/comms-api'
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
  const DEPLOYMENT = location + config.customerOs.validationApiDeployment
  const SERVICE = location + config.customerOs.validationApiService
  const LOADBALANCER = location + config.customerOs.validationApiLoadbalancer

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.validationApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/validation-api'
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
  const DEPLOYMENT = location + config.customerOs.userAdminApiDeployment
  const SERVICE = location + config.customerOs.userAdminApiService
  const LOADBALANCER = location + config.customerOs.userAdminApiLoadbalancer
  const SECRETS = location + config.customerOs.userAdminApiSecrets

  if (imageVersion.toLowerCase() !== 'latest') {
    const tag = updateImageTag([DEPLOYMENT], imageVersion)
    if (!tag) return false
  }

  let image: string | null  = config.customerOs.userAdminApiImage + imageVersion

  if (location !== config.setupDir) {
    // come back to this
    const buildPath = location + '/packages/server/user-admin-api'
    const build = buildLocalImage({ path: buildPath, context: buildPath + '/../', imageName: image, verbose })
    if (build === false) return false
    image = null
  }

  shell.exec(`bash ${SECRETS}`, {silent: false})
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

  let userAdminApiOutput = []
  let retry = 1
  const maxAttempts = config.server.timeOuts / 2

  const userAdminApiPodName = shell.exec(`kubectl -n ${NAMESPACE} get pods --no-headers -o custom-columns=":metadata.name" | grep user-admin-api`, {silent: true})
    .stdout
    .split(/\r?\n/)
    .filter(Boolean);

  let userAdminApiPodStatus;
  do {
    userAdminApiPodStatus = shell.exec(`kubectl -n ${NAMESPACE} get pod ${userAdminApiPodName[0]} -o jsonpath='{.status.phase}'`)
    shell.exec('sleep 2')
    logTerminal('INFO', `UserAdminApi Pod Status >>>>>>>>>>> ` + userAdminApiPodStatus)
  } while (userAdminApiPodStatus == "Pending")

  let userAdminApiReadyStatus;
  do {
    userAdminApiReadyStatus = shell.exec(`kubectl -n ${NAMESPACE} logs ${userAdminApiPodName[0]}`, {silent: true})
    shell.exec('sleep 2')
    logTerminal('INFO', `UserAdminApi Ready Status >>>>>>>>>>> ` + userAdminApiReadyStatus.includes("Listening and serving HTTP on :4001"))
  } while (!userAdminApiReadyStatus.includes("Listening and serving HTTP on :4001"))
  const axios = require('axios');

  logTerminal('INFO', `>>>>>>>>>>>>>> Finished waiting <<<<<<<<<<<<<<`)


  const FormData = require('form-data');
  const fs = require('fs');

  const url = 'http://127.0.0.1:4001/demo-tenant';
  const headers = {
    'X-Openline-Api-Key': 'cad7ccb6-d8ff-4bae-a048-a42db33a217e',
    'TENANT_NAME': 'openline',
    'MASTER_USERNAME': 'development@openline.ai',
  };

  const form = new FormData();

// Fetch the JSON data from the URL
  axios.get('https://raw.githubusercontent.com/openline-ai/openline-cli/otter/resources/demo-tenant.json')
    .then((response: import('axios').AxiosResponse) => {
      // Append the fetched data to the form
      form.append('file', Buffer.from(JSON.stringify(response.data)), {
        filename: 'demo-tenant.json',
        contentType: 'application/json',
      });
      return axios({
        method: 'get',
        url,
        headers,
        data: form,
        maxRedirects: 0,
      });
    })
    .then((response: import('axios').AxiosResponse) => {
      console.log('Response:', response.data);
    })
    .catch((error: Error) => {
      console.error('Error:', error.message);
    });

  logTerminal('SUCCESS', 'user-admin-api successfully installed')
  return true
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
