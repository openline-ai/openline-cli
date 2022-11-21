import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'

export function xcodeCheck() :boolean {
    let result = shell.exec('which xcode-select', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installXcode() :boolean {
    let config = getConfig()
    let result = shell.exec(config.dependencies.xcode)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}