<template>
  <div>
    <AuthButtonsAndModals v-if="!isLoggedin" />
  </div>
</template>

<style>
</style>

<script>

import AuthButtonsAndModals from '../components/AuthButtonsAndModals';
import {mapState} from 'vuex'

export default {
  name: "Home",
  components: {
    AuthButtonsAndModals
  },

  computed: mapState(["isLoggedin"]),


};
</script>
