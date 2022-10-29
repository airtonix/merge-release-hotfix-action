import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'

import {Maybe} from '../types'

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
  title: string
  body: string | null
  base: {sha: string; ref: string}
  head: {sha: string; ref: string}
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
          number: pr.number,
          title: pr.title,
          body: pr.body,
          base: {
            ref: pr.base.ref,
            sha: pr.base.sha
          },
          head: {
            ref: pr.head.ref,
            sha: pr.head.sha
          }
        }
      : undefined
  }
}
