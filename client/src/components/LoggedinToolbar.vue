<template>
  <ui-toolbar :removeNavIcon="true" title="Growbud">
    <div slot="actions">
      <ui-button id="addSchedule primary-button" @click="goToAddWateringSchedule">
        Add a schedule
      </ui-button>
      <ui-button id="mySchedules" @click="goToMyWateringSchedules">
        My schedules
      </ui-button>
    </div>
  </ui-toolbar>
</template>
<script>
export default {
  name: "LoggedinToolbar",

  methods: {
    goToAddWateringSchedule() {
      this.$router.push("addWateringSchedule").catch(err => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
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
  background: linear-gradient($secondary,$primary);
}

#addSchedule:hover {
  color: black;
}
#mySchedules:hover {
  color: black;
}
</style>
