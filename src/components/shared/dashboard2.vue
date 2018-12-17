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

     <h2>{{info_of_business_for_dashboard2.business_name}} </h2>
 
    <!-- By yiwayana -->

    <v-form>
      <v-text-field
        v-model = "business_about"
        label="About"
      ></v-text-field>
      <v-text-field
        v-model = "business_facebook_url"
        label="Facebook Url"
      ></v-text-field>
      <v-text-field
        v-model = "business_instagram_url"
        label="Instagram Url"
      ></v-text-field>
      <v-text-field
        v-model = "business_tumblr_url"
        label="Tumblr Url"
      ></v-text-field>
      <v-text-field
        v-model = "business_publication"
        label="Publication"
      ></v-text-field>
      <v-text-field
        v-model = "business_the_good"
        label="The Good"
      ></v-text-field>
      <v-text-field
        v-model = "business_upload_date"
        label="Upload Date"
      ></v-text-field>  
      <v-text-field
        v-model = "business_additional_notes"
        label="Additional Notes"
      ></v-text-field>
 
    </v-form>

    <button v-on:click="submit_edited_business_info" style="color:orange" > Submit </button>

  </v-container>
  <!-- If the current user is not an admin, then they will not be able to see the current dashboard. -->
  <h1 v-else>You are not authorized to view this page</h1>
</template>

<script>
export default {
  created(){
      this.$store.commit("clear_query_datePicker_list");
      this.$store.commit("clear_info_of_business_for_dashboard2");
      let business_email = localStorage.getItem('business_email');
      this.$store.commit("set_query_business_email", {business_email: business_email}) 
      this.$store.dispatch("query_info_of_business_for_dashboard2", business_email)
  },
  methods: {
    selectDates() {
      let queryDates = { startDate: this.picker, endDate: this.picker2 };
      this.$store.commit("set_datePicker", queryDates);
      this.$store.dispatch("report_datePicker");
      this.month = "datePicker";
    },
    submit_edited_business_info(){
      let updated_business_info = {
        about :  this.business_about,
        additional_notes :  this.business_additional_notes ,
        business_name : this.business_name,
        email : this.business_email,
        facebook_url : this.business_facebook_url,
        instagram_url : this.business_instagram_url,
        publication : this.business_publication,
        the_good : this.business_the_good,
        tumblr_url : this.business_tumblr_url,
        upload_date : this.business_upload_date
      };
      this.$store.dispatch('push_updated_business_info_to_firebase', updated_business_info)
    }
  },

  computed: {
    datePicker_list() {
      return this.$store.getters.datePicker;
    },
    info_of_business_for_dashboard2(){
      let business_info = this.$store.getters.info_of_business_for_dashboard2
      this.business_about = business_info.about;
      this.business_additional_notes = business_info.additional_notes;
      this.business_name = business_info.business_name;
      this.business_email = business_info.email;
      this.business_facebook_url =  business_info.facebook_url;
      this.business_instagram_url = business_info.instagram_url;
      this.business_publication = business_info.publication;
      this.business_the_good = business_info.the_good;
      this.business_tumblr_url = business_info.tumblr_url;
      this.business_upload_date = business_info.upload_date;
      return this.$store.getters.info_of_business_for_dashboard2;
    },
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
      business_about: ' ',
      business_additional_notes: ' ',
      business_name: ' ',
      business_email: ' ',
      business_facebook_url: ' ',
      business_instagram_url: ' ',
      business_publication: ' ',
      business_the_good: ' ',
      business_tumblr_url: ' ',
      business_upload_date: ' ',
      landscape: false,
      reactive: false
    };
  }
};
</script>