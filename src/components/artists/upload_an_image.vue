<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2 class="title">
          Art Info
        </h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name='artistName'
                label='Artist Name'
                id='artist-name'
                v-model='artistName'
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name='artTitle'
                label='Art Title'
                id='art-title'
                v-model='artTitle'
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field multi-line
                            name='description'
                            id='art-description'
                            label='Please provide a description about the piece '
                            :rules="[(v) => v.length <= 120 || 'Max 120 characters']"
                            :counter="120"
                            v-model='description'
                            required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
            </v-flex>
          </v-layout>

<!-- Associated tags for uploads -->

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-card id="selectbox">
                  <v-container
                    fluid
                  >
                    <v-layout
                      align-center
                      wrap
                    >
                        <v-select
                          :items="items"
                          attach
                          chips
                          name='categories'
                          id='categories'
                          label='categories'
                          v-model='categories'
                          required
                          multiple
                        ></v-select>
                    </v-layout>
                  </v-container>
                </v-card>
            </v-flex>
          </v-layout>



          <v-layout row>
            <v-flex xs12 sm6 offset-sm8>
              <v-btn depressed dark color="black" @click="goBack">Back</v-btn>
              <v-btn depressed color="primary" :disabled="!formIsValid" @click="onSubmit">Submit</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>




<script>
  export default {
    data() {
      return {
        operation: 'art_upload',
        artistName: '',
        artTitle: '',
        artUrl: '',
        description: '',
        categories: '',
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract']
      }
    },
    computed: {
      // Styled by Jin. No modification on code.
      formIsValid () {
        return this.artistName !== '' && this.artTitle !== '' && this.description !== '' && this.categories !== ''
      },

    },
    methods: {
      goBack () {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      onSubmit () {
        this.$store.commit('set_image_folder', '/')
        this.$store.dispatch('uploadImage', {
          operation: this.operation,
          artist_name: this.artistName,
          description: this.description,
          art_title: this.artTitle,
          categories: this.categories,
          folder: this.folder,
          upload_date: Date.now()
        }).then(response => {
          this.$router.push('/artist_dashboard')
        })
      },
    }

  }
</script>

<style type="text/css">
  #selectbox{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>













