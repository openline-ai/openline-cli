import * as deps from './dependencies'
import * as colors from 'colors' // eslint-disable-line no-restricted-imports
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export function installDependencies(verbose: boolean) :boolean {
  // Checking if dependency installed
  const git = deps.gitCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const docker = deps.dockerCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const colima = deps.colimaCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const kubectl = deps.kubeCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const helm = deps.helmCheck() ? colors.bold.green('Yes') : colors.red.bold('No')

  const table = new Table({
    head: [colors.cyan.bold('Dependency'), colors.cyan.bold('Installed?')],
  })

  table.push(
    ['colima', colima],
    ['docker', docker],
    ['git', git],
    ['helm', helm],
    ['kubectl', kubectl],
  )

  if (verbose) {
    console.log(table.toString())
  }

  const notInstalled = colors.red.bold('No')

  // install missing dependencies
  if (colima === notInstalled) deps.installColima()
  if (docker === notInstalled) deps.installDocker()
  if (git === notInstalled) deps.installGit()
  if (helm === notInstalled) deps.installHelm()
  if (kubectl === notInstalled) deps.installKube()

  return true
}
