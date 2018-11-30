<template>
  <v-container
    v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1'"
  >
    <v-date-picker v-model="picker" :landscape="landscape" type="month"></v-date-picker>
    <v-data-table :headers="headers" :items="businesses_with_submissions" :pagination.sync="pagination" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.total }}</td>
          <td class="text-xs-center">{{ props.item.paid }}</td>
          <td class="text-xs-center">{{ props.item.free }}</td>
          <td class="text-xs-center">{{ props.item.responses }}</td>
          <td class="text-xs-center">{{ props.item.awaiting }}</td>
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
      pagination: { sortBy: "column1", descending: true, rowsPerPage: -1 },
      headers: [
        {
          text: "Business",
          align: "left",
          value: "name",
          sortable: true
        },
        {
          text: "Total Submissions",
          value: "total",
          align: "center",
          sortable: true
        },
        {
          text: "Paid Submissions",
          value: "paid",
          align: "center",
          sortable: true
        },
        {
          text: "Free Submissions",
          value: "free",
          align: "center",
          sortable: true
        },
        {
          text: "Responses Given",
          value: "responses",
          align: "center",
          sortable: true
        },
        {
          text: "Awaiting Response",
          value: "awaiting",
          align: "center",
          sortable: true
        }
      ]
    };
  },
  created() {},
  beforeMount() {
    this.$store.dispatch("get_submissions_for_month");
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
        return !submission.submitted_with_free_cerdit;
      });
      return filtered_submissions.length;
    },
    filtered_free(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return submission.submitted_with_free_cerdit;
      });
      return filtered_submissions.length;
    },
    filtered_responses(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      // console.log(filtered_submissions)
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return submission.replied;
      });
      return filtered_submissions.length;
    },
    filtered_awaiting(id) {
      let submissions = this.$store.getters.monthly_report_submissions;
      let filtered_submissions = submissions.filter(function(submission) {
        return submission.businessId.userId == id;
      });
      console.log("filtered_submissions: " + filtered_submissions);
      filtered_submissions = filtered_submissions.filter(function(submission) {
        return !submission.replied;
      });
      return filtered_submissions.length;
    }
  },
  computed: {
    businesses_with_submissions: function() {
      let businesses = this.$store.getters.businesses;
      // console.log(businesses)
      let businesses_with_submissions = [];
      let self = this;
      // console.log(this)
      businesses.forEach(function(business) {
        // console.log(business)
        businesses_with_submissions.push({
          name: business.business_name,
          total: self.filtered_total(business.userId),
          paid: self.filtered_paid(business.userId),
          free: self.filtered_free(business.userId),
          responses: self.filtered_responses(business.userId),
          awaiting: self.filtered_awaiting(business.userId)
        });
      });

      // console.log(businesses_with_submissions)
      return businesses_with_submissions
    },

  },
  watch: {
    picker() {
      this.$store.dispatch("get_monthly_report_submissions", this.picker);
    }
  }
};
</script>
