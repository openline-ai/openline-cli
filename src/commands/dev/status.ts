import {Command, Flags} from '@oclif/core'
import * as checks from '../../lib/checks/openline'
import * as shell from 'shelljs'

export default class DevStatus extends Command {
  static description = 'view current status of all Openline services'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevStatus)

    let verbose = flags.verbose

    let isInstalled = checks.installCheck()
    if (isInstalled) {
      this.log('🦦 k8s cluster')
      shell.exec('kubectl get services')
      this.log('')
      shell.exec('kubectl get services -n openline')
      this.log('')
      this.log('🦦 k8s pods: openline')
      shell.exec('kubectl get pods -n openline -o wide')
      this.log('')
      this.log('🦦 k8s persistent volumes')
      shell.exec('kubectl get pv')
    }
    else {
      console.log('❌ Openline services are not running')
      console.log('🦦 Try running => openline dev start customer-os')
    }
  }
}
