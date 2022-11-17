import {Command, Flags} from '@oclif/core'
import {getHelpFlagAdditions} from '@oclif/core/lib/help'
import * as shell from 'shelljs'

export default class Dev extends Command {
  static description = 'starts and stops local development server for openline applications'

  static examples = [
    'openline dev --start all',
    'openline dev --start customer-os',
    'openline dev --stop',
    'openline dev -p customer-os',
  ]

  static flags = {
    start: Flags.string({
      description: 'start openline application', 
      options: ['all', 'customer-os', 'oasis', 'contacts'],  
      required: false,
    }),
    stop: Flags.boolean({
      description: 'stop openline applications', 
      aliases: ['kill', 'k'], 
      required: false,
    }),
    ping: Flags.string({
      description: 'service health check',
      char: 'p', 
      options: ['all', 'customer-os', 'oasis', 'contacts'], 
      required: false,
    }),
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Dev)

    if ((flags.start) && (flags.stop)) {
      console.log('Error:  only one flag can be set at a time')
    }
    else if (flags.start == 'customer-os') {
      startCustomerOs()
    }
    else if (flags.stop) {
      shell.exec('y | colima delete')
    }
    
    else if (flags.ping == 'customer-os') {
      let health = shell.exec('curl localhost:10010/health', {silent: true})
      if (health.code == 0) {
        console.log('✅ customerOS API is up and reachable')
        console.log('🦦 go to http://localhost:10010 in your browser to play around with the graph API explorer')
      }
      else {
        console.log('❌ customerOS API is not reachable')
        console.log('🦦 run [openline dev --start customer-os] to start the customerOS dev server.')
      }
    }
  }
}


function startCustomerOs() {
  let osType: string = process.platform
  var depend = ''
  if (osType == 'darwin') {
    console.log('  💻 macOS detected')
    depend = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/1-mac-dependencies.sh'
  } 
  else {
    console.log('Your OS is currently unsupported :(')
    process.exit(1)
  }

  let getConfig = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/0-get-config.sh'
  let configErr = shell.exec(`curl -sL ${getConfig} | bash`).code
  
  let dependErr = shell.exec(`curl -sL ${depend} | bash`).code

  let baseInstall = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/2-install.sh'
  let baseErr = shell.exec(`curl -sL ${baseInstall} | bash`).code
  
  let deploy = 'https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/scripts/3-db-setup.sh'
  let deployErr = shell.exec(`curl -sL ${deploy} | bash`).code
  
  console.log('✅ customerOS successfully started!')
  console.log('🦦 To validate the service is reachable run the command =>  openline dev --ping customer-os')
  console.log('🦦 Visit http://localhost:10010 in your browser to play around with the graph API explorer')
}