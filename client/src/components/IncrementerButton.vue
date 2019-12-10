<template>
  <div class="incrementerbutton-wrapper">
    <button class="add_button" @click="add">
      <q-icon class="add_button__icon" name="eva-arrow-up-outline" style="font-size: 1.5rem;" />
    </button>
    <input class="value_input" pattern="^[0-9]*$" v-model.number="value" />
    <button class="sub_button" @click="subtract">
      <q-icon class="sub_button__icon" name="eva-arrow-down-outline" style="font-size: 1.5rem;" />
    </button>
  </div>
</template>

<script>
import { QIcon } from "quasar";

export default {
  name: "IncrementerButton",
  components: {
    QIcon
  },

  data() {
    return {
      value: 0
    };
  },

  methods: {
    add() {
      if (Number.isInteger(this.value)) {
        this.value += 1;
      }
    },

    subtract() {
      if (Number.isInteger(this.value)) {
        this.value -= 1;
      }
    }
  }
};
</script>

<style scoped>
.incrementerbutton-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.add_button {
  display: flex;
  justify-content: center;
  width: 2.5rem;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.add_button_icon {
  font-size: 2.5rem;
}

.sub_button {
  display: flex;
  justify-content: center;
  width: 2.5rem;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}

.sub_button_icon {
  font-size: 2.5rem;
}

.value_input {
  width: 2.5rem;
}
</style>