<template>
  <q-layout view="lHh Lpr lFf" class="layout-body text-white">
    <q-header bordered class="layout-header">
      <LoggedoutToolbar v-if="!isLoggedin"/>
      <LoggedinToolbar v-else-if="isLoggedin" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import LoggedoutToolbar from "../components/LoggedoutToolbar.vue";
import LoggedinToolbar from "../components/LoggedinToolbar.vue";
import { mapState } from "vuex";

export default {
  name: "MyLayout",
  components: {
    LoggedoutToolbar,
    LoggedinToolbar
  },
  computed: mapState([
    "isLoggedin"
])
};
</script>

<style scoped>
.layout-body {
  background-color: #676767;
}

.layout-header {
  background-color: #009401;
}

</style>
