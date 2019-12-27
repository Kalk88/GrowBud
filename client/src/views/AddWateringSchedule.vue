<template>
  <div class="wrapper">
    <q-input
      class="plantName-input"
      label="Name the plant that you are going to water"
      standout
      outlined
    />
    <q-date class="calendar" v-model="date" :dark="true" today-btn color="green" />
    <q-time v-model="time" format24h />
    <div class="interval-selector">
      <q-btn-group class="interval-btn-grp">
        <q-btn
          :class="intervalModifier <=1 ? 'selected': 'unselected' "
          label="Days"
          @click="setIntervalModifier(1)"
        />
        <q-btn
          :class="intervalModifier >1 ? 'selected': 'unselected' "
          label="Weeks"
          @click="setIntervalModifier(7)"
        />
      </q-btn-group>
      <IncrementerButton class="incrementer-button" v-model="interval" />
    </div>
    <q-btn-group class="add-cancel-btn-grp">
      <q-btn label="Cancel" />
      <q-btn label="Add schedule" @click="addWateringSchedule" />
    </q-btn-group>
  </div>
</template>

<script>
import { QDate, QTime, QInput, QBtnGroup, QBtn } from "quasar";
import IncrementerButton from "../components/IncrementerButton.vue";
import { mapGetters } from "vuex";
import { ADD_WATERINGSCHEDULE } from "../api/wateringschedule";

export default {
  name: "AddWateringSchedule",
  components: {
    QDate,
    QTime,
    QInput,
    QBtnGroup,
    QBtn,
    IncrementerButton
  },
  data() {
    return {
      date: "",
      time: "",
      interval: 0,
      intervalModifier: 1,
      plantName: ""
    };
  },

  created() {
    this.date = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");
  },

  computed: {
    ...mapGetters(["getUserId"]),

    timestamp() {
      let dateString = this.date.replace(/\//g, "-") + "T" + this.time + ":00";
      const timestamp = new Date(dateString);
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
            plant: [{ name: this.plantName }],
            userId: this.getUserId,
            timestamp: this.timestamp,
            interval: this.calculatedInterval
          }
        });
      } catch (error) {
        console.error(error); //eslint-disable-line
      }
    },
    setIntervalModifier(value) {
      this.intervalModifier = value;
    }
  }
};
</script>

<style scoped>
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
  justify-self: end;
  align-self: center;
  grid-column: 1;
}

.interval-btn-grp {
  align-self: center;
}

.interval-selector {
  grid-column: 3;
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
  background-color: green;
}
</style>