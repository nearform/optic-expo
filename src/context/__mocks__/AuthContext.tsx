export const useAuth = jest.fn(() => {
  return {
    loading: false,
    user: {
      name: 'John',
      uid: '11-22-33-44',
      idToken: '1213',
    },
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
  }
})
