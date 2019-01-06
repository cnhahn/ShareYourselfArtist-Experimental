<template>
  <v-container>
    <div class="text-xs-center" offset-sm4 id="tour">
        <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
          <template slot-scope="tour">
            <transition name="fade">
              <v-step
                v-if="tour.currentStep === index"
                v-for="(step, index) of tour.steps"
                :key="index"
                :step="step"
                :previous-step="tour.previousStep"
                :next-step="tour.nextStep"
                :stop="tour.stop"
                :is-first="tour.isFirst"
                :is-last="tour.isLast"
                :labels="tour.labels"
              >
              <template v-if="tour.currentStep === 2">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Yes</v-btn>
                    <v-btn type="button" @click="tour.stop" large depressed color="primary">No</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 3">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">Close</v-btn>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
        </v-tour>
      </div>
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
            <v-flex xs12 sm6 offset-sm3>
              <v-btn depressed dark color="black" @click="goBack">Back</v-btn>
              <v-btn depressed color="primary" :disabled="!formIsValid" @click="onSubmit">Submit</v-btn>
              <v-layout>
      <div class="text-xs-center" offset-sm4 id="tour">
        <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
          <template slot-scope="tour">
            <transition name="fade">
              <v-step
                v-if="tour.currentStep === index"
                v-for="(step, index) of tour.steps"
                :key="index"
                :step="step"
                :previous-step="tour.previousStep"
                :next-step="tour.nextStep"
                :stop="tour.stop"
                :is-first="tour.isFirst"
                :is-last="tour.isLast"
                :labels="tour.labels"
              >
              <template v-if="tour.currentStep === 0">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Yes</v-btn>
                    <v-btn type="button" @click="tour.stop" large depressed color="primary">No</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 1">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">Close</v-btn>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
        </v-tour>
      </div>

    </v-layout>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>




<script>
  export default {
    name: 'myTour',
    data() {
      return {
        operation: 'art_upload',
        artistName: '',
        artTitle: '',
        artUrl: '',
        description: '',
        categories: '',
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        steps: [
          {
            target: '#v-step-0',
            content: 'Would you like help with uploading?'
          },
          {
            target: '#v-step-1',
            content: 'Enter the name, title, description and categories you would like viewers to see on your upload. When finished, hit submit and you will be directed to your dashboard'
          }
        ], myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.nextStepCallback
        }
      }
    },
    computed: {
      // Styled by Jin. No modification on code.
      formIsValid () {
        return this.artistName !== '' && this.artTitle !== '' && this.description !== '' && this.categories !== ''
      },

    },

    mounted: function(){
      this.$tours['myTour'].start()
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
        }).then(res => {
           this.$router.push({
              path: 'artist_dashboard'
            })
        })




      },
      previousStepCallback(currentStep) {
        console.log("Previous")
      },
        nextStepCallback(currentStep) {
        console.log("Next")
      }
    }

  }
</script>

<style type="text/css">
  #selectbox{
    margin-top: 20px;
    margin-bottom: 20px;
  }

</style>













