import {CreateBranchFactory} from './create-branch'
import {CreatePrFactory} from './create-pr'
import {FindBranchPrFactory} from './find-branch-pr'
import {GetBranchFactory} from './get-branch'
import {getOctokit} from '@actions/github'

export type CreateClientProps = {
  token: string
  owner: string
  repo: string
}

type CreateClientResult = {
  getBranch: ReturnType<typeof GetBranchFactory>
  createBranch: ReturnType<typeof CreateBranchFactory>
  createPr: ReturnType<typeof CreatePrFactory>
  findBranchPr: ReturnType<typeof FindBranchPrFactory>
}

export function createApi({
  token,
  owner,
  repo
}: CreateClientProps): CreateClientResult {
  const client = getOctokit(token)
  return {
    createBranch: CreateBranchFactory({client, owner, repo}),
    getBranch: GetBranchFactory({client, owner, repo}),
    createPr: CreatePrFactory({client, owner, repo}),
    findBranchPr: FindBranchPrFactory({client, owner, repo})
  }
}

export type Api = ReturnType<typeof createApi>
