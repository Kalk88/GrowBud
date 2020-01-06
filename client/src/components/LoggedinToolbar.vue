<template>
  <q-toolbar>
    <q-toolbar-title>Growbud</q-toolbar-title>
    <nav>
      <div id="addSchedule" @click="goToAddWateringSchedule">Add a schedule</div>
      <div id="mySchedules" @click="goToMyWateringSchedules">My schedules</div>
    </nav>
  </q-toolbar>
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
<style scoped>
nav {
  display: flex;
  flex-direction: row;
}

nav > div {
  padding: 10px;
}

#addSchedule:hover {
  color: black;
}
#mySchedules:hover {
  color: black;
}
</style>