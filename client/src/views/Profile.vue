<template>
<div class="wrapper"> 
  <ui-button :class="allowNotifications ? 'disabled-btn' : 'primary-button'" @click="requestPermission()" :disabled="allowNotifications" style="margin: 5rem;">{{allowNotificationsText}}</ui-button>
  <!-- <ui-button class="primary-button" @click="logout">Logout</ui-button> -->
</div>
  
</template>

<script>

export default {
  name: "Profile",

  data() {
    return{
      allowNotificationsText: "",
    }
  },

  created(){
    this.allowNotificationsText= this.allowNotifications ? 'Notifications on' : 'Allow notifications?'
  },

  computed:{
    allowNotifications() {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return;
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        return true;
      } else {
        return false;
      }
      },
      
  },
    methods: {
      requestPermission() {
          Notification.requestPermission()
      },
   

    logout(){
      
    }
},

}
    
  

</script>
<style lang="scss" scoped>

</style>