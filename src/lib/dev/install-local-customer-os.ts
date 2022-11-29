import * as shell from 'shelljs'
import * as error from './errors'

const K8S_NAMESPACE_NAME = 'openline'

/* HELM config files */
const HELM_CONFIGS_PATH = '/deployment/infra/helm/'
const FUSION_AUTH_VALUES = HELM_CONFIGS_PATH + 'fusionauth/fusionauth-values.yaml'
const NEO4J_VALUES = HELM_CONFIGS_PATH + 'neo4j/neo4j-values.yaml'
const POSTGRES_VALUES = HELM_CONFIGS_PATH + 'postgresql/postgresql-values.yaml'

/* K8s config files */
const K8S_CONFIGS_PATH = '/deployment/infra/k8s/'
const K8S_NAMESPACE_SETTINGS = K8S_CONFIGS_PATH + 'openline-namespace.json'

const POSTGRES_PERSISTENT_VOLUME = K8S_CONFIGS_PATH + 'postgresql-persistent-volume.yaml'
const POSTGRES_PERSISTENT_VOLUME_CLAIM = K8S_CONFIGS_PATH + 'postgresql-persistent-volume-claim.yaml'

const K8S_COSTUMER_OS_API_APP_SETTINGS = K8S_CONFIGS_PATH + 'customer-os-api.yaml'
const K8S_COSTUMER_OS_API_SERVICE_SETTINGS = K8S_CONFIGS_PATH + 'customer-os-api-k8s-service.yaml'
const K8S_COSTUMER_OS_API_LOAD_BALANCER = K8S_CONFIGS_PATH + 'customer-os-api-k8s-loadbalancer-service.yaml'

/* Apps Locations */
const CUSTOMER_OS_API_INTERNAL_PATH = '/packages/server/customer-os-api'

export function installLocalCustomerOs(location: string, verbose :boolean) :boolean {
  // add helm repos
  shell.exec('helm repo add bitnami https://charts.bitnami.com/bitnami', {silent: !verbose})
  shell.exec('helm repo add neo4j https://helm.neo4j.com/neo4j', {silent: !verbose})
  shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})

  if (!installK8SNamespace(verbose, location)) return false
  if (!installNeo4j(verbose, location)) return false
  if (!installPostgres(verbose, location)) return false
  if (!installFusionAuth(verbose, location)) return false
  if (!installCustomerOsAPIApp(verbose, location)) return false

  shell.exec('cat ' + location + FUSION_AUTH_VALUES)
  return true
}

function installCustomerOsAPIApp(verbose: boolean, location:string) {
  // deploy customerOS API container image

  const CUSTOMER_OS_API_APP_LOCATION = location + CUSTOMER_OS_API_INTERNAL_PATH
  shell.exec(`echo ${CUSTOMER_OS_API_APP_LOCATION}  docker build -t customer-os-api .`, {silent: !verbose})
  const customerOsBuildExecution = shell.exec(`cd  | docker build -t customer-os-api -f ${CUSTOMER_OS_API_APP_LOCATION}/Dockerfile ${CUSTOMER_OS_API_APP_LOCATION}`, {silent: !verbose})

  if (customerOsBuildExecution.code !== 0) {
    error.logError(customerOsBuildExecution.stderr, `Unable to build image in ${CUSTOMER_OS_API_APP_LOCATION}`, true)
    return false
  }

  const CUSTOMER_OS_K8S_SETTINGS = location + K8S_COSTUMER_OS_API_APP_SETTINGS
  const cosDeploy = shell.exec(`kubectl apply -f ${CUSTOMER_OS_K8S_SETTINGS} --namespace ${K8S_NAMESPACE_NAME}`, {silent: !verbose})
  if (cosDeploy.code !== 0) {
    error.logError(cosDeploy.stderr, 'Unable to deploy customerOS API', true)
    return false
  }

  const CUSTOMER_OS_SERVICE_K8S_SETTINGS = location + K8S_COSTUMER_OS_API_SERVICE_SETTINGS
  const cosService = shell.exec(`kubectl apply -f ${CUSTOMER_OS_SERVICE_K8S_SETTINGS} --namespace ${K8S_NAMESPACE_NAME}`, {silent: !verbose})
  if (cosService.code !== 0) {
    error.logError(cosService.stderr, 'Unable to deploy customerOS API', true)
    return false
  }

  const CUSTOMER_OS_LOAD_BALANCER_K8S_SETTINGS = location + K8S_COSTUMER_OS_API_LOAD_BALANCER
  const cosLoad = shell.exec(`kubectl apply -f ${CUSTOMER_OS_LOAD_BALANCER_K8S_SETTINGS} --namespace ${K8S_NAMESPACE_NAME}`, {silent: !verbose})
  if (cosLoad.code !== 0) {
    error.logError(cosLoad.stderr, 'Unable to deploy customerOS API', true)
    return false
  }

  return true
}

function installPostgres(verbose: boolean, location:string) {
  const POSTGRES_PERSISTENT_VOLUME_LOCATION = location + POSTGRES_PERSISTENT_VOLUME
  const persistentVolumeInstallation = shell.exec(
    `kubectl apply -f ${POSTGRES_PERSISTENT_VOLUME_LOCATION} --namespace ${K8S_NAMESPACE_NAME}`,
    {silent: !verbose},
  )

  if (persistentVolumeInstallation.code !== 0) {
    error.logError(persistentVolumeInstallation.stderr, 'Unable to setup postgreSQL persistent volume', true)
    return false
  }

  const POSTGRES_PERSISTENT_VOLUME_CLAIM_LOCATION = location + POSTGRES_PERSISTENT_VOLUME_CLAIM
  const persistentVolumeClaimInstallation = shell.exec(
    `kubectl apply -f ${POSTGRES_PERSISTENT_VOLUME_CLAIM_LOCATION} --namespace ${K8S_NAMESPACE_NAME}`,
    {silent: !verbose},
  )
  if (persistentVolumeClaimInstallation.code !== 0) {
    error.logError(persistentVolumeClaimInstallation.stderr, 'Unable to setup postgreSQL persistent volume claim', true)
    return false
  }

  const POSTGRES_VALUES_LOCATION = location + POSTGRES_VALUES
  const postgresqlInstallation = shell.exec(
    `helm install --values ${POSTGRES_VALUES_LOCATION} postgresql-customer-os-dev bitnami/postgresql --namespace ${K8S_NAMESPACE_NAME}`,
    {silent: !verbose},
  )
  if (postgresqlInstallation.code !== 0) {
    error.logError(postgresqlInstallation.stderr, 'Unable to complete helm install of postgresql', true)
    return false
  }

  return true
}

function installNeo4j(verbose: boolean, location:string) {
  const NEO4J_SETTINGS_PATH = location + NEO4J_VALUES
  const neo4jInstallation = shell.exec(
    `helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f ${NEO4J_SETTINGS_PATH} --namespace ${K8S_NAMESPACE_NAME}`,
    {silent: !verbose},
  )
  if (neo4jInstallation.code !== 0) {
    error.logError(neo4jInstallation.stderr, 'Unable to complete helm install of neo4j-standalone', true)
    return false
  }

  return true
}

function installK8SNamespace(verbose:boolean, location:string) :boolean {
  if (shell.exec(`kubectl get ns ${K8S_NAMESPACE_NAME}`, {silent: true}).code === 0) {
    return true
  }

  const NAMESPACE_PATH = location + K8S_NAMESPACE_SETTINGS
  const namespaceInstallation = shell.exec('kubectl create -f ' + NAMESPACE_PATH, {silent: !verbose})
  if (namespaceInstallation.code !== 0) {
    error.logError(namespaceInstallation.stderr, 'Unable to create namespace from' + NAMESPACE_PATH, true)
    return false
  }

  return true
}

function installFusionAuth(verbose :boolean, location:string) :boolean {
  const FUSION_AUTH_VALUES_LOCATION = location + FUSION_AUTH_VALUES
  shell.exec('helm repo add fusionauth https://fusionauth.github.io/charts', {silent: !verbose})
  const fa = shell.exec(`helm install fusionauth-customer-os fusionauth/fusionauth -f ${FUSION_AUTH_VALUES_LOCATION} --namespace ${K8S_NAMESPACE_NAME}`, {silent: !verbose})
  if (fa.code !== 0) {
    error.logError(fa.stderr, 'Unable to complete helm install of fusion auth', true)
    return false
  }

  return true
}
