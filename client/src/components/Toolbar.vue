<template>
  <ui-toolbar :removeNavIcon="true" title="Growbud">
    <div slot="actions" v-if="isLoggedin">
      <ui-button class="mySchedules navbar-button" @click="goToMyWateringSchedules">
        My schedules
      </ui-button>
    </div>
  </ui-toolbar>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Toolbar",

  computed: mapState(["isLoggedin"]),
  
  methods: {
    goToMyWateringSchedules() {
      this.$router.push("myWateringSchedules").catch(err => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
nav {
  display: flex;
  flex-direction: row;
}

nav > div {
  padding: 10px;
  background: $header-gradient;
}


.mySchedules:hover {
  color: black;
}
</style>
