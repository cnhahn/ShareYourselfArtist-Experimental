<template>
  <v-container class ="container">

    <v-toolbar
      dark
      color="primary"
    >
      <v-toolbar-title>Search submissions</v-toolbar-title>
      <v-select
        v-model="selected"
        :search-input.sync="searchInput"
        :items="items"
        class="mx-3"
        flat
        hide-details
        :label="hint"
        solo-inverted
        autocomplete
      ></v-select>  <!--Using autocomplete will produce tons of warnings-->
      <v-menu
      offset-y
      content-class="dropdown-menu"
      transition="slide-y-transition">
        <v-btn
            icon
            slot="activator"
          >
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-card>
          <v-list>
            <v-list-tile
              v-for="item in clickOptions"
              :key="item"
              @click="switchSearchOption(item)"
            >
              <v-list-tile-title
                v-text="item"
              />
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>

    <!--<v-btn @click="getReservedReviews" color="success">Test Get Reserved Submissions</v-btn>-->
    <!--<v-btn @click="getRespondedRequests" color="error">Test Get Responded Review Requests</v-btn>-->
    <!--<p>Selected: {{selected}}</p>-->

    <h1 style="font-weight: bold; margin-top: 5vh; margin-bottom: 1vh;">Submissions</h1>
    <v-layout justify-end>
      <v-btn @click="reserveSubmissions" color="primary">Reserve Submissions</v-btn>
    </v-layout>
    <v-btn flat @click="fetch_submissions">Available Submissions</v-btn>
    <v-btn flat @click="submissions_unreplied_submissions">Reserved Submissions</v-btn>
    <v-btn flat @click="submissions_replied_submissions">Responded Submissions</v-btn> 
    <!--<v-btn flat @click="fetch_submissions">All Submissions</v-btn>
    <v-btn flat @click="submissions_unreplied_submissions">Unreplied Submissions</v-btn>
    <v-btn flat @click="submissions_replied_submissions">Replied Submissions</v-btn> -->

    <!-- <v-layout row wrap justify-center>
    <v-flex xs12 md12 sm6>
      <div class = "text-xs-center">
        <v-spacer></v-spacer> 
        <v-progress-circular
          v-if="loading_submissions"
          indeterminate
          color="primary">
        </v-progress-circular>
      </div>
    </v-flex>
    </v-layout> -->

    <div class = "text-xs-center">
      <div v-if="loading_submissions">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </div> 
      <v-progress-circular
        v-if="loading_submissions"
        indeterminate
        color="primary">
      </v-progress-circular>
    </div>

    <v-layout row justify-center>
      <v-layout row wrap mb-5 v-if="submissions">
        <v-flex xs12 lg4 offset-lg1 mt-5 v-for ="submission in section" :key='submission.id'>
          <v-card>
            <v-card-media :src= "submission.art.url" height="300px"></v-card-media>
            <v-layout row>
              <v-card-title primary-title>
              <div>
                <v-flex>
                  <h4 class="mb-0">{{submission.art.art_title}}</h4>
                  <v-layout row >
                  </v-layout>
                  <v-spacer></v-spacer>
                  <div v-if="submission.instagram"><h3 class="mb-0">{{submission.instagram}}</h3></div>
                </v-flex>
              </div>
              </v-card-title>
            </v-layout>
            <v-card-actions>
               <div v-if="submission.submission_response">
                  <v-icon color="red" v-if="submission.submission_response.radios == 'declined'">close</v-icon>
                  <v-icon color="green" v-if="submission.submission_response.radios == 'accepted'">check</v-icon>
               </div>
              <v-btn icon @click.native="clicked_art(submission.art.upload_date, submission.docId)" flat color="primary" v-if="submission.replied == undefined || submission.replied == false"><v-icon>reply</v-icon></v-btn>
              <v-icon color="green" v-if="!submission.submitted_with_free_cerdit">attach_money</v-icon>
              <v-btn icon @click.native="download(submission.art.url)" flat color="primary" :href=submission.art.url><v-icon>cloud_download</v-icon></v-btn>



              <v-spacer></v-spacer>

              <!--<div v-if="submission.replied == undefined || submission.replied == false">-->
              <div v-if="submission.replied != true && submission.reserved_by === ''">
                <v-checkbox
                v-model="reserved"
                color="primary"
                :value="submission.review_request"
                hide-details
                ></v-checkbox>
              </div>
              <!--</div>-->

          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
            </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show">
            <div><h4> Description: </h4>{{submission.art.description}}</div>
            <div  v-if="submission.submission_response == undefined"> <h4>Response: </h4>You have not responded to this submission yet.</div>
            <div  v-else> <h4>Response: </h4>{{submission.submission_response.response}}</div>
          </v-card-text>
        </v-slide-y-transition>
          </v-card>
        </v-flex>
      </v-layout>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Submit Your Response</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout row wrap>
          <v-flex lg6 sm12>
            <img class= "hidden-sm-and-down replied_image" v-if= "art_being_replied != null" :src = "art_being_replied.art.url">
            <img class= "hidden-md-and-up replied_image_small" v-if= "art_being_replied != null" :src = "art_being_replied.art.url">
          </v-flex>
          <v-flex lg6 sm12 px-2 mt-5 >
            <v-layout row> <p class= "display-1">Art Title: {{art_title}}</p> </v-layout>
            <v-layout row>
              <p class= "body-2">
                <div class="text-xs-center" v-for="(c, index) in categories">
                  <v-chip>{{ categories[index] }}</v-chip>
                </div>
              </p>
            </v-layout>
            <v-layout row> <p class= "body-2">Artist Name: <span class= "body-1">{{artist_name}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2">Instagram: <span class= "body-1">{{instagram}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2"> Submitted on:  <span class= "body-1">{{submitted_on}}</span></p> </v-layout>
            <v-layout row> <p class= "body-2"> Description: <span class= "body-1">{{description}}</span></p> </v-layout>
            <v-text-field
              name="input-1"
              :rules="rules"
              label="Your Response"
              v-model='submission_response'
              textarea
              required
            ></v-text-field>
                <p> We have {{ radios || 'null' }} to post your submission.</p>
                <v-radio-group v-model="radios" :mandatory="false">
                <v-radio label="Accept" value="accepted"></v-radio>
                <v-radio label="Decline" value="declined"></v-radio>
                </v-radio-group>
            <v-btn large color="primary" @click.native='submit_response(submission_response, radios)' :disabled = "!formIsValid">Submit</v-btn>
            <v-container fluid>

            </v-container>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
    <div class="text-xs-center mb-5">
      <v-pagination
        v-model="page"
        :length="Math.ceil(submissions.length / 4)"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>

  export default {
    data () {
      return {
        show: false,
        radios: 'declined',
        dialog: false,
        notifications: false,
        filterReservedPictures : [],
        art_being_replied: null,
        art_title: '',
        artist_name: '',
        submitted_on: '',
        description: '',
        submission_response: '',
        artist_id: '',
        instagram: '',
        docId: '',
        categories: [],
        master_submissions: [],
        submissions: [],
        read_submissions: [],
        unread_submissions: [],
        sub_list: [],
        nameKey: '',
        rules: [v => v.length > 50 || 'Min 50 characters'],
        page: 1,
        loading_submissions: false,
        items: [],
        selected: null,
        searchInput: "",

        saved_submissions: [],
        clickOptions: [
          'Search by art title',
          'Search by artist name',
        ],
        hint: 'Search by art title',
        searchingByTitle: true,

        reserved: [],

        inAvailableTab: false,
        inReservedTab: false,
        reserving_or_responding: false
      }
    },
    beforeMount() {

    },
    mounted(){
      // this.initialImageLoad()
      this.fetch_submissions()
    },
    methods:{
        compare_uniqueId_reservedId(uID){
          let i = 0;
          for(i = 0 ; i < this.reserved.length; i++){
            let rID = this.reserved[i]
            console.log("uid is : " , uID, " and rID is : ", rID);
            console.log("uID == rID : " , uID === rID)
            if(uID === rID){
              return true;
            }
          }
          return false;
        },
        reserveSubmissions()
        {
          console.log('reserved submissions: ', this.reserved)
          // call Kevin's function
          this.$store.dispatch('reserve_selected_submissions', this.reserved)
          .then(response => {

            if (this.reserved.length > 0)
            {
              this.reserving_or_responding = true
              console.log('fetching submissions again')
              this.fetch_submissions()
            }
          }, error => {
            console.error("Reached error in mounted function " , error)
          })

          // let current_section = this.section;
          // let i = 0 ;
          // let new_section = [];
          // console.log("current section length is : " , current_section.length)
          // console.log("the items in current section is : ", this.reserved)
          // for (i = 0; i < current_section.length; i++) {
          // // for (i = current_section.length -1 ; i  >= 0 ; i--){
          //   let unique_art_id = current_section[i].review_request;
          //   if(this.compare_uniqueId_reservedId(unique_art_id)){
          //     this.submissions.splice(i,1);
          //     continue;
          //   }
          //   new_section.push(current_section[i])
          // }
          // this.$store.commit('set_business_submission_section', new_section)
        },
        // getReservedReviews()
        // {
        //   this.$store.dispatch('get_reserved_reviews', this.$store.getters.user.id).then(response => {

        //       console.log('reserved submissions in test getters is ', this.$store.getters.reserved_submissions)
        //   }, error => {
        //     console.error("Reached error in mounted function " , error)
        //   })
        // },
        // getRespondedRequests()
        // {
        //   this.$store.dispatch('get_responded_review_requests', this.$store.getters.get_business_info.userId).then(response => {

        //       console.log('responded requests in test getters is ', this.$store.getters.responded_submissions)
        //   }, error => {
        //     console.error("Reached error in mounted function " , error)
        //   })
        // },
        // populate submissions array depending on the current page selected
        populateSubmissions(page, submissions)
        {
          console.log("in populate submissions");
          if(submissions.length !== undefined && submissions.length !== 0)
          {
            let section = []
            let startIndex = (page-1) * 4
            for(let i = startIndex; i < (startIndex + 4) && submissions[i] !== undefined; i++)
            {
              section.push(submissions[i])
            }
            this.$store.commit('set_business_submission_section', section)
  
          }else{
            this.$store.commit('set_business_submission_section', [])
          }

          if (submissions.length === 0)
          {
            console.log('empty submissions')
            this.$store.commit('set_business_submission_section', [])
          }

        },
        // change searchbar hint if search option is changed
        switchSearchOption(option)
        {
          if (option === 'Search by art title')
          {
            this.hint = 'Search by art title'
            this.searchingByTitle = true
          }
          else
          {
            this.hint = 'Search by artist name'
            this.searchingByTitle = false
          }

          // change items in drop-down that user can select
          if (this.searchingByTitle === true)
          {
            this.items = this.titleOptionsLoad(this.saved_submissions)
          }
          else
          {
            this.items = this.artistOptionsLoad(this.saved_submissions)
          }
        },
        // load title options, aka items, in drop-down
        titleOptionsLoad(submissions)
        {
          let titles = []
          for (let i = 0; i < submissions.length; i++)
          {
            if (submissions[i].art.art_title != undefined)
            {
              titles.push(submissions[i].art.art_title)
            }
          }
          return titles
        },
        // load artist options
        artistOptionsLoad(submissions)
        {
          let artists = []
          for (let i = 0; i < submissions.length; i++)
          {
            if (submissions[i].art.artist_name != undefined)
            {
              artists.push(submissions[i].art.artist_name)
            }
          }
          return artists
        },
        // display new group of pages when searching by art title
        // displays every art that has the same art title
        filterByTitle(title, submissions)
        {
          this.loading_submissions = true

          this.submissions = this.submissions.filter((review) => {
            return review.art.art_title === title
          })

          this.loading_submissions = false

        },
        // display new group of pages when searching by artist
        // displays every art that the artist has submitted
        filterByArtist(artist, submissions)
        {
          this.loading_submissions = true

            this.submissions = this.submissions.filter((review) => {
            return review.art.artist_name === artist
          })

          this.loading_submissions = false

        },
        convert_date(submitted_on)
        {
          let sub_date = parseInt(submitted_on, 10)
          let date = new Date(sub_date)
          return date
        },
        // used to sort because array.sort sorts alphabetically by default
        // a and b are submissions, return highest date to lowest
        compareDates(a, b)
        {

          if (b.submitted_on !== undefined && a.submitted_on !== undefined)
          { 
            return b.submitted_on - a.submitted_on
          }
          else
          {
            // place undefined submissions at end, assuming these are older submissions
            console.log('time submitted not available')
            return -1

            // upload_date is not accurate. don't use it
            //return b.art.upload_date - a.art.upload_date
          }
        },
        // sort submissions by most recent upload date
        sortByDate(submissions)
        {
          submissions.sort(this.compareDates)
        },
        // sort again, by most recent upload date first
        checkSortByDate(submissions)
        {
          let date_a = null
          let date_b = null
          let temp = null
          for (let i = 0; i < submissions.length - 1; i++)
          {
            for (let j = i+1; j < submissions.length; j++)
            {
              if (submissions[i].submitted_on !== undefined && submissions[j].submitted_on !== undefined)
              {
                date_a = this.convert_date(submissions[i].submitted_on)
                date_b = this.convert_date(submissions[j].submitted_on)

                // most recent = submission a should happen after submission b
                // check if that's not the case
                if (date_a.getTime() < date_b.getTime())
                {
                  // this modifies the actual array's elements
                  temp = submissions[j]
                  submissions[j] = submissions[i]
                  submissions[i] = temp
                }
              }
            }
          }

          return submissions
        },
        initialImageLoad() {
          this.loading_submissions = true
          let business_member = true;

          this.$store.dispatch('fetch_all_Submissions', business_member).then(response => {
              this.submissions = this.$store.getters.submissions_for_this_business
              console.log("Submissions is ", this.submissions)
              // order by most recent upload date
              this.sortByDate(this.submissions)
              // sort doesn't order correctly,
              // this sorts by checking every submission but is very slow
              this.checkSortByDate(this.submissions)

              this.master_submissions = this.$store.getters.submissions_for_this_business

              this.submissions = this.submissions.filter((review) => {
                return review.replied != true && review.reserved_by === ''
              })
              console.log('here is initial filtered submissions: ', this.submissions)

              this.loading_submissions = false

              // display list of options in drop-down, may change depending on current tab
              if (this.searchingByTitle === true)
              {
                this.items = this.titleOptionsLoad(this.submissions)
              }
              else
              {
                this.items = this.artistOptionsLoad(this.submissions)
              }
              // save the whole list of submissions because we want to search using this list
              this.saved_submissions = this.submissions

              let temp = []
              for(let i = 0; this.submissions[i] !== null && i < 4; i++)
              {
                temp.push(this.submissions[i])
              }
              this.$store.commit('set_business_submission_section', temp)
              console.log('submissions arr len', this.submissions.length)

          }, error => {
            console.error("Reached error in mounted function " , error)
            this.loading_submissions = false
          })
          if (this.submissions === null) {
            console.log("Got here in sbumissions empty ")
            this.$router.push('/submissions/empty')
          }

      }, 
      download: function(art_link) {
        console.log(art_link)
      },
      
      /* Retrieves all review requests from the server */
      fetch_submissions: function () {

        this.inAvailableTab = true
        this.inReservedTab = false

        this.$store.commit('set_business_submission_section', [])
        this.loading_submissions = true

        let business_member = false
        if(this.$store.getters.user_role == 'business_member'){
          business_member = true;
        }

        this.$store.dispatch('fetch_all_Submissions', business_member).then(response => {

          console.log('here are submissions: ', this.submissions)
          console.log('here are master submissions: ', this.master_submissions)

          this.submissions = this.$store.getters.submissions_for_this_business

          this.sortByDate(this.submissions)

          this.checkSortByDate(this.submissions)

          this.master_submissions = this.$store.getters.submissions_for_this_business

          // filter submissions to display only unreplied, unreserved submissions
          this.submissions = this.submissions.filter((review) => {
            return review.replied != true && review.reserved_by === ''
          })
          console.log('here is filtered submissions: ', this.submissions)

          // console.log('now here is submissions: ', this.submissions)
          // console.log('and here is master submissions: ', this.master_submissions[0].businessId)

        if (this.submissions === null) {
          console.log("submission numbero uno is null")
          this.$router.push('/submissions/empty')
        }
        if (this.master_submissions === null) {
          console.log("submission numbero dos is null")
          this.$router.push('/submissions/empty')
        }
        this.loading_submissions = false

        /*display the page the user was originally on,
        and reset to page 1 if page exceeds actual number of pages.*/
        console.log('reserving or responding is ', this.reserving_or_responding)
        if (this.reserving_or_responding === true)
        {
          console.log('going to users current page')
          if (this.page <= Math.ceil(this.submissions.length / 4))
          {
            console.log('curr page ', this.page)
            this.populateSubmissions(this.page, this.submissions)
          }
          else
          {
            console.log('invalid page')
            this.page = 1
            this.populateSubmissions(this.page, this.submissions)
          }
        }

        // reset selected item to null every time a new tab is selected
        this.selected = null

        if (this.searchingByTitle === true)
        {
          this.items = this.titleOptionsLoad(this.submissions)
        }
        else
        {
          this.items = this.artistOptionsLoad(this.submissions)
        }
        this.saved_submissions = this.submissions

        if (this.reserving_or_responding === false)
        {
          // reset the page to 1 every time a new tab is selected
          this.page = 1

          // let i = 0 ; 
          // let reservedIndex = 0;
          // for(i = 0 ; this.submissions.length; i++){
          //   console.log("right here in for loop");
          //   if(this.submissions[i].reserved_by != undefined){
          //     }
          //     if(this.submissions[i].reserved_by.length != 0){
          //       console.log("if statement is true");
          //       this.filterReservedPictures[reservedIndex] = this.submissions[i];
          //       reservedIndex++;
          //     }

          // }
          this.populateSubmissions(this.page, this.submissions)
        }

        this.reserving_or_responding = false

        console.log('resetting reserved array')
        this.reserved = []

        }, error => {
          console.error('Got nothing from server. Prompt user to check internet connection and try again')
        })
      },

      /* Retrieves review requests that have not been responded to yet */
      submissions_unreplied_submissions: function () {

        this.inAvailableTab = false
        this.inReservedTab = true

        this.loading_submissions = true
        this.$store.dispatch('get_reserved_reviews', this.$store.getters.user.id).then(response => {

              console.log('reserved submissions in getters is ', this.$store.getters.reserved_submissions)
              this.submissions = this.$store.getters.reserved_submissions

              this.sortByDate(this.submissions)
              this.checkSortByDate(this.submissions)

              this.loading_submissions =  false

              /*display the page the user was originally on,
              and reset to page 1 if page exceeds actual number of pages.*/
              if (this.reserving_or_responding === true)
              {
                console.log('going to users current page')
                if (this.page <= Math.ceil(this.submissions.length / 4))
                {
                  console.log('curr page ', this.page)
                  this.populateSubmissions(this.page, this.submissions)
                }
                else
                {
                  console.log('invalid page')
                  this.page = 1
                  this.populateSubmissions(this.page, this.submissions)
                }
              }

        this.selected = null

        if (this.searchingByTitle === true)
        {
          this.items = this.titleOptionsLoad(this.submissions)
        }
        else
        {
          this.items = this.artistOptionsLoad(this.submissions)
        }
        this.saved_submissions = this.submissions

            if (this.reserving_or_responding === false)
            {
              this.page = 1
              this.populateSubmissions(this.page, this.submissions)
            }

            this.reserving_or_responding = false

          }, error => {
            console.error("Reached error in mounted function " , error)
            this.loading_submissions = false
          })
        
        /* previous version, unreplied submissions tab 
        Comment out above block and uncomment this to get all unreplied */
        // this.loading_submissions = true

        // this.submissions = this.master_submissions.filter((review) => {
        //   return review.replied == undefined || review.replied == false
        // })

        // this.loading_submissions = false

        // if (this.searchingByTitle === true)
        // {
        //   this.items = this.titleOptionsLoad(this.submissions)
        // }
        // else
        // {
        //   this.items = this.artistOptionsLoad(this.submissions)
        //   console.log('artists')
        // }
        // this.saved_submissions = this.submissions

        // this.page = 1
        // this.populateSubmissions(this.page, this.submissions)
      },

      /* Retrieves review requests that have already been responded to */
      submissions_replied_submissions: function() {
        
        this.loading_submissions = true
        this.$store.dispatch('get_responded_review_requests', this.$store.getters.get_business_info.userId).then(response => {

            console.log('responded requests in getters is ', this.$store.getters.responded_submissions)
            this.submissions = this.$store.getters.responded_submissions

            //console.log('submissions length is ', this.submissions.length)
            this.sortByDate(this.submissions)
            this.checkSortByDate(this.submissions)

            this.loading_submissions = false

            if (this.searchingByTitle === true)
            {
              this.items = this.titleOptionsLoad(this.submissions)
            }
            else
            {
              this.items = this.artistOptionsLoad(this.submissions)
            }
            this.saved_submissions = this.submissions

            this.page = 1
            this.populateSubmissions(this.page, this.submissions)

            // if cloud fun fails, use the previous version
            if (this.submissions.length === 0)
            {
              /* previous version, replied submissions tab */
              console.log('using previous version to get all unreplied submissions')
              this.loading_submissions = true

              this.submissions = this.master_submissions.filter((review) => {
                return review.replied == true
              })

              this.loading_submissions = false

              this.selected = null

              if (this.searchingByTitle === true)
              {
                this.items = this.titleOptionsLoad(this.submissions)
              }
              else
              {
                this.items = this.artistOptionsLoad(this.submissions)
              }
              this.saved_submissions = this.submissions

              this.page = 1
              this.populateSubmissions(this.page, this.submissions)
            }

        }, error => {
          console.error("Reached error in mounted function " , error)
        })

      },

      /* Saves the review entered by the business and makes accessible to the artist */
      submit_response(response, radios) {
        

        let nameKey = this.nameKey
        let subs = this.submissions
        let new_subs = subs.filter((sub) => {
          return sub.art.upload_date != nameKey
        })
        this.submissions = new_subs
        console.log('nameKey is ' , nameKey , ' submissions is ' , new_subs)
        this.$store.commit('set_response', {response: response, radios:  radios })
        this.$store.dispatch('submit_submission_response', {categories: this.categories, art: this.art_being_replied} )
        .then(response => {
            if (this.inAvailableTab === true)
            {
              this.reserving_or_responding = true
              console.log('reloading available submissions')
              this.fetch_submissions()
            }
            else if (this.inReservedTab === true)
            {
              this.reserving_or_responding = true
              console.log('reloading reserved submissions')
              this.submissions_unreplied_submissions()
            }
          }, error => {
            console.error("Reached error in mounted function " , error)
          })
        this.dialog = false

        // let current_section = this.section
        //   let i = 0
        //   let new_section = []
        //   console.log("current response section length is : " , current_section.length)
        //   console.log("the item being responsed is : ", this.art_being_replied)
        //   for (i = 0; i < current_section.length; i++) {
        //     let unique_art_id = current_section[i].review_request
        //     if(this.art_being_replied === unique_art_id){
        //       console.log('responded art is in section')
        //       this.submissions.splice(i,1);
        //       continue;
        //     }
        //     new_section.push(current_section[i])
        //   }
        //   this.$store.commit('set_business_submission_section', new_section)
      },
      /* Retrieves the data for the selected artwork and allows a review to be made */
      clicked_art(art_unique_timestamp, art_unique_id) {
        /* Timestamp is not unique.
        There may be multiple arts with the same timestamp. 
        This will cause the wrong art to be displayed.
        Using doc id instead. */
        let nameKey = art_unique_timestamp
        this.nameKey = art_unique_timestamp
        let myArray = this.submissions // this.$store.state.submissions_for_this_business
        console.log("My array in clicked_art is : ", myArray);
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].art.upload_date === nameKey && myArray[i].docId === art_unique_id) {
            this.art_being_replied = myArray[i]
            this.art_title = myArray[i].art.art_title
            this.instagram = myArray[i].instagram
            this.artist_name = myArray[i].art.artist_name
            this.description = myArray[i].art.description
            this.categories = myArray[i].art.categories
            let sub_date = parseInt(myArray[i].submitted_on, 10)
            console.log(sub_date)
            let date_converted = function(sub_date){
              let date = new Date(sub_date);
              console.log('DATE IS: ' ,date)
              return date
            }
            this.submitted_on = date_converted(sub_date)


            this.docId = this.art_being_replied.review_request;
            console.log("SHIT ",this.docId);
            this.$store.commit('set_art_being_replied', {
              art_title: myArray[i].art.art_title,
              artist_name: myArray[i].art.artist_name,
              categories: myArray[i].art.categories,
              description: myArray[i].art.description,
              submitted_on: myArray[i].submitted_on,
              artist_id: myArray[i].art.artist_id,
              docId: this.docId
            })
          }
        }
        // default value of artist name and Instagram is Not Available
        // to not confuse the user
        if (this.artist_name === undefined)
        {
          this.artist_name = 'N/A'
        }
        if (this.instagram === undefined)
        {
          this.instagram = 'N/A'
        }
        this.$store.commit('set_clicked_art', art_unique_timestamp)
        this.dialog = true
      }
    },
    computed:{
      section(){
        let section = this.$store.getters.business_submission_section
        return section;
      },
      format_timestamp(timestamp) {
        var date = new Date(timestamp);
        var month = date.getMonth();
        var day = date.getDay();
        var year = date.getYear();

        var formattedTime = month + '/' + day + '/' + year;
        return formattedTime;

      },
      /* Verifies that the business entered data into the field */
      formIsValid () {
        return this.submission_response.length > 50
      },

      /* Selects the artwork that the business has selected */
      art(){
        let myArray = this.$store.state.submissions_for_this_business
        let nameKey = this.$store.state.clicked_art
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].upload_date === nameKey) {
            this.art_being_replied = myArray[i];
          }
        }
      }
    },
    watch: {
      page: function (val) {
        console.log('watched page ', val)
       this.populateSubmissions(val, this.submissions)
      },
      selected(val) {
        if (val != null)
        {
          // set submissions back to the initial list of submissions
          this.submissions = this.saved_submissions

          console.log('selected: ', val)
        
          // search for the selected title or artist
          if (this.searchingByTitle === true)
          {
            this.filterByTitle(val, this.submissions)
          }
          else
          {
            this.filterByArtist(val, this.submissions)
          }

          // reset the page to 1 when user selects an item
          this.page = 1
          this.populateSubmissions(this.page, this.submissions)
        }
      },
      // submissions(val)
      // {
      //   console.log('watched submissions: ', val)
      // }
    },

      /* This component just got created, fetch some data here using an action */
      function() {
        this.$store.dispatch('fetch_all_Submissions').then(response => {
        this.submissions = this.$store.getters.submissions_for_this_business
        this.master_submissions = this.$store.getters.submissions_for_this_business
        }, error => {
          console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })
        if (this.submissions === null) {
          this.$router.push('/submissions/empty')
        }
        if (this.master_submissions === null) {
          this.$router.push('/submissions/empty')
        }
      }
}
</script>
<style scoped>
  .container {
    height: 70vh;
  }
  .replied_image {
    max-width: 600px;
    margin: 50px;
    margin-bottom: 20px;
  }
  .replied_image_small {
    max-width: 100%;
  }
</style>
