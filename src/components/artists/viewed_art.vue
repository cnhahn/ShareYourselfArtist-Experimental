<template>
  <v-container ml-3>
  <v-layout class = "main-container" wrap>

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
      <v-btn v-if= "!this.comment.length"   disabled  large>Send</v-btn>
      <v-btn v-else depressed  dark large color="primary" @click="save_comment(art)">Send</v-btn>
      <v-btn  depressed dark large color="black" @click="back">Back</v-btn>
    </div>
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
  </v-container>
</template>

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
            artist_name: localStorage.getItem('artist_name'),
            description: localStorage.getItem('description'),
            upload_date: localStorage.getItem('upload_date'),
            newComment:''
          },

          new_comments_field: []
        }
        },
    computed:{
      fetchUserProfilePicture () {
        return this.$store.getters.signed_in_user.profileUrl
      },
    },
    methods: {
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
 .small-container {
   width: 100%;
   /* padding: 10px; */
 }

  #titling {
    margin-top: 3%;
  }

  #authorname{
    font-size: 95%;
    margin-bottom: 2%;
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


