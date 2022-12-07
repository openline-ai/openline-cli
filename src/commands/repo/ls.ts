import {Command} from '@oclif/core'
import {getRepos} from '../../config/repo'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export default class RepoLs extends Command {
  static description = 'Get a list of all Openline projects accepting community contributions'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = []

  public async run(): Promise<void> {
    // const {args, flags} = await this.parse(RepoLs)

    const repos = getRepos()

    const table = new Table({
      head: [colors.cyan.bold('Project'), colors.cyan.bold('Github URL')],
    })

    table.push(
      ['cli', repos.baseUrl + repos.cli],
      ['contacts', repos.baseUrl + repos.contacts],
      ['customer-os', repos.baseUrl + repos.customerOs],
      ['hubspot-integration', repos.baseUrl + repos.hubspot],
      ['oasis', repos.baseUrl + repos.oasis],
      ['ui-kit', repos.baseUrl + repos.uiKit],
      ['voice', repos.baseUrl + repos.voice],
      ['webchat', repos.baseUrl + repos.webchat],
      ['website', repos.baseUrl + repos.website],
      ['zendesk-integration', repos.baseUrl + repos.zendesk],
    )

    console.log(table.toString())
  }
}
