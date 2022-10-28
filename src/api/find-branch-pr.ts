import * as core from '@actions/core'
import {Maybe} from './types'
import {Octokit} from '@octokit/rest'

type FindBranchPrFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}
type FindPrProps = {
  targetRef: string
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
    targetRef
  }: FindPrProps): Promise<Maybe<FindBranchPrResult>> {
    const {data} = await client.pulls.list({
      repo,
      owner,
      base: targetRef
    })

    core.debug(`Search for PR related to ${targetRef}`)
    for (const pr of data) {
      core.debug(
        `PR: [${pr.number}]: head: ${pr.head.ref} base: ${pr.base.ref}`
      )
    }

    const pr = data.find(item => {
      item.head.ref === targetRef
    })

    core.debug(`Found: ${pr?.number}`)

    return pr
      ? {
          number: pr.number
        }
      : undefined
  }
}
