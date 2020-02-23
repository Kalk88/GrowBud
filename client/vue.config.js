module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss"; @import "~@/scss/globals.scss";`
      }
    }
  },
  pwa: {
    name: "Growbud",
    display: "standalone",
    start_url: "/#/",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/sw.js",
      swDest: "sw.js",
      exclude: [/\.map$/, /manifest\.json$/]
    }
  }
};
