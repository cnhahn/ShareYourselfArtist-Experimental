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

    if (firebase.apps.length == 0) {
        firebase.initializeApp(config);
    }

    const db = firebase.firestore()
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
                var catRef = db.collection('most_popular_artist').doc(key);
                var currentCategory = categoryList[key]
                console.log('Current sculpting category is ', currentCategory)
                //let userID = currentCategory.value
                batch.set(catRef, {
                    user1: {
                        count: currentCategory[9].count,
                        userID: currentCategory[9].value,
                        userData: currentCategory[9].full_data
                    },
                    user2: {
                        count: currentCategory[8].count,
                        userID: currentCategory[8].value,
                        userData: currentCategory[8].full_data
                    },
                    user3: {
                        count: currentCategory[7].count,
                        userID: currentCategory[7].value,
                        userData: currentCategory[7].full_data
                    },
                    user4: {
                        count: currentCategory[6].count,
                        userID: currentCategory[6].value,
                        userData: currentCategory[6].full_data
                    },
                    user5: {
                        count: currentCategory[5].count,
                        userID: currentCategory[5].value,
                        userData: currentCategory[5].full_data
                    },
                    user6: {
                        count: currentCategory[4].count,
                        userID: currentCategory[4].value,
                        userData: currentCategory[4].full_data
                    },
                    user7: {
                        count: currentCategory[3].count,
                        userID: currentCategory[3].value,
                        userData: currentCategory[3].full_data
                    },
                    user8: {
                        count: currentCategory[2].count,
                        userID: currentCategory[2].value,
                        userData: currentCategory[2].full_data
                    },
                    user9: {
                        count: currentCategory[1].count,
                        userID: currentCategory[1].value,
                        userData: currentCategory[1].full_data
                    },
                    userten: {
                        count: currentCategory[0].count,
                        userID: currentCategory[0].value,
                        userData: currentCategory[0].full_data
                    }
                })
            }
            return batch.commit();
        })
        .then(() => {
            callback(null, 'finished');
        })
        .catch(error => {
            callback(error);
        })
}