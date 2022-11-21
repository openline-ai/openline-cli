import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'

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
    let config = getConfig()
    let result = shell.exec(config.dependencies.dockerMac)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}