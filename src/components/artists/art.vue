<template>
  <v-container mt-3>
    <v-layout row wrap>
      <v-flex lg6 md6 sm12 xs12 ml-2 mr-2>
        <img :src="this.art.url" alt="" width="100%">
      </v-flex>
      <v-flex lg4 md6 sm12 xs12 ml-2 mr-2>
        <h2>{{this.art.art_title}}</h2>
        <p>{{this.art.description}}</p>
        <div class="buttons">
          <v-btn depressed dark large color="black" @click="back">Back</v-btn>
          <!-- <v-btn depressed large color="primary" style="width:120px" @click="submit_art(this.art)" router to="/blogs">Submit</v-btn> -->
        </div>
      </v-flex>
    </v-layout>
  </v-container>

</template>
 <script>
  export default {
        data() {
      return {
        art:{
          url: localStorage.getItem('url'),
          art_title: localStorage.getItem('art_title'),
          description: localStorage.getItem('description')
        }
    }
        },

    methods:{
      back(){
        window.history.back();
      },
      submit_art(art){
        this.$store.commit('set_user_email')
        this.$store.commit('set_art_being_submitted',art)
        this.$store.commit('set_art_being_submitted_is_selected',true)
        if(this.$store.state.business_being_submitted_is_selected == true){
           this.$router.push({
              name: 'submit_result' 
            })
        }
      }
    }
  }
</script>

<style>
  /* Don't know why I need this. */
  .buttons{
    margin-left: -8px;
  }
</style>

