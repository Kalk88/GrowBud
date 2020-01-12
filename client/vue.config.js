module.exports = {
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          swSrc: 'src/sw.js',
        }
    },

    pluginOptions: {
      quasar: {
        treeShake: true
      }
    },
    transpileDependencies: [
      /[\\/]node_modules[\\/]quasar[\\/]/,
    ]

  }