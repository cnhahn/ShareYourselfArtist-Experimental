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

           
            <!--Adds artist's name to sidebar-->
            <a v-bind:href="' mailto:' + this.$store.state.signed_in_user.email">{{ this.$store.state.signed_in_user.email }}</a>
            <!--Adds link to artist's instagram to sidebar-->
            <div v-if = "check_if_artist_has_entered_instagram">
              <a v-bind:href="this.artist_instagram" target="_blank">Visit My Instagram</a>
               <v-list-tile-title style="margin-left: 10px;">{{this.artist_name}}</v-list-tile-title>
              
            </div>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div class="buttons" >
         <router-link
         to="/upload_an_image1">
         <v-btn  v-if ="userIsAuthanticated && user_role == 'artist'" color="black" dark large depressed >
           Upload Art</v-btn>
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
              <v-list-tile-tile @click="" >Reviews </v-list-tile-tile>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthanticated && user_role == 'artist'">
          <v-list-tile-action>
            <v-icon>chat</v-icon>
          </v-list-tile-action>
          <v-list-tile-content light>
            <router-link to="/chat">
            <v-list-tile-tile @click="" >Chat </v-list-tile-tile>
            </router-link>
          </v-list-tile-content>
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
        <p>Share Yourself Artists</p>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items style="padding-top: 25px;">

        <p
          v-if="userIsAuthanticated"
          style="color: #FF7D27; margin-right: 50px; cursor: pointer"
          v-on:click="$router.push('/account')"
        >
          FREEBIE CREDITS: {{this.$store.state.free_credits}}
        </p>

        <p
          v-if="userIsAuthanticated && this.$store.state.credits"
          style="color: #FF7D27; margin-right: 50px; cursor: pointer"
          v-on:click="$router.push('/account')"
        >
          PREMIUM CREDITS: {{this.$store.state.credits}}
        </p>

        <p
          v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'"
          @click="route_to"
          class="body-1 mr-5"
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
          
            <v-list>

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
       <v-flex v-if="userIsAuthanticated" xs3>

        <v-card flat>
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
              </v-card>




      </v-flex>
     </v-layout>
    </main>
  </v-app>
</template>
<script>
export default {
  ///this calls the data for the side bar you need this
  //you also need to add this func in main.vues
  beforeMount(){
    this.$store.dispatch('fetch_top_12_recent_art')
    console.log('fetch_top_12_recent_art": ', this.$store.state.top_12_recent_art)
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
      screen_breakpoint: false,
      screen_breakpoint_2: false,
      sideNav: false,
      items: this.$store.getters.top_12_recent_art,
      top_12_recent_art: this.$store.getters.top_12_recent_art
/////////////////THIS IS FOR TESTING ONLY
    }
  },
computed:{
    avatarSize () {
      return `55px`
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
    return this.$store.getters.url
  }
  },
  methods: {
  onResize() {
    this.screen_breakpoint = window.innerWidth > 1200
    this.screen_breakpoint_2 = window.innerWidth > 525
  },
  go_to_viewed_artist_page(index){
    //const test = this.$store.getters.top_12_recent_art
    //console.log('this.items[index] $#$#%#^#^', test[index])
    this.$store.commit('set_viewed_artist_data',this.items[index])
    this.$router.push({
      name:'viewed_artist_dashboard'
    })
  },
  //This method handles going to a new artist page once you click on one of the featured artworks
  go_to_viewed_artist_page(index){
    const test = this.$store.getters.top_12_recent_art
    console.log('this.items[index] $#$#%#^#^', test[index])
    this.$store.commit('set_viewed_artist_data',this.items[index])
    this.$router.push({
      name:'viewed_artist_dashboard'
    })
  },
    route_to(){
      if (!this.$store.state.art_being_submitted_is_selected && this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'artist_dashboard'
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
  a {
    text-decoration: none;
    }
 </style>