// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

export default{
  getters: {
    viewed_artist_data(state){
      return state.viewed_artist_data
    },
    commenting_mode(state){
      return state.commenting_mode
    },
    viewed_arts (state) {
      return state.viewed_arts
    },
    comments (state) {
      return state.comments
    },
    top_12_recent_art(state){
     return state.top_12_recent_art
    },
    businesses_being_submitted(state){
      return state.businesses_being_submitted
    } ,
    report_month(state) {
      return state.report_month
    } ,
    businesses_being_submitted (state){
      return state.businesses_being_submitted
    } ,
    report_month (state) {
      return state.report_month
    },
    replied_for_report (state) {
      return state.replied_for_report
    },
    credits (state) {
      return state.credits
    },
    replied_submissions (state) {
      return state.replied_submissions
    },
    submission_response (state) {
      return state.submission_response
    },
    art_being_replied (state) {
      return state.art_being_replied
    },
    submissions_for_this_business (state) {
      return state.submissions_for_this_business
    },
    art_being_submitted (state) {
      return state.art_being_submitted
    },
    business_signing_up (state) {
      return state.business_signing_up
    },
    clicked_busliness (state) {
      return state.clicked_business
    },
    image_folder (state) {
      return state.image_folder
    },
    user_role (state) {
      return state.user_role
    },
    user (state) {
      return state.user
    },
    url (state) {
      return state.url
    },
    color (state) {
      return state.color
    },
    categories (state) {
      return state.categories
    },
    updatedCategories (state) {
      return state.updatedCategories
    },
    image_being_uploaded (state) {
      return state.image_being_uploaded
    },
    businesses (state) {
      return state.businesses
    },
    allArts (state) {
      return state.arts
    },
    // a getter function that returns an array that contains arts that are sorted by their upload date.
    uploadedArts (state) {
      return state.arts.sort((artA, artB) => {
        return artA.upload_date < artB.upload_date
      })
    },
    // a getter that returns a function that takes in an artId and...
    uploadedArt (state) {
      return artId => {
        return state.uploadedArts.find(art => {
          return art.id - artId
        })
      }
    },
    // a getter function that takes in an array that contains all of the arts and returns the first five of them as futured arts
    featuredArts (state, getters) {
      return getters.uploadedArts.slice(0, 5)
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    },
    // a getter that returns the chat database
    chat_database (state) {
      return state.chat_database
    },
    replied_requests_for_report (state) {
      return state.replied_requests_for_report
    },
    sendChatDataMessage (state) {
      return state.sendChatData.message
    },
    sendChatDataUser (state) {
      return state.sendChatData.user
    },
    sendChatDataDaystamp (state) {
      return state.sendChatData.daystamp
    },
    sendChatDataTimestamp (state) {
      return state.sendChatData.timestamp
    },
    sendChatDataUrl (state) {
      return state.sendChatData.url
    },
    signed_in_business (state) {
      return state.signed_in_business
    },
    avatar (state) {
      return state.avatar
    },
    signed_in_user (state) {
      return state.signed_in_user
    },

    signed_in_user_id (state) {
      return state.signed_in_user_id
    },
    db (state) {
      return state.db
    },
    current_credits (state) {
      return state.signed_in_user.credits
    },
    selectBlog (state) {
      return state.selectBlog
    },
    datePicker (state) {
      return state.replied_requests_for_report_datePicker
    },
    query_email (state) {
      return state.query_business_email
    },
    free_credits (state) {
      return state.free_credits
    },
    artists_email_list (state) {
      return state.artists_email_list
    },
    submissions_for_month (state) {
      return state.submissions_for_month
    },
    submissions_for_year (state) {
      return state.submissions_for_year
    },
    monthly_report_submissions (state) {
      return state.monthly_report_submissions
    },
    artist_settings_artist (state) {
      return state.artist_settings_artist
    },
    // Yiwayana and aortiz
    yearly_chart_array (state) {
      return state.chart_array_for_submissions
    },
    yearly_chart_replied (state) {
      return state.chart_replied_for_submissions
    },
    yearly_chart_paid (state) {
      return state.chart_paid_for_submissions
    },
    yearly_chart_free (state) {
      return state.chart_free_for_submissions
    },
    info_of_business_for_dashboard2 (state) {
      return state.info_of_business_for_dashboard2
    }
  }
}
