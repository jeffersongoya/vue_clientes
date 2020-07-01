import Vue from "vue";
import App from "./App.vue";
import "vuetify/dist/vuetify.min.css";
import Vuetify from "vuetify";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
