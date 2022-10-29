import * as core from '@actions/core'

import {Context} from './context/context'
import {createApi} from './api'
import {createOrUpdatePr} from './create-or-update-pr'
import {getOrCreateBranch} from './get-or-create-branch'
import {createContent, slugify} from './content'

async function run(): Promise<void> {
  try {
    const context = new Context()
    const token: string = core.getInput('GithubToken')
    const targetRefs: string = core.getInput('TargetRefs')
    const sourceRef: string = core.getInput('sourceRef')
    const prBranchTemplate: string = core.getInput('prBranchTemplate')
    const prTitleTemplate: string = core.getInput('prTitleTemplate')
    const prBodyTemplate: string = core.getInput('prBodyTemplate')
    const repo = context.repo.repo
    const owner = context.repo.owner

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
      const {renderBody, renderBranch, renderTitle} = createContent({
        prBodyTemplate,
        prBranchTemplate,
        prTitleTemplate
      })

      const mergeBranchRef = renderBranch({
        source: sourceRef,
        target: slugify(targetRef)
      })
      const title = renderTitle({
        source: sourceRef,
        target: targetRef
      })
      const body = renderBody({
        source: sourceRef,
        target: targetRef
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
