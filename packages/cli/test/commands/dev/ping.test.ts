import {expect, test} from '@oclif/test'

describe('dev:ping', () => {
  test
  .stdout()
  .command(['dev:ping'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['dev:ping', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
