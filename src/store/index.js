// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import 'firebase/firestore'
import config from '../config'
import router from '../router'
import VueGoogleCharts from 'vue-google-charts'
import { access } from 'fs';

firebase.initializeApp(config)
Vue.use(Vuex)
Vue.use(VueGoogleCharts)


export const store = new Vuex.Store({
  state: {
    business_info : {},
    business_info_set : false,
    business_members: [],
    group_business_id : '',
    users_top_category : '' ,
    top_ten_category: [],
    top_ten_rec_businesses : [],
    check_image_c: true,
    image_uploaded: false,
    start_image_uploaded: false,
    art_uploaded: null,
    viewed_art_image_info: [],
    top_12_recent_art: [],
    viewed_artist_data: {},
    localStorage,
    db: firebase.firestore(),
    chat_database: firebase.database(),
    arts: [],
    recently_responded_arts: [],
    comments: [],
    commenting_mode: false,
    sideNavItems: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        link: '/artist_dashboard'
      },
      {
        //title: 'My Profile',
        title: 'My Profile',
        icon: 'home',
        link: '/profile/artist'
      },
      // { title: 'Bio & Stats', icon: 'face', link: '/bio' },
      {
        //title: 'Get Credits',
        title: 'Get Credits',
        icon: 'account_box',
        link: '/account'
      }
    ],
    business_side_nav_items: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        link: '/business_dashboard'
      },
      // { title: 'Bio & Stats', icon: 'face', link: '/bio' },
      // { title: 'My Account', icon: 'account_box', link: '/account' },
      //{
      //  title: 'Report',
      //  icon: 'assessment',
      //  link: '/report'
      //},
      {
        title: 'Chat',
        icon: 'chat',
        link: '/chat'
      }
    ],
    navItems: [

      /*
      {
        title: 'Home',
        icon: 'home',
        link: '/',
        method: '',
        spacing: false
      },
      */
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',
        spacing: false

      },
      {
        title: 'Support',
        icon: 'help',

        link: '/support',
        spacing: false

      },
      {
        title: 'About Us',
        icon: 'nature_people',

        link: '/about_us',
        spacing: false

      },
      {
        title: 'Sign In | Sign Up',
        icon: 'nature_people',

        link: '/sign_in',
        spacing: true

      }
    ],
    navItems_User: [],
    navItems_signedIn: [
      {
        title: 'Submit Your Work',
        icon: 'chrome_reader_mode',
        link: '/blogs'
      },
      {
        title: 'Support',
        icon: 'help',
        link: '/support'
      },
      {
        title: 'About Us',
        icon: 'nature_people',
        link: '/about_us'
      }
    ],
    navItems_Business: [
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',
        method: 'dummyMethod'
      }
    ],
    sendChatData: {
      user: '',
      message: '',
      daystamp: '',
      timestamp: '',
      url: ''
    },
    uploadedArts: [],
    viewed_arts: [],
    user: null,
    stored_user_email: null,
    color: 'primary',
    loading: false,
    error: null,
    image_being_uploaded: {},
    url: null,
    logo_url: '',
    user_role: '',
    image_folder: '',
    businesses: [],
    business_signing_up: {},
    artist_signing_up: {},
    clicked_business: {},
    clicked_art: '',
    art_being_submitted_is_selected: false,
    business_being_submitted_is_selected: false,
    businesses_being_submitted: [],
    test: 4,
    signed_in_user_email: null,
    signed_in_user: {},
    art_being_submitted: {
      refunded: 0
    },
    replied_requests_for_report_datePicker: [],
    submissions_for_this_business: [],
    reserved_submissions: [],
    responded_submissions: [],
    submissions_for_month: [],
    submissions_for_year: [],
    epochFirstDayOfMonthArray: [], // aortizoj
    submission_response: {},
    art_being_replied: {},
    credits: 0,
    replied_submissions: [],
    avatar: '',
    signed_in_user_id: '',
    blog_for_report: '',
    subscription_plan: {},
    replied_for_report: [],
    report_month: 1,
    free_credits: 0,
    artists_email_list: [],
    categories: [],
    updatedCategories: [],
    selectBlog: {
      userId: '',
      name: '',
      role: ''
    },
    free_credits: 0,
    artists_email_list: [],
    selectBlog: {
      userId: '',
      name: '',
      role: ''
    },
    // working on setting two dates into the date picker
    datePicker: {
      startDate: '',
      endDate: ''
    },
    monthly_report_submissions: [],
    // store email of artist that was just clicked (worked on by Yas)
    query_business_email: '',
    // yiwayana
    info_of_business_for_dashboard2: {},

    // yiwayana and aortiz
    epoch_month_time: [],
    chart_array_for_submissions: [],
    chart_replied_for_submissions: [],
    chart_free_for_submissions: [],
    chart_paid_for_submissions: []
  },
  mutations: {
    set_business_info(state,payload){
      state.business_info = payload;
      state.business_info_set = true;
    },
    set_business_members(state,payload){
      state.business_members.push(payload)
    },
    set_reserved_submissions(state, payload) {
      state.reserved_submissions.push(payload)
    },
    clear_submissions_for_this_reserved_array(state) {
      state.reserved_submissions = []
    },
    set_responded_submissions(state, payload) {
      state.responded_submissions.push(payload)
    },
    clear_submissions_for_this_responded_array(state) {
      state.responded_submissions = []
    },
    set_top_ten_category(state,payload){
      state.top_ten_category = [],
      state.top_ten_category = payload
    },
    set_top_ten_rec_businesses(state, payload){
      state.top_ten_rec_businesses = [],
      state.top_ten_rec_businesses = payload
    },
    set_viewed_art_image_info(state, payload) {
      state.viewed_art_image_info = [],
      state.viewed_art_image_info = payload
    },
    // Sign user out by setting user element to null
    set_user_to_null(state) {
      state.user = null
      state.user_role = ''
      //console.log('set user to null')
    },
    //set the spinner for the timer
    set_start_image_uploaded(state, payload){
      state.start_image_uploaded = payload
    },

    //to act as a spinner timer
    set_image_uploaded(state, payload){
      console.log('entered set_image_uploaded------------------index.js')
      console.log('payload for image upload is ' , payload)
      state.image_uploaded = payload
      console.log('image uploaded in store is now of value ', state.image_uploaded)
      //console.log('--- mutation : stop loading prof img-----------index_profile')

      console.log('exited set_image_uploaded-------------------index.js')
    },
    set_check_image_c(state,payload){
      state.check_image_c = payload
      console.log('----check set-----')
    },

    set_art_uploaded(state, payload) {
      state.art_uploaded = payload
    },
    set_info_of_business_for_dashboard2(state, payload) {
      state.info_of_business_for_dashboard2 = payload
    },
    clear_info_of_business_for_dashboard2(state) {
      state.info_of_business_for_dashboard2 = {}
    },
    clear_businesses_being_submitted(state) {
      state.businesses_being_submitted = []
    },
    set_epoch_month_times(state, payload) {
      state.epoch_month_time = payload
    },
    set_chart_array_for_submissions(state, payload) {
      state.chart_array_for_submissions = payload
    },
    set_chart_replied_for_submissions(state, payload) {
      state.chart_replied_for_submissions = payload
    },
    set_chart_paid_for_submissions(state, payload) {
      state.chart_paid_for_submissions = payload
    },
    set_chart_free_for_submissions(state, payload) {
      state.chart_free_for_submissions = payload
    },
    clear_query_datePicker_list(state) {
      state.replied_requests_for_report_datePicker = []
    },
    set_query_business_email(state, payload) {
      state.query_business_email = payload.business_email
    },
    set_datePicker(state, payload) {
      const start_date = payload.startDate + '-00-00-00'
      const start_d = start_date.split('-')
      const start_epoch = new Date(
        start_d[0],
        start_d[1] - 1,
        start_d[2],
        start_d[3],
        start_d[4],
        start_d[5]
      ).valueOf()
      const end_date = payload.endDate + '-00-00-00'
      const end_d = end_date.split('-')
      let end_epoch = new Date(
        end_d[0],
        end_d[1] - 1,
        end_d[2],
        end_d[3],
        end_d[4],
        end_d[5]
      ).valueOf()

      if (end_epoch == start_epoch) {
        console.log('end epoch is : ', end_epoch)
        end_epoch = end_epoch + 86400000
      }

      state.datePicker.startDate = start_epoch
      state.datePicker.endDate = end_epoch
    },
    set_top_12_recent_art(state, payload) {
      state.top_12_recent_art.push(payload)
    },
    set_commenting_mode(state, payload) {
      state.commenting_mode = payload
    },
    set_viewed_artist_data(state, payload) {
      state.viewed_artist_data = payload
    },
    clear_top_12_recent_art(state) {
      state.top_12_recent_art = []
    },
    set_free_credits(state, payload) {
      console.log('inside set free credits')
      console.log(payload)
      if (payload != null || payload != undefined || payload != '') {
        state.free_credits = payload
      } else {
        console.log(
          'An error occured reading the free credits. This user may have never given any free credits.'
        )
      }
    },
    set_artists_email_list(state, payload) {
      state.artists_email_list.push(payload)
    },
    clear_artists_email_list(state) {
      state.artists_email_list = []
    },
    set_blog_for_report(state, payload) {
      state.blog_for_report = payload
    },
    set_categories(state, payload) {
      state.categories = payload
    },
    set_updatedCategories(state, payload) {
      state.updatedCategories = payload
    },
    set_businesses_being_submitted(state, payload) {
      console.log("payload for business beings ubmitted is ", payload)
      state.businesses_being_submitted = payload
    },
    set_art_being_submitted_is_selected(state, payload) {
      state.art_being_submitted_is_selected = payload
    },
    set_business_being_submitted_is_selected(state, payload) {
      state.business_being_submitted_is_selected = payload
    },
    set_art_being_replied(state, payload) {
      (state.art_being_replied.art_title = payload.art_title),
        (state.art_being_replied.artist_name = payload.artist_name),
        (state.art_being_replied.submitted_on = payload.submitted_on),
        (state.art_being_replied.description = payload.description),
        (state.art_being_replied.artist_id = payload.artist_id),
        (state.art_being_replied.docId = payload.docId)
    },
    increase_credits(state, payload) {
      state.credits = state.credits + payload
    },
    set_credits(state, payload) {
      state.credits = payload
    },
    reset_replied_submissions(state) {
      state.replied_submissions.length = 0
    },
    set_replied_submissions(state, payload) {
      if(payload.delete_byartist != true){
        state.replied_submissions.push(payload)
      }
    },
    clear_replied_submissions_array(state) {
      state.replied_submissions = []
    },
    set_response(state, payload) {
      state.submission_response.response = payload.response
      state.submission_response.radios = payload.radios
    },
    set_submission_response(state, payload) {
      state.submission_response = payload
    },
    clear_submissions_for_this_business_array(state) {
      state.submissions_for_this_business = []
    },
    set_submissions_for_this_business(state, payload) {
      state.submissions_for_this_business.push(payload)
    },
    set_art_being_submitted(state, payload) {
      state.art_being_submitted.art = payload
    },
    set_business_being_submitted(state, payload) {
      state.art_being_submitted.businessId = payload.businessId
      state.art_being_submitted.submitted_on = payload.date
    },
    set_clicked_art(state, payload) {
      state.clicked_art = payload
    },
    business_signing_up(state, payload) {
      state.business_signing_up = payload
    },
    artist_signing_up(state, payload) {
      state.artist_signing_up = payload
    },
    test(state, payload) {
      state.test = payload
    },
    set_image_folder(state, payload) {
      state.image_folder = payload
    },
    clear_arts_array(state) {
      state.arts = []
    },
    setArts(state, payload) {
      state.arts.push(payload)
    },
    set_recently_responded_arts (state, payload) {
      state.recently_responded_arts.push(payload)
    },
    set_comments(state, payload) {
      state.comments.push(payload)
    },
    clear_viewed_arts_array(state) {
      state.viewed_arts.length = 0
      console.log('entered state.viewed arts is ' , state.viewed_arts)
    },
    clear_comments_array(state) {
      state.comments = []
    },
    set_viewed_arts(state, payload) {
      state.viewed_arts.push(payload)
    },
    setArtCategory(state, payload) {
      console.log('payload.indexOfUpdatedArt', payload.indexOfUpdatedArt)
      console.log('payload.categories', payload.categories)
      state.arts[payload.indexOfUpdatedArt].categories = payload.categories
    },
    clearBusinesses(state) {
    },
    setBusinesses(state, payload) {
      state.businesses.push(payload)
    },
    set_replied_requests_for_report_datePicker(state, payload) {
      state.replied_requests_for_report_datePicker.push(payload)
    },
    clear_replied_for_report_datePicker(state) {
      state.replied_requests_for_report_datePicker = []
    },
    setClickedBusiness(state, payload) {
      state.clicked_business = payload
    },
    setUserRole(state, payload) {
      state.user_role = payload
    },
    uploadedArt(state, payload) {
      state.uploadedArts.push(payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    setUrl(state, payload) {
      state.url = payload
    },
    set_logo_url(state, payload) {
      state.logo_url = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    set_stored_user_email(state) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          state.stored_user_email = user.email
        } else {
          // No user is signed in.
          console.error('No user signed in');
        }
      });
    },
    set_user_email(state) {
      state.signed_in_user_email = firebase.auth().currentUser.email
    },
    clearError(state) {
      state.error = null
    },
    set_send_chat_data(state, payload) {
      state.sendChatData.message = payload.message
      state.sendChatData.user = payload.user
      state.sendChatData.daystamp = payload.daystamp
      state.sendChatData.timestamp = payload.timestamp
      state.sendChatData.url = payload.url
    },
    setUserRandColor(state) {
      var rand = Math.floor(Math.random() * 10)
      var randColors = [
        'randColor1',
        'randColor2',
        'randColor3',
        'randColor4',
        'randColor5',
        'randColor6',
        'randColor7',
        'randColor8',
        'randColor9',
        'randColor10'
      ]

      state.color = randColors[rand]
      console.log('color: ' + state.color)
    },
    setUserColor(state, payload) {
      state.color = payload.color
    },
    image_being_uploaded(state, payload) {
      //console.log('resizedURL and file in store: ', payload)
      state.image_being_uploaded = payload
    },
    set_group_business_id(state,payload){
      state.group_business_id = payload;
    },
    set_user_email(state) {
      state.art_being_submitted.artist_email = firebase.auth().currentUser.email
    },
    clearError(state) {
      state.error = null
    },
    signed_in_user_id(state, payload) {
      state.signed_in_user_id = payload
    },
    signed_in_user(state, payload) {
      state.signed_in_user = payload
    },
    sign_out_signed_in_user(state) {
      state.signed_in_user = null
      state.url = null
      state.color = 'primary'
    },
    set_replied_for_report(state, payload) {
      state.replied_for_report.push(payload)
    },
    set_report_month(state, payload) {
      state.report_month = payload
    },
    set_select_blog(state, payload) {
      (state.selectBlog.name = payload.name),
        (state.selectBlog.userId = payload.userId),
        (state.selectBlog.role = payload.role)
    },
    set_submissions_for_year(state, payload) {
      // aortizoj
      state.submissions_for_year.push(payload)
    },
    clear_submissions_for_year_array(state) {
      // aortizoj
      state.submissions_for_year = []
    },
    set_submissions_for_month(state, payload) {
      // aortizoj
      state.submissions_for_month.push(payload)
    },
    set_epochFirstDayOfMonthArray(state, payload) {
      // aortizoj
      state.epochFirstDayOfMonthArray.push(payload)
    },
    clear_submissions_for_month_array(state) {
      // aortizoj
      state.submissions_for_month = []
    },
    set_monthly_report_submissions(state, payload) {
      state.monthly_report_submissions = payload
    },
    set_artist_settings_artist(state, payload) {
      state.artist_settings_artist = payload.obj
    }
  },
  actions: {
    retrieve_recently_responded_arts({ commit, dispatch, state }, payload) {
      state.recently_responded_arts = []
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/recentlyRepliedSubmissions'
      console.log("In retrieve_recently_responded_arts")
      if (!('fetch' in window)) {
        console.log('Fetch API not found, try including the polyfill');
        return
      } else {
        console.log("Aye works")
      }
      fetch(proxyUrl + targetUrl)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          // let jsonSize = myJson.length
          // let i = 0
          // console.log("jsonSize is " , jsonSize)
          // for ( i = 0; i < jsonSize; i++) {
          //   console.log("Entering for loop")
          //   let object = myJson[i]
          //   console.log("object is ", object)
          // }
          console.log(myJson.body)
          let jsonSize = Object.keys(myJson.body).length
          let i = 0
          for (i = 0; i < jsonSize; i++) {
            console.log("Item is ", myJson.body[i])
            commit('set_recently_responded_arts', myJson.body[i])
      
          }
          console.log('recently_responded_arts is ' , state.recently_responded_arts)
        })
    },
    retrieve_recommended_businesses({commit,state,getters}, payload){
      console.log("in retrieve stuff for bussiness")
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/getRecommendedBusinesses'
      console.log("In retrieve responded businesses ")
      if (!('fetch' in window)) {
        return
      } else {
      }

      fetch(proxyUrl + targetUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (myJson) {
        console.log(" i really hope thats not it ",( myJson[1]))
        let top_ten_businesses = []
        for(let user in myJson[1]){
          // console.log('grabbed useburs top ten recommended artists ' , key)
          top_ten_businesses.push(myJson[1][user].userData)
        }

        console.log("top ten business is ",top_ten_businesses)
        commit('set_top_ten_rec_businesses' , top_ten_businesses)
      })
    },
    retrieve_recommended_arts({commit,state,getters}, payload){
      console.log('in retrieve recommended arts')
      //Get current user's id and find their top submitted category.
      let userId = getters.user.id
      let db = firebase.firestore()
      let art = db.collection("users").doc(userId).get()
      .then(function (results){
        console.log('categorie are ' ,results.data().categories)
        // Convert object into an array
        var categoryArray = Object.keys(results.data().categories).map(function(key) {
          return [results.data().categories[key], key]
        });
        // Categories are all here, we will find the max category 
        console.log('array object is now ' , categoryArray)
        let maxCategory = 0;
        let maxCount = 0;
        for(var i = 0 ; i < categoryArray.length; i++){
          if(categoryArray[i][0].count >= maxCount){
            maxCount = categoryArray[i][0].count
            maxCategory = i;
          }
        }
        console.log('maxCategory is ', maxCategory )
        let usersPopularCategory = categoryArray[maxCategory][1]
        state.users_top_category = usersPopularCategory
        console.log('my highest category is  ' , usersPopularCategory)
  
        let top_ten_users = []

        let search_users = db.collection('most_popular_artist').doc(usersPopularCategory)
        .get()
        .then(function (querySnapshot) {
          // querySnapshot.forEach(function (doc) {
          //   console.log('search users', doc.data())
          //   // ordered_top_12_list.push(doc.data())
          // })
         
          let catobj = querySnapshot.data()
          for(let key in catobj){
            console.log('grabbed users top ten recommended artists ' , key)
            let category_object = catobj[key]
            top_ten_users.push({count: category_object.count, value: category_object.userID, full_data: category_object.userData})
          }

          console.log('full data is ' , top_ten_users[0].full_data)

          commit('set_top_ten_category' , top_ten_users)
        })
        .catch(function (error) {
          console.log('Error getting search users: ', error)
        })

      })
    },
    delete_art_piece ({ commit, dispatch }, payload) {
      console.log("Entered delete art piece")
      // Got the url so we can find the art piece to delete
      console.log(payload)
      let db = firebase.firestore()
      let art = db.collection("art").where("url", "==", payload.url)
        .get()
        .then(function (results) {
          results.forEach(function (doc) {
            console.log(doc.id)
            db.collection("art").doc(doc.id).update({
              delete: true
            }).then(res => {
              dispatch('fetchArts')
            })
          })
        })
      // .where("url", "==", "https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/QBRXqktYi0QigFboM92crKAONKn1%2Fburnupchart1.jpg?alt=media&token=ed28f585-9f0c-48de-84f0-2851aed5a798")
      // .get()
      // .then(function (results) {
      //   console.log(results.data().art_title)
      // })
      // .catch(function (error) {
      //   console.log('error getting documents yas: ', error)
      // })

    },

    delete_from_review_requests({commit,dispatch}, payload){
      let db= firebase.firestore()
      let art = db.collection('review_requests').where('art.url' , '==' , payload.url)
      .get()
      .then(function (results){
        results.forEach(function(doc){
          console.log(doc.id)
          console.log('going to update art in review requests')
          db.collection('review_requests').doc(doc.id).update({
            art: {
              art_title: payload.art_title,
              artist_id: payload.artist_id, 
              artist_name: payload.artist_name,
              categories: payload.categories,
              description: payload.description,
              upload_date: payload.upload_date,
              url: payload.url,
              delete: true
            }
          })
        })
      })
    },


    add_delete_field_to_art() {
      console.log('Entered add_delete_field_to_art')
      // Get all artists from Firebase
      let db = firebase.firestore()
      let art_piece = db.collection('art')
        .get()
        .then(function (results) {
          results.forEach(function (doc) {
            let user = doc.id
            console.log("doc data is now ", doc.data())
          })
        })
        .catch(function (error) {
          console.log('error getting documents yas: ', error)
        })
    },
    verify_free_credits_field() {
      // Get all artists from Firebase
      let db = firebase.firestore()
      let artists = db.collection('users').where('role', '==', 'artist')
        .get()
        .then(function (results) {
          results.forEach(function (doc) {
            if (doc.data().free_credits === undefined) {
              let userId = doc.data().userId
              db.collection('users').doc(userId).update({
                'free_credits': '2'
              })
                .then(function () {
                  console.log('Document Succesfully updated!')
                })
            }
          })
        })
        .catch(function (error) {
          console.log('error getting documents yas: ', error)
        })
    },
    update_art_comments({ commit }, payload) {
      console.log('update_art: ', payload)
      let db = firebase.firestore()
      let id_of_art = db.collection('art').where('upload_date', '==', payload.upload_date)
      // find the right business userId so we can edit the right collection
      id_of_art.get().then(function (results) {
        if (results.empty) {
          console.log('No documents found! in query')
        } else {
          // go through all results
          results.forEach(function (doc) {
            let docId = doc.id
            console.log('action doc id ', docId)
            let artRef = db.collection('art').doc(docId)
            artRef.update({
              comments: payload.comments
            })
          })
        }
      })
    },
    // yiwayana
    push_updated_business_info_to_firebase({ commit }, payload) {
      let db = firebase.firestore()
      let userId = ''
      let userid_of_business = db.collection('users').where('email', '==', payload.email)
      // find the right business userId so we can edit the right collection
      userid_of_business.get().then(function (results) {
        if (results.empty) {
          console.log('No documents found! in query')
        } else {
          // go through all results
          results.forEach(function (doc) {
            userId = doc.data().userId
            let businessRef = db.collection('users').doc(userId)
            businessRef.update({
              about: payload.about,
              additional_notes: payload.additional_notes,
              business_name: payload.business_name,
              facebook_url: payload.facebook_url,
              instagram_url: payload.instagram_url,
              publication: payload.publication,
              the_good: payload.the_good,
              tumblr_url: payload.tumblr_url,
              upload_date: payload.upload_date
            })
          })
        }
      })
    },
    // for report
    fetch_top_12_recent_art({ commit, getters }) {
      // commit('clear_top_12_recent_art')
      let db = firebase.firestore()
      let counter = 0
      let temp_report = db.collection('review_requests')
        .orderBy('submitted_on', 'desc')
      let ordered_top_12_list = [];
      let report = temp_report.get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {

            if(counter == 12 ) {
            }else{
              console.log('fetching art  ' , doc.data().art)
              if(doc.data().art.delete == undefined){
                ordered_top_12_list.push(doc.data())
                counter++
              }else if (doc.data().art.delete == true){
  
              }else{
                ordered_top_12_list.push(doc.data())
                counter++
              }
            }
          })
          let i;
          console.log('what is our current top 12 artists filtered by delte ' , ordered_top_12_list )
          for (i = 0; i < ordered_top_12_list.length; i++) {
            commit('set_top_12_recent_art', ordered_top_12_list[i])
          }

        })
        .catch(function (error) {
          console.log('Error getting report: ', error)
        })
    },
    get_replied({ commit, getters }) {
      let db = firebase.firestore()
      var temp_report = db.collection('review_requests')
        .where('replied', '==', true)
        .where('businessId.userId', '==', getters.user.id)
      let report = temp_report
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var month = getters.report_month
            const today = Date.now()
            const timeDiff = today - (1000 * 60 * 60 * 24 * 30 * month)
            if (doc.data().submitted_on >= timeDiff) {
              if (doc.data().submitted_on <= today) {
                commit('set_replied_for_report', doc.data())
              }
            }
          })
        })
        .catch(function (error) {
          console.log('Error getting report: ', error)
        })
    },

    // yiwayana
    query_info_of_business_for_dashboard2({ commit, state }, payload) {
      let db = firebase.firestore()
      let query = db.collection('users')
        .where('email', '==', payload)
      query.get().then(function (results) {
        if (results.empty) {
          ('no documents found')
        } else {
          results.forEach(function (doc) {
            commit('set_info_of_business_for_dashboard2', doc.data())
          })
        }
      })
    },

    // yiwayana
    report_datePicker({ commit, state }) {
      commit('clear_replied_for_report_datePicker')
      let db = firebase.firestore()
      let temp_report = db.collection('review_requests')
      let start_Date = state.datePicker.startDate
      let end_Date = state.datePicker.endDate
      let business_query_email = state.query_business_email
      let query = temp_report
        .where('businessId.business_email', '==', business_query_email)
        .where('replied_date', '>=', start_Date)
        .where('replied_date', '<=', end_Date)
      query.get().then(function (results) {
        if (results.empty) {
          console.log('No documents found!')
        } else {
          // go through all results
          results.forEach(function (doc) {
            commit('set_replied_requests_for_report_datePicker', doc.data())
          })
        }
      })
    },

    get_replied({ commit, getters }) {
      let db = firebase.firestore()
      var temp_report = db
        .collection('review_requests')
        // .orderBy('submitted_on')
        .where('replied', '==', true)
        .where('businessId.userId', '==', getters.user.id)
      console.log('temp report', temp_report)
      let report = temp_report
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var month = getters.report_month
            const today = Date.now()
            const timeDiff = today - 1000 * 60 * 60 * 24 * 30 * month
            if (doc.data().submitted_on >= timeDiff) {
              if (doc.data().submitted_on <= today) {
                commit('set_replied_for_report', doc.data())
              }
            }
            commit('setUserRole', doc.data().role)
            commit('signed_in_user', doc.data())

            console.log('user: ' + doc.data())
            router.push({
              name: 'artist_dashboard'
            })
          })
        })
        .catch(function (error) {
          console.log('Error getting report: ', error)
        })
    },
    get_artist_settings_artist({ commit, getters }, email) {
      let db = firebase.firestore()
      let users = db.collection('users')
      let query = users
        .where('role', '==', 'artist')
        .where('email', '==', email)
      query
        .get()
        .then(function (user) {
          // go through all results
          let userObj
          user.forEach(item => {
            userObj = item.data()
          })
          // commit('set_artist_settings_artist', userObj)
          console.log('Document data:', userObj)
          localStorage.setItem('artist_settings_artist', JSON.stringify(userObj))
        }).then(function () {
          router.push('artist_settings')
        })

        .catch(function (error) {
          console.log('Error getting documents:', error)
        })
    },
    distributeCredits({ commit, getters }, numCredits) {
      let db = firebase.firestore()
      db.collection('users').get().then(function (users) {
        users.forEach(function (doc) {
          let currentCredits
          if (doc.data().free_credits !== undefined) {
            currentCredits = doc.data().free_credits
          } else {
            currentCredits = 0
          }
          console.log(currentCredits)
          // console.log(doc.data().userId)
          const userRef = db.collection('users').doc(doc.data().userId)
          return userRef.update({
            free_credits: numCredits
          })
        })
      })
        .then(function () {
          console.log('Artist credits successfully updated!')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    },
    updateArtistSettings({ commit, getters }, artist) {
      let db = firebase.firestore()
      db.collection('users').doc(artist.userId).update({
        name: artist.name,
        email: artist.email,
        free_credits: artist.free_credits || 0,
        credits: artist.credits || 0,
        role: artist.role,
        instagram: artist.instagram || 'none',
        photoUrl: artist.photoUrl || 'none'
      }).then(function () {
        console.log('Document successfully updated!')
        localStorage.setItem('artist_settings_artist', JSON.stringify(artist))
      })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    },
    get_monthly_report_submissions({
      commit,
      getters
    }, yearMonth) {
      console.log('year month: ' + yearMonth)
      let firstOfMonthArray = yearMonth.split('-')
      console.log(firstOfMonthArray)
      let firstOfMonth = new Date(parseInt(firstOfMonthArray[0]), (parseInt(firstOfMonthArray[1]) - 1) % 12, 1)

      let lastOfMonth = new Date(parseInt(firstOfMonthArray[0]), parseInt(firstOfMonthArray[1]) % 12, 1)
      console.log('first of month: ' + firstOfMonth)
      console.log('last of month: ' + lastOfMonth)
      firstOfMonth = firstOfMonth.valueOf()
      lastOfMonth = lastOfMonth.valueOf()
      console.log('first of month: ' + firstOfMonth)
      console.log('last of month: ' + lastOfMonth)
      let db = firebase.firestore()
      let tempReport = db.collection('review_requests')
      let query = tempReport
        .where('submitted_on', '>', firstOfMonth)
        .where('submitted_on', '<', lastOfMonth)
      query
        .get()
        .then(function (results) {
          // go through all results
          let submissions = []
          results.forEach(function (doc) {
            submissions.push(doc.data())
          })
          commit('set_monthly_report_submissions', submissions)
          // set_replied_requests_for_report
          // or if you only want the first result you can also do something like this:
          console.log('Document data:', submissions)
        })

        .catch(function (error) {
          console.log('Error getting documents:', error)
        })
    },
    get_month_to_month_epoch_times({ state, commit }) {
      console.log('in month to month')
      let today = Date.now()
      let date = new Date(today)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let firstDayOfMonth =
        year + '-' + month + '-' + '01' + '-' + '00' + '-' + '00' + '-' + '00'
      let splitFirstDayOfMonth = firstDayOfMonth.split('-')
      let epochFirstDayOfMonth = new Date(
        splitFirstDayOfMonth[0],
        splitFirstDayOfMonth[1] - 1,
        splitFirstDayOfMonth[2],
        splitFirstDayOfMonth[3],
        splitFirstDayOfMonth[4],
        splitFirstDayOfMonth[5]
      ).valueOf()
      let previousYear =
        year -
        1 +
        '-' +
        month +
        '-' +
        '01' +
        '-' +
        '00' +
        '-' +
        '00' +
        '-' +
        '00'
      let splitPreviousYear = previousYear.split('-')
      let epochPreviousYear = new Date(
        splitPreviousYear[0],
        splitPreviousYear[1] - 1,
        splitPreviousYear[2],
        splitPreviousYear[3],
        splitPreviousYear[4],
        splitPreviousYear[5]
      ).valueOf()
      console.log('epochPreviousYear: ' + epochPreviousYear)
      let epochFirstDayOfMonthArray = []
      let monthCount = 0
      console.log('epochFirstDayOfMonth: ' + epochFirstDayOfMonth)
      epochFirstDayOfMonthArray.push(epochPreviousYear)
      while (monthCount < 12) {
        let oneMonth = 86400000 * 30.5
        epochPreviousYear = epochPreviousYear + oneMonth
        epochFirstDayOfMonthArray.push(epochPreviousYear)
        monthCount++
      }

      commit('set_epoch_month_times', epochFirstDayOfMonthArray)
    },

    // Aortiz and Yiwayana
    // Create an array of size 12, fill each index with submissions for that month
    filter_submissions_by_month({ commit, state, dispatch }, payload) {
      dispatch('get_month_to_month_epoch_times')
      var monthEpochTimes = state.epoch_month_time
      console.log('Inside filter submissions')
      var filterSubmissionsArray = payload.slice()
      console.log('Filter submissions is ', filterSubmissionsArray)
      // Create an array of 12 indices , where each index stores an integer representing # of submissions
      var numberOfSubmissionsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      var numberOfRepliedPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // aortizojyas
      var numberOfPaidPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // aortizojyas
      var numberOfFreePerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // aortizojyas

      var i
      for (i = 0; i < filterSubmissionsArray.length; i++) {
        var submissionDate = filterSubmissionsArray[i].submitted_on
        var replied = filterSubmissionsArray[i].replied // aortizojyas
        var freeCredit = filterSubmissionsArray[i].submitted_with_free_cerdit // aortizojyas
        if (submissionDate >= monthEpochTimes[0] && submissionDate < monthEpochTimes[1]) {
          // Nov-Dec
          numberOfSubmissionsPerMonth[0] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[0] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[0] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[0] += 1
          }
        } else if (submissionDate >= monthEpochTimes[1] && submissionDate < monthEpochTimes[2]) {
          // Dec - Jan
          numberOfSubmissionsPerMonth[1] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[1] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[1] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[1] += 1
          }
        } else if (submissionDate >= monthEpochTimes[2] && submissionDate < monthEpochTimes[3]) {
          // Jan - Feb
          numberOfSubmissionsPerMonth[2] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[2] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[2] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[2] += 1
          }
        } else if (submissionDate >= monthEpochTimes[3] && submissionDate < monthEpochTimes[4]) {
          // Feb-March
          numberOfSubmissionsPerMonth[3] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[3] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[3] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[3] += 1
          }
        } else if (submissionDate >= monthEpochTimes[4] && submissionDate < monthEpochTimes[5]) {
          // M-April
          numberOfSubmissionsPerMonth[4] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[4] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[4] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[4] += 1
          }
        } else if (submissionDate >= monthEpochTimes[5] && submissionDate < monthEpochTimes[6]) {
          // Apr- May
          numberOfSubmissionsPerMonth[5] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[5] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[5] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[5] += 1
          }
        } else if (submissionDate >= monthEpochTimes[6] && submissionDate < monthEpochTimes[7]) {
          // May -Jun
          numberOfSubmissionsPerMonth[6] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[6] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[6] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[6] += 1
          }
        } else if (submissionDate >= monthEpochTimes[7] && submissionDate < monthEpochTimes[8]) {
          // Jun-July
          numberOfSubmissionsPerMonth[7] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[7] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[7] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[7] += 1
          }
        } else if (submissionDate >= monthEpochTimes[8] && submissionDate < monthEpochTimes[9]) {
          // July-Aug
          numberOfSubmissionsPerMonth[8] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[8] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[8] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[8] += 1
          }
        } else if (submissionDate >= monthEpochTimes[9] && submissionDate < monthEpochTimes[10]) {
          // Aug-Sep
          numberOfSubmissionsPerMonth[9] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[9] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[9] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[9] += 1
          }
        } else if (submissionDate >= monthEpochTimes[10] && submissionDate < monthEpochTimes[11]) {
          // Sep-Oct
          numberOfSubmissionsPerMonth[10] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[10] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[10] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[10] += 1
          }
        } else if (submissionDate >= monthEpochTimes[11] && submissionDate < monthEpochTimes[11] + (86400000 * 30.5)) {
          // Oct-Nov
          numberOfSubmissionsPerMonth[11] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[11] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[11] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[11] += 1
          }
        } else {
          // Nov-Dec
          numberOfSubmissionsPerMonth[12] += 1
          // aortizojyas
          if (replied === true) {
            numberOfRepliedPerMonth[12] += 1
          }
          if (freeCredit === true) {
            numberOfFreePerMonth[12] += 1
          }
          if (freeCredit === false) {
            numberOfPaidPerMonth[12] += 1
          }
        }
      }

      var monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      var startMonth = new Date(monthEpochTimes[0]).getMonth()
      var monthIterate
      // Create an array of months starting from last year to this month.
      var rightMonthArray = []
      for (monthIterate = 0; monthIterate < 13; monthIterate++) {
        if (startMonth >= 12) startMonth = 0
        rightMonthArray.push(monthsArray[startMonth])
        startMonth++
      }
      var finalArray = []
      var finalRepliedArray = []
      var finalPaidArray = []
      var finalFreeArray = []
      var fillChartArrayIndex
      for (fillChartArrayIndex = 0; fillChartArrayIndex <= 13; fillChartArrayIndex++) {
        if (fillChartArrayIndex === 0) {
          finalArray[fillChartArrayIndex] = ['Month', 'Submissions']
          finalRepliedArray[fillChartArrayIndex] = ['Month', 'Replied']
          finalPaidArray[fillChartArrayIndex] = ['Month', 'Paid']
          finalFreeArray[fillChartArrayIndex] = ['Month', 'Free']
        } else {
          finalArray[fillChartArrayIndex] = [rightMonthArray[fillChartArrayIndex - 1], numberOfSubmissionsPerMonth[fillChartArrayIndex - 1]]
          finalRepliedArray[fillChartArrayIndex] = [rightMonthArray[fillChartArrayIndex - 1], numberOfRepliedPerMonth[fillChartArrayIndex - 1]]
          finalPaidArray[fillChartArrayIndex] = [rightMonthArray[fillChartArrayIndex - 1], numberOfPaidPerMonth[fillChartArrayIndex - 1]]
          finalFreeArray[fillChartArrayIndex] = [rightMonthArray[fillChartArrayIndex - 1], numberOfFreePerMonth[fillChartArrayIndex - 1]]
        }
      }
      commit('set_chart_array_for_submissions', finalArray)
      commit('set_chart_replied_for_submissions', finalRepliedArray)
      commit('set_chart_free_for_submissions', finalFreeArray)
      commit('set_chart_paid_for_submissions', finalPaidArray)
    },

    // the foll function us used bt dashboard page to get the replied submissions for businesses. this function is temporary and will be updated
    get_submissions_for_year({ commit, getters, dispatch }) {
      // aortizoj
      commit('clear_submissions_for_year_array')
      let today = Date.now()
      let date = new Date(today)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let currentDate =
        year +
        '-' +
        (month + 1) +
        '-' +
        '01' +
        '-' +
        '00' +
        '-' +
        '00' +
        '-' +
        '00'
      let splitCurrentDate = currentDate.split('-')
      let epochCurrentDate = new Date(
        splitCurrentDate[0],
        splitCurrentDate[1] - 1,
        splitCurrentDate[2],
        splitCurrentDate[3],
        splitCurrentDate[4],
        splitCurrentDate[5]
      ).valueOf()
      let previousYear =
        year -
        1 +
        '-' +
        month +
        '-' +
        '01' +
        '-' +
        '00' +
        '-' +
        '00' +
        '-' +
        '00'
      let splitPreviousYear = previousYear.split('-')
      let epochPreviousYear = new Date(
        splitPreviousYear[0],
        splitPreviousYear[1] - 1,
        splitPreviousYear[2],
        splitPreviousYear[3],
        splitPreviousYear[4],
        splitPreviousYear[5]
      ).valueOf()
      let db = firebase.firestore()
      let tempReport = db.collection('review_requests')
      let query = tempReport
        .where('submitted_on', '<', epochCurrentDate)
        .where('submitted_on', '>', epochPreviousYear)
      query
        .get()
        .then(function (results) {
          if (results.empty) {
            console.log('No documents found!')
          } else {
            // go through all results
            results.forEach(function (doc) {
              commit('set_submissions_for_year', doc.data())
            })

            // Call the function to filter submissions by year
            dispatch('filter_submissions_by_month', getters.submissions_for_year)
            // set_replied_requests_for_report
            // or if you only want the first result you can also do something like this:
            console.log('Document data:', results.docs[0].data())
          }
        })
        .catch(function (error) {
          console.log('Error getting documents:', error)
        })
    },
    get_submissions_for_month({ commit, getters }) {
      // aortizoj
      commit('clear_submissions_for_month_array')
      let today = Date.now()
      let date = new Date(today)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let firstDayOfMonth =
        year + '-' + month + '-' + '01' + '-' + '00' + '-' + '00' + '-' + '00'
      let splitFirstDayOfMonth = firstDayOfMonth.split('-')
      let epochFirstDayOfMonth = new Date(
        splitFirstDayOfMonth[0],
        splitFirstDayOfMonth[1] - 1,
        splitFirstDayOfMonth[2],
        splitFirstDayOfMonth[3],
        splitFirstDayOfMonth[4],
        splitFirstDayOfMonth[5]
      ).valueOf()
      let lastDayOfMonth =
        year +
        '-' +
        (month + 1) +
        '-' +
        '01' +
        '-' +
        '00' +
        '-' +
        '00' +
        '-' +
        '00'
      let splitLastDayOfMonth = lastDayOfMonth.split('-')
      let epochLastDayOfMonth = new Date(
        splitLastDayOfMonth[0],
        splitLastDayOfMonth[1] - 1,
        splitLastDayOfMonth[2],
        splitLastDayOfMonth[3],
        splitLastDayOfMonth[4],
        splitLastDayOfMonth[5]
      ).valueOf()
      let db = firebase.firestore()
      let tempReport = db.collection('review_requests')
      let query = tempReport
        .where('submitted_on', '>', epochFirstDayOfMonth)
        .where('submitted_on', '<', epochLastDayOfMonth)
      query
        .get()
        .then(function (results) {
          if (results.empty) {
            console.log('No documents found!')
          } else {
            // go through all results
            results.forEach(function (doc) {
              commit('set_submissions_for_month', doc.data())
            })
            // set_replied_requests_for_report
            // or if you only want the first result you can also do something like this:
            console.log('Document data:', results.docs[0].data())
          }
        })
        .catch(function (error) {
          console.log('Error getting documents:', error)
        })
    },

    signUserInGoogle({ commit, getters }) {
      commit('setLoading', true)
      commit('clearError')
      let provider = new firebase.auth.GoogleAuthProvider()
      provider.setCustomParameters({
        'prompt': 'select_account'
      })
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(user => {
          localStorage.setItem('userId', 1000)

          localStorage.setItem('role', 'artist')
          commit('setLoading', false)
          const newUser = {
            upload_date: Date.now(),
            userId: firebase.auth().currentUser.uid,
            name: user.additionalUserInfo.profile.name,
            email: user.additionalUserInfo.profile.email,
            photoUrl: user.additionalUserInfo.profile.picture,
            role: 'artist',
            credits: 0
          }
          console.log(
            'newUserid: ' +
            newUser.userId +
            'name' +
            newUser.name +
            'email ' +
            user.additionalUserInfo.profile.email
          )
          console.log('current picture')
          commit('setUser', newUser)
          const db = firebase.firestore()
          var artistRef = db.collection('users').doc(newUser.userId)
          var getDoc = artistRef
            .get()
            .then(doc => {
              if (!doc.exists) {
                if (typeof newUser.photoUrl === 'string') {
                  commit('setUrl', newUser.photoUrl)
                } else {
                  commit('setUrl', newUser.photoUrl.data.url)
                }
                commit('signed_in_user', newUser)
                commit('setUserRole', 'artist')
                console.log('user doesnt exist')
                db.collection('users')
                  .doc(newUser.userId)
                  .set(newUser)
                  .then(function () {
                    router.push({
                      name: 'artist_dashboard'
                    })
                    console.log('Artist successfully written!')
                  })
              } else {
                console.log('user exists')
                let check = db
                  .collection('users')
                  .where('userId', '==', newUser.userId)
                  .get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      console.log('found a document')
                      if (typeof doc.data().photoUrl === 'string') {
                        console.log(
                          'doc.data().photoUrl' + doc.data().photoUrl
                        )
                        commit('setUrl', doc.data().photoUrl)
                      } else {
                        console.log('no photo url')
                      }
                      commit('setUserRole', doc.data().role)
                      commit('signed_in_user', doc.data())

                      console.log('user: ' + doc.data())
                      router.push({
                        name: 'artist_dashboard'
                      })
                    })
                  })
                  .catch(function (error) {
                    console.log('Error getting documents: ', error)
                  })
              }
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        })
    },
    signUserInFacebook({ commit }) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
          commit('setLoading', false)
          localStorage.setItem('userId', 1000)
          localStorage.setItem('role', 'artist')
          const newUser = {
            upload_date: Date.now(),
            userId: firebase.auth().currentUser.uid,
            name: user.additionalUserInfo.profile.name,
            email: user.additionalUserInfo.profile.email,
            photoUrl: user.additionalUserInfo.profile.picture,
            role: 'artist',
            credits: 0
          }
          console.log(
            'newUserid: ' +
            newUser.userId +
            'name' +
            newUser.name +
            'email ' +
            user.additionalUserInfo.profile.email
          )
          commit('setUser', newUser)
          // console.log('getters.user.id' + getters.user.id)
          const db = firebase.firestore()

          var artistRef = db.collection('users').doc(newUser.userId)
          var getDoc = artistRef
            .get()
            .then(doc => {
              if (!doc.exists) {
                console.log('user doesnt exist')
                if (typeof newUser.photoUrl === 'string') {
                  commit('setUrl', newUser.photoUrl)
                } else {
                  commit('setUrl', newUser.photoUrl.data.url)
                }
                commit('signed_in_user', newUser)
                commit('setUserRole', 'artist')
                router.push({
                  name: 'artist_dashboard'
                })
                db.collection('users')
                  .doc(newUser.userId)
                  .set(newUser)
                  .then(function () {
                    console.log('Artist successfully written!')
                  })
              } else {
                console.log('user exists')
                let check = db
                  .collection('users')
                  .where('userId', '==', newUser.userId)
                  .get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      console.log('found a document')
                      console.log('photoUrl ' + doc.data().photoUrl.data.url)
                      if (typeof doc.data().photoUrl === 'string') {
                        commit('setUrl', doc.data().photoUrl)
                      } else {
                        commit('setUrl', doc.data().photoUrl.data.url)
                      }
                      commit('setUserRole', doc.data().role)
                      commit('signed_in_user', doc.data())
                      router.push({
                        name: 'artist_dashboard'
                      })
                      console.table(doc.data())
                      console.log('user: ' + doc.data())
                    })
                  })
                  .catch(function (error) {
                    console.log('Error getting documents: ', error)
                  })
              }
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        })
    },
    update_review_read_byUser_status({ commit }, payload) {

      const db = firebase.firestore()
      const collectionRef = db
        .collection('review_requests')
        .where('art.upload_date', '==', payload)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var docRef = db.collection('review_requests').doc(doc.id)

            return docRef
              .update({
                read_byartist: true
              })
              .then(function () {
                console.log('read_by user field successfully updated!')
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating read by user field: ', error)
              })
          })
        })
    },
    delete_review({ commit }, payload) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('review_requests')
        .where('art.upload_date', '==', payload)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var docRef = db.collection('review_requests').doc(doc.id)

              return docRef
              .update({
                delete_byartist: true
              })
              .then(function () {
                console.log('read_by user field successfully updated!')
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating read by user field: ', error)
              })
          })
        })
    },
    update_user_credit({ getters }, payload) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
      console.log('updating user: ', firebase.auth().currentUser.uid)
      let credit_after_purchase = payload
      return collectionRef.update({
        credits: payload
      })
      console
        .log('credit amount: ', credit_after_purchase)
        .then(function () {
          console.log('Users credits successfully updated!')
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating updating user credit: ', error)
        })
    },
    update_user_free_credit({ getters }, payload) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
      console.log('updating user: ', firebase.auth().currentUser.uid)
      let free_credit_after_purchase = payload
      return collectionRef.update({
        free_credits: payload
      })
      console
        .log('credit amount: ', credit_after_purchase)
        .then(function () {
          console.log('Users credits successfully updated!')
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating updating user credit: ', error)
        })
    },
    update_user_subscription({ getters }, payload) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
      console.log('updating user: ', firebase.auth().currentUser.uid)
      return collectionRef
        .update({
          subscription: payload
        })
        .then(function () {
          console.log('Users subscription successfully updated!')
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating updating user subscription: ', error)
        })
    },
    get_user_credit({ commit }, payload) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('users')
        .doc(payload)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log('Credits:', doc.data().credits)
            commit('set_credits', doc.data().credits)
            commit('set_free_credits', doc.data().free_credits)
          } else {
            console.log('No such document!')
            router.push({
              name: 'group_business_dashboard'
            })
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error)
        })
    },

    // get admin business info
    get_admin_info({ commit,getters,dispatch }, payload)
    {
      const db = firebase.firestore()
      console.log("in get - admin - info and business email is " , getters.get_group_business_id) 
      const business_info = db.collection('users').where('email', '==' , getters.get_group_business_id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          commit('set_business_info' , doc.data());
        })
        console.log("finished get_admin_info")
        dispatch('get_business_members')
      })
    },

    // get business members
    get_business_members({ commit, getters })
    {
      // First get the info of members in the business group.
      let members = null;
      console.log("in get business members")
      console.log('admin id is ', getters.get_business_info.userId)
      console.log('current user id is ', getters.user.id)
      // payload default is 'shareyourselfartist'
      const db = firebase.firestore()
      const collectionRef = db
        .collection('business_groups')
        .doc(getters.get_business_info.userId)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            //console.log("doc does exist it is : " , doc.data())
            //console.log('user info id is ', this.getters.get_business_info.userId)
            
            members = doc.data().members
            commit('set_business_members' , members)
            console.log("members info: " , members)
            // return members
          } else {
            console.log('Doc does not exist')
          }
        })
        .catch(function (error) {
          console.log('Error getting business members document:', error)
        })
    },

    reset_password({ commit }, payload) {
      console.log(payload)
      let auth = firebase.auth()
      let emailAddress = payload
      auth
        .sendPasswordResetEmail(payload)
        .then(function () {
          // Email sent.
        })
        .catch(function (error) {
          // An error happened.
        })
    },
    get_users({ commit }) {
      commit('clearBusinesses')
      let db = firebase.firestore()
      let businesses = db
        .collection('users')
        .where('role', '==', 'business')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('setBusinesses', doc.data())
          })
        })
        .catch(function (error) {
          console.log('Error getting businesses: ', error)
        })
    },
    get_email_list_of_artists({ commit }) {
      console.log('inside  get_email_list_of_artists')
      commit('clear_artists_email_list')
      let db = firebase.firestore()
      let artists = db
        .collection('users')
        .where('role', '==', 'artist')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('set_artists_email_list', {
              artist_name: doc.data().name,
              artist_email: doc.data().email
            })
          })
        })
        .catch(function (error) {
          console.log('Error getting businesses: ', error)
        })
    },

    fetch_clicked_business({ commit, getters }) {
      let db = firebase.firestore()
      let role = db
        .collection('users')
        .where('userId', '==', getters.user.id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('setUserRole', doc.data().role)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    async fetchUserDocument({ commit, getters }) {
      console.log('getters.user.id' + getters.user.id)
      let db = firebase.firestore()
      let user = await db
        .collection('users')
        .where('userId', '==', getters.user.id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('setUserRole', doc.data().role)
            commit('signed_in_user', doc.data())
            commit('set_credits', doc.data().credits)
            commit('set_free_credits', doc.data().free_credits)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },

    fetchArts({ commit, getters }) {
      commit('setLoading', true)
      commit('clear_arts_array')
      let db = firebase.firestore()
      let arts = db
        .collection('art')
        .where('artist_id', '==', getters.user.id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('setArts', doc.data())
          })
          commit('setLoading', false)
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    fetchViewedArts({ commit, getters }, payload) {
      commit('clear_viewed_arts_array')
      console.log('payload ' + payload)
      let db = firebase.firestore()
      let arts = db
        .collection('art')
        .where('artist_id', '==', payload)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('set_viewed_arts', doc.data())
          })
          commit('setLoading', false)
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },

    // this function gets the submissions for a business and
    async fetchSubmissions({ commit, getters }) {
      commit('clear_submissions_for_this_business_array')
      const db = firebase.firestore()
      const collectionRef = await db
        .collection('review_requests')
        .where('businessId.userId', '==', getters.user.id)
        .where('replied', '==', false)
        .get()
        // .then(function (querySnapshot) {
        //   querySnapshot.forEach(function (doc) {
        //     // doc.data() is never undefined for query doc snapshots
        //     const promises = []
        //     let docData = doc.data()
        //     docData.docId = doc.id

        //     console.log('doc.data: ' + docData.docId)
        //     promises.push(doc.docData.docId)
        //     // commit('set_submissions_for_this_business', docData)
        //   })
        //   commit('set_submissions_for_this_business', promises)
        //   return Promise.all(promises)
        // })
        .then(function (querySnapshot) {
          const promises = []
          querySnapshot.forEach(function (doc) {
            console.log('docdoc: ', doc)
            promises.push(doc)
          })
          return Promise.all(promises) //returning promises sends the resolved results to 
        })                             //to the next .then()
        .then(function (data) {
          console.log(data)
          let results = []
          data.forEach(function (dataSnap) {
            console.log('data: ', dataSnap.data())
            results.push(dataSnap.data())
          })
          return results
        })
        .then(function (ids) {
          console.log("arrays length:" + ids.length)
          for (var i = 0; i < ids.length; i++) {
            // console.log('inside ids: ', ids[i])

            commit('set_submissions_for_this_business', ids[i])
          }
        })
        .then(function (reply) {

          // return response.send('Testing this with all submissions')
          console.log('end of fetchSubmissions function')
        })
        .catch(function (error) {
          console.log('Error with submissions: ', error)
        })
    },
    async fetch_all_Submissions({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        console.log("Entered fetch all submissions")
        commit('clear_submissions_for_this_business_array')
        const db = firebase.firestore()
        console.log("Do we get here? IF we do the  user id is :  ", (null == getters.user))
        console.log('payload is ' , payload)
  
        // start cloud
          let reviewRequests = {}
          //We want to access the business info state and extract the id.
          let business_id;
          if(payload){
             business_id  = getters.get_business_info.userId;
          }else{
            business_id  = getters.user.id
          }
      
          console.log("The business id is " , business_id)
          reviewRequests[0] = business_id;
    
          let reviewRequestsJSON = JSON.stringify(reviewRequests) 
          let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
          let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/getAllBusinessReviewRequests'
    
          console.log('In get all business review reqs about to call fetch')
          fetch(proxyUrl + targetUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: reviewRequestsJSON 
          })
          .then(function (response) {
            console.log('response is ', response)
            return response.json()
          })
          .then(function (myJson) {
            console.log('my json is ', myJson)
            let rev_req = [];
            for (var key in myJson) {
              if (myJson.hasOwnProperty(key)) {
                  console.log(key + " -> " + myJson[key]);
                  myJson[key].review_request = key;
                  rev_req.push(myJson[key]);
                  // myJson[key].push({review_request : key});
              }
          }
    
          for(var i = 0 ; i < rev_req.length; i++)
          commit('set_submissions_for_this_business', rev_req[i])
    
          })
          .then(function (response) {
            console.log("we should leave the function now nothing should happen before")
            resolve(response) 
          })
          .catch(function (error) {
            console.error('Error getting cloud: ', error)
            reject(error)
          })
    
          // console.log('leaving the cloud')
          
          // end cloud
      })

      /* previous version, still usable */
      // console.log("Entered fetch all submissions")
      // commit('clear_submissions_for_this_business_array')
      // const db = firebase.firestore()
      // console.log("Do we get here? IF we do the  user id is :  ", (null == getters.user))

      // const collectionRef = await db
      //   .collection('review_requests')
      //   //.where('businessId.userId', '==', getters.user.id)
      //   .where('businessId.userId', '==', getters.get_business_info.userId)
      //   .get()
      //   .then(function (querySnapshot) {
      //     querySnapshot.forEach(function (doc) {

      //       // doc.data() is never undefined for query doc snapshots
      //       let docData = doc.data()
      //       console.log('doc.data: ' + docData)
      //       console.log('doc.id: ' + doc.id)
      //       docData.docId = doc.id

      //       console.log('doc.data: ' + docData.docId)
      //       commit('set_submissions_for_this_business', docData)
      //     })
      //   })
      //   .catch(function (error) {
      //     console.log("Error of fetch all submissions")
      //     console.log('Error getting submissions: ', error)
      //   })

    },

    fetch_replied_submissions({ commit, getters }) {
      commit('clear_submissions_for_this_business_array')
      let db = firebase.firestore()
      let role = db
        .collection('review_requests')
        .where('replied', '==', true)
        .where('art.artist_id', '==', firebase.auth().currentUser.uid)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('set_replied_submissions', doc.data())
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },

    async reserve_selected_submissions({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        console.log("Entered reserve selected submissions")
        const db = firebase.firestore()
        //console.log('reserve payload is ' , payload)
  
        // reserveReview: https://us-central1-sya-app.cloudfunctions.net/reserveReview
        // input: userId (id of the business_member), businessId (id of the business the member is associated with),
        // reviewIds (an array of review_request document ids that the group member is attempting to reserve).
        // output: status code of 200 for success, 400 for failure or bad request

          let reserveIDs = {}
          //We want to access the business info state and extract the id.
          let business_id
          if(payload){
             business_id  = getters.get_business_info.userId
          }else{
            business_id  = getters.user.id
          }

          let user_id = getters.user.id
      
          console.log("The business id is " , business_id)
          console.log("The user id is " , user_id)
          reserveIDs[0] = user_id
          reserveIDs[1] = business_id
          reserveIDs[2] = payload
    
          let reserveIDsJSON = JSON.stringify(reserveIDs) 
          let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
          let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/reserveReview'
    
          console.log('In reserve submissions about to call fetch')
          fetch(proxyUrl + targetUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: reserveIDsJSON
          })
          .then(function (response) {
            console.log('response is ', response)
            // return response.json()
          })
          .then(function (myJson) {
            // console.log('my json is ', myJson)
            // // let rev_req = []
            // for (var key in myJson) {
            //   if (myJson.hasOwnProperty(key)) {
            //       console.log(key + " -> " + myJson[key])
            //       myJson[key].review_request = key
            //       // rev_req.push(myJson[key])
            //   }
            // }
    
          // for(var i = 0 ; i < rev_req.length; i++)
          // commit('set_submissions_for_this_business', rev_req[i])
    
          })
          .then(function (response) {
            console.log("we should leave the reserve selected function now nothing should happen before")
            resolve(response) 
          })
          .catch(function (error) {
            console.error('Error getting cloud: ', error)
            reject(error)
          })

      })

    },

    async get_reserved_reviews({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        console.log("Entered get reserved review")
        commit('clear_submissions_for_this_reserved_array')
        console.log('cleared reserved array submissions')
        const db = firebase.firestore()
        //console.log('get reserved payload is ' , payload)
        console.log('group members id is ' , payload)
  
        // getReservedReviews: https://us-central1-sya-app.cloudfunctions.net/getReservedReviews
        // input: a group members userID
        // response: JSON of all review_requests reserved by given business_member

          let reservedReviews = {}
          
          reservedReviews[0] = payload
    
          let reservedReviewsJSON = JSON.stringify(reservedReviews) 
          let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
          let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/getReservedReviews'
    
          console.log('In get reserved reviews about to call fetch')
          fetch(proxyUrl + targetUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: reservedReviewsJSON
          })
          .then(function (response) {
            console.log('response is ', response)
            return response.json()
          })
          .then(function (myJson) {
            console.log('my json is ', myJson)
            let revs = []
            for (var key in myJson) {
              if (myJson.hasOwnProperty(key)) {
                  console.log(key + " -> " + myJson[key])
                  myJson[key].review_request = key
                  revs.push(myJson[key])
              }
            }
            
          console.log('got reserved reviews: ', revs)

          for(let i = 0 ; i < revs.length; i++)
          {
            commit('set_reserved_submissions', revs[i])
          }
    
          })
          .then(function (response) {
            console.log("we should leave the get reserved function now nothing should happen before")
            resolve(response) 
          })
          .catch(function (error) {
            console.error('Error getting cloud: ', error)
            reject(error)
          })

      })

    },

    async get_responded_review_requests({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        console.log("Entered get responded")
        commit('clear_submissions_for_this_responded_array')
        console.log('cleared responded array submissions')
        const db = firebase.firestore()
        //console.log('get reserved payload is ' , payload)
        console.log('business id in payload is ' , payload)
  
        // getRespondedReviewRequests: https://us-central1-sya-app.cloudfunctions.net/getRespondedReviewRequests
        // input: id of the *business*
        // output: all review_requests of a given business that the business (or a member of the business) has responded to

          let respondedRequests = {}
          
          respondedRequests[0] = payload
    
          let respondedRequestsJSON = JSON.stringify(respondedRequests) 
          let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
          let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/getRespondedReviewRequests'
    
          console.log('In get responded about to call fetch')
          fetch(proxyUrl + targetUrl, {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: respondedRequestsJSON
          })
          .then(function (response) {
            console.log('response is ', response)
            return response.json()
          })
          .then(function (myJson) {
            console.log('my json is ', myJson)
            let reqs = []
            for (var key in myJson) {
              if (myJson.hasOwnProperty(key)) {
                  console.log(key + " -> " + myJson[key])
                  myJson[key].review_request = key
                  reqs.push(myJson[key])
              }
            }
            
          //console.log('got responded requests: ', reqs)

          for(let i = 0 ; i < reqs.length; i++)
          {
            commit('set_responded_submissions', reqs[i])
          }
    
          })
          .then(function (response) {
            console.log("we should leave the get responded function now nothing should happen before")
            resolve(response) 
          })
          .catch(function (error) {
            console.error('Error getting cloud: ', error)
            reject(error)
          })

      })

    },

    // Styled by Jin. No modification on code.
    uploadImage({ commit, getters }, payload) {

      return new Promise((resolve, reject) => {
        console.log("image-_being uploaded is ", getters.image_being_uploaded.file)
        //console.log("image url being uploaded: ", getters.image_being_uploaded.image_url)
        // first put the image in the storage
        // Create a root reference
        let ref = firebase.storage().ref()
        console.log('Error may begin here test by Yas')
        let uploadTask = ref
          .child(
            getters.user.id +
            getters.image_folder +
            getters.image_being_uploaded.file.name
          )
          .put(getters.image_being_uploaded.file)
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused')
                //here put spinner setter
                break
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running in uploadImage')
                break
            }
          },
          function (error) {
            // A full list of error codes is available at
            switch (error.code) {
              case 'storage/unauthorized':
                alert(error.code)
                // User doesn't have permission to access the object
                break

              case 'storage/canceled':
                alert(error.code)
                // User canceled the upload
                break
              case 'storage/unknown':
                alert(error.code)
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              commit('setUrl', downloadURL) // Jin: this led to profile url change.
              if (payload.operation === 'art_upload') {
                let art = {
                  art_title: payload.art_title,
                  artist_name: payload.artist_name,
                  categories: payload.categories,
                  url: getters.url,
                  description: payload.description,
                  upload_date: payload.upload_date,
                  delete: false,
                  artist_id: firebase.auth().currentUser.uid
                }

                
                let dataCategory = {}
                dataCategory[0] = art.categories
                dataCategory[1] = art.artist_id
                let categoryJson = JSON.stringify(dataCategory)

                const db = firebase.firestore()
                const collectionRef = db.collection('art')
                collectionRef
                  .add(art)
                  .then(function (docRef) {
                    commit('setArts', art)
                    console.log('art is: ')
                    console.log(art)
                    // If art is uploaded, set variable to true
                    commit('set_art_uploaded', true)
                  })
                  .then(function(){
                    //  Send API request to update user category
                    let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
                    let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/updateArtistCategoryCount'

                    if (!('fetch' in window)) {
                      return
                    } else {
                    }
                    
                    console.log('In upload image about to call fetch ')
                    fetch(proxyUrl + targetUrl, {
                      method: 'post',
                      headers: {
                        'Content-type': 'application/json'
                      },
                      body: categoryJson
                    })
                    console.log('leaving the .then fetch ')
                })
                  .then(function () {
                    console.log("resolving upload image here")
                    resolve()
                  })
                  .catch(function (error) {
                    // If art was not uploaded, set it to false
                    commit('set_art_uploaded', false)
                    reject(error)
                  })
              }
            })
          }
        )
        console.log("Near end of uploadImage")
        // Line commented out by Yas as this line gave the error: "uploadTask.on(...).put is not a function"
        // .put(getters.image_being_uploaded.file)
        // Listen for state changes, errors, and completion of the upload.

        let art = {
          art_title: payload.art_title,
          artist_name: payload.artist_name,
          url: getters.url,
          description: payload.description,
          upload_date: payload.upload_date,
          artist_id: getters.user.id
        }
      })

      // upload the artist data and the url
    },
    submit_submission_response({ getters, dispatch } , payload) {
      
      let businessDecision =  getters.submission_response.radios
      let artCategories = payload.categories
      let businessId =  this.getters.user.id
      let requestedArtist =  payload.art.art.artist_id

      
      let statistics = {}
      statistics[0] = artCategories
      statistics[1] = businessId
      statistics[2] = requestedArtist
      statistics[3] = businessDecision   // determines if business hit 'accept'(true) or 'decline'(false)
      console.log('statistics is ' , statistics)

      let statisticsJson = JSON.stringify(statistics)
      //  Send API request to update user category
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/updateAcceptedStats'

      if (!('fetch' in window)) {
        return
      } else {
      }
      
      fetch(proxyUrl + targetUrl, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: statisticsJson
      })





      //console.log('got to previous version')
      const db = firebase.firestore()
      console.log("Right before collectionRef line 2581");
      console.log("The info we're passing through is: ")
      console.log("We're passing into doc : ", getters.art_being_replied.docId);
      console.log("We're passing in for submission_response: " ,getters.submission_response);
      const collectionRef = db
        .collection('review_requests')
        .doc(getters.art_being_replied.docId)
        .update({
          replied: true,
          read_byartist: false,
          submission_response: getters.submission_response,
          replied_date: Date.now()
        })
        .then(function () {
          console.log("doc Id is : ", getters.art_being_replied.docId  );
          console.log("adminId is : ", getters.get_business_info.userId);
          console.log("responderId : ", getters.user.id );
          let responseInfo = {docId: getters.art_being_replied.docId , adminId: getters.get_business_info.userId , responderId: getters.user.id };
          dispatch('update_business_members_response', responseInfo)

        })
        .then(function() {
          console.log('Submission successfully updated!')
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating submission: ', error)
        })
    },
    update_business_members_response({commit,getters} , payload){
      console.log("in update_business_members and payload is " , payload)
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/replyToReviewRequest'
      let data = {}
      data[0] = payload.docId;
      data[1] = payload.adminId;
      data[2] = payload.responderId;
      let categoryJson = JSON.stringify(data)
      fetch(proxyUrl + targetUrl, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: categoryJson
      })         
    },
    update_art_category_tags({ getters }, payload) {
      const db = firebase.firestore()
      const uploadDate = parseInt(payload.upload_date, 10)
      const categories = payload.categories
      const collectionRef = db.collection('art').where('upload_date', '==', uploadDate)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var docRef = db.collection('art').doc(doc.id)
            return docRef.update(
              { 'categories': categories }
            )
          })
        })
        .then(function () {
          console.log('successfully updated categories')
        })
        .catch(function (error) {
          console.error('Error updating categories: ', error)
        })
    },

    submit_request({ getters }) {
      console.log("Entered submit requests with  credits");
      let businesses_being_submitted = getters.businesses_being_submitted
      for (let i = 0; i < businesses_being_submitted.length; i++) {
        let art_being_submitted = getters.art_being_submitted
        art_being_submitted.submitted_on = Date.now()
        art_being_submitted.submitted_with_free_cerdit = false
        art_being_submitted.businessId = businesses_being_submitted[i]
        art_being_submitted.businessAdmin = businesses_being_submitted[i].userId //new businessAdmin field
        console.log("The business admin ID for credits is : " , art_being_submitted.businessAdmin );
        art_being_submitted.replied = false
        art_being_submitted.delete_byartist = false
        art_being_submitted.refunded = 0;
        art_being_submitted.reserved_by = ""
        art_being_submitted.businessAdmin = businesses_being_submitted[i].userId
        
        const db = firebase.firestore()
        const collectionRef = db
          .collection('review_requests')
          .doc()
          .set(art_being_submitted)
          .then(function (docRef) {
            router.push({
              name: 'artist_dashboard' 
            })
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      }
    },
    submit_request_with_free_credits({ getters }) {
      console.log("Entered submit requests with free credits");
      let businesses_being_submitted = getters.businesses_being_submitted
      for (let i = 0; i < businesses_being_submitted.length; i++) {
        let art_being_submitted = getters.art_being_submitted
        art_being_submitted.submitted_on = Date.now()
        art_being_submitted.submitted_with_free_cerdit = true
        art_being_submitted.refunded = 0;
        //this next field will be used to track replies and refunds
        art_being_submitted.replied = false
        art_being_submitted.delete_byartist = false
        art_being_submitted.businessId = businesses_being_submitted[i]
        art_being_submitted.businessAdmin = businesses_being_submitted[i].userId //new businessAdmin field
        console.log("The business admin ID for free credits is : " , art_being_submitted.businessAdmin );
        art_being_submitted.reserved_by = ""

        const db = firebase.firestore()
        const collectionRef = db
          .collection('review_requests')
          .doc()
          .set(art_being_submitted)
          .then(function (docRef) {
            // console.log('Submission written with ID: ', docRef.id)
            router.push({
              name: 'artist_dashboard' 
            })
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      }
    },

    /*
    Sign up/Sign in flow
    Create record of business with upload avatar url in Firestore
    */
    create_a_new_business({ commit, getters, dispatch }, payload) {
      console.log('Inside cretae a new business')
      // first put the image in the storage
      // Create a root reference
      let ref = firebase.storage().ref()
      let uploadTask = ref
        .child(
          getters.user.id + '/logo/' + getters.image_being_uploaded.file.name
        )
        .put(getters.image_being_uploaded.file)
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused')
              break
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running')
              break
          }
        },
        function (error) {
          // A full list of error codes is available at
          switch (error.code) {
            case 'storage/unauthorized':
              alert(error.code)
              // User doesn't have permission to access the object
              break

            case 'storage/canceled':
              alert(error.code)
              // User canceled the upload
              break
            case 'storage/unknown':
              alert(error.code)
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        },
        function () {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('Url captured' + downloadURL)
            commit('setUrl', downloadURL)
            console.log('State url' + getters.url)
            let user = {
              business_name: getters.business_signing_up.business_name,
              email: getters.business_signing_up.email,
              role: payload.role,
              publication: payload.publication,
              facebook_url: payload.facebook,
              instagram_url: payload.instagram,
              tumblr_url: payload.tumblr,
              userId: getters.user.id,
              about: payload.about,
              worth_knowing: payload.worth_knowing,
              additional_notes: payload.additional_notes,
              upload_date: payload.upload_date,
              the_good: payload.the_good,
              url: getters.url
              // categories: {
              //   drawing : {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   painting : {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   sculpting:{
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   design:{
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   threeD : {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   multimedia : {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   blackandwhite :{
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   psychedelic:{
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   portrait:{
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   realism: {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   },
              //   abstract: {
              //     totalReceived : 0,
              //     numOfResponses : 0
              //   }  
              // }
            }
            console.log('printing user in th ecreate a business: ', user)
            const db = firebase.firestore()
            db.collection('users')
              .doc(getters.user.id)
              .set(user)
              .then(function () {
                console.log('Document successfully written!')
                router.push({
                  name: 'sign_in'

                })
                // location.reload()
                dispatch('signUserOut')
              })

              .catch(function (error) {
                console.error('Error writing document: ', error)
              })
          })
        }
      )
    },

    /*
    Sign up/Sign in flow
    Create an artist record in Firestore
    */
    create_a_new_artist({ commit, getters }, payload) {
      localStorage.setItem('userId', 1000)
      localStorage.setItem('role', payload.role)

      router.push({
        name: 'artist_dashboard'
      })
      let user = {
        instagram: payload.instagram,
        role: payload.role,
        free_credits: 2,
        name: payload.name,
        email: payload.email,
        upload_date: payload.upload_date,
        userId: getters.user.id,
        credits: 0,
        categories: {
          drawing : {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          painting : {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          sculpting:{
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          design:{
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          threeD : {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          multimedia : {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          blackandwhite :{
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          psychedelic:{
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          portrait:{
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          realism: {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          },
          abstract: {
            count : 0,
            responded : 0,
            totalSubmitted : 0
          }
        }
      }
      const db = firebase.firestore()

      db.collection('users')
        .doc(getters.user.id)
        .set(user)
        .then(function () {
          console.log('Artist successfully written!')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })

      const collectionRef = db
        .collection('users')
        .doc(getters.user.id)
        .collection('submissions')
      collectionRef
        .add({
          initial_submission: true
        })
        .then(function (docRef) {
          console.log('Submission: ', docRef.id)
        })
        .catch(function (error) {
          alert('Error adding submission: ', error)
        })
    },

    uploadAvatar({ commit, getters }, payload) {
      firebase
        .storage()
        .ref(
          getters.signed_in_user_id +
          '/logo/' +
          getters.image_being_uploaded.file.name
        )
        .put(getters.image_being_uploaded.file)
    },
    async singBusinessUp({ commit }, payload) {
      try {
        let response = await firebase
          .auth()
          .createUserAndRetrieveDataWithEmailAndPassword(
            payload.email,
            payload.password
          )

        let ref = await firebase.storage().ref()
        let uploadTask = ref
          .child(response.user.uid + '/logo/' + payload.file_name)
          .put(payload.file)
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused')
                break
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running')
                break
            }
          },
          function (error) {
            // A full list of error codes is available at
            switch (error.code) {
              case 'storage/unauthorized':
                alert(error.code)
                // User doesn't have permission to access the object
                break

              case 'storage/canceled':
                alert(error.code)
                // User canceled the upload
                break
              case 'storage/unknown':
                alert(error.code)
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log('Url captured' + downloadURL)
              payload.url = downloadURL
              payload.userId = response.user.uid
              payload.file = ''
              const db = firebase.firestore()
              db.collection('users')
                .doc(payload.userId)
                .set(payload)
                .then(function () {
                  firebase
                    .auth()
                    .signOut()
                    .then(user => {
                      console.log('Document successfully written!')
                      router.push({
                        name: 'sign_in'
                      })
                    })
                })
            })
          }
        )
        console.log('response: ', response.user.uid)
        console.log('payload: ', payload)
      } catch (e) {
        console.log('Error!', e)
      }

      // we have created a auth account and upladed the logo now we will
      // create auser document
    },
    signBusinessMemberUp({ commit } , payload){
      
      //Grab the user name, email, password, and access code
      let name = payload.name;
      let email = payload.email;
      let password = payload.password;
      let accessCode = payload.accessCode;
      let business = '';


      let dataCategory = {}

      dataCategory[0] = name;
      dataCategory[1] = email;
      dataCategory[2] = password;
      dataCategory[3] = accessCode;
    

      let db = firebase.firestore()
      let user = db
        .collection('business_groups')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if(doc.data().accessCode != undefined){
              if(doc.data().accessCode == accessCode){
                console.log("in query function")
                console.log("checking each access Code : " , doc.data().accessCode)
                console.log("business should be " , doc.id)
                dataCategory[4] = doc.id
                commit('set_group_business_id', doc.data().email)
                let categoryJson = JSON.stringify(dataCategory)
                let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
                let targetUrl = 'https://us-central1-sya-app.cloudfunctions.net/signUpGroupMember'
          
                fetch(proxyUrl + targetUrl, {
                  method: 'post',
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: categoryJson
                }).then(function (doc) {
                  router.push({
                    name: 'group_business_dashboard'
                  })
                })          
              }
            }
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })

    },
    /*
    Sign up/Sign in flow
    Register user with Firebase Authentication
    */
    signUserUp({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .createUserAndRetrieveDataWithEmailAndPassword(
          payload.email,
          payload.password
        )
        .then(user => {
          commit('setLoading', false)
          const newUser = {
            id: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email, // change this
            user_role: payload.user_role
          }
          // displayName updated to firebase
          commit('setUser', newUser)
          console.log('Payload in signuserUp: ', payload)
          commit('setUserRole', payload.user_role)
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(function () {
              // Email sent.
            })
            .catch(function (error) {
              alert('error')
            })
          console.log(firebase.auth().currentUser.uid)
          commit('signed_in_user_id', firebase.auth().currentUser.uid)
        })
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
          alert(error.message)
        })
      if (payload.user_role != 'artist') {
        firebase
          .auth()
          .signOut()
          .then(user => {
            commit('setLoading', true)
            commit('setUser', null)
            commit('sign_out_signed_in_user')
            commit('setLoading', false)
            commit('setUserRole', null)
            //  router.push({
            //     name: 'sign_in'
            //    })
          })
      }
    },
    image_being_uploaded({ commit }, payload) {
      commit('image_being_uploaded', payload)
    },
    logo_url({ commit }, payload) {
      commit('set_logo_url', payload)
    },

    clearError({ commit }) {
      commit('clearError')
    },

    /*
    Sign up/Sign in flow
    Sign user in and load information from Firestore
    */
    signUserIn({ commit, dispatch, getters }, payload) {
      commit('signUserOut', commit)
      commit('setLoading', true)
      commit('clearError')
      const promise = firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return firebase
            .auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then(
              user => {
                if (user.emailVerified === false) {
                  firebase.auth().signOut()
                  alert('Please confirm your email account.')
                  router.push({
                    name: 'Home'
                  })
                } else {
                  console.log('User that we are currently checking is :  ', firebase.auth().currentUser)
                  
                  const newUser = {
                    id: firebase.auth().currentUser.uid,
                    name: firebase.auth().currentUser.displayName,
                    email: firebase.auth().currentUser.email,
                    // TODO: I need to call the existing arts for this user and push in to this array
                    arts: []
                  }
                  //console.log('User role: ', firebase.auth().currentUser.user_role)
                  //console.log('display name: ', firebase.auth().currentUser.displayName)
                  commit('setUser', newUser)

                  localStorage.setItem('userId', 1000)
                  let db = firebase.firestore()
                  let user = db
                    .collection('users')
                    .where('userId', '==', firebase.auth().currentUser.uid)
                    .get()
                    .then(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        if (doc.data().color == null) {
                          var docRef = db.collection('users').doc(doc.id)
                          commit('setUserRandColor')
                          docRef.set(
                            {
                              color: getters.color
                            },
                            {
                              merge: true
                            }
                          )
                        } else {
                          commit('setUserColor', {
                            color: doc.data().color
                          })
                        }
                        commit('setUserRole', doc.data().role)
                        commit('setUserRole', doc.data().role)
                        commit('setUrl', doc.data().url)
                        commit('signed_in_user', doc.data())
                        commit('set_free_credits', doc.data().free_credits)

                        if(doc.data().business_group != undefined){
                          //Query by business email not group id.
                          let dataBase = firebase.firestore()
                          let businessEmail = dataBase.collection('business_groups').doc(doc.data().business_group).get()
                          .then(function (results) {
                            console.log('we are in business Email ' , results.data().email)
                            commit('set_group_business_id', results.data().email)
                            if (doc.data().role == 'business_member') {
                              console.log("about to change to group business dashboard")
                              router.push({
                                name: 'group_business_dashboard'
                              })
                            }
                          })
                        }

                        // check current user's role to see if they're allowed to enter
                        console.log('current role at this instance: ' + doc.data().role)
                        localStorage.setItem('role', doc.data().role)

                        if (doc.data().role == 'artist') {
                          router.push({
                            name: 'artist_dashboard'
                          })
                        }
                        else if (doc.data().role == 'business') {
                          commit('setUrl', doc.data().url)
                          router.push({
                            name: 'business_dashboard'
                          })
                        }
                      })
                    })
                    .catch(function (error) {
                      console.log('Error getting documents: ', error)
                    })
                  console.log('getters.user_role:' + getters.user_role)
                  console.log('getters.user_rid:' + getters.user.id)

                  setTimeout(function () {
                    commit('setLoading', false)
                  }, 10000)
                }
              },
              function (err) {
                firebase.auth().fetchProvidersForEmail(payload.email).then(function (result) {
                  // … show OAuthProvider Login Button
                  if (result == 'google.com') {
                    dispatch('signUserInGoogle')
                  } else if (result == 'facebook.com') {
                    dispatch('signUserInFacebook')
                  } else {
                    alert(
                      err.message +
                      'Or you may have not confirmed your email yet. If you need further assistance, please send us an email.'
                    )
                  }
                })
              }
            )
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          alert(error.message)
        })
    },

    /*
    Sign up/Sign in flow
    Sign user out. Set every parameter to null
    */
    signUserOut({ commit }) {
      commit('clearError')
      localStorage.setItem('userId', null)
      firebase
        .auth()
        .signOut()
        .then(user => {
          commit('setLoading', true)
          commit('setUser', null)
          commit('sign_out_signed_in_user')
          commit('setLoading', false)
          commit('setUserRole', null)
        })
        .catch(error => {
          commit('setLoading', true)
          commit('setError', error)
          commit('setLoading', false)
          console.log(error.message)
        })
    },

    autoSignIn({ commit }, payload) {
      commit('setUser', {
        id: payload.uid
      })
    },
    clearError({ commit }) {
      commit(clearError)
    },
    // should change this function!
    async sendMessageToFirebase({ commit, getters }, payload) {

      commit('set_send_chat_data', payload)
      var message = getters.sendChatDataMessage
      var role = getters.user_role
      var url = payload.url
      var color = payload.color
      var user = {
        name: payload.user
      }
      var userId = payload.userId;
      var daystamp = getters.sendChatDataDaystamp
      var timestamp = getters.sendChatDataTimestamp

      var sendData = {
        user: user,
        message: message,
        daystamp: daystamp,
        timestamp: timestamp,
        role: role,
        url: url,
        color: color,
        userId: userId
      }
      var chatDatabase = getters.chat_database
      var newChatDatabaseRef = chatDatabase.ref('chat').push()
      newChatDatabaseRef.set(sendData)
    },

    uploadProfileImage({ commit, getters }) {
      let ref = firebase.storage().ref()
      let uploadTask = ref
      //var image_check1 = 1
        .child(
          getters.user.id + '/profile/' + getters.image_being_uploaded.file.name
        )
        .put(getters.image_being_uploaded.file)
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              commit('set_start_image_uploaded', true)
              console.log('Upload is paused')
              
              break
            case firebase.storage.TaskState.RUNNING: // or 'running'
              commit('set_start_image_uploaded', true)
              console.log('Upload is running')
              break
          }
          //spinner stuff ------------
          //state.image_uploaded = true;
          //console.log(state.image_upload);
          //commit('set_image_uploaded', true)
          //let check_spinner = status.check_image_c
          //if (state.check_image_c == false)
          //if (status.check_image_c == false)
          //if(this.$store.state.check_image_c == false)
          //{  
            //commit('set_image_uploaded', true)
          //commit('set_check_image_c', true)
           //commit('set_image_uploaded', true)
          //}
          ///else
          //{
            //commit('set_check_image_c', false)
          //}
          //spinner stuff --------------
          commit('set_start_image_uploaded', true)
        },
        function (error) {
          // A full list of error codes is available at
          switch (error.code) {
            case 'storage/unauthorized':
              alert(error.code)
              // User doesn't have permission to access the object
              commit('set_image_uploaded', true)
              break

            case 'storage/canceled':
              alert(error.code)
              // User canceled the upload
              commit('set_image_uploaded', true)
              break
            case 'storage/unknown':
              alert(error.code)
              // Unknown error occurred, inspect error.serverResponse
              commit('set_image_uploaded', true)
              break
          }
        },
        // Additional code to upload/update Profile Logo - Wan
        // Additional code to upload/update Profile Logo - Wan
        function () {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('Url captured: ' + downloadURL)
            commit('setUrl', downloadURL)
            console.log('State url' + getters.url)

            // Now that download URL is obtained, downloadURL is sent to Firebase
            // to connect the user's ID to the updated profile picture
            let updateData = {}
            let db = getters.db
            let userId = getters.user.id
            let user = db
              .collection('users').doc(userId).update({ profileUrl: downloadURL }).then((data) => {
                let updateData = db.collection('users').doc(userId).get().then(function (doc) {
                  if (doc.exists) {
                    commit('signed_in_user', doc.data())
                    commit('setLoading', false)
                    commit('set_image_uploaded', true)
                  } else {
                    
                    // doc.data() will be undefined in this case
                  }
                  //state.image_uploaded = true;
                }).catch(function (error) {
                  
                  console.log('Error getting document:', error)
                })
              })
          })
          //state.image_uploaded = true;
          //commit('set_image_uploaded', true)
        })
        //commit('set_image_uploaded', true)
    },
    async updateArtistProfileToFirebase({ commit, dispatch, getters }, payload) {
      commit('setLoading', true)
      let instagram = payload.instagram
      let name = payload.name
      let photoUrl = payload.photoUrlreport_aug
      let updateData = {}
      let db = getters.db
      let userId = getters.user.id
      if (name !== undefined && name !== '') {
        updateData.name = name
      }

      // i think this is where the photo is being updataed at within the whole process.
      if (photoUrl !== undefined && photoUrl !== '') {
        dispatch('uploadProfileImage').then(() => {
          updateData.photoUrl = getters.url
        })
      }
      if (instagram !== undefined && instagram !== '') {
        updateData.instagram = instagram
      }

      console.log(updateData)
      let user = db
        .collection('users').doc(userId).update(updateData).then((data) => {
          let updateData = db.collection('users').doc(userId).get().then(function (doc) {
            if (doc.exists) {
              commit('signed_in_user', doc.data())
              commit('setLoading', false)
            } else {
              // doc.data() will be undefined in this case
            }
          })
            .catch(function (error) {
              console.log('Error getting document:', error)
            })
        })
    },
    async updateBusinessProfileToFirebase(
      { commit, dispatch, getters },
      payload
    ) {
      function setValidData(payload) {
        let initData = payload.data
        let initDataProperty = payload.property
        let updateData = payload.updateData
        if (initData !== undefined && initData !== '') {
          updateData[initDataProperty] = initData
        }
        return updateData
      }

      commit('setLoading', true)
      let name = payload.name
      let photoUrl = payload.photoUrl
      let updateData = {}
      let db = getters.db
      let userId = getters.user.id
      let publication = payload.publication
      let follower_count = payload.follower_count
      let website = payload.website
      let about = payload.about
      let worth_knowing = payload.worth_knowing
      let additional_notes = payload.additional_notes

      updateData = setValidData({ updateData: updateData, data: publication, property: 'publication' })
      if (follower_count !== 0) {
        updateData.follower_count = follower_count
      }
      updateData = setValidData({ updateData: updateData, data: website, property: 'website' })
      updateData = setValidData({ updateData: updateData, data: about, property: 'about' })
      updateData = setValidData({ updateData: updateData, data: worth_knowing, property: 'worth_knowing' })
      updateData = setValidData({ updateData: updateData, data: additional_notes, property: 'additional_notes' })
      updateData = setValidData({ updateData: updateData, data: instagram, property: 'instagram' })

      if (name !== undefined && name !== '') {
        updateData.business_name = name
      }
      if (photoUrl !== undefined && photoUrl !== '') {
        dispatch('uploadProfileImage').then(() => {
        })
      }
      console.log(updateData)
      let user = db
        .collection('users').doc(userId).update(updateData).then((data) => {
          let updateData = db.collection('users').doc(userId).get().then(function (doc) {
            if (doc.exists) {
              commit('signed_in_user', doc.data())
              commit('setLoading', false)
            } else {
              // doc.data() will be undefined in this case
              
            }
          })
            .catch(function (error) {
              console.log('Error getting document:', error)
            })
        })
    }
  },
  getters: {
    get_business_info(state){
      return state.business_info;
    },
    get_business_members(state){
      return state.business_members
    },
    reserved_submissions(state)
    {
      return state.reserved_submissions
    },
    responded_submissions(state)
    {
      return state.responded_submissions
    },
    //for spinner
    get_check_image_c(state)
    {
      return state.check_image_c
    },
    get_art_being_submitted_is_selected(state) {
      return state.art_being_submitted_is_selected
    },
    stored_user_email(state) {
      return state.stored_user_email;
    },
    viewed_artist_data(state) {
      return state.viewed_artist_data
    },
    commenting_mode(state) {
      return state.commenting_mode
    },
    viewed_arts(state) {
      return state.viewed_arts
    },
    comments(state) {
      return state.comments
    },
    top_12_recent_art(state) {
      return state.top_12_recent_art
    },
    businesses_being_submitted(state) {
      return state.businesses_being_submitted
    },
    report_month(state) {
      return state.report_month
    },
    businesses_being_submitted(state) {
      return state.businesses_being_submitted
    },
    report_month(state) {
      return state.report_month
    },
    replied_for_report(state) {
      return state.replied_for_report
    },
    credits(state) {
      return state.credits
    },
    replied_submissions(state) {
      return state.replied_submissions
    },
    submission_response(state) {
      return state.submission_response
    },
    art_being_replied(state) {
      return state.art_being_replied
    },
    submissions_for_this_business(state) {
      return state.submissions_for_this_business
    },
    art_being_submitted(state) {
      return state.art_being_submitted
    },
    business_signing_up(state) {
      return state.business_signing_up
    },
    clicked_busliness(state) {
      return state.clicked_business
    },
    image_folder(state) {
      return state.image_folder
    },
    user_role(state) {
      return state.user_role
    },
    user(state) {
      return state.user
    },
    url(state) {
      return state.url
    },
    color(state) {
      return state.color
    },
    categories(state) {
      return state.categories
    },
    updatedCategories(state) {
      return state.updatedCategories
    },
    image_being_uploaded(state) {
      return state.image_being_uploaded
    },
    businesses(state) {
      return state.businesses
    },
    allArts(state) {
      return state.arts
    },
    // a getter function that returns an array that contains arts that are sorted by their upload date.
    uploadedArts(state) {
      return state.arts.sort((artA, artB) => {
        return artA.upload_date < artB.upload_date
      })
    },
    // a getter that returns a function that takes in an artId and...
    uploadedArt(state) {
      return artId => {
        return state.uploadedArts.find(art => {
          return art.id - artId
        })
      }
    },
    // a getter function that takes in an array that contains all of the arts and returns the first five of them as futured arts
    featuredArts(state, getters) {
      return getters.uploadedArts.slice(0, 5)
    },
    error(state) {
      return state.error
    },
    loading(state) {
      return state.loading
    },
    // a getter that returns the chat database
    chat_database(state) {
      return state.chat_database
    },
    replied_requests_for_report(state) {
      return state.replied_requests_for_report
    },
    sendChatDataMessage(state) {
      return state.sendChatData.message
    },
    sendChatDataUser(state) {
      return state.sendChatData.user
    },
    sendChatDataDaystamp(state) {
      return state.sendChatData.daystamp
    },
    sendChatDataTimestamp(state) {
      return state.sendChatData.timestamp
    },
    sendChatDataUrl(state) {
      return state.sendChatData.url
    },
    signed_in_business(state) {
      return state.signed_in_business
    },
    avatar(state) {
      return state.avatar
    },
    signed_in_user(state) {
      return state.signed_in_user
    },

    signed_in_user_id(state) {
      return state.signed_in_user_id
    },
    db(state) {
      return state.db
    },
    current_credits(state) {
      return state.signed_in_user.credits
    },
    selectBlog(state) {
      return state.selectBlog
    },
    datePicker(state) {
      return state.replied_requests_for_report_datePicker
    },
    query_email(state) {
      return state.query_business_email
    },
    free_credits(state) {
      return state.free_credits
    },
    artists_email_list(state) {
      return state.artists_email_list
    },
    submissions_for_month(state) {
      return state.submissions_for_month
    },
    submissions_for_year(state) {
      return state.submissions_for_year
    },
    monthly_report_submissions(state) {
      return state.monthly_report_submissions
    },
    artist_settings_artist(state) {
      return state.artist_settings_artist
    },
    // Yiwayana and aortiz
    yearly_chart_array(state) {
      return state.chart_array_for_submissions
    },
    yearly_chart_replied(state) {
      return state.chart_replied_for_submissions
    },
    yearly_chart_paid(state) {
      return state.chart_paid_for_submissions
    },
    yearly_chart_free(state) {
      return state.chart_free_for_submissions
    },
    info_of_business_for_dashboard2(state) {
      return state.info_of_business_for_dashboard2
    },
    //returns whether or not the art was updated
    get_art_uploaded(state) {
      return state.art_uploaded
    },
    get_recently_responded_arts(state) {
      return state.recently_responded_arts
    },
    get_top_ten_category(state){
      return state.top_ten_category
    },
    get_top_ten_rec_businesses(state){
      return state.top_ten_rec_businesses;
    },
    get_start_uploaded(state){
      return state.start_image_uploaded
    },
    get_image_uploaded(state){
      console.log('entered get_image_uploaded --- index.js')
      console.log('in get image uploaded and value is ' , state.image_uploaded)
      return state.image_uploaded
    },
    get_group_business_id(state){
      return state.group_business_id;
    },
  }
})

      
