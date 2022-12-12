import * as colors from 'colors' // eslint-disable-line no-restricted-imports

export function logTerminal(type: string, description: string, location?: string) :void {
  if (type.toUpperCase() === 'ERROR') {
    type = colors.red.bold(`[${type.toUpperCase()}]`)
  } else if (type.toUpperCase() === 'SUCCESS') {
    type = '🦦 '
  } else if (type.toUpperCase() === 'EXEC') {
    type = colors.grey(`[${type.toUpperCase()}]`)
    description = colors.grey(description)
  } else {
    type = colors.cyan(`[${type.toUpperCase()}]`)
  }

  console.log(type, description)

  if (location) {
    location = colors.italic(location)
    console.log(location)
  }
}
