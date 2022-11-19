import * as shell from 'shelljs'

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
    let result = shell.exec('brew install helm')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}