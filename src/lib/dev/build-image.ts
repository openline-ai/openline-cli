import * as shell from 'shelljs'
import * as error from './errors'

export function buildLocalImage(path: string, imageName: string, verbose: boolean) :boolean {
  if (verbose) {
    shell.exec(`echo docker build -t ${imageName} -f ${path}/${imageName}/Dockerfile ${path}`, {silent: !verbose})
  }

  const buildExecution = shell.exec(`docker build -t ${imageName} -f ${path}/${imageName}/Dockerfile ${path}`, {silent: !verbose})
  if (buildExecution.code !== 0) {
    error.logError(buildExecution.stderr, `Unable to build image in ${path}`, true)
    return false
  }

  return true
}
