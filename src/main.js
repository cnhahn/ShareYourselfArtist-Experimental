// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import 'firebase/firestore'
import App from './App'
import router from './router'
import { store } from './store'
import AlertComp from './components/Shared/alert.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PayPal from 'vue-paypal-checkout'
import CustomSpinner from './components/shared/custom_spinner'
import 'babel-polyfill'
import VueAnalytics from 'vue-analytics'

import {

  Vuetify,
  VAlert,
  VApp,
  VCard,
  VChip,
  VDatePicker,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VJumbotron,
  VGrid,
  VToolbar,
  VTooltip,
  VParallax,
  VProgressCircular,
  VTextField,
  VSnackbar,
  VSubheader,
  VAvatar,
  VBadge,
  VDivider,
  VProgressLinear,
  VBottomSheet,
  VTabs,
  VExpansionPanel,
  transitions,
  VStepper,
  VSwitch,
  VDataTable,
  VCheckbox,
  VSelect,
  VMenu,
  VDialog,
  VRadioGroup

} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import VueResource from '../node_modules/vue-resource';
library.add(faCoffee)
Vue.use(VueResource)

Vue.use(Vuetify, {
  components: {
    FontAwesomeIcon,
    Vuetify,
    VAlert,
    VApp,
    VCard,
    VChip,
    VDatePicker,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VJumbotron,
    VGrid,
    VToolbar,
    VTooltip,
    VParallax,
    VProgressCircular,
    VTextField,
    VSnackbar,
    VSubheader,
    VAvatar,
    VBadge,
    VDivider,
    VProgressLinear,
    VBottomSheet,
    VTabs,
    VExpansionPanel,
    transitions,
    VStepper,	
    VSwitch,
    VDataTable,
    VCheckbox,
    VSelect,
    VMenu,
    VDialog,
    VRadioGroup
  },
  theme: {
    primary: '#FF7D27',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    randColor1: '#F44336',
    randColor2: '#FF5252',
    randColor3: '#D81B60',
    randColor4: '#880E4F',
    randcolor5: '#BA68C8',
    randColor6: '#7B1FA2',
    randColor7: '#4A148C',
    randColor8: '#AA00FF',
    randColor9: '#4E342E',
    randColor10: '#1DE9B6'//implement these colors with white themes
  }
})

Vue.config.productionTip = false
Vue.component('app-alert', AlertComp)
Vue.component('c-spinner', CustomSpinner)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyCRuyHwa9pXxru5ISMcE5TRqbU4tzIuzwg",
      authDomain: "sya-dev.firebaseapp.com",
      databaseURL: "https://sya-dev.firebaseio.com",
      projectId: "sya-dev",
      storageBucket: "sya-dev.appspot.com",
      messagingSenderId: "164082581990"
    })

    //the following is a FB SDK to check if the user is signed in already
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //this.$store.dispatch('fetchUserDocument')
      }
    })
  },

  // once initialized, grab replied submissions
  beforeMount: function () {
    this.$store.dispatch('get_users')
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // this.$store.dispatch('fetch_replied_submissions')
        // this.$store.dispatch('fetchUserDocument');
      }
    })
  },

  // upon update or refresh, continue with persistent log-in & fetch documents prior to creation
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // this.$store.dispatch('fetchUserDocument'); //added
        this.$store.dispatch('autoSignIn', user);
        this.$store.dispatch('fetchArts')
        this.$store.dispatch('fetchSubmissions')
        this.$store.dispatch('fetchUserDocument') 
        console.log('on mounted: ', user)
        this.$store.dispatch('get_user_credit', user.uid)

      }
    })
  },


})
