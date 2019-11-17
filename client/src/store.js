import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userID: "",
    isLoggedin: false,
    inMemoryToken: {
      jwt_token: "",
      jwt_expiry_token:""
    }
  },
  mutations: {
    setUserID (state, value) {
      state.userID = value;
    },
    setIsLoggedin (state, value) {
      state.isLoggedin = value;
    },
    setInMemoryToken (state, jwt_token) {
      state.inMemoryToken.jwt_token = jwt_token;
    }
  },
  actions: {

    refreshToken (context) { //eslint-disable-line
			if(!this.state.inMemoryToken.jwt_token) {
				return false;
			}
		},

  }
})
