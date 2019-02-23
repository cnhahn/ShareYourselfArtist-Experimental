'use strict'
const firebase = require('firebase')

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let config = {
    apiKey: "AIzaSyDB9Jj5Fvm6Q6ee9-CPMSz0MU_1M1jeUS0",
    authDomain: "sya-app.firebaseapp.com",
    databaseURL: "https://sya-app.firebaseio.com",
    projectId: "sya-app",
    storageBucket: "sya-app.appspot.com",
    messagingSenderId: "490982978690"
  };
  //params is the data that will specify 
  let params = JSON.parse(event.body);

  //response is the object that we will return to the client
  let response = {
    body = {

    }
  };
  let responseCode = 200;
  if (firebase.apps.length == 0) {
    firebase.initializeApp(config);
  }
  const db = firebase.firestore();

  //Handle event data to make sure the request is passing in the correct type of data
  if(event.body.amount == null  || event.body.amount == undefined){
    response[statusCode] = responseCode
    response[body] = 'Incorrect parameters, please supply amount of submissions to return in body'
  }
  else{
    let amount = event.body.amount;

    // ascending or descending?
    // does amount have to be a string or number?
    let submissions = firebase.firestore().collection('review_request').where("replied", "==", "true").orderBy('replied_date', "asc").limit(amount).get()
      .then(function(querySnapshot){
        let promises = [];
        querySnapshot.forEach(function(doc){
          promises.push(doc)
        })
        return Promise.all(promises)
      })
      .then(function(results){
        // loop through results and place them in the response object under the 'body' object
        for(var i = 0; i < results.length; i++){
          response.body[i] = results[i];
        }
        response[statusCode] = responseCode;
        callback(null, response)
      })
      .catch(function(error){
        callback(error)
      })

  }

}