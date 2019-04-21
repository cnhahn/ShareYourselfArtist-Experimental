
<!--
<template>
  <v-container>

    <v-layout >
      <!-- sm6  -/->
      <!-- <v-flex xs12 fill-height>
        <v-flex xs12 sm6 offset-sm3 fill-height>  -/->
      <v-flex xs12 sm8 offset-sm3 row fill-height> 

        <v-card>
        
          <v-flex> 
            <v-img> 
              <img :src="this.art.url" width="100%" height="100%">
            </v-img>
          </v-flex> 

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

          <v-card-title primary-title>
            <div>
              <div class="title mb-1">
                <h2>
                  {{this.art.art_title}}
                </h2>
              </div>

            <div>
              <div class="mb-2">
                <h3>
                    by {{this.art.artist_name}}
                </h3>
              </div>
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

              <div class = "small-container my-2">
                <v-text-field 
                  solo
                  class="commenting"
                  label="Add Comment.."
                  single-line
                  v-model="comment"
                ></v-text-field>
              </div>
              
              <div class="small-container-btn my-2">
                <v-btn v-if= "!this.comment.length" disabled small>
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

        </v-card>
 
      </v-flex>

    </v-layout>
  </v-container>
</template>
-->

<!--This is the main template that will contain both layouts for the image and the text-->
<template>
  <!--This is the main container that will contain both the layouts for the image and the text-->
  <v-container fluid>
    <!--This is the layouts for the everything (nothing is put here because the v-flex will hold of the styleing options)-->
    <v-layout>
      <!--This v-flex handles the size (hieght/width/dementions) of the image that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex--> 
      <v-flex xs12 sm12 md8 offset-md1 row fill-height> 
        <!--This v-card houses the image and the small icons below it.-->
        <v-card>
          <v-flex > 
            <v-img> 
              <img :src="this.art.url" width="100%" height="100%">
            </v-img>
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
      <v-flex xs1 sm5 offset-md1 row fill-height>
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

    </v-layout>
  
  </v-container>
</template>


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
      <v-list-tile-content >
        <v-list-tile-title class="t" v-html="comment_field.from"></v-list-tile-title>
        <v-list-tile-sub-title class="b" v-html="comment_field.comment"></v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
    </template>
    </v-list>
    
    <v-spacer></v-spacer>

    <div class = "small-container">
      <v-text-field
          label="Comment"
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


<script>
import * as firebase from 'firebase'
  export default {

    mounted: function() {
      this.load_comments(this.art)
    },
        data() {
      return {
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
    methods:{
      snack_bar_button(){
        this.snackbar = false;
        this.$router.push({
      path:'/artist_dashboard'
    })

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
            let comments = data.comments
            for (var i = 0; i < comments.length; i++)
            {
              //console.log('from: ', comments[i].from, 'comm: ', comments[i].comment)
              comments_field.push(comments[i])
            }

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
</style>


