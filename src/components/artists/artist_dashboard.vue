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
            <v-flex xs12 mt-5 ml-2 mr-2>
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
                          label='Search Your Artwork By Category'
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
    <v-layout row wrap mb-5>
      <v-flex xs12 sm6 mr-2 ml-2 v-if="def.length != 0" mt-5 v-for="art in def" :key='art.id'>
            <v-card mt-3>
          <v-card-media img :src="art.url" height="275px">
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
            <v-btn flat  color="primary"
            @click="submit_art(art)"
            >Submit this piece</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
        <v-flex v-if="def.length == 0" xs12 sm6 pl-2 pr-2 mt-5 v-for="art in arts" :key='art.id'>
          <v-card mt-3>
          <v-card-media img :src="art.url" height="275px">
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
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    /*
    Real-time data(art) fetching from the firestore database.
     */

    data() {
      return {
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
        items: ['Drawing', 'Painting', 'Sculpting', 'Design', '3D', 'Multimedia', 'Black & White', 'Psychedelic', 'Portrait', 'Realism', 'Abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
      }
    },

    computed: {
      arts() {
        return this.$store.getters.allArts;
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
           localStorage.setItem('categories', arts[i].categories)
           localStorage.setItem('upload_date', arts[i].upload_date)
           this.$store.commit('set_categories', arts[i].categories)
           console.log('art_title',localStorage.getItem('art_title'))
           break
          }
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
              if (arts[i].categories.includes(categories[j]))
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
</style>
