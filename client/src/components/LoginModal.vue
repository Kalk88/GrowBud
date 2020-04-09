<template>
  <div>
    <ui-modal ref="loginModal" :title="modalTitle">
      <div>
        <div @keydown.enter="login">
          <ui-textbox
            class="login-email"
            v-model="authDetails.email"
            type="email"
            label="Email"
            :floatingLabel="true"
          />
          <ui-textbox
            class="login-password"
            v-model="authDetails.password"
            type="password"
            label="Password"
            :floatingLabel="true"
          />
        </div>
        <div slot="footer">
          <ui-button size="large primary-button btn" @click="login">
            Login
          </ui-button>
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script>
import { LOGIN } from "../api/auth";
import { upsertPushTokenOnLogin } from '../api/notifications'

export default {
  name: "AuthModal",

  props: {
    show: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      authDetails: {
        email: "",
        password: ""
      },
      modalTitle: "Log in"
    };
  },

  created() {
    this.authDetails.email = "";
    this.authDetails.password = "";

  },

  methods: {
    async login() {
      try {
        let response = await this.$apollo.mutate({
          mutation: LOGIN,
          variables: {
            email: this.authDetails.email,
            password: this.authDetails.password
          }
        });
        const { JWT, JWTExpiry } = response.data.login;
        const userID = response.data.login.id;
        this.$store.commit("setUserID", userID);
        this.$store.commit("setIsLoggedin", true);
        this.$store.commit("setInMemoryToken", { JWT, JWTExpiry });
       
        this.$refs["loginModal"].close();
        this.$router.push("/myWateringSchedules")
        if ( Notification.permission !="granted"){
          Notification.requestPermission()
        }
        upsertPushTokenOnLogin(JWT);
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.login-card-header {
  margin-bottom: 1rem;
}

::v-deep .ui-modal__body{
  overflow-y: initial;
}

::v-deep .ui-modal__header{
  background: $header-gradient;
  box-shadow: none;
  border-bottom: 2px solid $primary-dark;
}

::v-deep .ui-modal__container{
  background-color: $body-modal;
  width: 90%;
  border-radius: $standard-border-radius;
}
.ui-textbox {
  margin-bottom: 1rem;
  background-color: $shade-primary;
  border-radius: $standard-border-radius;
}
</style>
