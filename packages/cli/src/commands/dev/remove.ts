import {Command, Flags} from '@oclif/core'
import * as colima from '../../lib/dev/colima'
import * as k3d from '../../lib/dev/k3d'
import {getPlatform} from '../../lib/dependencies'

export default class DevRemove extends Command {
  static description = 'Removes the Openline development server.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = []

  public async run(): Promise<void> {
    const {flags} = await this.parse(DevRemove)

    switch (getPlatform()) {
    case 'mac':
      colima.removeColima(flags.verbose)
      break
    case 'linux':
      k3d.removeK3d(flags.verbose)
      break
    }
  }
}
