import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'

export function kubeCheck() :boolean {
    let result = shell.exec('which kubectl', {silent: true})
    if (result.code == 0) {
        return true
    }
    else {
        return false
    }
}

export function installKube() :boolean {
    let config = getConfig()
    let result = shell.exec(config.dependencies.kubectlMac)
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}