import {Command} from '@oclif/core'
import {getRepos} from '../../config/repo'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export default class Repo extends Command {
  static description = 'Get the GitHub repo for an Openline project'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = [
    {
      name: 'project',
      required: true,
      description: 'the Openline project you would like to view',
      options: [
        'cli',
        'customer-os',
        'hubspot-integration',
        'ui-kit',
        'web-chat',
        'website',
        'zendesk-integration',
      ],
    },
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(Repo)
    const repos = getRepos()

    const table = new Table({
      head: [colors.cyan.bold('Project'), colors.cyan.bold('Github URL')],
    })

    const project = args.project.toLowerCase()
    switch (project) {
    case 'cli':
      table.push(
        ['cli', repos.baseUrl + repos.cli],
      )
      console.log(table.toString())
      break

    case 'customer-os':
      table.push(
        ['customer-os', repos.baseUrl + repos.customerOs],
      )
      console.log(table.toString())
      break

    case 'hubspot-integration':
      table.push(
        ['hubspot-integration', repos.baseUrl + repos.hubspot],
      )
      console.log(table.toString())
      break

    case 'ui-kit':
      table.push(
        ['ui-kit', repos.baseUrl + repos.uiKit],
      )
      console.log(table.toString())
      break

    case 'website':
      table.push(
        ['website', repos.baseUrl + repos.website],
      )
      console.log(table.toString())
      break

    case 'web-chat':
      table.push(
        ['webchat', repos.baseUrl + repos.webchat],
      )
      console.log(table.toString())
      break

    case 'zendesk-integration':
      table.push(
        ['zendesk-integration', repos.baseUrl + repos.zendesk],
      )
      console.log(table.toString())
      break
    }
  }
}
