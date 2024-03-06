
export function getConfig(): any {
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
  config.namespace.file = 'deployment/infra/k8s/openline-namespace.json'

  config.cli = {}
  config.cli.repo = 'https://github.com/openline-ai/openline-cli.git'
  config.cli.rawRepo = 'https://raw.githubusercontent.com/openline-ai/openline-cli/otter/'

  // customerOS config
  config.customerOs = {}
  config.customerOs.githubPath = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter'
  // customerOS analytics API
  config.customerOs.analyticsApiImage = 'ghcr.io/openline-ai/openline-customer-os/analytics-api:'
  // customerOS API
  config.customerOs.apiImage = 'ghcr.io/openline-ai/openline-customer-os/customer-os-api:'
  config.customerOs.apiDeployment = 'deployment/infra/k8s/customer-os-api/customer-os-api.yaml'
  config.customerOs.apiService = 'deployment/infra/k8s/customer-os-api/customer-os-api-service.yaml'
  config.customerOs.apiLoadbalancer = 'deployment/infra/k8s/customer-os-api/customer-os-api-loadbalancer.yaml'
  // customerOS settings API
  config.customerOs.settingsImage = 'ghcr.io/openline-ai/openline-customer-os/settings-api:'
  config.customerOs.settingsDeployment = 'deployment/infra/k8s/settings-api/settings-api.yaml'
  config.customerOs.settingsService = 'deployment/infra/k8s/settings-api/settings-api-service.yaml'
  config.customerOs.settingsLoadbalancer = 'deployment/infra/k8s/settings-api/settings-api-loadbalancer.yaml'
  // customerOS settings API
  config.customerOs.fileStoreImage = 'ghcr.io/openline-ai/openline-customer-os/file-store-api:'
  config.customerOs.fileStoreDeployment = 'deployment/infra/k8s/file-store-api/file-store-api.yaml'
  config.customerOs.fileStoreService = 'deployment/infra/k8s/file-store-api/file-store-api-service.yaml'
  config.customerOs.fileStoreLoadbalancer = 'deployment/infra/k8s/file-store-api/file-store-api-loadbalancer.yaml'
  //customerOs Events Processing Platform
  config.customerOs.eventsProcessingPlatformImage = 'ghcr.io/openline-ai/openline-customer-os/events-processing-platform:'
  config.customerOs.eventsProcessingPlatformDeployment = 'deployment/infra/k8s/events-processing-platform/events-processing-platform.yaml'
  config.customerOs.eventsProcessingPlatformService = 'deployment/infra/k8s/events-processing-platform/events-processing-platform-service.yaml'
  config.customerOs.eventsProcessingPlatformLoadbalancer = 'deployment/infra/k8s/events-processing-platform/events-processing-platform-loadbalancer.yaml'
  //customerOs Events Processing Platform Subscribers
  config.customerOs.eventsProcessingPlatformSubscribersImage = 'ghcr.io/openline-ai/openline-customer-os/events-processing-platform-subscribers:'
  config.customerOs.eventsProcessingPlatformSubscribersDeployment = 'deployment/infra/k8s/events-processing-platform-subscribers/events-processing-platform-subscribers.yaml'
  // validation API
  config.customerOs.validationApiImage = 'ghcr.io/openline-ai/openline-customer-os/validation-api:'
  config.customerOs.validationApiDeployment = 'deployment/infra/k8s/validation-api/validation-api.yaml'
  config.customerOs.validationApiService = 'deployment/infra/k8s/validation-api/validation-api-service.yaml'
  config.customerOs.validationApiLoadbalancer = 'deployment/infra/k8s/validation-api/validation-api-loadbalancer.yaml'
  // user admin API
  config.customerOs.userAdminApiImage = 'ghcr.io/openline-ai/openline-customer-os/user-admin-api:'
  config.customerOs.userAdminApiDeployment = 'deployment/infra/k8s/user-admin-api/user-admin-api.yaml'
  config.customerOs.userAdminApiService = 'deployment/infra/k8s/user-admin-api/user-admin-api-service.yaml'
  config.customerOs.userAdminApiLoadbalancer = 'deployment/infra/k8s/user-admin-api/user-admin-api-loadbalancer.yaml'
  config.customerOs.userAdminApiSecrets = 'deployment/infra/k8s/user-admin-api/user-admin-api-secrets.sh'
  // Platform admin API
  config.customerOs.platformAdminApiImage = 'ghcr.io/openline-ai/openline-customer-os/customer-os-platform-admin-api:'
  config.customerOs.platformAdminApiDeployment = 'deployment/infra/k8s/platform-admin-api/platform-admin-api.yaml'
  config.customerOs.platformAdminApiService = 'deployment/infra/k8s/platform-admin-api/platform-admin-api-service.yaml'
  config.customerOs.platformAdminApiLoadbalancer = 'deployment/infra/k8s/platform-admin-api/platform-admin-api-loadbalancer.yaml'
  // Webhooks
  config.customerOs.webhooksImage = 'ghcr.io/openline-ai/openline-customer-os/customer-os-webhooks:'
  config.customerOs.webhooksDeployment = 'deployment/infra/k8s/customer-os-webhooks/customer-os-webhooks.yaml'
  config.customerOs.webhooksService = 'deployment/infra/k8s/customer-os-webhooks/customer-os-webhooks-service.yaml'
  config.customerOs.webhooksLoadbalancer = 'deployment/infra/k8s/customer-os-webhooks/customer-os-webhooks-loadbalancer.yaml'
  // customerOS postgreSQL DB
  config.customerOs.postgresqlPersistentVolume = 'deployment/infra/k8s/postgresql-persistent-volume.yaml'
  config.customerOs.postgresqlPersistentVolumeClaim = 'deployment/infra/k8s/postgresql-persistent-volume-claim.yaml'
  config.customerOs.postgresqlHelmValues = 'deployment/infra/helm/postgresql/postgresql-values.yaml'
  config.customerOs.postgresqlSetup = 'deployment/scripts/postgresql/setup.sql'
  config.customerOs.sqlUser = 'postgres'
  config.customerOs.sqlPw = 'password'
  config.customerOs.sqlDb = 'openline'
  // customerOS Redis DB
  config.customerOs.redisSetup = 'deployment/scripts/redis/tenants.redis'
  // customerOS Neo4j DB
  config.customerOs.neo4jHelmValues = 'deployment/infra/helm/neo4j/neo4j-values.yaml'
  config.customerOs.neo4jCypher = 'deployment/scripts/neo4j/customer-os.cypher'
  config.customerOs.neo4jProvisioning = 'deployment/scripts/neo4j/provision-neo4j.sh'
  config.customerOs.neo4jDemoTenant = 'resources/demo-tenant.json'

  config.customerOs.repo = 'https://github.com/openline-ai/openline-customer-os.git'

  // customerOS EventStore DB
  config.customerOs.eventStoreDbImage = 'eventstore/eventstore:'
  config.customerOs.eventStoreMacImageVersion = '22.10.3-alpha-arm64v8'
  config.customerOs.eventStoreLinuxImageVersion = '22.10.3-bionic'
  config.customerOs.eventStoreDbDeployment = 'deployment/infra/k8s/event-store/event-store.yaml'
  config.customerOs.eventStoreDbService = 'deployment/infra/k8s/event-store/event-store-service.yaml'
  config.customerOs.eventStoreDbLoadbalancer = 'deployment/infra/k8s/event-store/event-store-loadbalancer.yaml'

  // Comms API
  config.customerOs.commsApiImage = 'ghcr.io/openline-ai/openline-customer-os/comms-api:'
  config.customerOs.commsApiDeployment = 'deployment/infra/k8s/comms-api/comms-api.yaml'
  config.customerOs.commsApiService = 'deployment/infra/k8s/comms-api/comms-api-k8s-service.yaml'
  config.customerOs.commsApiLoadbalancer = 'deployment/infra/k8s/comms-api/comms-api-k8s-loadbalancer-service.yaml'

  config.webchat = {}
  config.webchat.repo = 'https://github.com/openline-ai/openline-web-chat.git'

  config.website = {}
  config.website.repo = 'https://github.com/openline-ai/openline.ai.git'

  // Jaeger
  config.customerOs.jaegerImage = 'jaegertracing/all-in-one:'
  config.customerOs.jaegerDeployment = 'deployment/infra/k8s/jaeger/jaeger.yaml'
  config.customerOs.jaegerService = 'deployment/infra/k8s/jaeger/jaeger-service.yaml'
  config.customerOs.jaegerLoadbalancer = 'deployment/infra/k8s/jaeger/jaeger-loadbalancer.yaml'

  // Temporal Server
  config.customerOs.temporalServerDeployment = 'deployment/infra/k8s/temporal/temporal.yaml'

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
  config.dependencies.mac.jq = 'brew install jq'
  config.dependencies.mac.wget = 'brew install wget'
  config.dependencies.mac.temporal = 'brew install temporal'


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
  config.dependencies.linux.jq = 'sudo apt-get update && sudo apt-get install -y jq'
  config.dependencies.linux.wget = 'sudo apt install wget'
  config.dependencies.linux.temporal = 'echo "linux temporal cli not installed"' // 'curl -sSf https://temporal.download/cli.sh | sh && mv /home/runner/.temporalio/bin /usr/local/bin'

  return config
}
