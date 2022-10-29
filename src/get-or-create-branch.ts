import {slugify} from './content'
import type {Api} from './api'
import type {TemplateFactory} from './content'

type GetOrCreateBranchProps = {
  /** api wrapper */
  /** gitref to create branch from */
  sourceRef: string
  /** branch name to ensure exists */
  targetRef: string
}

export async function getOrCreateBranch(
  api: Api,
  templates: TemplateFactory,
  {sourceRef, targetRef}: GetOrCreateBranchProps
): Promise<ReturnType<Api['getBranch'] | Api['createBranch']>> {
  const mergeBranchRef = templates.renderBranch({
    source: slugify(sourceRef),
    target: slugify(targetRef)
  })
  const sourceBranch = await api.getBranch(sourceRef)
  if (!sourceBranch) throw Error('Source branch not found')

  const branch = await api.createBranch({
    branchName: mergeBranchRef,
    sourceSha: sourceBranch.sha
  })

  return branch
}
