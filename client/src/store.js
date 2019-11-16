import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedin: false,
    inMemoryToken: {
      jwt_token: "",
      jwt_expiry_token:""
    }
  },
  mutations: {
    setIsLoggedin (state, value) {
      state.isLoggedin = value;
    },
    setInMemoryToken (state, jwt_token) {
      state.inMemoryToken.jwt_token = jwt_token;
    }
  },
  actions: {

  }
})
