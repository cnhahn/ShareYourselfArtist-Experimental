<template>
 
      <h1 class="display-2 font-weight-thin mb-3">{{fullName}}</h1>
     
</template>
 <script>
  export default {
        data () {
      return {
        value:1
      }
    },
  computed: {
  fullName: function() {
    // getter
    //  return this.$store.state.test
    let db = this.$store.getters.db
      db.collection("review_requests")
                      .where("replied", "==", false)
                    .onSnapshot(function(querySnapshot) {
                      var submissions_fetched = []
                      querySnapshot.forEach(function(doc) {
                        if (doc.data().art != null){
                          var data = {
                          'id': doc.id,
                          'art_title': doc.data().art.art_title,
                          'artist_name': doc.data().art.artist_name
                          }
                          submissions_fetched.push(data)
                          console.log(data)
                        }         
                   })
                   console.log('submissions_fetched', submissions_fetched)
                   console.log('submissions_fetched id',submissions_fetched[0].id)
                   this.value =   submissions_fetched[0].id
                   })
                   return 2
  }
}

}  
</script>

    