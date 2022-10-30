module.exports = {
  plugins: [
    'git-tag',
    'all-contributors',
    'first-time-contributor',
    'released',
    './tools/auto-oci-version-plugin.ts'
  ],
  owner: 'airtonix',
  repo: 'merge-release-hotfix-action',
  name: 'airtonix',
  email: 'airtonix@users.noreply.github.com',
  onlyPublishWithReleaseLabel: true
}
