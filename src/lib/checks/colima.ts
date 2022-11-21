import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'


export function colimaCheck() :boolean {
    let result = shell.exec('which colima', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installColima() :boolean {
    let config = getConfig()
    let result = shell.exec(config.dependencies.colimaMac)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}