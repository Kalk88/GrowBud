<template>
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
        <SignupModal
        v-on:hideSignupModal="hideSignupModal"
        :showModal="showSignupModal"
        />
        <LoginModal
        v-on:hideLoginModal="hideLoginModal"
        :showModal="showLoginModal"
        />
    </q-toolbar>
</template>
<script>
import {
  QBtn,
  QToolbarTitle,
  QToolbar,
} from "quasar";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

export default {
    name: "LoggedoutToolbar",
    components: {
    LoginModal,
    SignupModal,
    QBtn,
    QToolbarTitle,
    QToolbar
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
}
</script>
<style scoped>
.signupbtn{
  margin-right: 1rem;
}
</style>
