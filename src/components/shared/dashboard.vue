<template>
  <v-container
    v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' || this.$store.getters.user.id == 'QBRXqktYi0QigFboM92crKAONKn1'"
  >
    <v-layout row>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{businesses.length}}</h3>
              <div>Businesses</div>
            </v-flex>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{artists_email_list.length}}</h3>
              <div>Artists</div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{submissions_for_month.length}}</h3>
              <div>Submissions</div>
            </v-flex>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{replied_for_month}}</h3>
              <div>Replied</div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex class="ml-3" xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{free_submissions_for_month}}</h3>
              <div>Free</div>
            </v-flex>
            <v-flex class="sm-6">
              <h3 class="headline mb-0">{{paid_submissions_for_month}}</h3>
              <div>Paid</div>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card>
      <v-card-title>Blogs
        <v-spacer></v-spacer>
        <!-- Input to search for a blog  -->
        <v-text-field v-model="search" append-icon="search" label="hello" single-line hide-details></v-text-field>
      </v-card-title>
      <!-- Headers -->
      <v-data-table :headers="headers" :items="businesses" :search="search" hide-headers>
        <!-- Display business data table and make it clickable. -->
        <template slot="items" slot-scope="props">
          <tr @click="goto_dashboard2(props.item.email)">
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
    <v-layout row>
      <v-card-actions>
        <v-btn @click="goto_monthly_report()" dark color="orange">Monthly Report</v-btn>
      </v-card-actions>
    </v-layout>
    <v-container fill-height fluid>
      <v-layout fill-height>
        <v-flex xs12 align-end flexbox>
          <span class="headline">Search for Artists</span>
          <v-text-field v-model="artist_email" label="email" required :rules="emailRules"></v-text-field>
          <v-btn color="primary" @click="searchArtistEmail()" :disabled="isDisabled">Submit</v-btn>
          <v-alert
            type="error"
            :value="alert"
          >Your search for "{{ artist_email }}" found no results.</v-alert>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-title>Artists Email List
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table :headers="headers" :items="artists_email_list" :search="search" hide-headers>
      <template slot="items" slot-scope="props">
        <td class="text-xs-right">{{ props.item.artist_name }}</td>
        <td class="text-xs-right">{{ props.item.artist_email }}</td>
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
      localStorage.setItem("business_email", business_email);

      this.$store.commit("set_query_business_email", {
        business_email: business_email
      });
      localStorage.setItem("business_email", business_email);
      console.log("email" + business_email);
      this.business_email = business_email;
      this.fetch_report();
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
    fetch_report() {},
    searchArtistEmail() {
      const artistList = this.$store.getters.artists_email_list;
      // console.log(artistList)
      for (let obj in artistList) {
        
        // console.log('search: ' + this.artist_email + ' current obj email: ' + obj.artist_email)
        if (this.artist_email == artistList[obj].artist_email) {
          //get from firebase the user for this email
          this.$store.dispatch("get_artist_settings_artist", this.artist_email);
          return
        }
      }
      this.alert = true;
    }
  },
  computed: {
    isDisabled() {
      for (let rule in this.emailRules) {
        console.log(rule);
        // if(rule()){

        // }
      }
      return false;
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
      return paid_submissions.length;
    },
    submissions_for_month() {
      return this.$store.getters.submissions_for_month;
    }
  },

  data() {
    return {
      name: "",
      business_email: "",
      count: "",
      search: "",
      artist_email: "",
      alert: false,
      emailRules: [
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "Calories",
          value: "calories"
        },
        {
          text: "Fat (g)",
          value: "fat"
        },
        {
          text: "Carbs (g)",
          value: "carbs"
        },
        {
          text: "Protein (g)",
          value: "protein"
        },
        {
          text: "Iron (%)",
          value: "iron"
        }
      ]
    };
  }
};
</script>
