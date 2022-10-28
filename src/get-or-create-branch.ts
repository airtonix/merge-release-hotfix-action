import * as core from '@actions/core'
import {Api} from './api'
import {RequestError} from '@octokit/request-error'

type GetOrCreateBranchProps = {
  /** api wrapper */
  api: Api
  /** gitref to create branch from */
  sourceRef: string
  /** branch name to ensure exists */
  mergeBranchRef: string
}

export async function getOrCreateBranch({
  api,
  sourceRef,
  mergeBranchRef
}: GetOrCreateBranchProps): Promise<
  ReturnType<Api['getBranch'] | Api['createBranch']>
> {
  try {
    // https://docs.github.com/en/rest/branches/branches#get-a-branch
    return await api.getBranch(mergeBranchRef)
  } catch (error) {
    if (
      error instanceof RequestError &&
      error.name === 'HttpError' &&
      error.status === 404
    ) {
      // https://docs.github.com/en/rest/git/refs#create-a-reference
      return await api.createBranch(mergeBranchRef, sourceRef)
    } else {
      core.error('Error while creating new branch')
      if (typeof error === 'string') throw Error(error)
      if (error instanceof Error) throw error
    }
  }
}
