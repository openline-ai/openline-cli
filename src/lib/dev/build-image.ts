import * as shell from 'shelljs'
import {logTerminal} from '../logs'
import { getPlatform } from '../dependencies'


export function buildLocalImage(path: string, context: string, imageName: string, verbose: boolean) :boolean {
  const dockerBuild = `docker build -t ${imageName} -f ${path}/Dockerfile ${context}`
  if (verbose) logTerminal('EXEC', dockerBuild)

  const buildExecution = shell.exec(dockerBuild, {silent: !verbose})
  if (buildExecution.code !== 0) {
    logTerminal('ERROR', buildExecution.stderr, 'dev:build-image:buildLocalImage')
    return false
  }

  if (getPlatform() == "linux") {

    const pushCmd = 'k3d image import ' + imageName + " -c development"
    if (verbose) logTerminal('EXEC', pushCmd)
    const push = shell.exec(pushCmd, {silent: !verbose})
    if (push.code !== 0) {
      logTerminal('ERROR', push.stderr, 'dev:build-image:buildLocalImage')
      return false
    }
  }

  return true
}
