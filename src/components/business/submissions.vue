<template>
  <v-container class ="container">
    <h1 style="font-weight: bold; margin-top: 5vh; margin-bottom: 1vh;">Submissions</h1>
    <div style="margin-bottom: 40px">
      <div class="counters">Total Submissions: {{ master_submissions.length }}</div>
      <div class="counters">Unreplied Submissions: {{ master_submissions.filter((review) => {
          return review.replied == undefined || review.replied == false
        }).length }}</div>
      <div class="counters">Replied Submissions: {{ master_submissions.filter((review) => {
          return review.replied == true
        }).length }}</div>
    </div>
    <div>
      <v-btn flat @click="fetch_submissions">All Submissions</v-btn>
      <v-btn flat @click="submissions_unreplied_submissions" id='v-step-unrepliedSubmissions'>Unreplied Submissions</v-btn>
      <v-btn flat @click="submissions_replied_submissions" id='v-step-repliedSubmissions'>Replied Submissions</v-btn>
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
                <template v-if="tour.currentStep == 3">
                  <div slot="actions">
                    <v-btn @click="tour.stop" large depressed color="primary">Skip Tutorial</v-btn>
                    <v-btn type="button" @click="tour.previousStep" large depressed color="primary">Previous</v-btn>
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">See Description</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep == 4">
                  <div slot="actions">
                    <v-btn @click="tour.stop" large depressed color="primary">Skip Tutorial</v-btn>
                    <v-btn @click="tour.previousStep" large depressed color="primary">Previous</v-btn>
                    <v-btn @click="tour.nextStep"  large depressed color="primary">Next</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep == 5">
                  <div slot="actions">
                    <p>Here are a few example questions that you should answer to give feedback to the artists:</p>
                    <ul>
                      <li>What do you like/dislike about the piece?</li>
                      <li>Does this piece fit your blog style?</li>
                      <li>What improvements would you like to see in the piece?</li>
                    </ul>
                    <p>Then you can choose whether you accept or decline the artist submission!</p>
                    <v-btn @click="tour.stop" large depressed color="primary">Skip Tutorial</v-btn>
                    <v-btn @click="tour.previousStep" large depressed color="primary">Previous</v-btn>
                    <v-btn @click="tour.nextStep" large depressed color="primary">Next</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep == 6">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Next</v-btn>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
      </v-tour>
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
  </v-layout>
  </v-container>
</template>

<script>

  export default {
    name: 'my-tour-2',
    data () {
      return {
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
        rules: [v => v.length > 50 || 'Min 50 characters'],
        steps: [
          {
            target: '#v-step-allSubmissions',  // We're using document.querySelector() under the hood
            content: `This is where you check all of your submissions`,
            params: {
              placement: 'top'
            }
          },
          {
            target: '#v-step-unrepliedSubmissions',  // We're using document.querySelector() under the hood
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
            content: `Let's be nice to artists whether we accept their piece or not! We need to make sure to leave them constuctive feedback! Hit the reply button to start a response!`,
            params: {
              placement: 'right',
              
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
          onNextStep: this.myCustomNextStepCallback
        }
      }
    },

    methods:{

      download: function(art_link) {
        
        console.log(art_link)

      },

      myCustomNextStepCallback: function(currentStep) {
        console.log("Called next callback")
        console.log(currentStep)
        if(currentStep == 3) {
          this.show = true
        }
        if(currentStep == 5) {
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
    computed:{
      format_timestamp(timestamp) {
        var date = new Date(timestamp);
        var month = date.getMonth();
        var day = date.getDay();
        var year = date.getYear();

        var formattedTime = month + '/' + day + '/' + year;
        return formattedTime;

      },
      /* Verifies that the business entered data into the field */
      formIsValid () {
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
    },
    mounted:

      /* This component just got created, fetch some data here using an action */
      function() {
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
      }
}
</script>
<style scoped>
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
