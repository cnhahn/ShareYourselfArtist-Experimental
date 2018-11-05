<template>
  <v-container
    v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' 
    || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' || this.$store.getters.user.id == 'QBRXqktYi0QigFboM92crKAONKn1' 
    || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1'"
  >
    <v-toolbar>
      <v-toolbar-title>2018</v-toolbar-title>
    </v-toolbar>
    <!-- Data table to display artist submission information for a specific blog -->

    <v-data-table :items="datePicker_list" hide-headers>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.artist_email }}</td>
        <td class="text-xs-right">{{ props.item.art.art_title }}</td>
        <td class="text-xs-right">{{ props.item.read_byartist }}</td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
    <!-- Create Two Date Pickers : Start and End Date  -->
    <v-date-picker v-model="picker" :landscape="landscape" :reactive="reactive">Start Date</v-date-picker>
    <v-date-picker v-model="picker2" :landscape="landscape" :reactive="reactive">End Date</v-date-picker>
    <br>
    <!-- Create Button that will select the current dates in Date Picker and call the method to populate the data table -->
    <div>
      <button variant="primary" v-on:click="selectDates">Select These Date Ranges</button>
    </div>
  </v-container>
  <!-- If the current user is not an admin, then they will not be able to see the current dashboard. -->
  <h1 v-else>You are not authorized to view this page</h1>
</template>

<script>
export default {
  methods: {
    selectDates() {
      let queryDates = { startDate: this.picker, endDate: this.picker2 };
      this.$store.commit("set_datePicker", queryDates);
      this.$store.dispatch("report_datePicker");
      this.month = "datePicker";
    },
    showList() {}
  },

  computed: {
    datePicker_list() {
      return this.$store.getters.datePicker;
    }
  },

  data() {
    return {
      month: "august",
      search: "",
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
      ],
      picker: new Date().toISOString().substring(0, 10),
      picker2: new Date().toISOString().substring(0, 10),
      landscape: false,
      reactive: false
    };
  }
};
</script>