<template>
  <v-container v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2'">
    <v-card>
      <v-card-title>
        Blogs
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="businesses" :search="search" hide-headers>
        <template slot="items" slot-scope="props">
          <tr @click="goto_dashboard2(props.item.email)">
            <td>{{ props.item.business_name }}</td>
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.upload_date }}</td>
          </tr>


        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <v-layout row>
      <v-card-actions>
        <v-btn @click="goto_monthly_report()" dark color="orange">Monthly Report</v-btn>
      </v-card-actions>
    </v-layout>

    <v-text-field v-model="business_email" :counter="10" label="email" required></v-text-field>
    <v-btn color="primary" @click="fetch_report" :disabled="!formIsValid" router to="/dashboard2">Submit</v-btn>

    <v-layout row>
      <v-flex>
        <v-card>

          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">Generate Artists Email List</span>
              </v-flex>
            </v-layout>
          </v-container>
          </v-img>
          <v-card-title>
            <div>
              <span class="grey--text"></span><br>
              <span>This function generates an email list of artists.</span><br>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn @click="generate_artists_email_list" dark color="orange">Generate</v-btn>

          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card-title>
      Artists Email List
      <v-spacer></v-spacer>

    </v-card-title>
    <v-data-table :headers="headers" :items="artists_email_list" :search="search" hide-headers>
      <template slot="items" slot-scope="props">

        <td class="text-xs-right">{{ props.item.artist_name }}</td>
        <td class="text-xs-right">{{ props.item.artist_email }}</td>

      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
    </v-card>

  </v-container>
  <h1 v-else>You are not authorized to view this page</h1>



</template>

<script>
export default {
  methods: {
    generate_artists_email_list() {
      console.log("generating email list");
      this.$store.dispatch("get_email_list_of_artists");
      console.log(this.$store.getters.artists_email_list);
    },
    goto_dashboard2(business_email) {
      console.log("email" + business_email);
      this.business_email = business_email;
      this.fetch_report();
      this.$store.dispatch("goto_dash2");
    },
    goto_monthly_report() {
      this.$store.dispatch("goto_monthly_report");
    },

    fetch_report() {
      this.$store.dispatch("report_aug", {
        business_email: this.business_email
      });
      this.$store.dispatch("report_sep", {
        business_email: this.business_email
      });
      this.$store.dispatch("report_oct", {
        business_email: this.business_email
      });
      this.$store.dispatch("report_nov", {
        business_email: this.business_email
      });
      this.$store.dispatch("report_dec", {
        business_email: this.business_email
      });
    }
  },
  computed: {
    formIsValid() {
      return this.business_email !== "";
    },
    businesses() {
      //MODIFY THIS ONE
      return this.$store.getters.businesses;
    },
    artists_email_list() {
      //MODIFY THIS ONE
      return this.$store.getters.artists_email_list;
    }
  },

  data() {
    return {
      name: "",
      business_email: "",
      count: "",
      search: "",

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
