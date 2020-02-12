<template>
  <div v-if="showInstallPromotion">Hej vill du installera</div>
</template>

<style></style>

<script>
export default {
  name: "PageHome",

  data() {
    return {
      deferredPrompt: null,
      showInstallPromotion: false
    };
  },

  created() {
    window.addEventListener("beforeinstallprompt ", e => {
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });
  },

  methods: {
    showInstallPromotion() {
      this.showInstallPromotion = true;
    }
  }
};
</script>
