import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApollo from 'vue-apollo'
import {
  ApolloClient
} from 'apollo-client'
import { ApolloLink, concat } from 'apollo-link';
import {
  createHttpLink
} from 'apollo-link-http'

import {
  InMemoryCache
} from 'apollo-cache-inmemory'

import './registerServiceWorker'
import './api/notifications'

import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

Vue.use(KeenUI)
Vue.use(VueApollo)

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_API_BASE_URL + '/graph',
  credentials: 'include'
})

const cache = new InMemoryCache()

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${store.state.inMemoryToken.JWT}`,
    }
  });
  return forward(operation);
})

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
  connectToDevTools: true,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

if(store.getters.getUserId === "") {
  store.dispatch('persistLogin');
}

window.setInterval(function () {
  store.dispatch('silentTokenRefresh');
}, 360000);

new Vue({
  router,
  store,
  apolloProvider,
  components: {
  
  },
  render: h => h(App)
}).$mount('#app')