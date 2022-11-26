import * as required from './dependencies'

interface Checks {
    xcode: boolean,
    homebrew: boolean,
    docker: boolean,
    colima: boolean,
    kubectl: boolean,
    helm: boolean
}

function dependencyCheck(verbose: boolean) :Checks {
  console.log('⏳ Openline dependency check...')
  const need = {
    xcode: false,
    homebrew: false,
    docker: false,
    colima: false,
    kubectl: false,
    helm: false,
  }
  // Checking if dependency installed
  need.xcode = required.xcodeCheck()

  need.homebrew = required.brewCheck()

  need.docker = required.dockerCheck()

  need.colima = required.colimaCheck()

  need.kubectl = required.kubeCheck()

  need.helm = required.helmCheck()

  if (verbose) {
    console.log(need)
  }

  return need
}

export function installDependencies(verbose: boolean) :boolean {
  const need = dependencyCheck(verbose)

  // Xcode
  if (!need.xcode) {
    console.log('Installing Xcode')
    console.log(required.installXcode() ? '✅ Xcode' : '❌ Xcode install failed')
    if (!required.installXcode()) {
      return false
    }
  }

  // Homebrew
  if (!need.homebrew) {
    console.log('Installing Homebrew')
    console.log(required.installBrew() ? '✅ Homebrew' : '❌ Homebrew install failed')
    if (!required.installBrew()) {
      return false
    }
  }

  // Docker
  if (!need.docker) {
    console.log('Installing Docker')
    console.log(required.installDocker() ? '✅ Docker' : '❌ Docker install failed')
    if (!required.installDocker()) {
      return false
    }
  }

  // Colima
  if (!need.colima) {
    console.log('Installing Colima')
    console.log(required.installColima() ? '✅ Colima' : '❌ Colima install failed')
    if (!required.installColima()) {
      return false
    }
  }

  // kubectl
  if (!need.kubectl) {
    console.log('Installing kubectl')
    console.log(required.installKube() ? '✅ kubectl' : '❌ kubectl install failed')
    if (!required.installKube()) {
      return false
    }
  }

  // Helm
  if (!need.helm) {
    console.log('Installing Helm')
    console.log(required.installHelm() ? '✅ Helm' : '❌ Helm install failed')
    if (!required.installHelm()) {
      return false
    }
  }

  return true
}
