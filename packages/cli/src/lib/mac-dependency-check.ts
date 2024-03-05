import * as mac from './dependencies'
import * as colors from 'colors'
const Table = require('cli-table') // eslint-disable-line unicorn/prefer-module

export function installDependencies(verbose: boolean): boolean {
  const notInstalled = colors.red.bold('No')
  const installed = colors.bold.green('Yes')
  // Checking if dependency installed
  const xcode = mac.xcodeCheck() ? installed : notInstalled
  const brew = mac.brewCheck() ? installed : notInstalled
  const git = mac.gitCheck() ? installed : notInstalled
  const docker = mac.dockerCheck() ? installed : notInstalled
  const colima = mac.colimaCheck() ? installed : notInstalled
  const kubectl = mac.kubeCheck() ? installed : notInstalled
  const helm = mac.helmCheck() ? installed : notInstalled
  const netcat = mac.netcatCheck() ? installed : notInstalled
  const jq = mac.jqCheck() ? installed : notInstalled
  const wget = mac.wgetCheck() ? installed : notInstalled
  const temporal = mac.temporalCheck() ? installed : notInstalled

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
    ['wget', wget],
    ['temporal', temporal],
  )

  if (verbose) {
    console.log(table.toString())
  }

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
  if (wget === notInstalled) mac.installWget()
  if (temporal === notInstalled) mac.installTemporal()


  return true
}
