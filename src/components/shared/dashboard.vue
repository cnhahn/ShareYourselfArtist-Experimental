<template>
  <v-container
    v-if="
      this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' ||
        this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' ||
        this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1' ||
        this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' ||
        this.$store.getters.user.id == 'QBRXqktYi0QigFboM92crKAONKn1'
    "
  >

    <v-divider style="margin-top: 45px"></v-divider>

    <v-layout row wrap mt-4>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Businesses</strong></p>
        <p class="body-2">{{ businesses.length }}</p>
      </v-flex>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Artists</strong></p>
        <p class="body-2">{{ artists_email_list.length }}</p>
      </v-flex>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Submissions</strong></p>
        <p class="body-2">{{ submissions_for_month.length }}</p>
      </v-flex>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Replied</strong></p>
        <p class="body-2">{{ replied_for_month }}</p>
      </v-flex>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Free</strong></p>
        <p class="body-2">{{ free_submissions_for_month }}</p>
      </v-flex>

      <v-flex xs3 sm2 mb-2 text-xs-center>
        <p class="subheading mb-1"><strong>Paid</strong></p>
        <p class="body-2">{{ paid_submissions_for_month }}</p>
      </v-flex>

    </v-layout>

    <v-divider></v-divider>

    <v-card class="ml-5 mr-5 mt-4 elevation-0">
      <p class="subheading"><strong>Database of Registered Businesses</strong></p>
      <v-text-field class="search-box" v-model="search" append-icon="search" label="Search" single-line hide-details style="margin-top: -20px"></v-text-field>

      <v-data-table :rows-per-page-items="[10, 15, 20]" :headers="headers" :items="businesses" :search="search" hide-headers>

        <template slot="items" slot-scope="props">
          <tr @click="goto_dashboard2(props.item.email);">
            <td>{{ props.item.business_name }}</td>
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.upload_date }}</td>
          </tr>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-card>

    <v-divider></v-divider>

      <v-layout row class="ml-5 mr-5 mt-4">

        <v-flex xs6>

        <p class="subheading"><strong>Database of Registered Artists</strong></p>
        <v-text-field
          single-line hide-details style="margin-top: -20px"
          v-model="artist_email"
          label="Search"
          append-icon="search"
          :rules="emailRules"
          v-on:keyup.enter="searchArtistEmail()"
        ></v-text-field>
        <v-data-table :headers="headers" :items="artists_email_list" :search="search" hide-headers>
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.artist_name }}</td>
        <td class="text-xs-right">{{ props.item.artist_email }}</td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>

    </v-flex>

    <v-flex xs4 style="margin-left: 100px">

    <p class="subheading"><strong>Distribute Credits</strong></p>
    <v-text-field solo class="mb-4" v-model="freeCredits" label="# of credits" :rules="giveCreditsRules"></v-text-field>
    <v-btn depressed block class="mb-4" color="primary" @click="giveCredits()">Submit Above Credits</v-btn>

    <v-btn depressed block class="mb-4" router to="/monthly_report" color="primary">View Monthly Reports</v-btn>

    <p class="subheading"><strong>View Graphs</strong></p>

    <v-layout row wrap style="margin-left: -8px">
      <v-flex xs6>
        <v-btn depressed v-on:click="yearly_submissions" color="primary" style="width:150px">Submitted</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn depressed v-on:click="yearly_replied" color="primary" style="width:150px">Replied</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn depressed v-on:click="yearly_free" color="primary" style="width:150px">Free</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn depressed v-on:click="yearly_paid" color="primary" style="width:150px">Paid</v-btn>
      </v-flex>
    </v-layout>

    </v-flex>
    
  </v-layout>

  <v-divider></v-divider>

  <v-layout>
    <GChart type="LineChart" :data="chartData" :options="chartOptions"/>
  </v-layout>


  </v-container>
  <h1 v-else>You are not authorized to view this page</h1>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch("get_email_list_of_artists");
    this.$store.dispatch("get_submissions_for_month");
    this.$store.dispatch("get_submissions_for_year");
    this.$store.dispatch("get_submissions_past_months");
  },
  methods: {
    generate_artists_email_list() {
      this.$store.dispatch("get_email_list_of_artists");
      console.log(this.$store.getters.artists_email_list);
    },
    goto_dashboard2(business_email) {

      this.$store.commit("set_query_business_email", {
        business_email: business_email
      });
      this.$store.dispatch(
        "query_info_of_business_for_dashboard2",
        business_email
      );
      localStorage.setItem("business_email", business_email);
      console.log("email" + business_email);
      this.business_email = business_email;
      this.$router.push("dashboard2");
    },
    goto_monthly_report() {
      this.$router.push("monthly_report");
    },
    search_artists() {
      if (artist_email in this.$store.getters.artists_email_list) {
        this.router.push();
      }
    },
    searchArtistEmail() {
      const artistList = this.$store.getters.artists_email_list;

      for (let obj in artistList) {
        if (this.artist_email == artistList[obj].artist_email) {
          //get from firebase the user for this email
          this.$store.dispatch("get_artist_settings_artist", this.artist_email);
          return;
        }
      }
      this.alert = true;
    },
    giveCredits() {
      this.$store.dispatch("distributeCredits", this.freeCredits);
    },
    yearly_submissions() {
      this.chartData = this.$store.getters.yearly_chart_array;
      this.chartOptions = {
        width: 1100,
        height: 300
      };
    },
    yearly_replied() {
      this.chartData = this.$store.getters.yearly_chart_replied;
      this.chartOptions = {
        title: "Annual Response Report",
        vAxis: { title: "Number of Replies" },
        hAxis: { title: "Months" },
        width: 1100,
        height: 300
      };
    },
    yearly_paid() {
      this.chartData = this.$store.getters.yearly_chart_paid;
      this.chartOptions = {
        title: "Annual Paid Submission Report",
        vAxis: { title: "Number of Paid Requests" },
        hAxis: { title: "Months" },
        width: 1100,
        height: 300
      };
    },
    yearly_free() {
      this.chartData = this.$store.getters.yearly_chart_free;
      this.chartOptions = {
        title: "Annual Free Submission Report",
        vAxis: { title: "Number of Free Requests" },
        hAxis: { title: "Months" },
        width: 1100,
        height: 300
      };
    }
  },
  computed: {
    isCreditBtnDisabled() {
      return this.freeCredits > 0 ? false : true;
    },
    formIsValid() {
      return this.business_email !== "";
    },
    artistSearchFormIsValid() {
      return this.artist_email !== "";
    },
    businesses() {
      //MODIFY THIS ONE
      return this.$store.getters.businesses;
    },
    artists_email_list() {
      //MODIFY THIS ONE
      return this.$store.getters.artists_email_list;
    },
    free_submissions_for_month() {
      let submissionsForMonth = this.$store.getters.submissions_for_month;
      let free_submissions = submissionsForMonth.filter(function(
        submissionsArray
      ) {
        return submissionsArray.submitted_with_free_cerdit == true;
      });
      return free_submissions.length;
    },
    replied_for_month() {
      let submissionsForMonth = this.$store.getters.submissions_for_month;
      let replied_submissions = submissionsForMonth.filter(function(month) {
        return month.replied == true;
      });
      return replied_submissions.length;
    },
    paid_submissions_for_month() {
      let submissionsForMonth = this.$store.getters.submissions_for_month;
      let paid_submissions = submissionsForMonth.filter(function(
        submissionsArray
      ) {
        return submissionsArray.submitted_with_free_cerdit == false;
      });
      console.log("paid subs: " + paid_submissions);

      return paid_submissions.length;
    },
    submissions_for_month() {
      return this.$store.getters.submissions_for_month;
    },
    submissions_for_year() {
      return this.$store.getters.submissions_for_year;
    }
  },
  mounted () {
    this.yearly_submissions()
  },

  data() {
    return {
      chartData: [1],
      chartOptions: {
        title: "Annual Submission Report",
        vAxis: { title: "Number of Submissions" },
        hAxis: { title: "Months" },
        width: 900,
        height: 300
      },
      name: "",
      business_email: "",
      count: "",
      search: "",
      graph: false,
      artist_email: "",
      alert: false,
      freeCredits: 0,
      giveCreditsRules: [
        v => v > 0 || "Number of credits must be more than zero"
      ],
      emailRules: [v => /.+@.+/.test(v) || "E-mail must be valid"],
    };
  }
};
</script>
