<template>
  <!--Styled by Jin. No modification on code.-->
  <v-container fill-height>

    <v-layout align-center> 
        <v-snackbar
        v-model="snackbar"
        :bottom="y === 'bottom'"
        :left="x === 'left'"
        :multi-line="mode === 'multi-line'"
        :right="x === 'right'"
        :timeout="timeout"
        :top="y === 'top'"
        :vertical="mode === 'vertical'"
        >
          {{ text }}
          <v-btn color="pink" flat @click="snackbar = false"> Close </v-btn>
        </v-snackbar>
    </v-layout>

    <v-layout align-center justify-center>
      <v-flex xs12 >
        <div class="display-4 pa-4 "> Great, let's get started</div>

        <div class="ml-1 ">

          <div class="display-3 pl-4 pr-4"> Blogs and labels typically respond within hours.</div>
          <div class ="pa-4">
            <div class="headline">If a blog decides that they like your piece, they'll let you know when and how they plan to share it.</div>
            <div class="headline">You'll be able to chat with them and share any information you think they might need for their coverage.</div>
          </div>

          <div class="pa-4">
            <div class="display-1">Let's upload your art piece!</div>
            <div class="buttons-123">
              <v-btn class="mx-0" color="primary" depressed large router to="/upload_an_image1" @click="onPickFile"> Upload your art </v-btn>
              <input class ="mx-1" type="file" style="display:none" ref="fileInput" accept="image/*" @change="onFilePicked">
              <v-btn class="mx-0" depressed large color="primary" router to="/upload_an_image" :disabled="image_is_not_loaded" @click="getUserId">
                Next 
              </v-btn>
            </div> 
          </div>

          <div class="preview-image pl-4">
            <v-flex xs12>
              <v-alert v-if="image_size_accepted == false" :value="true" type="error">
                Image size is too large! Please reduce the image size
              </v-alert>
              <img :src="image_url" height="150">
            </v-flex>
          </div>

          <div class="text-xs-center pa-4">
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

        </div>
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

        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        text: 'Please add a valid image file',

        image_size_accepted : true,
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
        this.image_size_accepted = true
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let file = files[0]
        console.log('Entered on FilePicked')
        if(file.size > 4000000){
          this.image_size_accepted = false
          var input = document.getElementsByTagName('input')[0];
          input.value = null
          this.image_url = ''
          this.image_is_not_loaded = true
          return
        } 
        console.log('file: ', file)
        this.file = file 
        this.image_is_not_loaded = false
        let filename = files[0].name
        if ( filename.lastIndexOf('.') <= 0 || !file.type.match('image.*') ) {
          this.image_is_not_loaded = true
          this.snackbar = true
          this.file = null
          this.image_url = ''
          return
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
</style>
