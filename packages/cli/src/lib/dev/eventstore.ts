import {getConfig} from "../../config/dev";
import * as shell from "shelljs";
import {deployImage, Yaml, updateImageTag} from './deploy'
import {logTerminal} from "../logs";
import {getPlatform} from "../dependencies";
const config = getConfig()

const NAMESPACE = config.namespace.name
const EVENTSTORE_SERVICE = 'customer-db-eventstore'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${EVENTSTORE_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installEventStoreDB(verbose: boolean, location = config.setupDir) :boolean {
  const DEPLOYMENT = config.customerOs.eventStoreDbDeployment
  const SERVICE = config.customerOs.eventStoreDbService
  const LOADBALANCER = config.customerOs.eventStoreDbLoadbalancer
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

  ImageUpdate = 'sed "s/\\$IMAGE_VERSION/' + IMAGE_VERSION + `/" `+ DEPLOYMENT + ` > event-store-temp.yaml && mv event-store-temp.yaml ` + DEPLOYMENT
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
