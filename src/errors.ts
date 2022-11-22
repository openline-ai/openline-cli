
export function logError(desc: string, suggestion: string, ref?: string) {
    console.log('❌', desc)
    console.log(suggestion)
    console.log(ref)
}