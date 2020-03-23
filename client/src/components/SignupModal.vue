<template>
  <ui-modal ref="signupModal" :title="modalTitle">
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

export default {
  name: "SignupCard",
 
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

</style>
