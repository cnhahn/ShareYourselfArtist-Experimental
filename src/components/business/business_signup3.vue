<template>
         <v-parallax src="/static/images/15.jpg" height="100%"
      jumbotron>
       <center><div class = "card" style = "max-width: 700px;  padding-top:1%; padding-bottom:1%; margin-top:20%; margin-bottom:300px;" >
   <v-card  >
       <v-card-title primary-title mx-auto>
            <div>
              <h3 class="headline mb-0">Get Paid Today with Share Yourself Artists's easy to use platform.</h3>
            </div>
          </v-card-title>

                    <form>
                    <v-layout row >
                        <v-flex>
                            <v-text-field
                            name='business_name'
                            label= 'Business Name'
                            id= 'business_name'
                            v-model='business_name'
                            required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                     <v-layout row>
                        <v-flex>
                            <v-text-field
                            name='email'
                            label= 'Email'
                            id='email'
                            v-model= 'email'
                            :rules="emailRules"
                            required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex>
                            <v-text-field
                            name='password'
                            id='password'
                            label= 'password'
                            v-model='password'
                            :type="show1 ? 'text' : 'password'"
                            counter
                            required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex>
                            <v-text-field
                            name='password_retype'
                            id='password_retype'
                            label= 'Retype your password'
                            v-model='password_retype'
                            :type="show2 ? 'text' : 'password'"
                            required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                      <v-layout row mb-5>
                       <v-spacer></v-spacer>
                <v-btn depressed color="primary" router to="/business_signup2" :disabled = "!formIsValid" @click="onSignup">Next</v-btn>

        </v-layout>
                </form>
        </v-card>
    </div></center>


</v-parallax>


</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
export default {

    data(){
        return {
            business_name: '',
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
             ],
            password: null,
            password_retype: null,
            show1: false,
            show2: false
        }
    },
    computed: {
        formIsValid () {
            return this.name !=='' && this.email !== '' && this.password !== null && this.retype !== null
        },
        emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      }

    },
    methods:{
    onSignup(){
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password, user_role: 'business'})
      this.$store.commit('business_signing_up', {business_name: this.business_name, email: this.email})
    },




        }

    }

</script>
<style scoped>
 .formTitle{
     color: orange;
 }
 .card{
     margin:2%;
     padding:1%
 }

</style>







