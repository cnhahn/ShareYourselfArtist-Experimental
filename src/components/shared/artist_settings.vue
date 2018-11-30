<template>
  <v-container
    v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' 
    || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' 
    || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1' 
    || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' 
    || this.$store.getters.user.id == 'QBRXqktYi0QigFboM92crKAONKn1'"
  >
    <span class="headline">Edit Artist Settings</span>
    <br>
    <v-form ref="form" v-model="valid" lazy-validation>
      <span>Name:</span>
      <v-text-field v-model="artist_obj.name" v-bind:label="artistName" solo></v-text-field>
      <span>Email:</span>
      <v-text-field v-model="artist_obj.email" :rules="emailRules" v-bind:label="artistEmail" solo></v-text-field>
      <span>Free Credits:</span>
      <v-text-field v-model="artist_obj.free_credits" v-bind:label="artistFree" solo></v-text-field>
      <span>Paid Credits:</span>
      <v-text-field v-model="artist_obj.credits" v-bind:label="artistPaid" solo></v-text-field>
      <span>Instagram:</span>
      <v-text-field v-model="artist_obj.instagram" v-bind:label="artistInsta" solo></v-text-field>
      <span>Photo URL:</span>
      <v-text-field v-model="artist_obj.photoUrl" v-bind:label="artistPhoto" solo></v-text-field>
      <span>Role:</span>
      <v-text-field v-model="artist_obj.role" v-bind:label="artistRole" solo></v-text-field>
      <v-alert></v-alert>
      <v-alert
      :value="successAlert"
      type="success"
      >
        Settings changed Successfully.
      </v-alert>
      <v-alert
      :value="failureAlert"
      type="error"
      >
        Settings changes failed.
      </v-alert>

      <v-btn primary :disabled="!valid" @click="submitData()">Submit Changes</v-btn>
    </v-form>
  </v-container>
</template>
<script>
export default {
  beforeCreate() {

  },
  created(){
    this.artist_obj = JSON.parse(localStorage.getItem('artist_settings_artist'))
    console.log(this.artist_obj)
    console.log(this.artist_obj.name)
  },
  methods: {
    submitData(){
      const promise = this.$store.dispatch('updateArtistSettings', this.artist_obj)
      console.log(promise)
      const self = this
      promise.then(function(status) {
        self.successAlert = true
        self.failureAlert = false
        return
      }).catch(function(){
        self.failureAlert = true
        self.successAlert = false
      })
    }
  },

  computed: {
    artistEmail(){
      return this.artist_obj.email
    },
    artistName(){
      return this.artist_obj.name
    },
    artistFree(){
      return this.artist_obj.free_credits || 'No free credits'
    },
    artistPaid(){
      return this.artist_obj.credits || 'No paid credits'
    },
    artistInsta(){
      return this.artist_obj.instagram || 'No Instagram'
    },
    artistPhoto(){
      return this.artist_obj.photoUrl || 'No Photo'
    },
    artistRole(){
      return this.artist_obj.role
    },
  },

  data() {
    return {
      valid: true,
      artist_obj: {},
      successAlert: false,
      failureAlert: false,
      emailRules: [
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
    };
  }
};
</script>

