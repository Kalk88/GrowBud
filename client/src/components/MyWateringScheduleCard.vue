<template>
  <div class="container" @click="showExpandCard = !showExpandCard">
    <div v-if="!showExpandCard" class="text-black" >
      <div>Next reminder: {{ `${time} ${nextTimeToWaterAsDate.toLocaleDateString({ weekday: 'long' })} 
        `}}</div>
    </div>
    <div v-else-if="showExpandCard" class="card-expanded">
      <h3>Plants</h3>
      <div v-for="(plant,index) in schedule.plants" :key="index" class="plant">
        {{ plant.name }}
      </div>
      <div class="schedule-mutation-btns">
      <ui-button class="primary-button" @click="editSchedule">Edit</ui-button>
      <ui-button class="removeSchedule-btn"
        @click="deleteWateringSchedule"
        >Remove Schedule</ui-button
      >
      </div>
      </div>
      
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
    this.formatTime([this.nextTimeToWaterAsDate.getHours(), this.nextTimeToWaterAsDate.getMinutes()])
  },

  data() {
    return {
      nextTimeToWaterAsDate: "",
      time: "",
      showExpandCard: false,
    };
  },

  methods: {
    editSchedule() {
      this.$router.push({
        name: "addWateringSchedule",
        params: this.schedule
      });
    },

    formatTime(time){
      time.forEach((elem, index) => {
        if (elem < 10) {
        time[index] = `0${elem}`; 
      }})
      this.time=`${time[0]}:${time[1]}`;
    },

    deleteWateringSchedule(){
      this.$emit("scheduleDeleted");
    }
   
  }
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 1px 3px 0px 0px #50aa8d;
}

.container:hover {
  -webkit-box-shadow: inset 0px 0px 6px 2px #50aa8d;
     -moz-box-shadow: inset 0px 0px 6px 2px #50aa8d;
          box-shadow: inset 0px 0px 6px 2px #50aa8d;
   outline: none;
}

.card-expanded{
  width: 100%
}

h3{
  margin: 0;
  padding: 0 0.5rem 0.5rem;
}

.plant{
  display: inline-block;
  background: $primary;
  border: 2px solid $secondary;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.2rem;
}

.schedule-mutation-btns{
  display: flex;
  align-items: baseline;

  .removeSchedule-btn{
    margin-top: 1rem;
    margin-left: auto;
    width: 40%;
    border-radius: $standard-border-radius;
    color:honeydew;
    background-color: $warning !important;

  }
}



</style>
