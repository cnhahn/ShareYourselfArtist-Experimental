<template>
  <v-container>
<div>
    <v-alert
      v-model="alert"
      color="error"
      icon="warning"
      dismissible
      outline
    >
     Your transaction has been canceled. Your account has not been charged.
    </v-alert>
  </div>
  <div>
    <v-alert
      v-model="alert2"
      color="success"
      icon="check_circle"
      dismissible
      outline
    >
     Success! Your Account has been updated.
    </v-alert>
  </div>
    <v-content class="body">
      <v-layout column class="titles">
        <h2 class="title-1">Get More Credits</h2>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 md6 lg3 class="plan">
          <p mb2 class="text-1">{{plans[0].title}}: {{plans[0].price}}<br>{{plans[0].credit}}</p>
          <PayPal
            style="z-index: 0"
            class="paypal_btn"
            env="production"
            amount="5.00"
            currency="USD"
            :button-style="myStyle"
            :client="credentials"
            v-on:payment-authorized="paymentAuthorized"
            v-on:payment-completed="paymentCompleted"
            v-on:payment-cancelled="paymentCancelled"
            :braintree="braintreeSdk"
            :experience="experienceOptions">
          </PayPal>
        </v-flex>
        <v-flex xs12 md6 lg3 class="plan">
          <p mb2 class="text-1">{{plans[1].title}}: {{plans[1].price}}<br>{{plans[1].credit}}</p>
          <PayPal
            class="paypal_btn"
            env="production"
            amount="10.00"
            currency="USD"
            :button-style="myStyle"
            :client="credentials"
            v-on:payment-authorized="paymentAuthorized"
            v-on:payment-completed="paymentCompleted"
            v-on:payment-cancelled="paymentCancelled"
            :braintree="braintreeSdk"
            :experience="experienceOptions">
          </PayPal>
        </v-flex>
        <v-flex xs12 md6 lg3 class="plan">
          <p mb2 class="text-1">{{plans[2].title}}: {{plans[2].price}}<br>{{plans[2].credit}}</p>
          <PayPal
            class="paypal_btn"
            env="production"
            amount="20.00"
            currency="USD"
            :button-style="myStyle"
            :client="credentials"
            v-on:payment-authorized="paymentAuthorized"
            v-on:payment-completed="paymentCompleted"
            v-on:payment-cancelled="paymentCancelled"
            :braintree="braintreeSdk"
            :experience="experienceOptions">
          </PayPal>
        </v-flex>
      </v-layout>
      <v-layout column class="text-2">
        <h2 class="title-2"><strong>Why use premium credits?</strong></h2>
        <p class="text-1">
          Premium credits help to ensure that blogs actually listen to and respond to submissions in a timely
          manner.<br>
          Here are some of their benefits:<br>
        </p>
        <v-flex v-for="(text, index) in texts">
          <strong>{{index + 1}}.</strong> {{text}}<br>
        </v-flex>
      </v-layout>
      <v-layout column class="text-2">
        <v-flex>
          <p class="text-1">
            * If the above conditions are not met after 48 hours, you get your credit back!<br>
            ** Premium credits are roughly US$1 each, with discounts if you buy more. For example, you can use five
            credits to send
            one song to five bloggers.<br>
          </p>
        </v-flex>
      </v-layout>
    </v-content>
  </v-container>
</template>


<script>
  import PayPal from 'vue-paypal-checkout'
  export default {
    data() {
      return {
        alert: false,
        alert2: false,
        credits: this.$store.state.credits,
        myStyle: {
          label: 'buynow',
          size: 'responsive',
          shape: 'rect',
          color: 'gold'
        },
        plans: [{title: "Local Plan", credit: "8 Credits", price: "$5"},
          {title: "Professional Plan", credit: "20 Credits", price: "$10"},
          {title: "Art Agent Plan", credit: "50 Credits", price: "$20"},
          {title: "One-Time Purchase", credit: "8 Credits", price: "$5"}
        ],
        texts: ["Guaranteed response within 48 hours",
          "Your submission filters to the top",
          "Bloggers must listen for 20 seconds before making a decision",
          "You'll get at least 10 words of feedback if your submission is declined"
        ],
        //for credentials: go to myApps&credentials>SYA>and get Client Id
        //credentials: https://developer.paypal.com/developer/applications/edit/QVVPemJGUlIyZkgtN3dFLWh5N0dEWV9WLUtib1NBWEtJWVJPVEJ5Yi1ydkQ5VTl5RXdzSzFvdzBEcy1UYWNsYUZjRmF6MmhuR1RRV3hpZHc=
        credentials: {
          //sandbox: 'AUMG7iQnZXtVIwv1R7yOdaErgzEwnv0RBkJ0G7UVqrx24wwntxearlBpkG-QtTyT3LCDl4_nNxGXHEpI',
          production: 'AQLbYCSHCG1px-hFg4FCcI-9b5RXJZ9zeaEe_sn5Tbz0d46DUlF_Yatgbhrsm6o1ZmaLvcYVrPzt42Za'
        },
        braintreeSdk: window.braintree,
        experienceOptions: {
          input_fields: {
            no_shipping: 1
          }
        }
      }
    },
    components: {
      PayPal
    },
    methods: {
      increase_credit: function (credit) {
        //update state
        this.$store.commit('increase_credits',credit )
        //update state
        this.$store.dispatch('update_user_credit', this.$store.state.credits)
      },
      paymentAuthorized: function (data) {
        console.log(data)
      },
      paymentCompleted: function (data) {
        let credit_dolar_value = Number(data.transactions[0].amount.total)
        switch (credit_dolar_value) {
          case 5:
            this.increase_credit(8)
            break
          case 10:
            this.increase_credit(20)
            break
          case 20:
            this.increase_credit(50)
            break
        }
        this.alert2=true
        //update db
        //update state
        
      },
      paymentCancelled: function (data) {
        this.alert=true
      }
    },
   
  }
</script>
<style scoped>
  .paypal_btn {
    height: 50px;
    z-index: 0;
  }
  .body {
    margin: 25px;
  }
  .title-1 {
    font-family: 'Raleway', sans-serif;
    font-size: 1.3em;
  }
  .title-2 {
    font-weight: bold;
    font-family: 'Raleway', sans-serif;
    font-size: 1em;
  }
  .text-1 {
    margin: 0px;
  }
  .text-2 {
    margin: 10px;
  }
  .plan {
    margin: 10px;
  }
  .headline {
    color: #000;
    font-size: 150px;
  }
</style>