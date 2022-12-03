import {logTerminal} from '../logs'
import {installDependencies} from '../mac-dependency-check'
import * as colima from './colima'
import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {installNeo4j} from './neo4j'
import {installPostgresql} from './postgres'

export function cleanupSetupFiles() :void {
  // cleanup old setup files
  const config = getConfig()
  const dirCheck = shell.exec(`ls ${config.setupDir}`, {silent: true}).code === 0
  if (dirCheck) shell.exec(`rm -r ${config.setupDir}`, {silent: true})
}

export function dependencyCheck(verbose: boolean) :boolean {
  // macOS check
  const isDarwin = process.platform === 'darwin'
  if (!isDarwin) {
    logTerminal('ERROR', 'Operating system unsupported at this time')
    return false
  }

  // mac dependency check & install missing dependencies
  return installDependencies(verbose)
}

export function startDevServer(verbose: boolean) :boolean {
  const isRunning = colima.runningCheck()
  if (!isRunning) {
    logTerminal('INFO', 'initiating Openline dev server...')
    colima.startColima(verbose)
  }

  // set permissions on kube config
  const updatePermissions = 'chmod og-r ~/.kube/config'
  if (verbose) logTerminal('EXEC', updatePermissions)
  shell.exec(updatePermissions, {silent: true})

  return true
}

export function installDatabases(verbose: boolean, location: string) :boolean {
  logTerminal('INFO', 'installing customerOS databases...')
  installNeo4j(verbose, location)
  installPostgresql(verbose, location)

  return true
}
