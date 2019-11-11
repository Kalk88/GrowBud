<template>
<q-dialog v-model="showModal" @hide="onDialogHide">
    <q-card>
        <q-card-section>
            <div class="text-h4 card-title">{{ modalTitle }}</div>
        </q-card-section>
        <q-card-section>
            <q-input 
              v-model="userName" 
              outlined 
              type="text"
              label="Username" 
              />
            <q-input 
              v-model="email" 
              outlined 
              type="email" 
              label="Email" 
              />
            <q-input 
              v-model="password" 
              outlined 
              type="password" 
              label="Password" 
              />
        </q-card-section>
        <q-card-section size="lg" class="button-section">
            <q-btn 
              class="full-width" 
              color="amber" 
              size="lg" 
              @click="register" 
              label="Sign up" 
              v-close-popup />
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
import {
  REGISTER_USER
} from "../api/auth";

export default {
  name: "SignupCard",
  components: {
    QDialog,
    QCard,
    QCardSection,
    QInput,
  },
   directives: {
    ClosePopup
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
      localStorage.setItem("JWT",JWT)
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
