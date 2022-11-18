import * as shell from 'shelljs'

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
    let result = shell.exec('brew install kubectl')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}