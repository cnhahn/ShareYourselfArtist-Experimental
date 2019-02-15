<template>
  <v-container>
    <div class="loading_holder" v-if="loading">
      <div class="spinner_holder">
        <c-spinner></c-spinner>
      </div>
    </div>

    <v-progress-circular
    v-if="updating_responses"
    indeterminate
    color="primary"
    ></v-progress-circular>

    <v-icon @click="fetchRepliedSubmissions" color="black" class="topIcon" large>refresh</v-icon>
        <v-btn @click="reviewList__unread_reviews" flat color="primary">Unread</v-btn>
        <v-btn @click="reviewList__read_reviews" flat color="primary" >Read</v-btn>

    <v-data-table flat :items="reviewList" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
      <td>
        <v-layout row wrap>
          <v-flex lg1 md1 sm1 xs12>
            <v-avatar v-if="true" style="width: 100px; margin-top: 1vh">
              <img :src="`${props.item.art.url}`">
            </v-avatar>
          </v-flex>
          <v-flex lg3 md3 sm3 xs12>
            <div class="artNameHolder">
              <p class="headline artName">{{ props.item.art.art_title }}</p>
              <p>Feedback by: {{ props.item.businessId.business_name }}</p>
            </div>
            <div class="hidden-md-and-up">

              <v-btn  v-if =(!props.item.read_byartist)  flat small color="primary"  @click= "markAsRead(props.item.submitted_on) "> Mark as read</v-btn>
            </div>
          </v-flex>
          <v-flex lg6 md6 sm6 xs12>
            <div class="text-xs-left">
              <div style="margin-top: 1vh">
                <p v-if="props.item.submission_response.radios=='accepted'" class="title">{{  props.item.businessId.business_name }} has accepted to publish {{ props.item.art.art_title }}. </p>
                <p>Response: {{ props.item.submission_response.response }}</p>

              </div>
            </div>
          </v-flex>
          <v-flex lg2 md2 sm2 xs12 class="hidden-sm-and-down">
            <v-layout row wrap style="margin-top: 1vh">

              <v-flex lg3 md2 sm2 xs12>
                <v-btn  v-if =(!props.item.read_byartist)  flat small color="primary"  @click= "markAsRead(props.item.art.upload_date) "> Mark as read</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </td>
    </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    // Gives components these arrays to display
    data() {
      return {
        dialog: false,
        reviewList: [],
        masterList: [],
        headers: [
          {
            text: 'Art'
          },
        ],

        updating_responses: false
      }
    },
    // fetch submissions on create to be used later for display
    created() {
      this.fetchRepliedSubmissions();
    },
    // once the replied submissions has been returned we can set loading to false => loading is a component we have set temporarily
    computed: {
      reviews() {
        return this.$store.state.replied_submissions;
      },
      loading() {
        return this.$store.getters.loading;
      }
    },
    methods: {
      // filters the unread reviews by checking the field read_byartist is false against the array
      reviewList__unread_reviews: function () {
        this.reviewList = this.masterList.filter(( review ) => {
          return review.read_byartist == false
        })
      },
      // filters the read reviews by checking the field read_byartist is true against the array
      reviewList__read_reviews: function () {
        this.reviewList = this.masterList.filter(( review ) => {
          return review.read_byartist == true
        })
      },
      // button uses prop to identify and change the field read_byartist as true which can be found in read_reviews
      markAsRead: function (upload_date) {
        for ( var i in this.reviewList ) {
          if ( this.reviewList[i].art.upload_date == upload_date ) {
            this.reviewList[i].read_byartist = true
            this.$store.dispatch( 'update_review_read_byUser_status', upload_date  )
          break
          }
        }

        /*updating_responses = true
        this.fetchRepliedSubmissions()
        updating_responses = false*/
      },
      // calls this function once on created(), grabs submissions inside the promise.
      async fetchRepliedSubmissions () {
        try {
          const that = this;
          this.$store.commit( 'clear_replied_submissions_array' )
          let fetchAsync = new Promise ( resolve => {
            let res = null
            let that_that = that
            that.$store.dispatch( 'fetch_replied_submissions' ).then(() => {
              res = that_that.$store.getters.replied_submissions
              resolve ( res )
            })
          })
          fetchAsync.then (
            res => {
              that.masterList = res
              that.reviewList = res
              if ( res == null ) {
                that.$router.push ({
                  name: 'reviews_empty'
                })
              }
            }
          )
        } catch ( error ) {
          console.log( error );
        }
      }
    }
  }
</script>

<style scoped>
  .reviewContainer {
    margin-top: 1vh;
  }
  .artTitle {
    margin-top: 1vh;
    margin-left: 1vh;
  }
  .container {
    height: 100vh;
  }
  .loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
  .table {
    padding-top: 0px;
    margin-bottom: 200px;
  }
  .artName {
    margin-top: 1vh;
    margin-bottom: 0.25vh;
  }
  .artNameHolder {
    margin-left: 1vw;
  }
  .noteHolder {
    margin-top: 1vh;
  }
  .topIcon{
    margin-left: 10px;
    cursor: pointer;
  }
</style>

