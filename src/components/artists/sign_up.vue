<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form v-on:submit.prevent="onSignup">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required>
                      </v-text-field>
                      <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      :type="show1 ? 'text' : 'password'"
                      required>
                      </v-text-field>
                      <v-text-field
                      name="confirmedPassword"
                      label="Confirm Password"
                      id="confirmedPassword"
                      v-model="confirmedPassword"
                      type="password"
                      :type="show1 ? 'text' : 'password'"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex>
                      <v-btn type="submit">Sign up</v-btn>
                    </v-flex>
                  </v-layout>
              </form>
            </v-container>
          </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data(){
    return{
      email:'',
      password:'',
      confirmedPassword:'',
      show1: false,
      show2: false
    }
  },
  computed:{
    user(){
        return this.$store.getters.user
    },
    comparePasswords() {
      return this.password !== this.confirmedPassword ? 'Passwords do not match' : '';
    }
  },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },


  methods:{
    onSignup(){
      alert({email:this.email, password:this.password, confirmedPassword:this.confirmedPassword})
      this.$router.push('/')
    }
  }
}
</script>

