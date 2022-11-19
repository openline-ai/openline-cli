import {Command, Flags} from '@oclif/core'
import {getHelpFlagAdditions} from '@oclif/core/lib/help'
import * as shell from 'shelljs'
import {dependencies} from '../../checks/mac'

export default class Dev extends Command {
  static description = 'starts and stops local development server for openline applications'

  static examples = []

public async run(): Promise<void> {
  const {args, flags} = await this.parse(Dev)}
}