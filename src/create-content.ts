import kebabCase from 'lodash/fp/kebabCase'
import template from 'lodash/fp/template'

type CreateContentProps = {
  sourceRef: string
  targetRef: string
  prTitleTemplate: string
  prBodyTemplate: string
  prBranchTemplate: string
}
type CreateContentResult = {
  title: string
  body: string
  mergeBranchRef: string
}

export function slugify(text: string): string {
  return kebabCase(text.replace(/&/g, '-and-'))
}

export function createContent({
  sourceRef,
  targetRef,
  prTitleTemplate,
  prBodyTemplate,
  prBranchTemplate
}: CreateContentProps): CreateContentResult {
  const templateContext = {
    source: slugify(sourceRef),
    target: targetRef
  }

  // the merge branch to create
  const title = template(prTitleTemplate)(templateContext)
  const body = template(prBodyTemplate)(templateContext)
  const mergeBranchRef = template(prBranchTemplate)(templateContext)

  return {
    title,
    body,
    mergeBranchRef
  }
}
