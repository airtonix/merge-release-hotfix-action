import type {TemplateExecutor} from 'lodash'
import kebabCase from 'lodash/kebabCase'
import template from 'lodash/template'

type CreateContentProps = {
  prTitleTemplate?: string
  prBodyTemplate?: string
  prBranchTemplate?: string
}
type CreateContentResult = {
  renderTitle: TemplateExecutor
  renderBody: TemplateExecutor
  renderBranch: TemplateExecutor
}

export function slugify(text: string): string {
  return kebabCase(text.replace(/&/g, '-and-'))
}

export function createContent({
  prTitleTemplate,
  prBodyTemplate,
  prBranchTemplate
}: CreateContentProps): CreateContentResult {
  const templateSettings = {
    interpolate: /{{([\s\S]+?)}}/g
  }
  // the merge branch to create
  const renderTitle = template(prTitleTemplate || '', templateSettings)
  const renderBody = template(prBodyTemplate || '', templateSettings)
  const renderBranch = template(prBranchTemplate || '', templateSettings)

  return {
    renderTitle,
    renderBody,
    renderBranch
  }
}
