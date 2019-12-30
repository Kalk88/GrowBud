<template>
  <div class="incrementerbutton-wrapper">
    <button class="add_button" @click="add(), emitInputValueChange()">
      <q-icon class="add_button__icon" name="eva-arrow-up-outline" style="font-size: 3.5rem;" />
    </button>
    <input
      class="value_input"
      pattern="^[0-9]*$"
      v-model.number="value"
      @input="emitInputValueChange()"
      @blur="replaceEmptyStringWithZero()"
    />
    <button class="sub_button" @click="subtract(), emitInputValueChange()">
      <q-icon class="sub_button__icon" name="eva-arrow-down-outline" style="font-size: 3.5rem;" />
    </button>
  </div>
</template>

<script>
import { QIcon } from "quasar";

export default {
  name: "IncrementerButton",
  prop: ["value"],
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
    },

    emitInputValueChange() {
      const pattern = /^[0-9]*$/;
      if (pattern.test(this.value) && this.value !== "") {
        this.$emit("input", this.value);
      }
      if (this.value < 0) {
        this.value = 0;
      }
    },
    replaceEmptyStringWithZero() {
      if (this.value === "") {
        this.value = 0;
      }
    }
  }
};
</script>

<style scoped>
.incrementerbutton-wrapper {
  display: flex;
  flex-flow: column;
  width: 3.5rem;
}

.add_button {
  display: flex;
  justify-content: center;
  width: 3.5rem;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border: solid;
  margin-bottom: 0.5rem;
}

.sub_button {
  display: flex;
  justify-content: center;
  width: 3.5rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  margin-top: 0.5rem;
  border: solid;
}

.value_input {
  width: 3rem;
  height: 3.5rem;
  align-self: center;
  text-align: center;
  font-size: 28px;
}
</style>