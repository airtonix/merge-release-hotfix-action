import * as core from '@actions/core'

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
  core.info(`Checking if mergeBranch exists ${mergeBranchRef}`)
  const potentiallyExistingBranch = await api.getBranch(mergeBranchRef)
  if (potentiallyExistingBranch) {
    core.info(`found mergeBranch ${mergeBranchRef}`)
    return potentiallyExistingBranch
  }

  core.info(`find sha of sourceRef ${sourceRef}`)
  const sourceBranch = await api.getBranch(sourceRef)
  if (!sourceBranch) throw Error('Source branch not found')

  core.info(`found sha of sourceRef ${sourceRef}: ${sourceBranch.sha}`)

  core.info(`create branch of sourceRef ${sourceRef}: ${sourceBranch.sha}`)
  const branch = await api.createBranch({
    branchName: mergeBranchRef,
    sourceSha: sourceBranch.sha
  })
  if (!branch)
    throw new Error(`problem creating new mergeBranch ${mergeBranchRef}`)

  core.info(`new mergeBranch created ${mergeBranchRef}: ${branch.sha}`)

  return branch
}
