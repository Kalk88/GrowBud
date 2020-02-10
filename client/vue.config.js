module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
      }
    }
  },
  pwa: {
    name: 'Growbud',
    display: 'standalone',
    start_url: '/#',
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/firebase-messaging-sw.js",
      swDest: "firebase-messaging-sw.js"
    }
  }
};
