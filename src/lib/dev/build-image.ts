import * as shell from 'shelljs'
import * as error from './errors'

export function buildLocalImage(path: string, imageName: string, verbose: boolean) :boolean {
  shell.exec(`echo ${path}  docker build -t ${imageName} .`, {silent: !verbose})
  const buildExecution = shell.exec(`cd  | docker build -t ${imageName} -f ${path}/Dockerfile ${path}`, {silent: !verbose})
  if (buildExecution.code !== 0) {
    error.logError(buildExecution.stderr, `Unable to build image in ${path}`, true)
    return false
  }

  return true
}
