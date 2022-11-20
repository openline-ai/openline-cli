import * as shell from 'shelljs'
import * as config from 'config'

export function dockerCheck() :boolean {
    let result = shell.exec('which docker', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installDocker() :boolean {
    let install: string = config.get('dependencies.docker.mac')
    let result = shell.exec(install)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}