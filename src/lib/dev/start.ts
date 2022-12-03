import {logTerminal} from '../logs'
import {installDependencies} from '../mac-dependency-check'

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
