<template>
  <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  
  </div>
  
  <v-container fluid v-else> 
    <!--This is the layouts for the everything (nothing is put here because the v-flex will hold of the styleing options)-->
    <v-layout>
      <!--This v-flex handles the size (hieght/width/dementions) of the image that it will contain-->
      <!-- refer [https://vuetifyjs.com/en/framework/grid] to for more information on the changes that can be implemented within v-flex-->   
      <v-flex xs2 sm2 md2 offset-sm0 row fill-height> 
        <v-card>
          <v-flex> 
            <v-img> 
              <img v-bind:src="this.business_info.url" height="260px" center>
            </v-img>
          </v-flex> 
        <!--end of the v-card for image-->
        </v-card>
      <!--end of the v-flex for image and small icons-->

      <v-flex xs12 sm12 md12 offset-sm1 row fill-height>
        <v-card-actions>
          <div align="center">
            <v-btn><img class='icon' src="/static/images/facebook-logo.png" height="35px"></v-btn>
            <v-btn><img class='icon' src="/static/images/instagram-logo.png" height="35px"></v-btn> 
            <v-btn><img class='icon' src="/static/images/tumblr-logo-2.png" height="35px"></v-btn>
          </div>    
        </v-card-actions>
      </v-flex>

      <v-flex xs12 sm12 md12 offset-sm0 row fill-height>
        <v-card>
          <div class="text-xs-center" align="center">
            <v-btn large depressed color="primary" @click="all_submissions()">All Submissions</v-btn>
          </div>
          <div class="text-xs-center" align="center">
            <v-chip color="primary" text-color="white">
            Unreplied Submissions : 
            </v-chip>
          </div>
        </v-card>
      </v-flex>


        <v-flex xs12 sm12 md12 offset-sm0 row fill-height>
          <v-card>
            <div class="headline mb-1" align="center">
              <h2>
                <br>
                Business Info 
              </h2>
            </div>
            <div>
              <p class="text-sm-left"> 
                <br>
                <b>Name:</b> {{this.business_info.business_name}}<br>
                <b>About:</b> {{this.business_info.about}}<br> 
                <b>Email:</b> {{this.business_info.email}} <br> 
                <b>Publication:</b> {{this.business_info.publication}}<br> 
                <b>Worth Knowing:</b> {{this.business_info.worth_knowing}}<br> 
                <b>Additional Notes:</b> {{this.business_info.additional_notes}}<br> 
              </p>
            </div>
          </v-card>
        </v-flex>



          <v-card >
    
            <v-flex xs12 sm12 md12 offset-sm0 row fill-height> 
              <v-card-title primary-title>
                <div>
                  <div class="headline mb-1" align="center">
                    <h2>
                      Members
                    </h2>
                  </div>

                  <div class="text-sm-left"  v-for="member in this.business_members" :key="member.email">

                    <v-btn><v-icon large color="blue darken-2">chat</v-icon></v-btn> <b>Name:</b> {{member.name}} <br>
                    <v-btn><v-icon large color="teal darken-2">email</v-icon></v-btn> <b>Email:</b> {{member.email}}  

                  </div>

                </div>
              </v-card-title>
            </v-flex>
          </v-card>



      </v-flex>     




      <v-flex xs8 sm8 md8 offset-sm0 row fill-height>
      <!--This v-card houses the text based stuff below it.-->
        <v-card >

          <GChart type="ColumnChart" :data="chartData" :options="chartOptions" style="width: 1500px; height: 700px;"/>
        </v-card>
         <v-card >
          <GChart type="BubbleChart" :data="chartData" :options="chartOptions" style="width: 1500px; height: 700px;"/>
         </v-card>
         <v-card >
            <div id='app'>
          
            <p style="padding-left: 180px;">
              <GChart
                :settings="{packages: ['bar']}"    
                :data="chartData"
                :options="chartOptions"
                :createChart="(el, google) => new google.charts.Bar(el)"
                @ready="onChartReady"
                style="width: 1500px; height: 700px;"
              />
            </p>
            </div> 

        </v-card>
      




      </v-flex>  

    </v-layout>
  </v-container>
</template>


<script>
  export default {
    data() {
      return {
        chartsLib: null, 
        sideNav: false,
        number_of_submissions: this.$store.state.submissions_for_this_business.length,
        show_facebook:false,
        show_instagram:false,
        show_tumblr:false,
chartData: [
        ['Months', 'Total Submitions', 'Approved Submitions', 'Profit'],
        ['January', 1000, 410, 220],
        ['February', 1170, 460, 240],
        ['March', 660, 515, 300],
        ['April', 1030, 540, 350],
        ['May', 763, 532, 323],
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Months, Total Submitions, Approved Submitions, and Profit: 2019',
        }
      }


      }
    },
    beforeCreate: async function () {
      this.number_of_submissions = this.$store.state.submissions_for_this_business.length
    },
    mounted: function()
    {
      //console.log('Signed in user: ', this.$store.getters.signed_in_user)
      //console.log('User role: ', this.$store.getters.user_role)
      console.log('real role: ', this.$store.state.user_role)
      // if need later, test version 2 id: 'BY8KZZD5eMMvaNAOaGuDVqhCTuw1'
      // shareyourselfartists id: b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1
      this.$store.dispatch('get_admin_info')
    },  
    computed: {
          chartOptions () {
      if (!this.chartsLib) return null
      return this.chartsLib.charts.Bar.convertOptions({
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017'
        },
        bars: 'horizontal', // Required for Material Bar Charts.
        hAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02', '#7570b3']
      })
    },
      business_info(){
        this.$store.getters.get_business_info;
        console.log("business info is " , this.$store.getters.get_business_info);
        return  this.$store.getters.get_business_info;
      },
      business_members(){
        this.$store.getters.get_business_members;
        console.log("business members is " , this.$store.getters.get_business_members)
        return this.$store.getters.get_business_members[0]
      },
      user_info() {
        let myArray=this.$store.getters.signed_in_user
        if(myArray.facebook_url != "")
          this.show_facebook=true
        if(myArray.instagram_url != "")
          this.show_instagram=true
        if(myArray.tumblr_url != "")
          this.show_tumblr=true
        
        return myArray 
      },
      loading() {
        return this.$store.getters.loading;
      }
    },
    methods:{
          onChartReady (chart, google) {
      this.chartsLib = google
    },
      all_submissions(){
        console.log("We are in all submissions")
        localStorage.setItem('role' , 'business');
        this.$router.push('/submissions')
      }
    }
  }

</script>
<style scoped>
  .container {
    height: 100vh;
  }
</style>

    <!-- <v-layout row mt-5 justify-space-between>
      <img :src="`${'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/BY8KZZD5eMMvaNAOaGuDVqhCTuw1%2Flogo%2FyekGAvzU5fZKh49e6w0tJuRmFFg1_profile_white_sand_beach-56d50c955f9b5879cc92cc5c.jpg?alt=media&token=58e27b97-e6eb-4318-87ef-7ef2a8ad1c21'}`" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>
    <v-layout>
      <div class="text-xs-center">
        <v-btn large depressed color="primary" router to="/submissions">All Submissions</v-btn>
      </div>
    </v-layout>
    <v-layout row wrap mt-5>
      <p class="title">{{ 'test' }}</p>
    </v-layout>
    <v-layout row>
      <p class="caption">Email: {{ 'test@gmail.com' }}</p>
    </v-layout> -->

    <!-- <v-layout row mt-5 justify-space-between>
      <img :src="`${user_info.url}`" height="200px" alt="">
      <v-spacer></v-spacer>
    </v-layout>
    <v-layout>
      <div class="text-xs-center">
        <v-btn large depressed color="primary" router to="/submissions">All Submissions</v-btn>
      </div>
    </v-layout>

    <v-layout row wrap mt-5>
      <p class="title">{{ user_info.business_name }}</p>
    </v-layout>
    <v-layout row>
      <p class="caption">Email: {{ user_info.email }}</p>
    </v-layout>
    <v-layout row mb-1 >
      <v-flex>
      <a v-if="show_facebook" :href="user_info.facebook_url" target="_blank">
          <img class='icon' src="/static/images/facebook-logo.png">
      </a>
      <a v-if="show_instagram" :href="user_info.instagram_url" target="_blank">
          <img class='icon' src="/static/images/instagram-logo.png">
      </a>
      <a v-if="show_tumblr" :href="user_info.tumblr_url" target="_blank">
          <img class='icon' src="/static/images/tumblr-logo-2.png">
      </a>
      </v-flex>
    </v-layout>


    <v-layout class="" row wrap mt-5>
      <p class="body-1"><b>Publication: </b> {{ user_info.publication }}</p>
    </v-layout>
    <v-layout class="" row wrap>
      <p class="body-1"><b>About: </b> {{ user_info.about }}</p>
    </v-layout>
    <v-layout class="" row wrap>
      <p class="body-1"><b>Worth Knowing: </b> {{ user_info.worth_knowing }}</p>
    </v-layout>
    <v-layout class="divbottomline" row wrap>
      <p class="body-1"><b>Additional Notes: </b> {{ user_info.additional_notes }}</p>
    </v-layout>
    <v-layout class="" row wrap mb-2>
      <p class="body-2 subheadingfont">Statistics: N/A</p>
    </v-layout>
 -->