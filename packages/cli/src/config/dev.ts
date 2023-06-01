
export function getConfig() :any {
  const config: any = {}

  // Dev server resource config
  config.server = {}
  config.server.cpu = 2
  config.server.disk = 30
  config.server.memory = 4
  config.server.timeOuts = 600 // seconds

  config.setupDir = './openline-setup'

  config.namespace = {}
  config.namespace.name = 'openline'
  config.namespace.file = '/deployment/infra/k8s/openline-namespace.json'

  // Contacts App config
  config.contacts = {}
  // Contacts GUI
  config.contacts.guiImage = 'ghcr.io/openline-ai/openline-contacts:'
  config.contacts.githubPath = 'https://raw.githubusercontent.com/openline-ai/openline-contacts/otter'
  config.contacts.guiDeployment = '/deployment/infra/k8s/contacts-gui-deployment.yaml'
  config.contacts.guiService = '/deployment/infra/k8s/contacts-gui-service.yaml'
  config.contacts.guiLoadbalancer = '/deployment/infra/k8s/contacts-gui-loadbalancer.yaml'
  config.contacts.repo = 'https://github.com/openline-ai/openline-contacts.git'

  config.cli = {}
  config.cli.repo = 'https://github.com/openline-ai/openline-cli.git'

  // customerOS config
  config.customerOs = {}
  config.customerOs.githubPath = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter'
  // customerOS analytics API
  config.customerOs.analyticsApiImage = 'ghcr.io/openline-ai/openline-customer-os/analytics-api:'
  // customerOS API
  config.customerOs.apiImage = 'ghcr.io/openline-ai/openline-customer-os/customer-os-api:'
  config.customerOs.apiDeployment = '/deployment/infra/k8s/customer-os-api.yaml'
  config.customerOs.apiService = '/deployment/infra/k8s/customer-os-api-service.yaml'
  config.customerOs.apiLoadbalancer = '/deployment/infra/k8s/customer-os-api-loadbalancer.yaml'
  // customerOS message store API
  config.customerOs.messageStoreImage = 'ghcr.io/openline-ai/openline-customer-os/message-store-api:'
  config.customerOs.messageStoreDeployment = '/deployment/infra/k8s/message-store-api.yaml'
  config.customerOs.messageStoreService = '/deployment/infra/k8s/message-store-api-service.yaml'
  config.customerOs.messageStoreLoadbalancer = '/deployment/infra/k8s/message-store-api-loadbalancer.yaml'
  // customerOS settings API
  config.customerOs.settingsImage = 'ghcr.io/openline-ai/openline-customer-os/settings-api:'
  config.customerOs.settingsDeployment = '/deployment/infra/k8s/settings-api.yaml'
  config.customerOs.settingsService = '/deployment/infra/k8s/settings-api-service.yaml'
  config.customerOs.settingsLoadbalancer = '/deployment/infra/k8s/settings-api-loadbalancer.yaml'
  // customerOS settings API
  config.customerOs.fileStoreImage = 'ghcr.io/openline-ai/openline-customer-os/file-store-api:'
  config.customerOs.fileStoreDeployment = '/deployment/infra/k8s/file-store-api.yaml'
  config.customerOs.fileStoreService = '/deployment/infra/k8s/file-store-api-service.yaml'
  config.customerOs.fileStoreLoadbalancer = '/deployment/infra/k8s/file-store-api-loadbalancer.yaml'
  //customerOs Events Processing Platform
  config.customerOs.eventsProcessingPlatformImage = 'ghcr.io/openline-ai/openline-customer-os/events-processing-platform:'
  config.customerOs.eventsProcessingPlatformDeployment = '/deployment/infra/k8s/events-processing-platform.yaml'
  config.customerOs.eventsProcessingPlatformService = '/deployment/infra/k8s/events-processing-platform-service.yaml'
  config.customerOs.eventsProcessingPlatformLoadbalancer = '/deployment/infra/k8s/events-processing-platform-loadbalancer.yaml'
  // validation API
  config.customerOs.validationApiImage = 'ghcr.io/openline-ai/openline-customer-os/validation-api:'
  config.customerOs.validationApiDeployment = '/deployment/infra/k8s/validation-api/validation-api.yaml'
  config.customerOs.validationApiService = '/deployment/infra/k8s/validation-api/validation-api-service.yaml'
  config.customerOs.validationApiLoadbalancer = '/deployment/infra/k8s/validation-api/validation-api-loadbalancer.yaml'
  // customerOS postgreSQL DB
  config.customerOs.postgresqlPersistentVolume = '/deployment/infra/k8s/postgresql-persistent-volume.yaml'
  config.customerOs.postgresqlPersistentVolumeClaim = '/deployment/infra/k8s/postgresql-persistent-volume-claim.yaml'
  config.customerOs.postgresqlHelmValues = '/deployment/infra/helm/postgresql/postgresql-values.yaml'
  config.customerOs.postgresqlSetup = '/deployment/scripts/postgresql/setup.sql'
  // customerOS Neo4j DB
  config.customerOs.neo4jHelmValues = '/deployment/infra/helm/neo4j/neo4j-values.yaml'
  config.customerOs.neo4jCypher = '/deployment/scripts/neo4j/customer-os.cypher'
  config.customerOs.neo4jProvisioning = '/deployment/scripts/neo4j/provision-neo4j.sh'

  config.customerOs.repo = 'https://github.com/openline-ai/openline-customer-os.git'

  // customerOS EventStore DB
  config.customerOs.eventStoreDbImage = 'eventstore/eventstore:22.10.1-alpha-arm64v8'
  config.customerOs.eventStoreDbDeployment = '/deployment/infra/k8s/event-store.yaml'
  config.customerOs.eventStoreDbService = '/deployment/infra/k8s/event-store-service.yaml'
  config.customerOs.eventStoreDbLoadbalancer = '/deployment/infra/k8s/event-store-loadbalancer.yaml'

  //Ory Tunnel
  config.customerOs.oryTunnelImage = 'ghcr.io/openline-ai/openline-customer-os/ory-tunnel:'
  config.customerOs.oryTunnelStatefulset = '/deployment/infra/k8s/ory-tunnel.yaml'
  config.customerOs.oryTunnelService = '/deployment/infra/k8s/ory-tunnel-service.yaml'
  config.customerOs.oryTunnelLoadbalancer = '/deployment/infra/k8s/ory-tunnel-loadbalancer.yaml'

  // Comms API
  config.customerOs.commsApiImage = 'ghcr.io/openline-ai/openline-customer-os/comms-api:'
  config.customerOs.commsApiDeployment = '/deployment/infra/k8s/comms-api.yaml'
  config.customerOs.commsApiService = '/deployment/infra/k8s/comms-api-k8s-service.yaml'
  config.customerOs.commsApiLoadbalancer = '/deployment/infra/k8s/comms-api-k8s-loadbalancer-service.yaml'

  // Voice network
  config.voice = {}
  config.voice.repo = 'https://github.com/openline-ai/openline-voice.git'
  config.voice.githubPath = 'https://raw.githubusercontent.com/openline-ai/openline-voice/otter'

  // Voice Kamailio
  config.voice.kamailio = {}
  config.voice.kamailio.Image = 'ghcr.io/openline-ai/openline-voice/openline-kamailio-server:'
  config.voice.kamailio.Deployment = '/deployment/k8s/local-minikube/apps-config/kamailio.yaml'
  config.voice.kamailio.Service = '/deployment/k8s/local-minikube/apps-config/kamailio-k8s-service.yaml'
  config.voice.kamailio.Loadbalancer = '/deployment/k8s/local-minikube/apps-config/kamailio-k8s-loadbalancer-service.yaml'

  // Voice Asterisk
  config.voice.asterisk = {}
  config.voice.asterisk.Image = 'ghcr.io/openline-ai/openline-voice/openline-asterisk-server:'
  config.voice.asterisk.Deployment = '/deployment/k8s/local-minikube/apps-config/asterisk.yaml'
  config.voice.asterisk.Service = '/deployment/k8s/local-minikube/apps-config/asterisk-k8s-service.yaml'

  // Voice Plugin
  config.voice.plugin = {}
  config.voice.plugin.Image = 'ghcr.io/openline-ai/openline-voice/voice-plugin:'
  config.voice.plugin.Deployment = '/deployment/k8s/local-minikube/apps-config/voice-plugin.yaml'
  config.voice.plugin.Service = '/deployment/k8s/local-minikube/apps-config/voice-plugin-k8s-service.yaml'

  config.webchat = {}
  config.webchat.repo = 'https://github.com/openline-ai/openline-web-chat.git'

  config.website = {}
  config.website.repo = 'https://github.com/openline-ai/openline.ai.git'

  // CLI command dependencies
  config.dependencies = {}
  config.dependencies.mac = {}

  config.dependencies.mac.colima = 'brew install colima'
  config.dependencies.mac.docker = 'brew install docker'
  config.dependencies.mac.git = 'brew install git'
  config.dependencies.mac.helm = 'brew install helm'
  config.dependencies.mac.homebrew = '/bin/bash -c \'$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\''
  config.dependencies.mac.kubectl = 'brew install kubectl'
  config.dependencies.mac.xcode = 'xcode-select --install'
  config.dependencies.mac.netcat = 'brew install netcat'
  config.dependencies.mac.ory = 'brew install ory/tap/cli'
  config.dependencies.mac.jq = 'brew install jq'


  config.dependencies.linux = {}
  config.dependencies.linux.k3d = 'curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | sudo bash'

  config.dependencies.linux.docker = '/bin/bash -c \'curl -fsSL https://get.docker.com/ | sudo sh &&  sudo usermod -a -G docker $USER\''
  config.dependencies.linux.git = 'sudo apt-get update && sudo apt-get install -y git'
  config.dependencies.linux.helm = '/bin/bash -c \'mkdir -p ' + config.setupDir + '/helm && ' +
                                  'curl -Lo ' + config.setupDir + '/helm/helm.tar.gz "https://get.helm.sh/helm-v3.10.2-linux-amd64.tar.gz" && ' +
                                  'cd ' + config.setupDir + '/helm && ' +
                                  'tar -zxvf helm.tar.gz &&' +
                                  'sudo install -o root -g root -m 0755 ./linux-amd64/helm /usr/local/bin/helm\''
  config.dependencies.linux.kubectl = '/bin/bash -c \'curl -Lo ' + config.setupDir + '/kubectl "https://dl.k8s.io/release/v1.25.3/bin/linux/amd64/kubectl" && ' +
                                      'sudo install -o root -g root -m 0755 ' + config.setupDir + '/kubectl /usr/local/bin/kubectl\''
  config.dependencies.linux.netcat = 'sudo apt-get update && sudo apt-get install -y netcat'
  config.dependencies.linux.ory = '/bin/bash -c \'/bin/bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -b' + config.setupDir + ' ory && ' +
                                      'sudo install -o root -g root -m 0755 ' + config.setupDir + '/ory /usr/local/bin/ory\''
  config.dependencies.linux.jq = 'apt-get install jq'

  return config
}
