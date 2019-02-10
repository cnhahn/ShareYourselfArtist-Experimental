<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <h3 class="display-3">Great, let's get started. </h3>
        <h4 class="display-1">Blogs and labels typically respond within hours.</h4>
        <span class="subheading">If a blog decides that they like your piece, they'll let you know when and how they plan to share it. You'll be able to chat with them, and share any information you think they might need for their coverage.</span>
        <v-divider class="my-3"></v-divider>
        <div class="display-1">Let's Upload your art piece!</div>
        <div class="buttons-123">
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
        </div> 
                 
          <v-layout row="">
            <div class="preview-image">
            <v-flex xs12="" sm6="">
              <img :src="image_url" height="150"></img>
            </v-flex>
          </div>
          </v-layout> 
                   
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
        this.file = file 
        this.image_is_not_loaded = false
        let filename = files[0].name

        // Able to restrict the file upload size if necessary
        console.log('file size: ' + files[0].size)
        console.log('file type: ' + files[0].type)
        
        if ( filename.lastIndexOf('.') <= 0 || !file.type.match('image.*') ) {
          return alert('Please add a valid image file')
        }

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          // Callback after fileReader loads the data with Url.
          this.image_url = fileReader.result
          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.image_url})
        })

        // Create new image object to check if the file's dimensions are valid
        var img = new Image()
        img.src = window.URL.createObjectURL(files[0])
        img.onload = function(){
            var width = img.naturalWidth,
            height = img.naturalHeight;

            window.URL.revokeObjectURL(img.src)

            // the image resolutions of facebook is listed here: https://www.facebook.com/help/266520536764594?helpref=related
            // functions\index.js has a function called resizeImage

            // restrictions currently set are 960 x 960
            if(width <= 960 && height <= 960) {
              console.log("The image dimensions are within the limit. Continue.")
              
              // This fileReader allows the image to be able to be previewed
              fileReader.readAsDataURL(files[0])
            }
            else{
              console.log("The image dimensions are too large, notify and alert the user")
              return alert('The image dimensions are too large, please reupload an image with smaller dimensions.')
            }
            
            console.log("width is: " + width)
            console.log("height is: " + height)
        }

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
    margin-left: 300px;
  }

  .display-2 {
    margin-top: 10px;
    margin-left: 300px;
  }

  .display-3{
    margin-left: 300px;
  }

  .subheading{
    margin-left: 300px;
  }

  .buttons-123{
    margin-left: 300px;
  }

  .preview-image{
    margin-left: 300px;
  }

  #tour {
    margin-top: 50px;
    margin-left: 300px;
  }
</style>
