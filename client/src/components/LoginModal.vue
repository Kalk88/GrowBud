<template>
  <q-dialog v-model="showModal" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <div class="text-h4 login-card-header">{{ modalTitle }}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          class="login-email"
          v-model="authDetails.email" 
          outlined 
          type="email" 
          label="Email" 
        />
        <q-input 
          class="login-password"
          v-model="authDetails.password" 
          outlined 
          type="password" 
          label="Password" 
        />
      </q-card-section>
      <q-card-section size="lg" class="button-section">
        <q-btn
          class="full-width login-modal-btn"
          color="amber"
          size="lg"
          label="Login"
          @click="login"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  QDialog,
  QCard,
  QCardSection,
  ClosePopup,
  QInput
} from "quasar";
import { LOGIN } from "../api/auth";

export default {
  name: "AuthModal",
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
    showModal:{
      type: Boolean,
      default:false
    }
  },

  data() {
    return {
      authDetails: {
        email: "",
        password: ""
      },
      modalTitle:"Log in"
    };
  },

  created() {
    this.authDetails.email = "";
    this.authDetails.password = "";
  },

  methods: {
    onDialogHide() {
      this.$emit("hideLoginModal", false);
    },

    async login() {
      let UserObject = await this.$apollo.mutate({
        mutation: LOGIN,
        variables: {
          email: this.authDetails.email,
          password: this.authDetails.password
        }
      });
      const JWT = UserObject.data.login.JWT;
      localStorage.setItem("JWT",JWT)
      if(JWT)[
        this.$router.push('about')
      ]
    },
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


</style>
