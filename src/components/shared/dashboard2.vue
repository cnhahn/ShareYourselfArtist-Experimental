<template>
<v-container  v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1'">


  
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
      return this.$store.getters.october;
    },
    november_list() {
      //MODIFY THIS ONE
      return this.$store.getters.september;
    },
    december_list() {
      //MODIFY THIS ONE
      return this.$store.getters.september;
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