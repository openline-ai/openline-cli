import * as shell from 'shelljs'
import * as error from './errors'
import * as replace from 'replace-in-file'

export interface Yaml {
    deployYaml: string,
    serviceYaml: string,
    loadbalancerYaml?: string
}

export function deployImage(imageUrl :string | null, deployConfig :Yaml, verbose = false) :boolean {
  const NAMESPACE = 'openline'

  if (imageUrl !== null) {
    if (verbose) {
      shell.exec(`echo docker pull ${imageUrl}`, {silent: true})
    }

    const pull = shell.exec(`docker pull ${imageUrl}`, {silent: !verbose})
    if (pull.code !== 0) {
      error.logError(pull.stderr, `Unable to pull image ${imageUrl}`)
      return false
    }
  }

  if (verbose) {
    shell.exec(`echo kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`, {silent: true})
  }

  const deploy = shell.exec(`kubectl apply -f ${deployConfig.deployYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (deploy.code !== 0) {
    return false
  }

  if (verbose) {
    shell.exec(`echo kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`, {silent: true})
  }

  const service = shell.exec(`kubectl apply -f ${deployConfig.serviceYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
  if (service.code !== 0) {
    return false
  }

  if (verbose) {
    shell.exec(`echo kubectl apply -f ${deployConfig.loadbalancerYaml} --namespace ${NAMESPACE}`, {silent: true})
  }

  if (deployConfig.loadbalancerYaml !== null) {
    const lb = shell.exec(`kubectl apply -f ${deployConfig.loadbalancerYaml} --namespace ${NAMESPACE}`, {silent: !verbose})
    if (lb.code !== 0) {
      return false
    }
  }

  return true
}

export function updateImageTag(deployFiles: string[], imageVersion: string, verbose: boolean) :boolean {
  const options = {
    files: deployFiles,
    from: 'latest',
    to: imageVersion,
  }
  try {
    const textReplace = replace.sync(options)
    if (verbose) {
      console.log('Replacement results:', textReplace)
    }
  } catch (error: any) {
    error.logError(error, 'Unable to modify config files to use specified image version', true)
    return false
  }

  return true
}
