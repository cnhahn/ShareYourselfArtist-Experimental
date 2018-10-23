<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>

  <v-container v-else>

    <v-jumbotron
      :gradient="gradient"
      light
      src="/static/images/13.jpg"
      height="82vh"
    >
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3 title1">Welcome</h3>

            <div class="headline title2">Looks like you do not have any piece that you have uploaded..</div>

            <div class="title mb-3 middleText1">Let's Upload your art piece!</div>

            <v-btn
              class="mx-0"
              color="primary"
              depressed
              large
              router to="/upload_an_image1"
            >
              Upload your art
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>


  </v-container>
</template>

<script>
  export default {
    /*
    This function routes to artist_dashboard if there's change on artist work.
     */
    mounted: function() {
      const db = this.$store.getters.db
      const userId = this.$store.getters.user.id
      const that = this
      db.collection('art')
        .where('artist_id', '==', userId)
        .onSnapshot(function(querySnapshot) {
          if (!querySnapshot.empty) {
            that.$router.push({
              name: 'artist_dashboard'
            })
          }
        })
    },
    data: () => ({
      gradient: 'to top right, rgba(255,255,255, 1), rgba(255,255,255, .3)'
    }),
    computed: {
      loading() {
        return this.$store.getters.loading;
      }
    },
    methods: {
      clicked_art(artUniqueTimestamp) {
        console.log("clicked art: " + artUniqueTimestamp);
        this.$store.commit("set_clicked_art", artUniqueTimestamp);
      },
      submit_art(art) {
        this.$store.commit("set_art_being_submitted", art);
      }
    }
  };
</script>
<style>
  .title1 {
    margin-top: 10px;
    font-family: "Roboto", sans-serif;
    font-weight: lighter;
    font-size: 1.6em;
  }
  .title2 {
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1.6em;
    color: #222222;
  }
  .middleText1 {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.6em;
    margin-top: 20vh;
  }
</style>