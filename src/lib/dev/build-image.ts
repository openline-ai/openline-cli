import * as shell from 'shelljs'
import {logTerminal} from '../logs'

export function buildLocalImage(path: string, context: string, imageName: string, verbose: boolean) :boolean {
  const dockerBuild = `docker build -t ${imageName} -f ${path}/Dockerfile ${context}`
  if (verbose) logTerminal('EXEC', dockerBuild)

  const buildExecution = shell.exec(dockerBuild, {silent: !verbose})
  if (buildExecution.code !== 0) {
    logTerminal('ERROR', buildExecution.stderr, 'dev:build-image:buildLocalImage')
    return false
  }

  return true
}
