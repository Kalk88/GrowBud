<template>
  <div class="wrapper">
     <ui-button class="addSchedule-btn primary-button" @click="goToAddWateringSchedule">
        Add a schedule
      </ui-button>
    <div v-if="!$apollo.loading">
    <ul style="list-style:none;" v-if="schedules.length">
      <MyWateringScheduleCard 
        class="card"
        v-for="schedule in schedules"
        :key="schedule.id"
        :schedule="schedule"
        @scheduleDeleted="deleteWateringSchedule(schedule.id)"
        @cardExpanded="setCardExpanded"
      />
    </ul>
    <div class="schedules-count">Schedules: {{ schedules.length }}</div>
    </div>
  <ui-progress-circular v-else></ui-progress-circular>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_MY_WATERINGSCHEDULES, DELETE_WATERINGSCHEDULE } from "../api/wateringschedule";
import MyWateringScheduleCard from "../components/MyWateringScheduleCard.vue";
export default {
  name: "MyWateringSchedules",

  components: {
    MyWateringScheduleCard
  },

  apollo:{
    schedules: {
      query: GET_MY_WATERINGSCHEDULES,
    }
  },

  created(){
    
    this.$apollo.queries.schedules.refetch();
  },

  data() {
    return {
      schedules: [],
      showExpandCard: false
    }
  },
  
  computed: {
    ...mapGetters(["isLoggedin"]),
  },

  methods:{
     async deleteWateringSchedule(id) {
     try{
        const res = await this.$apollo.mutate({
          mutation: DELETE_WATERINGSCHEDULE,
          variables:  {
            scheduleId: id
          }
        });
        if(res.data.deleteWateringSchedule.status){
          this.createSnackbar("Schedule Deleted");
          this.$apollo.queries.schedules.refetch();
        }
      } catch (error) {
        alert("Couldn't delete schedule");
      }
    },
    
    createSnackbar(title) {
      this.$parent.$refs.snackbarContainer.createSnackbar({
        message: title,
        actionColor: "accent",
        duration: 5 * 1000
      });
    },
    goToAddWateringSchedule() {
      this.$router.push("addWateringSchedule").catch(err => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
    setCardExpanded(payload){
      if(payload.showExpandCard){
        payload.$el.classList.add('card-expanded')
        payload.$el.classList.remove('card')
      } else {
        payload.$el.classList.add('card')
        payload.$el.classList.remove('card-expanded')
      }

    }
  }
};
</script>

<style scoped lang="scss">

.wrapper{
  margin-top: 1.5rem;  
  height: 70vh;
}

.schedules-count{
  margin-top: 2rem;
  text-align: center;
  font-weight: bold;
}

.card, .card-expanded {
  position: relative;
  margin-top: 0.75rem;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 20px;
  transition: box-shadow 0.3s;
}

.card:nth-child(even):hover, .card:nth-child(odd):hover{
  box-shadow: none;
}

.card:nth-child(even)::after{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: $standard-border-radius;
  -webkit-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
          box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
   outline: none;
   cursor: pointer;
}

.card:nth-child(odd)::after{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: $standard-border-radius;
  -webkit-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);;
          box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);;
   outline: none;
   cursor: pointer;
}

.card:nth-child(even):hover::after, .card:nth-child(odd):hover::after{
  opacity: 1;
}

.card-expanded:nth-child(even){
  -webkit-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
          box-shadow: inset 0 0 2px 1px  darken($primary-light, 25%);
}

.card-expanded:nth-child(odd){
  -webkit-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);
     -moz-box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);;
          box-shadow: inset 0 0 2px 1px  darken($shade-secondary-accent, 25%);;
   outline: none;
   cursor: pointer;
}

.card-expanded:nth-child(even) {
  background: lighten($primary-light, 30%)
}

.card-expanded:nth-child(odd) {
   background: $shade-primary;
}

.card:nth-child(even){
  background: $primary-light;
  box-shadow: 3px 6px 0 0 darken($primary-light, 25%);
}

.card:nth-child(odd){
  background: $primary;
  box-shadow: 3px 6px 0 0 darken($shade-secondary-accent, 40%);
}

.addSchedule-btn{
  margin: 1rem;
}

.addSchedule-btn:hover{
  background: linear-gradient($secondary, $primary 100%);
}

ul{
  list-style: none;
  margin: 0;
  padding: 0 1rem 1rem;
}
</style>
