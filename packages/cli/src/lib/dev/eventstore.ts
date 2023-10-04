import {getConfig} from "../../config/dev";
import * as shell from "shelljs";
import {deployImage, Yaml, updateImageTag} from './deploy'
import {logTerminal} from "../logs";
import {getPlatform} from "../dependencies";
import * as colima from "./colima";
import * as k3d from "./k3d";


const config = getConfig()
const NAMESPACE = config.namespace.name
const EVENTSTORE_SERVICE = 'customer-db-eventstore'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${EVENTSTORE_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installEventStoreDB(verbose: boolean, location = config.setupDir) :boolean {
  const DEPLOYMENT = location + config.customerOs.eventStoreDbDeployment
  const SERVICE = location + config.customerOs.eventStoreDbService
  const LOADBALANCER = location + config.customerOs.eventStoreDbLoadbalancer
  let IMAGE_VERSION
  switch (getPlatform()) {
    case 'mac':
      IMAGE_VERSION = "22.10.3-alpha-arm64v8"
      break
    case 'linux':
      IMAGE_VERSION = "22.10.3-bionic"
      break
  }
  let image: string | null = config.customerOs.eventStoreDbImage

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
