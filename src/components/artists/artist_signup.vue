<template>
  <v-parallax src="/static/images/15.jpg" height="100%" jumbotron>
    <center>
      <div class="card" style="background-color: rgb(240, 240, 240)">
        <v-card style="margin: 15px;">
          <v-card-title primary-title mx-auto>
            <div>
              <h3 class="headline mb-0">Get Your Art Seen today – guaranteed a response.</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="name" label="Name" id='name' v-model='name' 
                      required> 
                      </v-text-field>
                      <v-text-field name="email" label="Email" id="email" v-model="email" type="email"
                      required> 
                      </v-text-field>
                      <v-text-field 
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required> 
                      </v-text-field>
                      <v-text-field 
                      name="confirmedPassword"
                      label="Confirm Password"
                      id="confirmedPassword"
                      v-model="confirmedPassword"
                      type="password"
                      > 
                      </v-text-field>
                      <v-text-field 
                      name="instagram"
                      label="Instagram (don't have an instagram - enter N/A )"
                      id="instagram"
                      v-model="instagram"
                      required> 
                      </v-text-field>
                       <v-alert v-if="comparePasswords" type="error" :value=true>Passwords do not match</v-alert>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex>
                      <v-btn type="submit" :disabled = "comparePasswords"  >Sign up
                      </v-btn>
                    </v-flex>
                  </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
        </div>
        </center>
  </v-parallax>
</template>

<script>
export default {
  data(){
    return{
      name:'',
      email:'',
      password:'',
      instagram:'',
      confirmedPassword:'',
      role: 'artist'
    }
  },
  computed:{
      user(){
        return this.$store.getters.user
    },
    loading(){
        return this.$store.getters.loading
    },
    comparePasswords() { 
      if(this.password !== this.confirmedPassword && this. confirmedPassword != '' ){
        return true
      }else{
        return false
     }
    },
    error () {
        return this.$store.getters.error
    },
    disabeled () { 
        return this.email == ''
                 && this.password == '' 
                 && this.confirmedPassword == ''
    }
  },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/artist_dashboard')
          this.$store.dispatch('create_a_new_artist', {role:this.role,
                                                      instagram:this.instagram,
                                                      name: this.name,
                                                      email:this.email,
                                                      upload_date: Date.now()})
        
        }
      }
    },
  methods:{
    onSignup(){
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password, user_role: 'artist'})
    },
    onDismissed(){
        this.$store.commit('setError', null)
    }
  }
}
</script>

<style>
  .signInBackground {
    background-image: url('/static/images/15.jpg');
    background-size: cover;
    background-position: center;
  }
  .headline {
    color: orange;
  }
  .card {
    max-width: 700px;
    padding-top: 1%;
    padding-bottom: 1%; 
    margin-top: 5%;
    margin-bottom: 300px;
  }
</style>