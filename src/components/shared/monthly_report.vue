<template>
  <v-container
    v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1'"
  >
    <v-date-picker v-model="picker" :landscape="landscape" type="month"></v-date-picker>
    <v-data-table :headers="headers" :items="businesses" class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.business_name }}</td>
          <td>{{ filtered_total(props.item.userId) }}</td>
          <td>{{ filtered_paid(props.item.userId) }}</td>
          <td>{{ filtered_free(props.item.userId) }}</td>
          <td>{{ filtered_responses(props.item.userId) }}</td>
          <td>{{ filtered_awaiting(props.item.userId) }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    // for the table
    return {
      picker: new Date().toISOString().substr(0, 7),
      landscape: false,
      headers: [
        {
          text: "Business",
          align: "left",
          sortable: false,
          value: "title"
        },
        {
          text: "Total Submissions",
          value: "total"
        },
        {
          text: "Paid Submissions",
          value: "paid"
        },
        {
          text: "Free Submissions",
          value: "free"
        },
        {
          text: "Responses Given",
          value: "responses"
        },
        {
          text: "Awaiting Response",
          value: "await"
        }
      ]
    };
  },
  beforeCreate() {
    this.$store.dispatch("get_submissions_for_month");
  },
  beforeMount() {
    // console.log("picker: " + this.picker);
    this.$store.dispatch("get_monthly_report_submissions", this.picker);
  },
  methods: {
    filtered_total(id) {
      // console.log("id: ")
      // console.log(id)
      let submissions = this.$store.getters.monthly_report_submissions;
      // console.log("sub: ")
      // console.log(submissions[0])
      let filtered_submissions = submissions.filter(function(submission) {
        // console.log(submission.businessId)
        // console.log(submission.userId)
        return submission.businessId.userId == id;
      });
      // console.log("length: " + filtered_submissions.length)
      return filtered_submissions.length;
    },
    filtered_paid(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return !submission.submitted_with_free_cerdit
      });
      return filtered_submissions.length
    },
    filtered_free(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return submission.submitted_with_free_cerdit
      });
      return filtered_submissions.length
    },
    filtered_responses(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      // console.log(filtered_submissions)
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return submission.replied
      });
      return filtered_submissions.length
    },
    filtered_awaiting(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      // console.log(filtered_submissions)
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return !submission.replied
      });
      return filtered_submissions.length
    }
  },
  updated: {

  },
  computed: {
    businesses() {
      //MODIFY THIS ONE
      // console.log("business: ")
      // console.log(this.$store.getters.businesses);
      return this.$store.getters.businesses;
    }
  },
  watch: {
    picker() {
      // console.log("picker called");
      this.$store.dispatch("get_monthly_report_submissions", this.picker);
    }
  }
};
</script>
