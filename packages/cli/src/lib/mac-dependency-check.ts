import * as mac from './dependencies'
import * as colors from 'colors'
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export function installDependencies(verbose: boolean) :boolean {
  // Checking if dependency installed
  const xcode = mac.xcodeCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const brew = mac.brewCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const git = mac.gitCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const docker = mac.dockerCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const colima = mac.colimaCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const kubectl = mac.kubeCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const helm = mac.helmCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const netcat = mac.netcatCheck() ? colors.bold.green('Yes') : colors.red.bold('No')
  const jq = mac.jqCheck() ? colors.bold.green('Yes') : colors.red.bold('No')

  const table = new Table({
    head: [colors.cyan.bold('Dependency'), colors.cyan.bold('Installed?')],
  })

  table.push(
    ['xcode', xcode],
    ['brew', brew],
    ['colima', colima],
    ['docker', docker],
    ['git', git],
    ['helm', helm],
    ['kubectl', kubectl],
    ['netcat', netcat],
    ['jq', jq],
  )

  if (verbose) {
    console.log(table.toString())
  }

  const notInstalled = colors.red.bold('No')

  // install missing dependencies
  if (xcode === notInstalled) mac.installXcode()
  if (brew === notInstalled) mac.installBrew()
  if (colima === notInstalled) mac.installColima()
  if (docker === notInstalled) mac.installDocker()
  if (git === notInstalled) mac.installGit()
  if (helm === notInstalled) mac.installHelm()
  if (kubectl === notInstalled) mac.installKube()
  if (netcat === notInstalled) mac.installNetcat()
  if (jq === notInstalled) mac.installJq()


  return true
}
