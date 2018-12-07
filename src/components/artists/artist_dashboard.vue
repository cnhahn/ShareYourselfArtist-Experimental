<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container v-else>
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
          <v-btn
            color="pink"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-card>
    </div>
    <v-layout row>
            <v-flex lg9 offset-lg1 mt-5>
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
                <v-btn @click="updateCon(categories, def, arts, noneFound, snackbar)">Filter By Categories
                </v-btn>
            </v-flex>
            
          </v-layout>
    <v-layout row wrap mb-5>
      <v-flex v-if="def.length != 0" xs12 lg4 offset-lg1 mt-5 v-for="art in def" :key='art.id'>
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
            <v-btn flat @click="clicked_art(art.upload_date)" color="primary" router to='/art'>View</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat  color="primary"
            @click="submit_art(art)" 
            >Submit this piece</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
        <v-flex v-if="def.length == 0" xs12 lg4 offset-lg1 mt-5 v-for="art in arts" :key='art.id'>
          <v-card mt-3>
          <v-card-media img :src="art.url" height="450px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{art.art_title}}</h3>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat @click="clicked_art(art.upload_date)" color="primary" router to='/art'>View</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat  color="primary"
            @click="submit_art(art)" 
            >Submit this piece</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    /*
    Real-time data(art) fetching from the firestore database.
     */
    mounted: function () {
      const db = this.$store.getters.db
      const userId = this.$store.getters.user.id
      const newArtList = this.artList
      const that = this
      db.collection('art')
        .where('artist_id', '==', userId)
        .onSnapshot(function (querySnapshot) {
          newArtList.length = 0;
          querySnapshot.forEach(function (doc) {
            var newArt = {
              id: doc.id,
              art_title: doc.data().art_title,
              url: doc.data().url
            }
            newArtList.push(newArt)
          })
          // if there's no art, route to artist_dashboard_empty
          if (querySnapshot.empty) {
            that.$router.push({
              name: 'artist_dashboard_empty'
            })
          }
        })
    },
    data() {
      return {
<<<<<<< HEAD
        artList: []
=======
        snackbar: true,
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
>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
      }
    },
    computed: {
      arts() {
        return this.$store.getters.uploadedArts;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
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
           localStorage.setItem('artist_name',arts[i].artist_name)
           localStorage.setItem('description',arts[i].description)
           this.$store.state.signed_in_user.instagram
           localStorage.setItem('url',arts[i].url)
           console.log('art_title',localStorage.getItem('art_title'))
           break
          }
        }
      },
<<<<<<< HEAD
=======

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
        for(var i = 0; i<arts.length; i++){
          categories.every(function(value){
            if(arts[i].categories.indexOf(value) >= 0){
              if(def.indexOf(arts[i]) < 0){
                def.push(arts[i]);
                console.log("made it here")
              }
            }
          });
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

>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
      submit_art(art){
        this.$store.commit('set_user_email')
        if(this.$store.state.signed_in_user.instagram != null && this.$store.state.signed_in_user.instagram != 'undefined'){
          this.$store.commit('set_user_instagram')
        }
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
</style>