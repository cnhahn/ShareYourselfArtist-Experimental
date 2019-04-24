<template>

  <v-app>
    <v-navigation-drawer
      v-model="sideNav"
      temporary
      absolute
      style="z-index: 350"
    >
      <!--button elements(Paypal) are set on the sandbox as z-index 300, so this style(z-index) is NEEDED-->
        <div class="sideNav" >
      <v-list class="pa-1">
        <v-list-tile avatar v-if ="userIsAuthanticated && user_role == 'business'">
          <v-list-tile-avatar v-if ="signed_in_user_avatar != null">
            <img :src="signed_in_user_avatar">
            </v-list-tile-avatar>
            <v-list-tile-avatar color="primary" v-if ="signed_in_user_avatar == null">
            <span class="white--text headline">{{ this.initial }}</span>
            </v-list-tile-avatar>
            <v-list-tile-content >
            <v-list-tile-title>{{this.signed_in_business}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile avatar v-if ="userIsAuthanticated && user_role == 'artist'">
          <v-list-tile-avatar v-if ="signed_in_user_avatar != null"
          :size="avatarSize">
            <img :src="signed_in_user_avatar">
          </v-list-tile-avatar>
          <v-list-tile-avatar color="primary" v-if ="signed_in_user_avatar == null">
            <span class="white--text headline">{{ this.artist_initial }}</span>
          </v-list-tile-avatar>
          <v-list-tile-content flex style="font-size:14px;">


     

            <!--Adds link to artist's instagram to sidebar-->
            <div >
               <v-list-tile-title style="margin-left: 10px;">{{this.$store.getters.signed_in_user.name}}</v-list-tile-title>
            </div>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div class="buttons" >
         <router-link
         to="/upload_an_image1">

         <div class = "Art-Button" ><v-btn  v-if ="userIsAuthanticated && user_role == 'artist'" color="black" dark large depressed >
           Upload Art</v-btn></div>
           </router-link>
      </div>
       <v-container v-if="this.$store.getters.user != null">
      <v-btn  flat small  v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1'"
    to="/dashboard"
      >Admin
      </v-btn>
      </v-container>
      <v-list class="pt-0 hidden-md-and-up" dense>
        <v-list-tile v-for="item in navItems" :key="item.title" :to="item.link" >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-list-tile
        v-for="item in sideNavItems"
        :key="item.title"
        :to="item.link"
        >
          <v-list-tile-action >
              <v-icon >{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content light>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if ="userIsAuthanticated && user_role == 'business'" >
          <v-list-tile-action >
                <!-- <v-badge left color="red">
                  <span slot="badge">{{unreplied_submission}}</span> -->
                  <v-icon>forum</v-icon>
                <!-- </v-badge> -->
          </v-list-tile-action>
          
          <v-list-tile-content light>
            <router-link to="/submissions">
            <v-list-tile-title>Your submissions</v-list-tile-title>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthanticated && user_role == 'artist'">
          <v-list-tile-action>
            <!-- <v-badge left color="red">
            <span slot="badge">{{unread_reviews}}</span> -->
            <v-icon>mail</v-icon>
            <!-- </v-badge> -->
          </v-list-tile-action>

          <v-list-tile-content light>
            <router-link to="/new_reviews">
              <v-list-tile-tile @click="" >
                Reviews
              </v-list-tile-tile>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="userIsAuthanticated && user_role == 'artist'">
          <v-list-tile-action>
            <v-icon>
              chat
            </v-icon>
          </v-list-tile-action>

          <v-list-tile-content light>
            <router-link to="/chat">
              <v-list-tile-tile @click="" >
                Chat
              </v-list-tile-tile>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>
        <br> <br>
        <v-list-tile>
          <v-chip
            v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'"
            flat
            style="width: 165px;"
            color="primary"
            text-color="white"
            v-on:click="$router.push('/account')">
            &nbsp;Freebie Credits&nbsp;&nbsp;: {{this.$store.state.free_credits}}
          </v-chip>
        </v-list-tile>

        <v-list-tile>
          <v-chip
            v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'"
            flat
            color="primary"
            style="width: 165px"
            text-color="white"
            v-on:click="$router.push('/account')">
            Premium Credits: {{this.$store.state.credits}}
          </v-chip>
        </v-list-tile>

      </v-list>
      </div>
    </v-navigation-drawer>

    <v-toolbar flat style="background-color: white; height: 100px; padding-top: 18px;" class="">

      <v-spacer style="max-width:20px;"></v-spacer>
      <v-toolbar-side-icon @click="sideNav = !sideNav"  v-if ="userIsAuthanticated"></v-toolbar-side-icon>
      <router-link v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'" to="/artist_dashboard" tag="span" style= "cursor:pointer">
        <v-avatar>
        <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
      </v-avatar>
      </router-link>
      <router-link v-else-if="userIsAuthanticated && this.$store.state.user_role == 'business'" to="/business_dashboard" tag="span" style= "cursor:pointer">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
      </router-link>
      <router-link v-else to="/" tag="span" style= "cursor:pointer">
      <v-avatar>
        <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
      </v-avatar>
      </router-link>
      <v-toolbar-title class="large-logo" v-if="screen_breakpoint_2">
        <p>SIYA</p>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items style="padding-top: 25px;">




        <p
          v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'"
          v-on:click="$router.push('/blogs')"
          class="body-1 mr-5"
          style="cursor: pointer"
        >
          Blogs/Magazines
        </p>

        <p
          v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'"

          @click="route_to"
          class="body-1 mr-5"
          style="cursor: pointer"
        >
          Submit Your Work
        </p>


        <div
          v-for="item in navItems"
          v-bind:key="item.title"
          class="body-1 mr-5"
          style="cursor: pointer"
          v-if="screen_breakpoint"
          v-on:click="$router.push(item.link)"
        >
          <!-- Responsible for displaying 'Home', 'Blogs/Magazines', 'Support', and 'About Us' in the navbar -->
          <p v-if="!item.spacing">{{item.title}}</p>

          <!-- This creates the larger space between 'About Us' and 'Sign In | Sign Up' and only dispays it
               when the user is not signed in -->
          <p v-if="item.spacing && !userIsAuthanticated" style="margin-left:50px">{{item.title}}</p>
        </div>

        <p
          class="mr-5"
          v-if="!userIsAuthanticated && !screen_breakpoint"
          v-on:click="$router.push('/sign_in')"
          style="cursor: pointer"
        >
          Sign In | Sign Up
        </p>

        <v-menu style="margin-top: -10px; margin-left: -20px" v-if ="userIsAuthanticated">
          <v-btn slot="activator" icon style="width: 40px; height: 40px;">
            <v-icon>more_vert</v-icon>
          </v-btn>

            <v-list style="width: 200px">

              <v-list-tile>
                <router-link to="/support" tag="span" style= "cursor:pointer">
                <v-list-tile-title>Support</v-list-tile-title>
                </router-link>
              </v-list-tile>

              <v-list-tile>
                <router-link to="/about_us" tag="span" style= "cursor:pointer">
                <v-list-tile-title>About Us</v-list-tile-title>
                </router-link>
              </v-list-tile>

              <v-list-tile>
                <router-link to="/profile" tag="span" style= "cursor:pointer">
                <v-list-tile-title>Profile</v-list-tile-title>
                </router-link>
              </v-list-tile>

              <v-divider></v-divider>

              <v-list-tile>
                <router-link to="/" tag="span" style= "cursor:pointer">
                <v-list-tile-title @click="onSignOut">Sign Out</v-list-tile-title>
                </router-link>
              </v-list-tile>

              </v-list>

            </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <main>
      <v-layout row>
      <v-flex v-if="userIsAuthanticated" xs9>
        <router-view ></router-view>
      </v-flex>
      <v-flex v-else xs12>
        <router-view ></router-view>
      </v-flex>
       <v-flex hidden-md-and-down v-if="userIsAuthanticated" xs3>
  <!-- recently submitted -->
        <v-card  flat v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'">
          <p  class="subheading mb-1" style="font-weight: bold; color: black !important;margin-left: 130px;">Recently Submitted Artists</p>
          <v-layout row wrap>
            <v-flex xs12 mt-1 mb-1 v-for="index in 12" v-bind:key="index">
              
              <v-layout  style="cursor: pointer">
                <!-- Profile Picture Icon -->
                <v-flex xs2 @click="clicked_art(top_12_recent_art[index-1].art)" >
                  <v-avatar>
                    <img style="position:absolute; left:130px;" :src="top_12_recent_art[index-1].art.url" >
                  </v-avatar>
                </v-flex>

                <!-- Title and Artist Name  -->
               <v-flex xs10 ml-2  @click="go_to_viewed_artist_page(index-1)">
                  <p class="subheading mt-1" style=" margin-left: 130px;">{{top_12_recent_art[index-1].art.art_title}}</p>
                  <p class="body-1" style="margin-top: -20px; margin-left: 130px;" >{{top_12_recent_art[index-1].art.artist_name}}</p>
                </v-flex> 
              
            </v-layout>
            </v-flex>
          </v-layout>

        <!--
          <v-list two-line>

                <template v-for="index in 12">

                    <v-list-tile
                      :key="top_12_recent_art[index].art.upload_date"
                      avatar
                      @click="go_to_viewed_artist_page(index)"
                    >
                      <v-list-tile-avatar>
                        <img :src="top_12_recent_art[index].art.url">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="top_12_recent_art[index].art.art_title"></v-list-tile-title>
                        <v-list-tile-title v-html="top_12_recent_art[index].art.artist_name"></v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>

            -->

              </v-card>




      </v-flex>
     </v-layout>
    </main>

    <!-- <v-footer
    height="auto"
    style="background-color: #e5e5e5"
    >
    <v-layout justify-center row wrap mt-5 mb-4 ml-4 mr-4>
      <v-spacer></v-spacer>
      <p
          class="ml-3 mr-3"
          v-on:click="$router.push('/about_us')"
          style="cursor: pointer; color: #676d6a"
        >
          About
        </p>
        <p
          class="ml-3 mr-3"
          v-on:click="$router.push('/support')"
          style="cursor: pointer; color: #676d6a"
        >
          Support / FAQs
        </p>
        <a
          href="mailto:nick@shareyourselfartists.com?Subject=Support"
          target="_top"
          style="cursor: pointer; color: #676d6a"
          class="ml-3 mr-3"
        >
          Contact
        </a>

        <v-flex
        style="background-color: #e5e5e5; color: #676d6a"
        text-xs-left
        xs12
      >
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
        <p style="color: #676d6a" class="mt-2">
          &copy; Copyright 2018 Share Yourself Artists
        </p>
      </v-flex>

    </v-layout>
  </v-footer> -->
  
  </v-app>
</template>
<script>
export default {
  ///this calls the data for the side bar you need this
  //you also need to add this func in main.vues
  beforeMount(){
    // this.$store.dispatch('fetch_top_12_recent_art')
    
  },
  mounted() {
      this.loading = false;
      this.onResize()
      window.addEventListener('resize', this.onResize, {passive: true})
    },

    beforeDestroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, {passive: true})
      }
    },
  data(){
    return{
      url: window.location.hostname,
      screen_breakpoint: false,
      screen_breakpoint_2: false,
      sideNav: false, 
/////////////////THIS IS FOR TESTING ONLY
    }
  },
  watch: {
    art_selected_url: function(val) {
      console.log("watching art_selected_url change", val);
      // this.reviewList__unread_reviews()
    }
  },
computed:{
    avatarSize () {
      return `55px`
    },
    top_12_recent_art(){
      return this.$store.getters.top_12_recent_art
    },
  // unread_reviews(){
  //   let Array= this.$store.state.replied_submissions
  //   let unread=0
  //   for(let i=0;i<Array.length;i++){
  //     if(Array[i].read_byartist == false){
  //       unread++
  //     }
  //   }
  //   return unread
  // },
  // unreplied_submission(){
  //   let Array=this.$store.state.submissions_for_this_business
  //   let unreply=0
  //   for(let i=0;i<Array.length;i++){
  //     if(Array[i].replied == false){
  //       unreply++
  //     }
  //   }
  //   return unreply
  num_submissions(){
    return this.$store.state.submissions_for_this_business.length
    console.log(this.url)
  },
  num_reviews(){
    return this.$store.state.replied_submissions.length
  },
  signed_in_business (){
    if (this.$store.state.signed_in_user.business_name != 'undefined' ){
    return this.$store.state.signed_in_user.business_name
    } else {return ''}
  },
  initial () { if (this.$store.state.signed_in_user.name != 'undefined' && this.$store.state.signed_in_user.name != null ){
    return String(this.$store.state.signed_in_user.email).charAt(0)
    } else {return ''}
  },
artist_initial () {
    return String(this.$store.state.signed_in_user.name).charAt(0)
  },
  artist_name () {
    return String(this.$store.state.signed_in_user.name)
  },
//This function gets artist's saved instagram from the firestore
artist_instagram() {
    let instagram_string = ""
    if(this.$store.state.signed_in_user.instagram != null && this.$store.state.signed_in_user.instagram != 'undefined'){
      if(this.$store.state.signed_in_user.instagram.includes('https://') || this.$store.state.signed_in_user.instagram.includes('http://')) {
        console.log('fired')
        instagram_string = String(this.$store.state.signed_in_user.instagram)
      } else {
      instagram_string = "http://" + String(this.$store.state.signed_in_user.instagram)
    }
  }
  return instagram_string
},
  sideNavItems() {
    if (this.$store.getters.user_role =='artist'){
      return this.$store.state.sideNavItems
    }else{
      return this.$store.state.business_side_nav_items
    }
  },
  navItems(){
    if(this.userIsAuthanticated && this.$store.getters.user_role == 'business'){
      return this.$store.state.navItems_Business
    }
    else if(this.userIsAuthanticated && this.$store.getters.user_role == 'artist'){
      return this.$store.state.navItems_User
    }
    else{
      return this.$store.state.navItems
    }
  },
  userIsAuthanticated () {
    return this.$store.getters.user !== null && this.$store.getters.user !== undefined
  },
  //This statement checks the firestore db to see if the artists has entered an instagram
  check_if_artist_has_entered_instagram(){
    return (this.$store.state.signed_in_user.instagram != null && this.$store.state.signed_in_user.instagram != 'undefined' && this.$store.state.signed_in_user.instagram != "")
  },
  user_role(){
    return this.$store.getters.user_role
  },
  signed_in_user_avatar(){
    return this.$store.getters.signed_in_user.profileUrl
  }
  },
  methods: {
    clicked_art(art_piece) {
      console.log("The art piece being passed in is ", art_piece)
      let art_unique_timestamp = art_piece.upload_date
      this.$store.commit('set_clicked_art', art_unique_timestamp)
      localStorage.setItem('clicked_art', art_unique_timestamp)
      const arts= this.top_12_recent_art
      console.log('art_unique_timestamp', art_unique_timestamp)
      for (var i=0; i < arts.length; i++) {
        if (arts[i].art.url === art_piece.url) {
           console.log('art in loop',arts[i])
           localStorage.setItem('art_title',arts[i].art_title)
           localStorage.setItem('description',arts[i].description)
           this.$store.state.signed_in_user.instagram
           localStorage.setItem('url',arts[i].url)
           localStorage.setItem('upload_date', arts[i].upload_date)
           console.log("About to commit art info array " , arts[i].art)
           this.$store.commit('set_viewed_art_image_info' , arts[i].art)
           this.$store.commit('set_categories', arts[i].categories)
           break
        }
      }
      console.log("Error before this line")
      this.art_selected_url = localStorage.getItem('url')
      this.$router.push({
        name: 'art'
      })
    },
  onResize() {
    this.screen_breakpoint = window.innerWidth > 1200
    this.screen_breakpoint_2 = window.innerWidth > 525
  },
  go_to_viewed_artist_page(index){
    //const test = this.$store.getters.top_12_recent_art
    //console.log('this.items[index] $#$#%#^#^', test[index])
    this.$store.commit('set_viewed_artist_data',this.top_12_recent_art[index])
    this.$router.push({
      name:'viewed_artist_dashboard'
    })
  },
  //This method handles going to a new artist page once you click on one of the featured artworks
  go_to_viewed_artist_page(index){
    const test = this.$store.getters.top_12_recent_art
    console.log('this.items[index] ' ,  test[index])
    this.$store.commit('set_viewed_artist_data',this.top_12_recent_art[index])
    this.$store.dispatch('fetchViewedArts', this.$store.getters.viewed_artist_data.art.artist_id).then(response => {
     })
    this.$router.push({
      name:'viewed_artist_dashboard'
    })
  },
    route_to(){
      if (!this.$store.state.art_being_submitted_is_selected && this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              path: 'artist_dashboard'
            })
      }
      if (this.$store.state.art_being_submitted_is_selected && !this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'blogs2'
            })
      }
      if (!this.$store.state.art_being_submitted_is_selected && !this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'artist_dashboard'
            })
      }
       if (this.$store.state.art_being_submitted_is_selected && this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'submit_result'
            })
      }
    },
  onSignOut(){
      this.$store.dispatch('signUserOut')
      this.$store.commit('set_user_to_null')
      //this.$store.getters.user !== null && this.$store.getters.user !== undefined
      console.log('signed out')
    },
}
}
</script>
<style scoped>
   @import url('https://fonts.googleapis.com/css?family=Covered+By+Your+Grace|Over+the+Rainbow" rel="stylesheet');
    .large-logo {
      margin-top:20px;
      margin-left: 30px;
      font-family: 'Covered By Your Grace', cursive;
      font-size: 2em;
    }
    .about{
      margin-left: 150px;
    }
    .buttons{
      margin-top:20px;
      margin-bottom:20px;
    }
  .pa-1{
    margin-bottom:30px;
    margin-top:30px;
  }
  .footer_text{
  position: absolute;
   margin-left: 20px;
   margin-top: 20px;
  }
  .sideNav{
    margin-left: 30px;
  }
  main{
    background-color: #fff;   
  }
  .Art-Button{
    margin-left: 25px;
  }

  a {
    text-decoration: none;
    }
 </style>
