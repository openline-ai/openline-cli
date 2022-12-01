import * as shell from 'shelljs'
import * as error from './errors'

export function buildLocalImage(path: string, imageName: string, verbose: boolean) :boolean {
  const dockerBuild = `docker build -t ${imageName} -f ${path}/${imageName}/Dockerfile ${path}`
  if (verbose) console.log(`[EXEC] ${dockerBuild}`)

  const buildExecution = shell.exec(dockerBuild, {silent: !verbose})
  if (buildExecution.code !== 0) {
    error.logError(buildExecution.stderr, `Unable to build image in ${path}`, true)
    return false
  }

  return true
}
