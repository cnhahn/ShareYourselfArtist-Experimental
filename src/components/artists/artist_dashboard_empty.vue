<template>

  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>

  <v-container v-else>

    <v-jumbotron
      light
      src="/static/images/dashboardEmpty1.jpg"
      height="90vh"
    >
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3 title1">Welcome</h3>

            <div class="headline title2">Looks like you do not have any piece that you have uploaded..</div>
            </div>

            <v-layout>
      <div id="v-step-0 v-step-1" class="text-xs-center">
        <v-btn large depressed color="primary" router to="/upload_an_image1">Upload an image</v-btn>

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
              <template v-if="tour.currentStep === 0">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Yes</v-btn>
                    <v-btn type="button" @click="tour.stop" large depressed color="primary">No</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 1">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">Skip Tutorial</v-btn>
                    <v-btn type="button" @click="nextStepCallback(tour.currentStep)" depressed color="primary" router to="/upload_an_image1">Next step</v-btn>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
        </v-tour>
      </div>

    </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-container>
</template>

<script>
  export default {
    name: 'myTour',
    data () {
      return {
        gradient: 'to top right, rgba(255,255,255, 1), rgba(255,255,255, .3)',
        steps: [
          {
            target: '#v-step-0', 
            content: `Welcome to our website! Would you like to proceed with our tutorial?`
          },
          {
            target: '#v-step-1', 
            content: 'This is where you upload images for different blogs and media outlets to see your work!',
            params: {
              placement: 'right'
            }
          }
        ],
        myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.nextStepCallback
        }
      }
    },
    /*
    This function routes to artist_dashboard if there's change on artist work.
     */
    mounted: function() {
      this.$tours['myTour'].start()
      const db = this.$store.getters.db
      const userId = this.$store.getters.user.id
      const that = this
      db.collection('art')
        .where('artist_id', '==', userId)
        .onSnapshot(function(querySnapshot) {
          if (!querySnapshot.empty) {
            that.$router.push({
              name: 'artist_dashboard'
            })
          }
        })
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      }
    },
    methods: {
      clicked_art(artUniqueTimestamp) {
        console.log("clicked art: " + artUniqueTimestamp);
        this.$store.commit("set_clicked_art", artUniqueTimestamp);
      },
      submit_art(art) {
        this.$store.commit("set_art_being_submitted", art);
      },
       previousStepCallback(currentStep) {
        console.log("Previous")
      },
      nextStepCallback(currentStep) {
        console.log("Next")
      }
    }
  };
</script>
<style>
  .title1 {
    margin-top: 10px;
    font-family: "Roboto", sans-serif;
    font-weight: lighter;
    font-size: 1.6em;
  }
  .title2 {
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1.6em;
    color: #222222;
  }
  .middleText1 {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.6em;
    margin-top: 20vh;
  }
</style>