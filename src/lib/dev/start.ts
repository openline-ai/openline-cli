import {logTerminal} from '../logs'
import {installDependencies as installMacDependencies} from '../mac-dependency-check'
import {installDependencies as installLinuxDependencies} from '../linux-dependency-check'
import * as colima from './colima'
import * as k3d from './k3d'

import * as shell from 'shelljs'
import {getConfig} from '../../config/dev'
import {installNeo4j} from './neo4j'
import {installPostgresql} from './postgres'
import { getPlatform } from '../dependencies'

export function cleanupSetupFiles() :void {
  // cleanup old setup files
  const config = getConfig()
  const dirCheck = shell.exec(`ls ${config.setupDir}`, {silent: true}).code === 0
  if (dirCheck) shell.exec(`rm -r ${config.setupDir}`, {silent: true})
}

export function dependencyCheck(verbose: boolean) :boolean {
  // macOS check
  switch (process.platform) {
    case 'darwin':
      return installMacDependencies(verbose);
    case 'linux':
      return installLinuxDependencies(verbose);
    default:
      logTerminal('ERROR', 'Operating system unsupported at this time')
      return false

  }
}

export function startDevServer(verbose: boolean) :boolean {
  const isRunning = colima.runningCheck()
  if (!isRunning) {
    logTerminal('INFO', 'initiating Openline dev server...')
    switch(getPlatform()) {
      case "mac":
        return colima.startColima(verbose)
        
      case "linux":
        return k3d.startk3d(verbose)
        
    }
    
  }

  // set permissions on kube config
  const updatePermissions = 'chmod og-r ~/.kube/config'
  if (verbose) logTerminal('EXEC', updatePermissions)
  shell.exec(updatePermissions, {silent: true})

  return true
}

export function installDatabases(verbose: boolean, location: string | undefined) :boolean {
  if (verbose) logTerminal('INFO', 'installing customerOS databases...')
  installNeo4j(verbose, location)
  installPostgresql(verbose, location)

  logTerminal('SUCCESS', 'customerOS databases succesfully installed')
  return true
}
