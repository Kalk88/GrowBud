<template>
  <div class="wrapper">
    <ui-textbox
      class="plantName-input"
      label="Name the plant that you are going to water"
      standout
      outlined
      v-model="plantName"
    />
    <ui-datepicker
      class="calendar"
      placeholder="Select a date"
      v-model="date"
    />
    <TimePicker class="timepicker" v-model="time" :timeLabel="time" />
    <div class="interval-selector">
      <div class="interval-btn-grp">
        <ui-button
          :class="intervalModifier <= 1 ? 'selected' : 'unselected'"
          @click="setIntervalModifier(1)"
          >Days</ui-button
        >
        <ui-button
          :class="intervalModifier > 1 ? 'selected' : 'unselected'"
          @click="setIntervalModifier(7)"
          >Weeks</ui-button
        >
      </div>
      <IncrementerButton class="incrementer-button" v-model="interval" />
    </div>
    <div class="add-cancel-btn-grp">
      <ui-button>Cancel</ui-button>
      <ui-button v-if="!scheduleToEdit" @click="addWateringSchedule"
        >Add schedule</ui-button
      >
      <ui-button v-if="scheduleToEdit" @click="updateWateringSchedule"
        >Update schedule</ui-button
      >
    </div>
  </div>
</template>

<script>
import IncrementerButton from "../components/IncrementerButton.vue";
import TimePicker from "../components/TimePicker.vue";
import { mapGetters } from "vuex";
import {
  ADD_WATERINGSCHEDULE,
  UPDATE_WATERINGSCHEDULE
} from "../api/wateringschedule";
import { isEmpty } from "lodash";

export default {
  name: "AddWateringSchedule",
  components: {
    IncrementerButton,
    TimePicker
  },

  data() {
    return {
      date: new Date(),
      time: [],
      interval: 1,
      intervalModifier: 1,
      plantName: "",
      scheduleToEdit: null
    };
  },

  created() {
    if (!isEmpty(this.$route.params)) {
      this.scheduleToEdit = this.$route.params;
      this.date = new Date(parseInt(this.scheduleToEdit.nextTimeToWater));
      this.time = [
        parseInt(this.date.getHours()),
        parseInt(this.date.getMinutes())
      ];
      this.interval = this.scheduleToEdit.interval;
      this.plantName = this.scheduleToEdit.plants[0].name;
    }
  },

  computed: {
    ...mapGetters(["getUserId"]),

    timestamp() {
      this.date.setHours(this.time[0]);
      this.date.setMinutes(this.time[1]);
      const timestamp = new Date(this.date);
      return timestamp.getTime();
    },

    calculatedInterval() {
      return this.interval * this.intervalModifier;
    }
  },

  watch: {},

  methods: {
    async addWateringSchedule() {
      try {
        await this.$apollo.mutate({
          mutation: ADD_WATERINGSCHEDULE,
          variables: {
            plants: [{ name: this.plantName }],
            timestamp: this.timestamp.toString(),
            interval: this.calculatedInterval
          }
        });
        this.$router.push("/");
        this.createSnackbar("Schedule Added");
      } catch (error) {
        alert("Couldn't add schedule");
      }
    },

    async updateWateringSchedule() {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_WATERINGSCHEDULE,
          variables: {
            scheduleId: this.scheduleToEdit.id,
            plants: [{ name: this.plantName }],
            timestamp: this.timestamp.toString(),
            interval: this.calculatedInterval
          }
        });
        this.$router.push("/");
        this.createSnackbar("Schedule Updated");
      } catch (error) {
        alert("Couldn't update schedule");
      }
    },

    setIntervalModifier(value) {
      this.intervalModifier = value;
    },

    createSnackbar(title) {
      this.$parent.$refs.snackbarContainer.createSnackbar({
        message: title,
        actionColor: "accent",
        duration: 5 * 1000
      });
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-row-gap: 1rem;
  margin-top: 3rem;
}

.plantName-input {
  grid-column: span 4;
  width: 50%;
  background-color: blanchedalmond;
  border-radius: 5px;
}

.calendar {
  width: 16.5rem;
  justify-self: flex-end;
  grid-column: 1;
  grid-row: 2;
}

.timepicker {
  justify-self: center;
  grid-column: 2/3;
  grid-row: 2;
}

.interval-btn-grp {
  align-self: center;
  margin-right: 1rem;
}

.interval-selector {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  justify-self: flex-start;
}
.incrementer-button {
  justify-self: start;
  align-self: center;
}

.add-cancel-btn-grp {
  grid-column: 3;
  grid-row: 3;
  justify-self: flex-start;
}

.selected {
  background-color: green !important;
}
</style>
