<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container class="container" v-else>
    <v-layout row mt-5 justify-space-between>
      <img :src="`${user_info.url}`" height="200px" alt="">
      <v-flex row wrap ml-5 mt-3>
        <h2 style="font-weight: bold; margin-bottom: 1vh; margin-left: 1vh">{{ user_info.business_name }}</h2>
        <p style="margin-top: 2vh; margin-left: 1vh">
          <span v-if="show_follower_count"> {{ user_info.follower_count }}</span>
          <span v-else> 0 </span>
          <span style="color:#ff7d27"><b>Followers</b></span>
          <span v-if="show_total_submissions"> &nbsp;&nbsp; {{ master_submissions.filter((review) => {
              return review.replied == undefined || review.replied == false || review.replied == true
            }).length }}</span>
          <span v-else> &nbsp;&nbsp; 0 </span>
          <span style="color:#ff7d27"><b>Total Submissions</b></span>
        </p>
        <p style="margin-top: 2vh; margin-left: 1vh">
          <!-- <span>{{ user_info.reply_time }}</span>
          <span v-if="show_reply_time" style="color:#ff7d27"><b>Reply Time</b></span> -->
          <span v-if="show_follower_count"> {{ master_submissions.filter((review) => {
              return review.replied == true
            }).length }}</span>
          <span v-else> &nbsp;&nbsp; 0 </span>
          <span style="color:#ff7d27"> <b>Replied Submissions</b></span>
        </p>
        <a v-if="user_info.facebook_url !== ''" :href="user_info.facebook_url" target="_blank">
          <img class='icon' src="/static/images/facebook-logo.png">
        </a>
        <a v-if="user_info.instagram_url !== ''" :href="user_info.instagram_url" target="_blank">
          <img class='icon' src="/static/images/instagram-logo.png">
        </a>
        <a v-if="user_info.tumblr_url !== ''" :href="user_info.tumblr_url" target="_blank">
          <img class='icon' src="/static/images/tumblr-logo-2.png">
        </a>
      </v-flex>
      <v-flex lg6 md6 sm6 xs12 ml-5>
        <div class="text-xs-left">
          <div style="margin-top: 1vh">
            <p><span style="font-weight: bold;">Publication: </span>{{ user_info.publication }}</p>
            <p><span style="font-weight: bold;">About: </span>{{ user_info.about }}</p>
            <p><span style="font-weight: bold;">Worth knowing: </span>{{ user_info.worth_knowing }}</p>
            <p><span style="font-weight: bold;">Additional notes: </span>{{ user_info.additional_notes }}</p>
          </div>
        </div>
      </v-flex>
    </v-layout>

    <v-layout>
      <div class="text-xs-center">
        <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
          <template slot-scope="tour">
            <transition name="fade">
              <v-step
                v-if="tour.currentStep === index"
                v-for="(step, index) of tour.steps"
                :key="index"
                :step="step"
                :previous-step="tour.previousStep"
                :next-step="tour.nextStep"
                :stop="tour.stop"
                :is-first="tour.isFirst"
                :is-last="tour.isLast"
                :labels="tour.labels"
              >
              </v-step>
            </transition>
          </template>
        </v-tour>
      </div>

    </v-layout>
    <v-layout mb-2 ml-2>
      <div id="v-step-0" class="text-xs-center">
        <v-btn large depressed color="primary" @click="$tours['myTour'].start()">&nbsp; &nbsp;Start Tutorial&nbsp; &nbsp;</v-btn>
      </div>
    </v-layout>
    <v-divider></v-divider>
    <h1 id="v-step-1" style="font-weight: bold; margin-top: 5vh; margin-bottom: 1vh; text-align:center">Submissions</h1>
    <div style="text-align:center">
      <!-- <v-btn flat @click="fetch_submissions" id='v-step-allSubmissions'>All Submissions</v-btn> -->
      <v-btn flat @click="submissions_unreplied_submissions" id='v-step-unrepliedSubmissions'>Unreplied Submissions ({{ master_submissions.filter((review) => {
          return review.replied == undefined || review.replied == false
        }).length }})</v-btn>
      <v-btn flat @click="submissions_replied_submissions" id='v-step-repliedSubmissions'>Replied Submissions ({{ master_submissions.filter((review) => {
          return review.replied == true
        }).length }})</v-btn>
    </div>
    <v-layout row justify-center>
      <v-layout row wrap mb-5>
        <v-flex xs12 lg4 offset-lg1 mt-5 v-for ="submission in submissions " :key='submission.id' id="v-step-dummySubmission">
          <v-card>
            <v-card-media :src= "submission.art.url" height="300px"></v-card-media>
            <v-layout row>
              <v-card-title primary-title>
              <div>
                <v-flex>
                  <h4 class="mb-0">{{submission.art.art_title}}</h4>
                  <v-layout row >
                    <div class="text-xs-center" v-if="submission.art.categories != null" v-for="(c, index) in 3">
                      <v-chip>{{ submission.art.categories[index] }}</v-chip>
                    </div>
                  </v-layout>
                  <v-spacer></v-spacer>
                  <div v-if="submission.instagram"><h3 class="mb-0">{{submission.instagram}}</h3></div>
                </v-flex>
                <v-flex>
                </v-flex>
              </div>
              </v-card-title>
            </v-layout>
            <v-card-actions>
               <div v-if="submission.submission_response">
                  <v-icon color="red" v-if="submission.submission_response.radios == 'declined'">close</v-icon>
                  <v-icon color="green" v-if="submission.submission_response.radios == 'accepted'">check</v-icon>
               </div>
              <v-btn icon @click.native="clicked_art(submission.art.upload_date)" flat color="primary" v-if="submission.replied == undefined || submission.replied == false"><v-icon>reply</v-icon></v-btn>
              <v-icon color="green" v-if="!submission.submitted_with_free_cerdit">attach_money</v-icon>
              <v-btn icon @click.native="download(submission.art.url)" flat color="primary" :href=submission.art.url><v-icon>cloud_download</v-icon></v-btn>
              <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
            </v-card-actions>
            <v-slide-y-transition>
          <v-card-text v-show="show">
            <div><h4> Description: </h4>{{submission.art.description}}</div>
            <div  v-if="submission.submission_response == undefined"> <h4>Response: </h4>You have not responded to this submission yet.</div>
            <div  v-else> <h4>Response: </h4>{{submission.submission_response.response}}</div>
          </v-card-text>
        </v-slide-y-transition>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Submit Your Response</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout row wrap>
          <v-flex lg6 sm12>
            <img class= "hidden-sm-and-down replied_image" v-if= "art_being_replied != null" :src = "art_being_replied.art.url">
            <img class= "hidden-md-and-up replied_image_small" v-if= "art_being_replied != null" :src = "art_being_replied.art.url">
          </v-flex>
          <v-flex lg6 sm12 px-2 mt-5 >
            <v-layout row> <p class= "display-1">Art Title: {{art_title}}</p> </v-layout>
            <v-layout row>
              <p class= "body-2">
                <div class="text-xs-center" v-for="(c, index) in categories">
                  <v-chip>{{ categories[index] }}</v-chip>
                </div>
              </p>
            </v-layout>
            <v-layout row> <p class= "body-2">Artist Name: <span class= "body-1">{{artist_name}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2">Artist Name: <span class= "body-1">{{instagram}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2"> Submitted on:  <span class= "body-1">{{submitted_on}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2"> Description: <span class= "body-1">{{description}}</span></p> </v-layout>
            <v-text-field
              name="input-1"
              :rules="rules"
              label="Your Response"
              v-model='submission_response'
              textarea
              required
            ></v-text-field>
                <p> We have {{ radios || 'null' }} to post your submission.</p>
                <v-radio-group v-model="radios" :mandatory="false">
                <v-radio label="Accept" value="accepted"></v-radio>
                <v-radio label="Decline" value="declined"></v-radio>
                </v-radio-group>
            <v-btn large color="primary" @click.native='submit_response(submission_response, radios)' :disabled = "!formIsValid">Submit</v-btn>
            <v-container fluid>

  </v-container>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
  export default {
    name: 'my-tour',
    data() {
      return {
        sideNav: false,
        number_of_submissions: this.$store.state.submissions_for_this_business.length,
        show_facebook:false,
        show_instagram:false,
        show_tumblr:false,
        show_follower_count:false,
        show_total_submissions:false,
        show_replied_submissions:false,
        show_reply_time:false,

        steps: [
          {
            target: '#v-step-0',
            content: `Welcome to our website! Would you like to proceed with our tutorial?`
          },
          {
            target: '#v-step-1',
            content: `This is where you check your submissions from your artists! Let's check out your submissions!`,
            params: {
              placement: 'top'
            }
          },
          {
            target: '#v-step-unrepliedSubmissions',
            content: `This is where you check your submissions you have not replied to! Don't forget to reply to the artist!`,
            params: {
              placement: 'top'
            }
          }
          ,
          {
            target: '#v-step-repliedSubmissions',
            content: `This is where you check your submissions you have replied to!`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#v-step-dummySubmission',
            content: `Looks like you got a submission! Let's check out the description!`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#v-step-dummySubmission',
            content: `Looks like the artist was really passionate about this piece! We should leave them some feedback.`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#v-step-dummySubmission',
            content: `Let's be nice to artists whether we accept their piece or not! We need to make sure to leave them constuctive feedback! Hit the reply button to start a response!
            <p><p>Here are a few example questions that you should answer to give feedback to the artists:</p></p>

                      <p>What do you like/dislike about the piece?</p>
                      <p>Does this piece fit your blog style?</p>
                      <p>What improvements would you like to see in the piece?</p>
            `,
            params: {
              placement: 'top',

            }
          },
          {
            target: '#v-step-dummySubmission',
            content: `Looks like you've left good feedback to the artist!`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '#v-step-dummySubmission',
            content: `You have finished our tutorial! Don't forget to reply to your artists!`,
            params: {
              placement: 'right'
            }
          }
        ],
        myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.myCustomNextStepCallback
        },

        // Submissions data
        show: false,
        radios: 'declined',
        dialog: false,
        notifications: false,
        art_being_replied: null,
        art_title: '',
        artist_name: '',
        submitted_on: '',
        description: '',
        submission_response: '',
        artist_id: '',
        instagram: '',
        docId: '',
        categories: [],
        master_submissions: [],
        submissions: [],
        read_submissions: [],
        unread_submissions: [],
        sub_list: [],
        nameKey: '',
        rules: [v => v.length > 50 || 'Min 50 characters']
      }
    },

    methods: {
      previousStepCallback(currentStep) {
        console.log("Previous")
      },
      nextStepCallback(currentStep) {
        console.log("Next")
      },

      // Submissions methods
      download: function(art_link) {

        console.log(art_link)

      },

      myCustomNextStepCallback: function(currentStep) {
        console.log("Called next callback")
        console.log(currentStep)
        if(currentStep == 4) {
          this.show = true
        }
        if(currentStep == 6) {
          this.clicked_art(123456789)
        }

      },

      /* Retrieves all review requests from the server */
      fetch_submissions: function () {
        this.$store.dispatch('fetch_all_Submissions').then(response => {
          this.submissions = this.$store.getters.submissions_for_this_business
          this.master_submissions = this.$store.getters.submissions_for_this_business
        }, error => {
          console.error('Got nothing from server. Prompt user to check internet connection and try again')
        })
      },

      /* Retrieves review requests that have not been responded to yet */
      submissions_unreplied_submissions: function () {
        this.submissions = this.master_submissions.filter((review) => {
          return review.replied == undefined || review.replied == false
        })
      },

      /* Retrieves review requests that have already been responded to */
      submissions_replied_submissions: function() {
        this.submissions = this.master_submissions.filter((review) => {
          return review.replied == true
        })
      },

      /* Saves the review entered by the business and makes accessible to the artist */
      submit_response(response, radios) {
        let nameKey = this.nameKey
        let subs = this.submissions
        let new_subs = subs.filter((sub) => {
          return sub.art.upload_date != nameKey
        })
        this.submissions = new_subs
        this.$store.commit('set_response', {response: response, radios:  radios })
        //this.$store.commit('dec_num_submissions_for_this_business')
        this.$store.dispatch('submit_submission_response')
        this.dialog = false
      },
      /* Retrieves the data for the selected artwork and allows a review to be made */
      clicked_art(art_unique_timestamp) {
        let nameKey = art_unique_timestamp
        this.nameKey = art_unique_timestamp
        let subs = this.submissions
        let new_subs = this.submissions
        this.submissions = new_subs
        let myArray = this.$store.state.submissions_for_this_business
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].art.upload_date === nameKey) {
            this.art_being_replied = myArray[i]
            this.art_title = myArray[i].art.art_title
            this.instagram = myArray[i].instagram
            this.artist_name = myArray[i].art.artist_name
            this.description = myArray[i].art.description
            this.categories = myArray[i].art.categories
            let sub_date = parseInt(myArray[i].submitted_on, 10)
            console.log(sub_date)
            let date_converted = function(sub_date){
              let date = new Date(sub_date);
              console.log('DATE' ,date)
              return date
            }
            this.submitted_on = date_converted(sub_date)


            this.docId = myArray[i].docId
            this.$store.commit('set_art_being_replied', {
              art_title: myArray[i].art.art_title,
              artist_name: myArray[i].art.artist_name,
              categories: myArray[i].art.categories,
              description: myArray[i].art.description,
              submitted_on: myArray[i].submitted_on,
              artist_id: myArray[i].art.artist_id,
              docId: myArray[i].docId
            })
          }
        }
        this.$store.commit('set_clicked_art', art_unique_timestamp)
        this.dialog = true
      }
    },
    mounted: function () {

      if("firstTimeLogin" in localStorage){
        localStorage.clear()
        console.log('yes');
        console.log(localStorage.getItem("firstTimeLogin"))
      } else {
        console.log('no');
      }
      
      //submissions mounted

        this.$tours['myTour'].start()
        this.$store.dispatch('fetch_all_Submissions').then(response => {
        this.submissions = this.$store.getters.submissions_for_this_business
        this.master_submissions = this.$store.getters.submissions_for_this_business
        }, error => {
          console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })
        if (this.submissions === null) {
          this.$router.push('/submissions/empty')
        }

    },
    beforeCreate: async function () {
      this.number_of_submissions = this.$store.state.submissions_for_this_business.length
    },
    computed: {
      user_info() {
        let myArray=this.$store.getters.signed_in_user
        if(myArray.facebook_url != "")
          this.show_facebook=true
        if(myArray.instagram_url != "")
          this.show_instagram=true
        if(myArray.tumblr_url != "")
          this.show_tumblr=true
        if(myArray.follower_count != "" && myArray.follower_count != undefined)
          this.show_follower_count=true
        if(myArray.total_submissions != "" && myArray.total_submissions != undefined)
          this.show_total_submissions=true
        if(myArray.replied_submissions != "" && myArray.replied_submissions != undefined)
          this.show_replied_submissions=true
        if(myArray.reply_time != "" && myArray.reply_time != undefined)
          this.show_reply_time=true

        return myArray
      },
      loading() {
        return this.$store.getters.loading;
      },
      // Submissions computed
      format_timestamp(timestamp) {
        var date = new Date(timestamp);
        var month = date.getMonth();
        var day = date.getDay();
        var year = date.getYear();

        var formattedTime = month + '/' + day + '/' + year;
        return formattedTime;

      },
      /* Verifies that the business entered data into the field */
      formIsValid() {
        return this.submission_response.length > 50
      },

      /* Selects the artwork that the business has selected */
      art(){
        let myArray = this.$store.state.submissions_for_this_business
        let nameKey = this.$store.state.clicked_art
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].upload_date === nameKey) {
            this.art_being_replied = myArray[i];
          }
        }
      }
    }
  }

</script>
<style scoped>
  .container {
    height: 100vh;
  }

  .divbottomline {
    border-bottom: 1px solid #e0e0e0;
  }
  .loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
  .icon{
    height:50px
  }

  /* Submissions CSS */
  .container {
    height: 70vh;
  }
  .replied_image {
    max-width: 600px;
    margin: 50px;
    margin-bottom: 20px;
  }
  .replied_image_small {
    max-width: 100%;
  }
  .counters {
    float: left;
    margin-right: 35px;
    margin-left: 20px
  }
</style>
