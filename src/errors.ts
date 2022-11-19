
export function logError(desc: string, suggestion: string, ref?: string) {
    console.log('❌ Error:', desc)
    console.log(suggestion)
    console.log(ref)
}