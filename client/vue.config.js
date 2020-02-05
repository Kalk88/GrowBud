module.exports = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Quasar is dead (#99)
=======
>>>>>>> d181903ae239975aeef54a7686b788d2ccc5190f
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d181903ae239975aeef54a7686b788d2ccc5190f
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
<<<<<<< HEAD
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
=======
>>>>>>> d181903ae239975aeef54a7686b788d2ccc5190f
