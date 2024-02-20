import {getConfig} from "../../config/dev";
import * as shell from "shelljs";
import {deployImage, Yaml, updateImageTag} from './deploy'
import {logTerminal} from "../logs";
import {getPlatform} from "../dependencies";
import {waitForFileToBeDownloaded} from "../../helpers/downloadChecker";
const config = getConfig()
const CLI_RAW_REPO = config.cli.rawRepo

const NAMESPACE = config.namespace.name
const EVENTSTORE_SERVICE = 'customer-db-eventstore'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${EVENTSTORE_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installEventStoreDB(verbose: boolean, location = config.setupDir) :boolean {
  const REMOTE_DEPLOYMENT = CLI_RAW_REPO + config.customerOs.eventStoreDbDeployment
  const DEPLOYMENT = "event-store.yaml"
  const SERVICE = CLI_RAW_REPO + config.customerOs.eventStoreDbService
  const LOADBALANCER = CLI_RAW_REPO + config.customerOs.eventStoreDbLoadbalancer
  let IMAGE_VERSION
  let ImageUpdate
  switch (getPlatform()) {
    case 'mac':
      IMAGE_VERSION = config.customerOs.eventStoreMacImageVersion
      break
    case 'linux':
      IMAGE_VERSION = config.customerOs.eventStoreLinuxImageVersion
      break
  }

  const eventStoreDeploymentFileName = waitForFileToBeDownloaded(REMOTE_DEPLOYMENT, verbose);
  ImageUpdate = 'sed "s/\\$IMAGE_VERSION/' + IMAGE_VERSION + `/" `+ eventStoreDeploymentFileName + ` > event-store-temp.yaml && mv event-store-temp.yaml ` + eventStoreDeploymentFileName
  shell.exec(ImageUpdate, {silent: !verbose})

  let image: string | null = config.customerOs.eventStoreDbImage+IMAGE_VERSION

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'event-store successfully installed')
  return true
}
