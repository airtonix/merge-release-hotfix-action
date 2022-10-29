import * as core from '@actions/core'
import {exec} from '@actions/exec'

import {slugify} from './content'
import type {Api} from './api'
import type {FindBranchPrResult} from './api/find-branch-pr'
import type {TemplateFactory} from './content'
import {CreatePrResult} from './api/create-pr'

type CreateOrUpdatePrProps = {
  /** gitref from where we should pull updates from */
  sourceRef: string
  /** gitref we want to merge into */
  targetRef: string
}
type CreateOrUpdatePrResult = Promise<
  FindBranchPrResult | CreatePrResult | undefined
>

export async function createOrUpdatePr(
  api: Api,
  templates: TemplateFactory,
  {sourceRef, targetRef}: CreateOrUpdatePrProps
): CreateOrUpdatePrResult {
  const title = templates.renderTitle({source: sourceRef, target: targetRef})
  const body = templates.renderTitle({source: sourceRef, target: targetRef})
  const mergeBranchRef = templates.renderTitle({
    source: sourceRef,
    target: slugify(sourceRef)
  })

  const pr = await api.findBranchPr({
    targetRef,
    branchName: mergeBranchRef
  })

  if (!pr) {
    core.info(
      `createOrUpdatePr.createPr: ${sourceRef} -> ${targetRef} as ${mergeBranchRef}`
    )
    return await api.createPr({
      title,
      body,
      targetRef,
      mergeRef: mergeBranchRef
    })
  }

  core.info(
    `createOrUpdatePr.updatePr: ${sourceRef} -> ${targetRef} as ${mergeBranchRef}`
  )
  await exec('git', ['fetch'])
  await exec('git', ['checkout', mergeBranchRef])
  await exec('git', ['merge', sourceRef])
  await exec('git', ['push', 'origin', 'HEAD'])

  return pr
}
