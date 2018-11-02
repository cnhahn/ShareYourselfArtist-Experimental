<template>
  <v-container v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'OkvqiVsL6cc4hdaOL97QWU7gCEM2' || this.$store.getters.user.id == 'L8ZKmImHhpbKQEbNVVTzzwj4pls1'">
    <v-date-picker v-model="picker" :landscape="landscape" type="month"></v-date-picker>
    <v-data-table :headers="headers" :items="businesses" class="elevation-1">
      <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.business_name }}</td>
            <!-- <td>{{ filtered_total(props.item.business_name) }}</td>
            <td>{{ filtered_paid(props.item.business_name) }}</td>
            <td>{{ filtered_free(props.item.business_name) }}</td>
            <td>{{ filtered_responses(props.item.business_name) }}</td>
            <td>{{ filtered_awaiting(props.item.business_name) }}</td> -->
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
        headers: [{
            text: 'Business',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: 'Total Submissions',
            value: 'total'
          },
          {
            text: 'Paid Submissions',
            value: 'paid'
          },
          {
            text: 'Free Submissions',
            value: 'free'
          },
          {
            text: 'Responses Given',
            value: 'responses'
          },
          {
            text: 'Awaiting Response',
            value: 'await'
          },
        ]
      }
    },
    computed: {
      businesses() {
        //MODIFY THIS ONE
        console.log(this.$store.getters.businesses)
        return this.$store.getters.businesses
      },
      filtered_total(email) {

      },
      filtered_paid(email) {

      },
      filtered_free(email) {

      },
      filtered_responses(email) {

      },
      filtered_awaiting(email) {

      }
    },
    methods: {
        choose_date(){
            console.log(this.picker);
            this.$store.dispatch('set_chosen_month', this.picker)
        }
    
    }
  }

</script>
