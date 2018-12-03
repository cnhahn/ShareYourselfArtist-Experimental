<template>
  <v-container>
    <v-data-table
    :items="user_info"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td> 
        <v-layout row wrap>
          <v-flex lg1 md1 sm1 xs12>
            <v-avatar v-if="true" style="width: 100px; margin-top: 1vh">
              <img :src="`${props.item.url}`">
            </v-avatar>
          </v-flex>
          <v-flex lg3 md3 sm3 xs12>
            <div class="businessNameHolder">
              <router-link to="/business">
                <a v-if="userIsAuthanticated" @click='selectBusinessBlog(props.item.business_name)' class="headline businessName" style="text-decoration:none;" >{{ props.item.business_name }}</a>
              </router-link>
              <p style="color:orange" v-if="!userIsAuthanticated" class="headline businessName">{{props.item.business_name}}</p>
            <!-- <p>{{ getPassedTime(props.item.upload_date) }}</p> -->
            <div class="text-xs-left">
              <div style="margin-top: 1vh">
                <p class="mb-0"><span style="font-weight: bold;">Followers: </span>{{ props.item.follower_count }}</p>
                <p class="mb-0"><span style="font-weight: bold;">Total Submissions: </span>{{ props.item.total_submissions }}</p>
                <p class="mb-0"><span style="font-weight: bold;">Replied Submissions: </span>{{ props.item.replied_submissions }}</p>
                <p class="mb-0"><span style="font-weight: bold;">Reply Time: </span>N/A</p>
                <p class="mb-0"><span style="font-weight: bold;">Email: </span>{{ props.item.email }}</p>
                <a  v-if="props.item.instagram_url !== ''" :href="props.item.instagram_url" target="_blank">
                <img class="icon" src="/static/images/instagram-logo.png" style="width:20%"></a>
                <a v-if="props.item.tumblr_url !== ''" :href="props.item.tumblr_url" target="_blank">
                <img class="icon" src="/static/images/tumblr-logo-2.png" style="width:20%"></a>
                <a v-if="props.item.facebook_url !== ''" :href="props.item.facebook_url" target="_blank">
                <img class="icon" src="/static/images/facebook-logo.png" style="width:20%"></a>
              </div>
            </div>
            </div>
          </v-flex>
          <v-flex lg6 md6 sm6 xs12>
            <div class="text-xs-left">
              <div style="margin-top: 1vh">
                <p><span style="font-weight: bold;">About: </span>{{ props.item.about }}</p>
                <p><span style="font-weight: bold;">The good: </span>{{ props.item.the_good }}</p>
                <p><span style="font-weight: bold;">Worth knowing: </span>{{ props.item.worth_knowing }}</p>
                <p><span style="font-weight: bold;">Additional notes: </span>{{ props.item.additional_notes }}</p>
              </div>
            </div>
          </v-flex>

          <v-flex lg2 md2 sm2 xs12>
            <v-btn
            v-if="user_role === 'artist'"
            color="primary"
            flat
            outline
            style="margin-top:25px"
            @click='clicked_business({
            userId:props.item.userId,
            business_email: props.item.email,
            business_name:props.item.business_name
            })'>Select Blog
            </v-btn>
          </v-flex>

        </v-layout>
      </td>
    </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        search: '',
        businesses: [],
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
        select_business:''
      }
    },
    computed: {
      user_role() {
        return this.$store.getters.user_role
      },
      user_info() {
        function filter_test(business) {
          return (business.userId != 'yekGAvzU5fZKh49e6w0tJuRmFFg1')
        }
        return this.$store.state.businesses.filter(filter_test)
      },
      // filteredBlogs:function(){
      //   console.log('HERE!', this.search);
      //   return this.$store.state.businesses.filter((business) => {
      //     return business.business_name.match(this.search);
      //   });
      // },
      // filteredBlogs() {
      //   function search_filter(business) {
      //     console.log('HERE!', this.search);
      //     return business.business_name.match(this.search)
      //   }
      //   return this.$store.state.businesses.filter(search_filter)
      // },
      userIsAuthanticated () {
        if(this.$store.getters.user !== null && this.$store.getters.user !== undefined){
          return true
        }else{
          return false
        }
      },


    },
    methods:{
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