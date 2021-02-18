module.exports = {
  preset: 'jest-expo/universal',
  projects: [{ preset: 'jest-expo/ios' }, { preset: 'jest-expo/android' }],
}
