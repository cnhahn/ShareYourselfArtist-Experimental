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
              <!--<img :src="image_url" height="350"></img>-->
              <!--<img :src="image_url" height="550"></img>-->
              <!--<div v-if="image_too_big == false">
                <img :src="image_url"
                    :style="{
                      width: resized_width + 'px',
                      height: resized_height + 'px'
                    }"
                ></img>
                </div>
               <div v-else>-->
                 <div v-if="image_is_landscape">
                    <img :src="image_url"
                      :style="{
                      width: max_pre_width + 'px'
                      }"
                    ></img>
                 </div>
                 <div v-else>
                   <img :src="image_url"
                      :style="{
                      height: max_pre_height + 'px'
                      }"
                    ></img>
                 </div>  
               <!--</div>-->
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
        max_pre_width: 600,
        max_pre_height: 430,
        image_too_big: false,
        image_is_landscape: true,
        resized_width: 0,
        resized_height: 0,
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

        // assume uploaded image not over max dimensions at first
        this.image_too_big = false
        // assume at first image is landscape
        this.image_is_landscape = true
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
            //console.log('image width: ', img.width)
            //console.log('image height: ', img.height)
            
            // check orientation
            self.checkOrientation(img.width, img.height)

            // this is to resize the uploaded image
            // max width allowed = 1200, height allowed = 630
            self.resizeImage(img.width, img.height, 1200, 630)
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
      checkOrientation(width, height)
      {
        // check if landscape or portrait to set max preview dimensions
        // a square image is considered portrait
        if (width > height)
        {
          this.image_is_landscape = true
        }
        else
        {
          this.image_is_landscape = false
        }
      },
      resizeImage(width, height, maxWidth, maxHeight) {
        // resize the image proportionally if too large, keeping aspect ratio
        // preview is restricted to max width or height, depending on orientation
        var ratio = 0

        if (width > maxWidth)
        {
          ratio = maxWidth / width
          height = height * ratio
          width = width * ratio

          this.image_too_big = true
        }
        if (height > maxHeight)
        {
          ratio = maxHeight / height
          width = width * ratio
          height = height * ratio

          this.image_too_big = true
        }

        this.resized_width = width
        this.resized_height = height
        //console.log('resized image width: ', width)
        //console.log('resized image height: ', height)
      }
    }
  }
</script>


<style>
</style>
