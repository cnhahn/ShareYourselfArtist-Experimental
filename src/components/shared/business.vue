<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container class="container" v-else>
    <v-layout row mt-5 justify-space-between>
      <img :src="selected_business.url" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>

    <v-layout row wrap mt-t>
      <p class="title">{{selected_business.business_name}}</p>
    </v-layout>
    <v-layout row>
      <p class="caption">Email: {{selected_business.email}}</p>
    </v-layout>
    <v-layout column mb-1>
        <v-flex>
      <a v-if="show_facebook" :href="selected_business.facebook_url" target="_blank">
          <img class="icon" src="/static/images/facebook-logo.png">
      </a>
      <a  v-if="show_instagram" :href="selected_business.instagram_url" target="_blank">
          <img class="icon" src="/static/images/instagram-logo.png">
      </a>
      <a v-if="show_tumblr" :href="selected_business.tumblr_url" target="_blank">
          <img class="icon" src="/static/images/tumblr-logo-2.png">
      </a>
      </v-flex>
    </v-layout>

    <v-layout class="" row wrap mt-5>
      <p class="body-1"><b>Publication: </b> {{selected_business.publication}}</p>
    </v-layout>
    <v-layout class="" row wrap>
      <p class="body-1"><b>About: </b> {{selected_business.about}}</p>
    </v-layout>
    <!-- <v-layout class="" row wrap>
      <p class="body-1"><b>The Good: </b> {{selected_business.the_good}}</p>
    </v-layout> -->
    <v-layout class="" row wrap >
      <p class="body-1"><b>Worth Knowing: </b> {{selected_business.worth_knowing}}</p>
    </v-layout>
    <v-layout class="divbottomline" row wrap>
      <p class="body-1"><b>Additional Notes: </b> {{ selected_business.additional_notes }}</p>
    </v-layout>
    <v-layout class="" row wrap mb-2 mt-2>
      <p class="body-2 subheadingfont"><b>Statistics:</b></p> 
      <p v-if="show_follower_count" class="ml-3"> {{ selected_business.follower_count }}</p>
      <p v-else class="ml-3"> 0 </p>
      <p style="color:#ff7d27"> &nbsp;<b>Followers</b></p>
      <p v-if="show_total_submissions" class="ml-3"> {{ selected_business.total_submissions }}</p>
      <p v-else class="ml-3"> 0 </p>
      <p style="color:#ff7d27"> &nbsp;<b>Total Submissions</b></p>
      <p v-if="show_replied_submissions" class="ml-3"> {{ selected_business.replied_submissions }}</p>
      <p v-else class="ml-3"> 0 </p>
      <p style="color:#ff7d27"> &nbsp;<b>Replied Submissions</b></p>
      <p class="ml-3"> {{ selected_business.reply_time }}</p>
      <p v-if="show_reply_time" style="color:#ff7d27"> &nbsp;<b>Reply Time</b></p> 
    </v-layout>
  </v-container>



</template>


<script>
  export default {
    data() {
      return {
        business_list:[],
        select_blog:'',
        show_facebook:false,
        show_instagram:false,
        show_tumblr:false,
        show_follower_count:false,
        show_total_submissions:false,
        show_replied_submissions:false,
        show_reply_time:false,
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
      selected_business(){
        let myBusiness=""
        for(let i=0; i<this.business_list.length;i++){
            if(this.business_list[i].userId == this.select_blog.userId && this.business_list[i].role == 'business'){
                myBusiness=this.business_list[i]
            }
        }
        if(myBusiness.facebook_url !== "" )
          this.show_facebook=true
        if(myBusiness.instagram_url !== "" )
          this.show_instagram=true
        if(myBusiness.tumblr_url !== "")
          this.show_tumblr=true
        if(myBusiness.follower_count != "" && myBusiness.follower_count != undefined)
          this.show_follower_count=true
        if(myBusiness.total_submissions != "" && myBusiness.total_submissions != undefined)
          this.show_total_submissions=true
        if(myBusiness.replied_submissions != "" && myBusiness.replied_submissions != undefined)
          this.show_replied_submissions=true
        if(myBusiness.reply_time != "" && myBusiness.reply_time != undefined)
          this.show_reply_time=true

        return myBusiness
      },
    },
    created: function(){
      this.business_list=this.$store.getters.businesses
      this.select_blog=this.$store.getters.selectBlog
    }
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
  .title{
    margin-top:20px;
  }
  .fab{
      max-width: 5  00px
  }
  .icon{
      height: 50px
  }
</style>