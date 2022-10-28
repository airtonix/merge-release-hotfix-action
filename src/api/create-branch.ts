import {Maybe} from './types'
import {Octokit} from '@octokit/rest'

type CreateBranchFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}

export type CreateBranchResult = {
  sha: string
  ref: string
}

export function CreateBranchFactory({
  client,
  owner,
  repo
}: CreateBranchFactoryProps) {
  return async function CreateBranch(
    branchName: string,
    sourceRef: string
  ): Promise<Maybe<CreateBranchResult>> {
    const {data} = await client.git.createRef({
      ref: `refs/heads/${branchName}`,
      sha: sourceRef,
      owner,
      repo
    })

    return {
      sha: data.object.sha,
      ref: data.ref
    }
  }
}
