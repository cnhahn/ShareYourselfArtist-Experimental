
<template>
  <v-container>


<v-content lg10>
   
  <v-card    v-for="(item, index) in user_info" :key="item.business_name">
     <v-layout  row >
          <v-flex lg1 md1 ml2 sm1 xs12>
            <v-avatar ml2 v-if="true" style="width: 100px; margin-top: 1vh">
              <img :src="`${item.url}`">
            </v-avatar>
          </v-flex>
          <v-flex lg3 md3 sm3 xs12>
            <div class="businessNameHolder">
              <router-link to="/business">
                <a v-if="userIsAuthanticated" @click='selectBusinessBlog(item.business_name)' class="headline businessName" style="text-decoration:none;" >{{ item.business_name }}</a>
              </router-link>
              <p style="color:orange" v-if="!userIsAuthanticated" class="headline businessName">{{item.business_name}}</p>
              <p>{{ getPassedTime(item.upload_date) }}</p>
                

            </div>
            <v-btn
            v-if="user_role === 'artist' && !item.selected"
            color="green"
            flat
            outline
            class="hidden-md-and-up"
            style="margin-top:25px"
            @click='add_a_business({
            userId: item.userId,
            business_email: item.email,
            business_name: item.business_name
            },index)'>+
          </v-btn>
           <v-btn
            v-if="user_role === 'artist' && item.selected"
            color="red"
            flat
            outline
            class="hidden-md-and-up"
            style="margin-top:25px"
            @click='remove_a_business(item.email, index)'>-
          </v-btn>
          <p   class  ="headline businessName hidden-md-and-up" v-if = "item.selected == true">Selected</p>
            
           
            <div v-show="isActive" class="item-desc"></div>
            
          </v-flex>
          <v-flex lg6 md6 sm6 xs12>
            <div class="text-xs-left">
              <div style="margin-top: 1vh">
                <p><span style="font-weight: bold;">About: </span>{{ item.about }}</p>
                <p><span style="font-weight: bold;">The good: </span>{{ item.the_good }}</p>
                <p><span style="font-weight: bold;">Worth knowing: </span>{{ item.worth_knowing }}</p>
                <p><span style="font-weight: bold;">Additional notes: </span>{{ item.additional_notes }}</p>
              </div>
            </div>
          </v-flex>
          <v-flex>
          </v-flex>
          <v-flex lg2 md2 sm2 xs12 class="hidden-sm-and-down">
               
            <v-btn
            v-if="user_role === 'artist' && !item.selected"
            color="green"
            flat
            outline
            style="margin-top:25px"
            @click='add_a_business({
            userId: item.userId,
            business_email: item.email,
            business_name: item.business_name
            },index)'>+
          </v-btn>
           <v-btn
            v-if="user_role === 'artist' && item.selected"
            color="red"
            flat
            outline
            style="margin-top:25px"
            @click='remove_a_business(item.email, index)'>-
          </v-btn>
          <p   class  ="headline businessName" v-if = "item.selected == true">Selected</p>
          </v-flex>
          <v-flex>
          </v-flex>

        </v-layout>
  </v-card>
             

</v-content>
 <v-btn  lg12 text-lg-right mb-5  
 color="primary" 
 dark 
 @click="route_to"
 large>Submit Your Work</v-btn>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
          isActive: false,
          companies:[{name:"test"},{name: "test2"}],
        dialog: false,
        businesses: [],
        user_info:[],
        headers: [
          {
            text: 'Name',
            align: 'left',
            value: 'user_name'
          },
          {text: 'Notes', value: 'name'},
         // {text: '', value: ''}
        ],
        business_name:'',
        select_business:[],
        business_list_to_submit:[]
      }
    },
    computed: {
      user_role() {
        return this.$store.getters.user_role
      },
      userIsAuthanticated () {
        if(this.$store.getters.user !== null && this.$store.getters.user !== undefined){
          return true
        }else{
          return false
        }
      },
    },
    mounted: function(){
        this.select_business = []      
        for (let i = 0; i < this.user_info.length; i++) { 
          if (this.user_info[i].selected === true){
            this.user_info[i].selected = false
          }
}
  
    },
    created:function(){
       function filter_test(business) {
          return business.userId != 'yekGAvzU5fZKh49e6w0tJuRmFFg1'
        }
         let developerEmails = ['1TGyTLJa9ZXjl0vqEeS97uNDV8O2','XpIQwNnOayXqjdlbh6jDDL5xaaz2','QBRXqktYi0QigFboM92crKAONKn1',
          'nNJHapui93YxDgqCRkLIYBtHjR43','cnhahn@ucsc.edu','KwZ3wOqr06UvELnintWeZYF2aga2', 'yekGAvzU5fZKh49e6w0tJuRmFFg1'];
        let userID = this.$store.state.user.id;
        if( developerEmails.includes(userID)){
          this.user_info = this.$store.state.businesses;
        } else {
          this.user_info = this.$store.state.businesses.filter(filter_test);
        }
        
         for (let i = 0; i < this.user_info.length; i++) { 
          if (this.user_info[i].selected === true){
            this.user_info[i].selected = false
          }
         }
         
    },
    methods:{
      route_to(){
      if (!this.$store.state.art_being_submitted_is_selected && this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'artist_dashboard'
            })
      }
      if (this.$store.state.art_being_submitted_is_selected && !this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'blogs2'
            })
      }
      if (!this.$store.state.art_being_submitted_is_selected && !this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'artist_dashboard'
            })
      }
       if (this.$store.state.art_being_submitted_is_selected && this.$store.state.business_being_submitted_is_selected){
        this.$router.push({
              name: 'submit_result'
            })
      }
    },
      remove_a_business(email,index){
          this.isActive = !this.isActive;
           this.user_info[index].selected= false
           this.business_list_to_submit = this.business_list_to_submit.filter((business) => {
           return business.business_email != email})
            this.$store.commit('set_businesses_being_submitted', this.business_list_to_submit)
          if (this.business_list_to_submit.length ==0){
              this.$store.commit('set_business_being_submitted_is_selected', false)
          }
      },
      add_a_business( business, index ){
        this.$store.commit('set_business_being_submitted_is_selected', true)
         this.isActive = !this.isActive;
        this.user_info[index].selected= true
        var id = this.business_list_to_submit .length + 1
        var found = this.business_list_to_submit.some(function (el) {
          return el.business_email === business.business_email
        })
        if (!found) {
          console.log('adding')
        this.business_list_to_submit.push(business)
        this.$store.commit('set_businesses_being_submitted', this.business_list_to_submit)
    }
    else{
      console.log('already in the array')
    }

      
      // var business_is_in_the_array = false
      // if (this.business_list_to_submit == 0) {
      //   this.business_list_to_submit.push( business )
      // }else{
      // for ( let i =0; this.business_list_to_submit.length; i++ ){
      //   console.log ('business.business_email == this.business_list_to_submit.business_email: ' , business.business_email == this.business_list_to_submit[i].business_email)
      //   if ( business.business_email == this.business_list_to_submit[i].business_email){
      //     business_is_in_the_array = true
      //     console.log( 'business_is_in_the_array: ', business_is_in_the_array )
      //     break
      //   }
      // }
      // console.log( 'business_is_in_the_array', business_is_in_the_array )
      //   if (business_is_in_the_array == false){
      //      this.business_list_to_submit.push( business )
      //     console.log('business added')
      //   }
      //   }
      },
      clicked_business(userId){
        const costOfBusiness = 1
        //this.$store.commit('set_art_being_submitted_is_selected', true)
        this.$store.commit('set_business_being_submitted',{businessId:userId, date: Date.now()})
        this.$store.commit('set_business_being_submitted_is_selected',true)
        console.log("art being submitted " + this.$store.state.art_being_submitted_is_selected )
        if(this.$store.state.art_being_submitted_is_selected === true){
           this.$router.push({
                        name: 'submit_result' 
                })
          // if(this.$store.getters.current_credits > costOfBusiness) {
          //   console.log("credits: " + this.$store.getters.current_credits)
          //   const creditAfterSubmit = this.$store.getters.current_credits - costOfBusiness
          //   this.$store.commit('set_business_being_submitted',{businessId:userId, date: Date.now()})
          //   this.$store.dispatch('submit_request')
          //   this.$router.push({
          //     name: 'submit_result'
          //   })
          //   this.$store.dispatch('update_user_credit', creditAfterSubmit)
          //   this.$store.commit('set_credits', creditAfterSubmit) 
          // } else {
          //     alert("Buy some more credits! You have " + this.$store.getters.current_credits + " credits.")
          //     this.$router.push({
          //       name: 'account' 
          //     })
          // } 
        }
        else {
          this.$router.push({
            name: 'artist_dashboard'
          })
        }
      },
      /*
      If joined more than 1 year ago, Joined n years ago
      Else if joined more than 1 month ago, Joined n months ago
      Else Joined n days ago
      var time: time string(not timestamp)
       */
      getPassedTime(time) {
        var today = new Date();
        var thatDay = new Date(time);
        var passedTime = today - thatDay;
        var passedDay = new Date(passedTime)
        if (passedDay.getFullYear() > 1970) {
          return "Joined " + passedDay.getFullYear() + " years ago"
        } else if (passedDay.getMonth() > 0) {
          return "Joined " + passedDay.getUTCMonth() + " months ago"
        } else {
          var date = passedDay.getDate() - 1
          return "Joined " + date + " days ago"
        }
      },
      selectBusinessBlog(name){
        this.business_name=name
        console.log("Business name",this.business_name)
        let myArray=this.$store.getters.businesses
        this.select_business=myArray.filter(((business)=>{
          return business.business_name == this.business_name
        }))
        this.$store.commit('set_select_blog',{name:this.select_business[0].business_name,
                                                             userId:this.select_business[0].userId,
                                                             role:'business',                                                         
                                                             })
      }
    },
  }
</script>
<style scoped>
  .container {
    height: 100vh;
  }
  .divbottomline {
    border-bottom: 1px solid #e0e0e0;
  }
  .table {
    padding-top: 0px;
    margin-bottom: 200px;
  }
  .businessName {
    margin-top: 1vh;
    margin-bottom: 0.25vh;
  }
  .businessUser {
    margin-top: 1vh;
  }
  .businessNameHolder {
    margin-left: 1vw;
  }
  .noteHolder {
    margin-top: 1vh;
  }
  a{
    text-decoration: none
  }
</style>