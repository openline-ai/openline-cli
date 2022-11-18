import * as shell from 'shelljs'

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
    let result = shell.exec('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)')
    if (result.code == 0) {
        return true
    } else {
        return false
    }
}