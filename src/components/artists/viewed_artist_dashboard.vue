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
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat @click="clicked_art(art.upload_date)" color="primary" router to='/viewed_art'>View</v-btn>
            <v-spacer></v-spacer>
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
    /*mounted: function () {
     this.$store.dispatch('fetchViewedArts', this.$store.getters.viewed_artist_data.artist_id).then(response => {
       console.log("Fetch Arts Here! " + this.$store.getters.viewed_arts)
     })
    },*/
    mounted: function () {
     console.log("artist data " + this.$store.getters.viewed_artist_data.art.artist_id) 
     this.$store.dispatch('fetchViewedArts', this.$store.getters.viewed_artist_data.art.artist_id).then(response => {
       console.log("Fetch Arts Here! " + this.$store.getters.viewed_arts)
     })
    },
    data() {
      return {
        artList: []
      }
    },
    computed: {
     arts() {
        return this.$store.getters.viewed_arts;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      clicked_art(art_unique_timestamp) {
        this.$store.commit('set_clicked_art', art_unique_timestamp)
        localStorage.setItem('clicked_art', art_unique_timestamp)
        console.log("this.$store.getters.viewed_artist_data",this.$store.getters.viewed_artist_data)
        const arts= this.$store.getters.viewed_arts
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