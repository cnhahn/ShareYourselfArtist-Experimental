<template>
  <v-container>

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

            <div class="headline title2">Looks like you do not have any submissions...</div>

            <div class="title mb-3 middleText1">Let's submit your art reviews!</div>

            <v-btn
              class="mx-0"
              color="primary"
              depressed
              large
              router to="/business_dashboard"
            >
              Upload your submissions
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>

    <v-dialog v-model="loading" max-width="300">
      <v-card>
        <v-card-actions>
          <div align="center" style="width: 100%">
            <v-progress-circular v-model="loading" :size="70" indeterminate color="amber"></v-progress-circular>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script>
  export default {
    /*
    This function routes to submissions if there's change on artist work.
     */
    mounted: function() {
      let db = this.$store.getters.db
      let that = this;
      db.collection("review_requests")
        .where("replied", "==", false)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().art != null) {
              that.$router.push({
                name: '/submissions'
              })
            }
          })
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
