<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>

  <v-container v-else>

    <v-jumbotron
      :gradient="gradient"
      light
      src="/static/images/13.jpg"
      height="82vh"
    >
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3 title1">Great!</h3>

            <div class="headline title2">You have purchased our  {{this.plan}} ({{this.credit}} credits). Your confrimation number is {{this.confirmation}}. Your account will be updated monetarily.</div>

            <div class="title mb-3 middleText1">Let's submit your art piece!</div>

            <v-btn
              class="mx-0"
              color="primary"
              depressed
             to="/artist_dashboard"
             
            >
              Submit Art
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>


  </v-container>
</template>

<script>

  export default {
      beforeDestroy() {
          let susbcription_date = Date.now()
          let amt = this.amount
          let credit_after_purchase
switch (amt) {
    case '5.00':
        credit_after_purchase = this.$store.getters.credits+8
        this.$store.dispatch('update_user_credit', credit_after_purchase)
        this.$store.commit("set_credits", credit_after_purchase)
        break
    case '10.00':
     credit_after_purchase = this.$store.getters.credits+25
        this.$store.dispatch('update_user_credit', credit_after_purchase)
        this.$store.dispatch('update_user_subscription', {plan:"Local Plan", active: true, expiration: susbcription_date+2592000000, subscription_date: susbcription_date })
        this.$store.commit("set_credits", credit_after_purchase)
        break
    case '20.00':
        credit_after_purchase = this.$store.getters.credits+70
        this.$store.dispatch('update_user_credit', credit_after_purchase)
        this.$store.dispatch('update_user_subscription', {plan:"Professional Plan", active: true, expiration: susbcription_date+2592000000, subscription_date: susbcription_date })
        this.$store.commit('set_credits', credit_after_purchase)
        break
    case '50.00':
        credit_after_purchase = this.$store.getters.credits+210
        this.$store.dispatch('update_user_credit', credit_after_purchase)
        this.$store.dispatch('update_user_subscription', {plan:"Art Agent Plan", active: true, expiration: susbcription_date+2592000000, subscription_date: susbcription_date })
        this.$store.commit("set_credits", credit_after_purchase)
        break
}
    
  },
      created() {
    var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
let tx = getUrlParameter('tx')
this.confirmation = tx
let amt = getUrlParameter('amt')
this.amount = amt
let st = getUrlParameter('st')
this.status = st
switch (amt) {
    case '5.00':
        this.plan = "One-Time Purchase"
        this.credit = 8
        break
    case '10.00':
        this.plan = "Local Plan"
        this.credit = 25
        break
    case '20.00':
        this.plan = "Professional Plan"
         this.credit = 70
        break
    case '50.00':
         this.credit = 210
         this.plan = "Art Agent Plan"
        break
}
  },
    /*
    This function routes to artist_dashboard if there's change on artist work.
     */
    
    data: () => ({
      gradient: 'to top right, rgba(255,255,255, 1), rgba(255,255,255, .3)',
      status: '',
      confirmation:'',
      amount:'',
      plan:'',
      credit:''
    }),
   computed: {

      loading() {
        return this.$store.getters.loading;
      },
    },
    methods:{
        getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
    }
  }
</script>
<style>
  .title1 {
    margin-top: 10px;
    font-family: "Roboto", sans-serif;
    font-weight: lighter;
    font-size: 1.6em;
  }
  .title2 {
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1.6em;
    color: #222222;
  }
  .middleText1 {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.6em;
    margin-top: 20vh;
  }
</style>