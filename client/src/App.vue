<template>
  <div>
    <nav class="layout-header">
      <LoggedoutToolbar v-if="!isLoggedin" />
      <LoggedinToolbar v-else-if="isLoggedin" />
    </nav>
    <main class="layout-body">
      <router-view />
    </main>
  </div>
</template>

<script>
import LoggedoutToolbar from "./components/LoggedoutToolbar.vue";
import LoggedinToolbar from "./components/LoggedinToolbar.vue";
import { mapState } from "vuex";

export default {
  name: "MyLayout",
  components: {
    LoggedoutToolbar,
    LoggedinToolbar
  },
  computed: mapState(["isLoggedin"])
};
</script>

<style lang="scss">
body {
  font-family: "Roboto", sans-serif;
}
.layout-body {
  background-color: $primary;
  width: 100%;
  @media screen and (max-width: 600px) {
    padding-left: 0;
  }
}

.layout-header {
  height: rem(62px);
  color: white;
}
</style>
