import * as shell from 'shelljs'
import * as error from '../errors'
import * as checks from '../checks/openline'
import * as config from 'config'

export function startColima(verbose :boolean) :boolean {
    let result = false
    let isRunning = checks.runningCheck(verbose)
  
    if (!isRunning) {
      let cpu: string = config.get('dev-server.cpu')
      let memory: string = config.get('dev-server.memory')
      let disk: string = config.get('dev-server.disk')
      let start = shell.exec(`colima start --with-kubernetes --cpu ${cpu} --memory ${memory} --disk ${disk}`, {silent: !verbose})
      if (start.code != 0) {
        error.logError(start.stderr, 'Try reinstalling Colima', 'https://github.com/abiosoft/colima')
      }
      else {
        result = true
      }
    }
    else {
      result = true
    }
    return result
  } 

  export function installCustomerOs(verbose :boolean) :boolean {
    let result = false
    let isInstalled = checks.installCheck(verbose)

    if (isInstalled) {
        result = true
    }
    else {
        let getConfig = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/0-get-config.sh'
        let config = shell.exec(`curl -sL ${getConfig} | bash`, {silent: !verbose})
        if (config.code != 0) {
            error.logError(config.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }
        
        let baseInstall = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/2-install.sh'
        let base = shell.exec(`curl -sL ${baseInstall} | bash`, {silent: !verbose})
        if (base.code != 0) {
            error.logError(base.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }

        let deploy = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/3-db-setup.sh'
        let deployed = shell.exec(`curl -sL ${deploy} | bash`, {silent: !verbose})
        if (deployed.code != 0) {
            error.logError(base.stderr, '🫣 Looks like our repo references moved.  Update and try again.', 'https://github.com/openline-ai/openline-customer-os/tree/otter/deployment/scripts')
            return result
        }
        
        if (config.code == 0 && base.code == 0 && deployed.code == 0) { result = true }
    }

    return result
  }