import Vue from 'vue'
import Vuex from 'vuex'
import {
  refreshToken
} from '@/api/auth';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userID: "",
    isLoggedin: false,
    inMemoryToken: {
      JWT: "",
      JWTExpiry: ""
    }
  },
  mutations: {
    setUserID(state, value) {
      state.userID = value;
    },
    setIsLoggedin(state, value) {
      state.isLoggedin = value;
    },
    setInMemoryToken(state, {
      JWT,
      JWTExpiry
    }) {
      state.inMemoryToken.JWT = JWT;
      state.inMemoryToken.JWTExpiry = JWTExpiry;
    }
  },

  getters: {
    getUserId: state => {
      return state.userID;
    },
  },

  actions: {

    silentTokenRefresh(context) { //eslint-disable-line
      if (!this.state.inMemoryToken.JWT) {
        return false;
      } else {
        refreshToken().then((response) => {
          const {
            JWT,
            JWTExpiry
          } = response.data;
          context.commit('setInMemoryToken', {
            JWT,
            JWTExpiry
          });
        })
      }
    },

  }
})