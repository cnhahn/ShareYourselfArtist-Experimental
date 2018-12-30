<template>
  <v-container ml-3>
  <v-layout class = "main-container" wrap>
    <div class = "main-container">
    <h2>{{this.art.art_title}}</h2>
    <p>{{this.art.description}}</p>
    </div>
    <div class = "small-container">
      <v-text-field
          label="Comment"
          single-line
      ></v-text-field>
    </div>
      <div mb-5 class="small-container">
      <v-btn  depressed dark large color="black" @click="back">Back</v-btn>
    </div>
    <img mt-5 :src="this.art.url" alt="" width="80%" height=100%>
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
          description: localStorage.getItem('description'),
          upload_date: localStorage.getItem('upload_date'),
          newComment:''
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
       save_comment(upload_date){
        console.log("upload_date " + upload_date)
        this.$store.commit('set_commenting_mode',!this.$store.getters.commenting_mode)
        const db = this.$store.getters.db
        var artRef = db.collection("art")
                        .where('upload_date', '==', upload_date)
                        .get()
                        .then(function (querySnapshot){
                  querySnapshot.forEach(function(doc){
                    var docRef = db.collection("art").doc(doc.id).collection("comments").doc("scott").add({comments: this.art.newComment})

          })
        }) //5gWmUSOeEZX49S5cJtIW  this.art.upload_date*/
        // console.log(artRef)
        // var newComment = {
        //   author: this.$store.getters.signed_in_user.name,
        //   id: this.$store.getters.signed_in_user.id,
        //   body: this.art.newComment,
        // }
        // this.$store.commit('set_comments', newComment)
        // //console.log("artRef: ",artRef);

        // return artRef.update({
        //   comments: this.$store.getters.comments
        // })
        // console.log("uploading was a success!")
        // .then(function() {
        //     console.log("Document successfully updated!");
        // })
        // .catch(function(error) {
        //     // The document probably doesn't exist.
        //     console.error("Error updating document: ", error);
        // });
        // //console.log(this.$store.getters.comments)
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
<style scoped>
 .main-container {
   width: 100%;
 }
 .small-container {
   width: 80%;
 }
</style>


