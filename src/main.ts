import * as core from '@actions/core'
import {context} from '@actions/github'
import {createApi} from './api'
import {createContent} from './create-content'
import {createOrUpdatePr} from './create-or-update-pr'
import {getOrCreateBranch} from './get-or-create-branch'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('Token')
    const targetRefs: string = core.getInput('TargetRefs')
    const sourceRef: string = core.getInput('sourceRef')
    const prBranchTemplate: string = core.getInput('prBranchTemplate')
    const prTitleTemplate: string = core.getInput('prTitleTemplate')
    const prBodyTemplate: string = core.getInput('prBodyTemplate')
    const owner = context.repo.owner
    const repo = context.repo.repo

    const api = createApi({
      owner,
      repo,
      token
    })

    /**
     * Convert string into unique array of target branches to
     * creates Prs for
     */
    const targetRefCollection = Array.from(
      new Set(targetRefs.split(',').map(branch => branch.trim()))
    )

    for (const targetRef of targetRefCollection) {
      const {body, mergeBranchRef, title} = createContent({
        prBodyTemplate,
        prBranchTemplate,
        prTitleTemplate,
        sourceRef,
        targetRef
      })

      await getOrCreateBranch({
        api,
        sourceRef,
        mergeBranchRef
      })

      await createOrUpdatePr({
        api,
        title,
        body,
        mergeBranchRef,
        sourceRef,
        targetRef
      })
    }

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
