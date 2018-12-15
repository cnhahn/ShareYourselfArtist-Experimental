<template>

  <div v-if="loading" class="loading_holder">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>

  <v-content v-else>

    <v-layout column align-center justify-center>

      <v-container
        grid-list-lrg
        display-2
        text-md-center
        text-xs-center
        v-if="screen_breakpoint"
        class="title1"
      >
          Your Art, Your Way
      </v-container>

      <v-container
        grid-list-lrg
        display-2
        text-md-center
        text-xs-center
        v-if="!screen_breakpoint"
        class="title1"
        >
          Your Art,<br>Your Way
        </v-container>

      <v-container
        grid-list-lrg
        font-wieght
        headline
        text-md-center
        text-xs-center
        v-if="screen_breakpoint"
        class="title2"
      >
        Welcome to Share Yourself Artists, the easiest way to have your work<br />seen by the largest blogs and magazines in the art community!
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
        Welcome to Share Yourself<br />Artists, the easiest way<br/>to have your work seen by<br/> the largest blogs and<br/>magazines in the art<br/>community!
      </v-container>

    </v-layout>

    <v-layout row wrap class="account-btns">

      <v-flex xs12 sm6 pl-3 pr-3 class="text-xs-center text-sm-right">
        <v-btn color="black" dark large depressed style="height:35px; width: 175px;" router to="/business_signup">
          BUSINESS SIGN UP
        </v-btn>
      </v-flex>

      <v-flex xs12 sm6 pl-3 pr-3 class="text-xs-center text-sm-left">
        <v-btn color="black" dark large depressed style="height:35px; width: 175px;" router to="/artist_signup">
        ARTIST SIGN UP
        </v-btn>
      </v-flex>

    </v-layout>

    <img v-if="screen_breakpoint" src="/static/images/banner.png" style="width: 100vw">

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

      <v-container grid-list-lg class="textRow">
        <v-layout row wrap>
          <v-flex lg6 xs12 pl-4 pr-4 v-for="text in texts" v-bind:key="text.title">
            <p class="headline pl-2 pr-2"><strong>{{text.title}}</strong></p>
            <p class="body-1 pl-2 pr-2" style="font-size: 1.1em !important">{{text.body}}</p>
          </v-flex>
        </v-layout>
      </v-container>

    </div>

  </v-content>
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
    margin-top: 20px;
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
    padding-top: 15px;
    background-color: #f8fcfa !important;
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

  .headline {
    color: black;
  }

</style>