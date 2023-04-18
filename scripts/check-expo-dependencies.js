module.exports = async ({ context, github, fetch, expoVersion, prTitle }) => {
  const expoVersionSanitized = expoVersion.replaceAll('~', '')

  const majorExpoVersion = `${expoVersionSanitized.substring(
    0,
    expoVersionSanitized.indexOf('.')
  )}.0.0`

  const expoData = await fetch('https://api.expo.dev/v2/versions/latest')
  const expoDataOutput = await expoData.json()

  const relatedPackages = expoDataOutput.data.sdkVersions[majorExpoVersion]

  const shouldClosePR = [
    ...Object.keys(relatedPackages),
    'react',
    'react-native',
    'expo',
  ].some(dependency => prTitle.includes(dependency))

  if (shouldClosePR) {
    await github.rest.pulls.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      state: 'closed',
    })
    return true
  }

  return false
}
