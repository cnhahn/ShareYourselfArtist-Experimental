<template>
  <v-container ml-3>
  <v-layout class = "main-container" wrap>
    <div class = "main-container">
    <h2>{{this.art.art_title}}</h2>
    <p>{{this.art.description}}</p>
    </div>

    <!--<p v-for="comment_field in new_comments_field"
    :key="comment_field.comment">
    <pre>
    {{comment_field.from}} says: {{comment_field.comment}}
    </pre> 
    </p>
    <v-spacer></v-spacer>-->

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
      <v-btn v-if= "!this.comment.length"   disabled  large>Send</v-btn>
      <v-btn v-else depressed  dark large color="primary" @click="save_comment(art)">Send</v-btn>
      <v-btn  depressed dark large color="black" @click="back">Back</v-btn>
    </div>
    <img mt-5 :src="this.art.url" alt="" width="80%" height=100%>
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
          description: localStorage.getItem('description'),
          upload_date: localStorage.getItem('upload_date'),
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
        window.history.back();
        /*this.$router.push({
        path:'/artist_dashboard'
        })*/
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
 .small-container {
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


