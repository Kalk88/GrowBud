<template>
  <ui-modal ref="signupModal" @hide="onDialogHide" :title="modalTitle">
    <div>
      <div>
        <ui-textbox v-model="userName" outlined type="text" label="Username" />
        <ui-textbox v-model="email" outlined type="email" label="Email" />
        <ui-textbox
          v-model="password"
          outlined
          type="password"
          label="Password"
        />
        <div slot="footer" class="button-section">
          <ui-button @click="register" size="large">
            Sign up
          </ui-button>
        </div>
      </div>
    </div>
  </ui-modal>
</template>

<script>
import { REGISTER_USER } from "../api/auth";
import { UiButton, UiTextbox, UiModal } from "keen-ui";

export default {
  name: "SignupCard",
  components: {
    UiButton,
    UiTextbox,
    UiModal
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      userName: "",
      email: "",
      password: "",
      modalTitle: "Sign up"
    };
  },

  created() {
    this.userName = "";
    this.email = "";
    this.password = "";
  },

  methods: {
    onDialogHide() {
      this.$emit("hideSignupModal", false);
    },

    async register() {
      let UserObject = await this.$apollo.mutate({
        mutation: REGISTER_USER,
        variables: {
          userName: this.userName,
          email: this.email,
          password: this.password
        }
      });
      const JWT = UserObject.data.register.JWT;
      localStorage.setItem("JWT", JWT);
    }
  }
};
</script>

<style scoped>
.q-dialog {
  max-width: 20rem;
  float: right;
}
.q-card {
  padding: 2rem;
  background: cornsilk;
}

.card-title {
  margin-bottom: 1rem;
}
.q-input {
  width: 20rem;
  margin-bottom: 1rem;
  background-color: whitesmoke;
}
</style>
