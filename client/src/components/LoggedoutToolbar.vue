<template>
  <ui-toolbar :removeNavIcon="true" brand="Growbud">
    <div slot="actions">
      <ui-button raised @click="openModal('loginModal')"> Login</ui-button>

      <ui-button raised @click="openModal('signupModal')">Sign up</ui-button>
    </div>
    <SignupModal ref="signupModal" />
    <LoginModal ref="loginModal" />
  </ui-toolbar>
</template>
<script>
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { UiToolbar, UiButton } from "keen-ui";

export default {
  name: "LoggedoutToolbar",
  components: {
    LoginModal,
    SignupModal,
    UiToolbar,
    UiButton
  },

  methods: {
    openModal(ref) {
      this.$refs[ref].$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].$refs[ref].close();
    }
  }
};
</script>
<style scoped lang="scss">
.signupbtn {
  margin-right: 1rem;
}

nav > div {
  padding: 10px;
  background: linear-gradient($primary, $secondary);
  
}
</style>
