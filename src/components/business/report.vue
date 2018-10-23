<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm4>
        <h1 class="primary--text"><strong>Click the button for report</strong></h1>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs10 >

        <div>
          <v-btn color="primary" @click="report" :loading="false">1 month</v-btn>
          <v-btn color="primary" @click="month3" :loading="false">3 month</v-btn>
          <v-btn color="primary" @click="month6" :loading="false">6 month</v-btn>
        </div>
              <!-- <div class="loading_holder" v-if="loading">
                <div class="spinner_holder">
                  <c-spinner></c-spinner>
                </div>
              </div> -->
 <v-data-table
    :headers="headers"
    :items="get_reports"
    hide-actions
    class="elevation-1"
  >
   <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.art.artist_name }}</td>
      <td class="text-xs-left">{{ props.item.art.art_title }}</td>
      <td class="text-xs-left">{{ timestamp(props.item) }}</td>
      <td class="text-xs-left">1</td>
    </template>
     <!-- <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        Sorry
      </v-alert>
    </template> -->
 </v-data-table>

      </v-flex>
    </v-layout>
  </v-container>
</template>





<script>
  export default {
    data () {
      // for the table
      return {
        onLoading: true,
        headers: [
          {
            text: 'Artist name',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          { text: 'Art title', value: 'title'},
          { text: 'Date', value: 'date' },
          { text: 'Credits', value: 'credits' },
        ]        
      }
    },
    components: {
    },
    computed: {
      loading() {
        //MODIFY THIS ONE
        return this.onLoading
      },
      get_reports() {
        return this.$store.getters.replied_for_report
      },
    },
    methods: {
      report() {
        this.$store.commit('clear_replied_for_report')
        this.$store.dispatch('get_replied')
      },
      timestamp(items) {
        console.log("milli:", items.submitted_on)
        var milli = items.submitted_on
        var d = new Date(milli)
        console.log("d:", d)
        return d.toLocaleString()
      },
      month3() {
        this.$store.commit('set_report_month',3)
        this.report()
      },
      month6() {
        this.$store.commit('set_report_month',6)
        this.report()
      }
    },
    created: function() {
    }
  }
</script>
<style>
.loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
</style>
