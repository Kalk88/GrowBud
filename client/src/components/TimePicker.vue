<template>
  <div class="timepickerWrapper">
    <ui-button class="primary-button"
      @click.stop="scrollValuesIntoView(), showDropdown=!showDropdown"
    >
      <span v-if="$attrs.value.length"
        >{{ formattedTime($attrs.value[0]) }}:{{
          formattedTime($attrs.value[1])
        }}</span
      >
      <ui-icon class="icon" iconSet="material-icons">add_alarm</ui-icon>
    </ui-button>
      <div v-if="showDropdown" class="dropdown">
        <div class="list">
          <span class="listheader">Hours</span>
          <ul class="hours">
            <li
              v-for="hr in hours"
              :key="hr"
              @click.stop="
                (chosenHour = hr), setChosenHour($event), emitInputValueChange()
              "
              :class="hr === chosenHour ? 'selected' : ''"
            >
              {{ formattedTime(hr) }}
            </li>
          </ul>
        </div>
        <div class="list">
          <span class="listheader">Minutes</span>
          <ul class="minutes">
            <li
              v-for="min in minutes"
              :key="min"
              @click.stop="
                (chosenMinute = min),
                  setChosenMinute($event),
                  emitInputValueChange()
              "
              :class="min === chosenMinute ? 'selected' : ''"
            >
              {{ formattedTime(min) }}
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "TimePicker",
  prop: ["value"],
  props: {
    timeLabel: {
      type: Array,
      default: Array.from([0, 0])
    }
  },

  created() {
    if (this.$attrs.value.length) {
      this.chosenHour = this.$attrs.value[0];
      this.chosenMinute = this.$attrs.value[1];
    }
    this.scrollValuesIntoView()
  },

  mounted() {
    this.$parent.$on('hide', ()=>{
      if(this.showDropdown === true){
        this.showDropdown = false;
      }
    })
  },

  data() {
    return {
      showDropdown: false,
      hours: Array.from(Array(24).keys()),
      minutes: Array.from(Array(59).keys(), x => (x = x + 1)),
      chosenHour: 0,
      chosenMinute: 0,
      chosenHourElem: null,
      chosenMinuteElem: null
    };
  },

  computed: {
    time() {
      let time = [this.chosenHour, this.chosenMinute];
      return time;
    }
  },

  methods: {
    setChosenHour(event) {
      this.chosenHourElem = event.target;
    },
    setChosenMinute(event) {
      this.chosenMinuteElem = event.target;
    },
    emitInputValueChange() {
      this.$emit("input", this.time);
    },
    formattedTime(time) {
      if (time < 10) {
        return `0${time}`;
      } else {
        return time;
      }
    },

    scrollValuesIntoView() {
      setTimeout(() => {
        if(!this.showDropdown){
          return
        }
       
        const hoursChildren = Array.from(
          document.querySelector(".hours").children
        );
        const minutesChildren = Array.from(
          document.querySelector(".minutes").children
        );
        const hourSelectedElem = hoursChildren.filter(
          li => li.className === "selected"
        );
        const minutesSelectedElem = minutesChildren.filter(
          li => li.className === "selected"
        );

        this.chosenHourElem = hourSelectedElem[0];
        this.chosenMinuteElem = minutesSelectedElem[0];

        this.chosenHourElem.scrollIntoView({behavior: 'smooth' , block: 'center'});
        this.chosenMinuteElem.scrollIntoView({ behavior: 'smooth' , block: 'center'});
          
      }, 10); // timeout is needed so that the dropdown can render before scroll
    }
  }
};
</script>

<style scoped lang="scss">
.timepickerWrapper {
  max-height: 3rem;
}

::v-deep .ui-button{
  height: 3rem;
}

.btn {
  border-bottom: 1px solid lightgrey;
}
.icon {
  margin-left: 1rem;
}

::v-deep .ui-popover{
  border-radius: 25px;
}

.dropdown {
  position: absolute;
  display: flex;
  flex-direction: row;
  max-height: 12rem;
  background: $body-cold;
  border:2px solid black;
  z-index: 100;
  border-radius: 15px;
  overflow: hidden;

  div {
    overflow-y: scroll;
    overflow-x: hidden;
    text-align: center;
    scrollbar-width: none;
    width: 5rem;

    .listheader {
      position: sticky;
      display: block;
      background: $body-cold;
      padding-top: 0.5rem;
      top: 0;
      z-index: 10;
      width: 5rem;
    }

    ul {
      position: relative;
      list-style: none;
      padding: 0;

      .selected {
        background: lightgray;
        border-radius: 4px;
      }

      li {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      li:hover {
        background: lightgray;
        border-radius: 4px;
      }
    }
  }
}
</style>
