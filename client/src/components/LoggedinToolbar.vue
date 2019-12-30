<template>
  <q-toolbar>
    <q-toolbar-title>Growbud</q-toolbar-title>
    <nav>
      <div id="addSchedule" @click="$router.push('addWateringSchedule')">Add a schedule</div>
      <div id="mySchedules" @click="$router.push('myWateringSchedules')">My schedules</div>
    </nav>
  </q-toolbar>
</template>
<script>
export default {
  name: "LoggedinToolbar"
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