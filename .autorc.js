// auto configuration
// https://intuit.github.io/auto/docs/configuration/autorc
module.exports = {
  baseBranch: 'main',
  onlyPublishWithReleaseLabel: true,
  //can't use magic-zero plugin yet:
  // https://github.com/intuit/auto/issues/1932
  plugins: ['npm', 'first-time-contributor', 'all-contributors', 'released']
}
