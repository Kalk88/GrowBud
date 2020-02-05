module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
      }
    }
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/firebase-messaging-sw.js",
      swDest: "firebase-messaging-sw.js"
    }
  }
};
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
    }
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/firebase-messaging-sw.js",
      swDest: "firebase-messaging-sw.js"
    }
  }

};
