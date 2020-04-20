<template>
  <ui-toolbar :removeNavIcon="true" title="Growbud" type="colored" :raised="false" >
    <div class="navbar-buttons" slot="actions" v-if="isLoggedin">
      <ui-icon-button class="mySchedules icon-btn" icon="calendar_today" type="secondary" @click="goToMyWateringSchedules">
      </ui-icon-button>
      <ui-icon-button @click="goToProfile" class="icon-btn" icon="account_box" type="secondary"></ui-icon-button>
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

::v-deep .ui-toolbar__title{
  padding-left: 1rem;
  font-size: 2rem;
  font-weight: bold;
}

nav > div {
  padding: 10px;
  background: $header-gradient;
  border-bottom: 4px solid $body-warm;
}

::v-deep .ui-icon{
  font-size: 2rem;
}

::v-deep .ui-icon-button{
  width: 2.5rem !important;
  height: 2.5rem !important;
}

.icon-btn{
  border-radius: 6px;
  color: $dark !important;
  margin-left: 2rem;
  margin-right:1rem;
  cursor: pointer;
}

.icon-btn:hover::after{
  opacity: 1;
}

.icon-btn::after{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  -webkit-box-shadow: inset 0 0 4px 1px $primary-dark;
  -moz-box-shadow: inset 0 0 4px 1px $primary-dark;
    box-shadow: inset 0 0 4px 1px $primary-dark;
  opacity: 0;
  transition: opacity 0.3s;
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
