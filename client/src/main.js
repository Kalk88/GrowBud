import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'
import VueApollo from 'vue-apollo'
import {
  ApolloClient,
  createNetworkInterface
} from 'apollo-client'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:9090/graphql'
  }),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')