<template>
  <!--Styled by Jin. No modification on code.-->
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <h3 class="display-3">Great, let's get started. </h3>
        <h4 class="display-1">Blogs and labels typically respond within hours.</h4>
        <span class="subheading">If a blog decides that they like your piece, they'll let you know when and how they plan to share it. You'll be able to chat with them, and share any information you think they might need for their coverage.</span>
        <v-divider class="my-3"></v-divider>
        <div class="title mb-3">Let's Upload your art piece!</div>
        <v-btn
          class="mx-0"
          color="primary"
          depressed
          large
          router to="/upload_an_image1"
          @click="onPickFile"
        >
          Upload your art
        </v-btn>
        <input type="file"
               style="display:none"
               ref="fileInput"
               accept="image/*"
               @change="onFilePicked">
        <v-btn
          class="mx-0"
          depressed
          large
          color="primary"
          router to="/upload_an_image"
          :disabled="image_is_not_loaded"
          @click="getUserId">Next

        </v-btn>

        <!--<v-container>-->
          <v-layout row="">
            <!--<v-flex xs12="" sm6="" offset-sm3="">-->
            <v-flex xs12="" sm6="" class="display-4">
              <img :src="image_url" height="150"></img>
              <!--<h4>Test Preview</h4>-->
            </v-flex>
          </v-layout>
        <!--</v-container>-->  
          
        <v-layout>
      <div class="text-xs-center" id="tour">
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
                    <v-btn type="button" @click="tour.nextStep" depressed color="primary">Next Step</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 2">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">
                      Close
                    </v-btn>
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
</template>

<script>
  // Styled by Jin. No modification on code.
  export default {
    name: 'myTour',
    data () {
      return {
        checkbox: true,
        radioGroup: 0,
        switch1: true,
        image_url: '',
        file_name: null,
        file: {},
        image_is_not_loaded: true,
        steps: [
          {
            target: '#v-step-0', 
            content: 'Would you like help with uploading?'
          },
          {
            target: '#v-step-1', 
            content: 'Click the "UPLOAD YOUR ART" button and select your art to be uploaded from your local files'
          },
          {
            target: '#v-step-2', 
            content: 'Once you have finished uploading your image, you will be sent to your dashboard. At your dashboard, you can view your uploads and even submit your work to various art sharing platforms'
          }
        ], myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.nextStepCallback
        }
      }
    },

    mounted: function(){
      this.$tours['myTour'].start()
    },
    computed: {},
    methods: {
      getUserId () {
        let userId = this.$store.getters.user.id
        console.log(userId)
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let file = files[0]
        console.log('file: ' + file)
        this.file = file // Jin: Why this variable is needed?
        this.image_is_not_loaded = false
        let filename = files[0].name
        //this.file_name = filename // Jin: Why this variable is needed?
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid image file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          // Callback after fileReader loads the data with Url.
          this.image_url = fileReader.result
          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.image_url})
        })
        fileReader.readAsDataURL(files[0])
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


<style>
  .iconRow {
    font-size: 200px;
    color: #FF7D27;
  }

  .display-1 {
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .display-2 {
    margin-top: 10px;
  }
  #tour {
    /*margin-top: 50px;*/
    margin-top: 20px;
  }

  .display-4 {
    margin-top: 20px;
  }
</style>
