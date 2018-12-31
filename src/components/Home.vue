<template>

  <v-container class="home">

    <v-layout row>

      <v-flex xs4 ml-5 hidden-md-and-down class="left-row">

        <v-layout row>
          <img src="/static/images/31007053_909050839267466_1346698884130275328_n.jpg" class="image left fadeImage3" style="height: 125px">
          <img src="/static/images/12.jpg" class="image left fadeImage2" style="height: 90px; margin-top: 70px">
          <img src="/static/images/9.jpg" class="image left fadeImage2" style="height: 70px; margin-top: 120px">
          <img src="/static/images/4.jpg" class="image left fadeImage1" style="height: 50px; margin-top: 200px">
        </v-layout>

        <v-layout row>
          <img src="/static/images/5.jpg" class="image left ml-5 fadeImage2" style="height: 115px; margin-top: -50px">
          <img src="/static/images/8.jpg" class="image left ml-5 fadeImage3" style="height: 115px">
        </v-layout>

      </v-flex>

      <v-flex lg4 text-xs-center class="center-row hidden-md-and-down">

          <h4 class="display-1 mt-2 mb-4">Share your art.</h4>

          <img src="/static/images/mobile_app.png" class="mr-1" height="60%">

        <v-btn
          flat
          round
          outline
          large
          color="primary"
          class="mt-4 mb-4 signup_button hidden-md-and-down"
          v-on:click="$router.push('/artist_signup')"
        >
          <h5 class="headline">Sign Up Now</h5>
        </v-btn>

          <h6 class="subheading mb-4 link hidden-md-and-down" v-on:click="$router.push('/home2')"><strong>How does it work?</strong></h6>


        <v-layout row class="hidden-md-and-down">
          <img src="/static/images/app-store-icon-300x100.png" height="35px" class="mr-3" style="margin-left: 40px">
          <img src="/static/images/google-play.png" height="31px" style="margin-top: 2px">
        </v-layout>

      </v-flex>

      <v-flex xs4 text-xs-center class="hidden-lg-and-up" v-if="!isMobile" style="height: 450px; margin-bottom: 120px; margin-left: 0px">

          <h4 class="display-1 mt-2 mb-4 ml-3">Share your art.</h4>

          <img src="/static/images/mobile_app.png" class="mr-1" height="90%">

      </v-flex>

      <v-flex xs8 class="hidden-lg-and-up" v-if="!isMobile" style="margin-left: -10px">

        <img src="/static/images/banner.png" width="100%" style="margin-top: 90px !important;">
          
        <v-btn
          flat
          round
          outline
          large
          color="primary"
          class="mt-4 mb-4 signup_button"
          style="margin-left: 65px"
          v-on:click="$router.push('/artist_signup')"
        >
          <h5 class="headline">Sign Up Now</h5>
        </v-btn>

          <h6 class="subheading mb-4 link" style="margin-left: 125px" v-on:click="$router.push('/home2')"><strong>How does it work?</strong></h6>


    <v-layout mb-3 mt-3 row style="width: 215px; margin-left: 85px">
      <img src="/static/images/app-store-icon-300x100.png" height="35px" class="mr-3">
      <img src="/static/images/google-play.png" height="31px" style="margin-top: 2px">
    </v-layout>

      </v-flex>

      <v-layout row wrap text-xs-center v-if="isMobile">

        <v-flex xs12>
          <h4 class="display-1 mt-2 mb-4">Share your art.</h4>
        </v-flex>

        <v-flex xs12>
          <img src="/static/images/mobile_app.png" class="mr-1" height="70%">
        </v-flex>

        <v-flex xs12 style="margin-top: -150px">
        <v-btn
          flat
          round
          outline
          large
          color="primary"
          class="mt-4 mb-4 signup_button"
          v-on:click="$router.push('/artist_signup')"
        >
          <h5 class="headline">Sign Up Now</h5>
        </v-btn>
        </v-flex>

        <v-flex xs12 style="margin-top: -60px">
          <h6 class="subheading mb-4 link" v-on:click="$router.push('/home2')"><strong>How does it work?</strong></h6>
        </v-flex>

        <v-flex xs12>

        <center>
    <v-layout mb-3 row style="width: 215px; margin-left: 5px; margin-top: -10px">
      <img src="/static/images/app-store-icon-300x100.png" height="35px" class="mr-3">
      <img src="/static/images/google-play.png" height="31px" style="margin-top: 2px">
    </v-layout>
    </center>

        </v-flex>

      </v-layout>

      <v-flex xs4 mr-5 hidden-md-and-down class="right-row">

        <v-layout row>
          <img src="/static/images/7.jpg" class="image right fadeImage1" style="height: 50px; margin-top: 200px">
          <img src="/static/images/14.jpg" class="image right fadeImage2" style="height: 70px; margin-top: 120px">
          <img src="/static/images/10.jpg" class="image right fadeImage2" style="height: 90px; margin-top: 70px">
          <img src="/static/images/13.jpg" class="image right fadeImage3" style="height: 125px">
        </v-layout>

        <v-layout row>
          <img src="/static/images/3.jpg" class="image right fadeImage2" style="height: 100px; margin-left: 120px; margin-top: -30px">
        </v-layout>

      </v-flex>

    </v-layout>

    <v-toolbar class="toolbar elevation-0">
      <v-spacer></v-spacer>
      <p class="body-1 link mr-5" v-on:click="$router.push('/support')">SUPPORT</p>
      <p class="body-1 link mr-5" v-on:click="$router.push('/about_us')">ABOUT US</p>
      <p class="body-1 link hidden-md-and-up" v-on:click="$router.push('/business_signup')">APPLY</p>
      <p class="body-1 link hidden-sm-and-down" v-on:click="$router.push('/business_signup')">APPLY FOR A BUSINESS ACCOUNT</p>
      <v-spacer></v-spacer>
    </v-toolbar>

  </v-container>

</template>

<script>
  export default {
    data() {
      return {
        isMobile: false
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    methods: {
      onResize () {
        this.isMobile = window.innerWidth < 768 /* iPad pixel width */
      }
    }
  }
</script>

<style scoped>

  .home {
    margin-top: -10px;
    width: 100%;
  }

  .signup_button {
    height: 40px;
    width: 250px;
  }

  .toolbar {
    width: 100%;
    background-color: white;
    margin-bottom: -50px !important;
  }

  .link {
    cursor: pointer;
  }

  .left-row {

  }

  .center-row {
    height: 675px;

  }

  .right-row {

  }

  .image {
    border-radius: 10px;
  }

  .left {
    margin-left: 20px;
  }

  .right {
    margin-right: 20px;
  }
  
  .fadeImage1 {
    -webkit-animation: fadein 2s;
       -moz-animation: fadein 2s;
        -ms-animation: fadein 2s;
         -o-animation: fadein 2s;
            animation: fadein 2s;
  }

  .fadeImage2 {
    -webkit-animation: fadein 7s;
       -moz-animation: fadein 7s;
        -ms-animation: fadein 7s;
         -o-animation: fadein 7s;
            animation: fadein 7s;
  }

  .fadeImage3 {
    -webkit-animation: fadein 10s;
       -moz-animation: fadein 10s;
        -ms-animation: fadein 10s;
         -o-animation: fadein 10s;
            animation: fadein 10s;
  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

</style>
