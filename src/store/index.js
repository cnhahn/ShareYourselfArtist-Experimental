// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import 'firebase/firestore'

import router from '../router'
import VueGoogleCharts from 'vue-google-charts'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)
Vue.use(VueGoogleCharts)


export const store = new Vuex.Store({
  modules: {
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state
  }
})
