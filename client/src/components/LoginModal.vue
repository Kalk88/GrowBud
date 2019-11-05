<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section>
        <div class="text-h4 login-card-header">Log in</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="loginDetails.email" outlined type="email" label="Email" />
        <q-input v-model="loginDetails.password" outlined type="password" label="Password" />
      </q-card-section>
      <q-card-section class="button-section">
        <q-btn color="amber" label="Login" @click="login" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  ClosePopup,
  QInput
} from "quasar";
import { LOGIN } from "../api/auth";
//import gql from "graphql-tag";

export default {
  name: "LoginModal",
  components: {
    QDialog,
    QCard,
    QInput,
    QCardSection
  },
  directives: {
    ClosePopup
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loginDetails: {
        email: "",
        password: ""
      }
    };
  },

  methods: {
    async login() {
      //API.login(this.loginDetails);
      let JWT = await this.$apollo.mutate({
        mutation: LOGIN,
        variables: {
          email: this.loginDetails.email,
          password: this.loginDetails.password
        }
      });
      console.log(JWT);
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
.q-card {
  padding: 2rem;
  background: cornsilk;
}

.login-card-header {
  margin-bottom: 1rem;
}
.q-input {
  width: 20rem;
  margin-bottom: 1rem;
  background-color: whitesmoke;
}

.button-section {
  display: flex;
  justify-content: end;
}
</style>
