import {getConfig} from "../../config/dev";
import * as shell from "shelljs";
import {deployImage, Yaml, updateImageTag} from './deploy'
import {logTerminal} from "../logs";


const config = getConfig()
const NAMESPACE = config.namespace.name
const JAEGER_SERVICE = 'jaeger'

function postgresqlServiceCheck() :boolean {
  return (shell.exec(`kubectl get service ${JAEGER_SERVICE} -n ${NAMESPACE}`, {silent: true}).code === 0)
}

export function installJaeger(verbose: boolean, location = config.setupDir, imageVersion = 'latest') :boolean {
  const DEPLOYMENT = config.customerOs.jaegerDeployment
  const SERVICE = config.customerOs.jaegerService
  const LOADBALANCER = config.customerOs.jaegerLoadbalancer

  let image: string | null = config.customerOs.jaegerImage + imageVersion

  const installConfig: Yaml = {
    deployYaml: DEPLOYMENT,
    serviceYaml: SERVICE,
    loadbalancerYaml: LOADBALANCER,
  }
  const deploy = deployImage(image, installConfig, verbose)
  if (deploy === false) return false

  logTerminal('SUCCESS', 'jaeger successfully installed')
  return true
}
