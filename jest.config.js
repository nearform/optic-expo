module.exports = {
  preset: 'jest-expo/universal',
  projects: [
    { preset: 'jest-expo/ios', setupFiles: ['./jest.setup.js'] },
    { preset: 'jest-expo/android', setupFiles: ['./jest.setup.js'] },
  ],
}
