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

export function fromTemplate(template = '', context = {}): string {
  return Object.entries(context).reduce((result, [key, value]) => {
    return result.replace(
      new RegExp(`{{${key}}}`, 'g'),
      (value ?? '').toString()
    )
  }, `${template}`)
}

export function slugify(text: string, sep = '-'): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/&/g, ' and ') // Replace & with 'and'
    .replace(/--+/g, ' ') // Replace multiple - with single -
    .replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g, ' ') // Remove all non-word chars
    .replace(/\s+/g, sep) // Replace spaces with -
    .replace(new RegExp(`^${sep}+`), '') // Trim - from start of text
    .replace(new RegExp(`${sep}+$`), '') // Trim - from end of text
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
  const title = fromTemplate(prTitleTemplate, templateContext)
  const body = fromTemplate(prBodyTemplate, templateContext)
  const mergeBranchRef = fromTemplate(prBranchTemplate, templateContext)

  return {
    title,
    body,
    mergeBranchRef
  }
}
