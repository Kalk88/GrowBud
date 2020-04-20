<template>
  <div>
    <div class="login-signup-btns">
      <ui-button class="btn login" @click="openModal('loginModal')">Login</ui-button>

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
 
}

.signup{
  background: $primary-light !important;
  box-shadow: 3px 6px 0 0 darken($primary-light, 25%);
}

.signup:hover{
  -webkit-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
          box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
   outline: none;
   cursor: pointer;
}

.login{
  background-color: $primary !important;
  box-shadow: 3px 6px 0 0 darken($shade-secondary-accent, 40%);
}

.login:hover{
  -webkit-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);
          box-shadow: inset 0 0 2px 1px darken($shade-secondary-accent, 25%);
   outline: none;
   cursor: pointer;
}

nav > div {
  padding: 10px;
  background: linear-gradient(165deg, $primary-light 0%, $primary-light 60%, $secondary 100%);
  
}
</style>
