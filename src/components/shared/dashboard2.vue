<template>
<v-container  v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2'">

<v-layout row>
    <v-flex class="ml-3" xs12 sm6>
      <v-card>
        <v-card-title primary-title>
          <v-flex class = "sm-6">
            <h3 class="headline mb-0">{{businesses.length}}</h3>
            <div>Businesses</div>
          </v-flex>
          <v-flex  class = "sm-6">
            <h3 class="headline mb-0">{{artists_email_list.length}}</h3>
            <div>Artists</div>
          </v-flex>
        </v-card-title>
      </v-card>
    </v-flex>


    <v-flex class="ml-3" xs12 sm6>
      <v-card>
        <v-card-title primary-title>
          <v-flex class = "sm-6">
            <h3 class="headline mb-0">{{submissions_for_month.length}}</h3>
            <div>Submissions</div>
          </v-flex>
          <v-flex  class = "sm-6">
            <h3 class="headline mb-0">{{replied_for_month}}</h3>
            <div>Replied</div>
          </v-flex>
        </v-card-title>
      </v-card>
    </v-flex>



    <v-flex class="ml-3" xs12 sm6>
      <v-card>
        <v-card-title primary-title>
          <v-flex class = "sm-6">
            <h3 class="headline mb-0">{{free_submissions_for_month}}</h3>
            <div>Free</div>
          </v-flex>
          <v-flex  class = "sm-6">
            <h3 class="headline mb-0">{{paid_submissions_for_month}}</h3>
            <div>Paid</div>
          </v-flex>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
  
     <v-toolbar>
   
    <v-toolbar-title>2018</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items >
      <v-btn flat @click="august">August</v-btn>
      <v-btn flat  @click="september">September</v-btn>
      <v-btn flat  @click="october">October</v-btn>
      <v-btn flat  @click="november">November</v-btn>
      <v-btn flat  @click="december">December</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-data-table
  v-if="this.month == 'august'"
      :items="august_list"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
       
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>

     <v-data-table
  v-if="this.month == 'september'"
      :items="september_list"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
       
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>

    <v-data-table
  v-if="this.month == 'october'"
      :items="october_list"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
       
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>

    <v-data-table
  v-if="this.month == 'november'"
      :items="november_list"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
       
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>

    <v-data-table
  v-if="this.month == 'december'"
      :items="december_list"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
       
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
    

    
  </v-container>
  <h1 v-else>You are not authorized to view this page</h1>
  
 

</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch("get_submissions_for_month");
    this.$store.dispatch("get_email_list_of_artists");
  },
  methods: {
    august() {
      this.month = "august";
    },
    september() {
      this.month = "september";
    },
    october() {
      this.month = "october";
    },
    november() {
      this.month = "november";
    },
    december() {
      this.month = "december";
    }
  },
  computed: {
    august_list() {
      //MODIFY THIS ONE
      return this.$store.getters.august;
    },
    september_list() {
      let sepember_all_submissions = this.$store.getters.september;
      let september_paid_submissions = sepember_all_submissions.filter(function(
        submission
      ) {
        return submission.submitted_with_free_cerdit != true;
      });
      return september_paid_submissions;
    },
    october_list() {
      //MODIFY THIS ONE
      return this.$store.getters.september;
    },
    november_list() {
      //MODIFY THIS ONE
      return this.$store.getters.september;
    },
    december_list() {
      //MODIFY THIS ONE
      return this.$store.getters.september;
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
    }
  },

  data() {
    return {
      month: "august",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ]
    };
  }
};
</script>