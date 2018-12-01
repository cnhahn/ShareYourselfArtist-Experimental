// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import 'firebase/firestore'
import config from '../config'
import router from '../router'

firebase.initializeApp(config)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    localStorage,
    db: firebase.firestore(),
    chat_database: firebase.database(),
    arts: [],
    sideNavItems: [
      { title: 'Dashboard', icon: 'dashboard', link: '/artist_dashboard' },
      //{ title: 'Bio & Stats', icon: 'face', link: '/bio' },
      { title: 'My Account', icon: 'account_box', link: '/account' },
    ],
    business_side_nav_items: [
      { title: 'Dashboard', icon: 'dashboard', link: '/business_dashboard' },
      //{ title: 'Bio & Stats', icon: 'face', link: '/bio' },
      //{ title: 'My Account', icon: 'account_box', link: '/account' },
      { title: 'Report', icon: 'assessment', link: '/report' },
      { title: 'Chat', icon: 'chat', link: '/chat' }
    ],
    navItems: [
      { title: 'Home', icon: 'home', link: '/', method: '' },
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',

      },
      {
        title: 'Support',
        icon: 'help',
        link: '/support',
    
      },
      {
        title: 'About Us',
        icon: 'nature_people',
        link: '/about_us',

      },
      {
        title: 'Sign In',
        icon: 'nature_people',
        link: '/sign_in',
     
      }
    ],
    navItems_User: [
    ],
    navItems_signedIn: [
      {
        title: 'Submit Your Work',
        icon: 'chrome_reader_mode',
        link: '/blogs',

      },
      {
        title: 'Support',
        icon: 'help',
        link: '/support',

      },
      {
        title: 'About Us',
        icon: 'nature_people',
        link: '/about_us',

      }
    ],
    navItems_Business: [
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',
        method: 'dummyMethod'
      },
    ],
    sendChatData: {
      user: '',
      message: '',
      daystamp: '',
      timestamp: '',
      url:'',
    },
    uploadedArts: [],
    user: null,
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
    clicked_art:'',
    art_being_submitted_is_selected: false,
    business_being_submitted_is_selected: false,
    businesses_being_submitted:[],
    test: 4,
    signed_in_user: {},
    art_being_submitted: {
      refunded: 0
    },
    replied_requests_for_report_aug:[],
    replied_requests_for_report_sep:[],
    replied_requests_for_report_oct:[],
    replied_requests_for_report_nov:[],
    replied_requests_for_report_dec:[],
    submissions_for_this_business: [],
    submission_response: {},
    art_being_replied: {},
    credits:0,
    replied_submissions: [],
    avatar: '',
    signed_in_user_id: '',
    signed_in_user:{},
    blog_for_report:'',
    subscription_plan:{},
    replied_for_report: [],
    report_month: 1,
    free_credits:0,
    artists_email_list:[],
    selectBlog:{
      userId:'',
      name:'',
      role:'',
    },
  },
  mutations: { 
    set_free_credits(state, payload){
      console.log('inside set free credits')
      console.log(payload)
      if(payload != null || payload != undefined || payload != ''){
        state.free_credits = payload
      }else{
        console.log('An error occured reading the free credits. This user may have never given any free credits.')
      }
      
    },
    set_artists_email_list(state,payload){
      state.artists_email_list.push(payload)
    },
    set_blog_for_report(state, payload){
      state.blog_for_report = payload
    },
    set_businesses_being_submitted(state, payload){
      state.businesses_being_submitted = payload
    },
    set_art_being_submitted_is_selected(state, payload) {
        state.art_being_submitted_is_selected = payload
    },
    set_business_being_submitted_is_selected(state, payload) {
        state.business_being_submitted_is_selected = payload
    },
    set_art_being_replied (state, payload) {
      (state.art_being_replied.art_title = payload.art_title),
        (state.art_being_replied.artist_name = payload.artist_name),
        (state.art_being_replied.submitted_on = payload.submitted_on),
        (state.art_being_replied.description = payload.description),
        (state.art_being_replied.artist_id = payload.artist_id),
        (state.art_being_replied.docId = payload.docId)
    },
    increase_credits (state, payload) {
        state.credits = state.credits+payload
    },
    set_credits(state,payload){
      state.credits = payload
    },
        reset_replied_submissions(state) {
        state.replied_submissions.length = 0
    },
    set_replied_submissions (state, payload) {
      state.replied_submissions.push(payload)
    },
    clear_replied_submissions_array (state) {
      state.replied_submissions = []
    },
    set_response (state, payload) {
      state.submission_response.response = payload.response
      state.submission_response.radios = payload.radios

    },
    set_submission_response (state, payload) {
      state.submission_response = payload
    },
    clear_submissions_for_this_business_array (state) {
      state.submissions_for_this_business = []
    },
    set_submissions_for_this_business (state, payload) {
      state.submissions_for_this_business.push(payload)
    },
    set_art_being_submitted (state, payload) {
      state.art_being_submitted.art = payload
    },
    set_business_being_submitted (state, payload) {
      state.art_being_submitted.businessId = payload.businessId
      state.art_being_submitted.submitted_on = payload.date
    },
    set_clicked_art (state, payload) {
      state.clicked_art = payload
    },
    business_signing_up (state, payload) {
      state.business_signing_up = payload
    },
    artist_signing_up (state, payload) {
      state.artist_signing_up = payload
    },
    test (state, payload) {
      state.test = payload
    },
    set_image_folder (state, payload) {
      state.image_folder = payload
    },
    clear_arts_array (state) {
      state.arts = []
    },
    setArts (state, payload) {
      state.arts.push(payload)
    },
    clearBusinesses (state) {
      state.businesses = []
    },
    setBusinesses (state, payload) {
      state.businesses.push(payload)
    },
    set_replied_requests_for_report_aug (state, payload) {
      state.replied_requests_for_report_aug.push(payload)
    },
    set_replied_requests_for_report_sep (state, payload) {
      state.replied_requests_for_report_sep.push(payload)
    },
    set_replied_requests_for_report_oct (state, payload) {
      state.replied_requests_for_report_oct.push(payload)
    },
    set_replied_requests_for_report_nov (state, payload) {
      state.replied_requests_for_report_nov.push(payload)
    },
    set_replied_requests_for_report_dec (state, payload) {
      state.replied_requests_for_report_dec.push(payload)
    },
    clear_replied_for_report_aug (state) {
      state.replied_requests_for_report_aug = []
    },
    clear_replied_for_report_sep (state) {
      state.replied_requests_for_report_sep = []
    },
    clear_replied_for_report_oct (state) {
      state.replied_requests_for_report_oct = []
    },
    clear_replied_for_report_nov (state) {
      state.replied_requests_for_report_nov = []
    },
    clear_replied_for_report_dec (state) {
      state.replied_requests_for_report_dec = []
    },
    setClickedBusiness (state, payload) {
      state.clicked_business = payload
    },
    setUserRole (state, payload) {
      state.user_role = payload
    },
    uploadedArt (state, payload) {
      state.uploadedArts.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setUrl (state, payload) {
      state.url = payload
    },
    set_logo_url (state, payload) {
      state.logo_url = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    set_user_email (state) {
      state.signed_in_user_email = firebase.auth().currentUser.email
    },
    clearError (state) {
      state.error = null
    },
    set_send_chat_data (state, payload) {
      state.sendChatData.message = payload.message
      state.sendChatData.user = payload.user
      state.sendChatData.daystamp = payload.daystamp
      state.sendChatData.timestamp = payload.timestamp
      state.sendChatData.url = payload.url
    },
    setUserRandColor (state) {
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
    setUserColor (state, payload) {
      state.color = payload.color
    },
    image_being_uploaded (state, payload){
      state.image_being_uploaded = payload
    },
    set_user_email (state) {
      state.art_being_submitted.artist_email = firebase.auth().currentUser.email
    },
    clearError (state) {
      state.error = null
    },
    signed_in_user_id (state, payload) {
      state.signed_in_user_id = payload
    },
    signed_in_user (state, payload) {
      state.signed_in_user = payload
    },
    sign_out_signed_in_user (state) {
      state.signed_in_user = null
      state.url = null
      state.color = 'primary'
    },
    set_replied_for_report (state, payload) {
      state.replied_for_report.push(payload)
    },
    set_report_month (state, payload) {
      state.report_month = payload
    },
    set_select_blog (state, payload) {
      (state.selectBlog.name = payload.name),
      (state.selectBlog.userId = payload.userId),
      (state.selectBlog.role = payload.role)
    }
  },
  actions: {
    // for report
    get_replied ({commit, getters}) {
      let db = firebase.firestore()
      var temp_report = db.collection('review_requests')
                          // .orderBy('submitted_on')
                          .where('replied', '==', true)
                          .where('businessId.userId', '==', getters.user.id)
                          console.log("temp report", temp_report)
      let report = temp_report
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              var month = getters.report_month
              const today = Date.now()
              const timeDiff = today - (1000*60*60*24*30*month)
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
      // the foll function us used bt dashboard page to get the replied submissions for businesses. this function is temporary and will be updated
    report_aug ({commit, getters}, payload) {
      commit('clear_replied_for_report_aug')
      let db = firebase.firestore()
      let temp_report = db.collection('review_requests')
      let query = temp_report.where("businessId.business_email", "==", payload.business_email).where("replied_date", ">", 1533081600000).where("replied_date", "<", 1535760000000)
      query.get().then(function (results) {
      if(results.empty) {
          console.log("No documents found!");   
      } else {
      // go through all results
    results.forEach(function (doc) {
      commit('set_replied_requests_for_report_aug', doc.data())
    });
// set_replied_requests_for_report
    // or if you only want the first result you can also do something like this:
    console.log("Document data:", results.docs[0].data());
  }
}).catch(function(error) {
    console.log("Error getting documents:", error);
});
  }, 
  report_sep({commit, getters}, payload) {
    commit('clear_replied_for_report_sep')
    let db = firebase.firestore()
    let temp_report  = db.collection('review_requests')
    let query = temp_report.where("businessId.business_email", "==", payload.business_email).where("replied_date", ">", 1537488000000).where("replied_date", "<", 1538870400000)
  query.get().then(function(results) {
  if(results.empty) {
      console.log("No documents found!");   
  } else {
  // go through all results
results.forEach(function (doc) {
  commit('set_replied_requests_for_report_sep', doc.data())
});
// set_replied_requests_for_report
// or if you only want the first result you can also do something like this:
console.log("Document data:", results.docs[0].data());
}
}).catch(function(error) {
console.log("Error getting documents:", error);
});
},
report_oct({commit, getters}, payload) {
  commit('clear_replied_for_report_oct')
  let db = firebase.firestore()
  let temp_report  = db.collection('review_requests')
  let query = temp_report.where("businessId.business_email", "==", payload.business_email).where("replied_date", ">", 1535760000000).where("replied_date", "<", 1538352000000)
query.get().then(function(results) {
if(results.empty) {
    console.log("No documents found!");   
} else {
// go through all results
results.forEach(function (doc) {
commit('set_replied_requests_for_report_oct', doc.data())
});
// set_replied_requests_for_report
// or if you only want the first result you can also do something like this:
console.log("Document data:", results.docs[0].data());
}
}).catch(function (error) {
  console.log('Error getting documents:', error)
})
},
    report_nov ({commit, getters}, payload) {
      commit('clear_replied_for_report_nov')
      let db = firebase.firestore()
      let temp_report = db.collection('review_requests')
      let query = temp_report.where('businessId.business_email', '==', payload.business_email).where('replied_date', '>', 1538870400000).where('replied_date', '<', 1540166400000)
      query.get().then(function (results) {
        if (results.empty) {
          console.log('No documents found!')
        } else {
// go through all results
          results.forEach(function (doc) {
            commit('set_replied_requests_for_report_nov', doc.data())
          })
// set_replied_requests_for_report
// or if you only want the first result you can also do something like this:
          console.log('Document data:', results.docs[0].data())
        }
      }).catch(function (error) {
        console.log('Error getting documents:', error)
      })
    },
report_dec({commit, getters}, payload) {
  commit('clear_replied_for_report_dec')
  let db = firebase.firestore()
  let temp_report  = db.collection('review_requests')
  let query = temp_report.where("businessId.business_email", "==", payload.business_email).where("replied_date", ">", 1535760000000).where("replied_date", "<", 1538352000000)
query.get().then(function(results) {
if(results.empty) {
    console.log("No documents found!");   
} else {
// go through all results
results.forEach(function (doc) {
commit('set_replied_requests_for_report_dec', doc.data())
});
// set_replied_requests_for_report
// or if you only want the first result you can also do something like this:
console.log("Document data:", results.docs[0].data())
}
}).catch(function(error) {
console.log("Error getting documents:", error);
});
},
signUserInGoogle({
  commit,getters
  }) {
  commit('setLoading', true)
  commit('clearError')
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .then(
  user => {
  localStorage.setItem('userId', 1000)
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
  console.log('newUserid: ' + newUser.userId + 'name' + newUser.name + 'email ' + user.additionalUserInfo.profile.email)
  console.log('current picture')
  commit('setUser', newUser)
  console.log('getters.user.id' + getters.user.id)
  const db = firebase.firestore()
  var artistRef = db.collection('users').doc(newUser.userId);
  var getDoc = artistRef.get()
      .then(doc => {
          if (!doc.exists) {
            if(typeof newUser.photoUrl === 'string') {
              commit('setUrl', newUser.photoUrl)
            }else{
              commit('setUrl', newUser.photoUrl.data.url)
            }
            commit('signed_in_user', newUser)
            commit('setUserRole', 'artist')
            console.log('user doesnt exist')
            db.collection('users').doc(newUser.userId)
              .set(newUser)
              .then(function(){
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
            if(typeof doc.data().photoUrl === 'string') {
              console.log('doc.data().photoUrl' + doc.data().photoUrl)
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
          console.log('Error getting document', err);
      });
  })
  },
  signUserInFacebook({
  commit
  }) {
  commit('setLoading', true)
  commit('clearError')
  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
  .then(
  user => {
  commit('setLoading', false)
  localStorage.setItem('userId', 1000)
  const newUser = {
  upload_date: Date.now(),
  userId: firebase.auth().currentUser.uid,
  name: user.additionalUserInfo.profile.name,
  email: user.additionalUserInfo.profile.email,
  photoUrl: user.additionalUserInfo.profile.picture,
  role: 'artist',
  credits: 0
  }
  console.log('newUserid: ' + newUser.userId + 'name' + newUser.name + 'email ' + user.additionalUserInfo.profile.email)
  commit('setUser', newUser)
  //console.log('getters.user.id' + getters.user.id)
  const db = firebase.firestore()

  var artistRef = db.collection('users').doc(newUser.userId);
  var getDoc = artistRef.get()
      .then(doc => {
          if (!doc.exists) {
            console.log('user doesnt exist')
            if(typeof newUser.photoUrl === 'string') {
              commit('setUrl', newUser.photoUrl)
            } else {
              commit('setUrl', newUser.photoUrl.data.url)
            }
            commit('signed_in_user', newUser)
            commit('setUserRole', 'artist')
            router.push({
              name: 'artist_dashboard'
            })
            db.collection('users').doc(newUser.userId)
              .set(newUser)
              .then(function(){
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
            if(typeof doc.data().photoUrl === 'string') {
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
          console.log('Error getting document', err);
      });
  }
  )
  },
  update_review_read_byUser_status({commit},payload){
    console.log('payload: ', payload)
    const db = firebase.firestore()
    const collectionRef = db
              .collection('review_requests')
              .where('art.upload_date', '==', payload)
              .get().
              then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  var docRef = db.collection("review_requests").doc(doc.id);

                  return docRef.update({
                    read_byartist:true
                  })
                  .then(function() {
                      console.log("read_by user field successfully updated!");
                  })
                  .catch(function(error) {
                      // The document probably doesn't exist.
                      console.error("Error updating read by user field: ", error);
                  })
                });
            })
  },
  





    update_user_credit({ getters },payload) {
            const db = firebase.firestore()
            const collectionRef = db
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              console.log('updating user: ',firebase.auth().currentUser.uid)
              let credit_after_purchase = payload
            return collectionRef
              .update({
                credits: payload,
              })
              console.log('credit amount: ',credit_after_purchase)
              .then(function () {
                console.log('Users credits successfully updated!')
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating updating user credit: ', error)
              })
          },
          update_user_free_credit({ getters },payload) {
            const db = firebase.firestore()
            const collectionRef = db
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              console.log('updating user: ',firebase.auth().currentUser.uid)
              let free_credit_after_purchase = payload
            return collectionRef
              .update({
                free_credits: payload,
              })
              console.log('credit amount: ',credit_after_purchase)
              .then(function () {
                console.log('Users credits successfully updated!')
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating updating user credit: ', error)
              })
          },
          update_user_subscription({ getters },payload) {
            const db = firebase.firestore()
            const collectionRef = db
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              console.log('updating user: ',firebase.auth().currentUser.uid)
            return collectionRef
              .update({
                subscription: payload,
              })
              .then(function () {
                console.log('Users subscription successfully updated!')
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating updating user subscription: ', error)
              })
          },
   get_user_credit({commit}, payload){
    const db = firebase.firestore()
    const collectionRef = db
      .collection('users')
      .doc(payload)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Credits:", doc.data().credits)
          commit('set_credits', doc.data().credits )
          commit('set_free_credits', doc.data().free_credits )
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error)
      })


   },
   get_user_email ({ commit }, payload) {
      let auth = firebase.auth()
      admin
        .auth()
        .getUserByEmail(email)
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully fetched user data:', userRecord.toJSON())
        })
        .catch(function (error) {
          console.log('Error fetching user data:', error)
        })
    },

    reset_password ({ commit }, payload) {
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
    get_users ({ commit }) {
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
      let db = firebase.firestore()
      let artists = db
        .collection('users')
        .where('role', '==', 'artist')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('set_artists_email_list', {artist_name: doc.data().name, artist_email: doc.data().email })
          })
        })
        .catch(function (error) {
          console.log('Error getting businesses: ', error)
        })
    },


   fetch_replied_submissions ({ commit, getters }) {
      commit('clear_submissions_for_this_business_array')
      let db = firebase.firestore()
      let role = db
        .collection('review_requests')
        .where('replied', '==', true)
        .where('art.artist_id', '==', getters.user.id)
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

   fetch_clicked_business ({ commit, getters }) {
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
   async fetchUserDocument ({ commit, getters }) {
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
            commit('set_credits',doc.data().credits )
            commit('set_free_credits', doc.data().free_credits)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
      console.log('getters.user_role:' + getters.user_role)
      console.log('getters.user_rid:' + getters.user.id)
      console.log('getters.user_credit:' + getters.credits)
    },

   fetchArts ({ commit, getters }) {
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

    // this function gets the submissions for a business and
   async fetchSubmissions ({ commit, getters }) {
      commit('clear_submissions_for_this_business_array')
      const db = firebase.firestore()
      const collectionRef = await db
        .collection('review_requests')
        .where('businessId.userId', '==', getters.user.id)
        .where('replied', '==', false)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            let docData = doc.data()
            console.log('doc.data: ' + docData)
            console.log('doc.id: ' + doc.id)
            docData.docId = doc.id

            console.log('doc.data: ' + docData.docId)
            commit('set_submissions_for_this_business', docData)
            console.log(doc.id, ' => ', doc.data())
          })
        })
        .catch(function (error) {
          console.log('Error getting submissions: ', error)
        })
    },
    async fetch_all_Submissions ({ commit, getters }) {
      commit('clear_submissions_for_this_business_array')
      const db = firebase.firestore()
      const collectionRef = await db
        .collection('review_requests')
        .where('businessId.userId', '==', getters.user.id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            let docData = doc.data()
            console.log('doc.data: ' + docData)
            console.log('doc.id: ' + doc.id)
            docData.docId = doc.id

            console.log('doc.data: ' + docData.docId)
            commit('set_submissions_for_this_business', docData)
            console.log(doc.id, ' => ', doc.data())
          })
        })
        .catch(function (error) {
          console.log('Error getting submissions: ', error)
        })
    },

      // Styled by Jin. No modification on code.
      uploadImage({commit, getters}, payload) {
        // first put the image in the storage
        // Create a root reference
        let ref = firebase.storage().ref()
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
              commit('setUrl', downloadURL) // Jin: this led to profile url change.
              if (payload.operation === 'art_upload') {
                let art = {
                  art_title: payload.art_title,
                  artist_name: payload.artist_name,
                  url: getters.url,
                  description: payload.description,
                  upload_date: payload.upload_date,
                  artist_id: firebase.auth().currentUser.uid
                };
                const db = firebase.firestore()
                const collectionRef = db.collection('art')
                collectionRef
                  .add(art)
                  .then(function (docRef) {
                    commit('setArts', art);
                    console.log('Document written with ID: ', docRef.id)
                  })
                  .catch(function (error) {
                    console.error('Error adding document: ', error)
                  })
              }
            })
          }
        )

        let art = {
          art_title: payload.art_title,
          artist_name: payload.artist_name,
          url: getters.url,
          description: payload.description,
          upload_date: payload.upload_date,
          artist_id: getters.user.id
        }

        // upload the artist data and the url
      },
   submit_submission_response ({ getters }) {
      const db = firebase.firestore()
      const collectionRef = db
        .collection('review_requests')
        .doc(getters.art_being_replied.docId)
      return collectionRef
        .update({
          replied: true,
          read_byartist: false,
          submission_response: getters.submission_response,
          replied_date: Date.now()
        })
        .then(function () {
          console.log('Submission successfully updated!')
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error('Error updating dsubmission: ', error)
        })
    },
   submit_request ({ getters }) {
     let businesses_being_submitted =  getters.businesses_being_submitted
     for (let i = 0; i < businesses_being_submitted.length; i++) { 
      let art_being_submitted = getters.art_being_submitted
      art_being_submitted.submitted_on = Date.now()      
      art_being_submitted.submitted_with_free_cerdit = false
      console.log("art_being_submitted", art_being_submitted)
      art_being_submitted.businessId = businesses_being_submitted[i]
      console.log("art_being_submitted", art_being_submitted)
      const db = firebase.firestore()
      const collectionRef = db
        .collection('review_requests')
        .doc()
        .set(art_being_submitted)
        .then(function (docRef) {
          console.log('Submission written with ID: ', docRef.id)
          // router.push({
          //   name: 'submit_result'
          // })
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
      }    
    },
    submit_school_request ({ commit, getters, dispatch }, payload) {
       const db = firebase.firestore()
       const collectionRef = db
         .collection('school_requests')
         .doc()
         .set(payload)
         .then(function (docRef) {
           console.log('School submission written with ID: ', docRef.id)
           // router.push({
           //   name: 'submit_result'
           // })
         })
         .catch(function (error) {
           console.error('Error adding document: ', error)
         })
     },
    submit_request_with_free_credits ({ getters }) {
      let businesses_being_submitted =  getters.businesses_being_submitted
      for (let i = 0; i < businesses_being_submitted.length; i++) { 
       let art_being_submitted = getters.art_being_submitted
       art_being_submitted.submitted_on = Date.now()
       art_being_submitted.submitted_with_free_cerdit = true
       console.log("art_being_submitted", art_being_submitted)
       art_being_submitted.businessId = businesses_being_submitted[i]
       console.log("art_being_submitted", art_being_submitted)
       const db = firebase.firestore()
       const collectionRef = db
         .collection('review_requests')
         .doc()
         .set(art_being_submitted)
         .then(function (docRef) {
           console.log('Submission written with ID: ', docRef.id)
           // router.push({
           //   name: 'submit_result'
           // })
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
    create_a_new_business ({ commit, getters, dispatch }, payload) {
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
              facebook_url: payload.facebook_url,
              instagram_url: payload.instagram_url,
              tumblr_url: payload.tumblr_url,
              userId: getters.user.id,
              about: payload.about,
              worth_knowing: payload.worth_knowing,
              additional_notes: payload.additional_notes,
              upload_date: payload.upload_date,
              the_good: payload.the_good,
              url: getters.url
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
   create_a_new_artist ({ commit, getters }, payload) {
      localStorage.setItem('userId', 1000)
      router.push({
        name: 'artist_dashboard'
      })
      let user = {
        instagram_url: payload.instagram_url,
        role: payload.role,
        free_credits: payload.free_credits,
        name: payload.name,
        email: payload.email,
        upload_date: payload.upload_date,
        userId: getters.user.id,
        credits: 0
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
        .add({ initial_submission: true })
        .then(function (docRef) {
          console.log('Submission: ', docRef.id)
        })
        .catch(function (error) {
          alert('Error adding submission: ', error)
        })
    },

    uploadAvatar ({ commit, getters }, payload) {
      firebase
        .storage()
        .ref(
          getters.signed_in_user_id +
          '/logo/' +
          getters.image_being_uploaded.file.name
        )
        .put(getters.image_being_uploaded.file)
    },
    async singBusinessUp({commit},payload){
      try{
        let response = await firebase.auth()
        .createUserAndRetrieveDataWithEmailAndPassword(
          payload.email,
          payload.password
        )

        let ref = await firebase.storage().ref()
        let uploadTask = ref
          .child(
            response.user.uid + '/logo/' + payload.file_name
          )
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
            })
        console.log('response: ', response.user.uid)
        console.log('payload: ',payload)
      }
      catch(e) {
        console.log('Error!', e);
      }

      //we have created a auth account and upladed the logo now we will 
      // create auser document
  },
    /*
    Sign up/Sign in flow
    Register user with Firebase Authentication
    */
   signUserUp ({ commit }, payload) {
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
            arts: [],
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
        if(payload.user_role != 'artist') {
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
      image_being_uploaded({commit}, payload) {
        commit('image_being_uploaded', payload)
      },
    logo_url ({ commit }, payload) {
      commit('set_logo_url', payload)
    },

    clearError ({ commit }) {
      commit('clearError')
    },

    /*
    Sign up/Sign in flow
    Sign user in and load information from Firestore
    */
    signUserIn ({ commit, dispatch, getters }, payload) {
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
                  const newUser = {
                    id: firebase.auth().currentUser.uid,
                    name: firebase.auth().currentUser.displayName,
                    email: firebase.auth().currentUser.email,
                    // TODO: I need to call the existing arts for this user and push in to this array
                    arts: []
                  }
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
                            { merge: true }
                          )
                        } else {
                          commit('setUserColor', { color: doc.data().color })
                        }
                        commit('setUserRole', doc.data().role)
                        commit('setUrl',doc.data().url)
                        commit('signed_in_user', doc.data())
                        commit('set_free_credits', doc.data().free_credits)
                        if (doc.data().role == 'artist') {
                          router.push({
                            name: 'artist_dashboard'
                          })
                        }
                        if (doc.data().role == 'business') {
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
                alert(
                  err.message +
                  'Or you may have not confirmed your email yet. If you need further assistance, please send us an email.'
                )
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
   signUserOut ({ commit }) {
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

    autoSignIn ({ commit }, payload) {
      commit('setUser', { id: payload.uid })
    },
    clearError ({ commit }) {
      commit(clearError)
    },
    // should change this function!
    async sendMessageToFirebase ({ commit, getters }, payload) {
      commit('set_send_chat_data', payload)
      var message = getters.sendChatDataMessage
      var role = getters.user_role
      var url = payload.url
      var color = payload.color
      var user = { name: payload.user }
      var daystamp = getters.sendChatDataDaystamp
      var timestamp = getters.sendChatDataTimestamp

      var sendData = {
        user: user,
        message: message,
        daystamp: daystamp,
        timestamp: timestamp,
        role: role,
        url: url,
        color: color
      }
      var chatDatabase = getters.chat_database
      var newChatDatabaseRef = chatDatabase.ref('chat').push()
      newChatDatabaseRef.set(sendData)
    },
      uploadProfileImage ({commit, getters}) {
        let ref = firebase.storage().ref()
        let uploadTask = ref
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
            })
          })
      },
      async updateArtistProfileToFirebase ({commit, dispatch, getters}, payload) {
        commit('setLoading', true)
        let instagram_url = payload.instagram_url
        let name = payload.name
        let photoUrl = payload.photoUrlreport_aug
        let updateData = {}
        let db = getters.db
        let userId = getters.user.id
        if (name !== undefined && name !== '') {
          updateData.name = name
        }
        if (photoUrl !== undefined && photoUrl !== '') {
          dispatch('uploadProfileImage').then(() => {
            updateData.photoUrl = getters.url
          })
        }
        if (instagram_url !== undefined && instagram_url !== '') {
          updateData.instagram_url = instagram_url
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
            }).catch(function (error) {
              console.log("Error getting document:", error);
            });
          })
      },
      async updateBusinessProfileToFirebase ({commit, dispatch, getters}, payload) {
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
        let statistics = payload.statistics
        let additional_notes = payload.additional_notes
        let instagram_url = payload.instagram_url

        updateData = setValidData({updateData: updateData, data: publication, property: 'publication'})
        if (follower_count !== 0) {
          updateData.follower_count = follower_count
        }
        updateData = setValidData({updateData: updateData, data: website, property: 'website'})
        updateData = setValidData({updateData: updateData, data: about, property: 'about'})
        updateData = setValidData({updateData: updateData, data: worth_knowing, property: 'worth_knowing'})
        updateData = setValidData({updateData: updateData, data: additional_notes, property: 'additional_notes'})
        updateData = setValidData({updateData: updateData, data: statistics, property: 'statistics'})
        updateData = setValidData({updateData: updateData, data: instagram_url, property: 'instagram_url'})
        
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
            }).catch(function (error) {
              console.log("Error getting document:", error);
            });
          })
      }
    },
  getters: {
    businesses_being_submitted(state){
      return state.businesses_being_submitted
    } ,   
    report_month(state) {
      return state.report_month
    },
    replied_for_report(state) {
      return state.replied_for_report
    },
    credits(state){
      return state.credits
    },
    replied_submissions (state) {
      return state.replied_submissions
    },
    submission_response (state) {
      return state.submission_response
    },
    art_being_replied (state) {
      return state.art_being_replied
    },
    submissions_for_this_business (state) {
      return state.submissions_for_this_business
    },
    art_being_submitted (state) {
      return state.art_being_submitted
    },
    business_signing_up (state) {
      return state.business_signing_up
    },
    clicked_busliness (state) {
      return state.clicked_business
    },
    image_folder (state) {
      return state.image_folder
    },
    user_role (state) {
      return state.user_role
    },
    user (state) {
      return state.user
    },
    url (state) {
      return state.url
    },
    color (state) {
      return state.color
    },
    image_being_uploaded (state) {
      return state.image_being_uploaded
    },
    businesses (state) {
      return state.businesses
    },
    allArts (state) {
      return state.arts
    },
    // a getter function that returns an array that contains arts that are sorted by their upload date.
    uploadedArts (state) {
      return state.arts.sort((artA, artB) => {
        return artA.upload_date < artB.upload_date
      })
    },
    // a getter that rturns a function that takes in an artId and...
    uploadedArt (state) {
      return artId => {
        return state.uploadedArts.find(art => {
          return art.id - artId
        })
      }
    },
    // a getter function that tahes in an array that contains all of the arts and returns the first five of them as futured arts
    featuredArts (state, getters) {
      return getters.uploadedArts.slice(0, 5)
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    },
    // a getter that returns the chat database
    chat_database (state) {
      return state.chat_database
    },
    replied_requests_for_report(state){
      return state.replied_requests_for_report
    },
    sendChatDataMessage (state) {
      return state.sendChatData.message
    },
    sendChatDataUser (state) {
      return state.sendChatData.user
    },
    sendChatDataDaystamp (state) {
      return state.sendChatData.daystamp
    },
    sendChatDataTimestamp (state) {
      return state.sendChatData.timestamp
    },
    sendChatDataUrl (state){
      return state.sendChatData.url
    },
    signed_in_business (state) {
      return state.signed_in_business
    },
    avatar (state) {
      return state.avatar
    },
    signed_in_user (state) {
      return state.signed_in_user
    },
    signed_in_user_id (state) {
      return state.signed_in_user_id
    },
    db (state){
      return state.db
    },
    current_credits (state) {
      return state.signed_in_user.credits
    },
    selectBlog(state){
      return state.selectBlog
    },
    august(state){
      return state.replied_requests_for_report_aug
    },
    september(state){
      return state.replied_requests_for_report_sep
    },
    october(state){
      return state.replied_requests_for_report_oct
    },
    november(state){
      return state.replied_requests_for_report_nov
    },
    december(state){
      return state.replied_requests_for_report_dec
    },
    free_credits(state){
      return state.free_credits
    },
    artists_email_list(state){
      return state.artists_email_list
    }
  }
})
