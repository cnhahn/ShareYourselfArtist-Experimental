<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-content v-else>

    <v-layout column align-center justify-center>
      <v-container grid-list-lrg display-2 text-md-center class="text-xs-center title1 hidden-sm-and-down">Your Art, Your Way</v-container>
      <v-container grid-list-lrg display-2 text-md-center class="text-xs-center title1 hidden-md-and-up">Your Art,<br>Your Way</v-container>
      <v-container grid-list-lrg font-wieght headline text-md-center class="text-xs-center title2">Share Yourself Artists is the easiest way to share your artwork to millions of art lovers AROUND THE WORLD!

      </v-container>
    </v-layout>

    <v-layout row wrap class="account-btns">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn color="black" dark large depressed style="height:35px; width: 175px" router to="/business_signup">
          BUSINESS SIGN UP
        </v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn color="black" dark large depressed style="height:35px; width: 175px" router to="/artist_signup">ARTIST
          SIGN UP
        </v-btn>
      </v-flex>
    </v-layout>

    <v-parallax class="hidden-sm-and-down" src="/static/images/banner.png" height="400"></v-parallax>

    <div class="panel1">
      <v-container class="panel1">

        <v-layout row wrap>

          <v-flex xs12 sm12 class="text-xs-center" style="color:#FF7D27; font-size: 2.2em;">
            <p><strong>Three easy steps</strong></p>
          </v-flex>

          <v-flex lg4 sm12 v-for="(icon, index) in icons" class="panel2">

            <center>
              <div class="number-circles">
                <h1 style="font-size: 40px">{{index + 1}}</h1>
              </div>
            </center>

            <center><p class="display-1 panel2"><strong>{{icon.title}}</strong></p></center>
            <center>
              <v-icon class="iconRow" color="orange darken-2">{{icon.icon}}</v-icon>
            </center>
            <p class="body-1">{{icon.text}}</p>
          </v-flex>

        </v-layout>

      </v-container>

      <v-container grid-list-lg class="textRow">
        <v-layout row wrap style="margin-left:10px; margin-right:10px">
          <v-flex lg6 xs12 v-for="text in texts">
            <p class="headline"><strong>{{text.title}}</strong></p>
            <p class="body-1">{{text.body}}</p>
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
    },
    data() {
      return {
        icons: [
          {
            title: "Upload Your Art",
            icon: "cloud_upload",
            text: "Upload your favorite art pieces onto our user-friendly, life-changing platform"
          },
          {
            title: "Choose a Blog",
            icon: "person",
            text: "Search between the internet’s largest art blogs, social media pages, and art magazines. Decide which blogs you want to work with!"
          },
          {
            title: "Send!",
            icon: "send",
            text: "If accepted by a blog, you are on your way to becoming the next online art sensation! If the blog chooses to deny your submission you are GUARANTEED feedback from each publication you submit to."
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
    margin-bottom: 20px;
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
  }
  .panel1 {
    background-color: #F2FAF5 !important;
  }
  .panel2 {
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
    margin-bottom: 10px;
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