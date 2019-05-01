<!--This is the main template that will contain both layouts for the image and the text-->
<template>
  <!--This is the main container that will contain both the layouts for the image and the text-->
  <v-container fluid>
    <!--This is the layouts for the everything (nothing is put here because the v-flex will hold of the styleing options)-->
    <v-layout>

      <v-flex>
        <v-btn color="orange darken-2" dark @click="fetchPrevImage()">
          <v-icon dark left>arrow_back</v-icon>Prev Image
        </v-btn> 
      </v-flex>

      <!--This v-flex handles the size (hieght/width/dementions) of the image that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex-->   
      <v-flex xs12 sm12 md8 offset-sx1 row fill-height> 
        <v-card>
          <v-flex> 
            <v-img> 
              <img :src="this.$store.state.viewed_art_image_info.url" alt=""  width="100%" height="100%">
            </v-img>
          </v-flex> 
        <!--end of the v-card for image-->
        </v-card>
      <!--end of the v-flex for image and small icons-->
      </v-flex>
      
      <!--This v-flex handles the size (hieght/width/dementions) of the text based stuff that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex--> 
      <v-flex xs12 sm5 offset-sx1 row fill-height>
        <!--This v-card houses the text based stuff below it.-->
        <v-card>
          <v-flex> 
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
          </v-flex>
            
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
        <!--end of the v-card for text based stuff-->
        </v-card>
      <!--end of the v-flex for text based stuff-->  
      </v-flex>

      <v-flex>
        <v-btn color="orange darken-2" dark @click="fetchNextImage()">
          Next Image<v-icon dark right>arrow_forward</v-icon>   
        </v-btn>  
      </v-flex>

    </v-layout>

  </v-container>
</template>    

 <script>
  export default {
    data() {
      return {
        artList: [],
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
      // populate submissions array depending on the current page selected
      populateSubmissions(page, submissions)
      {
        if(submissions.length !== undefined && submissions.length !== 0)
        {
          let section = []
          let startIndex = (page-1) * 4
          for(let i = startIndex; i < (startIndex + 4) && submissions[i] !== undefined; i++)
          {
            section.push(submissions[i])
          }

          this.section = section
          console.log('section arr:', this.section)
        }
      },
      fetchNextImage(){
        console.log("How to get the All Art array", this.$store.getters.viewed_arts)

        let temp_arts = this.$store.getters.viewed_arts;
        console.log(' this is the art array we are given ', temp_arts)
        function compare(a, b) {
          const upload_date1 = a.upload_date
          const upload_date2 = b.upload_date
          let comparison = 0;
          if (upload_date1 > upload_date2) {
            comparison = -1;
          } else if (upload_date1 < upload_date2) {
            comparison = 1;
          }
          return comparison;
        }
       
        console.log("temp_arts Array: ", temp_arts)

        // create an array that removes all the "deleted" art pieces
        console.log(temp_arts.sort(compare));
        let arti = 0
        var removed_deleted_art = [];
        var duplicate_search = [];

        for (arti = 0 ; arti < temp_arts.length; arti++){
          if( (temp_arts[arti].delete != true) &&  (duplicate_search.indexOf(temp_arts[arti].upload_date) == -1) ){
            removed_deleted_art.push(temp_arts[arti])
            duplicate_search.push(temp_arts[arti].upload_date)
          }
        }

       var start = 0
        var end = removed_deleted_art.length - 1
        console.log ('Current url image on viewed_art: ', this.$store.state.viewed_art_image_info.url)
        console.log ('Real Array of Art url: ', removed_deleted_art[0].url)

        var n = 0
        console.log ('Current url image on viewed_art: ', this.$store.state.viewed_art_image_info.url)

        for( n = 0; removed_deleted_art.length > n; n++ ){
          
          if(removed_deleted_art.length == 1)
          {
            let prevArt = removed_deleted_art[0].upload_date
            let nextArt = removed_deleted_art[0].upload_date

            console.log('artist has one art piece belonging to them so prevArt and nextArt are the same.')
          }

          //if(removed_deleted_art[5].upload_date == removed_deleted_art[n].upload_date)
          if(this.$store.state.viewed_art_image_info.url == removed_deleted_art[n].url)
          {
            if(n == end)
            {
              let prevArt = removed_deleted_art[n-1].upload_date
              let nextArt = removed_deleted_art[start].upload_date

              console.log ('when n == end')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
            else if(n == start)
            {
              let prevArt = removed_deleted_art[end].upload_date
              let nextArt = removed_deleted_art[n+1].upload_date
              

              
              console.log ('when n == start')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            } 
            else
            {
              let prevArt = removed_deleted_art[n-1].upload_date
              let nextArt = removed_deleted_art[n+1].upload_date
              

              console.log ('normal')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
          }
        }

        console.log("All Art Array", this.$store.state.arts)
        console.log("Real Array of Art", removed_deleted_art)
        console.log("fethcing next image")
      },
      fetchPrevImage(){
        //console.log("How to get the All Art array", this.$store.state.arts)

        let temp_arts = this.$store.getters.viewed_arts;
        console.log(' this is the art array we are given ', temp_arts)
        function compare(a, b) {
          const upload_date1 = a.upload_date
          const upload_date2 = b.upload_date
          let comparison = 0;
          if (upload_date1 > upload_date2) {
            comparison = -1;
          } else if (upload_date1 < upload_date2) {
            comparison = 1;
          }
          return comparison;
        }
       
        console.log("temp_arts Array: ", temp_arts)

        // create an array that removes all the "deleted" art pieces
        console.log(temp_arts.sort(compare));
        let arti = 0
        var removed_deleted_art = [];
        var duplicate_search = [];

        for (arti = 0 ; arti < temp_arts.length; arti++){
          if( (temp_arts[arti].delete != true) &&  (duplicate_search.indexOf(temp_arts[arti].upload_date) == -1) ){
            removed_deleted_art.push(temp_arts[arti])
            duplicate_search.push(temp_arts[arti].upload_date)
          }
        }

        var start = 0
        var end = removed_deleted_art.length - 1
        console.log ('Current url image on viewed_art: ', this.$store.state.viewed_art_image_info.url)
        console.log ('Real Array of Art url: ', removed_deleted_art[0].url)

        var n = 0
        console.log ('Current url image on viewed_art: ', this.$store.state.viewed_art_image_info.url)

        for( n = 0; removed_deleted_art.length > n; n++ ){
          
          if(removed_deleted_art.length == 1)
          {
            let prevArt = removed_deleted_art[0].upload_date
            let nextArt = removed_deleted_art[0].upload_date

            console.log('artist has one art piece belonging to them so prevArt and nextArt are the same.')
          }

          //if(removed_deleted_art[5].upload_date == removed_deleted_art[n].upload_date)
          if(this.$store.state.viewed_art_image_info.url == removed_deleted_art[n].url)
          {
            if(n == end)
            {
              let prevArt = removed_deleted_art[n-1].upload_date
              let nextArt = removed_deleted_art[start].upload_date

              console.log ('when n == end')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
            else if(n == start)
            {
              let prevArt = removed_deleted_art[end].upload_date
              let nextArt = removed_deleted_art[n+1].upload_date
              

              
              console.log ('when n == start')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            } 
            else
            {
              console.log ('entered search')
              let prevArt = removed_deleted_art[n-1].upload_date
              let nextArt = removed_deleted_art[n+1].upload_date
              

              console.log ('normal')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
          }
        }

        console.log("All Art Array", this.$store.state.arts)
        console.log("Real Array of Art", removed_deleted_art)
        console.log("fethcing previous image")
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
    }


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


<!-- code thats commented out not sure what its for -->
<!--
<template>
  <v-container fluid>
    <v-layout row wrap>

      <!-- <v-flex xs12 fill-height> <v-flex xs12 sm6 offset-sm3 fill-height>  -/->
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
-->
<!--
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