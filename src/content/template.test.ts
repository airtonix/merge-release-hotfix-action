import {createTemplateFactory, slugify} from './templates'

describe('templates', () => {
  it('renders title', () => {
    const templates = createTemplateFactory({
      prTitleTemplate: '{{source}} to {{target}}'
    })
    expect(templates.renderTitle({source: 1, target: 2})).toBe('1 to 2')
  })
  it('renders body', () => {
    const templates = createTemplateFactory({
      prBodyTemplate: '{{source}} to {{target}}'
    })
    expect(templates.renderBody({source: 1, target: 2})).toBe('1 to 2')
  })
  it('renders branch name', () => {
    const templates = createTemplateFactory({
      prBranchTemplate: '{{source}} to {{target}}'
    })
    expect(templates.renderBranch({source: 1, target: 2})).toBe('1 to 2')
  })
})

describe('slugify', () => {
  it('simple', () => {
    expect(slugify('ABC')).toBe('abc')
    expect(slugify('A B  C')).toBe('a-b-c')
    expect(slugify('123')).toBe('123')
    expect(slugify('1  2  3')).toBe('1-2-3')
  })
  it('branchnames', () => {
    expect(slugify('foo/bar----baz')).toBe('foo-bar-baz')
  })
})
