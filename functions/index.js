/*
If you have any questions regarding the firestore functions
You can reach me @ kagawong@ucsc.edu
~ Karl Wong, Undergrad C.S. UCSC Summer 2018
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
  let person = db.collection('users').doc('XpIQwNnOayXqjdlbh6jDDL5xaaz2')

  let transaction = db.runTransaction(t => {
    return t.get(person)
      .then(doc => {
        // Add one person to the city population
        let categoryObj = {
            drawing: {
              count: 0,
              responded: 0
            },
            painting: {
              count: 0,
              responded: 0
            },
            sculpting: {
              count: 0,
              responded: 0
            },
            design: {
              count: 0,
              responded: 0
            },
            threeD: {
              count: 0,
              responded: 0
            },
            multimedia: {
              count: 0,
              responded: 0
            },
            blackandwhite: {
              count: 0,
              responded: 0
            },
            psychedelic: {
              count: 0,
              responded: 0
            },
            portrait: {
              count: 0,
              responded: 0
            },
            realism: {
              count: 0,
              responded: 0
            },
            abstract: {
              count: 0,
              responded: 0
            }
        }
        t.update(person, { categories: categoryObj });
      });
  }).then(result => {
    console.log('Transaction success!');
  }).catch(err => {
    console.log('Transaction failure:', err);
  });
})

exports.recommendArtwork = functions.https.onRequest((request, response) => {
  const db = admin.firestore()
  let userId = request.body.userId;
  let mostPopularCategory;
  const getCurrentUser = db.collection('users').doc(userId).get()
    .then()

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
  const artistToUpdate = request.body.artistID;
  const businessToUpdate = request.body.businessID;
  const categoriesToUpdate = request.body.categories;
  //which collection should this go to?
  const artistRef = db.collection('users').doc(artist);
  const businessRef = db.collection('users').doc(business)

  function updateArtist(){
    return new Promise((resolve, reject) =>{
      const currentArtist = db.collection('users').doc(artistToUpdate).get()
      .then(user => {
        let person = db.collection('users').doc(userId)
        let currentCategories = user.data().categories
        //console.log('type of currentCategories: ' + typeof currentCategories)
        console.log(JSON.stringify(currentCategories))

        for (let i = 0; i < categoriesToUpdate.length; i++) {
          //console.log('currentCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          currentCategories[categoriesToUpdate[i]].count++
          //console.log('updatedCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          switch (categoriesToUpdate[i]) {
            case 'painting':
              console.log('matched with painting')
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
              batch.set(artistRef, {
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
                batch.set(artistRef, {
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
                batch.set(artistRef, {
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
          let message = 'artist updated'
          resolve(message);
          //response.send('artist updated')
        })
        .catch(error => {
          console.log('error updating artist', error)
          let message = 'artist failed to update'
          reject(message);
          //response.send(error)
        })
    })
  }
  function updateBusiness(business){
    return new Promise((resolve, reject) =>{
      const currentBusiness = db.collection('users').doc(businessToUpdate).get()
      .then(user => {
        let person = db.collection('users').doc(userId)
        let currentCategories = user.data().categories
        //console.log('type of currentCategories: ' + typeof currentCategories)
        console.log(JSON.stringify(currentCategories))

        for (let i = 0; i < categoriesToUpdate.length; i++) {
          //console.log('currentCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          currentCategories[categoriesToUpdate[i]].count++
          //console.log('updatedCount of: ', categoriesToUpdate[i], ' is ', currentCategories[categoriesToUpdate[i]].count)
          switch (categoriesToUpdate[i]) {
            case 'painting':
              console.log('matched with painting')
              batch.set(businessRef, {
                categories: {
                  painting: {
                    totalReceived : currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses : user.data().categories.painting.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'threeD':
              console.log('matched with threeD')
              batch.set(businessRef, {
                categories: {
                  threeD: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.threeD.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'drawing':
              console.log('matched with drawing')
              batch.set(businessRef, {
                categories: {
                  drawing: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.drawing.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'sculpting':
              console.log('matched with sculpting')
              batch.set(businessRef, {
                categories: {
                  sculpting: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.sculpting.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'design':
              console.log('matched with design')
              batch.set(businessRef, {
                categories: {
                  design: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.design.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'multimedia':
              console.log('matched with multimedia')
              batch.set(businessRef, {
                categories: {
                  multimedia: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.multimedia.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'blackandwhite':
              console.log('matched with blackandwhite')
              batch.set(businessRef, {
                categories: {
                  blackandwhite: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.blackandwhite.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'psychedelic':
              console.log('matched with psychedelic')
              batch.set(businessRef, {
                categories: {
                  psychedelic: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.psychedelic.numOfResponses
                  }
                }
              }, { merge: true })
              break;
            case 'portrait':
              console.log('matched with portrait')
              batch.set(businessRef, {
                categories: {
                  portrait: {
                    totalReceived: currentCategories[categoriesToUpdate[i]].totalReceived++,
                    numOfResponses: user.data().categories.portrait.numOfResponses
                    }
                  }
                }, {merge:true})
                break;
              case 'realism':
                console.log('matched with realism')
                batch.set(businessRef, {
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
                batch.set(artistRef, {
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
          let message = 'artist updated'
          resolve(message);
          //response.send('artist updated')
        })
        .catch(error => {
          console.log('error updating artist', error)
          let message = 'artist failed to update'
          reject(message);
          //response.send(error)
        })
    })
  }
})

 // let transaction = db.runTransaction(t => {
  //   return t.get(artistRef)
  //     .then(doc => {
  //       for(let i = 0; i < categoryToUpdate.length; i++){
  //         switch (categoriesToUpdate[i]) {
  //           case 'painting':
  //             console.log('matched with painting')
  //             batch.set(person, {
  //               categories: {
  //                 painting: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.painting.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'threeD':
  //             console.log('matched with threeD')
  //             batch.set(person, {
  //               categories: {
  //                 threeD: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.threeD.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'drawing':
  //             console.log('matched with drawing')
  //             batch.set(person, {
  //               categories: {
  //                 drawing: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.drawing.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'sculpting':
  //             console.log('matched with sculpting')
  //             batch.set(person, {
  //               categories: {
  //                 sculpting: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.sculpting.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'design':
  //             console.log('matched with design')
  //             batch.set(person, {
  //               categories: {
  //                 design: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.design.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'multimedia':
  //             console.log('matched with multimedia')
  //             batch.set(person, {
  //               categories: {
  //                 multimedia: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.multimedia.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'blackandwhite':
  //             console.log('matched with blackandwhite')
  //             batch.set(person, {
  //               categories: {
  //                 blackandwhite: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.blackandwhite.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'psychedelic':
  //             console.log('matched with psychedelic')
  //             batch.set(person, {
  //               categories: {
  //                 psychedelic: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.psychedelic.responded
  //                 }
  //               }
  //             }, { merge: true })
  //             break;
  //           case 'portrait':
  //             console.log('matched with portrait')
  //             batch.set(person, {
  //               categories: {
  //                 portrait: {
  //                   count: currentCategories[categoriesToUpdate[i]].count++,
  //                   responded: user.data().categories.portrait.responded
  //                   }
  //                 }
  //               }, {merge:true})
  //               break;
  //             case 'realism':
  //               console.log('matched with realism')
  //               batch.set(person, {
  //                 categories: {
  //                   realism: {
  //                     count: currentCategories[categoriesToUpdate[i]].count++,
  //                     responded: user.data().categories.realism.responded
  //                   }
  //                 }
  //               }, {merge:true})
  //               break;
  //             case 'abstract':
  //               console.log('matched with abstract')
  //               batch.set(person, {
  //                 categories: {
  //                   abstract: {
  //                     count: currentCategories[categoriesToUpdate[i]].count++,
  //                     responded: user.data().categories.abstract.responded
  //                   }
  //                 }
  //               }, {merge:true})
  //               break;
  
  //             default:
  //               console.log('no cases matched')
  //         }
  //       }
  //       // Add one to the artist 'accepted' stat
  //       let newArtistStat = doc.data().categories.category.acceptedAmount + 1;
  //       t.update(artistRef, {acceptedAmount: newArtistStat});
  //       // We should also keep track of how many responses the business has made
  //       let newBusinessStat = doc.data().acceptedAmount + 1;
  //       t.update(businessRef, {acceptedAmount: newBusinessStat});
        
  //     });
  // })
  // .then(result => {
  //   console.log('Transaction success!');
  //   response.status(200).send("Artist's accepted stat updated.")
  // })
  // .catch(err => {
  //   console.log('Transaction failure:', err);
  // });

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


/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

/*
This function refunds an artist based on a submission that has not been replied to for atleast 48 hours
We utilize cronjobs to be able to call this function every 48 hours automatically

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
