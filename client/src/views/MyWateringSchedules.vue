<template>
  <ol>
    <MyWateringScheduleCard
      v-for="schedule in schedules"
      :key="schedule.id"
      :schedule="schedule"
    />
  </ol>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_MY_WATERINGSCHEDULES } from "../api/wateringschedule";
import MyWateringScheduleCard from "../components/MyWateringScheduleCard.vue";
export default {
  name: "MyWateringSchedules",

  components: {
    MyWateringScheduleCard
  },

  data() {
    return {
      schedules: []
    };
  },
  computed: {
    ...mapGetters(["getUserId", "isLoggedin"])
  },

  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setIsLoggedin') {
        this.getMySchedules().then(data => (this.schedules = data));
      }
    });
    if(this.isLoggedin){
      this.getMySchedules().then(data => (this.schedules = data));
    }
  },


  methods: {
    async getMySchedules() {
      try {
        const res = await this.$apollo.query({
          query: GET_MY_WATERINGSCHEDULES,
          variables: {
            userId: this.getUserId
          }
        });
        return res.data.wateringScheduleForUser;
      } catch (error) {
        alert("No schedules could be fetched, please try again later");
      }
    },
  }
};
</script>

<style>
</style>