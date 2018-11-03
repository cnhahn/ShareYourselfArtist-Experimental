<template>
  <v-container mt-3>
    <v-layout row wrap>
      <v-flex lg6 md6 sm12 xs12 ml-2 mr-2>
        <img :src="this.url" alt="" width="100%">
      </v-flex>
      <v-flex lg4 md6 sm12 xs12 ml-2 mr-2>
        <h2>{{this.art_title}}</h2>
        <p>{{this.description}}</p>
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
                          name='updatedCategories'
                          id='updatedCategories'
                          label='add categories'
                          v-model='categories'
                          required
                          multiple
                        ></v-select>
                    </v-layout>
                  </v-container>
                </v-card>

                


        <div class="buttons">
          <v-btn depressed dark large color="black" @click="back">Back</v-btn>
          <v-btn depressed large color="primary" style="width:120px" @click="updateTags(upload_date, categories)">Add Categories</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>

</template>
 <script>
  export default {
        data() {
      return {
          url: localStorage.getItem('url'),
          art_title: localStorage.getItem('art_title'),
          description: localStorage.getItem('description'),
          upload_date: localStorage.getItem('upload_date'),
          categories: this.$store.getters.categories.filter(function(category){
          return category != false
        }),

          items: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10'],
          value: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10'],
    }
        },

    methods:{
      printCategories(){
        console.log(localStorage.getItem('categories'))
      },
      back(){
        window.history.back();
      },

      updateTags(upload_date, categories){this.$store.commit('set_categories', categories)
        //this.$store.commit('mutationName', payload)
        this.$store.dispatch('update_art_category_tags', {upload_date: upload_date, categories: categories})
        .then(response => {
          console.log("response from cat updates",response)
        this.$router.push('/artist_dashboard')
      })
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
    },

  }
</script>

<style>
  /* Don't know why I need this. */
  .buttons{
    margin-left: -8px;
  }
  #selectbox{
    margin-top: 15px;
    margin-bottom: 15px;
  }

</style>

