<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container class="container" v-else>
    <v-layout row mt-5 justify-space-between>
      <img :src="`${user_info.url}`" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>
    <v-layout>
      <div class="text-xs-center">
        <v-btn large depressed color="primary" router to="/submissions">Your Submissions</v-btn>
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
        show_tumblr:false
      }
    },
    beforeCreate: async function () {
      this.number_of_submissions = this.$store.state.submissions_for_this_business.length
    },
    computed: {
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

  .divbottomline {
    border-bottom: 1px solid #e0e0e0;
  }
  .loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
  .icon{
    height:50px
  }
</style>

