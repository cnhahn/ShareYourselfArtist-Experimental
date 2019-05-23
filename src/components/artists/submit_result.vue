<template>
  <v-container mt-3>
    <v-layout row wrap>
      <v-flex lg4 md4 sm12 xs12 ml-2 mr-2>
        <h1>Okay. Almost there!</h1>
        <p style="font-size: 1.3em">
          You are submitting <b>{{art.art.art_title}}</b><br/>
          <b>to</b>
          <ul id="example-1">
        <li v-for="business in businesses_being_submitted" >
          {{ business.business_name }}
        </li>
        </ul>

        </p>
        <div class="buttons hidden-sm-and-down">
          <v-btn depressed dark large color="black"  @click="cancel">Cancel</v-btn>
          <v-btn @click="submit_art" depressed large color="primary">Submit</v-btn>
        </div>
      </v-flex>
      <v-flex lg6 md6 sm12 xs12 ml-2 mr-2>
        <img :src="art.art.url" alt="" width="100%">
      </v-flex>
      <v-flex sm12 xs12 ml-2 mr-2>
        <div class="buttons hidden-md-and-up">
          <v-btn depressed dark large color="black"  @click="cancel">Cancel</v-btn>
          <v-btn @click="submit_art" depressed large color="primary">Submit</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
 export default {
   methods:{
       //submission of an artpiece
       submit_art(){
          const costOfBusiness = this.$store.getters.businesses_being_submitted.length
          //checks if the current credits is more than business cost
          if (this.$store.getters.free_credits >= costOfBusiness){
            const free_creditAfterSubmit = this.$store.getters.free_credits - costOfBusiness 
            this.$store.dispatch('submit_request_with_free_credits') 
            this.$store.commit('set_free_credits', free_creditAfterSubmit)
            this.$store.dispatch('update_user_free_credit', free_creditAfterSubmit)
            //this.$store.commit('set_free_credits', free_creditAfterSubmit)
            this.$store.commit('set_art_being_submitted_is_selected',false)
            this.$store.commit('set_business_being_submitted_is_selected',false)
            alert('Success! You have submitted your art using your free credits!')
          }
          else if(this.$store.getters.credits >= costOfBusiness ) { 
            // decrements user credits, submits the artwork, updates user credits, and removes mutations specific to the selected art and business
            const creditAfterSubmit = this.$store.getters.credits - costOfBusiness 
            this.$store.dispatch('submit_request') 
            this.$store.dispatch('update_user_credit', creditAfterSubmit)
            this.$store.commit('set_credits', creditAfterSubmit) 
            this.$store.commit('set_art_being_submitted_is_selected',false)
            this.$store.commit('set_business_being_submitted_is_selected',false)
            alert('Success! You have submitted your art using your premium credits!')

          } else {
            // if the user doesn't have enough credits we urge them to buy some
            alert("Buy more credits! You have " + this.$store.getters.credits + " credits")
            this.$router.push({
              name: 'account'
            })
          }
        },
        //cancellation method goes back to dashboard and removes mutations specific to the selected art and business
        cancel() {
          this.$store.commit('set_art_being_submitted_is_selected',false)
          this.$store.commit('set_business_being_submitted_is_selected',false)
          this.$router.push({
              name: 'artist_dashboard' 
          })
        }       
     },
     computed:{
       //returns the current art
       art(){
         return this.$store.getters.art_being_submitted
       },
       businesses_being_submitted(){
        return this.$store.getters. businesses_being_submitted
      } 
     }
 }
</script>

<style>
  .buttons{
    margin-left: -8px;
  }
</style>