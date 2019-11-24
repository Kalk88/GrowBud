import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'
import VueApollo from 'vue-apollo'
import {
  ApolloClient
} from 'apollo-client'
import {
  createHttpLink
} from 'apollo-link-http'
import {
  InMemoryCache
} from 'apollo-cache-inmemory'


Vue.use(VueApollo)

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_API_GRAPH_ENDPOINT_URL,
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

window.setInterval(function () { store.dispatch('refreshToken'); }, 1000 * 15 * 15);

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
