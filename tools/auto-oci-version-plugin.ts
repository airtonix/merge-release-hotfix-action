import {Auto, execPromise} from '@auto-it/core'
import type {IPlugin} from '@auto-it/core'
import {loadPackageJson} from '@auto-it/package-json-utils'

export default class OciGitTagsPlugin implements IPlugin {
  name = 'oci-git-tags'

  /** Tap into auto plugin points. */
  apply(auto: Auto): void {
    /** Log the version */
    const logVersion = (version: string): void => {
      auto.logger.log.info(`Would have published: ${version}`)
    }

    auto.hooks.afterVersion.tapPromise({name: this.name}, async ({dryRun}) => {
      const {version} = await loadPackageJson()

      const versions = [
        version.split('.').slice(0, 3).join('.'),
        version.split('.').slice(0, 2).join('.'),
        version.split('.').slice(0, 1).join('.')
      ]
      if (dryRun) {
        versions.map(logVersion)
        return
      }
      await Promise.all(
        versions.map(async tag =>
          execPromise('git', ['tag', tag, '-f', 'HEAD^', '-am', tag])
        )
      )
    })
  }
}
