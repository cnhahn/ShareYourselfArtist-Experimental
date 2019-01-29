// Scott Davis
// store/index.js is afile that contains the global state of the application
// as well as provides some getter functions

import * as firebase from 'firebase'
import config from '../../config'
firebase.initializeApp(config)

export default{
  state: {
    top_12_recent_art: [],
    viewed_artist_data: {},
    localStorage,
    db: firebase.firestore(),
    chat_database: firebase.database(),
    arts: [],
    comments: [],
    commenting_mode: false,
    sideNavItems: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        link: '/artist_dashboard'
      },
      // { title: 'Bio & Stats', icon: 'face', link: '/bio' },
      {
        title: 'My Account',
        icon: 'account_box',
        link: '/account'
      }
    ],
    business_side_nav_items: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        link: '/business_dashboard'
      },
      // { title: 'Bio & Stats', icon: 'face', link: '/bio' },
      // { title: 'My Account', icon: 'account_box', link: '/account' },
      {
        title: 'Report',
        icon: 'assessment',
        link: '/report'
      },
      {
        title: 'Chat',
        icon: 'chat',
        link: '/chat'
      }
    ],
    navItems: [

      /*
      {
        title: 'Home',
        icon: 'home',
        link: '/',
        method: '',
        spacing: false
      },
      */
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',
        spacing: false

      },
      {
        title: 'Support',
        icon: 'help',

        link: '/support',
        spacing: false

      },
      {
        title: 'About Us',
        icon: 'nature_people',

        link: '/about_us',
        spacing: false

      },
      {
        title: 'Sign In | Sign Up',
        icon: 'nature_people',

        link: '/sign_in',
        spacing: true

      }
    ],
    navItems_User: [],
    navItems_signedIn: [
      {
        title: 'Submit Your Work',
        icon: 'chrome_reader_mode',
        link: '/blogs'
      },
      {
        title: 'Support',
        icon: 'help',
        link: '/support'
      },
      {
        title: 'About Us',
        icon: 'nature_people',
        link: '/about_us'
      }
    ],
    navItems_Business: [
      {
        title: 'Blogs/Magazines',
        icon: 'chrome_reader_mode',
        link: '/blogs',
        method: 'dummyMethod'
      }
    ],
    sendChatData: {
      user: '',
      message: '',
      daystamp: '',
      timestamp: '',
      url: ''
    },
    uploadedArts: [],
    viewed_arts: [],
    user: null,
    color: 'primary',
    loading: false,
    error: null,
    image_being_uploaded: {},
    url: null,
    logo_url: '',
    user_role: '',
    image_folder: '',
    businesses: [],
    business_signing_up: {},
    artist_signing_up: {},
    clicked_business: {},
    clicked_art: '',
    art_being_submitted_is_selected: false,
    business_being_submitted_is_selected: false,
    businesses_being_submitted: [],
    test: 4,
    signed_in_user: {},
    art_being_submitted: {
      refunded: 0
    },
    replied_requests_for_report_datePicker: [],
    submissions_for_this_business: [],
    submissions_for_month: [],
    submissions_for_year: [],
    epochFirstDayOfMonthArray: [], // aortizoj
    submission_response: {},
    art_being_replied: {},
    credits: 0,
    replied_submissions: [],
    avatar: '',
    signed_in_user_id: '',
    blog_for_report: '',
    subscription_plan: {},
    replied_for_report: [],
    report_month: 1,
    free_credits:0,
    artists_email_list:[],
    categories: [],
    updatedCategories: [],
    selectBlog:{
      userId:'',
      name:'',
      role:'',
    },
    free_credits: 0,
    artists_email_list: [],
    selectBlog: {
      userId: '',
      name: '',
      role: ''
    },
    // working on setting two dates into the date picker
    datePicker: {
      startDate: '',
      endDate: ''
    },
    monthly_report_submissions: [],
    // store email of artist that was just clicked (worked on by Yas)
    query_business_email: '',
    // yiwayana
    info_of_business_for_dashboard2: {},

    // yiwayana and aortiz
    epoch_month_time: [],
    chart_array_for_submissions: [],
    chart_replied_for_submissions: [],
    chart_free_for_submissions: [],
    chart_paid_for_submissions: []
  }
}
