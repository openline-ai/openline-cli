import * as shell from 'shelljs'

export function logError(desc: string, suggestion: string, ref?: string) {
    console.log('❌', desc)
    console.log(suggestion)
    console.log(ref)

    console.log('')
    console.log('🦦 shutting down dev server...')
    shell.exec('colima delete -f')
}