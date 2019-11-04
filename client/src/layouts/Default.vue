<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-9 text-white">
    <q-header elevated class="bg-grey-6">
      <q-toolbar>
        <q-toolbar-title>Quasar App</q-toolbar-title>
        <q-btn color="amber" glossy label="Sign up" />
        <q-btn color="amber" @click="showLogin = !showLogin" glossy label="Log in" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <LoginModal :showDialog="showLogin" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import LoginModal from "../components/LoginModal";

export default {
  name: "MyLayout",
  components: {
    LoginModal
  },
  data() {
    return {
      leftDrawerOpen: false,
      showLogin: false
    };
  }
};
</script>