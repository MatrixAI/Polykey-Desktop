import path from 'path'

module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '/src/renderer')
      }
    },
    entry: {
      app: './src/renderer/index.ts'
    }
  }
}
