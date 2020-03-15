<template>
  <div class="incrementerbutton-wrapper">
    <button class="sub_button primary-button" @click="subtract(), emitInputValueChange()">
      <ui-icon class="sub_button__icon" iconSet="material-icons">remove</ui-icon>
    </button>
    <input
      class="value_input"
      pattern="^[0-9]*$"
      v-model.number="value"
      @input="emitInputValueChange()"
      @blur="replaceEmptyStringWithZero()"
    />
    <button class="add_button primary-button" @click="add(), emitInputValueChange()">
      <ui-icon class="add_button__icon" iconSet="material-icons">add</ui-icon>
    </button>
  </div>
</template>

<script>
export default {
  name: "IncrementerButton",
  prop: ["value"],

  data() {
    return {
      value: 0
    };
  },
  mounted() {
    this.value = this.$attrs.value;
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
      if (this.value <= 0) {
        this.value = 1;
      }
    },
    replaceEmptyStringWithZero() {
      if (this.value === "") {
        this.value = 1;
        this.$emit("input", this.value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.incrementerbutton-wrapper {
  display: flex;
  flex-flow: row;
}

.add_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 25px;
  margin-left: 0.5rem;
  border: none;
}

.sub_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  border-top-left-radius: 25px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 5px;
  margin-right: 0.5rem;
  border: none;
}

button:hover {
  background: grey;
}

.value_input {
  width: 3rem;
  height: 2.5rem;
  align-self: center;
  text-align: center;
  font-size: 18px;
  border-radius: 15px;
  border: 3px solid $secondary;
  background: $body-warm;
}

.hide {
  display: none;
}
</style>
