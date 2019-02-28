<template>

  <v-container>

    <h6 class="headline mb-4" style="font-weight: bold; color: black !important">Blogs</h6>

    <!-- MOBILE SCREEN -->

    <v-layout row wrap style="margin-bottom:-10px" v-if="screen_breakpoint">
      <v-flex lg4 md4 sm5> <p class="body-2 ml-2"> Name </p> </v-flex>
      <v-flex lg1 md1 hidden-sm-and-down> <p class="body-2"> Fans </p> </v-flex>
      <v-flex lg6 md6 sm6> <p class="body-2"> Notes </p> </v-flex>
    </v-layout>

    <v-layout row wrap v-for="blog in user_info" v-bind:key="blog.url" v-if="!screen_breakpoint">

      <v-flex xs12 mb-3>
        <v-divider class="mt-1 mb-1"></v-divider>
      </v-flex>

      <v-flex xs1 mr-5>
        <v-avatar>
          <img :src="`${blog.url}`">
        </v-avatar>
      </v-flex>

      <v-flex>

        <h6 
          v-if="userIsAuthanticated"
          v-on:click="selectBusinessBlog(blog.business_name), $router.push('/business')"
          class="headline" 
          style="color:#FF7D27; margin-top: -5px; cursor: pointer;"
          > 
            {{blog.business_name}} 
          </h6>

        <h6 v-else class="headline" style="color:#FF7D27; margin-top: -5px"> {{blog.business_name}} </h6>

        <p class="body-1" style="font-size:.8em !important">{{ getPassedTime(blog.upload_date) }}</p>
        <p class="body-1 hidden-md-and-up" style="font-size:.8em !important; margin-top:-15px">Fans: {{ blog.follower_count }}</p>

        <v-btn 
          v-if="user_role === 'artist'"
          @click='clicked_business({
              	userId: blog.userId,
              	business_email: blog.email,
              	business_name: blog.business_name
              })'
          depressed
          small
          color = "primary"
          style="margin-left: 0px; margin-top: -10px"
        >
          Select Blog
        </v-btn>

      </v-flex>

      <v-flex xs12>
            <p class="body-1" style="font-size: .85em !important; margin-top: 0px"><strong>About: </strong> <span>{{ blog.about }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>The Good: </strong> <span>{{ blog.the_good }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>Worth Knowing: </strong> <span>{{ blog.worth_knowing }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>Additional Notes: </strong> <span>{{ blog.additional_notes }} </span> </p>
          </v-flex>

    </v-layout>

    <!-- END OF MOBILE SCREEN -->

    <!-- ALL OTHER SCREENS -->

    <v-layout row wrap v-for="blog in user_info" v-bind:key="blog.url" v-if="screen_breakpoint">

      <v-flex lg12 xs12 mb-3>
        <v-divider class="mt-1 mb-1"></v-divider>
      </v-flex>

      <v-flex lg1 md1 sm1 mb-3>
        <v-avatar>
          <img :src="`${blog.url}`">
        </v-avatar>
      </v-flex>

      <v-flex lg3 md3 sm4>

        <h6 
          v-if="userIsAuthanticated"
          v-on:click="selectBusinessBlog(blog.business_name), $router.push('/business')"
          class="headline" 
          style="color:#FF7D27; margin-top: -5px; cursor: pointer;"
          > 
            {{blog.business_name}} 
          </h6>

        <h6 v-else class="headline" style="color:#FF7D27; margin-top: -5px"> {{blog.business_name}} </h6>

        <p class="body-1" style="font-size:.8em !important">{{ getPassedTime(blog.upload_date) }}</p>
        <p class="body-1 hidden-md-and-up" style="font-size:.8em !important; margin-top:-15px">Fans: {{ blog.follower_count }}</p>
        
        <v-btn 
          v-if="user_role === 'artist'"
          @click='clicked_business({
              	userId: blog.userId,
              	business_email: blog.email,
              	business_name: blog.business_name
              })'
          depressed
          small
          color = "primary"
          style="margin-left: 0px; margin-top: -10px"
        >
          Select Blog
        </v-btn>


      </v-flex>

      <v-flex lg1 md1 hidden-sm-and-down>
        <p class="body-2"> {{ blog.follower_count }} </p>
      </v-flex>

      <v-flex lg6 md6 sm6>

        <v-layout row wrap>

          <v-flex lg12>
            <p class="body-1" style="font-size: .85em !important; margin-top: 0px"><strong>About: </strong> <span>{{ blog.about }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>The Good: </strong> <span>{{ blog.the_good }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>Worth Knowing: </strong> <span>{{ blog.worth_knowing }} </span> </p>
            <p class="body-1" style="font-size: .85em !important; margin-top: -10px"><strong>Additional Notes: </strong> <span>{{ blog.additional_notes }} </span> </p>
          </v-flex>

        </v-layout>

      </v-flex>

    </v-layout>

    <!-- END OF ALL OTHER SCREENS -->

  </v-container>

  

</template>

<script>
  export default {
    data() {
      return {
        screen_breakpoint: false,
        dialog: false,
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
        select_business:'',
      }
    },
    mounted() {
      this.onResize()
      
      window.addEventListener('resize', this.onResize, {passive: true})
    },

    beforeDestroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, {passive: true})
      }
    },
    computed: {
      user_role() {
        return this.$store.getters.user_role
      },
      user_info() {
        let developerEmails = ['1TGyTLJa9ZXjl0vqEeS97uNDV8O2','XpIQwNnOayXqjdlbh6jDDL5xaaz2','QBRXqktYi0QigFboM92crKAONKn1',
          'nNJHapui93YxDgqCRkLIYBtHjR43','cnhahn@ucsc.edu','KwZ3wOqr06UvELnintWeZYF2aga2', 'yekGAvzU5fZKh49e6w0tJuRmFFg1', 'uBGYNkmd6oegfU6JDIRq1pDtYmz2'];
        let userID = this.$store.state.user.id;
   
        function filter_test(business) {
          return business.userId != 'yekGAvzU5fZKh49e6w0tJuRmFFg1'
        }

        if( developerEmails.includes(userID)){
          return this.$store.state.businesses;
        } else {
          return this.$store.state.businesses.filter(filter_test);
        }
        
      },

      userIsAuthanticated () {
        if(this.$store.getters.user !== null && this.$store.getters.user !== undefined){
          return true
        }else{
          return false
        }
      },
    },
    methods:{
      onResize() {
        this.screen_breakpoint = window.innerWidth > 700
      },
      clicked_business(userId){
        const costOfBusiness = 1
        //this.$store.commit('set_art_being_submitted_is_selected', true)
        this.$store.commit('clear_businesses_being_submitted')
        this.$store.commit('set_business_being_submitted',{businessId:userId, date: Date.now()})
        this.$store.commit('set_business_being_submitted_is_selected',true)
        this.$store.commit('set_businesses_being_submitted', [userId])
        console.log("art being submitted " + this.$store.state.art_being_submitted_is_selected )
        this.$store.commit('set_art_being_submitted_is_selected', true)
        console.log("art being submitted should be true " , this.$store.getters.get_art_being_submitted_is_selected)
        if(this.$store.getters.get_art_being_submitted_is_selected === true){
           this.$router.push({
                        name: 'artist_dashboard' 
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