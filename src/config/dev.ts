
export function getConfig() :any {
  const config: any = {}

  // Dev server resource config
  config.server = {}
  config.server.cpu = 2
  config.server.disk = 30
  config.server.memory = 4
  config.server.timeOuts = 600 // seconds

  // Contacts App config
  config.contacts = {}
  // Contacts GUI
  config.contacts.guiImage = 'ghcr.io/openline-ai/openline-contacts/contacts-api:'
  config.contacts.guiDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-contacts/otter/deployment/infra/k8s/contacts-gui-deployment.yaml'
  config.contacts.guiService = 'https://raw.githubusercontent.com/openline-ai/openline-contacts/otter/deployment/infra/k8s/contacts-gui-service.yaml'
  config.contacts.guiLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-contacts/otter/deployment/infra/k8s/contacts-gui-loadbalancer.yaml'
  config.contacts.repo = 'https://github.com/openline-ai/openline-contacts.git'

  // customerOS config
  config.customerOs = {}
  config.customerOs.namespace = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/openline-namespace.json'
  // customerOS analytics API
  config.customerOs.analyticsApiImage = 'ghcr.io/openline-ai/openline-customer-os/analytics-api:'
  // customerOS API
  config.customerOs.apiImage = 'ghcr.io/openline-ai/openline-customer-os/customer-os-api:'
  config.customerOs.apiDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/customer-os-api.yaml'
  config.customerOs.apiService = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/customer-os-api-k8s-service.yaml'
  config.customerOs.apiLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/customer-os-api-k8s-loadbalancer-service.yaml'
  // customerOS message store API
  config.customerOs.messageStoreImage = 'ghcr.io/openline-ai/openline-customer-os/message-store:'
  config.customerOs.messageStoreDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/message-store.yaml'
  config.customerOs.messageStoreService = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/message-store-k8s-service.yaml'
  config.customerOs.messageStoreLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/message-store-k8s-loadbalancer-service.yaml'
  // customerOS postgreSQL DB
  config.customerOs.postgresqlPersistentVolume = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/postgresql-persistent-volume.yaml'
  config.customerOs.postgresqlPersistentVolumeClaim = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/k8s/postgresql-persistent-volume-claim.yaml'
  config.customerOs.postgresqlHelmValues = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/helm/postgresql/postgresql-values.yaml'
  config.customerOs.postgresqlSetup = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/postgresql/setup.sql'
  // customerOS Neo4j DB
  config.customerOs.neo4jHelmValues = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/helm/neo4j/neo4j-values.yaml'
  config.customerOs.neo4jCypher = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/packages/server/customer-os-api/customer-os.cypher'
  config.customerOs.neo4jProvisioning = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/neo4j/provision-neo4j.sh'
  // customerOS FusionAuth
  config.customerOs.fusionauthHelmValues = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/infra/helm/fusionauth/fusionauth-values.yaml'
  config.customerOs.repo = 'https://github.com/openline-ai/openline-customer-os.git'

  // Oasis App config
  config.oasis = {}
  // Oasis API
  config.oasis.apiImage = 'ghcr.io/openline-ai/openline-oasis/oasis-api:'
  config.oasis.apiDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-api.yaml'
  config.oasis.apiService = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-api-k8s-service.yaml'
  config.oasis.apiLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-api-k8s-loadbalancer-service.yaml'
  // Oasis Channels API
  config.oasis.channelsApiImage = 'ghcr.io/openline-ai/openline-oasis/channels-api:'
  config.oasis.channelsApiDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/channels-api.yaml'
  config.oasis.channelsApiService = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/channels-api-k8s-service.yaml'
  config.oasis.channelsApiLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/channels-api-k8s-loadbalancer-service.yaml'
  // Oasis GUI
  config.oasis.guiImage = 'ghcr.io/openline-ai/openline-oasis/oasis-frontend-dev:'
  config.oasis.guiDeployment = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-frontend.yaml'
  config.oasis.guiService = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-frontend-k8s-service.yaml'
  config.oasis.guiLoadbalancer = 'https://raw.githubusercontent.com/openline-ai/openline-oasis/otter/deployment/k8s/local-minikube/apps-config/oasis-frontend-k8s-loadbalancer-service.yaml'
  config.oasis.repo = 'https://github.com/openline-ai/openline-oasis.git'

  // Voice network
  config.voice = {}
  config.voice.repo = 'https://github.com/openline-ai/openline-voice.git'

  // CLI command dependencies
  config.dependencies = {}
  config.dependencies.colimaMac = 'brew install colima'
  config.dependencies.dockerMac = 'brew install docker'
  config.dependencies.helmMac = 'brew install helm'
  config.dependencies.homebrew = '/bin/bash -c \'$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\''
  config.dependencies.kubectlMac = 'brew install kubectl'
  config.dependencies.xcode = 'xcode-select --install'

  return config
}
