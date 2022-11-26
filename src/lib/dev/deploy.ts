import * as shell from 'shelljs'
import * as error from './errors'

export interface Yaml {
    deployYaml: string,
    serviceYaml: string,
    loadbalancerYaml?: string
}

export function grabFile(fileLocation: string, setupPath: string, verbose :boolean) :boolean {
  const result = true
  const file = shell.exec(`curl -sS ${fileLocation} -o ${setupPath}`, {silent: !verbose})
  if (file.code !== 0) {
    error.logError(file.stderr, `Could not download setup file from ${fileLocation}`)
    return false
  }

  return result
}

export function deployImage(imageUrl :string, deployConfig :Yaml, verbose = false) :boolean {
  const result = true
  const NAMESPACE = 'openline'

  const pull = shell.exec(`docker pull ${imageUrl}`, {silent: !verbose})
  if (pull.code !== 0) {
    error.logError(pull.stderr, `Unable to pull image ${imageUrl}`)
    return false
  }

  const deploy = shell.exec(`kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (deploy.code !== 0) {
    return false
  }

  const service = shell.exec(`kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (service.code !== 0) {
    return false
  }

  if (deployConfig.loadbalancerYaml !== null) {
    const lb = shell.exec(`kubectl apply -f ${deployConfig.loadbalancerYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
    if (lb.code !== 0) {
      return false
    }
  }

  return result
}
