<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container grid-list-sm text-xs-center v-else>
    <v-layout  column wrap fill-height>

      <v-flex xs5>
        <v-layout align-center row wrap justify-center fill-height> 
 
      <img v-bind:src="this.business_info.url" />
          
          <img class='icon' src="/static/images/facebook-logo.png" height="75px"> <img class='icon' src="/static/images/instagram-logo.png" height="75px"> <img class='icon' src="/static/images/tumblr-logo-2.png" height="75px">
          
          
          <div class="text-xs-center">
          <v-btn large depressed color="primary" router to="/submissions">All Submissions</v-btn>
          </div>
          
     
   
          <!-- <a v-if="show_instagram" :href="user_info.instagram_url" target="_blank">
            <img class='icon' src="/static/images/instagram-logo.png">
          </a>
          <a v-if="show_tumblr" :href="user_info.tumblr_url" target="_blank">
          <img class='icon' src="/static/images/tumblr-logo-2.png">
          </a> -->
        </v-layout>
      </v-flex>

      <v-flex xs5>
        <v-layout  align-center row wrap>
          <v-flex xs6>
            <div class="display-2 pt-3"> 
              <div class="pb-3 "style=" text-decoration: underline;" > Business Info </div>
              <div class="pb-3"> Name {{this.business_info.business_name}}</div>
              <div class="pb-3">  About {{this.business_info.about}} </div>
              <div class="pb-3"> Email {{this.business_info.email}} </div>
              <div class="pb-3"> Publication {{this.business_info.publication}} </div>
              <div class="pb-3"> Worth Knowing {{this.business_info.worth_knowing}} </div>
              <div class="pb-3"> Additional Notes {{this.business_info.additional_notes}} </div>
            </div>
          </v-flex>
          <v-flex xs6>
            <div class="display-2 pt-3"> 
              <div class="pb-3 " style=" text-decoration: underline;"> Members  </div>
              <div class="pb-3"> Hello World! </div>
              <div class="pb-3"> Hello World! </div>
              <div class="pb-3"> Hello World! </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
    <!-- <v-layout row mt-5 justify-space-between>
      <img :src="`${'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/BY8KZZD5eMMvaNAOaGuDVqhCTuw1%2Flogo%2FyekGAvzU5fZKh49e6w0tJuRmFFg1_profile_white_sand_beach-56d50c955f9b5879cc92cc5c.jpg?alt=media&token=58e27b97-e6eb-4318-87ef-7ef2a8ad1c21'}`" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>
    <v-layout>
      <div class="text-xs-center">
        <v-btn large depressed color="primary" router to="/submissions">All Submissions</v-btn>
      </div>
    </v-layout>
    <v-layout row wrap mt-5>
      <p class="title">{{ 'test' }}</p>
    </v-layout>
    <v-layout row>
      <p class="caption">Email: {{ 'test@gmail.com' }}</p>
    </v-layout> -->

    <!-- <v-layout row mt-5 justify-space-between>
      <img :src="`${user_info.url}`" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>
    <v-layout>
      <div class="text-xs-center">
        <v-btn large depressed color="primary" router to="/submissions">All Submissions</v-btn>
      </div>
    </v-layout>

    <v-layout row wrap mt-5>
      <p class="title">{{ user_info.business_name }}</p>
    </v-layout>
    <v-layout row>
      <p class="caption">Email: {{ user_info.email }}</p>
    </v-layout>
    <v-layout row mb-1 >
      <v-flex>
      <a v-if="show_facebook" :href="user_info.facebook_url" target="_blank">
          <img class='icon' src="/static/images/facebook-logo.png">
      </a>
      <a v-if="show_instagram" :href="user_info.instagram_url" target="_blank">
          <img class='icon' src="/static/images/instagram-logo.png">
      </a>
      <a v-if="show_tumblr" :href="user_info.tumblr_url" target="_blank">
          <img class='icon' src="/static/images/tumblr-logo-2.png">
      </a>
      </v-flex>
    </v-layout>


    <v-layout class="" row wrap mt-5>
      <p class="body-1"><b>Publication: </b> {{ user_info.publication }}</p>
    </v-layout>
    <v-layout class="" row wrap>
      <p class="body-1"><b>About: </b> {{ user_info.about }}</p>
    </v-layout>
    <v-layout class="" row wrap>
      <p class="body-1"><b>Worth Knowing: </b> {{ user_info.worth_knowing }}</p>
    </v-layout>
    <v-layout class="divbottomline" row wrap>
      <p class="body-1"><b>Additional Notes: </b> {{ user_info.additional_notes }}</p>
    </v-layout>
    <v-layout class="" row wrap mb-2>
      <p class="body-2 subheadingfont">Statistics: N/A</p>
    </v-layout>
 -->

  </v-container>
</template>


<script>
  export default {
    data() {
      return {
        sideNav: false,
        number_of_submissions: this.$store.state.submissions_for_this_business.length,
        show_facebook:false,
        show_instagram:false,
        show_tumblr:false,
        //,user_info: {business_name: null, email: null, url: null}
      }
    },
    beforeCreate: async function () {
      this.number_of_submissions = this.$store.state.submissions_for_this_business.length
    },
    mounted: function()
    {
      //console.log('Signed in user: ', this.$store.getters.signed_in_user)
      this.$store.dispatch('get_admin_info', 'BY8KZZD5eMMvaNAOaGuDVqhCTuw1')
      //console.log('admin business info: ', this.$store.getters.infoArray)
    },  
    computed: {
      business_info(){
        this.$store.getters.get_business_info;
        console.log("business info is " , this.$store.getters.get_business_info);
        return  this.$store.getters.get_business_info;
      },
      user_info() {
        let myArray=this.$store.getters.signed_in_user
        if(myArray.facebook_url != "")
          this.show_facebook=true
        if(myArray.instagram_url != "")
          this.show_instagram=true
        if(myArray.tumblr_url != "")
          this.show_tumblr=true
        
        return myArray 
      },
      loading() {
        return this.$store.getters.loading;
      }
    },
  }

</script>
<style scoped>
  .container {
    height: 100vh;
  }
</style>

