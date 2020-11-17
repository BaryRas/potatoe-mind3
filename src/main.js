import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/firestore";
import Alert from "./components/Shared/Alert.vue";
import SuccessSnackbar from "./components/Shared/SuccessSnackbar.vue";
import i18n from "./i18n";

Vue.config.productionTip = false;
Vue.component("app-alert", Alert);
Vue.component("success-snackbar", SuccessSnackbar);

// Firebase and firestore
firebase.initializeApp({
  apiKey: "AIzaSyDHIjSBC1et2L83MoPjJV9xfGoL2ffIV5U",
  authDomain: "potatoe-mind3.firebaseapp.com",
  databaseURL: "https://potatoe-mind3.firebaseio.com",
  projectId: "potatoe-mind3",
  storageBucket: "potatoe-mind3.appspot.com",
  messagingSenderId: "916799931247",
  appId: "1:916799931247:web:bae8f47c7eaab9b2f15e9a",
});
export const db = firebase.firestore();

/* 

   This is how to persist a logged on user in this App after a page refresh or kind of

   It has to be combine with setUser (action) to the store
*/
const persist = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    let payload = {};
    // User is signed in.
    payload.id = user.uid;
    store.dispatch("setUser", payload);
    store.dispatch("fetchRegisterUserData", payload);
  } else {
    store.dispatch("fetchData");
  }
  i18n.locale = localStorage.getItem("lang") || "fr";
});

router.beforeEach((to, from, next) => {
  // use language from the routing param or default language
  let language = to.params.lang;
  if (!language) {
    language = "fr";
  }

  // set the current language for i18n.
  i18n.locale = language;
  next();
});

new Vue({
  router,
  store,
  vuetify,
  persist,
  i18n,
  render: (h) => h(App),
  created() {
    this.$store.dispatch("fetchData");
    window.addEventListener("resize", this.$store.commit("setWindowWidth"));
  },
}).$mount("#app");
