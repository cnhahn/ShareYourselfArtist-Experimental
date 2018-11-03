<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container v-else>
    <v-layout row wrap mb-5>
      <v-flex xs12 lg4 offset-lg1 mt-5 v-for="art in arts" :key='art.id'>
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
        artList: [],
        chip1:true,
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
           localStorage.setItem('url',arts[i].url)
           localStorage.setItem('categories', arts[i].categories)
           localStorage.setItem('upload_date', arts[i].upload_date)
           //TODO: make this persistent on refresh
           this.$store.commit('set_categories', arts[i].categories)
           console.log('art_title',localStorage.getItem('art_title'))
           break
          }
        }
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