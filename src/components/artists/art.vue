
<template>
  <v-container fluid>
    <v-layout row wrap>

      <!-- <v-flex xs12 fill-height> <v-flex xs12 sm6 offset-sm3 fill-height>  -->
      <v-flex xs12 sm8 offset-sm3 fill-height> 

          <v-card>
            
            <v-flex> 
              <v-img> 
                <img :src="this.$store.state.viewed_art_image_info.url" alt=""  width="100%" height="100%">
              </v-img>
            </v-flex> 
            
            <br>

            <v-card-title primary-title>
              <div>
                <div class="headline mb-0">
                  <h2>
                    
                    {{this.$store.state.viewed_art_image_info.art_title}}
                  </h2>
                </div>

                <div>
                  <p class="text-sm-left">
                    {{this.$store.state.viewed_art_image_info.description}}
                  </p>
                </div>
              </div>
            </v-card-title>

            <v-flex>
              <v-container fluid>
                <v-layout  align-center wrap>
                  <v-select :items="items"
                            attach
                            chips
                            name='updatedCategories'
                            id='updatedCategories'
                            label='add categories'
                            v-model='categories'
                            required
                            multiple>
                  </v-select>
                </v-layout>
              </v-container>

              <div mb-5 class="small-container-btn">
                <v-btn depressed small dark color="black" id="addbtn" @click="updateTags(this.$store.state.viewed_art_image_info.art.upload_date, categories)">
                  Add Categories
                </v-btn>
                <v-btn depressed small dark color="black" @click="back">
                  Back
                </v-btn>
              </div>
            </v-flex>

          </v-card>

      </v-flex>

    </v-layout>
  </v-container>
</template>            


<!-- 
<template>
  <v-container fluid>
    

      <!-- <v-flex xs12 fill-height> <v-flex xs12 sm6 offset-sm3 fill-height>  -->
      

        <!-- added for row to workout -/->
        <v-layout row xs12 wrap>

          <v-card>
            <v-flex xs12 sm6 offset-sm2 fill-height> 
              <v-img> 
                <img :src="this.$store.state.viewed_art_image_info.url" alt=""  width="100%" height="100%">
              </v-img>
            </v-flex> 

          <!-- second layout attempt -/->
          </v-card>
      


        <v-layout row xs12 wrap>
          <v-card>
            <v-flex xs12 sm6 offset-sm3 fill-height> 
            <v-card-title primary-title>
              <div>
                <div class="headline mb-0">
                  <h2>
                    
                    {{this.$store.state.viewed_art_image_info.art_title}}
                  </h2>
                </div>

                <div>
                  <p class="text-sm-left">
                    {{this.$store.state.viewed_art_image_info.description}}
                  </p>
                </div>
              </div>
            </v-card-title>

            <v-flex>
              
              <v-container fluid>
                <v-layout  align-center wrap>
                  <v-select :items="items"
                            attach
                            chips
                            name='updatedCategories'
                            id='updatedCategories'
                            label='add categories'
                            v-model='categories'
                            required
                            multiple>
                  </v-select>
                </v-layout>
              </v-container>

              <div mb-5 class="small-container-btn">
                <v-btn depressed small dark color="black" id="addbtn" @click="updateTags(this.$store.state.viewed_art_image_info.art.upload_date, categories)">
                  Add Categories
                </v-btn>
                <v-btn depressed small dark color="black" @click="back">
                  Back
                </v-btn>
              </div>
            </v-flex>
          </v-flex>  
          </v-card>

        </v-layout>
        <!-- added for row to workout -/->
</v-layout>


  </v-container>
</template>    
 -->

<!--
  <v-container mt-3>
    <v-layout row wrap> <!--wrap-->
    <!-- because of line 8 and line 4 they both reset the images as the resloution cahnges several times. -->
     <!-- <v-flex lg7 md6 sm12 xs12 ml-2 mr-2> <!--lg6-->
     <!--   <img :src="this.$store.state.viewed_art_image_info.url" alt="" width="100%">
      </v-flex>
      <v-flex lg7 md6 sm12 xs12 ml-2 mr-2> <!--lg4-->
     <!--   <h2>{{this.$store.state.viewed_art_image_info.art_title}}</h2>
        <p>{{this.$store.state.viewed_art_image_info.description}}</p>
        <!-- v-select for new categories to be added -->
     <!--     <v-card id="selectbox" style="display: block;">
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
          <v-btn depressed small dark color="black" id="addbtn" @click="updateTags(this.$store.state.viewed_art_image_info.art.upload_date, categories)">Add Categories</v-btn>
          <v-btn depressed small dark color="black" @click="back">Back</v-btn>
        </div>
        
      </v-flex>
    </v-layout>
  </v-container>
-->

 <script>
  export default {
    data() {
      return {
        categories: [],
        art_title: '',
        art_url: '',
        art_description: '',
          //this.$store.getters.categories.filter(function(category){
        //   return category != false
        // }),
        // TODO: update tags with actual values for production
        items: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        value: ['drawing', 'painting', 'sculpting', 'design', '3D', 'multimedia', 'black&white', 'psychedelic', 'portrait', 'realism', 'abstract'],
        }
    },

    mounted: function() {
      console.log("Entered mounted")
      if (this.$store.getters.categories == undefined){
            this.categories = []
      }else{
        this.categories = this.$store.getters.categories.filter(function(category){
          return category != false
        })
      }
      // this.art_title = this.$store.state.viewed_art_image_info.art.art_title,
      // this.art_url = this.$store.state.viewed_art_image_info.art.url,
      // this.art_description = this.$store.state.viewed_art_image_info.art.description
      this.art_title = this.$store.state.viewed_art_image_info.art_title,
      this.art_url = this.$store.state.viewed_art_image_info.url,
      this.art_description = this.$store.state.viewed_art_image_info.description
      
    },
  watch: {
    art_title: function(val) {
      console.log("watching art title change", val);
      // this.reviewList__unread_reviews()
    }
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
  .small-container-btn {
   margin-left: 0.55rem;
   width: 80%;
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