<template>
  <div>
    <q-input label="Name the plant are you going to water" outlined standout />
    <q-date v-model="date" :dark="true" today-btn color="green" />
    <q-btn-group>
      <q-btn label="Days" />
      <q-btn label="Weeks" />
    </q-btn-group>
    <IncrementerButton />
    <q-btn-group>
      <q-btn label="Cancel" />
      <q-btn label="Add schedule" />
    </q-btn-group>
  </div>
</template>

<script>
import { QDate, QInput, QBtnGroup, QBtn } from "quasar";
import IncrementerButton from "../components/IncrementerButton.vue";

export default {
  name: "AddWateringSchedule",
  components: {
    QDate,
    QInput,
    QBtnGroup,
    QBtn,
    IncrementerButton
  },
  data() {
    return {
      date: ""
    };
  },
  created() {
    this.date = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");
  }
};
</script>

<style scoped>
</style>