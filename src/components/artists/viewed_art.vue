
<!--This is the main template that will contain both layouts for the image and the text-->
<template>
  <!--This is the main container that will contain both the layouts for the image and the text-->
  <v-container fluid>
    <!--This is the layouts for the everything (nothing is put here because the v-flex will hold of the styleing options)-->
    <v-layout>

      <v-flex>
        <v-btn color="orange darken-2" dark @click="fetchPrevImage()" >
          <v-icon dark left>arrow_back</v-icon>Prev Image
        </v-btn> 
      </v-flex>

      <!--This v-flex handles the size (hieght/width/dementions) of the image that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex--> 
      <v-flex xs12 sm12 md8 offset-sx1 row fill-height> 
        <!--This v-card houses the image and the small icons below it.-->        
        <v-card>
          <v-flex> 
              <img :src="this.art.url" width="100%" height="100%">
          </v-flex> 
          <!-- added this v-card-actions which are icons as place-holders of things we could add for each image -->
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn icon>
              <v-icon>favorite</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>bookmark</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>share</v-icon>
            </v-btn>
          </v-card-actions>
        <!--end of the v-card for image and small icons-->
        </v-card>
      <!--end of the v-flex for image and small icons-->
      </v-flex>

      <!--This v-flex handles the size (hieght/width/dementions) of the text based stuff that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex--> 
      <v-flex xs1 sm5 offset-sx1 row fill-height>
        <!--This v-card houses the text based stuff below it.-->
        <v-card>
          <v-flex> 
            <v-card-title primary-title>
              <div>
                <div class="headline mb-0">
                  <h2>
                    {{this.art.art_title}}
                  </h2>
                </div>
                <div>
                  <p class="text-sm-left">
                    {{this.art.description}}
                  </p>
                </div>
              </div>
            </v-card-title>

            <v-flex>
              <v-card>
                <v-list two-line>
                  <template v-for="comment_field in new_comments_field">
                    <v-list-tile :key="comment_field.comment" class="resize_list">
                      <v-list-tile-content>
                        <v-list-tile-title class="t" v-html="comment_field.from"></v-list-tile-title>
                        <v-list-tile-sub-title class="b" v-html="comment_field.comment"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>

                <div class = "small-container">
                  <v-text-field label="Comment" single-line v-model="comment"> 
                  </v-text-field>
                </div>
                
                <div mb-5 class="small-container-btn">
                  <v-btn v-if= "!this.comment.length"  disabled  small>
                    Send
                  </v-btn>
                  <v-btn v-else depressed small dark color="black" @click="save_comment(art)">
                    Send
                  </v-btn>
                  <v-btn depressed small dark color="black" @click="back">
                    Back
                  </v-btn>
                </div>
              </v-card>
            </v-flex>  
          </v-flex>
        <!--end of the v-card for text based stuff-->
        </v-card>
      <!--end of the v-flex for text based stuff-->
      </v-flex>

      <v-flex>
        <v-btn color="orange darken-2" dark @click="fetchNextImage()" >
          Next Image<v-icon dark right>arrow_forward</v-icon>   
        </v-btn>  
      </v-flex>

    </v-layout>
  
  </v-container>
</template>



<script>
import * as firebase from 'firebase'
  export default {

    mounted: function() {
      //console.log('entered viewed_art')
      this.load_comments(this.art)
    },
    data() {
      return {
        artList: [],
        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 13000,
        text: 'Thanks! Your comment has been submitted.',
        comment:'',
        art:{
          url: localStorage.getItem('url'),
          art_title: localStorage.getItem('art_title'),
          description: localStorage.getItem('description'),
          upload_date: localStorage.getItem('upload_date'),
          artist_name: localStorage.getItem('artist_name'),
          newComment:''
        },

        new_comments_field: []
    }
        },
    computed:{
      fetchUserProfilePicture () {
        return this.$store.getters.signed_in_user.profileUrl
      },
      arts() {
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
        console.log('This is the art array after we remove the deleted arts ', removed_deleted_art)

        return removed_deleted_art;
      },
    },
    methods: {
      snack_bar_button(){
        this.snackbar = false;
        this.$router.push({
          path:'/artist_dashboard'
        })

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

        let prevArt = 0;
        let nextArt = 0;


        for (arti = 0 ; arti < temp_arts.length; arti++){
          if( (temp_arts[arti].delete != true) &&  (duplicate_search.indexOf(temp_arts[arti].upload_date) == -1) ){
            removed_deleted_art.push(temp_arts[arti])
            duplicate_search.push(temp_arts[arti].upload_date)
          }
        }

        var start = 0
        var end = removed_deleted_art.length - 1
        console.log ('Current url image on viewed_art: ', this.art.url)
        console.log ('Real Array of Art url: ', removed_deleted_art[0].url)

        var n = 0
        console.log ('Current url image on viewed_art: ', this.art.url)

        for( n = 0; removed_deleted_art.length > n; n++ ){
          
          if(removed_deleted_art.length == 1)
          {
            prevArt = removed_deleted_art[0].upload_date
            nextArt = removed_deleted_art[0].upload_date

            console.log('artist has one art piece belonging to them so prevArt and nextArt are the same.')
          }

          //if(removed_deleted_art[5].upload_date == removed_deleted_art[n].upload_date)
          if(this.art.url == removed_deleted_art[n].url)
          {
            if(n == end)
            {
              prevArt = removed_deleted_art[n-1].upload_date
              nextArt = removed_deleted_art[start].upload_date

              console.log ('when n == end')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
            else if(n == start)
            {
              prevArt = removed_deleted_art[end].upload_date
              nextArt = removed_deleted_art[n+1].upload_date
            
              console.log ('when n == start')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            } 
            else
            {
              console.log ('entered search')
              prevArt = removed_deleted_art[n-1].upload_date
              nextArt = removed_deleted_art[n+1].upload_date
              

              console.log ('normal')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
          }
        }

        console.log("All Art Array", this.$store.state.arts)
        console.log("Real Array of Art", removed_deleted_art)
        console.log("fethcing previous image")

        //
        //console.log('clicked view in viewed artists dash')
        this.$store.commit('set_clicked_art', prevArt)
        localStorage.setItem('clicked_art', prevArt)
        console.log("this.$store.getters.viewed_artist_data",this.$store.getters.viewed_artist_data)
        //const arts= this.$store.getters.viewed_arts
        const arts= removed_deleted_art
        var art = {}
        console.log('art_unique_timestamp', prevArt)
        for (var i=0; i < arts.length; i++) {
          if (arts[i].upload_date === prevArt) {
           console.log('art in loop',arts[i])
            art = arts[i]
            console.log('art in loop',arts[i].art_title)
            localStorage.setItem('art_url', arts[i].url)
            localStorage.setItem('art_title',arts[i].art_title)
            localStorage.setItem('artist_name',arts[i].artist_name)
            localStorage.setItem('description',arts[i].description)
            localStorage.setItem('upload_date', arts[i].upload_date)
            this.$store.state.signed_in_user.instagram
            localStorage.setItem('url',arts[i].url)
            console.log('art_title',localStorage.getItem('art_title'))

            this.art.url = localStorage.getItem('art_url')
            this.art.art_title = localStorage.getItem('art_title')
            this.art.description = localStorage.getItem('description')

            console.log ('this art title: ' ,arts[i].art_title)
            console.log ('this art title: '  ,art.art_title)
            console.log('Routing')
            this.$router.push('/viewed_art')
            break
          }
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
        let prevArt = 0;
        let nextArt = 0;


        for (arti = 0 ; arti < temp_arts.length; arti++){
          if( (temp_arts[arti].delete != true) &&  (duplicate_search.indexOf(temp_arts[arti].upload_date) == -1) ){
            removed_deleted_art.push(temp_arts[arti])
            duplicate_search.push(temp_arts[arti].upload_date)
          }
        }

        var start = 0
        var end = removed_deleted_art.length - 1
        console.log ('Current url image on viewed_art: ', this.art.url)
        console.log ('Real Array of Art url: ', removed_deleted_art[0].url)

        var n = 0
        console.log ('Current url image on viewed_art: ', this.art.url)

        for( n = 0; removed_deleted_art.length > n; n++ ){
          
          if(removed_deleted_art.length == 1)
          {
            prevArt = removed_deleted_art[0].upload_date
            nextArt = removed_deleted_art[0].upload_date

            console.log('artist has one art piece belonging to them so prevArt and nextArt are the same.')
          }

          //if(removed_deleted_art[5].upload_date == removed_deleted_art[n].upload_date)
          if(this.art.url == removed_deleted_art[n].url)
          {
            if(n == end)
            {
              prevArt = removed_deleted_art[n-1].upload_date
              nextArt = removed_deleted_art[start].upload_date

              console.log ('when n == end')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
            else if(n == start)
            {
              prevArt = removed_deleted_art[end].upload_date
              nextArt = removed_deleted_art[n+1].upload_date
            
              console.log ('when n == start')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            } 
            else
            {
              console.log ('entered search')
              prevArt = removed_deleted_art[n-1].upload_date
              nextArt = removed_deleted_art[n+1].upload_date
              

              console.log ('normal')
              console.log ('previous art id', prevArt)
              console.log ('next art id', nextArt)
            }
          }
        }

        console.log("All Art Array", this.$store.state.arts)
        console.log("Real Array of Art", removed_deleted_art)
        console.log("fethcing next image")

        //

        //console.log('LOOK HERE FOR ART ARRAY: ', arts)
        console.log('LOOK HERE FOR ART ARRAY: ', nextArt)
        console.log('another array of art things', arts)


        this.$store.commit('set_clicked_art', nextArt)
        localStorage.setItem('clicked_art', nextArt)
        const arts= removed_deleted_art
        var art = {}
        
        console.log('art_unique_timestamp', nextArt)
        for (var i=0; i < arts.length; i++) {
          if (arts[i].upload_date === nextArt) {
            console.log('art in loop',arts[i])
            art = arts[i]
            console.log('art in loop',arts[i].art_title)
            localStorage.setItem('art_url', arts[i].url)
            localStorage.setItem('art_title',arts[i].art_title)
            localStorage.setItem('artist_name',arts[i].artist_name)
            localStorage.setItem('description',arts[i].description)
            localStorage.setItem('upload_date', arts[i].upload_date)
            this.$store.state.signed_in_user.instagram
            localStorage.setItem('url',arts[i].url)
            console.log('art_title',localStorage.getItem('art_title'))

            this.art.url = localStorage.getItem('art_url')
            this.art.art_title = localStorage.getItem('art_title')
            this.art.description = localStorage.getItem('description')

            console.log ('this art title: ' ,arts[i].art_title)
            console.log ('this art title: '  ,art.art_title)
            console.log('Routing')
            this.$router.push('/viewed_art')
            break
          }
        }
        this.$router.push(
          '/viewed_art'
        )

      },
      back(){
        //window.history.back();
        this.$router.push({
        path:'/artist_dashboard'
        })
      },
       save_comment(art){
        const artists_arts =  this.$store.getters.viewed_arts
        const commented_art = artists_arts.filter(function (the_art) {
          return the_art.upload_date == art.upload_date
        } )
        let commentor =  this.$store.getters.signed_in_user.email
        if (commented_art[0].comments ===  undefined){
          this.new_comments_field.push({from: commentor, comment:this.comment})
        } else {
          // this.new_comments_field = [...commented_art[0].comments,{from: commentor, comment:this.comment} ]
          this.new_comments_field.push({from: commentor, comment:this.comment})
        }
        let upload_date = parseInt(this.art.upload_date)
        this.$store.dispatch('update_art_comments', {upload_date:upload_date,comments: this.new_comments_field}).then(this.snackbar = true)

        this.clear_comment()
      },

      clear_comment()
      {
        this.comment =''
      },
      load_comments(art)
      {
        let comments_field = this.new_comments_field
        
        const artists_arts =  this.$store.getters.viewed_arts
        const commented_art = artists_arts.filter(function (the_art) {
          return the_art.upload_date == art.upload_date
        } )
        
        let upload_date = parseInt(this.art.upload_date)
      
        let db = firebase.firestore()
        let id_of_art = db.collection('art').where('upload_date', '==', upload_date)

        id_of_art.get().then(function (results) {
        if (results.empty) {
          console.log('No documents found! in query')
        } else {
          // go through all results
          results.forEach(function (doc) {
            
            let data = doc.data()
            // let comments = data.comments
            // for (var i = 0; i < comments.length; i++)
            // {
            //   //console.log('from: ', comments[i].from, 'comm: ', comments[i].comment)
            //   comments_field.push(comments[i])
            // }

          })
        }

      })

      }
    },

  }
</script>
<style scoped>
 .main-container {
   width: 100%;
 }
 .small-container-titles {
   font-size: 12pt;
   font-family: Arial, Helvetica, sans-serif;
   
   width: 80%;
 }

 .small-container-details {
   font-size: 12pt;
   font-family: Arial, Helvetica, sans-serif;
   
   width: 80%;
 }

 .small-container {
   margin-left: 1.20rem;
   width: 80%;
 }

  .small-container-btn {
   margin-left: 0.55rem;
   width: 80%;
 }


 .t{
    font-weight: bold
  }
  .b{
    color:black;
    word-wrap:break-word;
    font-weight: normal;
    font-size: 12pt;
    font-family: Arial, Helvetica, sans-serif;
    overflow: auto;
    height:65px;

  }
  .dividing {
    /* padding-top: 30px;
    padding-bottom: 30px; */
    margin-bottom: 3%;
  }

</style>


    <!--
    <v-flex xs6>
      <v-card white>
        <v-card-text class="px-0">{{this.art.art_title}}</v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs6>
      <v-card white>
        <v-card-text class="px-0">{{this.art.description}}</v-card-text>
      </v-card>
    </v-flex>
    -->
<!--
    <div class = "small-container-titles ">
      <h2>{{this.art.art_title}}</h2>
    </div>

    <div class = "small-container-details ">
      <p>{{this.art.description}}</p>
    </div>

    <!--<p v-for="comment_field in new_comments_field"
    :key="comment_field.comment">
    <pre>
    {{comment_field.from}} says: {{comment_field.comment}}
    </pre> 
    </p>
    <v-spacer></v-spacer>-->
<!--
    <v-list two-line>
    <template v-for="comment_field in new_comments_field">
    <v-list-tile
    :key="comment_field.comment"
    class="resize_list"
    >

      <v-list-tile-content>
        <v-list-tile-title class="t" v-html="comment_field.from"></v-list-tile-title>
        <v-list-tile-sub-title class="b" v-html="comment_field.comment"></v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
    </template>
    </v-list>

    <img mt-5 :src="this.art.url" alt="" width="80%" height=100%>

    <v-spacer></v-spacer>
    
    <div class = "main-container" id="titling">
    <h2>{{this.art.art_title}} </h2>
    <h2 id="authorname">by {{this.art.artist_name}}</h2>
    <p>{{this.art.description}}</p>
    </div>

  
    <div class = "small-container">
      <v-divider class = "dividing"></v-divider>
      <v-avatar size="100px" class="avatarStyle" v-bind:cpriolor="black">
        <img v-if="fetchUserProfilePicture" v-bind:src="fetchUserProfilePicture" alt="avatar">
        <div v-else>
          <span style="font-size: 10em; color: white;">{{initial()}}</span>
        </div>
      </v-avatar>

      <v-text-field 
        solo
        class="commenting"
        label="Add Comment.."
        single-line
        v-model="comment"
      ></v-text-field>
    </div>

    <div mb-5 class="small-container">
      <v-btn v-if= "!this.comment.length"  disabled  small>Send</v-btn>
      <v-btn v-else depressed small dark color="black" @click="save_comment(art)">Send</v-btn>
      <v-btn depressed small dark color="black" @click="back">Back</v-btn>
    </div>
  </v-flex>
  
  
  </v-layout>


  <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn
        color="pink"
        flat
        @click="snack_bar_button"
      >
        Close
      </v-btn>
    </v-snackbar>
     -->

