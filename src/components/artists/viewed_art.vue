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

          <div v-if="this.$store.getters.commenting_mode == false">
            <v-btn flat  color="primary"
            @click="comment_art()"
            >Comment on this piece</v-btn>
          </div>
          <div v-if="this.$store.getters.commenting_mode == true">
            <textarea style="border: 2px solid black" v-model="art.newComment" placeholder="Enter your comment here..."></textarea>
            <v-btn flat  color="primary"
            @click="save_comment()"
            >Post Comment</v-btn>
            <v-btn flat  color="primary"
            @click="comment_art()"
            >Cancel</v-btn>
          </div>

          <div v-if="true" class = "commentSection">
              <div v-for="comment in this.$store.getters.comments" class = "commentBox">
                <h4><b>{{comment.author}}</b></h4>
                <div class = "commentBody">
                  <h3>{{comment.body}}</h3>
                </div>
              </div>
            </div>

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
      comment_art(){
        this.$store.commit('set_commenting_mode',!this.$store.getters.commenting_mode)
      },
      save_comment(){
        this.$store.commit('set_commenting_mode',!this.$store.getters.commenting_mode)
        const db = this.$store.getters.db
        var artRef = db.collection("art").doc("5gWmUSOeEZX49S5cJtIW") //5gWmUSOeEZX49S5cJtIW  this.art.upload_date*/
        var newComment = {
          author: this.$store.getters.signed_in_user.name,
          id: this.$store.getters.signed_in_user.id,
          body: this.art.newComment,
        }
        this.$store.commit('set_comments', newComment)
        //console.log("artRef: ",artRef);
        
        return artRef.update({
          test2: this.$store.getters.comments
        })
        console.log("uploading was a success!")
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        //console.log(this.$store.getters.comments)
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
  .commentBody {
    margin-left: 10px;
  }
  .commentSection {
    /*background-color: lightgray;*/
  }
  .commentBox {
    margin-top: 10px;
    /*
    border: 1px solid black;
    */
  }
</style>