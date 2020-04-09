<template>
  <ui-toolbar :removeNavIcon="true" title="Growbud" type="colored" :raised="false" >
    <div class="navbar-buttons" slot="actions" v-if="isLoggedin">
      <ui-button class="mySchedules navbar-button" @click="goToMyWateringSchedules">
        My schedules
      </ui-button>
      <ui-icon-button @click="goToProfile" class="profile-icon-btn" icon="account_box" type="secondary"></ui-icon-button>
    </div>
  </ui-toolbar>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Toolbar",

  computed: mapState(["isLoggedin"]),
  
  methods: {
    goToMyWateringSchedules() {
      this.$router.push("myWateringSchedules").catch(err => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
  
  goToProfile() {
      this.$router.push("profile").catch(err => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
  
}

};
</script>
<style scoped lang="scss">
nav {
  display: flex;
  flex-direction: row;
}

nav > div {
  padding: 10px;
  background: $header-gradient;
  border-bottom: 4px solid $body-warm;
}

::v-deep .ui-icon{
  font-size: 2.5rem;
}

::v-deep .ui-icon-button{
  width: 2.5rem !important;
  height: 2.5rem !important;
}

.profile-icon-btn{
  border-radius: 6px;
  color: $dark !important;
  margin-left: 2rem;
  margin-right:1rem;
}

.profile-icon-btn:hover{
  -webkit-box-shadow: inset 0 0 4px 1px $forest-secondary;
     -moz-box-shadow: inset 0 0 4px 1px $forest-secondary;
          box-shadow: inset 0 0 4px 1px $forest-secondary;
   outline: none;
}


.mySchedules:hover {
  color: black;
}
.navbar-buttons{
  display:flex;
  flex-direction: row;
  justify-content: center;
}
</style>
