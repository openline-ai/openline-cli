import {Command, Flags} from '@oclif/core'
import * as shell from 'shelljs'

export default class DevPing extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = [
    {
      name: 'app',
      required: false,
      description: 'the Openline application you would like to ping',
      default: 'customer-os',
      options: ['customer-os'] 
    }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(DevPing)

    let health = shell.exec('curl localhost:10010/health', {silent: true})
    if (health.code == 0) {
      if (flags.verbose) {
        console.log(health.stdout)
      }
      console.log('✅ customerOS API is up and reachable')
      console.log('🦦 go to http://localhost:10010 in your browser to play around with the graph API explorer')
    }
    else {
      console.log('❌ customerOS API is not reachable')
      console.log('🦦 try running => openline dev start customer-os')
    }

  }
}
