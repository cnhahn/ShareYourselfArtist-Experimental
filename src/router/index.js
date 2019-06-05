import Vue from "vue"
import Router from "vue-router"
import Home from "@/components/Home"

import sign_in from "@/components/shared/sign_in"
import support from "@/components/shared/support"
import about_us from "@/components/shared/about_us"
import account from "@/components/shared/account"
import account2 from "@/components/shared/account2"
import chat from "@/components/shared/chat"
import spinner from "@/components/shared/spinner"
import pageNotFound from '@/components/shared/page_not_found'
import Profile from '@/components/shared/profile'
import dashboard from '@/components/shared/dashboard'
import dashboard2 from '@/components/shared/dashboard2'
import monthly_report from '@/components/shared/monthly_report'
import artist_settings from '@/components/shared/artist_settings'
import colleges from '@/components/shared/colleges'

import blogs from "@/components/business/blogs"
import blogs2 from "@/components/business/blogs2"
import business_signup from "@/components/business/business_signup"
import business_signup2 from "@/components/business/business_signup2"
import business_signup3 from "@/components/business/business_signup3"
import joinBusiness_signup from "@/components/business/joinBusiness_signup"
import business_dashboard from "@/components/business/business_dashboard"
import group_business_dashboard from "@/components/business/group_business_dashboard"
import submissions from "@/components/business/submissions"
import submissionsEmpty from '@/components/business/submissions_empty'
import report from "@/components/business/report"
import businessProfile from '@/components/business/business_profile'

import artistDashboardEmpty from '@/components/artists/artist_dashboard_empty'
import payment_confirmation from '@/components/artists/payment_confirmation'
import bio from '@/components/artists/bio'
import art from "@/components/artists/art"
import artist_dashboard from "@/components/artists/artist_dashboard"
import viewed_artist_dashboard from "@/components/artists/viewed_artist_dashboard"
import viewed_art from "@/components/artists/viewed_art"
import artist_signup from "@/components/artists/artist_signup"
import upload_an_image from "@/components/artists/upload_an_image"
import upload_an_image1 from "@/components/artists/upload_an_image1"
import submit_result from "@/components/artists/submit_result"
import new_reviews from "@/components/artists/new_reviews"
import reviewsEmpty from '@/components/artists/review_empty'
import transaction_completed from "@/components/artists/transaction_completed"
import artistProfile from '@/components/artists/artist_profile'
import business from "@/components/shared/business"
import auth_guard from "./auth_guard"
import business_guard from "./business_guard.js"
import not_dash_guard from "./not_dash_guard";
import VueGoogleCharts from 'vue-google-charts'

Vue.use(VueGoogleCharts)
Vue.use(Router)

export default new Router({
  routes: [{
      path: "/colleges",
      name: "colleges",
      component: colleges
    },
    {
      path: "/payment_confirmation",
      name: "payment_confirmation",
      component: payment_confirmation
    },
    {
      path: "/account2",
      name: "account2",
      component: account2
    },
    {
      path: "/business",
      name: "business",
      component: business
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: not_dash_guard
    },
    {
      path: "/artist_signup",
      name: "artist_signup",
      component: artist_signup
    },
    {
      path: "/joinBusiness_signup",
      name: "joinBusiness_signup",
      component: joinBusiness_signup
    },
    {
      path: "/artist_dashboard",
      name: "artist_dashboard",
      component: artist_dashboard,
      beforeEnter: auth_guard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/viewed_artist_dashboard",
      name: "viewed_artist_dashboard",
      component: viewed_artist_dashboard,
      beforeEnter: auth_guard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/artist_dashboard_empty',
      name: 'artist_dashboard_empty',
      component: artistDashboardEmpty,
      beforeEnter: auth_guard
    },
    {
      path: '/business_signup3',
      name: 'business_signup3',
      component: business_signup3

    },
    {
      path: "/business_signup",
      name: "business_signup",
      component: business_signup
    },
    {
      path: "/business_signup2",
      name: "business_signup2",
      component: business_signup2
    },
    {
      path: "/sign_in",
      name: "sign_in",
      component: sign_in,
      beforeEnter: not_dash_guard
    },
    {
      path: "/blogs",
      name: "blogs",
      component: blogs
    },
    {
      path: "/support",
      name: "support",
      component: support
    },
    {
      path: "/transaction_completed",
      name: "transaction_completed",
      component: transaction_completed
    },
    {
      path: "/bio",
      name: "bio",
      component: bio,
      beforeEnter: auth_guard
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: dashboard,
      beforeEnter: auth_guard
    },
    {
      path: "/dashboard2",
      name: "dashboard2",
      component: dashboard2,
      beforeEnter: auth_guard
    },
    {
      path: "/monthly_report",
      name: "monthly_report",
      component: monthly_report,
      beforeEnter: auth_guard
    },
    {
      path: "/artist_settings",
      name: "artist_settings",
      component: artist_settings,
      beforeEnter: auth_guard
    },
    {
      path: "/art",
      name: "art",
      component: art,
      beforeEnter: auth_guard
    },
    {
      path: "/viewed_art",
      name: "viewed_art",
      component: viewed_art,
      beforeEnter: auth_guard
    },
    {
      path: "/account",
      name: "account",
      component: account,
      beforeEnter: auth_guard
    },
    {
      path: "/about_us",
      name: "about_us",
      component: about_us
    },
    {
      path: "/chat",
      name: "chat",
      component: chat,
      beforeEnter: auth_guard
    },
    {
      path: "/upload_an_image1",
      name: "upload_an_image1",
      component: upload_an_image1,
      beforeEnter: auth_guard
    },
    {
      path: "/spinner",
      name: "spinner",
      component: spinner,
      beforeEnter: auth_guard
    },
    {
      path: "/business_dashboard",
      name: "business_dashboard",
      component: business_dashboard,
      beforeEnter: business_guard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/group_business_dashboard",
      name: "group_business_dashboard",
      component: group_business_dashboard,
      beforeEnter: business_guard
    },   
    {
      path: "/upload_an_image",
      name: "upload_an_image",
      component: upload_an_image,
      beforeEnter: auth_guard
    },
    {
      path: "/submit_result",
      name: "submit_result",
      component: submit_result,
      beforeEnter: auth_guard
    },
    {
      path: "/submissions",
      name: "submissions",
      component: submissions,
      beforeEnter: business_guard
    },
    {
      path: '/submissions/empty',
      name: 'submissions_empty',
      component: submissionsEmpty,
      beforeEnter: business_guard
    },
    {
      path: "/report",
      name: "report",
      component: report,
      beforeEnter: business_guard,
      meta: {
        requiresAuth: true
      }
      // beforeEnter: auth_guard -> Are this leaved for debug session?
      // TODO: leave beforeEnter or not?
    },
    {
      path: "/new_reviews",
      name: 'new_reviews',
      component: new_reviews,
      beforeEnter: auth_guard
    },
    {
      path: '/reviews/empty',
      name: 'reviews_empty',
      component: reviewsEmpty,
      beforeEnter: business_guard
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      // TODO: this is only for debug. Recover this after profile page is linked.
      // beforeEnter: auth_guard
    },
    {
      path: '/blogs2',
      name: 'blogs2',
      component: blogs2,
      // TODO: this is only for debug. Recover this after profile page is linked.
      // beforeEnter: auth_guard
    },
    {
      path: '/profile/artist',
      name: 'artist_profile',
      component: artistProfile,
      beforeEnter: auth_guard
      // TODO: this is only for debug. Recover this after profile page is linked.
      // beforeEnter: auth_guard
    },
    {
      path: '/profile/business',
      name: 'business_profile',
      component: businessProfile,
      beforeEnter: business_guard
      // TODO: this is only for debug. Recover this after profile page is linked.
      // beforeEnter: auth_guard
    },
    // Path should NOT be added after this -> if addition is needed, add path before this component!
    {
      path: "*",
      name: 'page_not_found',
      component: pageNotFound
    }
  ],
  mode: "history"
});