module.exports = {
  preset: 'jest-expo/universal',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  projects: [
    { preset: 'jest-expo/ios', setupFiles: ['./jest.setup.js'] },
    { preset: 'jest-expo/android', setupFiles: ['./jest.setup.js'] },
  ],
}
