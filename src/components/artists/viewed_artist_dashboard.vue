<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
  <v-container v-else>
    <v-layout row wrap mb-5>
      <v-flex xs12 lg10 offset-lg2 mt-5 mr-5 v-for="art in arts" :key='art.id'>
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
    beforeMount(){
      this.$store.commit('clear_viewed_arts_array')
    },
    mounted: function () {
        console.log('in in statement of mounted function')
        this.$store.dispatch('fetchViewedArts', this.$store.getters.viewed_artist_data.value).then(response => {
        })
  
        console.log('in the else statement of mounted')
        // this.$store.dispatch('fetchViewedArts', this.$store.getters.viewed_artist_data.art.artist_id).then(response => {
        // })
    

    },
    data() {
      return {
        artList: []
      }
    },
    computed: {
     arts() {
        let temp_arts = this.$store.getters.viewed_arts;
        console.log(' this is the art array we are given ', temp_arts)
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
        console.log(temp_arts.sort(compare));
        let arti = 0
        var removed_deleted_art = [];
        var duplicate_search = [];

        for (arti = 0 ; arti < temp_arts.length; arti++){
          if( (temp_arts[arti].delete != true) &&  (duplicate_search.indexOf(temp_arts[arti].upload_date) == -1) ){
            removed_deleted_art.push(temp_arts[arti])
            duplicate_search.push(temp_arts[arti].upload_date)
          }
        }
        console.log('This is the art array after we remove the delted arts ', removed_deleted_art)

        return removed_deleted_art;
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
           localStorage.setItem('upload_date', arts[i].upload_date)
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
