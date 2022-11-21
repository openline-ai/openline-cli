import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'

export function brewCheck() :boolean {
    let result = shell.exec('which brew', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installBrew() :boolean {
    let config = getConfig()
    let result = shell.exec(config.dependencies.homebrew)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}