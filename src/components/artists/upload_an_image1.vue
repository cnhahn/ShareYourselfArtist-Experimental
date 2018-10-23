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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  // Styled by Jin. No modification on code.
  export default {
    data () {
      return {
        checkbox: true,
        radioGroup: 0,
        switch1: true,
        image_url: '',
        file_name: null,
        file: {},
        image_is_not_loaded: true
      }
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
        this.file_name = filename // Jin: Why this variable is needed?
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
</style>
