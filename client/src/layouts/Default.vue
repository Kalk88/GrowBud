<template>
  <q-layout view="lHh Lpr lFf" class="layout-body text-white">
    <q-header bordered class="layout-header">
      <q-toolbar>
        <q-toolbar-title>Growbud</q-toolbar-title>
        <q-btn
          class="signupbtn"
          @click="openSignupModal()"
          label="Sign up"
        />
        <q-btn
          class="loginbtn"
          @click="openLoginModal()"
          label="Log in"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <SignupModal
        v-on:hideSignupModal="hideSignupModal"
        :showModal="showSignupModal"
      />
      <LoginModal
        v-on:hideLoginModal="hideLoginModal"
        :showModal="showLoginModal"
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

export default {
  name: "MyLayout",
  components: {
    LoginModal,
    SignupModal
  },
  data() {
    return {
      showLoginModal: false,
      showSignupModal: false,
    };
  },
  methods: {
    openLoginModal() {
      this.showLoginModal = true;
    },
    openSignupModal(){
      this.showSignupModal = true;
    },
    hideLoginModal(hide) {
      this.showLoginModal = hide;
    },
    hideSignupModal(hide) {
      this.showSignupModal = hide;
    }
  }
};
</script>

<style scoped>
.layout-body {
  background-color: #676767;
}

.layout-header {
  background-color: #009401;
}

.signupbtn{
  margin-right: 1rem;
}
</style>
