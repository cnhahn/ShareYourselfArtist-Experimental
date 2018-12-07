<template>
  <v-container mt-3>
    <v-layout row wrap>
      <v-flex lg6 md6 sm12 xs12 ml-2 mr-2>
        <img :src="this.art.url" alt="" width="100%">
      </v-flex>
      <v-flex lg4 md6 sm12 xs12 ml-2 mr-2>
<<<<<<< HEAD
        <h2>{{this.art.art_title}}</h2>
        <p>{{this.art.description}}</p>
        <div class="buttons">
          <v-btn depressed dark large color="black" @click="back">Back</v-btn>
          <!-- <v-btn depressed large color="primary" style="width:120px" @click="submit_art(this.art)" router to="/blogs">Submit</v-btn> -->
=======
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
          <v-btn depressed small @click="toggleDiv()" id="updatebtn">Hide Categories</v-btn>
>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
        </div>
        <v-btn depressed small color="primary" id="addbtn" @click="updateTags(upload_date, categories)">Add Categories</v-btn>
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
<<<<<<< HEAD
          description: localStorage.getItem('description')
        }
=======
          description: localStorage.getItem('description'),
          upload_date: localStorage.getItem('upload_date'),
          categories: this.$store.getters.categories.filter(function(category){
          return category != false
        }),
// TODO: update tags with actual values for production
          items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
          value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
    }
        },

    methods:{
      back(){
        window.history.back();
      },
<<<<<<< HEAD
=======
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
          console.log("tagss updated")
          let arts = this.$store.getters.allArts
          let indexOfUpdatedArt = arts.findIndex(art => art.upload_date == upload_date)
          console.log('indexOfUpdatedArt', indexOfUpdatedArt)
          this.$store.commit('setArtCategory', {indexOfUpdatedArt: indexOfUpdatedArt, categories: categories })

        this.$router.push('/artist_dashboard')
      })
      },

>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
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
<<<<<<< HEAD
=======
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
>>>>>>> ef126a91614745d0695ed9ff2fa3e92167c38177
</style>

