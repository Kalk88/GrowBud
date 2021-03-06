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
    getJWT: state => {
      return state.inMemoryToken.JWT;
    },
    isLoggedin: state => {
      return state.isLoggedin;
    }
  },

  actions: {

    async persistLogin(context){
      try{
      const response = await refreshToken()

      const {
        JWT,
        JWTExpiry
      } = response.data;

      context.commit('setInMemoryToken', {
        JWT,
        JWTExpiry
      });
        
      context.commit('setIsLoggedin', true)
    }catch(e){
      console.error(e) //eslint-disable-line
    }
    },

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