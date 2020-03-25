<template>
  <ui-modal ref="signupModal" :title="modalTitle">
    <div>
      <div>
        <ui-textbox v-model="userName" outlined type="text" label="Username" :floatingLabel="true" />
        <ui-textbox v-model="email" outlined type="email" label="Email" :floatingLabel="true" />
        <ui-textbox
          v-model="password"
          outlined
          type="password"
          label="Password"
          :floatingLabel="true"
        />
        <div slot="footer" class="button-section">
          <ui-button class="primary-button" @click="register" size="large">
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
      this.$refs["signupModal"].close();
      this.$router.push("/myWateringSchedules")
      const JWT = UserObject.data.register.JWT;
      localStorage.setItem("JWT", JWT);
    }
  }
};
</script>

<style scoped lang="scss">

::v-deep .ui-modal__body{
  overflow-y: initial;
}

::v-deep .ui-modal__header{
  background: $header-gradient;
  box-shadow: 0 2px 2px 1px $body-warm;
}

::v-deep .ui-modal__container{
  background-color: $primary-light;
  width: 90%;
  border-radius: $standard-border-radius;
}
.ui-textbox {
  margin-bottom: 1rem;
  background-color: $shade-primary;
  border-radius: $standard-border-radius;
}

</style>
