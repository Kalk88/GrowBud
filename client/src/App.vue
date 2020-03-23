<template>
  <div>
    <nav class="layout-header">
      <Toolbar />
    </nav>
    <main class="layout-body">
      <router-view />
      <ui-snackbar-container ref="snackbarContainer"></ui-snackbar-container>
    </main>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";

export default {
  name: "MyLayout",
  components: {
    Toolbar
  },
};
</script>

<style lang="scss">
body {
  font-family: "Roboto", sans-serif;
}
.layout-body {
  width: 100%;
  @media screen and (max-width: 600px) {
    padding-left: 0;
  }
}

.layout-header {
  height: rem(62px);
}
</style>
