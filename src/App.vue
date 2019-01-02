<template>

  <v-app>

    <v-toolbar flat v-if="!userIsAuthanticated" class="toolbar2">

      <v-spacer></v-spacer>
      
      <div class="toolbar-icon">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
        <h6 class="title ml-1 mt-2">SIYA</h6>
      </div>

      <v-spacer></v-spacer>

      <p class="body-1 mr-5 link" v-on:click="$router.push('/sign_in')">Sign In</p>

    </v-toolbar>

    <v-toolbar flat v-if="userIsAuthanticated" class="toolbar">

      <v-spacer class="sm-spacer"></v-spacer>

      <v-toolbar-side-icon v-if="userIsAuthanticated" @click="sideNav = !sideNav" class="mr-4 hidden-sm-and-down"></v-toolbar-side-icon>
      <v-toolbar-side-icon v-if="userIsAuthanticated" @click="drawer = !drawer" class="mr-4 hidden-md-and-up"></v-toolbar-side-icon>

      <router-link v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'" to="/artist_dashboard" tag="span" class="link">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
      </router-link>

      <router-link v-else-if="userIsAuthanticated && this.$store.state.user_role == 'business'" to="/business_dashboard" tag="span" class="link">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
      </router-link>

      <router-link v-else to="/" tag="span" class="link">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
      </router-link>

      <v-toolbar-title v-if="screen_breakpoint_2" class="large-logo">
        <p>Share Yourself Artists</p>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="link toolbar-links">

        <p v-if="userIsAuthanticated" v-on:click="$router.push('/account')" class="credit-link">
          FREEBIE CREDITS: {{this.$store.state.free_credits}}
        </p>

        <p v-if="userIsAuthanticated && this.$store.state.credits" v-on:click="$router.push('/account')" class="credit-link">
          PREMIUM CREDITS: {{this.$store.state.credits}}
        </p>

        <p v-if="userIsAuthanticated && this.$store.state.user_role == 'artist'" v-on:click="$router.push('/blogs')" class="body-1 mr-5">
          Blogs/Magazines
        </p>

        <div
          v-for="item in navItems"
          v-bind:key="item.title"
          class="body-1 mr-5"
          v-if="screen_breakpoint"
          v-on:click="$router.push(item.link)"
        >
          <p v-if="!item.spacing">{{item.title}}</p>
          <p v-if="item.spacing && !userIsAuthanticated" style="margin-left:50px">{{item.title}}</p>
        </div>

        <p class="mr-5 link" v-if="!userIsAuthanticated && !screen_breakpoint" v-on:click="$router.push('/sign_in')">
          Sign In | Sign Up
        </p>

        <v-menu v-if ="userIsAuthanticated" class="drop-menu">

          <v-btn slot="activator" icon class="drop-menu-icon">
            <v-icon>more_vert</v-icon>
          </v-btn>
          
          <v-list>

            <v-list-tile>
              <router-link to="/support" tag="span" class="link">
                <v-list-tile-title>Support</v-list-tile-title>
              </router-link>
            </v-list-tile>

            <v-list-tile>
              <router-link to="/about_us" tag="span" class="link">
                <v-list-tile-title>About Us</v-list-tile-title>
              </router-link>
            </v-list-tile>

            <v-list-tile>
              <router-link to="/profile" tag="span" class="link">
                <v-list-tile-title>Profile</v-list-tile-title>
              </router-link>
            </v-list-tile>
              
            <v-divider></v-divider>

            <v-list-tile>
              <router-link to="/" tag="span" class="link">
                <v-list-tile-title @click="onSignOut">Sign Out</v-list-tile-title>
              </router-link>
            </v-list-tile>

          </v-list>

        </v-menu>

      </v-toolbar-items>

    </v-toolbar>

    <main class="main">

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="width: 225px"
    >
      <v-list class="mt-1 ml-4" v-if ="userIsAuthanticated">

            <v-list-tile avatar v-if ="userIsAuthanticated && user_role == 'business'">

              <v-list-tile-avatar v-if="signed_in_user_avatar != null">
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

              <v-list-tile-avatar v-if ="signed_in_user_avatar != null" :size="avatarSize">
                <img :src="signed_in_user_avatar">
              </v-list-tile-avatar>

              <v-list-tile-avatar color="primary" v-if ="signed_in_user_avatar == null">
                <span class="white--text headline">{{ this.artist_initial }}</span>
              </v-list-tile-avatar>

              <p class="body-1 mt-3">{{this.artist_name}}</p>

            </v-list-tile>

            <v-btn depressed to="upload_an_image1" v-if ="userIsAuthanticated && user_role == 'artist'" style="width: 160px; height: 30px; color: white; background-color: black">
              <small>Upload Art</small>
            </v-btn>

            <v-btn depressed to="submissions" v-if ="userIsAuthanticated && user_role == 'business'" style="width: 160px; height: 30px; color: white; background-color: black">
              <small>Submissions</small>
            </v-btn>

            <v-btn flat outline to="artist_dashboard" v-if ="userIsAuthanticated && user_role == 'artist'" color="black" style="width: 160px; height: 30px">
              <small>Dashboard</small>
            </v-btn>

            <v-btn flat outline to="business_dashboard" v-if ="userIsAuthanticated && user_role == 'business'" color="black" style="width: 160px; height: 30px">
              <small>Dashboard</small>
            </v-btn>

            <v-btn flat outline color="black" to="dashboard" v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1'" style="width: 160px; height: 30px">
              <small>Administrator</small>
            </v-btn>

            <v-btn v-for="item in sideNavItems" v-bind:key="item.link" depressed color="white" style="width: 160px;" :to="item.link">
              <v-layout>
                <v-flex sm2 style="margin-top: 14px">
                  <v-icon>{{ item.icon }}</v-icon>
              </v-flex>
              <span><p class="ml-2 mt-3 body-2"><small>{{ item.title }}</small></p></span>
              </v-layout>
            </v-btn>
            
          </v-list>
    </v-navigation-drawer>

      <v-layout row>  

        <v-flex sm1 v-if="userIsAuthanticated && sideNav == false">
          
        </v-flex>


        <v-flex xs2 v-if="userIsAuthanticated && sideNav == true" class="hidden-sm-and-down ml-2 mr-3">
          <v-list class=" ml-3 pa-0">

            <v-list-tile avatar v-if ="userIsAuthanticated && user_role == 'business'">

              <v-list-tile-avatar v-if="signed_in_user_avatar != null">
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

              <v-list-tile-avatar v-if ="signed_in_user_avatar != null" :size="avatarSize">
                <img :src="signed_in_user_avatar">
              </v-list-tile-avatar>

              <v-list-tile-avatar color="primary" v-if ="signed_in_user_avatar == null">
                <span class="white--text headline">{{ this.artist_initial }}</span>
              </v-list-tile-avatar>

              <p class="body-1 mt-3">{{this.artist_name}}</p>

            </v-list-tile>

            <v-btn depressed to="upload_an_image1" v-if ="userIsAuthanticated && user_role == 'artist'" style="width: 160px; height: 30px; color: white; background-color: black">
              <small>Upload Art</small>
            </v-btn>

            <v-btn depressed to="submissions" v-if ="userIsAuthanticated && user_role == 'business'" style="width: 160px; height: 30px; color: white; background-color: black">
              <small>Submissions</small>
            </v-btn>

            <v-btn flat outline v-if="user_role == 'artist'" to="artist_dashboard" color="black" style="width: 160px; height: 30px">
              <small>Dashboard</small>
            </v-btn>

            <v-btn flat outline v-if="user_role == 'business'" to="business_dashboard" color="black" style="width: 160px; height: 30px">
              <small>Dashboard</small>
            </v-btn>

            <v-btn flat outline color="black" to="dashboard" v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1'" style="width: 160px; height: 30px">
              <small>Administrator</small>
            </v-btn>

            <v-btn v-for="item in sideNavItems" v-bind:key="item.link" depressed color="white" style="width: 160px;" :to="item.link">
              <v-layout>
                <v-flex sm2 style="margin-top: 14px">
                  <v-icon>{{ item.icon }}</v-icon>
              </v-flex>
              <span><p class="ml-2 mt-3 body-2"><small>{{ item.title }}</small></p></span>
              </v-layout>
            </v-btn>
            
          </v-list>
        </v-flex>


        <v-flex sm12 v-if="userIsAuthanticated" class="hidden-md-and-up">
          <router-view></router-view>
        </v-flex>

        <v-flex sm12 v-if="userIsAuthanticated" class="hidden-sm-and-down">
          <router-view></router-view>
        </v-flex>

        <v-flex 
          sm4 mt-2 
          v-if="userIsAuthanticated && 
                ($route.name == 'upload_an_image1' || $route.name == 'support' || $route.name == 'artist_dashboard')" 
          class="hidden-md-and-down ml-4 mr-4"
        >

          <v-card  flat v-if="userIsAuthanticated">
          <p  class="subheading mb-1" style="font-weight: bold; color: black !important">Recently Submitted Artists</p>
          <v-layout row wrap>
            <v-flex xs12 mt-1 mb-1 v-for="index in 12" v-bind:key="index">
              <v-layout @click="go_to_viewed_artist_page(index)" style="cursor: pointer">
                <v-flex xs2 mr-2>
                  <v-avatar>
                    <img :src="top_12_recent_art[index].art.url">
                  </v-avatar>
                </v-flex>

                <v-flex xs10 ml-2>
                  <p class="subheading mt-1">{{top_12_recent_art[index].art.art_title}}</p>
                  <p class="body-1" style="margin-top: -20px">{{top_12_recent_art[index].art.artist_name}}</p>
                </v-flex>
          </v-layout>
            </v-flex>
          </v-layout>
              </v-card>

        </v-flex>

        <v-flex 
          sm1 mt-2 
          v-if="userIsAuthanticated && 
                ($route.name != 'upload_an_image1' && $route.name != 'support' && $route.name != 'artist_dashboard')" 
          class="hidden-md-and-down ml-2 mr-2"
        >
        </v-flex>

        <v-flex xs12 v-if="!userIsAuthanticated">
          <router-view></router-view>
        </v-flex>



      </v-layout>
    </main>

    <v-footer height="auto" class="footer" v-if="userIsAuthanticated">
      <v-layout justify-center row wrap mt-5 mb-4 ml-4 mr-4>
        <v-spacer></v-spacer>

        <p class="ml-3 mr-3 link footer-link" v-on:click="$router.push('/about_us')">
          About
        </p>

        <p class="ml-3 mr-3 link footer-link" v-on:click="$router.push('/support')">
          Support / FAQs
        </p>

        <a class="ml-3 mr-3 link footer-link" href="mailto:nick@shareyourselfartists.com?Subject=Support" target="_top" style="text-decoration: none">
          Contact
        </a>

        <v-flex text-xs-left xs12 class="footer-link">

          <v-avatar>
            <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
          </v-avatar>

          <p class="mt-2 footer-link">
            &copy; Copyright 2018 Share Yourself Artists
          </p>

        </v-flex>

      </v-layout>
    </v-footer>


  </v-app>
</template>




<script>

export default {

  // this calls the data for the side bar you need this you also need to add this func in main.vues
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
      sideNav: true,
      drawer: false,
      items2: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
      items: this.$store.getters.top_12_recent_art,
      top_12_recent_art: this.$store.getters.top_12_recent_art
      /////////////////THIS IS FOR TESTING ONLY
    }
  },

  computed:{
    avatarSize () {
      return `55px`
    },
    /*
    unread_reviews(){
      let Array= this.$store.state.replied_submissions
      let unread=0
      for(let i=0;i<Array.length;i++){
        if(Array[i].read_byartist == false){
          unread++
        }
      }
      return unread
    },
    unreplied_submission(){
      let Array=this.$store.state.submissions_for_this_business
      let unreply=0
      for(let i=0;i<Array.length;i++){
        if(Array[i].replied == false){
          unreply++
        }
      }
      return unreply
    }
  */

    num_submissions() {
      return this.$store.state.submissions_for_this_business.length
    },
    num_reviews(){
      return this.$store.state.replied_submissions.length
    },
    signed_in_business () {
      if (this.$store.state.signed_in_user.business_name != 'undefined' ) {
      return this.$store.state.signed_in_user.business_name
      } else {return ''}
    },
    initial () { 
      if (this.$store.state.signed_in_user.name != 'undefined' && this.$store.state.signed_in_user.name != null ){
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
      console.log('signed out')
    },
}
}
</script>



<style scoped>

   @import url('https://fonts.googleapis.com/css?family=Covered+By+Your+Grace|Over+the+Rainbow" rel="stylesheet');
    
  .toolbar {
    background-color: white; 
    height: 100px; 
    padding-top: 18px;
  }

  .toolbar2 {
    background-color: white; 
    height: 100px; 
    padding-top: 25px;
  }

  .main {
    background-color: white;
  }

  .sm-spacer {
    max-width: 20px;
  }

  .link {
    cursor: pointer;
  }

  .large-logo {
    margin-top:20px;
    margin-left: 30px;
    font-family: 'Covered By Your Grace', cursive;
    font-size: 2em;
  }

  .toolbar-links {
    padding-top: 25px;
  }

  .credit-link {
    color: #FF7D27;
    margin-right: 50px;
  }

  .drop-menu {
    margin-top: -10px;
    margin-left: -20px
  }

  .drop-menu-icon {
    width: 40px; 
    height: 40px;
  }

  .footer {
    background-color: #E5E5E5;
  }

  .footer-link {
    color: #676D6A;
  }

  .toolbar-icon {
    margin-left: 75px;
  }


 </style>
