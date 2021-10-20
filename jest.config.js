module.exports = {
  preset: 'jest-expo/universal',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  projects: [
    {
      preset: 'jest-expo/ios',
      setupFilesAfterEnv: ['./jest.setup.js'],
    },
    {
      preset: 'jest-expo/android',
      setupFilesAfterEnv: ['./jest.setup.js'],
    },
  ],
}
