<template>
  <v-container mt-3>
    <v-layout row wrap>
      <v-flex lg6 md6 sm12 xs12 ml-2 mr-2>
        <img :src="this.url" alt="" width="100%">
      </v-flex>
      <v-flex lg4 md6 sm12 xs12 ml-2 mr-2>
        <h2>{{this.art_title}}</h2>
        <p>{{this.description}}</p>
        <!-- v-select for new categories to be added -->
          <v-card id="selectbox" style="display: block;">
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
          <v-btn depressed small dark color="black" @click="back">Back</v-btn>
        </div>
        <v-btn depressed small color="primary" id="addbtn" @click="updateTags(upload_date, categories)">Add Categories</v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>
 <script>
  export default {
    data () {
          return {
        url: localStorage.getItem('url'),
        art_title: localStorage.getItem('art_title'),
        description: localStorage.getItem('description'),
        upload_date: localStorage.getItem('upload_date'),
        categories: [],
          //  this.$store.getters.categories.filter(function(category){
        //   return category != false
        // }),
// TODO: update tags with actual values for production
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract']
      }
        },

         mounted: function() {
      if (this.$store.getters.categories == undefined){
           this.categories = []
         }else{
           this.categories = this.$store.getters.categories.filter(function(category){
              return category != false
          })
         }
          console.log("this.categories",this.categories)
    },
    methods:{
      printCategories(){
        console.log(localStorage.getItem('categories'))
      },
      back(){
        window.history.back();
      },
      toggleDiv() {
          var div = document.getElementById('selectbox');
          var updatebtn = document.getElementById('updatebtn');
          var addbtn = document.getElementById('addbtn');
          console.log(div.style.display);
          if(div.style.display === 'block') {
            div.style.display = 'none';
            addbtn.style.display = 'none';
            updatebtn.innerHTML = 'edit categories';
            updatebtn.style.color = 'orange';
          } else {
            div.style.display = 'block';
            addbtn.style.display = 'block';
            updatebtn.innerHTML = 'hide categories';
            updatebtn.style.color = 'black';
          }
      },

// function to update tags to firestore
      updateTags(upload_date, categories){this.$store.commit('set_categories', categories)
        //this.$store.commit('mutationName', payload)
        this.$store.dispatch('update_art_category_tags', {upload_date: upload_date, categories: categories})
        .then(response => {
          let arts = this.$store.getters.allArts
          let indexOfUpdatedArt = arts.findIndex(art => art.upload_date == upload_date)
          this.$store.commit('setArtCategory', {indexOfUpdatedArt: indexOfUpdatedArt, categories: categories })
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
    //  computed:{
    //    get_categories() {
    //      if (this.$store.getters.categories == undefined){
    //        return []
    //      }else{
    //        this.$store.getters.categories.filter(function(category){
    //           return category != false
    //       })
    //      }

    //    }
    //  }
    /*
    computed:{
       categories() {
         if (this.$store.getters.categories.length ===0){
           return []
         }
         else {
            this.$store.getters.categories.filter(function(category){
              return category != false
          }
        }
    */

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
  #addbtn {
    margin-left: 0;
  }
  #updatebtn{
    padding-left: 2.5px;
    padding-right: 2.5px;
  }
</style>

