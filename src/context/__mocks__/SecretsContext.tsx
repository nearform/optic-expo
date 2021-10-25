export const useSecrets = jest.fn(() => {
  return {
    secrets: [],
    add: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }
})
