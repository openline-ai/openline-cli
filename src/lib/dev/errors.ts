import * as shell from 'shelljs'

export function logError(desc: string, suggestion: string, ref?: string) :void {
  console.log('❌', desc)
  console.log(suggestion)
  if (ref) {
    console.log(ref)
  } else {
    console.log('Report this issue => https://github.com/openline-ai/openline-cli/issues/new/choose')
  }

  shell.exec('rm -r openline-setup', {silent: true})
  console.log('')
  console.log('🦦 shutting down dev server...')
  shell.exec('colima delete -f', {silent: true})
}
