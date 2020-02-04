module.exports = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Quasar is dead (#99)
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
<<<<<<< HEAD
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
=======
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
=======
>>>>>>> Quasar is dead (#99)
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
<<<<<<< HEAD
  
>>>>>>> Install vue PWA plugin (#77)
=======
};
>>>>>>> Quasar is dead (#99)
