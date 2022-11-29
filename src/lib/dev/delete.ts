import * as shell from 'shelljs'

export function deleteService(deployments: string[], services: string[], verbose: boolean) :boolean {
  const NAMESPACE = 'openline'

  for (const deployment of deployments) {
    const result = shell.exec(`kubectl delete deployments ${deployment} -n ${NAMESPACE}`, {silent: !verbose})
    if (result.code !== 0) return false
  }

  for (const service of services) {
    const result = shell.exec(`kubectl delete service ${service} -n ${NAMESPACE}`, {silent: !verbose})
    if (result.code !== 0) return false
  }

  return true
}
