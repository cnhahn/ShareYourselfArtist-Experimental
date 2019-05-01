<template>
  <v-parallax src="/static/images/15.jpg" height="100%">
    <center>
        <div class="card mt-5 mb-5 pt-4 pb-4 pl-4 pr-4" style="max-width: 700px;background-color: #f9f9fa">
        
            <v-card class="elevation-0">
            
            <h6 class="title pt-4 ml-4 mr-4" style="color: #FF7D27;"> Please request an access code from your business admin.</h6>

            <v-card-text style="margin-top: -15px;">

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
                            name="Access Code"
                            label="Enter Your Access Code"
                            id="accessCode"
                            v-model="accessCode"
                            required> 
                            </v-text-field>

                            <v-alert v-if="comparePasswords" type="error" :value=true>Passwords do not match</v-alert>

                        </v-flex>
                    </v-layout>

                    <v-layout row>

                        <v-flex>

                            <v-btn 
                                depressed 
                                large 
                                color="primary" 
                                type="submit"
                                :disabled="comparePasswords"
                            >
                                Sign Up
                            </v-btn>

                            <!-- Alert user if their access code matches / doesn't match -->
                            <!-- <v-alert
                            v-if="checkAccessCode"
                            :value="true"
                            type="success"
                            >
                                This is a success alert.
                            </v-alert> -->

                            <v-alert
                            v-if="!checkAccessCode && checkAccessCode != null"
                            :value="true"
                            type="error"
                            >
                                This is a failure alert.
                            </v-alert>

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
        checkAccessCode :  null,
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
        /*if (value !== null && value !== undefined) {
          this.$router.push('/artist_dashboard')
          this.$store.dispatch('create_a_new_artist', 
            {
                role:this.role,
                instagram:this.instagram,
                name: this.name,
                email:this.email,
                upload_date: Date.now()
            })
        }*/
      }
    },
    methods:{
        onSignup(){
            console.log("we are here in onSignup")
            //check if access code is correct.
            //If it is correct, we will tell the user and re-direct
            //Else, we will tell the user that the access code was wrong. 
            this.checkAccessCode = false;
            console.log(this.email)
            console.log(this.password)
            // accessCode = false;
        this.$store.dispatch('signUserUp', {email: this.email, password: this.password, user_role: 'business_group'})
            this.$router.push('/group_business_dashboard')
        },
        onDismissed(){
            this.$store.commit('setError', null)
        }
    }
}
</script>

<style>

</style>