import * as core from '@actions/core'
import {Api} from './api'
import {exec} from '@actions/exec'

type CreateOrUpdatePrProps = {
  /** api wrapper */
  api: Api
  /** desired PR title */
  title: string
  /** desired PR Body */
  body: string
  /** gitref from where we should pull updates from */
  sourceRef: string
  /** gitref we want to merge into */
  targetRef: string
  /** our branch that we want to merge into targetRef */
  mergeBranchRef: string
}
type CreateOrUpdatePrResult = Promise<void>

export async function createOrUpdatePr({
  api,
  title,
  body,
  sourceRef,
  targetRef,
  mergeBranchRef
}: CreateOrUpdatePrProps): CreateOrUpdatePrResult {
  const pr = await api.findBranchPr({
    targetRef
  })

  if (!pr) {
    core.info(
      `createOrUpdatePr.createPr: ${sourceRef} -> ${targetRef} as ${mergeBranchRef}`
    )
    await api.createPr({
      title,
      body,
      targetRef,
      mergeRef: mergeBranchRef
    })
    return
  }

  core.info(
    `createOrUpdatePr.updatePr: ${sourceRef} -> ${targetRef} as ${mergeBranchRef}`
  )
  await exec('git', ['fetch'])
  await exec('git', ['checkout', mergeBranchRef])
  await exec('git', ['merge', sourceRef])
  await exec('git', ['push', 'origin', 'HEAD'])
}
