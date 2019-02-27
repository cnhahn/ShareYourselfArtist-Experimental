<template>
  <!--Styled by Jin. No modification on code.-->
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>

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
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
      </v-snackbar>

        <h3 class="display-3">Great, let's get started. </h3>
        <h4 class="display-1">Blogs and labels typically respond within hours.</h4>
        <span class="subheading">If a blog decides that they like your piece, they'll let you know when and how they plan to share it.</span><br>
        <span class="subheading">You'll be able to chat with them, and share any information you think they might need for their coverage.</span>
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
              <v-alert
                v-if="image_size_accepted == false"
                :value="true"
                type="error"
              >
                Image size is too large! Please reduce the image size
              </v-alert>
              <img :src="image_url" height="350"></img>
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

        // lets methods be used within fileReader load
        var self = this

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          // Callback after fileReader loads the data with Url.
          this.image_url = fileReader.result

          // holds the uploaded image, used to get dimensions
          var img = new Image()
          // image loading is done asynchronously, so you have to wait for load event
          // in other words, you have to wait for the image to load before using image
          img.onload = function()
          {
            console.log('image width: ', img.width)
            console.log('image height: ', img.height)
            // resize the image proportionally if too large, keeping aspect ratio
            self.resizeImage(img.width, img.height, 1200, 630)

            /*var width = img.width
            var height = img.height
            console.log('image width: ', width)
            console.log('image height: ', height)

            // resize the image proportionally if too large, keeping aspect ratio
            var maxWidth = 1200
            var maxHeight = 630
            var ratio = 0

            if (width > maxWidth)
            {
              ratio = maxWidth / width
              height = height * ratio
              width = width * ratio
            }
            if (height > maxHeight)
            {
              ratio = maxHeight / height
              width = width * ratio
              height = height * ratio
            }

            console.log('resized image width: ', width)
            console.log('resized image height: ', height)*/
          }
          img.src = this.image_url

          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.image_url})
        })
        fileReader.readAsDataURL(files[0])
      },
        previousStepCallback(currentStep) {
        console.log("Previous")
      },
        nextStepCallback(currentStep) {
        console.log("Next")
      },
      // resize the image proportionally if too large, keeping aspect ratio
      resizeImage(width, height, maxWidth, maxHeight) {
        var ratio = 0

        if (width > maxWidth)
        {
          ratio = maxWidth / width
          height = height * ratio
          width = width * ratio
        }
        if (height > maxHeight)
        {
          ratio = maxHeight / height
          width = width * ratio
          height = height * ratio
        }

        console.log('resized image width: ', width)
        console.log('resized image height: ', height)
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
