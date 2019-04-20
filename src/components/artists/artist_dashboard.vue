
<template>
  <div  v-if="loading" class="loading_holder">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>

  <v-container v-else grid-list-md>
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



    <v-tabs light grow>
      <v-tab >  Dashboard </v-tab>
        <v-tab-item :value="dashboard-tab">
          <v-layout pa-4 row wrap justify-center>

            <v-flex xs3> </v-flex>

            <v-flex xs6>
              <v-card flat >
                <v-select
                  :items="items"
                  attach
                  chips
                  name='categories'
                  id='categories'
                  label='Select categories to filter by'
                  v-model='categories'
                  multiple
                  v-on:blur="updateCon(categories, def, arts, noneFound, snackbar)"
                ></v-select>
              </v-card>
            </v-flex>

            <v-flex xs3> </v-flex>

            <v-flex  xs6 v-if="def.length == 0"  v-for="art,index in arts" :key='art.id'>
              <v-card  dark mt-3>
                <v-card-media class="white" img :src="art.url" height="450px">
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
                  <v-btn flat @click="clicked_art(art.upload_date)" color="white">View</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="set_art_to_delete(art,index)" color="white">Delete</v-btn>
                  <div class="text-xs-center">
                    <v-dialog v-model="dialog" width="30%">
                      <v-card>

                        <v-card-title class="headline grey lighten-2" primary-title> Deleting Message </v-card-title>
                        <v-card-text> Are you sure you want to delete? </v-card-text>
                        <v-divider></v-divider>

                        <v-card-actions>

                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="delete_art('art')"> Delete </v-btn>
                          <v-btn color="primary" flat @click="dialog = false"> Go Back  </v-btn>

                        </v-card-actions>

                      </v-card>
                    </v-dialog>
                  </div>

                  <v-spacer></v-spacer>
                  <v-btn flat  color="white" @click="submit_art(art)">Submit this piece</v-btn>

                </v-card-actions>

              </v-card>
            </v-flex>

            <v-flex xs6 v-if="def.length != 0"  v-for="art,index in def" :key='art.id'>

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
                  <v-btn flat @click="set_art_to_delete(art,index)" color="primary">Delete</v-btn>
                  <div class="text-xs-center">
                    <v-dialog v-model="dialog" width="30%">
                      <v-card>

                        <v-card-title class="headline grey lighten-2" primary-title> Deleting Message </v-card-title>
                        <v-card-text> Are you sure you want to delete? </v-card-text>
                        <v-divider></v-divider>

                        <v-card-actions>

                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="delete_art('def')"> Delete </v-btn>
                          <v-btn color="primary" flat @click="dialog = false"> Go Back  </v-btn>

                        </v-card-actions>

                      </v-card>
                    </v-dialog>
                    </div>
                  <v-spacer></v-spacer>
                  <v-btn flat  color="primary"
                  @click="submit_art(art)"
                  >Submit this piece</v-btn>
                </v-card-actions>

              </v-card>
            </v-flex>
            
          </v-layout>
          <v-container>
            <div class="text-xs-center mb-5">
              <v-pagination
                v-model="page"
                :length="Math.ceil(arts.length / 4)"
              ></v-pagination>
            </div>
          </v-container>
        </v-tab-item>

      <v-tab @click="recommendedArts()"> Recommended Businesses </v-tab>
        <v-tab-item>
            <!-- <div class=" display-2 mt-5 italic"  > Based on your top category : {{this.users_top_category}} </div> -->
            <v-container>
              <v-layout row >
                <v-flex xs12 lg10 offset-lg2 mt-5 mr-5>
                  <v-list three-line class= "changePointer"  >
                    <v-container fluid grid-list-xs>
                      <v-layout row wrap>
                        <template v-for="business,index in top_ten_rec_businesses"  >
                          <v-divider> </v-divider>
                              <v-flex xs12>
                                <v-card  class="white-text">
                                  <v-layout row>
                                    <v-flex xs7>
                                      <v-card-title primary-title>
                                        <div>
                                          <div class ="headline">{{business.business_name }}</div>
                                          <div>  {{business.about}} </div>
                                          <div> Joined 2 yrs ago </div>
                                        </div>
                                      </v-card-title>
                                    </v-flex>
                                    <v-flex xs3>
                                    </v-flex>
                                    <v-flex xs2>
                                      <v-flex xs2>
                                        <v-avatar size="125px" class="avatarStyle mt-3 mb-3" v-bind:cpriolor="black">
                                          <img v-if="business.url != undefined && business.url != null" v-bind:src="business.url" alt="avatar">
                                          <div v-else>
                                            <v-avatar size="100px" class="avatarStyle"  color = "primary">
                                              <span style="color: white;" class = "display-3"> {{business.business_name.charAt(0).toUpperCase()}} </span>
                                            </v-avatar>
                                          </div> 
                                        </v-avatar>
                                      </v-flex>
                                      <v-flex xs2 >
                                        <div> hello </div>
                                      </v-flex>
                                    </v-flex>
                                  </v-layout>
                                  <v-divider light> </v-divider>
                                  <v-card-actions class ="pa-3">
                                    Email us at {{business.email}}
                                    <v-spacer> </v-spacer>
                                  </v-card-actions>
                                </v-card>
                              </v-flex>
                              <v-divider> </v-divider>
                        </template>
                      </v-layout>
                    </v-container>    
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>  
            <!--                   

                            
                            <v-list-tile >
                              <div class = "text-xs-center headline">
                                <v-list-title-content>
                                  <v-list-tile-title class ="pb-5" > </v-list-tile-title>
                                  <v-list-tile-sub-title> </v-list-tile-sub-title>
                                </v-list-title-content>
                              </div>
                            </v-list-tile>
                          
                            <v-list-tile>
                              <div class = "text-xs-center">
                                <v-list-title-content >
                                  <v-list-tile-title class ="text-xs-center headline pb-5">   </v-list-tile-title>
                                </v-list-title-content>
                              </div>
                            </v-list-tile>

                            <v-list-tile>
                              <div class = "text-xs-center">
                                <v-list-title-content >
                                  <v-list-tile-title class ="text-xs-center headline pb-5">  {{business.follower_count}} </v-list-tile-title>
                                </v-list-title-content>
                              </div>
                            </v-list-tile>      

                            
                            <v-list-tile>
                              <div class = "text-xs-center">
                                <v-list-title-content >
                                  <v-list-tile-title class ="text-xs-center headline pb-5">  {{business.upload_date}} </v-list-tile-title>
                                </v-list-title-content>
                              </div>
                            </v-list-tile>   -->     
        </v-tab-item>

      <v-tab > Responded Art Pieces </v-tab>
        <v-tab-item>
          <v-layout pa-4 row wrap justify-center>
            <v-flex xs6 v-for="art in recently_responded_arts">
              <v-card :key='art' dark height="100%">
                <v-card-media  img :src="art.url" height="450px"></v-card-media>
              
                <v-card-title primary-title>
                  <div class="headline mb-0 ">
                    <h3>  {{art.art_title}} </h3>
                    <p>Description: {{art.description}} </p>
                  </div>
                </v-card-title>
                <v-card-text >
                  <div class ="title">
                    <p style="text-decoration: underline;" >Response from <b>{{art.business_name}} : </b>
                    <p> {{art.response}}</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
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
        profile_exists: false,
        def: [],
        noneFound: false,
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        page: 1,
        section: []
      }
    },
    mounted(){
      this.respondedArts()
      this.recommendedBusinesses()
    },
    computed: {
      users_top_category(){
        return this.$store.state.users_top_category
      },
      top_ten_category(){
        return this.$store.getters.get_top_ten_category;
      },
      top_ten_rec_businesses(){
        return this.$store.getters.get_top_ten_rec_businesses;
      },
      recently_responded_arts(){
        let recently_responded_arts = this.$store.getters.get_recently_responded_arts;
        return recently_responded_arts
      },
      arts() {
        let arts = this.$store.getters.allArts;
        this.populateSubmissions(this.page, arts)

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
       
        let arti = 0
        var removed_deleted_art = [];
        for (arti = 0 ; arti < arts.length; arti++){
          if(!arts[arti].delete){
            removed_deleted_art.push(arts[arti])
          }
        }


        return removed_deleted_art;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      // populate submissions array depending on the current page selected
      populateSubmissions(page, submissions)
      {
        if(submissions.length !== undefined && submissions.length !== 0)
        {
          let section = []
          let startIndex = (page-1) * 4
          for(let i = startIndex; i < (startIndex + 4) && submissions[i] !== undefined; i++)
          {
            section.push(submissions[i])
          }

          this.section = section
          console.log('section arr:', this.section)
        }
      },
      go_to_viewed_artist_page(index){
        //const test = this.$store.getters.top_12_recent_art
        //console.log('this.items[index] $#$#%#^#^', test[index])
        
        this.$store.commit('set_viewed_artist_data',this.top_ten_category[index])
        this.$router.push({
          name:'viewed_artist_dashboard'
        })
      },
      respondedArts(){
        this.$store.dispatch('retrieve_recently_responded_arts')
      },
      recommendedBusinesses(){
        this.$store.dispatch('retrieve_recommended_businesses')
      },
      recommendedArts(){
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
        console.log("in here set art to delete")
        this.dialog = true
        this.currentArtToDelete = delete_art
        this.currentArtIndex = idx
      },
      delete_art(array_to_delete_from){
        // Summary of this function
        // The way the list appears is opposite of the way it's stored in the array
        // Aka lowest image on the list is stored at index 0.
        // Thus, clicking delete on lowest image at index 0 deletes object at index 0, which is the top image on the dashboard.
        // So, we get index of picture we want to delete, substract it from the length of the array, and find the element 
        // in the array and delete it. 
        // Also had to implement vuetify components v-card, v-card-actions and v-dialogue
        // let art_to_be_deleted = this.arts[this.arts.length-idx-1]
        if(array_to_delete_from === 'art'){
          console.log("ART")
          console.log("art is  : " , this.currentArtToDelete, "idx is ", this.currentArtIndex, " length of array is " , this.arts.length)
          let art_to_be_deleted = this.arts[this.currentArtIndex]
          console.log("art to be deleted is " , art_to_be_deleted)
          this.$store.dispatch('delete_art_piece', art_to_be_deleted)
          this.$store.dispatch('delete_from_review_requests', art_to_be_deleted)
          this.dialog=false
        }else{
          console.log("DEF")
          console.log("art is  : " , this.currentArtToDelete, "idx is ", this.currentArtIndex, " length of array is " , this.def.length)
          let art_to_be_deleted = this.def[this.currentArtIndex]
          console.log("art to be deleted is " , art_to_be_deleted)
          this.$store.dispatch('delete_art_piece', art_to_be_deleted)
          this.$store.dispatch('delete_from_review_requests', art_to_be_deleted)
          // This is to refresh the page without location.reload
          let temp = this.def
          this.def.length = 0
          this.def = temp
          this.dialog=false
          
        }

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
    },
    watch: {
      page: function (val) {
        let arts = this.$store.getters.allArts;
        this.populateSubmissions(val, arts)
      }
    },
}
</script>
<style scope>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
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
  .changePointer{
    cursor: pointer;
  }
</style>