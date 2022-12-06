import {Command, Flags} from '@oclif/core'
import * as colima from '../../lib/dev/colima'
import * as k3d from '../../lib/dev/k3d'
import {getPlatform} from '../../lib/dependencies'

export default class DevStop extends Command {
  static description = 'Stops the Openline development server & saves current config.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = []

  public async run(): Promise<void> {
    const {flags} = await this.parse(DevStop)

    switch (getPlatform()) {
    case 'mac':
      colima.stopColima(flags.verbose)
      break
    case 'linux':
      k3d.stopK3d(flags.verbose)
      break
    }
  }
}
