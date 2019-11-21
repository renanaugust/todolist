import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";
import * as firebase from "firebase";
import store from "./store";

Vue.config.productionTip = false;

const configOptions = {
  apiKey: "AIzaSyA5J4YeSLOmtEkVLefYmH5l0hE4MaNheaM",
  authDomain: "firestoretest-5c3b5.firebaseapp.com",
  databaseURL: "https://firestoretest-5c3b5.firebaseio.com",
  projectId: "firestoretest-5c3b5",
  storageBucket: "firestoretest-5c3b5.appspot.com",
  messagingSenderId: "915798506207",
  appId: "1:915798506207:web:845cf3208cc212c27d076a",
  measurementId: "G-12L9PZHXZW"
};

firebase.initializeApp(configOptions);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
