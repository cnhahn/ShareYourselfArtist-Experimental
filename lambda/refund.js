'use strict';
const firebase = require('firebase')

/*
  This function gives a refund to all artists who have submitted review-requests that have not been responded
  to within 48 hours. This is done by querying all artists that have not been replied to, have not been refunded
  already, and have not submitted their request using free_credit. 
*/
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
  if (firebase.apps.length == 0){
    firebase.initializeApp(config);
  }

  // variable and references to db
  let db = firebase.firestore()
  let batch = db.batch()
  let artists, reviews
  const currentTime = Date.now()
  const compareTime = currentTime - 1000 //(48 * 60 * 60 * 1000) //1000 ms = 1 second

  function setCredits(arrayOfArtists){
    // Check for artist frequency in arrayOfArtists. The number of times an artist appears 
    // in the array will determine the number of credits to give back to said artist.
    let artistsObj = {};
    for(let i = 0; i < arrayOfArtists.length; i++){
      if(artistsObj[arrayOfArtists[i]] == undefined){
        artistsObj[arrayOfArtists[i]] = 1;
      } else{
        artistsObj[arrayOfArtists[i]]++;
      }
    }
    //console.log(JSON.stringify(artistsObj));

    return db.runTransaction(t => {
      return Promise.all(arrayOfArtists.map(async (element) => {
        let aRef = db.collection('users').doc(element)
        let doc = await t.get(aRef);
        if(doc.data() != undefined){
          let currCredits = doc.data().credits;
          //console.log("current Credit amount: " + currCredits)
          let numRefunds = artistsObj[element]
          let updateCredits = currCredits + numRefunds
          //console.log("numRefunds : " + numRefunds)
          //console.log("updated Credit amount: " + updateCredits)
          await t.update(aRef, { credits: updateCredits });
        }
        //console.log(JSON.stringify(doc.data()))
      }));
    });
  }

  const requestsToRefund = db.collection('review_requests').where('replied', '==', false ).where('refunded', '==', 0).where('submitted_with_free_cerdit', '==', false).get()
    .then(function (querySnapshot){
      const promises = []
      querySnapshot.forEach(function(doc) {
        promises.push(doc)
      })
      return Promise.all(promises)
    })
    .then(function(listOfReviews){
      let listOfReviewsToRefund = []
      let listOfArtistsToRefund = []

      listOfReviews.forEach(function (review){
        if(compareTime > review.data().submitted_on){
          console.log(review.id + ': this request must be refunded')
          listOfReviewsToRefund.push(review.id)
          listOfArtistsToRefund.push(review.data().art.artist_id)
          //artistObjects[review.data().art.artist_id]=1;
        }
      })
      return {
        listOfReviews: listOfReviewsToRefund,
        listOfArtists: listOfArtistsToRefund
      }
    })
    .then(function(object){
      reviews = object.listOfReviews
      artists = object.listOfArtists
     
      for(let i = 0; i < artists.length; i++){
        console.log("This artist needs to be refunded: " + artists[i])
      }
      console.log(reviews.length)
      console.log(artists.length)
      let artistsRef = db.collection('users')
      let reviewRef = db.collection('review_requests')

      return setCredits(artists)
    })
    .then(function(){

      for (var i = 0; i < reviews.length; i++) {
        //console.log('IN FOR LOOP')
        //console.log('artist to update: ' + artists[i])
        //let artistsToUpdate = db.collection('users').doc(artists[i])
        let reviewToUpdate = db.collection('review_requests').doc(reviews[i])

        //batch.update(artistsToUpdate, { free_credits: freeCreditsString })
        batch.update(reviewToUpdate, {refunded: 1})
      }
      //console.log(status)
      return batch.commit()
      // return callback(null, 'Refunds have been made')
    })
    .then(function(){
      callback(null, 'Refunds have been made')
    })
    .catch(function(error){
      callback(error)
    })
};