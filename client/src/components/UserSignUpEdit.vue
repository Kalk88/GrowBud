<template>
  <div class="userSignUp-Edit-wrapper">
    <h1> Create a free account </h1>
    <input 
      type="text" 
      class="username" 
      placeholder=" username"
      v-model="User.username"/>
    <input 
      type="email" 
      class="email" 
      placeholder="email" 
      v-model="User.email"/>
    <input 
      type="password" 
      class="password" 
      placeholder="password"
      v-model="User.password"/>

    <button 
    class="save" 
    type="button" 
    value="SignUp"
    style="width: 10%; align-self: center; background-color: black; color:hotpink; margin-top: 1rem;"
    @click="register()"
    >SignUp
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserSignUpEdit',
  components: {
    
  },

  data(){
    return{
      User:{ 
        username: "",
        email: "",
        password: "",
      }
    }

  },
  methods: {

    register() {
      this.setUser(this.User)
    },

    ...mapMutations(["setUser"]),
  },
 
}
</script>

<style scoped>

.userSignUp-Edit-wrapper{
  display: flex;
  flex-direction: column;
  align-content: center;
}

input{
  width: 30%;
  align-self: center;
  margin-top: 1rem;
}
</style>
