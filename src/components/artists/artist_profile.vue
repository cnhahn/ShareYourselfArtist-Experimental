<template>
  <v-container  >
    <center>

            <v-flex lg6 md6 sm12 xs12>
              <v-avatar size="180px" class="avatarStyle" v-bind:cpriolor="black">
                  <img v-if="fetchUserProfilePicture" v-bind:src="fetchUserProfilePicture" alt="avatar">
                  <div v-else>
                    <span style="font-size: 10em; color: white;">{{initial()}}</span>
                  </div>
                </v-avatar>
                <!--TODO: Code for Uploading image. Should modify.-->
                <!-- From store to url -->
                <v-btn
                    style="margin-top: 2vh; margin-left: 1vw;"
                    block
                    flat
                    depressed
                    :color="primary"
                    :loading="imageNotLoaded"
                    :disabled="imageNotLoaded"
                    class="mx-0"
                    @click.native="onPickFile"
                  >
                    Upload Photo
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
                <h1
                  v-if="!onEdit"
                  v-bind="artistInfo.name"
                  class="display-2 text"
                  style="margin-bottom: 2vh; font-weight: lighter"
                >
                  {{fetchUserName}}
                </h1>
                <v-flex v-else xs12>
                  <v-text-field
                    v-model="editInfo.name"
                    label="Name"
                  ></v-text-field>
                  <v-text-field
                    v-model="editInfo.instagram"
                    label="Instagram"
                  ></v-text-field>
                </v-flex>
                <v-divider></v-divider>
                <div style="text-align: left">
                  <p class="text" style="margin-top: 2vh"><strong>Freebie Credits:</strong> {{fetchUserFreeCredits}}</p>
                  <p class="text" style="margin-top: 2vh"><strong>Premium Credits:</strong> {{fetchUserCredits}}</p>
                  <p class="text" style="margin-top: 2vh"><strong>Email:</strong> {{fetchUserEmail}}</p>
                  <p class="text" style="margin-top: 2vh"><strong>Instagram:</strong> {{fetchUserInstagram}}</p>
                  <p class="text" style="margin-top: 2vh">{{getPassedTime(fetchUserSignUpDate)}}</p>
                </div>
                <v-btn v-if="!onEdit" depressed block  flat color="black" @click.native="setEdit">
                  Edit Profile
                </v-btn>
                <v-btn v-if="!onEdit" depressed block  flat router to="/artist_dashboard" color="primary">
                  Go to Dashboard
                </v-btn>

                <v-flex v-else>
                  <v-btn depressed block  flat color="black"
                         :loading="dataNotSent"
                         :disabled="dataNotSent"
                         @click.native="sendEditData">
                    Submit
                  </v-btn>
                  <v-btn depressed block flat color="black" @click.native="resetEdit">
                    Cancel
                  </v-btn>
                </v-flex>

              </div>
            </v-flex>



    </center>
  </v-container>
</template>

<script>
  export default {
    name: 'artist_profile',
    data () {
      return {
        urlProfilepic: this.$store.getters.url,
        file: null,
        onEdit: false,
        dataNotSent: false,
        imageNotLoaded: false,
        editInfo: {
          name: '',
          instagram:'',
          selectedPhotoUrl: ''
        },
        artistInfo: {}
      }
    },
    beforeMount () {
      this.setUserInfo()
    },
    computed: {
      fetchUserProfilePicture () {
        return this.$store.getters.signed_in_user.profileUrl
      },
      fetchUserName () {
        return this.$store.getters.signed_in_user.name
      },
      fetchUserEmail () {
        return this.$store.getters.signed_in_user.email
      },
      fetchUserSignUpDate () {
        return this.$store.getters.signed_in_user.upload_date
      },
      fetchUserColor () {
        return this.$store.getters.signed_in_user.color
      },
      fetchUserFreeCredits () {
        return this.$store.getters.signed_in_user.free_credits
      },
      fetchUserCredits () {
        return this.$store.getters.signed_in_user.credits
      },
      fetchUserInstagram () {
        return this.$store.getters.signed_in_user.instagram
      }
    },
    methods: {

      emptyUserInfo () {
        this.artistInfo = {};
      },
      setUserInfo () {
        this.urlProfilepic = this.$store.getters.signed_in_user.profileUrl
        let userInfo = this.$store.getters.signed_in_user
        console.log(userInfo.name)
        let newArtistInfo = {
          name: userInfo.name,
          email: userInfo.email,
          signUpDate: userInfo.upload_date,
          color: userInfo.color,
          credits: userInfo.credits

        }
        if (typeof userInfo.photoUrl === 'string' && userInfo.photoUrl !== null) {
          newArtistInfo.photoUrl = userInfo.photoUrl
        } else if (typeof userInfo.photoUrl === "object" && userInfo.photoUrl !== null) {
          if(typeof userInfo.photoUrl.data.url === 'string') {
            newArtistInfo.photoUrl = userInfo.photoUrl.data.url
          }
        } else{

        }
        this.artistInfo = newArtistInfo
      },
      onPickFile () {
        this.$refs.fileInput.click()
        this.imageNotLoaded = true
      },
      onFilePicked (event) {
        const files = event.target.files
        let file = files[0]
        console.log('file: ' + file)
        this.file = file
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid image file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.editInfo.selectedPhotoUrl = fileReader.result
          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.editInfo.selectedPhotoUrl})
            .then(() => {
              /* Extra code here to call function UploadProfileImage in index.js
                 store->index.js
              */
              this.imageNotLoaded = false
              this.$store.dispatch('uploadProfileImage')
            })
        })
        fileReader.readAsDataURL(files[0])
      },
      resetEdit () {
        this.onEdit = false
        this.editInfo.name = ''
        this.editInfo.selectedPhotoUrl = ''
      },
      sendEditData () {
        this.dataNotSent = true
        const that = this
        // TODO: should return when item to DB is done
        let editData = {
          instagram:this.editInfo.instagram,
          name: this.editInfo.name,
          photoUrl: this.editInfo.selectedPhotoUrl
        }
        this.$store.dispatch('updateArtistProfileToFirebase', editData).then(() => {
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

<style>
  .profileBackground {
    padding-left: auto;
    padding-right: auto;
  }
  .card {
    max-width: 700px;
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