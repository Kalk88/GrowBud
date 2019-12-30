<template>
  <div>
    <div v-for="plant in plants" :key="plant.name">{{plant.name}}</div>
  </div>
</template>

<script>
export default {
  name: "MyWateringScheduleCard",
  props: {
    plants: {
      type: Array,
      default: []
    }
  }
};
</script>

<style>
</style>