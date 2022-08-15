module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', '@babel/typescript'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  }
}
