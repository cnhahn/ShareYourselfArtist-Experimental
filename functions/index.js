/*
If you have any questions regarding the firestore functions
You can reach me @ kagawong@ucsc.edu
~ Karl Wong, Undergrad C.S. UCSC Summer 2018
*/

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
'use strict';

//used for 48 hour refund
const secureCompare = require('secure-compare');

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

/*
plan:
going to use a testing account to test the if credits are working.
code will be written as if we want to change every users free credits but for testing we will target the test account.
*/

// this is a test function
// This is Yas's ID: QBRXqktYi0QigFboM92crKAONKn1
// exports.weekly_free_credits = functions.https.onRequest((req, res) => {
//   // to-do update function & compare time to limit document searches talk to Karl if you have questions 

//   let db = admin.firestore()
//   db.collection('users').get()
//     .then(users => {
//       users.forEach(doc => {
//         let currentCredits
//         if (doc.data().free_credits !== undefined) { //maybe also doc.data().exists()?
//           currentCredits = 2
//         }
//         console.log(currentCredits)
//         console.log(doc.data().userId)
//         //const userRef = db.collection('users').doc(doc.data().userId)
//         const userRef = db.collection('users').doc('QBRXqktYi0QigFboM92crKAONKn1')
//         // return userRef.update({
//         //   free_credits: 2
//         // })
//       })
//       res.send('distributed')
//     })
//     .catch(error => {
//       console.log(error)
//       res.status(500).send(error)
//     })
// })

// exports.weeklyFreeCredits = functions.https.onRequest((request, response) => {
//   let db = admin.firestore()
//   let artists = db.collection('users').where('role', '==', "artist").get()
//   const promise = artists.then(function (querySnapshot) {
//       console.log(querySnapshot)
//       console.log('before for each')
//       querySnapshot.forEach(function (doc) {
//         let userId = doc.data().userId
//         console.log(doc)
//         console.log('userID: ' + userId)
//         return db.collection('users').doc(userId).update({'free_credits':'2'})
//         // return db.collection('users').doc(userId).update({
//         //   'free_credits': '2'
//         // })
//       })
//     }).then(()=>{response.send("Document updated")}) 
//   .catch(function (error) {
//     console.log('error getting documents yas: ', error)
//     response.send(error)
//   })


// })

// exports.weeklyFreeCredits = functions.https.onRequest((request, response) => {
//   let db = admin.firestore()
//   let artists = db.collection('users').where('role', '==', "artist").get()
//   const promise = artists.then(function (querySnapshot) {
//       console.log('before for each')
//       querySnapshot.forEach(function (doc) {
//         let userId = doc.data().userId
//         console.log('userID: ' + userId)
//         return db.collection('users').doc(userId).update({
//           'free_credits': '2'
//         })
//       })
//       response.send("Document updated")
//     })
//   .catch(function (error) {
//     console.log('error getting documents yas: ', error)
//     response.send(error)
//   })
// })

/*Lets outline our work right here

Timing: 
- If an artists uses credits, we mark that exact date. Then check the lastspentcreditdate and compare it to the current day the users next login.
Recognizing when User Signs In
If user already has maximum credits - run function, still update lastRanTime

*/


// Will only update credits when user signs in
// exports.updateCreditsWeekly = functions.https.onRequest((request, response) => {
//     let userId = request.body
//     let freeCredits, creditsUpdatedOn, newCreditsUpdateDate
//     let user = admin.firestore().collection('users').doc(userId).get()
//         .then(userObject =>{
//             if(userObject.exists && userObject.free_credits !== undefined && userObject.free_credits == 2){
//                 freeCredits = 2
//             }
//             if(userObject.exists && userObject.lastUpdated !== undefined){

//             }
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(500).send(error)
//         })
// })


/*
  This function will update each artists free credit amount to 2 each week. It is hooked up
  to a AWS CloudWatch CRON job so that it runs weekly

  FUTURE TODO: The batch update used here can only do a maximum of 500 writes. As of writing
  this function there are only 432 artists so everything is fine. Later on we will have to do 
  multiple batch writes if there are greater than 500 artists.
*/
exports.weeklyFreeCredits = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let batch = db.batch()
  const users = db.collection('users').where('role', '==', 'artist').get()
    .then(function (querySnapshot) {
      //const users = querySnapshot.data()
      const promises = []
      querySnapshot.forEach(function (doc){
        promises.push(doc)
      })
      return Promise.all(promises) //returning promises sends the resolved results to 
    })                             //to the next .then()
    .then(function (person){
      let results = []
      person.forEach(function(personSnap){
        //const data = personSnap.data()
        results.push(personSnap.id)
      })
      return results
    })
    .then(function (ids){
      console.log("arrays length:" + ids.length)
      for(var i = 0; i<ids.length; i++){
        //console.log(ids[i])
        let artistsRef = db.collection('users').doc(ids[i])
        batch.update(artistsRef, {free_credits: '2'})
        // artistsRef.update({
        //   'free_credits': '2'
        // })
      }
      return batch.commit()
      //return 'credits?'
      //return response.send('Documents updated')
    })
    .then(function(reply){

      return response.send('All artists updated with 2 free credits')
    })
    .catch(function (error){
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
      .then(function(querySnapshot){
        let promises = [];
        querySnapshot.forEach(function(doc){
          promises.push(doc)
        })
        return Promise.all(promises)
      })
      .then(function(results){
        // loop through results and place them in the response object under the 'body' object
        let requestMetaData = {
          art_title: '',
          artist_id : '',
          artist_name: '',
          //categories: [],
          delete: false,
          description: '',
          upload_date: 0,
          url : '',
          artist_email: '',
          business_email : '',
          business_name : '',
          businessUserId: '',
          read_byartist : false,
          refunded: 0,
          replied: true,
          replied_date: 0,
          radios: '',
          response: '',
          submitted_on: 0,
          submitted_with_free_cerdit: true
        }

        for(var i = 0; i < results.length; i++){
          
          console.log('artist at position ' + i + " and id: "+ results[i].data().art.artist_id)
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
          statusCode : responseCode,
          body : responseBody
        }

        console.log('responding here: ', response)
        return response.send(reply)
      })
      .catch(function(error){
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
exports.resizeFile = functions.storage.object().onFinalize((object) => {
  const filePath = object.name;
  const fileName = path.basename(filePath);
  const contentType = object.contentType;
  if (!contentType.startsWith('image/')) { //Initially the image would pass this, once resized the contentType changes to stop loop
    console.log('This is not an image.');
    return null;
  }
  const metadata = { //set contentType
    contentType: contentType,
  };
  const currBucket = gcs.bucket("gs://sya-app.appspot.com") //bucket in our google cloud
  const thumbFileName = fileName;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
  const tmpPath = path.join(os.tmpdir(), path.basename(filePath))
  return currBucket.file(filePath).download({
    destination: tmpPath
  }).then(() => {
    return spawn('convert', [tmpPath, '-resize', '600x600', tmpPath]);
  }).then(() => {
    return currBucket.file(filePath).delete({ destination: tmpPath })
      .then(() => {
        return currBucket.upload(tmpPath, {
          destination: thumbFilePath,
          contentType: 'jpeg/' //updates content type to stop the loop
        })
      })
  });
});

exports.test = functions.https.onRequest((req,res) => {
  res.send("Deploying this function")
})

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
