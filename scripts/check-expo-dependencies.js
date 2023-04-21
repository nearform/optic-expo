module.exports = async ({ context, github, fetch, dependencyNames }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expoVersion = require('../package.json').dependencies.expo
  const expoVersionSanitized = expoVersion.replace(/^[~^]/g, '')

  const majorExpoVersion = `${expoVersionSanitized.substring(
    0,
    expoVersionSanitized.indexOf('.')
  )}.0.0`

  const expoData = await fetch('https://api.expo.dev/v2/versions/latest')
  const expoDataOutput = await expoData.json()

  const { relatedPackages } = expoDataOutput.data.sdkVersions[majorExpoVersion]
  const dependencyNamesList = dependencyNames.split(',')

  const shouldClosePR = [
    ...Object.keys(relatedPackages),
    'react',
    'react-dom',
    'react-native',
    'expo',
  ].some(
    // checks if the list of dependencies being updated contains a related package
    package => dependencyNamesList.includes(package)
  )

  if (shouldClosePR) {
    // close PR
    await github.rest.pulls.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      state: 'closed',
    })

    // cancel workflow
    await github.rest.actions.cancelWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: github.run_id,
    })
  }
}
