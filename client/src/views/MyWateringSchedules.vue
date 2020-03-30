<template>
  <div>
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
      />
    </ul>
    <div>{{ schedules.length }}</div>
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
      schedules: []
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
  }
};
</script>

<style scoped lang="scss">
.card {
  margin-top: 0.5rem;
}


.card:nth-child(even){
  background: $shade-primary;
}

.card:nth-child(odd){
  background: $shade-secondary;
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
