<template>
  <v-container fluid class="profileBackground" style="padding-top: 20vh; height: 50vh;">
    <center>
      <v-card class="card">
          <v-layout row wrap>
            <v-flex lg6 md6 sm12 xs12>
              <v-avatar
                size="180px"
                class="avatarStyle"
                v-bind:color="businessInfo.color"
              >
              <!-- If profile picture download url exists in db, display it instead of default avatar -->
              <img v-if="fetchUserProfilePicture" :src='fetchUserProfilePicture' alt="avatar">
              <div v-else>
                <span style="font-size: 20em; color: white;">{{initial()}}</span>
              </div>
              </v-avatar>
              <!-- Button that when clicked prompts for image file for logo -->
              <v-btn
                style="margin-top: 2vh; margin-left: 1vw;"
                block
                flat
                depressed
                color="primary"
                  :loading="imageNotLoaded"
                  :disabled="imageNotLoaded"
                  class="mx-0"
                  @click.native="onPickFile"
              >
              Change Logo
              </v-btn>
              <input type="file"
                style="display:none"
                ref="fileInput"
                accept="image/*"
                @change=onFilePicked
              >     
            </v-flex>
            <v-flex lg6 md6 sm12 xs12>
              <div class="infoContainer">
                <!-- displays profile fields and if onEdit allows them to be edited -->
                <div v-if="!onEdit" style="text-align:left">
                  <p class="text" style="margin-top: 3vh; text-align:left">Email: {{fetchUserEmail}}</p> 
                  <p class="text" style="margin-top: 3vh;">Publication: {{this.$store.getters.signed_in_user.publication}}</p>
                  <p class="text" style="margin-top: 3vh">Follower Count: {{this.$store.getters.signed_in_user.follower_count}}</p>
                  <p class="text" style="margin-top: 3vh">Website: {{this.$store.getters.signed_in_user.website}}</p>
                  <p class="text" style="margin-top: 3vh">About: {{this.$store.getters.signed_in_user.about}}</p>
                  <p class="text" style="margin-top: 3vh">Worth Knowing: {{this.$store.getters.signed_in_user.worth_knowing}}</p>
                  <p class="text" style="margin-top: 3vh">Additional Notes: {{this.$store.getters.signed_in_user.additional_notes}}</p>
                  <p class="text" style="margin-top: 3vh">Instagram: {{this.$store.getters.signed_in_user.instagram_url}}</p> 
                </div>
                <div v-else>
                  <v-text-field v-model="editInfo.publication" label="Publication"></v-text-field>  
                  <v-text-field v-model="editInfo.website" label="Website"></v-text-field>
                  <v-text-field v-model="editInfo.about" label="About"></v-text-field>
                  <v-text-field v-model="editInfo.worth_knowing" label="Worth Knowing"></v-text-field>
                  <v-text-field v-model="editInfo.additional_notes" label="Additional Notes"></v-text-field>
                  <v-text-field v-model="editInfo.instagram_url" label="Add/Change Instagram"></v-text-field>
                </div>
                <p class="text" style="margin-top: 3vh; text-align: left">{{getPassedTime(fetchUserSignUpDate)}}</p>
                <v-flex row v-if="!onEdit">
                <v-btn  
                depressed 
                block  
                color="primary" 
                @click.native="setEdit">
                  Edit Profile
                </v-btn>
                <v-btn 
                  depressed 
                  block 
                  dark 
                  color="black" 
                  @click="exit">
                    Exit
                </v-btn>
                </v-flex>
                <v-flex row v-else>
                  <v-btn 
                  depressed 
                  block   
                  color="primary"
                  :loading="dataNotSent"
                  :disabled="dataNotSent"
                  @click.native="sendEditData">
                    Submit
                  </v-btn>
                  <v-btn 
                  depressed 
                  block 
                  dark 
                  color="black" 
                  @click.native="resetEdit">
                    Back
                  </v-btn>
                </v-flex>
              </div>
            </v-flex>

          </v-layout>
        </v-card>
    </center>
  </v-container>
</template>

<script>
  export default {
    name: 'business_profile',
    data () {
      return {
        file: null,
        onEdit: false,
        dataNotSent: false,
        imageNotLoaded: false,
        editInfo: {
          name: '',
          publication: '',
          follower_count: 0,
          website: '',
          about: '',
          worth_knowing: '',
          additional_notes: '',
          instagram_url: '',
          selectedPhotoUrl: ''
        },
        businessInfo: {}
      }
    },
    mounted () {
      this.setUserInfo()
    },
    computed: {
      fetchUserProfilePicture () {
        return this.$store.getters.signed_in_user.url
      },
      fetchUserName () {
        return this.$store.getters.signed_in_user.business_name
      },
      fetchUserEmail () {
        return this.$store.getters.signed_in_user.email
      },
      fetchUserSignUpDate () {
        return this.$store.getters.signed_in_user.upload_date
      },
      fetchUserColor () {
        return this.$store.getters.signed_in_user.color
      }
    },
    methods: {
      exit () {
        this.$router.push('/business_dashboard')
      },
      emptyUserInfo () {
        this.businessInfo = {};
      },
      setUserInfo () {
        let userInfo = this.$store.getters.signed_in_users        
        let newBusinessInfo = {
          name: userInfo.name,
          email: userInfo.email,
          signUpDate: userInfo.upload_date,
          color: userInfo.color,
          credits: userInfo.credits
        }
        if (userInfo.url === null) {

        } else {
          newBusinessInfo.url = userInfo.url
        }
        this.businessInfo = newBusinessInfo
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {  
        const files = event.target.files
        let file = files[0]   
        this.file = file
        let filename = files[0].name
        // Check if valid image file given
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid image file')
          this.imageNotLoaded = false
        }
        // fileReader.result returns the url of the file locally stored
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.editInfo.selectedPhotoUrl = fileReader.result
          // update state 
          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.editInfo.selectedPhotoUrl})
            .then(() => {
              this.$store.dispatch('uploadProfileImage') // stores file in firebase store and download url in db
            })
        })
        this.imageNotLoaded = false
        fileReader.readAsDataURL(files[0])       
      },
      resetEdit () {
        this.onEdit = false
      },
      sendEditData () {
        this.dataNotSent = true
        const that = this
        // TODO: should return when item to DB is done
        let editData = {
          name: this.editInfo.name,
          photoUrl: this.editInfo.selectedPhotoUrl,
          publication: this.editInfo.publication,
          follower_count: this.editInfo.follower_count,
          website: this.editInfo.website,
          about: this.editInfo.about,
          worth_knowing: this.editInfo.worth_knowing,
          additional_notes: this.editInfo.additional_notes,
          instagram_url: this.editInfo.instagram_url,
        }
        this.$store.dispatch('updateBusinessProfileToFirebase', editData).then(() => {
          setTimeout(function () {
            that.dataNotSent = false
            that.resetEdit()
          }, 2000)
          this.setUserInfo()
        })
      },
      setEdit () {
        this.onEdit = true
        // TODO: set Edit functions
      },
      initial () {
        return String(this.$store.getters.signed_in_user.name).charAt(0)
      },
      getPassedTime (time) {
        var today = new Date()
        var thatDay = new Date(time)
        var passedTime = today - thatDay
        var passedDay = new Date(passedTime)
        if (passedDay.getFullYear() > 1970) {
          return 'Joined ' + passedDay.getFullYear() + ' years ago'
        } else if (passedDay.getMonth() > 0) {
          return 'Joined ' + passedDay.getUTCMonth() + ' months ago'
        } else {
          var date = passedDay.getDate() - 1
          return 'Joined ' + date + ' days ago'
        }
      }
    }
  }
</script>

<style scoped>
  .profileBackground {
    background-size: cover;
    background-blend-mode: darken;
    background-position: center;
    padding-left: auto;
    padding-right: auto;
  }
  .card {
    max-width: 900px;
    margin-bottom: 100px;
    padding: 15px;
  }
  .avatarStyle {
    margin-top: 5vh;
  }

  .infoContainer {
    padding: 5px;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>