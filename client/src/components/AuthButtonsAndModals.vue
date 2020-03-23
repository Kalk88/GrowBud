<template>
  <div>
    <div class="login-signup-btns">
      <ui-button class="btn login" @click="openModal('loginModal')"> Login</ui-button>

      <ui-button class="btn signup" @click="openModal('signupModal')">Sign up</ui-button>
    </div>
    <SignupModal ref="signupModal" />
    <LoginModal ref="loginModal" />
  </div>
</template>
<script>
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default {
  name: "AuthButtonsAndModals",
  components: {
    LoginModal,
    SignupModal,
  },

  methods: {
    openModal(ref) {
      this.$refs[ref].$refs[ref].open();
    },
  }
};
</script>
<style scoped lang="scss">

.login-signup-btns{
  display:flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20vh;
}

.btn {
  font-size: 26px;
  margin-top: 3rem;
  width: 80%;
  height: 12vh;
  border-radius: 6px;
  box-shadow: 2px 5px 0px 0px #50aa8d;

 
}

.btn:hover {
  -webkit-box-shadow: inset 0px 0px 6px 2px #50aa8d;
     -moz-box-shadow: inset 0px 0px 6px 2px #50aa8d;
          box-shadow: inset 0px 0px 6px 2px #50aa8d;
   outline: none;
}

.login{
  background-color: $shade-secondary !important; 
}

.signup{
  background: $shade-primary !important;
}

nav > div {
  padding: 10px;
  background: linear-gradient(165deg, $primary-dark 0%, $primary 60%, $primary-light 100%);
  
}
</style>
