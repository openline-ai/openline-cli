import * as shell from 'shelljs'
import {logTerminal} from '../logs'
import {getPlatform} from '../dependencies'

export function buildLocalImage({ path, context, imageName, env, verbose }: { path: string; context: string; imageName: string; env?: Map<String, String>, verbose: boolean }) :boolean {
  let buildArgs = ''
  if (env) {
    for (const [key, value] of env) {
      buildArgs += `--build-arg ${key}=${value} `
    }
  }
  
  const dockerBuild = `docker build -t ${imageName} ${buildArgs} -f ${path}/Dockerfile ${context}`
  if (verbose) logTerminal('EXEC', dockerBuild)

  const buildExecution = shell.exec(dockerBuild, {silent: !verbose})
  if (buildExecution.code !== 0) {
    logTerminal('ERROR', buildExecution.stderr, 'dev:build-image:buildLocalImage')
    return false
  }

  if (getPlatform() === 'linux') {
    const pushCmd = 'k3d image import ' + imageName + ' -c development'
    if (verbose) logTerminal('EXEC', pushCmd)
    const push = shell.exec(pushCmd, {silent: !verbose})
    if (push.code !== 0) {
      logTerminal('ERROR', push.stderr, 'dev:build-image:buildLocalImage')
      return false
    }
  }

  return true
}
