<template>

  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>


  <v-container v-else>

    <!-- If no images are found with the selected categories, display a toast message to the user  -->
    <div v-if="noneFound">
      <v-card>
        <v-snackbar
          v-model="snackbar"
          :bottom="y === 'bottom'"
          :left="x === 'left'"
          :multi-line="mode === 'multi-line'"
          :right="x === 'right'"
          :timeout="timeout"
          :top="y === 'top'"
          :vertical="mode === 'vertical'"
        >
          {{ text }}
          <v-btn color="pink" flat @click="snackbar = false"> Close </v-btn>
        </v-snackbar>
      </v-card>
    </div>

    <!-- This is where the user can choose categories to filter their art submissions by -->
    <v-layout row>
      <v-flex lg9 offset-lg1 mt-5>
        <v-card flat id="selectbox">
            <v-container fluid>
              <v-layout xs12 lg10 offset-lg3 ml-5 align-center wrap>
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
                    v-on:blur="updateCon(categories, def, arts, noneFound, snackbar)"
                  ></v-select>
              </v-layout>
            </v-container>
          </v-card>
      </v-flex>
    </v-layout>

    <v-tabs color="primary" light grow>

      <v-tab >  Dashboard </v-tab>
           <v-spacer></v-spacer>
        <v-tab-item :value="dashboard-tab">

          <v-layout row wrap mb-5>
              <v-flex v-if="def.length == 0" xs12 lg10 offset-lg2 mt-5 mr-5 v-for="art,index in arts" :key='art.id'>
                <v-card mt-3>
                <v-card-media img :src="art.url" height="450px">
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{art.art_title}}</h3>
                    <div>
                      <v-chip
                        v-for="(tag, index) in art.categories"
                        :key='tag.id'
                        v-model = 'art.categories[index]'
                        class="display_chips"
                        close
                        @input="removeChip(art.upload_date, art.categories)"
                      >
                        {{art.categories[index]}} </v-chip>
                    </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat @click="clicked_art(art.upload_date)" color="primary">View</v-btn>
                  <v-spacer></v-spacer>

                  <v-btn flat @click="set_art_to_delete(art,index)" color="primary">Delete</v-btn>

                  <div class="text-xs-center">

                    <v-dialog v-model="dialog" width="30%">

                      <v-card>

                        <v-card-title class="headline grey lighten-2" primary-title> Deleting Message </v-card-title>
                        <v-card-text> Are you sure you want to delete? </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>

                          <v-spacer></v-spacer>

                          <v-btn color="primary" @click="delete_art()"> Delete </v-btn>
                          <v-btn color="primary" flat @click="dialog = false"> Go Back  </v-btn>

                        </v-card-actions>

                      </v-card>

                    </v-dialog>

                  </div>

                  <v-spacer></v-spacer>
                  <v-btn flat  color="primary" @click="submit_art(art)">Submit this piece</v-btn>

                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row wrap mb-5>
            <v-flex v-if="def.length != 0" xs12 lg10 offset-lg2 mt-5 mr-5 v-for="art in def" :key='art.id'>
              <v-card mt-3>
                <v-card-media img :src="art.url" height="450px">
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{art.art_title}}</h3>
                    <div>
                      <v-chip
                        v-for="(tag, index) in art.categories"
                        :key='tag.id'
                        v-model = 'art.categories[index]'
                      >
                        {{art.categories[index]}} </v-chip>
                    </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat @click="clicked_art(art.upload_date)" color="primary" router to='/art'>View</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="delete_art()"> Delete </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat  color="primary"
                  @click="submit_art(art)"
                  >Submit this piece</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>

        </v-tab-item>

      <v-tab> Recommended Artists </v-tab>
      <v-tab-item>
          <v-container>
            <v-layout row >
              <v-flex xs12 lg10 offset-lg2 mt-5 mr-5>
                <v-card elevation>
                  <v-list three-line >
                    <template v-for="art in top_ten_category"  >
                          <v-list-tile >
                            <div class = "text-xs-center">
                              <v-list-title-content>
                                <v-list-tile-title > {{art.full_data.name }}</v-list-tile-title>
                              </v-list-title-content>
                            </div>
                          </v-list-tile>
                        
                          <v-list-tile>
                            <div class = "text-xs-center">
                              <v-list-title-content >
                                <v-list-tile-title class ="text-xs-center">  {{art.full_data.email}} </v-list-tile-title>
                              </v-list-title-content>
                            </div>
                          </v-list-tile>
                      <v-divider></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>       
      </v-tab-item>


      <v-tab > Responded Art Pieces </v-tab>
        <v-tab-item>
          <v-container justify-center>
            <v-layout row >
              <v-flex xs12 lg10 offset-lg2 mt-5 mr-5>
                <v-card>
                  <v-list three-line >
                    <template v-for="art in recently_responded_arts">
                      <v-list-tile>
                        <v-list-tile-avatar>
                          <img  :src="art.url" >
                        </v-list-tile-avatar>
                        <v-list-title-content>
                          <v-list-tile-title v-text="art.art_title"></v-list-tile-title>
                          <v-list-sub-title v-text="art.description"></v-list-sub-title>
                        </v-list-title-content>
                      </v-list-tile>
                      
                      <v-list-tile>
                        <v-list-title-content justify-end>
                          <v-list-tile-title> Response By : {{art.business_name}} </v-list-tile-title>
                          <v-list-sub-title v-text="art.response"></v-list-sub-title>                    
                        </v-list-title-content>
                      </v-list-tile>
                      
                    </template>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
    </v-tabs>
  </v-container>
</template>


<script>
/*  buttons for delete can be found on lines 80 and 112*/
  export default {
    /*
    Real-time data(art) fetching from the firestore database.
     */

    data() {
      return {
        snackbar: true,
        dialog: false,
        currentArtToDelete : null,
        currentArtIndex : null,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        text: 'No submissions with selected categories found',
        artList: [],
        chip1:true,
        categories: '',
        def: [],
        noneFound: false,
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
      }
    },
    mounted(){
      this.recommendedArts()
      this.respondedArts()
    },
    computed: {
      top_ten_category(){
        return this.$store.getters.get_top_ten_category;
      },
      recently_responded_arts(){
        let recently_responded_arts = this.$store.getters.get_recently_responded_arts;
        console.log("Returned in computed recently responded is " , recently_responded_arts)
        return recently_responded_arts
      },
      arts() {
        let arts = this.$store.getters.allArts;

        function compare(a, b) {
          const upload_date1 = a.upload_date
          const upload_date2 = b.upload_date
          let comparison = 0;
          if (upload_date1 > upload_date2) {
            comparison = -1;
          } else if (upload_date1 < upload_date2) {
            comparison = 1;
          }
          return comparison;
        }
       
        // create an array that removes all the "deleted" art pieces
        console.log(arts.sort(compare));
        let arti = 0
        var removed_deleted_art = [];
        for (arti = 0 ; arti < arts.length; arti++){
          if(!arts[arti].delete){
            removed_deleted_art.push(arts[arti])
          }
        }

        console.log('remove deleted art', removed_deleted_art)

        return removed_deleted_art;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      respondedArts(){
        console.log("in responded arts")
        this.$store.dispatch('retrieve_recently_responded_arts')
      },
      recommendedArts(){
        console.log('in recommended arts')
        this.$store.dispatch('retrieve_recommended_arts')
      },
      clicked_art(art_unique_timestamp) {
        this.$store.commit('set_clicked_art', art_unique_timestamp)
        localStorage.setItem('clicked_art', art_unique_timestamp)
        const arts= this.$store.state.arts
        var art = {}
        console.log('art_unique_timestamp', art_unique_timestamp)
        for (var i=0; i < arts.length; i++) {
          if (arts[i].upload_date === art_unique_timestamp) {
           console.log('art in loop',arts[i])
           art = arts[i]
           console.log('art in loop',arts[i].art_title)
           localStorage.setItem('art_title',arts[i].art_title)
           localStorage.setItem('description',arts[i].description)
           this.$store.state.signed_in_user.instagram
           localStorage.setItem('url',arts[i].url)
           localStorage.setItem('upload_date', arts[i].upload_date)
           this.$store.commit('set_viewed_art_image_info' , arts[i] )
           this.$store.commit('set_categories', arts[i].categories)
           console.log('art_title',localStorage.getItem('art_title'))
           break
          }
        }
        this.$router.push({
          name: 'art'
        })
      },
      set_art_to_delete(delete_art,idx){
        this.dialog = true
        this.currentArtToDelete = delete_art
        this.currentArtIndex = idx
      },
      delete_art(){
        // Summary of this function
        // The way the list appears is opposite of the way it's stored in the array
        // Aka lowest image on the list is stored at index 0.
        // Thus, clicking delete on lowest image at index 0 deletes object at index 0, which is the top image on the dashboard.
        // So, we get index of picture we want to delete, substract it from the length of the array, and find the element 
        // in the array and delete it. 
        // Also had to implement vuetify components v-card, v-card-actions and v-dialogue
        // let art_to_be_deleted = this.arts[this.arts.length-idx-1]
        console.log("art is  : " , this.currentArtToDelete, "idx is ", this.currentArtIndex, " length of array is " , this.arts.length)
        let art_to_be_deleted = this.arts[this.currentArtIndex]
        console.log("art to be deleted is " , art_to_be_deleted)
        this.$store.dispatch('delete_art_piece', art_to_be_deleted)
        this.dialog=false
      },

      filterCategories(filterCategories, artCategories, def, art) {
          return filterCategories.every(function (value) {
            if(artCategories.indexOf(value) >= 0){
              return true
            }
              return false
          });
      },

      updateCon(categories, def, arts, noneFound, snackbar){
        if(def.length != 0){
          def.splice(0, def.length);
        }
        for(let i = 0; i<arts.length; i++){
          for (let j = 0; j<categories.length; j++){
            if (arts[i].categories != undefined) {
              if (arts[i].categories.includes(categories[j]) && !def.includes(arts[i]))
              {
                def.push(arts[i])
              }
            }
          }
        }
        this.noneFound = false
        if(def.length == 0){
          if(categories.length != 0){
            this.noneFound = true
            this.snackbar = true
          }
        }
        console.log("value of none: " + this.noneFound)
      },

      removeChip(upload_date, categories) {
        console.log(upload_date + " " + categories)
          this.$store.dispatch('update_art_category_tags', {upload_date: upload_date, categories: categories})
      },

      submit_art(art){
        this.$store.commit('set_user_email')
        this.$store.commit('set_art_being_submitted',art)
        this.$store.commit('set_art_being_submitted_is_selected',true)
        if(this.$store.state.business_being_submitted_is_selected == true){
           this.$router.push({
              name: 'submit_result'
            })
        }else{
          this.$router.push({
              name: 'blogs2'
            })
        }
      },
    }
}
</script>
<style>
  .loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
  .display_chips{
    float: left;
    margin-right: 5px;
    background-color: lightgray;
  }
  #selectbox{
    margin-top: 20px;
    margin-bottom: 20px;
    /*margin-left: 80px;*/
    margin-left: 280px;
  }
</style>