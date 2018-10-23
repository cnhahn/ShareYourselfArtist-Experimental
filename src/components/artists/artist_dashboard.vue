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
        artList: []
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
           localStorage.setItem('url',arts[i].url)
           console.log('art_title',localStorage.getItem('art_title'))
           break
          }
        }
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
</style>