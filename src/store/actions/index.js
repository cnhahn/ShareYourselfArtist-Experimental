// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

import router from '../../router/index'
import * as firebase from 'firebase'
import config from '../../config'

export default{
  actions: {
    update_art_comments ({commit}, payload) {
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
    push_updated_business_info_to_firebase ({commit}, payload) {
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
    fetch_top_12_recent_art ({commit, getters}) {
      // commit('clear_top_12_recent_art')
      let db = firebase.firestore()
      let temp_report = db.collection('review_requests')
                          .orderBy('submitted_on').limit(12)
      let report = temp_report.get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              commit('set_top_12_recent_art', doc.data())
            })
          })
          .catch(function (error) {
            console.log('Error getting report: ', error)
          })
    },
    get_replied ({commit, getters}) {
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

    // yiwayana
    query_info_of_business_for_dashboard2 ({commit, state}, payload) {
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
    report_datePicker ({ commit, state }) {
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

    get_replied ({ commit, getters }) {
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
    get_artist_settings_artist ({commit, getters}, email) {
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
    distributeCredits ({commit, getters}, numCredits) {
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
    updateArtistSettings ({commit, getters}, artist) {
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
    get_monthly_report_submissions ({
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
    get_month_to_month_epoch_times ({ state, commit }) {
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
    filter_submissions_by_month ({ commit, state, dispatch }, payload) {
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
    get_submissions_for_year ({ commit, getters, dispatch }) {
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
    get_submissions_for_month ({ commit, getters }) {
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
    signUserInGoogle ({ commit, getters }) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(user => {
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
    signUserInFacebook ({ commit }) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {
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
    update_review_read_byUser_status ({ commit }, payload) {
      console.log('payload: ', payload)
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

    update_user_credit ({ getters }, payload) {
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
    update_user_free_credit ({ getters }, payload) {
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
    update_user_subscription ({ getters }, payload) {
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
    get_user_credit ({ commit }, payload) {
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
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error)
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
    get_email_list_of_artists ({ commit }) {
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
            commit('set_credits', doc.data().credits)
            commit('set_free_credits', doc.data().free_credits)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
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
     fetchViewedArts ({ commit, getters }, payload) {
      commit('clear_viewed_arts_array')
      console.log("payload " + payload)
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
            docData.docId = doc.id

            console.log('doc.data: ' + docData.docId)
            commit('set_submissions_for_this_business', docData)
          })
        })
        .catch(function (error) {
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
                  categories: payload.categories,
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
                  })
                  .catch(function (error) {
                  })
              }
            })
          }
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
              }
              const db = firebase.firestore()
              const collectionRef = db.collection('art')
              collectionRef
                .add(art)
                .then(function (docRef) {
                  commit('setArts', art)
                  console.log('Document written with ID: ', docRef.id)
                  router.push({name: 'artist_dashboard'})
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

    update_art_category_tags ({ getters }, payload) {
      const db = firebase.firestore()
      const uploadDate = parseInt(payload.upload_date, 10)
      const categories = payload.categories
      const collectionRef = db.collection('art').where("upload_date", "==", uploadDate)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
          var docRef = db.collection('art').doc(doc.id)
          return docRef.update(
            {"categories": categories}
            )
        })
      })
      .then(function() {

        console.log("successfully updated categories")
      })
      .catch(function(error) {
        console.error("Error updating categories: ", error)
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
      }
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
        instagram: payload.instagram,
        role: payload.role,
        free_credits: 2,
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
    async singBusinessUp ({ commit }, payload) {
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
    image_being_uploaded ({ commit }, payload) {
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
      commit('setUser', {
        id: payload.uid
      })
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
      var user = {
        name: payload.user
      }
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
              .collection('users').doc(userId).update({profileUrl: downloadURL}).then((data) => {
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
            })
          })
      },
      async updateArtistProfileToFirebase ({commit, dispatch, getters}, payload) {
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
    async updateBusinessProfileToFirebase (
      { commit, dispatch, getters },
      payload
    ) {
      function setValidData (payload) {
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

        updateData = setValidData({updateData: updateData, data: publication, property: 'publication'})
        if (follower_count !== 0) {
          updateData.follower_count = follower_count
        }
        updateData = setValidData({updateData: updateData, data: website, property: 'website'})
        updateData = setValidData({updateData: updateData, data: about, property: 'about'})
        updateData = setValidData({updateData: updateData, data: worth_knowing, property: 'worth_knowing'})
        updateData = setValidData({updateData: updateData, data: additional_notes, property: 'additional_notes'})
        updateData = setValidData({updateData: updateData, data: instagram, property: 'instagram'})

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
  }
}
