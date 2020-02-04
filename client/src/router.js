import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import AddWateringSchedule from "./views/AddWateringSchedule.vue";
import MyWateringSchedules from "./views/MyWateringSchedules.vue";

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
      beforeRouteUpdate(to, from, next) {
        if (store.state.isLoggedin) {
          next();
        } else {
          next(false);
        }
      }
    },
    {
      path: "/myWateringSchedules",
      name: "myWateringSchedules",
      component: MyWateringSchedules,
      beforeRouteUpdate(to, from, next) {
        if (store.state.isLoggedin) {
          next();
        } else {
          next(false);
        }
      }
    }
  ]
});
