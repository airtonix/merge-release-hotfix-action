import {Octokit} from '@octokit/rest'

import {Maybe} from '../types'

export type CreatePrResult = {
  number: number
  title: string
  body: string | null
  base: {sha: string; ref: string}
  head: {sha: string; ref: string}
}

type CreatePrFactoryProps = {
  client: Octokit
  owner: string
  repo: string
}

type CreatePrProps = {
  title: string
  body: string
  targetRef: string
  mergeRef: string
}

export function CreatePrFactory({client, owner, repo}: CreatePrFactoryProps) {
  return async function CreatePr({
    title,
    body,
    mergeRef,
    targetRef
  }: CreatePrProps): Promise<Maybe<CreatePrResult>> {
    const {data} = await client.pulls.create({
      owner,
      repo,
      title,
      body,
      base: targetRef,
      head: mergeRef
    })

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      base: {
        ref: data.base.ref,
        sha: data.base.sha
      },
      head: {
        ref: data.head.ref,
        sha: data.head.sha
      }
    }
  }
}
