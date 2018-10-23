<template>
  <div class='background'>
    <div class='jumbotron_holder'>
      <v-jumbotron
        :gradient="gradient"
        height="60vh"
        width="60vw"
      >
        <v-container fill-height>
          <v-layout align-center>
            <v-flex>
              <h3 class="display-3 title1"> <span style="color:red">404</span> ERROR.</h3>

              <div class="headline title2">Oops, looks like you've found the wrong page...</div>

              <div class="title mb-3 middleText1">The page you are looking for can't be found!</div>

              <v-btn
                class="mx-0"
                color="red"
                depressed
                large
                router to="/"
              >
                Go to home
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-jumbotron>
    </div>

  </div>

</template>

<script>
  export default {
    name: "page_not_found",
    data: () => ({
      gradient: 'to bottom right, rgba(255,255,255, .6), rgba(255,255,255, .5)'
    })
  }
</script>

<style scoped>
  .background {
    background-image: url('/static/images/404.jpg');
    height: 82vh;
    margin: auto;
  }

  .jumbotron_holder {
    height: 82vh;
    padding-top: 10vh;
    margin-left: auto;
    margin-right: auto;
  }

  .title1 {
    margin-top: 10px;
    font-family: "Roboto", sans-serif;
    font-weight: bolder;
    font-size: 1.6em;
  }
  .title2 {
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.6em;
    color: #222222;
  }
  .middleText1 {
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    font-size: 1.6em;
    margin-top: 20vh;
  }

</style>
