import * as shell from 'shelljs'
import * as error from '../../lib/dev/errors'

export function deleteApp(deployments: string[], services: string[], verbose: boolean) :boolean {
  const NAMESPACE = 'openline'

  for (const deployment of deployments) {
    const result = shell.exec(`kubectl delete deployments ${deployment} -n ${NAMESPACE}`, {silent: !verbose})
    if (result.code !== 0) {
      error.logError(result.stderr, 'Problem deleting deployment')
      return false
    }
  }

  for (const service of services) {
    const result = shell.exec(`kubectl delete service ${service} -n ${NAMESPACE}`, {silent: !verbose})
    if (result.code !== 0) {
      error.logError(result.stderr, 'Problem deleting service')
      return false
    }
  }

  return true
}
