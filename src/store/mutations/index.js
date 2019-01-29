// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions


export default{
  mutations: {
    set_info_of_business_for_dashboard2 (state, payload) {
      state.info_of_business_for_dashboard2 = payload
    },
    clear_info_of_business_for_dashboard2 (state) {
      state.info_of_business_for_dashboard2 = {}
    },
    set_epoch_month_times (state, payload) {
      state.epoch_month_time = payload
    },
    set_chart_array_for_submissions (state, payload) {
      state.chart_array_for_submissions = payload
    },
    set_chart_replied_for_submissions (state, payload) {
      state.chart_replied_for_submissions = payload
    },
    set_chart_paid_for_submissions (state, payload) {
      state.chart_paid_for_submissions = payload
    },
    set_chart_free_for_submissions (state, payload) {
      state.chart_free_for_submissions = payload
    },
    clear_query_datePicker_list (state) {
      state.replied_requests_for_report_datePicker = []
    },
    set_query_business_email (state, payload) {
      state.query_business_email = payload.business_email
    },
    set_datePicker (state, payload) {
      const start_date = payload.startDate + '-00-00-00'
      const start_d = start_date.split('-')
      const start_epoch = new Date(
        start_d[0],
        start_d[1] - 1,
        start_d[2],
        start_d[3],
        start_d[4],
        start_d[5]
      ).valueOf()
      const end_date = payload.endDate + '-00-00-00'
      const end_d = end_date.split('-')
      let end_epoch = new Date(
        end_d[0],
        end_d[1] - 1,
        end_d[2],
        end_d[3],
        end_d[4],
        end_d[5]
      ).valueOf()

      if (end_epoch == start_epoch) {
        console.log('end epoch is : ', end_epoch)
        end_epoch = end_epoch + 86400000
      }

      state.datePicker.startDate = start_epoch
      state.datePicker.endDate = end_epoch
    },
    set_top_12_recent_art (state, payload) {
      state.top_12_recent_art.push(payload)
    },
    set_commenting_mode (state, payload) {
      state.commenting_mode = payload
    },
    set_viewed_artist_data (state, payload) {
      state.viewed_artist_data = payload
    },
    clear_top_12_recent_art (state) {
      state.top_12_recent_art = []
    },
    set_free_credits (state, payload) {
      console.log('inside set free credits')
      console.log(payload)
      if (payload != null || payload != undefined || payload != '') {
        state.free_credits = payload
      } else {
        console.log(
          'An error occured reading the free credits. This user may have never given any free credits.'
        )
      }
    },
    set_artists_email_list (state, payload) {
      state.artists_email_list.push(payload)
    },
    clear_artists_email_list (state) {
      state.artists_email_list = []
    },
    set_blog_for_report (state, payload) {
      state.blog_for_report = payload
    },
    set_categories (state, payload) {
      state.categories = payload
    },
    set_updatedCategories (state, payload) {
      state.updatedCategories = payload
    },
    set_businesses_being_submitted (state, payload) {
      state.businesses_being_submitted = payload
    },
    set_art_being_submitted_is_selected (state, payload) {
      state.art_being_submitted_is_selected = payload
    },
    set_business_being_submitted_is_selected (state, payload) {
      state.business_being_submitted_is_selected = payload
    },
    set_art_being_replied (state, payload) {
      (state.art_being_replied.art_title = payload.art_title),
        (state.art_being_replied.artist_name = payload.artist_name),
        (state.art_being_replied.submitted_on = payload.submitted_on),
        (state.art_being_replied.description = payload.description),
        (state.art_being_replied.artist_id = payload.artist_id),
        (state.art_being_replied.docId = payload.docId)
    },
    increase_credits (state, payload) {
      state.credits = state.credits + payload
    },
    set_credits (state, payload) {
      state.credits = payload
    },
    reset_replied_submissions (state) {
      state.replied_submissions.length = 0
    },
    set_replied_submissions (state, payload) {
      state.replied_submissions.push(payload)
    },
    clear_replied_submissions_array (state) {
      state.replied_submissions = []
    },
    set_response (state, payload) {
      state.submission_response.response = payload.response
      state.submission_response.radios = payload.radios
    },
    set_submission_response (state, payload) {
      state.submission_response = payload
    },
    clear_submissions_for_this_business_array (state) {
      state.submissions_for_this_business = []
    },
    set_submissions_for_this_business (state, payload) {
      state.submissions_for_this_business.push(payload)
    },
    set_art_being_submitted (state, payload) {
      state.art_being_submitted.art = payload
    },
    set_business_being_submitted (state, payload) {
      state.art_being_submitted.businessId = payload.businessId
      state.art_being_submitted.submitted_on = payload.date
    },
    set_clicked_art (state, payload) {
      state.clicked_art = payload
    },
    business_signing_up (state, payload) {
      state.business_signing_up = payload
    },
    artist_signing_up (state, payload) {
      state.artist_signing_up = payload
    },
    test (state, payload) {
      state.test = payload
    },
    set_image_folder (state, payload) {
      state.image_folder = payload
    },
    clear_arts_array (state) {
      state.arts = []
    },
    setArts (state, payload) {
      state.arts.push(payload)
    },
    set_comments(state, payload){
      state.comments.push(payload)
    },
    clear_viewed_arts_array (state) {
      state.viewed_arts = []
    },
    clear_comments_array(state){
      state.comments = []
    },
    set_viewed_arts (state, payload) {
      state.viewed_arts.push(payload)
    },
    setArtCategory (state, payload) {
      console.log('payload.indexOfUpdatedArt', payload.indexOfUpdatedArt)
      console.log('payload.categories', payload.categories)
      state.arts[payload.indexOfUpdatedArt].categories = payload.categories
    },
    clearBusinesses (state) {
      state.businesses = []
    },
    setBusinesses (state, payload) {
      state.businesses.push(payload)
    },
    set_replied_requests_for_report_datePicker (state, payload) {
      state.replied_requests_for_report_datePicker.push(payload)
    },
    clear_replied_for_report_datePicker (state) {
      state.replied_requests_for_report_datePicker = []
    },
    setClickedBusiness (state, payload) {
      state.clicked_business = payload
    },
    setUserRole (state, payload) {
      state.user_role = payload
    },
    uploadedArt (state, payload) {
      state.uploadedArts.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setUrl (state, payload) {
      state.url = payload
    },
    set_logo_url (state, payload) {
      state.logo_url = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    set_user_email (state) {
      state.signed_in_user_email = firebase.auth().currentUser.email
    },
    clearError (state) {
      state.error = null
    },
    set_send_chat_data (state, payload) {
      state.sendChatData.message = payload.message
      state.sendChatData.user = payload.user
      state.sendChatData.daystamp = payload.daystamp
      state.sendChatData.timestamp = payload.timestamp
      state.sendChatData.url = payload.url
    },
    setUserRandColor (state) {
      var rand = Math.floor(Math.random() * 10)
      var randColors = [
        'randColor1',
        'randColor2',
        'randColor3',
        'randColor4',
        'randColor5',
        'randColor6',
        'randColor7',
        'randColor8',
        'randColor9',
        'randColor10'
      ]

      state.color = randColors[rand]
      console.log('color: ' + state.color)
    },
    setUserColor (state, payload) {
      state.color = payload.color
    },
    image_being_uploaded (state, payload) {
      state.image_being_uploaded = payload
    },
    set_user_email (state) {
      state.art_being_submitted.artist_email = firebase.auth().currentUser.email
    },
    clearError (state) {
      state.error = null
    },
    signed_in_user_id (state, payload) {
      state.signed_in_user_id = payload
    },
    signed_in_user (state, payload) {
      state.signed_in_user = payload
    },
    sign_out_signed_in_user (state) {
      state.signed_in_user = null
      state.url = null
      state.color = 'primary'
    },
    set_replied_for_report (state, payload) {
      state.replied_for_report.push(payload)
    },
    set_report_month (state, payload) {
      state.report_month = payload
    },
    set_select_blog (state, payload) {
      (state.selectBlog.name = payload.name),
        (state.selectBlog.userId = payload.userId),
        (state.selectBlog.role = payload.role)
    },
    set_submissions_for_year (state, payload) {
      // aortizoj
      state.submissions_for_year.push(payload)
    },
    clear_submissions_for_year_array (state) {
      // aortizoj
      state.submissions_for_year = []
    },
    set_submissions_for_month (state, payload) {
      // aortizoj
      state.submissions_for_month.push(payload)
    },
    set_epochFirstDayOfMonthArray (state, payload) {
      // aortizoj
      state.epochFirstDayOfMonthArray.push(payload)
    },
    clear_submissions_for_month_array (state) {
      // aortizoj
      state.submissions_for_month = []
    },
    set_monthly_report_submissions (state, payload) {
      state.monthly_report_submissions = payload
    },
    set_artist_settings_artist (state, payload) {
      state.artist_settings_artist = payload.obj
    }
  }
}
