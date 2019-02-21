'use strict';
const firebase = require('firebase');


exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let config = {
    apiKey: "AIzaSyDB9Jj5Fvm6Q6ee9-CPMSz0MU_1M1jeUS0",
    authDomain: "sya-app.firebaseapp.com",
    databaseURL: "https://sya-app.firebaseio.com",
    projectId: "sya-app",
    storageBucket: "sya-app.appspot.com",
    messagingSenderId: "490982978690"
  }
  if (firebase.apps.length == 0) {
    firebase.initializeApp(config);
  }
  const db = firebase.firestore()
  let batch = db.batch()
  const users = db.collection('users').where('role', '==', 'artist').get()
    .then(function (querySnapshot) {
      const promises = []
      querySnapshot.forEach(function (doc) {
        promises.push(doc)
      })
      return Promise.all(promises) //returning promises sends the resolved results to 
    })                             //to the next .then()
    .then(function (person) {
      let results = []
      person.forEach(function (personSnap) {
        //const data = personSnap.data()
        results.push(personSnap.id)
      })
      return results
    })
    .then(function (ids) {
      console.log("arrays length:" + ids.length)
      for (var i = 0; i < ids.length; i++) {
        //console.log(ids[i])
        let artistsRef = db.collection('users').doc(ids[i])
        batch.update(artistsRef, { free_credits: 2 })
      }
      return batch.commit()
    })
    .then(function (reply) {
      return callback(null, 'All artists updated with 2 free credits')
    })
    .catch(function (error) {
      callback(error)
    })

};
