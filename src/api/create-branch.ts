import {Maybe} from './types'
import {getOctokit} from '@actions/github'

type CreateBranchFactoryProps = {
  client: ReturnType<typeof getOctokit>
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
