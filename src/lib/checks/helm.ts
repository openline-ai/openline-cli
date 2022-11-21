import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'

export function helmCheck() :boolean {
    let result = shell.exec('which helm', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installHelm() :boolean {
    let config = getConfig()
    let result = shell.exec(config.dependencies.helmMac)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}