import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    User: {}
  },
  mutations: {
    setUser: (state,User) => {
      state.User = User;
    }

  },
  actions: {

  }
})
