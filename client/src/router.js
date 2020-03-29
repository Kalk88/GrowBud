import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import AddWateringSchedule from "./views/AddWateringSchedule.vue";
import MyWateringSchedules from "./views/MyWateringSchedules.vue";
import Profile from "./views/Profile.vue";

Vue.use(Router);

export default new Router({

  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/addWateringSchedule",
      name: "addWateringSchedule",
      component: AddWateringSchedule,
      props: {
        schedule: {}
      },
      beforeRouteEnter(to, from, next){
        if (store.getters.isLoggedin) {      
          next();
        } else if (to !== '/'){
          next(false);
        } else {
          next('/')
        }
      },
    
    },
    {
      path: "/myWateringSchedules",
      name: "myWateringSchedules",
      component: MyWateringSchedules,
      beforeRouteEnter(to, from, next){
        if (store.getters.isLoggedin) {      
          next();
        } else if (to !== '/'){
          next(false);
        } else {
          next('/')
        }
      },

    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      beforeRouteEnter(to, from, next){
        if (store.getters.isLoggedin) {      
          next();
        } else if (to !== '/'){
          next(false);
        } else {
          next('/')
        }
      },
    }
  ]
});
