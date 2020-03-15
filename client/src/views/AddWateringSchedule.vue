<template>
  <div class="wrapper">
    <div class="plants">
      <div class="plantInput">
        <input
          type="text"
          v-model="plantName"
          @keydown="addPlantToPlants"
          placeholder="Enter a plant to the list"
        />

        <i class="material-icons input__icon" @click="addPlantToPlants"
          >subdirectory_arrow_left</i
        >
      </div>
      <div class="plants--list">
        <span
          class="validationError--text"
          v-if="this.validationErrorMessages.plantsNoInput"
        >
          {{ this.validationErrorMessages.plantsNoInput }}
        </span>
        <div v-else-if="plants.length">
          <ul>
            <li v-for="(plant, index) in plants" :key="index">
              {{ plant.name }}
              <ui-icon-button
                type="secondary"
                size="mini"
                class="icon"
                icon="clear"
                @click="removePlant(index)"
              >
              </ui-icon-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="calendar">
      <ui-datepicker
        :class="
          this.validationErrorMessages.dateBeforeNow ? 'validationError' : ''
        "
        placeholder="Select a date"
        v-model="date"
      />
    </div>
    <div class="timepicker">
      <TimePicker
        :class="
          this.validationErrorMessages.dateBeforeNow ? 'validationError' : ''
        "
        v-model="time"
        :timeLabel="time"
      /><span class="validationError--text">{{
        this.validationErrorMessages.dateBeforeNow
      }}</span>
    </div>
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
      <ui-button
        v-if="scheduleToEdit"
        :disabled="isFormDisabled"
        @click="deleteWateringSchedule"
        >Remove Schedule</ui-button
      >
      <ui-button>Cancel</ui-button>
      <ui-button
        v-if="!scheduleToEdit"
        :disabled="isFormDisabled"
        @click="addWateringSchedule"
        >Add schedule</ui-button
      >
      <ui-button
        v-if="scheduleToEdit"
        :disabled="isFormDisabled"
        @click="updateWateringSchedule"
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
  UPDATE_WATERINGSCHEDULE,
  DELETE_WATERINGSCHEDULE
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
      plants: [],
      scheduleToEdit: null,
      validationErrorMessages: {}
    };
  },

  created() {
    if (!isEmpty(this.$route.params)) {
      this.validateFields();
      this.scheduleToEdit = this.$route.params;
      this.date = new Date(parseInt(this.scheduleToEdit.nextTimeToWater));
      this.time = [
        parseInt(this.date.getHours()),
        parseInt(this.date.getMinutes())
      ];
      this.interval = this.scheduleToEdit.interval;
      this.plants = this.scheduleToEdit.plants;
    } else {
      this.time = [new Date().getHours() + 1, new Date().getMinutes()]; // Will lessen likelyhood of premature validation but also helps user understand ux better
    }
  },

  computed: {
    ...mapGetters(["getUserId"]),

    timestamp() {
      if (this.time.length) {
        this.date.setHours(this.time[0]);
        this.date.setMinutes(this.time[1]);
      }
      const timestamp = new Date(this.date);
      return timestamp.getTime();
    },

    calculatedInterval() {
      return this.interval * this.intervalModifier;
    },

    isFormDisabled() {
      if (this.validateFields()) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    async addWateringSchedule() {
      try {
        await this.$apollo.mutate({
          mutation: ADD_WATERINGSCHEDULE,
          variables: {
            plants: this.plants,
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

    async deleteWateringSchedule() {
      try{
        await this.$apollo.mutate({
          mutation: DELETE_WATERINGSCHEDULE,
          variables:  {
            scheduleId: this.scheduleToEdit.id
          }
        });
        this.$router.push("/");
        this.createSnackbar("Schedule Deleted");
      } catch (error) {
        alert("Couldn't delete schedule");
      }
    },

    addPlantToPlants(event) {
      if (this.plantName.length) {
        if (event.keyCode === 13 || event.type === "click") {
          this.plants.push({ name: this.plantName });
          this.plantName = "";
        }
      }
    },
    removePlant(index) {
      this.plants.splice(index, 1);
    },
    setIntervalModifier(value) {
      this.intervalModifier = value;
    },

    validateFields() {
      this.validationErrorMessages = {};

      let minTimeThreshold = new Date();
      minTimeThreshold.setMinutes(minTimeThreshold.getMinutes() + 5); // Time for next reminder needs to atleast 5 min into the future

      if (this.timestamp < minTimeThreshold) {
        this.validationErrorMessages.dateBeforeNow = "Invalid timepoint";
      }

      if (!this.plants.length) {
        this.validationErrorMessages.plantsNoInput = "You need to add a plant";
      }

      if (isEmpty(this.validationErrorMessages)) {
        return false;
      } else {
        return true;
      }
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
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 10rem;
  grid-row-gap: 1rem;
  height: 100%;
}

.plantInput {
  position: relative;
  input {
    padding: 0.75rem;
    font-family: "Roboto", sans-serif;
    border: 0px solid;
    background-color: lightgrey;
    border-radius: 5px;
  }
  input:focus {
    border: 1px solid;
    border-color: grey;
  }
  .input__icon {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
  }

  .input__icon:hover {
    cursor: pointer;
    background-color: lightgrey;
    border-radius: 5px;
  }
}

.plants {
  display: flex;
  grid-column: 2;
  grid-row: 1;
}

.plants--list {
  padding: 0;
  width: 50%;
  overflow: scroll;

  .validationError--text {
    position: relative;
    margin-left: 1rem;
    top: 1rem;
  }

  ul {
    list-style: none;
    display: inline-flex;
    flex-wrap: wrap;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    border: 1px solid;
    background: $secondary;
    border-radius: 5px;
    padding: 0.25rem;
    margin: 0.1rem;
  }
}

.calendar {
  width: 16.5rem;
  grid-column: 2;
  grid-row: 2;
  justify-self: flex-start;
}

.timepicker {
  display: flex;
  flex-direction: row;
  justify-self: center;
  margin-left: 1rem;
  grid-column: 2;
  grid-row: 2;

  span {
    margin-left: 1rem;
  }
}

.interval-btn-grp {
  align-self: center;
  margin-right: 1rem;
}

.interval-selector {
  grid-column: 2;
  grid-row: 3;
  display: flex;
  justify-self: flex-start;
}
.incrementer-button {
  justify-self: start;
  align-self: center;
}

.add-cancel-btn-grp {
  grid-column: 2;
  grid-row: 4;
  justify-self: flex-end;
}

.validationError {
  border-bottom: 1px solid;
  border-color: red;
}

.validationError--text {
  color: red;
  align-self: center;
}

.selected {
  background-color: green !important;
}
</style>
