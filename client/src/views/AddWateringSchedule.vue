<template>
  <div class="wrapper">
    <q-input
      class="plantName-input"
      label="Name the plant that you are going to water"
      outlined
      standout
    />
    <q-date class="calendar" v-model="date" :dark="true" today-btn color="green" />
    <div class="interval-selector">
      <q-btn-group class="interval-btn-grp">
        <q-btn label="Days" />
        <q-btn label="Weeks" />
      </q-btn-group>
      <IncrementerButton class="incrementer-button" v-model="interval" />
    </div>
    <q-btn-group class="add-cancel-btn-grp">
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
      date: "",
      interval: 0,
      intervalModifier: "DAYS",
      plantName: ""
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
.wrapper {
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-row-gap: 1rem;
  margin-top: 3rem;
}

.plantName-input {
  grid-column: span 4;
  width: 50%;
}

.calendar {
  justify-self: end;
  align-self: center;
  grid-column: 2;
}

.interval-btn-grp {
  justify-self: end;
  align-self: center;
}

.interval-selector {
  grid-column: 3;
  display: flex;
}
.incrementer-button {
  justify-self: start;
  align-self: center;
}

.add-cancel-btn-grp {
  grid-column: 3;
  grid-row: 3;
}
</style>