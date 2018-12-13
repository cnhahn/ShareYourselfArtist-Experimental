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
    <v-layout row>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{ businesses.length }}</h3>
              <div>Businesses</div>
            </v-flex>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{ artists_email_list.length }}</h3>
              <div>Artists</div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <div v-on:click="yearly_submissions" id="submissions">
                <h3 class="headline mb-0">{{ submissions_for_month.length }}</h3>
                <div>Submissions</div>
              </div>
            </v-flex>
            <v-flex class="sm-6">
              <div v-on:click="yearly_replied" id="replied">
                <h3 class="headline mb-0">{{ replied_for_month }}</h3>
                <div>Replied</div>
              </div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <div v-on:click="yearly_free">
                <h3 class="headline mb-0">{{ free_submissions_for_month }}</h3>
                <div>Free</div>
              </div>
            </v-flex>
            <v-flex class="sm-6">
              <div v-on:click="yearly_paid">
                <h3 class="headline mb-0">{{ paid_submissions_for_month }}</h3>
                <div>Paid</div>
              </div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <br>

  <br>
    <v-card>
      <GChart type="LineChart" :data="chartData" :options="chartOptions" />
    </v-card>
  <br>
    <v-card>
      <v-card-title><h3>Businesses</h3>
        <v-spacer></v-spacer>

        <!-- Input to search for a blog -->
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <!-- Headers -->
      <v-data-table :headers="business_headers" :items="businesses" :search="search" hide-headers>
        <!-- Display business data table and make it clickable. -->
        <template slot="items" slot-scope="props">
          <tr @click="goto_dashboard2(props.item.email);">
            <td>{{ props.item.business_name }}</td>
            <td>{{ props.item.email }}</td>
            <!-- <td>{{ props.item.upload_date }}</td> -->
          </tr>
        </template>
        <v-alert
          slot="no-result"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-card>
    <br>
    <v-layout row align-center>
      
      <v-flex xs4 ma-2 class="text-xs-center">
        <v-card-actions class="justify-center">
          <router-link to="/monthly_report">

            <v-btn pa-7 large router to dark color="primary"><h3>Monthly Report</h3></v-btn>

          </router-link>
        </v-card-actions>
      </v-flex>
    <br>

      <v-flex xs4 ma-2 >
        <span class="headline">Search for Artists</span>
        <v-text-field
          v-model="artist_email"
          label="email"
          :rules="emailRules"
          v-on:keyup.enter="searchArtistEmail()"
        ></v-text-field>
        <v-btn color="primary" @click="searchArtistEmail()" >Search</v-btn>
        <v-alert type="error" :value="alert">Your search for "{{ artist_email }}" found no results.</v-alert>
      </v-flex>
      <v-flex xs4 ma-2>
      <span class="headline">Give Promotional Credits</span>
      <v-spacer></v-spacer>
      <v-text-field v-model="freeCredits" label="# of credits to add to all users" :rules="giveCreditsRules" solo></v-text-field>
      <!-- :disabled="isCreditBtnDisabled" -->
      <v-btn color="primary" @click="giveCredits()">Submit</v-btn>
      </v-flex>
    </v-layout>
    <v-card-title><h3>Artists</h3>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table :headers="artist_headers" :items="artists_email_list" :search="search">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_name }}</td>
        <td>{{ props.item.artist_email }}</td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
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

  data() {
    return {
      chartData: [1],
      chartOptions: {
        title: "Annual Submission Report",
        vAxis: { title: "Number of Submissions" },
        hAxis: { title: "Months" },
        width: 1100,
        height: 300
      },
      name: "",
      business_email: "",
      count: "",
      search: "",
      artist_email: "",
      alert: false,
      freeCredits: 0,
      giveCreditsRules: [
        v => v > 0 || "Number of credits must be more than zero"
      ],
      emailRules: [v => /.+@.+/.test(v) || "E-mail must be valid"],
      artist_headers: [
        {
          text: "Name",
          align: "left",
          sortable: false,
          // value: "name"
        },
        {
          text: "Email",
          sortable: false,
          // value: "calories"
        },
      ],
      business_headers: [
        {
          text: "Name",
          align: "left",
          sortable: false,
          // value: "name"
        },
        {
          text: "Email",
          sortable: false,
          // value: "calories"
        },
      ]
    };
  }
};
</script>
