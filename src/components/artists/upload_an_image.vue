<template>
  <v-container fill-height>
    <v-layout row align-center justify-center>
      <v-flex xs12 > 

        <v-flex xs12 sm6>
          <v-layout row justify-center>
            <div class=" pb-4 text-xs-center display-2"> Art Details </div>
            <div class="text-xs-center" offset-sm4 id="tour">
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
                      <template v-if="tour.currentStep === 2">
                        <div slot="actions">
                          <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Yes</v-btn>
                          <v-btn type="button" @click="tour.stop" large depressed color="primary">No</v-btn>
                        </div>
                      </template>
                      <template v-if="tour.currentStep === 3">
                        <div slot="actions">
                          <v-btn type="button" @click="tour.stop" depressed color="primary">Close</v-btn>
                        </div>
                      </template>
                    </v-step>
                  </transition>
                </template>
              </v-tour>
            </div>
          </v-layout>
        </v-flex>

        <form>
          <v-layout row justify-center> 
            <v-flex xs12 sm6 >
                
              <v-text-field
                name='artTitle'
                class = "pb-4"
                label='Art Title'
                id='art-title'
                v-model='artTitle'
                required
              >
              </v-text-field>

              <v-text-field multi-line
                name='description'
                id='art-description'
                class = "pb-4"
                label='Please provide a description about the piece '
                :rules="[(v) => v.length <= 120 || 'Max 120 characters']"
                :counter="120"
                v-model='description'
                required
              >
              </v-text-field>

              <v-card>
                <v-select :items="items" attach chips name='categories' id='categories' label='Categories'
                v-model='categories' required multiple/>
              </v-card>

              <div class="pt-4 pb-4">
                <v-layout>

                  <v-flex xs12 sm6>
                    <v-btn depressed dark color="black" @click="goBack">Back</v-btn>
                    <v-btn depressed color="primary" :disabled="!formIsValid" @click="onSubmit">Submit</v-btn>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <div class = "mt-1">
                      <v-progress-circular
                        v-if="submission_in_progress"
                        indeterminate
                        color="primary">
                      </v-progress-circular>
                    </div>
                  </v-flex>
                  
                </v-layout>
              </div>


              <div id="uploadsuccess" v-if="submitted"  class = "pb-4">
                <!-- Toast message for upload image succes / failure -->
                <!-- Success message for when image uploads to the database -->
                <v-alert
                  :value="alert"
                  type="success"
                  transition="scale-transition"
                  id="uploadsuccess"
                >
                  Image Uploaded!
                </v-alert>

                <!-- Error emssage when image does not upload to the database -->
                <v-alert
                  :value="!alert"
                  type="error"
                  transition="scale-transition"
                  id="uploadsuccess"
                >
                  Failed to Upload Image
                </v-alert>
              </div>

              <v-layout>
                <div class="text-xs-center" offset-sm4 id="tour">
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
                              <v-btn type="button" @click="tour.stop" depressed color="primary">Close</v-btn>
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
        </form>

      </v-flex>
    </v-layout>
  </v-container>
</template>




<script>
  export default {
    name: 'myTour',
    data() {
      return {
        operation: 'art_upload',
        artistName: '',
        artTitle: '',
        artUrl: '',
        description: '',
        categories: '',
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        steps: [
          {
            target: '#v-step-0',
            content: 'Would you like help with uploading?'
          },
          {
            target: '#v-step-1',
            content: 'Enter the name, title, description and categories you would like viewers to see on your upload. When finished, hit submit and you will be directed to your dashboard'
          }
        ], myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.nextStepCallback
        },
        // If alert is true, then image was uploaded. If false, image was not uploaded to the database.
        alert: null,
        // If submitted is true, submit button was pressed, else it wasn't.
        submitted : false,
        submission_in_progress : false
      }
    },
    computed: {
      // Styled by Jin. No modification on code.
      formIsValid () {
        return this.artTitle !== '' && this.description !== '' && this.categories !== ''
      },
      art_submission_progress(){
        console.log("Enetered computed art submission progress")
        console.log("This is the art uploaded progress: ")
        console.log(this.$store.getters.get_art_uploaded)
        return this.$store.getters.get_art_uploaded
      }

    },

    mounted: function(){
      this.$tours['myTour'].start()
    },
    methods: {
      goBack () {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      onSubmit () {
        this.$store.commit('set_image_folder', '/')
        this.submission_in_progress = true;
        this.$store.dispatch('uploadImage', {
          operation: this.operation,
          artist_name: this.$store.getters.signed_in_user.name,
          description: this.description,
          art_title: this.artTitle,
          categories: this.categories,
          folder: this.folder,
          upload_date: Date.now()
        })
        .then(response => {
          console.log("Got same data now lets show something" )
          this.submitted = true  
          let art_uploaded = this.$store.getters.get_art_uploaded
          console.log('artuploaded is ' , art_uploaded)
          this.submission_in_progress = false
          if(art_uploaded == true){           
            console.log("It's true!")
            this.alert = true;
            setTimeout( () =>
            this.$router.push({
              path: 'artist_dashboard'
            }),
            1500);
          }else{
            console.log("It's false!")
            this.alert = false;
          }
        }, error => {
          console.log
        })
      },
      previousStepCallback(currentStep) {
        console.log("Previous")
      },
        nextStepCallback(currentStep) {
        console.log("Next")
      }
    }

  }
</script>

<style type="text/css">
  #uploadsuccess{
    /* display: inline-block;  */
    width: 100%
  }

</style>













