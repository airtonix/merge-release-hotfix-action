import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'

import {Maybe} from './types'

type FindBranchPrFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}
type FindPrProps = {
  targetRef: string
  branchName: string
}
export type FindBranchPrResult = {
  number: number
}

export function FindBranchPrFactory({
  client,
  owner,
  repo
}: FindBranchPrFactoryProps) {
  return async function findBranchPr({
    targetRef,
    branchName
  }: FindPrProps): Promise<Maybe<FindBranchPrResult>> {
    const {data} = await client.pulls.list({
      repo,
      owner,
      base: targetRef
    })

    const pr = data.find(
      item => item.head.ref === branchName && item.base.ref === targetRef
    )

    core.debug(`Found: ${pr?.number}`)

    return pr
      ? {
          number: pr.number
        }
      : undefined
  }
}
