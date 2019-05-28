/*
If you have any questions regarding the firestore functions
You can reach me @ kagawong@ucsc.edu
~ Karl Wong, Undergrad C.S. UCSC Summer 2018

Update Winter 2019:
contact Kavan Samra, kssamra@ucsc.edu for questions
~ Kavan Samra, Undergrad C.S UCSC Winter-Spring 2019


PRO TIP: If you would like to know where in the codebase these functions are triggered, 
you can searall urls
*/

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
'use strict';



//used for 48 hour refund
const secureCompare = require('secure-compare');
const express = require('express');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//used for resizing image
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const gcs = require("@google-cloud/storage")();

//used for sending emails
const nodemailer = require('nodemailer');

//save for future reference
var DOMAIN = 'www.shareyourselfartists.com';

// For encrypting/decrypting business group codes
const bcrypt = require('bcrypt')
//

exports.updateBusinessesReceivedRequests = functions.https.onRequest((request, response) => {
  /*
  Run once a business receives a new review request. Depending on the categories of the artwork in the request, 
  the businesses 'categories.totalReceived' field is incremented by one
  */
  const db = admin.firestore()
  let businessID = request.body[0]
  let reviewRequestCategories = request.body[1]
  console.log('The businessID is ', businessID)
  console.log('The array of categories is: ', reviewRequestCategories)
  const businessRef = db.collection('users').doc(businessID)

  function getCurrentBusinessStats(businessID){
    return new Promise(async(resolve, reject) => {
      try {
        console.log('businessID = ', businessID)
        let business = await db.collection('users').doc(businessID).get()
        let businessData = business.data()
        let currentCategories = businessData.categories
        
        resolve(currentCategories)
      } catch (error) {
        console.log('There was an error receiving the businesses current data', error)
        reject(error)
      }
    })
  }

  function updateBusinessStats(categories, reviewRequestCategories){
    return new Promise(async (resolve, reject)=>{
      try {
        let batch = db.batch()
        reviewRequestCategories.forEach(category =>{
          console.log("category[",category,"].totalReceieved: ",categories[category].totalReceived)
          let newTotalReceived = categories[category].totalReceived //Assuming that this will increment
          newTotalReceived++
          console.log('New total Recieved: ', newTotalReceived)
          let updater = batch.set(businessRef, {
            categories:{
              [category]:{
                totalReceived: newTotalReceived
              }
            }
          }, {merge: true})
        })
        await batch.commit()
        resolve()
      } catch (error) {
        console.log('error updating the totalReceived', error)
        reject(error)
      }
    })
  }

  async function caller(businessID, reviewRequestCategories){
    try {
      let businessCategories = await getCurrentBusinessStats(businessID)
      let update = await updateBusinessStats(businessCategories, reviewRequestCategories)
      response.status(200).send('Success')
    } catch (error) {
      console.log('ERROR', error)
      response.send(error)
    }
  }
  caller(businessID, reviewRequestCategories);

})

exports.replyToReviewRequest = functions.https.onRequest(async(request, response) => {
  /*
  Called when a business member responds to the review that they had reserved.
  The request should be marked replied, and removed as resevered. Marking the review 
  as 'replied' is done elsewhere, so this function will just mark the 'reserved_by' field
  to "", and then add the reviewID to the business members repliedTo array.
  */

  const db = admin.firestore()
  // let reviewID = 'Some Review ID'
  // let businessAdmin = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  // let businessMember = 'pmzoOIjQYPda4VrIj2GdhdcRdVM2'
  let reviewID = request.body[0]
  let businessAdmin = request.body[1]
  let businessMember = request.body[2]
  console.log('reviewID: ', reviewID)
  console.log('admin: ', admin)
  console.log('businessMember: ', businessMember)

  function updateBusinessMember(businessAdmin, businessMember, reviewID){
    return new Promise(async(resolve, reject) => {
      try {
        let businessData = await db.collection('business_groups').doc(businessAdmin).get()
        let members = businessData.data().members
        console.log('Here is members: ', members)
        let memberToUpdate = members[businessMember]
        console.log('Here is the SPECIFIC MEMBER DATA: ', memberToUpdate)
        let reservedArray = memberToUpdate.reserved
        let repliedArray = memberToUpdate.responded
        console.log('Here is the members current replied array', repliedArray)
        
        repliedArray.push(reviewID)
        console.log('Here is the updated repliedArray', repliedArray)
        let update = await db.collection('business_groups').doc(businessAdmin).set({
          members: {
            [businessMember]: {
              reserved: reservedArray,
              responded: repliedArray
            }
          }
        }, {merge:true})
        resolve()
      } catch (error) {
        console.log('Error, ', error)
        reject(error)
      }

    })
  }
  try {
    await updateBusinessMember(businessAdmin, businessMember, reviewID)
    response.status(200).send('success')
  } catch (error) {
    console.log('there was an error', error)
    response.status(404).send('error')
    
  }

})

exports.legacy_updateBusinessStatistics = functions.https.onRequest((request, response) =>{
  /*
  TODO: 
  The purpose of this function is to take all old review requests and update them with the 'categories' 
  field which tracks what categories the artwork is tagged with. 

  Also get the number of requests received by a business (both in total and per category)
  */
  const db = admin.firestore()
  const batch = db.batch()
  let requestsPerBusiness = {}  //all review requests that have no businessID
  let businesObj = {}
  function initializeBusinessObject(businesses){
    return new Promise(async(resolve,reject) => {
      businesses.forEach(business => {
        businesObj[business.id] = {

        }
      })
    })
  }

  function getBusinesses(){
    return new Promise(async (resolve, reject) => {
      try {
        let promises = []
        let businesses = await db.collection('business_groups').get()
        businesses.forEach(review => {
          promises.push(review)
      })
      console.log('retrieved all Businesses')
      resolve(Promise.all(promises))
      } catch (error) {
        console.log('Error retrieving old reviews', error)
        reject(error)
      }
    })
  }

  function getOldRequests(){
    return new Promise(async (resolve, reject) =>{
      try {
        let promises = []
        let currentReviews = await db.collection('review_requests').get()
        currentReviews.forEach(review => {
          promises.push(review)
      })
      console.log('retrieved all review requests')
      resolve(Promise.all(promises))
      } catch (error) {
        console.log('Error retrieving old reviews', error)
        reject(error)
      }
    })
  }

  function partitionRequests(businesses, reviewRequests){
    return new Promise(async (resolve, reject) =>{

    })
  }

})

exports.getReservedReviews = functions.https.onRequest(async (request, response) => {
  /*
    Given a business members id, pull and return all review requests that they have reserved
  */
  const db = admin.firestore()
  //let userId = 'pmzoOIjQYPda4VrIj2GdhdcRdVM2'
  let userId = request.body[0]
  let business
  //let payload = {}
  // if(request.body[1] !== undefined && request.body[1] !== ''){
  //   business = request.body[1]
  // }
  // else{
  //   console.log('BusinessID was not provided, looking up businessID')
  //   business = await getBusiness(userId)
  //   console.log('BusinessID is ', business)
  // }

  let reviews = db.collection('review_requests').where('reserved_by', '==', userId).where('replied', '==', false).get()
    .then(snapshot =>{
      let promises = []
      snapshot.forEach(review =>{
        promises.push(review)
      })
      return Promise.all(promises)
    })
    .then(reviews => {
      console.log('reviews: ', reviews)
      let payload = {}
      reviews.forEach(review => {
        payload[review.id] = review.data()
        console.log('reviewID', review.id)
        console.log('review: ', review.data())
      })
      JSON.stringify(payload)
      console.log('Here is the requested payload: ',)
      console.log(payload)
      response.status(200).send(payload)
    })
    .catch(error => {
      console.log('There was an error', error)
      response.status(400).send(error)
    })
})

exports.legacy_updateOldReviewRequests = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  const batch = db.batch()
  let badRequests = {}  //all review requests that have no businessID
  // Get the old review requests
  function getOldRequests(){
    return new Promise(async (resolve, reject) =>{
      try {
        let promises = []
        let currentReviews = await db.collection('review_requests').get()
        currentReviews.forEach(review => {
          promises.push(review)
      })
      console.log('retrieved all review requests')
      resolve(Promise.all(promises))
      } catch (error) {
        console.log('Error retrieving old reviews', error)
        reject(error)
      }
    })
  }

  async function anomaly(id){
    let document = await db.collection('review_requests').doc(id).get()
    console.log('-----------THIS DOCUMENT IS CAUSING PROBLEMS. ADDING TO badRequests -------------')
    console.log(document.id)
    console.log(document.data())
    badRequests[document.id] = document.data()
  }

  

  function updateReviewRequests(requests){
    return new Promise(async (resolve, reject) => {
      try {
        requests.forEach(async review => {
          let currentData = review.data()
          console.log("currentData: ", currentData)
          let businessId = currentData.businessId
          console.log('businessID object', businessId)
          let theRealBusinessId = businessId.userId
          console.log('The actual businessID: ', theRealBusinessId)
          let reviewId = review.id
          console.log('The uuid of this request', reviewId)
          // let reviewRef = db.collection('review_requests').doc(reviewId)

          if(Object.entries(businessId).length !== 0 && businessId.constructor === Object){
            console.log('adding ', businessId, ' of review_request ', reviewId, ' to the batch')
            try {
              let documentUpdate = await db.collection('review_requests').doc(reviewId).set({
                //businessAdmin: theRealBusinessId,
                reserved_by: ''
            }, {merge: true})
            
            } catch (error) {
              console.log('error in foreach loop', error)
              reject(error)
            }
          }
          else{
            console.log('----------Old data ---------')
            anomaly(reviewId)
          }
        })
        resolve();
      } catch (error) {
        console.log('THERE WAS AN ERROR', error)
        reject(error);
      }
    })
  }

  async function caller(){
    try {
      let currentReviews = await getOldRequests();
      console.log('Got the old review requests')
      await updateReviewRequests(currentReviews);
      console.log('finished')
      console.log('HERE ARE THE REQUESTS THAT COULD NOT BE UPDATED')
      console.log(badRequests)
      response.status(200).send('It fucking worked')
    } catch (error) {
      response.status(400).send('You have failed at everything')
    }
  }
  caller()
})

exports.legacy_addExistingBusinessesToGroupDB = functions.https.onRequest((request, response) => {
  // Importing old businesses into business_groups collection
  const db = admin.firestore()
  const batch = db.batch()

  function getExistingBusinesses(){
    return new Promise(async (resolve, reject) => {
      try {
        let promises= []
        let businesses = await db.collection('users').where('role', '==', 'business').get()
        businesses.forEach(business => {
          promises.push(business)
        })
        resolve(Promise.all(promises))
      } catch (error) {
        console.log('Error retrieving all businesses')
        console.log(error)
        reject(error)
      }
    })
  }


  function addToBatch(businesses){
    return new Promise(async (resolve, reject) => {
      try {
        businesses.forEach(business => {
          console.log('Current Business: ', business.data())
          console.log('THEIR USERID: ', business.data().userId)
          
          let businessId = business.data().userId
          let businessData = business.data()
          let businessRef = db.collection('business_groups').doc(businessId)

          batch.set(businessRef, {
            business_name: businessData.business_name,
            about: businessData.about,
            additional_notes: businessData.additional_notes,
            email: businessData.email,
            userId: businessData.userId, 
            members: {},
            accessCode: ""
          }, {merge: true})
        })
        resolve()
      } catch (error) {
        console.log('error adding businesses to db', error)
        reject(error)
      }
    })
  }

  async function caller(){
    try {
      let businesses = await getExistingBusinesses()
      console.log('HERE ARE THE BUSINESSES: ', businesses)
      await addToBatch(businesses)
      await batch.commit()
      console.log('finished')
      response.status(200).send('finished')
    } catch (error) {
      console.log('There was an error', error)
      response.status(400).send('There was an error')
    }
  }
  caller()
})

exports.reserveReview = functions.https.onRequest((request, response) => {
  /*
    Given a businessMembers ID, and an array of reviews they would like to reserve, 
    add those reviewID's to the member's review{} and mark the review as reserved in the review_request table

    TODO: mark each request as reserved in the review_requests 
  */
  let userId = request.body[0]
  let business = request.body[1]
  let reviewIds = request.body[2]
  // let userId = '2APlqFjo8ahnayOfMxI7LSnTZEr2'
  // let business = 'BY8KZZD5eMMvaNAOaGuDVqhCTuw1'
  // let reviewIds = ['CV2aOU6oc83NTlSKFexW', 'dRKtNDsms7lVjWrdznh0']
  //let reviewIds = request.body[1] //array of reviewId's
  //let reviewIds = ['PEcAU2Xl5kH85r2QDRJv', 'mBVn7ebaixqUtuWMMzCM', 'xk6HwfJIXqnPikSCPFj7']
  //let business = request.body[2] //business Id
  let db = admin.firestore()
  //let business = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  //let userId = 'pmzoOIjQYPda4VrIj2GdhdcRdVM2'
  // let userId = 'FbQ3AUCY3cVds8z276nkqi2I8Cn1'
  let batch = db.batch()
  let businessRef = db.collection('business_groups').doc(business)
  
  function getCurrentReserved(){
    return new Promise(async (resolve, reject) => {
      let userToUpdate, members, oldReviews, reservedReviews, respondedReviews
      let businessData = await businessRef.get()
      if (businessData.data().members != undefined && Object.entries(businessData.data().members).length > 0){
        members = businessData.data().members
        userToUpdate = members[userId]
        respondedReviews = userToUpdate['responded']
        reservedReviews = userToUpdate['reserved']
        console.log('respondedReviews', respondedReviews)
        console.log('reservedReviews', reservedReviews)
        resolve(reservedReviews)
      }
      else{
        reject(-1)
      }
    })
  }

  function markAsReserved(reserved){
    return new Promise((resolve, reject) =>{
      try {
        reserved.forEach(id => {
          let reviewRef = db.collection('review_requests').doc(id)
          batch.update(reviewRef, {
            reserved_by: userId
          })
        })
        resolve(1)
      } catch (error) {
        reject(error)
      }
      
    })
  }
  function updateReserved(reserved){
    return new Promise(async (resolve, reject) => {
      reviewIds.forEach(id => {
        reserved.push(id)
      })
      try {
        let business = await businessRef.set({
          members: {
            [userId]: {
              reserved: reserved
            }
          }
        }, {merge: true})
        resolve()
      } catch (error) {
        console.log('There was an error', error)
        reject(-2)
      }
    })
  }

  async function caller(){
    try {
      let result = await getCurrentReserved()
      let updateResult = await updateReserved(result)
      await markAsReserved(reviewIds)
      await batch.commit()
      response.status(200).send('success')
    }
    catch(error){
      console.log('There was an error', error)
      response.status(400).send('There was an error in caller')
    }
    
  }
  caller();

  // function addReviewsToMember(reviewIds){
  //   return new Promise(async (resolve, reject) =>{
  //     let batch = db.batch()
  //     reviewIds.forEach(id =>{
  //       batch.set(business,{
  //         members:{

  //         }
  //       }, {merge: true})
  //     })
  //   })
  // }
  
})

exports.getRespondedReviewRequests = functions.https.onRequest(async (request, response) => {
  let business = request.body[0]
  //let business = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  const db = admin.firestore()

  let reviews = db.collection('review_requests').where('businessAdmin', '==', business).where('replied', '==', true).get()
    .then(snapshot =>{
      let promises = []
      snapshot.forEach(review =>{
        promises.push(review)
      })
      return Promise.all(promises)
    })
    .then(reviews => {
      let payload = {}
      reviews.forEach(review => {
        payload[review.id] = review.data()
        console.log('reviewID', review.id)
        console.log('review: ', review.data())
      })
      JSON.stringify(payload)
      console.log('Here is the requested payload: ',)
      console.log(payload)
      response.status(200).send(payload)
    })
    .catch(error => {
      console.log('There was an error', error)
      response.status(400).send(error)
    })
})

exports.getAllBusinessReviewRequests = functions.https.onRequest(async (request, response) => {
  /*
    Given a business ID, retrieve all review requests sent to that business.
  */

  let business = request.body[0]
  // let business = 'BY8KZZD5eMMvaNAOaGuDVqhCTuw1'
  //let business = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  console.log('businessID: ', business)
  const db = admin.firestore()

  let reviews = db.collection('review_requests').where('businessAdmin', '==', business).where('reserved_by', '==', "").where('replied', '==', false).get()
    .then(snapshot =>{
      let promises = []
      snapshot.forEach(review =>{
        promises.push(review)
      })
      return Promise.all(promises)
    })
    .then(reviews => {
      let payload = {}
      reviews.forEach(review => {
        payload[review.id] = review.data()
        console.log('reviewID', review.id)
        console.log('review: ', review.data())
      })
      JSON.stringify(payload)
      console.log('Here is the requested payload: ',)
      console.log(payload)
      response.status(200).send(payload)
    })
    .catch(error => {
      console.log('There was an error', error)
      response.status(400).send(error)
    })
})

exports.modifyReviewRequestCollection = functions.https.onRequest((request, response) => {
  // TODO:
  //pull the entire reviewRequest collection, grab businessId object and create a new field
  // called businessAdmin: 
  const db = admin.firestore()
  function getReviewCollection(){
    return new Promise(async (resolve, reject) =>{
      try {
        let obj = {}
        let table = await db.collection('review_requests').get()
        table.forEach(doc => {
          obj[doc.id] = doc.data()
        })
        resolve(obj)
      } catch (error) {
        console.log('There was an error getting the collection', error)
        reject(error)
      }       
    })
  }

  async function caller(){
    try {
      
      let data = await getReviewCollection()
      console.log("Here is the data")
      console.log(data)
      response.
      response.send(data)
    } catch (error) {
      console.log('Error2', error )
      response.send('Error')
    }
  }
  caller();
})

exports.getBusinessGroup = functions.https.onRequest((request, response) => {
  let businessID
  let userID = request.body[0]
  //let userID = 'pmzoOIjQYPda4VrIj2GdhdcRdVM2'

  //let businessID = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  const db = admin.firestore()
  async function getGroup(){
    try {
      let user = await db.collection('users').doc(userID).get()
      businessID = user.data().business_group
      let group = await db.collection('business_groups').doc(businessID).get()
      console.log('Here is the groups data', group.data())
      // might need to convert to JSON before sending the data back to the client
      response.send(group.data())
    } catch (error) {
      console.log('Unable to return groups information', error)
      response.status(401).send('Unable to return the groups information')
    }
  }
  getGroup();

})


exports.createNewBusiness = functions.https.onRequest((request, response) => {
  /*
    Called when a new business group is created.
    1) Create user in Auth() if they have not already been created, clarify with Yas
    2) Add the business in the db
    3) Hash the businesses verification code and store that in the db.
  */

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  const saltRounds = 10;
  // let name = request.body[0] // refers to users actual name
  // let email = request.body[1] // refers to email
  // let business = request.body[2]  // refers to business name
  // let admin = request.body[3]  // refer to userID of admin
  // let password = request.body[4] //refers to the password the admin supplied when attempting to create account

  let name = "someName"
  let email = 'hello@gmail.com'
  let business = 'Google'
  let administrator = name
  let password = '123456'

  let code = makeid(8)
  const db = admin.firestore()
  const auth = admin.auth()
  
  let userID
  // bcrypt.hash(password, saltRounds, function(err, hash){
    
  // })
  

  function addToUserPool(){
    return new Promise(async (resolve, reject) => {
      try {
        // Might not need to worry about creating the user if Yas does this already 
        let user = await auth.createUser({
          email: email,
          displayName: name,
          password: password
        })
        userID = user.uid
        console.log("User added to user pool")
        console.log("Now adding custom claims...")
        // setting custom claims must be done whether or not Yas initially creates the account
        await auth.setCustomUserClaims(user.uid,{admin: true})
        console.log('Claims added!')
        let finishedUser = await auth.getUser(user.uid)
        console.log("Finished adding userdata to userpool")
        resolve(finishedUser);
      } catch (error) {
        console.log('There was an error creating the user. It is likely they already exist')
        reject(error);
      }
    })
  }

  function addToGroupDB(userData){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.collection('business_groups').doc(userID).set({
          email: userData.email,
          business: business,
          admin: name,
          members: {},
          accessCode: code
        })
        console.log("User added to database!")
        console.log(user)
        resolve(user);
      } catch (error) {
        console.log("There was an error adding the user to the db!")
        reject(error)
      }
    })
  }
  // function addToUserDB(){
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let user = await db.collection('user').doc(userID).set({
  //         name: name,
  //         email: userData.email,
  //         members: {},
  //         accessCode: code
  //       })
  //       console.log("User added to database!")
  //       console.log(user)
  //       resolve(user);
  //     } catch (error) {
        
  //     }
  //   })
  // }

  async function makeUser(){
    try {
      let newUser = await addToUserPool()
      console.log('User Data After Account Creation: ', newUser)
      let user = await addToGroupDB(newUser)
      response.send('User created')
    } catch (error) {
      console.log('User not created?')
      console.log(error)
      response.send('User not created?')
    }
  }
  makeUser();
})

exports.signUpGroupMember = functions.https.onRequest((req, res) => {
  // let name = 'KS2'
  // let email = 'grouptester7@gmail.com'
  // let business = '8ZpDyQGFCyfczXwh7rBDyLxRvvZ2'
  // let password = 'password'
  
  let name = req.body[0]
  let email = req.body[1]
  let password = req.body[2]
  let code = req.body[3]
  let business = req.body[4]

  const db = admin.firestore()
  // In the future use bcrypt.
  let userID
  
  /*
      1) Get verification code
      2) Check if the verification code matches the inputted one
      3) Create business account and put in business group collection
      4) Create user in user collection
  */

  function getVerificationCode(){
    return new Promise(async (resolve, reject) => {
      try {
        const businessRef = await db.collection('business_groups').doc(business).get()
        //let businessData = businessRef.data()
        console.log(businessRef)
        console.log(businessRef.data())
        let accessCode = businessRef.data().accessCode
        resolve(accessCode)
        
      } catch (error) {
        console.log("There was an error in retrieving the access code in the db", error)
        reject(error)
      }

    })
  }
  
  function addToUserPool(){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await admin.auth().createUser({
          email: email,
          emailVerified: false,
          password: password,
          displayName: name
        })
        userID = user.uid
        await admin.auth().setCustomUserClaims(userID, {admin: false})
        console.log('User created and claims added')
        resolve(user)
      } catch (error){
        console.log("There was an error in adding the user to the user pool", error)
        reject(error)
      }
    })
  }
  
  function addToGroupDB(){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.collection('business_groups').doc(business).set({
          members: {
            [userID]: {
              email: email,
              name: name,
              reserved: [],
              responded: []
            }
          }
        }, {merge: true})
        console.log("User added to business group collection!")
        console.log(user)
        resolve();
      } catch (error) {
        console.log("There was an error adding the user to the db!")
        reject(error)
      }
    })
  }

  function addToUserDB(){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.collection('users').doc(userID).set({
          name: name,
          business_group: business, // admin uid
          email: email,
          role: 'business_member',
          userId: userID          
        })
        resolve()
      } catch (error) {
        console.log("There was an error adding the user to the db!")
        reject(error)
      }
    })
  }

  async function createUser(){
    try {
      let accessCode = await getVerificationCode()
      if(code !== '' && accessCode === code){
        let user = await addToUserPool()
        console.log('User created. Here is there data: ', user)
        await addToGroupDB()
        console.log('User added to group database')
        await addToUserDB()
        console.log("User added to the user collection of database")
        res.status(200).send('User successfully created and added to both collections.')
      }
      else{
        res.status(401).send("Verification code did not match, please try again.")
      }
    
    } catch (error) {
      console.log("There was an error signing up the business group member into the database.")
      res.status(401).send("There was an error signing up the business group member into the database.")
    }
  }
  createUser();

})

exports.topCategories = functions.https.onRequest((req, res) => {
  const db = admin.firestore()
  let search_users = db.collection('users').where('role', '==', 'artist').get()
    .then(function (users) {
      let categories = ['abstract', 'blackandwhite', 'threeD', 'design', 'drawing', 'multimedia', 'painting', 'portrait', 'psychedelic', 'realism', 'sculpting']
      let abstract = [], blackandwhite = [], threeD = [], design = [], drawing = [], multimedia = [], painting = [], portrait = [], psychedelic = [], realism = [], sculpting = [];

      users.forEach(function (doc) {
        // console.log('in for each ')
        if (doc.data().categories != undefined) {
          abstract.push({ count: doc.data().categories[categories[0]].responded, value: doc.id, full_data: doc.data() })
          blackandwhite.push({ count: doc.data().categories[categories[1]].responded, value: doc.id, full_data: doc.data() })
          threeD.push({ count: doc.data().categories[categories[2]].responded, value: doc.id, full_data: doc.data() })
          design.push({ count: doc.data().categories[categories[3]].responded, value: doc.id, full_data: doc.data() })
          drawing.push({ count: doc.data().categories[categories[4]].responded, value: doc.id, full_data: doc.data() })
          multimedia.push({ count: doc.data().categories[categories[5]].responded, value: doc.id, full_data: doc.data() })
          painting.push({ count: doc.data().categories[categories[6]].responded, value: doc.id, full_data: doc.data() })
          portrait.push({ count: doc.data().categories[categories[7]].responded, value: doc.id, full_data: doc.data() })
          psychedelic.push({ count: doc.data().categories[categories[8]].responded, value: doc.id, full_data: doc.data() })
          realism.push({ count: doc.data().categories[categories[9]].responded, value: doc.id, full_data: doc.data() })
          sculpting.push({ count: doc.data().categories[categories[10]].responded, value: doc.id, full_data: doc.data() })

        }
        // console.log('finishing one instance of for each')
      })
      
      // console.log(sculpting)

      abstract.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      blackandwhite.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      threeD.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      design.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      drawing.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      multimedia.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      painting.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      portrait.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      psychedelic.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      realism.sort(function (a, b) {
        return a["count"] - b["count"]
      })
      sculpting.sort(function (a, b) {
        return a["count"] - b["count"]
      })

      // Now we want to store the results into firebase. 
      

      //res.send('done?')
      // let top_ten_users = []
      // // Now that we have all users, we will get the top 10 for this category
      // for (var tenUsers = 0; tenUsers < 10; tenUsers++) {
      //   //Now push into the top 10 category array
      //   top_ten_users.push(top_users[top_users.length - 1 - tenUsers])

      // }
      // console.log(' top ten users are ', top_ten_users)

      // commit('set_top_ten_category', top_ten_users)
      let object = {
        abstract : abstract.slice(abstract.length-10, abstract.length),
        blackandwhite : blackandwhite.slice(blackandwhite.length-10, blackandwhite.length),
        threeD: threeD.slice(threeD.length-10, threeD.length),
        design: design.slice(design.length-10, design.length),
        drawing: drawing.slice(drawing.length-10, drawing.length),
        multimedia: multimedia.slice(multimedia.length-10, multimedia.length), 
        painting : painting.slice(painting.length-10, painting.length),
        portrait : portrait.slice(portrait.length-10, portrait.length),
        psychedelic : psychedelic.slice(psychedelic.length-10, psychedelic.length),
        realism : realism.slice(realism.length-10, realism.length),
        sculpting : sculpting.slice(sculpting.length-10, sculpting.length)
      }
      //  console.log('object here is: ', object)
      return object
    })
    .then( categoryList =>{
      const db = admin.firestore()
      //
      console.log('in the next .then()')
      for(let key in categoryList){
        var catRef = db.collection('most_popular_artist').doc(key);
        var currentCategory = categoryList[key]
        console.log('Current sculpting category is ' , currentCategory)
        //let userID = currentCategory.value
        var setWithOptions = catRef.set({
          user1 : {
            count : currentCategory[9].count,
            userID : currentCategory[9].value,
            userData : currentCategory[9].full_data 
          },
          user2 : {
            count : currentCategory[8].count,
            userID : currentCategory[8].value,
            userData : currentCategory[8].full_data 
          },
          user3 : {
            count : currentCategory[7].count,
            userID : currentCategory[7].value,
            userData : currentCategory[7].full_data 
          },
          user4 : {
            count : currentCategory[6].count,
            userID : currentCategory[6].value,
            userData : currentCategory[6].full_data 
          } ,
          user5 : {
            count : currentCategory[5].count,
            userID : currentCategory[5].value,
            userData : currentCategory[5].full_data 
          } ,
          user6 : {
            count : currentCategory[4].count,
            userID : currentCategory[4].value,
            userData : currentCategory[4].full_data 
          } ,
          user7 : {
            count : currentCategory[3].count,
            userID : currentCategory[3].value,
            userData : currentCategory[3].full_data 
          } ,
          user8 : {
            count : currentCategory[2].count,
            userID : currentCategory[2].value,
            userData : currentCategory[2].full_data 
          },
          user9 : {
            count : currentCategory[1].count,
            userID : currentCategory[1].value,
            userData : currentCategory[1].full_data 
          },
          userten : {
            count : currentCategory[0].count,
            userID : currentCategory[0].value,
            userData : currentCategory[0].full_data 
          }
        })
      }

      res.send('finished');

    })
    .catch(error => {
      res.send(error)
    })
})


exports.updateUserCategories = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let batch = db.batch()

  //  function updateFields (ID, list){
  //   console.log('Now in updateFields')
  //   let artistID = ID
  //   let aRef = db.collection('users').doc(artistID)
  //   console.log("About to start run Transaction")
  //    return db.runTransaction(async t => {
  //     //let aRef = db.collection('users').doc(element)

  //     let doc = await t.get(aRef)        
  //     if(doc.data() != undefined){
  //       // console.log('doc.data is ' , doc.data().categories.drawing.count)
  //       // console.log("drawing's count is typeOF: " + typeof doc.data().categories.drawing.count)
  //       // console.log('list array ' , list)
  //       // console.log('list is typeof: ' + typeof list[0])

  //       // let drawing = doc.data().categories.drawing.count + list[0];
  //       // let painting = doc.data().categories.painting.count + list[1]
  //       // let sculpting = doc.data().categories.sculpting.count + list[2]
  //       // let design = doc.data().categories.design.count + list[3]
  //       // let threeD = doc.data().categories.threeD.count + list[4];
  //       // let multimedia = doc.data().categories.multimedia.count + list[5];
  //       // let blackandwhite = doc.data().categories.blackandwhite.count + list[6]
  //       // let psychedelic = doc.data().categories.psychedelic.count + list[7]
  //       // let portrait = doc.data().categories.portrait.count + list[8]
  //       // let realism = doc.data().categories.realism.count + list[9]
  //       // let abstract = doc.data().categories.abstract.count + list[10]

  //       // console.log('drawing count: ', drawing + 'threeD count: ', threeD)
        
  //       //console.log("numRefunds : " + numRefunds)
  //       //console.log("updated Credit amount: " + updateCredits)
  //       await t.update(aRef, 
  //         { 
  //           categories: {
  //             drawing : {
  //               count : 0,
  //               responded : 0
  //             },
  //             painting : {
  //               count : 0,
  //               responded : 0
  //             },
  //             sculpting:{
  //               count : 0,
  //               responded : 0
  //             },
  //             design:{
  //               count : 0,
  //               responded : 0              
  //             },
  //             threeD : {
  //               count : 0,
  //               responded : 0
  //             },
  //             multimedia : {
  //               count : 0,
  //               responded : 0
  //             },
  //             blackandwhite:{
  //               count : 0,
  //               responded : 0
  //             },
  //             psychedelic:{
  //               count : 0,
  //               responded : 0
  //             },
  //             portrait:{
  //               count : 0,
  //               responded : 0
  //             },
  //             realism: {
  //               count : 0,
  //               responded : 0
  //             },
  //             abstract: {
  //               count : 0,
  //               responded : 0
  //             }  
  //         } 
  //         });
  //     }
  //     //console.log(JSON.stringify(doc.data()))
  //   });
  // }

  let totalNumberOfUsers
  const categories = db.collection('users').doc('XpIQwNnOayXqjdlbh6jDDL5xaaz2').get()
    .then(function (querySnapshot) {
      const promises = []
      querySnapshot.forEach(function (doc) {
        // console.log('artist ID: ', doc.data().artist_id, ' categories: ', doc.data().categories)
        //response.send('artist ID: ', doc.data().artist_id, ' categories: ', doc.data().categories)
        totalNumberOfUsers = querySnapshot.size
        //console.log('total number of users is ', totalNumberOfUsers)
        promises.push(doc)
      })
      return Promise.all(promises)
    })
    .then(function(artists){

    let artCategories = {
      'drawing' : 0, 
      'painting' : 1, 
      'sculpting' : 2, 
      'design' : 3, 
      '3D' : 4, 
      'multimedia' : 5, 
      'black&white': 6, 
      'psychedelic': 7, 
      'portrait' : 8, 
      'realism': 9,
      'abstract': 10
    }
    let artistID = db.collection('users').doc(artists[0].data().userId)
    batch.update(artistID, {
      categories: {
          drawing : {
            count : 0,
            responded : 0
          },
          painting : {
            count : 0,
            responded : 0
          },
          sculpting:{
            count : 0,
            responded : 0
          },
          design:{
            count : 0,
            responded : 0
          },
          threeD : {
            count : 0,
            responded : 0
          },
          multimedia : {
            count : 0,
            responded : 0
          },
          blackandwhite :{
            count : 0,
            responded : 0
          },
          psychedelic:{
            count : 0,
            responded : 0
          },
          portrait:{
            count : 0,
            responded : 0
          },
          realism: {
            count : 0,
            responded : 0
          },
          abstract: {
            count : 0,
            responded : 0
          }  
      }
    })
    return batch.commit()

      //console.log(artCategories['drawing'])
      // for(var i = 0; i < artists.length; i++){
      //   console.log('artist ID: ', artists[i].data().artist_id, ' categories: ', artists[i].data().categories)
      //   // categories [ drawing, painting, ]
      //   // loop through this array, check 
      //   /*The order of the array will be:
      //   */ 
      //   // [1,  0 , 0 ,0 , 1 , 0 , 0 ]
      //   let category_list = artists[i].data().categories
      //   let category_count = new Array(11).fill(0);

      //   for(var j = 0 ; j <category_list.length; j++){
      //     // Makes sure that the category we are looking at is one of the 11 possible categories.
      //     let indexCat = artCategories[category_list[j]]
      //     if(indexCat >= 0 && indexCat <= 10){
      //       // console.log('category is ', category_list[j] , ' index is ', artCategories[category_list[j]]);
      //       category_count[indexCat]++
      //     }
      //   }
      // console.log('artists array is ', artists[i].data())

      //   console.log('category array is ', category_count)
        // let artistID = db.collection('users').doc(artists[i].data().userId)
        // let artistID = artists[i].data().artist_id
        // updateFields(artistID, category_count)
        // db.runTransaction(t => {
        //     //let aRef = db.collection('users').doc(element)
        //     let tD = '3D'
        //     let blackandwhite = 'black&white'
        //     let doc = await t.get(artistID)        
        //     if(doc.data() != undefined){
        //       let drawing = doc.data().drawing.count + category_list[0]
        //       let painting = doc.data().painting.count + category_list[1]
        //       let sculpting = doc.data().sculpting.count + category_list[2]
        //       let design = doc.data().design.count + category_list[3]
        //       let threeD = doc.data().tD.count + category_list[4];
        //       let multimedia = doc.data().multimedia.count + category_list[5];
        //       let blackandwhite = doc.data().blackandwhite.count + category_list[6]
        //       let psychedelic = doc.data().psychedelic.count + category_list[7]
        //       let portrait = doc.data().portrait.count + category_list[8]
        //       //console.log("current Credit amount: " + currCredits)
        //       let realism = doc.data().realism.count + category_list[9]
        //       let abstract = doc.data().abstract.count + category_list[10]

        //       //console.log("numRefunds : " + numRefunds)
        //       //console.log("updated Credit amount: " + updateCredits)
        //       await t.update(artistID, 
        //         { 
        //           categories: {
        //             drawing : {
        //               count : drawing,
        //               responded : 0
        //             },
        //             painting : {
        //               count : painting,
        //               responded : 0
        //             },
        //             sculpting:{
        //               count : sculpting,
        //               responded : 0
        //             },
        //             design:{
        //               count : design,
        //               responded : 0              
        //             },
        //             '3D' : {
        //               count : threeD,
        //               responded : 0
        //             },
        //             multimedia : {
        //               count : multimedia,
        //               responded : 0
        //             },
        //             'black&white':{
        //               count : blackandwhite,
        //               responded : 0
        //             },
        //             psychedelic:{
        //               count : psychedelic,
        //               responded : 0
        //             },
        //             portrait:{
        //               count : portrait,
        //               responded : 0
        //             },
        //             realism: {
        //               count : realism,
        //               responded : 0
        //             },
        //             abstract: {
        //               count : abstract,
        //               responded : 0
        //             }  
        //         } 
        //         });
        //     }
        //     //console.log(JSON.stringify(doc.data()))
        //   });
        // console.log('artist is ', artistID.name)
        // batch.update(artistID, {
        //   categories: {
        //       drawing : {
        //         count : 0,
        //         responded : 0
        //       },
        //       painting : {
        //         count : 0,
        //         responded : 0
        //       },
        //       sculpting:{
        //         count : 0,
        //         responded : 0
        //       },
        //       design:{
        //         count : 0,
        //         responded : 0
        //       },
        //       threeD : {
        //         count : 0,
        //         responded : 0
        //       },
        //       multimedia : {
        //         count : 0,
        //         responded : 0
        //       },
        //       blackandwhite :{
        //         count : 0,
        //         responded : 0
        //       },
        //       psychedelic:{
        //         count : 0,
        //         responded : 0
        //       },
        //       portrait:{
        //         count : 0,
        //         responded : 0
        //       },
        //       realism: {
        //         count : 0,
        //         responded : 0
        //       },
        //       abstract: {
        //         count : 0,
        //         responded : 0
        //       }  
        //   }
        // })
      //return 'message'
    })
    .then(function(){
      response.send('All categories initialized to default values')
    })
    .catch(function (error) {
      console.log(error)
      response.send(error)
    })
})

exports.giveCategories = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let person = db.collection('users').doc('adFbVlF6wRQTpxkobCFQoHAzZsB3')

  let transaction = db.runTransaction(t => {
    return t.get(person)
      .then(doc => {
        // Add one person to the city population
        let categoryObj = {
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
        t.update(person, { categories: categoryObj });
      });
  }).then(result => {
    console.log('Transaction success!');
    response.send('Transaction success')
  }).catch(err => {
    console.log('Transaction failure:', err);
    response.send(err)
  });
})

exports.recommendArtwork = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let userId = request.body.userId;
  let mostPopularCategory;
  const getCurrentUser = db.collection('users').doc(userId).get()
    .then()

})

/*
giveBusinessCategories:
A function meant to RUN ONCE in order to update a specific business in the 
'user' collection so that they have these new entries. All new businesses should either have these 
fields by default when creating their account, or the fields will be created when they receive/respond (to) a review-request.

Use this to reset a business back to default. Please only use this for very special debugging cases such as resetting a 
admin test business account. There should be no real reason to reset an actual customer
*/
exports.resetBusinessCategories = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let person = db.collection('users').doc('yekGAvzU5fZKh49e6w0tJuRmFFg1')

  let transaction = db.runTransaction(t => {
    return t.get(person)
      .then(doc => {
        let categoryObj = {
          drawing : {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0                  
          },
          painting : {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          sculpting:{
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          design:{
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          threeD : {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          multimedia : {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          blackandwhite :{
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          psychedelic:{
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          portrait:{
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          realism: {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          },
          abstract: {
            totalReceived : 0,
            numberAccepted : 0,
            numberResponded : 0   
          }
        }
        t.update(person, { categories: categoryObj });
      });
  }).then(result => {
    
    console.log('Transaction success!');
    response.send('Transaction Success')
  }).catch(err => {
    console.log('Transaction failure:', err);
    response.send('error', error)
  });
})

exports.giveAllBusinessesCategories = functions.https.onRequest((request, response) => {
  let batch = admin.firestore().batch()
  let db = admin.firestore()
  let categoryObj = {
    drawing : {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0                  
    },
    painting : {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    sculpting:{
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    design:{
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    threeD : {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    multimedia : {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    blackandwhite :{
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    psychedelic:{
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    portrait:{
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    realism: {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    },
    abstract: {
      totalReceived : 0,
      numberAccepted : 0,
      numberResponded : 0   
    }
  }
  
  let users = db.collection('users').where('role', '==', 'business').get()
    .then(snapshot => {
      let promises = []
      snapshot.forEach(doc =>{
        promises.push(doc)
        console.log('current snapshot: ', snapshot)
      })
      return Promise.all(promises)
    })
    .then(businesses => {
      console.log('LIST OF PROMISES:')
      console.log(businesses)
      businesses.forEach(business=>{
        let ID = business.data().userId
        console.log('Current business to update: ', ID)
        let bRef = db.collection('users').doc(ID)
        batch.set(bRef, {categories: categoryObj}, {merge: true})
      })
      return batch.commit()
    })
    .then(r => {
      response.send('All businesses updated')
    })
    .catch(error =>{
      response.send(error)
    })

})
// This function is triggerred when an artist uploads artwork to their dashboard. We track 
// which category of artwork the artist chose so that we can recommend them artists/artwork according to
// their most popular categorie(s)
exports.updateArtistCategoryCount = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let userId = request.body[1];
  console.log(userId)
  let batch = db.batch()
  let categoriesToUpdate = request.body[0];
  console.log(categoriesToUpdate)
  // XpIQwNnOayXqjdlbh6jDDL5xaaz2
  const currentUser = db.collection('users').doc(userId).get()
    .then(user => {
      let person = db.collection('users').doc(userId)
      let currentCategories = user.data().categories
      //console.log('type of currentCategories: ' + typeof currentCategories)
      console.log(JSON.stringify(currentCategories))

      for (let i = 0; i < categoriesToUpdate.length; i++) {
        console.log('currentCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
        currentCategories[categoriesToUpdate[i]].count++
        console.log('updatedCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)

        switch (categoriesToUpdate[i]) {
          case 'painting':
            console.log('matched with painting')
            batch.set(person, {
              categories: {
                painting: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.painting.responded
                }
              }
            }, { merge: true })
            break;
          case 'threeD':
            console.log('matched with threeD')
            batch.set(person, {
              categories: {
                threeD: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.threeD.responded
                }
              }
            }, { merge: true })
            break;
          case 'drawing':
            console.log('matched with drawing')
            batch.set(person, {
              categories: {
                drawing: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.drawing.responded
                }
              }
            }, { merge: true })
            break;
          case 'sculpting':
            console.log('matched with sculpting')
            batch.set(person, {
              categories: {
                sculpting: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.sculpting.responded
                }
              }
            }, { merge: true })
            break;
          case 'design':
            console.log('matched with design')
            batch.set(person, {
              categories: {
                design: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.design.responded
                }
              }
            }, { merge: true })
            break;
          case 'multimedia':
            console.log('matched with multimedia')
            batch.set(person, {
              categories: {
                multimedia: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.multimedia.responded
                }
              }
            }, { merge: true })
            break;
          case 'blackandwhite':
            console.log('matched with blackandwhite')
            batch.set(person, {
              categories: {
                blackandwhite: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.blackandwhite.responded
                }
              }
            }, { merge: true })
            break;
          case 'psychedelic':
            console.log('matched with psychedelic')
            batch.set(person, {
              categories: {
                psychedelic: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.psychedelic.responded
                }
              }
            }, { merge: true })
            break;
          case 'portrait':
            console.log('matched with portrait')
            batch.set(person, {
              categories: {
                portrait: {
                  count: currentCategories[categoriesToUpdate[i]].count++,
                  responded: user.data().categories.portrait.responded
                  }
                }
              }, {merge:true})
              break;
            case 'realism':
              console.log('matched with realism')
              batch.set(person, {
                categories: {
                  realism: {
                    count: currentCategories[categoriesToUpdate[i]].count++,
                    responded: user.data().categories.realism.responded
                  }
                }
              }, {merge:true})
              break;
            case 'abstract':
              console.log('matched with abstract')
              batch.set(person, {
                categories: {
                  abstract: {
                    count: currentCategories[categoriesToUpdate[i]].count++,
                    responded: user.data().categories.abstract.responded
                  }
                }
              }, {merge:true})
              break;

            default:
              console.log('no cases matched')
          }
        }
        return batch.commit()
        //return response.send("These categories were updated ", JSON.stringify(currentCategories))
      })
    .then(function () {
        console.log('artist updated')
        response.send('artist updated')
      })
      .catch(error => {
        response.send(error)
      })
})

// Triggered when a business responds to an artist and hits 'accept'. We track both an artists acceptance
// rate and the amount of times the business has replied.
exports.updateAcceptedStats = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  const batch = db.batch()
  const artistToUpdate = request.body[2];
  const businessToUpdate = request.body[1];
  const categoriesToUpdate = request.body[0];
  const radios = request.body[3];  // accepted or declined radios
  let accepted = false;
  console.log("Accepted status", radios);
  if(radios === 'accepted' || radios === 'Accepted'){
    accepted = true;
  }
  else{
    accepted = false;
  }
  console.log("Radios is typeOF", typeof(radios));

  //which collection should this go to?
  const artistRef = db.collection('users').doc(artistToUpdate);
  const businessRef = db.collection('users').doc(businessToUpdate);

  console.log('Artist to update is ', artistToUpdate)
  console.log('Business to update is', businessToUpdate)
  // If the business hit 'accept' when sending their response, we update both artist and business values.
  // If the business hit 'decline' we only update the businesses values.

  if(accepted){
    const currentArtist = db.collection('users').doc(artistToUpdate).get()
      .then(user => {
        let person = db.collection('users').doc(artistToUpdate)
        let currentCategories = user.data().categories
        console.log('type of currentCategories: ' + typeof currentCategories)
        console.log('currentCategories\n', currentCategories)
        console.log(JSON.stringify(currentCategories))

        for (let i = 0; i < categoriesToUpdate.length; i++) {
          //console.log('currentCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          console.log('current value of responded ', currentCategories[categoriesToUpdate[i]].responded)
          currentCategories[categoriesToUpdate[i]].responded++
          //console.log('updatedCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          switch (categoriesToUpdate[i]) {
            case 'painting':
              console.log('matched with painting')
              //console.log('current value of responded ', currentCategories[categoriesToUpdate[i]].responded)
              console.log('current count of paintings: ', user.data().categories.painting.count)
              console.log('current totalSubmitted: ', user.data().categories.painting.totalSubmitted)
              batch.set(artistRef, {
                categories: {
                  painting: {
                    count: user.data().categories.painting.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.painting.totalSubmitted
                  }
                }
              }, { merge: true })
              //console.log('updated value of responded should be ', currentCategories[categoriesToUpdate[i]].responded++)
              break;
            case 'threeD':
              console.log('matched with threeD')
              batch.set(artistRef, {
                categories: {
                  threeD: {
                    count: user.data().categories.threeD.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.threeD.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'drawing':
              console.log('matched with drawing')
              batch.set(artistRef, {
                categories: {
                  drawing: {
                    count: user.data().categories.drawing.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.drawing.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'sculpting':
              console.log('matched with sculpting')
              batch.set(artistRef, {
                categories: {
                  sculpting: {
                    count: user.data().categories.sculpting.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.sculpting.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'design':
              console.log('matched with design')
              batch.set(artistRef, {
                categories: {
                  design: {
                    count: user.data().categories.design.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.design.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'multimedia':
              console.log('matched with multimedia')
              batch.set(artistRef, {
                categories: {
                  multimedia: {
                    count: user.data().categories.multimedia.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.multimedia.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'blackandwhite':
              console.log('matched with blackandwhite')
              batch.set(artistRef, {
                categories: {
                  blackandwhite: {
                    count: user.data().categories.blackandwhite.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.blackandwhite.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'psychedelic':
              console.log('matched with psychedelic')
              batch.set(artistRef, {
                categories: {
                  psychedelic: {
                    count: user.data().categories.psychedelic.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.psychedelic.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'portrait':
              console.log('matched with portrait')
              batch.set(artistRef, {
                categories: {
                  portrait: {
                    count: user.data().categories.portrait.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.portrait.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'realism':
              console.log('matched with realism')
              batch.set(artistRef, {
                categories: {
                  realism: {
                    count: user.data().categories.realism.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.realism.totalSubmitted
                  }
                }
              }, { merge: true })
              break;
            case 'abstract':
              console.log('matched with abstract')
              batch.set(artistRef, {
                categories: {
                  abstract: {
                    count: user.data().categories.abstract.count,
                    responded: currentCategories[categoriesToUpdate[i]].responded,
                    //totalSubmitted: user.data().categories.abstract.totalSubmitted
                  }
                }
              }, { merge: true })
              break;

            default:
              console.log('no cases matched')
          }
        }
        return batch.commit()
      })
      .then(function () {
        // now update the business
        let transaction = db.runTransaction(t => {
          return t.get(businessRef)
            .then(doc => {
              console.log("Now entering the artist + business transaction")
              if (doc.data() != undefined && doc.data().categories != undefined) {
                let currCategories = doc.data().categories;  // the state of the users current categories before modification
                console.log("Business to update: ", businessToUpdate);
                console.log("Type of currCategories is", typeof(currCategories));
                console.log("currCategories is \n",currCategories)
                console.log("categories to update: \n", categoriesToUpdate )
                for (var cat in categoriesToUpdate) {
                  console.log('cat is ', categoriesToUpdate[cat])
                  console.log("cat is typeOf", typeof(cat));
                  console.log("currCategories[cat] is:", currCategories[cat] )    //this is undefined, incorrect access
                  currCategories[categoriesToUpdate[cat]].numberAccepted++;
                  currCategories[categoriesToUpdate[cat]].numberResponded++;
                }
                t.update(businessRef, { categories: currCategories });
              }
            });
        })
        .then(() => {
          response.send('Updates complete')
        })
        .catch((error) =>{
          console.log(error)
          console.log("There was an error updating the business")
          response.send(error)
        })
      })
      .catch(error => {
        console.log('error updating artist', error)
        const status = 0
        response.send(error)
        //reject();
        //response.send(error)
      })
  }
  //The business did not hit 'accept', so we only update the businesses values.
  else{
    let transaction = db.runTransaction(t => {
      return t.get(businessRef)
        .then(doc => {
          if (doc.data() != undefined && doc.data().categories != undefined) {
            let currCategories = doc.data().categories;  // the state of the users current categories before modification
            for (var cat in categoriesToUpdate) {
              console.log('cat is ', categoriesToUpdate[cat])
              console.log("cat is typeOf", typeof(cat));
              console.log("currCategories[cat] is:", currCategories[cat] )    //this is undefined, incorrect access
              currCategories[categoriesToUpdate[cat]].numberAccepted++;
              currCategories[categoriesToUpdate[cat]].numberResponded++;
            }
            t.update(businessRef, { categories: currCategories });
          }
        });
    })
    .then(result => {
      response.send("Artist and Business Transaction success")
    })
    .catch(err =>{
      response.send(err);
    })
  }
})

// runs once per day. Updates the topBusinesses collection which keeps track of each business in the 
exports.businessTopCategories = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let search_users = db.collection('users').where('role', '==', 'business').get()
    .then(function (users) {
      let categories = ['abstract', 'blackandwhite', 'threeD', 'design', 'drawing', 'multimedia', 'painting', 'portrait', 'psychedelic', 'realism', 'sculpting']
      let abstract = [], blackandwhite = [], threeD = [], design = [], drawing = [], multimedia = [], painting = [], portrait = [], psychedelic = [], realism = [], sculpting = [];

      users.forEach(function (doc) {
        // console.log('in for each ')
        if (doc.data().categories != undefined) {
          abstract.push({ numberResponded: doc.data().categories[categories[0]].numberResponded, value: doc.id, full_data: doc.data() })
          blackandwhite.push({ numberResponded: doc.data().categories[categories[1]].numberResponded, value: doc.id, full_data: doc.data() })
          threeD.push({ numberResponded: doc.data().categories[categories[2]].numberResponded, value: doc.id, full_data: doc.data() })
          design.push({ numberResponded: doc.data().categories[categories[3]].numberResponded, value: doc.id, full_data: doc.data() })
          drawing.push({ numberResponded: doc.data().categories[categories[4]].numberResponded, value: doc.id, full_data: doc.data() })
          multimedia.push({ numberResponded: doc.data().categories[categories[5]].numberResponded, value: doc.id, full_data: doc.data() })
          painting.push({ numberResponded: doc.data().categories[categories[6]].numberResponded, value: doc.id, full_data: doc.data() })
          portrait.push({ numberResponded: doc.data().categories[categories[7]].numberResponded, value: doc.id, full_data: doc.data() })
          psychedelic.push({ numberResponded: doc.data().categories[categories[8]].numberResponded, value: doc.id, full_data: doc.data() })
          realism.push({ numberResponded: doc.data().categories[categories[9]].numberResponded, value: doc.id, full_data: doc.data() })
          sculpting.push({ numberResponded: doc.data().categories[categories[10]].numberResponded, value: doc.id, full_data: doc.data() })

        }
        // console.log('finishing one instance of for each')
      })

      // console.log(sculpting)

      abstract.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      blackandwhite.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      threeD.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      design.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      drawing.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      multimedia.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      painting.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      portrait.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      psychedelic.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      realism.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })
      sculpting.sort(function (a, b) {
        return a["numberResponded"] - b["numberResponded"]
      })

      // Now we want to store the results into firebase. 


      //res.send('done?')
      // let top_ten_users = []
      // // Now that we have all users, we will get the top 10 for this category
      // for (var tenUsers = 0; tenUsers < 10; tenUsers++) {
      //   //Now push into the top 10 category array
      //   top_ten_users.push(top_users[top_users.length - 1 - tenUsers])

      // }
      // console.log(' top ten users are ', top_ten_users)

      // commit('set_top_ten_category', top_ten_users)
      let object = {
        abstract: abstract.slice(abstract.length - 10, abstract.length),
        blackandwhite: blackandwhite.slice(blackandwhite.length - 10, blackandwhite.length),
        threeD: threeD.slice(threeD.length - 10, threeD.length),
        design: design.slice(design.length - 10, design.length),
        drawing: drawing.slice(drawing.length - 10, drawing.length),
        multimedia: multimedia.slice(multimedia.length - 10, multimedia.length),
        painting: painting.slice(painting.length - 10, painting.length),
        portrait: portrait.slice(portrait.length - 10, portrait.length),
        psychedelic: psychedelic.slice(psychedelic.length - 10, psychedelic.length),
        realism: realism.slice(realism.length - 10, realism.length),
        sculpting: sculpting.slice(sculpting.length - 10, sculpting.length)
      }
      //  console.log('object here is: ', object)
      return object
    })
    .then(categoryList => {
      console.log('in the next .then()')
      let batch = db.batch()
      for (let key in categoryList) {
        var catRef = db.collection('business_stats').doc(key);
        var currentCategory = categoryList[key]
        console.log('Current sculpting category is ', currentCategory)
        //let userID = currentCategory.value
        batch.set(catRef, {
          user1: {
            numberResponded: currentCategory[9].numberResponded,
            userID: currentCategory[9].value,
            userData: currentCategory[9].full_data
          },
          user2: {
            numberResponded: currentCategory[8].numberResponded,
            userID: currentCategory[8].value,
            userData: currentCategory[8].full_data
          },
          user3: {
            numberResponded: currentCategory[7].numberResponded,
            userID: currentCategory[7].value,
            userData: currentCategory[7].full_data
          },
          user4: {
            numberResponded: currentCategory[6].numberResponded,
            userID: currentCategory[6].value,
            userData: currentCategory[6].full_data
          },
          user5: {
            numberResponded: currentCategory[5].numberResponded,
            userID: currentCategory[5].value,
            userData: currentCategory[5].full_data
          },
          user6: {
            numberResponded: currentCategory[4].numberResponded,
            userID: currentCategory[4].value,
            userData: currentCategory[4].full_data
          },
          user7: {
            numberResponded: currentCategory[3].numberResponded,
            userID: currentCategory[3].value,
            userData: currentCategory[3].full_data
          },
          user8: {
            numberResponded: currentCategory[2].numberResponded,
            userID: currentCategory[2].value,
            userData: currentCategory[2].full_data
          },
          user9: {
            numberResponded: currentCategory[1].numberResponded,
            userID: currentCategory[1].value,
            userData: currentCategory[1].full_data
          },
          userten: {
            numberResponded: currentCategory[0].numberResponded,
            userID: currentCategory[0].value,
            userData: currentCategory[0].full_data
          }
        })
      }
      return batch.commit();
    })
    .then(() => {
      response.send('finished');
    })
    .catch(error => {
      response.send(error);
    })
})

exports.weeklyFreeCredits = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let batch = db.batch()
  const users = db.collection('users').where('role', '==', 'artist').get()
    .then(function (querySnapshot) {
      //const users = querySnapshot.data()
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
        batch.update(artistsRef, { free_credits: '2' })
        // artistsRef.update({
        //   'free_credits': '2'
        // })
      }
      return batch.commit()
      //return 'credits?'
      //return response.send('Documents updated')
    })
    .then(function (reply) {

      return response.send('All artists updated with 2 free credits')
    })
    .catch(function (error) {
      response.send(error)
    })

})

exports.recentlyRepliedSubmissions = functions.https.onRequest((request, response) => {
  //params is the data that will specify 
  //console.log(event.body)
  //let params = event.body
  //console.log("params is typeOf: " + typeof params)

  //response is the object that we will return to the client
  let db = admin.firestore()
  let responseCode = 200;

  //Handle event data
  // if(event.body.amount == null || event.body.amount == undefined){

  //   responseCode = 400
  //   //response["statusCode"] = responseCode
  //   //response["body"] = 'Incorrect parameters, please supply amount of submissions to return in body'
  //   let responseBody = {
  //     data:'Incorrect parameters, please supply amount of submissions to return in body'
  //   }

  //   let reply = {
  //     statusCode : responseCode,
  //     body : JSON.stringify(responseBody)
  //   }
  //   response.status(400).send(reply)
  // }
  //else{
  //let amount = parseInt(params.amount, 10)

  let responseBody = {

  }

  // ascending or descending?
  let submissions = db.collection('review_requests').where("replied", "==", true).orderBy('replied_date', "desc").limit(20).get()
    .then(function (querySnapshot) {
      let promises = [];
      querySnapshot.forEach(function (doc) {
        promises.push(doc)
      })
      return Promise.all(promises)
    })
    .then(function (results) {
      // loop through results and place them in the response object under the 'body' object
      let requestMetaData = {
        art_title: '',
        artist_id: '',
        artist_name: '',
        //categories: [],
        delete: false,
        description: '',
        upload_date: 0,
        url: '',
        artist_email: '',
        business_email: '',
        business_name: '',
        businessUserId: '',
        read_byartist: false,
        refunded: 0,
        replied: true,
        replied_date: 0,
        radios: '',
        response: '',
        submitted_on: 0,
        submitted_with_free_cerdit: true
      }

      for (var i = 0; i < results.length; i++) {

        console.log('artist at position ' + i + " and id: " + results[i].data().art.artist_id)
        let emptyArray = []
        emptyArray = results[i].data().art.categories
        requestMetaData.art_title = results[i].data().art.art_title
        requestMetaData.artist_id = results[i].data().art.artist_id
        requestMetaData.artist_name = results[i].data().art.artist_name
        requestMetaData['categories'] = emptyArray
        requestMetaData.delete = results[i].data().art.delete
        requestMetaData.description = results[i].data().art.description
        requestMetaData.upload_date = results[i].data().art.upload_date
        requestMetaData.url = results[i].data().art.url
        requestMetaData.artist_email = results[i].data().artist_email
        requestMetaData.business_email = results[i].data().businessId.business_email
        requestMetaData.business_name = results[i].data().businessId.business_name
        requestMetaData.businessUserId = results[i].data().businessId.userId
        requestMetaData.read_byartist = results[i].data().read_byartist
        requestMetaData.refunded = results[i].data().refunded
        requestMetaData.replied = results[i].data().replied
        requestMetaData.replied_date = results[i].data().replied_date
        requestMetaData.radios = results[i].data().submission_response.radios
        requestMetaData.response = results[i].data().submission_response.response
        requestMetaData.submitted_on = results[i].data().submitted_on
        requestMetaData.submitted_with_free_cerdit = results[i].data().submitted_with_free_cerdit
        console.log("art name at this pos: " + requestMetaData.artist_name)
        console.log("here is obj: " + requestMetaData)

        // Necessary to a deep copy of the requestMetaData object
        let tempData = JSON.parse(JSON.stringify(requestMetaData))
        responseBody[i] = tempData
        // responseBody[i] = results[i].data();
      }
      let reply = {
        statusCode: responseCode,
        body: responseBody
      }

      console.log('responding here: ', response)
      return response.send(reply)
    })
    .catch(function (error) {
      return response.send(error)
    })

  //}

})

exports.getUserAvatar = functions.https.onRequest((request, response) => {
  let userId = request.body.userId
  const db = admin.firestore()
  const user = db.collection('users').doc('XpIQwNnOayXqjdlbh6jDDL5xaaz2').get()
    .then(doc => {
      let avatar = doc.data().profileUrl
      //response.send("Here is the user email: " + email)
    })
    .catch(error => {
      console.log(error)
      //response.send(error)
    })
})
exports.getRecommendedBusinesses = functions.https.onRequest((req, res) => {
  // Loads the business_stats collection to populate the recommended tab
  const db = admin.firestore()
  
  const data = db.collection('business_stats').get()
    .then(snapshot => {
      let arr = []
      snapshot.forEach(item => {
        console.log('item is ', item.data())
        arr.push(item.data())   
      })
      return arr
    })
    .then(obj => {
      return res.send(obj)
    })
    .catch(error => {
      console.log('there was an error')
      res.send(error)
    })
})

// Triggers an email once someone signs up
exports.payEmail = functions.firestore
  .document('users/F9AxT9EpPFcBBCk5PtaPasAYS6s2') //any write to this node will trigger email
  .onWrite(event => {
    const userId = 'F9AxT9EpPFcBBCk5PtaPasAYS6s2';
    const fsdb = admin.firestore()
    return fsdb.collection('users').doc(userId)
      .get()
      .then(doc => {
        console.log('doc: ' + doc.data().email)
        const customerdata = doc.data()
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'no_reply@shareyourselfartists.com',
            pass: 'sysartists1'
          }
        });
        const mailOptions = {
          from: 'no_reply@shareyourselfartists.com', // sender address
          to: 'no_reply@shareyourselfartists.com', // list of receivers
          subject: 'Someone just signed up!', // Subject line
          html: '<p>www.shareyourselfartists.com</p> <br \> <br \><img src="cid:https://preview.ibb.co/jiq7zJ/footer.png"/>', // plain text body
          attachments: [{
            filename: 'footer.png',
            path: 'https://preview.ibb.co/jiq7zJ/footer.png',
            cid: 'https://preview.ibb.co/jiq7zJ/footer.png' //same cid value as in the html img src
          }]
        };
        const promise = transporter.sendMail(mailOptions)
        const p2 = promise.then(function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info)
        })
        p2.catch(error => {
          console.log('Error sending email: ', error)
        })
      })
      .then(() => console.log('mail sent success'))
      .catch(err => console.log(err))
  });

//Triggers an email once submission is created
exports.createConfirmation = functions.firestore
  .document('review_requests/{userId}') //active for any documents created inside review_requests
  .onCreate((snap, context) => { //take obj of doc and looks into specific fields
    const fsdb = admin.firestore()
    const newVal = snap.data()

    //initialize email fields, ready to send
    let businessEmail = newVal.businessId.business_email
    let businessName = newVal.businessId.business_name
    //const art = change.after.data().art_url
    const artistEmail = "no_reply@shareyourselfartists.com"
    console.log("Document " + snap.id)
    console.log("Business's Email: " + businessEmail)

    return fsdb.collection('review_requests').doc(snap.id)
      .get()
      .then(doc => {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'no_reply@shareyourselfartists.com',
            pass: 'sysartists1'
          }
        });
        const mailOptions = {
          from: 'no_reply@shareyourselfartists.com', // sender address
          to: businessEmail, // list of receivers
          subject: 'An artist just sent you a submission!', // Subject line
          html: '<p>Come back to www.shareyourselfartists.com <br\> An artist just sent you a submission request!</p> <br \> Sincerely, <br \> SYA Accounts Team <br \> <br \><img src="cid:https://image.ibb.co/kEsqmy/footer.png"/>', // plain text body
          attachments: [{
            filename: 'footer.png',
            path: 'https://image.ibb.co/kEsqmy/footer.png',
            cid: 'https://image.ibb.co/kEsqmy/footer.png' //same cid value as in the html img src
          }]
        };
        const promise = transporter.sendMail(mailOptions)
        const p2 = promise.then(function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info)
        })
        p2.catch(error => {
          console.log('Error sending email: ', error)
        })
        console.log(artistEmail + " emailed " + businessEmail)
        //return sendgridemail.send(msgbody)
      })
      .then(() => console.log('mail sent success'))
      .catch(err => console.log(err))
  });
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({ original: original }).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

//Triggers an email once the submission has been received and replied
exports.replyConfirmation = functions.firestore
  .document('review_requests/{wildcard}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    const replied = change.after.data().replied
    const artistEmail = change.after.data().artist_email
    const businessEmail = change.after.data().businessId.business_email
    const refunded = change.after.data().refunded
    if (refunded == 1 && replied == false) { //email to business about a recent refund from an artist
      const artistName = change.after.data().artist_name
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'no_reply@shareyourselfartists.com',
          pass: 'sysartists1'
        }
      });
      const mailOptions = {
        from: 'no_reply@shareyourselfartists.com', // sender address
        to: businessEmail, // list of receivers
        subject: artistEmail + " cancelled their submission.", // Subject line
        html: '<p>Sadly you have not replied to this artist within 48 hours, so we have refunded them.</p> <br \> Sincerely, <br \> SYA Accounts Team <br \> <br \><img src="cid:https://image.ibb.co/kEsqmy/footer.png"/>', // plain text body
        attachments: [{
          filename: 'footer.png',
          path: 'https://image.ibb.co/kEsqmy/footer.png',
          cid: 'https://image.ibb.co/kEsqmy/footer.png' //same cid value as in the html img src
        }]
      };
      const promise = transporter.sendMail(mailOptions)
      const p2 = promise.then(function (err, info) {
        if (err)
          console.log(err)
        else
          console.log(info)
      })
      p2.catch(error => {
        console.log('Error sending email: ', error)
      })
      console.log("emailed " + businessEmail)
      return null
    } else if (replied == true && refunded == 0) { //email artist about a recent response from a business
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'no_reply@shareyourselfartists.com',
          pass: 'sysartists1'
        }
      });
      const mailOptions = {
        from: 'no_reply@shareyourselfartists.com', // sender address
        to: artistEmail, // list of receivers
        subject: 'A business just replied to you!', // Subject line
        text: 'You have a new review, please check your inbox!',
        html: 'You just received a response from a business!<br \> Come back to https://www.shareyourselfartists.com and go to your reviews!<br \><br \> Sincerely, <br \> SYA Membership Team <br \> <br \><img src="cid:https://image.ibb.co/kEsqmy/footer.png"/>',
        attachments: [{
          filename: 'footer.png',
          path: 'https://image.ibb.co/kEsqmy/footer.png',
          cid: 'https://image.ibb.co/kEsqmy/footer.png' //same cid value as in the html img src
        }]
      };
      const promise = transporter.sendMail(mailOptions)
      const p2 = promise.then(function (err, info) {
        if (err)
          console.log(err)
        else
          console.log(info)
      })
      p2.catch(error => {
        console.log('Error sending email: ', error)
      })
      console.log("emailed " + artistEmail)
      return null
    } else {
      console.log("updated submission")
      return null
    }
  });

//function to resize images on firebase storage


/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically
The url to call this function manually: https://us-central1-sya-app.cloudfunctions.net/daily_job?key=7bac810fd48cb85fa1bd988b84cb1f3e05778118
The this url can be adjusted for future usage in cronjobs if "timed" firestore functions is desired
*/
exports.daily_job = functions.https.onRequest((req, res) => {

  //to-do update function & compare time to limit document searches talk to Karl if you have questions
  let db = admin.firestore()
  const promise = db.collection('review_requests').where('replied', '==', false).where('refunded', '==', 0).get()
  const p2 = promise.then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      console.log("Might need refund")
      const now = Date.now()
      //calculated based off of ms => 1000 (1s) => 60 * 1000 (1m) => 60 * 60 * 1000 (1hr) => 48 * 60 * 60 * 1000 (48 hrs)
      const compareHours = now - (48 * 60 * 60 * 1000)
      console.log("compareHours: " + compareHours)
      console.log("doc is " + doc.id)
      const refundedDocId = doc.id
      //compare if the (time now - 48 hours) > (time submitted) ==> if this is true then that means it's been more than 48 hours and no reply
      if (typeof doc.data().submitted_on !== 'undefined' && compareHours > doc.data().submitted_on) {
        console.log("need refund")
        console.log("submitted on: " + doc.data().submitted_on)
        const artistRefundId = doc.data().art.artist_id
        console.log("artistId to refund: " + artistRefundId)
        //used as another promise to set a refund based off of their current # of credits
        var refundRef = db.collection('users').doc(artistRefundId).get()
        const toBeRefunded = refundRef.then(function (doc) {
          const creditTobeRefunded = doc.data().credits + 1
          console.log("credit to refund: " + creditTobeRefunded)
          return db.collection('users').doc(artistRefundId).update({
            credits: creditTobeRefunded,
          }).then(() => {
            //afterwards we have to flag this submission as already refunded to prevent being refunded again
            return db.collection('review_requests').doc(refundedDocId).update({
              refunded: 1,
            })
          })
        })
        toBeRefunded.catch(error => {
          //error handling for http, we must send a packet back once we know there's an error
          console.log('error handling ArtistRefundId: ', error)
          res.send('error with artistRefundId');
        })
      }//loops back to the next document
    })
    //after the loop ends, if everything is successful - this should be sent to the receiving end
    res.send('Finally Refunded all accounts!');
  })
  p2.catch(error => {
    //if we catch any errors pertaining to the documents being the source of the problem
    console.log('Error getting documents: ', error)
    res.send('error');
  })
});
