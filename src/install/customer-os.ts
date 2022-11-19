import * as shell from 'shelljs'
import * as mac from '../checks/mac'

function installCustomerOs(verbose: boolean) {
  
    let osType: string = process.platform
    var depend = ''
    if (osType == 'darwin') {
      mac.dependencies(!verbose)
    } 
    else {
      console.log('Your OS is currently unsupported :(')
      process.exit(1)
    }
  
    let getConfig = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/0-get-config.sh'
    let configErr = shell.exec(`curl -sL ${getConfig} | bash`, {silent: verbose}).code
    
    let dependErr = shell.exec(`curl -sL ${depend} | bash`, {silent: verbose}).code
  
    let baseInstall = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/2-install.sh'
    let baseErr = shell.exec(`curl -sL ${baseInstall} | bash`, {silent: verbose}).code
    
    let deploy = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/3-db-setup.sh'
    let deployErr = shell.exec(`curl -sL ${deploy} | bash`, {silent: verbose}).code
    
    console.log('')
    console.log('✅ customerOS successfully started!')
    console.log('🦦 To validate the service is reachable run the command =>  openline dev --ping customer-os')
    console.log('🦦 Visit http://localhost:10010 in your browser to play around with the graph API explorer')
    shell.exec('open http://localhost:10010')
  }
