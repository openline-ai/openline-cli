//import * as shell from 'shelljs'
import * as xcode from './checks/xcode'
import * as brew from './checks/homebrew'
import * as docker from './checks/docker'
import * as colima from './checks/colima'
import * as kubectl from './checks/kubectl'
import * as helm from './checks/helm'


export function dependencies(verbose: boolean) :boolean {
    console.log('⏳ Openline dependency check...')
    var falseCount = 0
    let result = false
    
    let need = {
        'xcode': false,
        'homebrew': false,
        'docker': false,
        'colima': false,
        'kubectl': false,
        'helm': false
    }

    // Checking if dependency installed
    need['xcode'] = xcode.xcodeCheck()
    if (!need.xcode) {
        falseCount++
    }
    need['homebrew'] = brew.brewCheck()
    if (!need.homebrew) {
        falseCount++
    }
    need['docker'] = docker.dockerCheck()
    if (!need.docker) {
        falseCount++
    }
    need['colima'] = colima.colimaCheck()
    if (!need.colima) {
        falseCount++
    }
    need['kubectl'] = kubectl.kubeCheck()
    if (!need.kubectl) {
        falseCount++
    }
    need['helm'] = helm.helmCheck()
    if (!need.helm) {
        falseCount++
    }

    // Verbose logging of dependency check
    if (verbose) {
        console.log(need)
    }

    // Installing necessary dependencies
    if (falseCount != 0) {
        console.log('🦦 Installing dependencies...')
        // Xcode
        if (!need.xcode) {
            console.log('Installing Xcode')
            let xResult = xcode.installXcode()
            if (xResult) {
                console.log('✅ Xcode')
            } else {
                console.log('❌ Xcode install failed')
                return result
            }
        }
        // Homebrew
        if (!need.homebrew) {
            console.log('Installing homebrew')
            let hbResult = brew.installBrew()
            if (hbResult) {
                console.log('✅ Homebrew')
            } else {
                console.log('❌ Homebrew install failed')
                return result
            }
        }
        // Docker
        if (!need.docker) {
            console.log('Installing docker')
            let dResult = docker.installDocker()
            if (dResult) {
                console.log('✅ docker')
            } else {
                console.log('❌ docker install failed')
                return result
            }
        }
        // Colima
        if (!need.colima) {
            console.log('Installing colima')
            let cResult = colima.installColima()
            if (cResult) {
                console.log('✅ colima')
            } else {
                console.log('❌ colima install failed')
                return result
            }
        }
        // kubectl
        if (!need.kubectl) {
            console.log('Installing kubectl')
            let kResult = kubectl.installKube()
            if (kResult) {
                console.log('✅ kubectl')
            } else {
                console.log('❌ kubectl install failed')
                return result
            }
        }
        // Helm
        if (!need.helm) {
            console.log('Installing helm')
            let hResult = helm.installHelm()
            if (hResult) {
                console.log('✅ helm')
            } else {
                console.log('❌ helm install failed')
                return result
            }
        }

    }
    console.log('✅ All dependencies installed')
    result = true
    return(result)
}
