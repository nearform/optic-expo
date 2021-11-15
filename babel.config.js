module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', '@babel/typescript'],
    plugins: ['react-native-reanimated/plugin'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  }
}
