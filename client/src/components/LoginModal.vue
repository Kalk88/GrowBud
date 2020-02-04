<template>
  <div>
    <ui-modal ref="loginModal" :title="modalTitle">
      <div>
        <div>
          <ui-textbox
            class="login-email"
            v-model="authDetails.email"
            type="email"
            label="Email"
          />
          <ui-textbox
            class="login-password"
            v-model="authDetails.password"
            type="password"
            label="Password"
          />
        </div>
        <div slot="footer">
          <ui-button size="large" @click="login">
            Login
          </ui-button>
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script>
import { LOGIN } from "../api/auth";
import { UiButton, UiTextbox, UiModal } from "keen-ui";

export default {
  name: "AuthModal",
  components: {
    UiButton,
    UiTextbox,
    UiModal
  },

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
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.q-dialog {
  max-width: 20rem;
  float: right;
}
.ui-card {
  padding: 2rem;
  background: cornsilk;
}

.login-card-header {
  margin-bottom: 1rem;
}
.ui-textbox {
  width: 20rem;
  margin-bottom: 1rem;
  background-color: whitesmoke;
}
</style>
