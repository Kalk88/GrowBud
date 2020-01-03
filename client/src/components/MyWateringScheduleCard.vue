<template>
  <div class="container">
    <q-card class="text-black" @click="editSchedule">
      <q-card-section v-for="plant in schedule.plants" :key="plant.name">{{plant.name}}</q-card-section>
      <q-card-section>{{nextTimeToWaterAsDate}}</q-card-section>
      <q-card-section>Interval: {{schedule.interval}}</q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "MyWateringScheduleCard",
  props: {
    schedule: {
      type: Object
    }
  },

  created() {
    this.nextTimeToWaterAsDate = new Date(
      parseInt(this.schedule.nextTimeToWater)
    );
  },

  data() {
    return {
      nextTimeToWaterAsDate: ""
    };
  },

  methods: {
    editSchedule() {
      this.$router.push({
        name: "addWateringSchedule",
        params: this.schedule
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.q-card {
  width: 70%;
  margin: 1rem;
  display: flex;
  flex-direction: row;
}

.q-card__section {
  padding: 1rem !important;
}
</style>