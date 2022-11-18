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
    kill: Flags.boolean({
      char: 'k',
      description: 'kill all openline services'
    }),
    ping: Flags.string({
      description: 'service health check',
      char: 'p', 
      options: ['all', 'customer-os', 'oasis', 'contacts'], 
    }),
    start: Flags.string({
      description: 'start openline application', 
      options: ['all', 'customer-os', 'oasis', 'contacts'],  
    }),
    status: Flags.boolean({
      description: 'current status of kubernetes cluser',
    }),
    stop: Flags.boolean({
      description: 'stop openline applications', 
    })
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Dev)

    if ((flags.start) && (flags.stop)) {
      console.log('❌ Error:  only one flag can be set at a time')
    }
    else if (flags.start == 'customer-os') {
      let isRunning: boolean = runningCheck()
      if (isRunning == false) {
        console.log('🦦 starting customerOS...')
        let startCode = shell.exec('colima start --with-kubernetes --cpu 2 --memory 4 --disk 60', {silent: true})
        if (startCode.code == 0) {
          console.log('✅ Colima running')
          
          let isInstalled: boolean = installCheck()
          if (isInstalled == false) {
            console.log('🦦 installing customerOS...')
            installCustomerOs()
          } 
          else {
            console.log('✅ customerOS is running...')
          }
        }
        else {
          console.log('❌ Colima failed to start')
          console.log(startCode.stderr)
        }
      }
      else {
        let isInstalled: boolean = installCheck()
        if (isInstalled == false) {
          console.log('🦦 installing customerOS...')
          installCustomerOs()
          } 
        else {
          console.log('✅ customerOS is running...')
        }
      }
    }

    else if (flags.stop) {
      let stopCode = shell.exec('colima stop', {silent:true})
      if (stopCode.code == 0) {
        console.log('✅ All Openline services have been stopped')
        console.log('✅ Configuration has been saved and will be re-applied on next restart')
      }
      else {
        console.log('❌ problem stopping Openline services')
        console.log(stopCode.stderr)
      }
    }
      
    else if (flags.kill) {
      shell.exec('colima kubernetes reset', {silent: true})
      let killcode = shell.exec('colima stop', {silent: true})
      if (killcode.code == 0) {
        console.log('✅ All Openline services have been stopped and deleted')
      }
      else {
        console.log('❌ Problem killing openline services')
        console.log(killcode.stderr)
      }
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
    
    else if (flags.status) {
      let isUp = shell.exec('kubectl get services', {silent: true})
      if (isUp.code == 0) {
        console.log('🦦 k8s cluster')
        shell.exec('kubectl get services')
        console.log('')
        console.log('🦦 k8s pods: openline')
        shell.exec('kubectl get pods -n openline -o wide')
        console.log('🦦 k8s pods: kube-system')
        shell.exec('kubectl get pods -n kube-system -o wide')
        console.log('')
        console.log('🦦 k8s persistent volumes')
        shell.exec('kubectl get pv')
      }
      else {
        console.log('❌ Openline services are not running')
        console.log('🦦 Please run [openline dev --start] to start services')
      }
    }
  }
}

function runningCheck() :boolean {
  if (shell.exec('colima status', {silent: true}).code == 0) {
    return true
  }
  else {
    return false
  }
}

function installCheck() :boolean {
  if (shell.exec('kubectl get ns openline', {silent: true}).code == 0) {
    return true
  }
  else {
    return false
  }
}

function installCustomerOs() {
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
  
  console.log('')
  console.log('✅ customerOS successfully started!')
  console.log('🦦 To validate the service is reachable run the command =>  openline dev --ping customer-os')
  console.log('🦦 Visit http://localhost:10010 in your browser to play around with the graph API explorer')
  shell.exec('open http://localhost:10010')
}