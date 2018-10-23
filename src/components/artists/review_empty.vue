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
      src="/static/images/18.jpg"
      height="82vh"
    >
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3 title1">Reviews</h3>
            <v-divider light></v-divider>

            <div class="headline title2">Looks like you do not have any reviews..</div>

            <div class="title mb-3 middleText1">Let's get your reviews!</div>

            <v-btn
              class="mx-0"
              color="primary"
              depressed
              large
              router to="/blogs"
            >
              Go to Blogs/Magazines
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-container>
</template>

<script>
  export default {
    name: "review_empty",
    data: () => ({
      gradient: 'to top left, rgba(255,255,255, 0.5), rgba(255,255,255, 0)'
    }),
    computed: {
      loading() {
        return this.$store.getters.loading;
      }
    }
  }
</script>

<style scoped>
  .title1 {
    color: white;
    margin-top: 10px;
    font-family: "Roboto", sans-serif;
    font-weight: normal;
    font-size: 1.6em;
  }
  .title2 {
    margin-top: 20vh;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    font-size: 1.6em;
  }
  .middleText1 {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.6em;
    margin-top: 2vh;
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
</style>
