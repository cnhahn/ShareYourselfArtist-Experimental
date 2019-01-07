<template>

  <v-container class="home">

    <v-layout row>

        <v-flex xs12 text-xs-center class="center-row">

            <h4 class="display-1 mt-2 mb-4">Share Your Art</h4>
        
        </v-flex>

    </v-layout>

      <v-container
        grid-list-lrg
        font-wieght
        headline
        text-md-center
        text-xs-center
        v-if="screen_breakpoint"
        class="title2"
      >
        Welcome to Share Yourself Artists, the easiest way to share your<br />artwork to millions of art lovers around the world!
      </v-container>

      <v-container
        grid-list-lrg
        font-wieght
        headline
        text-md-center
        text-xs-center
        v-if="!screen_breakpoint"
        class="title2"
      >
        Welcome to Share Yourself<br />Artists, the easiest way<br/>to share your artwork<br/> to millions of art lovers<br/>around the world!
      </v-container>

    <div class="panel1">
      <v-container class="panel1">

        <v-layout row wrap>

          <v-flex xs12 sm12 class="text-xs-center" style="color:#FF7D27; font-size: 2.2em;">
            <p><strong>Three easy steps</strong></p>
          </v-flex>

          <v-flex v-for="(icon, index) in icons" v-bind:key="icon.title" text-sm-left sm4 xs12 pl-4 pr-4 mt-3>
            <center>
            <div class="number-circles text-sm-center">
              <h1 style="font-size: 40px;">{{index + 1}}</h1>
            </div>
            <p style="font-size: 2.2em"><strong>{{icon.title}}</strong></p>
            <v-icon class="iconRow" color="orange darken-2">{{icon.icon}}</v-icon>
            <p class="body-1 text-sm-left" style="font-size: 1.1em !important">{{icon.text}}</p>
            </center>

          </v-flex>

        </v-layout>

      </v-container>

        <center>
      <v-btn
          flat
          round
          outline
          large
          color="primary"
          class="mt-4 mb-4 signup_button "
          v-on:click="$router.push('/artist_signup')"
        >
          <h5 class="headline">Sign Up Now</h5>
        </v-btn>

    </center>

    <center>
    <v-layout mb-3 mt-3 row style="width: 215px; margin-left: 5px">
      <img src="/static/images/app-store-icon-300x100.png" height="35px" class="mr-3">
      <img src="/static/images/google-play.png" height="31px" style="margin-top: 2px">
    </v-layout>
    </center>

      <v-toolbar class="toolbar elevation-0">
      <v-spacer></v-spacer>
      <p class="body-1 link mr-5" v-on:click="$router.push('/support')">SUPPORT</p>
      <p class="body-1 link mr-5" v-on:click="$router.push('/about_us')">ABOUT US</p>
      <p class="body-1 link hidden-md-and-up" v-on:click="$router.push('/business_signup')">APPLY</p>
      <p class="body-1 link hidden-sm-and-down" v-on:click="$router.push('/business_signup')">APPLY FOR A BUSINESS ACCOUNT</p>
      <v-spacer></v-spacer>
    </v-toolbar>

    </div>

  </v-container>

</template>

<script>
  export default {

    beforeCreate() {
      this.loading = true;
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

    methods: {
      onResize() {
        this.screen_breakpoint = window.innerWidth > 745
      }
    },

    data() {
      return {
        screen_breakpoint: false,
        icons: [
          {
            title: "Upload Your Art",
            icon: "cloud_upload",
            text: "Upload your favorite original art pieces onto our user-friendly and life-changing platform."
          },
          {
            title: "Choose A Blog",
            icon: "person",
            text: "Choose between some the internet’s largest art blogs, social media pages, and art magazines."
          },
          {
            title: "Send!",
            icon: "send",
            text: "If accepted, you are on your way to becoming the next online art sensation!"
          }
        ],
        texts: [
          {
            title: "Why people use it",
            body: "Share Yourself Artists puts millions of followers at the tip of your fingers. The platform allows you the recognition you deserve, while saving your time and effort in the process. Share Yourself Artist also guarantees a response from each submission!"
          },
          {
            title: "What you should expect",
            body: "Using Share Yourself Artists has gained me over 10,000 followers and earned me many commission requests. Now everyday I wake up, check my email, and get straight to drawing. Even when my submission does not get accepted, I always get valuable feedback that takes my art to the whole next level!"
          },
        ],
        loading: true
      }
    }
  }
</script>

<style scoped>

  .title1 {
    margin-top: 10px;
    font-family: 'Roboto', sans-serif;
    font-weight: 100;
    font-size: 1.6em;
  }

  .title2 {
    margin-top: -10px;
    margin-bottom: 10px;
    font-family: 'Roboto', sans-serif;
    font-weight: 100;
    font-size: 1.6em;
  }

  v-btn {
    width: 300px;
  }

  .iconRow {
    font-size: 120px;
    color: "primary";
    margin-top: -25px;
  }

  .panel1 {
    padding-top: 0px;
    background-color: white;

  }

  .panel2 {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .account-btns {
    margin-bottom: 10px;
  }

  .number-circles {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FF7D27;
    color: white;
    margin-bottom: 5px;
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

  .textRow {
    margin-bottom: 2px;
  }

  .home {
    margin-top: -10px;
  }

  .toolbar {
    width: 100%;
    background-color: white;
    margin-bottom: -50px !important;
  }

  .link {
    cursor: pointer;
  }

</style>