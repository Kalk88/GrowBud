module.exports = {
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          swSrc: 'src/firebase-messaging-sw.js',
          swDest: 'firebase-messaging-sw.js'
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
  