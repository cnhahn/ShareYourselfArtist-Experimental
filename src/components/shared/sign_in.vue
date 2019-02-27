<template>

  <v-parallax src="/static/images/12.jpg" height="100%">
    <center>
      <div class="card mt-5 mb-5 pt-4 pb-4 pl-4 pr-4" style="max-width: 700px;background-color: #f9f9fa">
        <v-card class="elevation-0">
          <h6 class="title pt-4 ml-4 mr-4" style="color: #FF7D27;">Get Your Art Seen today – guaranteed a response.</h6>
          <v-card-text style="margin-top: -15px;">
            
              <form @submit.prevent="onSignin">

                      <v-layout row wrap mt-3>

                        <v-flex lg6 md6 sm6 xs12>
                          <div class="text-xs-center">
                            <v-btn color="info"  class="googleButton"
                              @click.prevent="onSigninGoogle">
                              <v-icon style="margin-right: 10px; margin-left: -10px;">fab fa-google</v-icon>
                              <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                              </span>
                              Log in with Google
                            </v-btn>
                          </div>
                        </v-flex>

                        <v-flex lg6 md6 sm6 xs12>
                          <div class="text-xs-center">
                            <v-btn  class="facebookButton"
                              @click.prevent="onSigninFacebook">
                              <v-icon style="margin-left: 5px; margin-right: 10px;">fab fa-facebook</v-icon>
                              <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                              </span>
                              Log in with Facebook
                            </v-btn>
                          </div>
                        </v-flex>

                      </v-layout>

                      <v-layout row wrap mt-4>

                        <v-flex lg12 xs12>
                          <v-text-field
                            name="email"
                            label="Email"
                            id="email"
                            v-model="email"
                            type="email"
                             @keyup.native.enter = "onSignin"
                            required
                          >
                          </v-text-field>
                        </v-flex>

                        <v-flex lg12 xs12>
                          <v-text-field
                            name="password"
                            label="Password"
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            @keyup.native.enter = "onSignin">
                          </v-text-field>
                        </v-flex>

                      </v-layout>

                      <v-layout row>

                        <v-flex>

                          <v-btn
                            depressed
                            large
                            color="primary"
                            @click="onSignin"
                            style="width: 210px"
                          >
                            Sign in
                          </v-btn>

                        </v-flex>
                      </v-layout>

                      <v-layout row wrap mt-4>

                        <v-flex xs12>
                          <p 
                            class="body-2" 
                            style="cursor: pointer; width:120px;"
                            v-on:click="modal2"
                          >
                            Forgot Password?
                          </p>
                        </v-flex>

                        <v-flex>
                          <p 
                            class="body-2" 
                            style="cursor: pointer; width:120px;"
                            v-on:click="$router.push('/business_signup')"
                          >
                            Business Sign Up
                          </p>
                        </v-flex>

                        <v-flex>
                          <p 
                            class="body-2" 
                            style="cursor: pointer;width:120px;"
                            v-on:click="$router.push('/artist_signup')"
                          >
                            Artist Sign Up
                          </p>
                        </v-flex>

                      </v-layout>

                    </form>

                    <v-dialog v-model="dialog2" max-width="490" >
                     <v-card>
                       <h6 class="title pt-4 ml-4 mr-4" style="color: #FF7D27">Reset Password</h6>
                       <h6 class="body-2 pt-4 ml-4 mr-4" style="color: black;">Enter the email account that is associated with Share Yourself Artists.</h6>
                      <v-card-actions>
                        <v-layout row>

                          <v-flex xs12 ml-2>
                            <v-text-field
                              name="email" 
                              label="Email" 
                              id="email" 
                              v-model="email" 
                              type="email"
                              required
                            >
                          </v-text-field>
                         </v-flex>
                      
                       </v-layout>

                        <v-btn
                          color="green darken-1"
                          flat="flat" 
                          @click="reset_password"
                          >
                            Reset
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
            
          </v-card-text>
        
        </v-card>
      </div>
    </center>
  </v-parallax>



  <!--
  <div v-bind:class="classObject">
    <v-container>
      <v-layout row mx-2 mb-5>
        <v-layout row>
          <v-flex xs12 sm12 lg12 pt-5>
            <center>
              <v-card mx-auto v-bind:class="styleObject">
                <v-card-title primary-title mx-auto>
                  <div>
                    <h3 class="mb-0" v-bind:class="textObject">
                      Get Your Art Seen today – guaranteed a response.
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-container style="padding-top: 0vh">
                    <form @submit.prevent="onSignin">
                      <v-layout row wrap>
                        <v-flex>
                          <div class="text-xs-center">
                            <v-btn color="info"  class="googleButton"
                              @click.prevent="onSigninGoogle">
                              <v-icon style="margin-right: 20px;">fab fa-google</v-icon>
                              <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                              </span>
                              Log in with Google
                            </v-btn>
                          </div>
                        </v-flex>
                        <v-flex>
                          <div class="text-xs-center">
                            <v-btn  class="facebookButton"
                              @click.prevent="onSigninFacebook">
                              <v-icon style="margin-left: 10px; margin-right: 20px;">fab fa-facebook</v-icon>
                              <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                              </span>
                              Log in with Facebook
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field
                            name="email"
                            label="Mail"
                            id="email"
                            v-model="email"
                            type="email"
                             @keyup.native.enter = "onSignin">
                            required>
                          </v-text-field>
                          <v-text-field
                            name="password"
                            label="Password"
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            @keyup.native.enter = "onSignin">
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>

                        <v-flex>
                          <v-btn
                            v-bind:large="!mobile"
                            v-bind:small="mobile"
                            outline color="black"
                            @click="onSignin"
                          >
                            Sign in
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-layout row>

                        <v-flex>
                           <v-flex>
                          <v-btn
                            v-bind:large="!mobile"
                            v-bind:small="mobile"
                            depressed flat dark color="black" to="/business_signup">Business Sign Up</v-btn>
                          <v-btn
                            v-bind:large="!mobile"
                            v-bind:small="mobile"
                            depressed flat dark color="black" to="/artist_signup">Artist Sign Up</v-btn>
                        </v-flex>
                          <v-btn
                            v-bind:large="!mobile"
                            v-bind:small="mobile"
                            flat color="black" @click="modal2"><p class="caption">Forgot Password?</p>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </form>
                  </v-container>
                </v-card-text>
              </v-card>
            </center>
          </v-flex>
        </v-layout>

      </v-layout>
      <v-dialog v-model="dialog2" max-width="490" >
        <v-card>
          <v-card-title class="headline">Reset Password</v-card-title>
          <v-card-text>Please enter the email account that is associated with shareyourselfartist.com.</v-card-text>
          <v-card-actions>
            <v-layout row>
              <v-flex xs12 ml-2>
                <v-text-field name="email" label="Mail" id="email" v-model="email" type="email"
                              required>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-btn
              v-bind:large="!mobile"
              v-bind:small="mobile"
              color="green darken-1" flat="flat" @click="reset_password">Reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-container>
  </div>
  -->

</template>

<script>
  export default {
    data() {
      return {
        /*
        mobile: false,
        textObject: {
          headline: !this.mobile,
          mobileText: this.mobile
        },
        classObject: {
          signInBackground: !this.mobile,
        },
        styleObject: {
          signInHolder: !this.mobile,
          signInMobileHolder: this.mobile
        },
        */
        email: '',
        password: '',
        dialog2: false,
      }
    },
    mounted() {
      const that = this;
      /* window.addEventListener('resize', that.onMobile) */
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      error() {
        return this.$store.getters.error
      },
    },
    watch: {
      user(value) {
        if (value !== null && value !== undefined) {
          this.$store.dispatch('fetchUserDocument')
        }
      },
    },
    methods: {
      /*
      onMobile () {
        const width = window.innerWidth;
        if (width < 600) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
        this.classObject.signInBackground = !this.mobile;
        this.styleObject.signInMobileHolder = this.mobile;
        this.styleObject.signInHolder = !this.mobile;
        this.textObject.mobileText = this.mobile;
        this.textObject.headline = !this.mobile;
      },
      */
      onSigninGoogle() {
        this.$store.dispatch('signUserInGoogle')
      },
      onSigninFacebook() {
        this.$store.dispatch('signUserInFacebook').then(
          this.$router.push('/artist_dashboard')
        )
      },
      modal() {
        this.dialog = true
        console.log('user role: ' + this.$store.getters.user_role)
      },
      modal2() {
        this.dialog2 = true
      },
      reset_password() {
        this.$store.dispatch('reset_password', 'ddavisscott@gmail.com')
        this.dialog2 = false
        alert('If the email that you entered is associated with a customer account in our records, you will receive an email from us with instructions for reseting your password. If you do nor receive an email, please check')
      },
      onSignin() {
        this.dialog = true
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
        console.log('signing in')

      },
      onDismissed() {
        this.$store.commit('setError', null)
      }
    }
  }
</script>

<style>
  .googleButton {
    width: 210px;
    background-color: rgb(219, 50, 54) !important;
  }
  .facebookButton {
    width: 210px;
    background-color: rgb(50,68,131) !important;
    color: white !important;
  }
</style>