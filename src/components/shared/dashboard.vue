<template>
<v-container v-if="this.$store.getters.user.id == 'H2kEJMbkyxUhcAfKH1jcMeDOn442' || this.$store.getters.user.id == 'b8Yc6Iz0ktV6ofVC1lHgCJ3EQCn1' || this.$store.getters.user.id == 'QBRXqktYi0QigFboM92crKAONKn1' ">
  
  
  <v-card >
    <v-card-title> Blogs

        <v-spacer></v-spacer>
         
        <!-- Input to search for a blog  -->
        <v-text-field
          v-model="search"
          append-icon="search"
          label="hello"
          single-line
          hide-details
          
        ></v-text-field>
    </v-card-title>

    <!-- Headers -->
    <v-data-table
      :headers="headers"
      :items="businesses"
      :search="search"
      hide-headers
    >

      <!-- Display business data table and make it clickable. -->
      <template slot="items" slot-scope="props">
        <td> {{ props.item.business_name }}</td>
        <div>
        <td class="text-xs-right">  
            <a @click="fetch_report_link(props.item.email)">
              <router-link to ="/dashboard2">{{props.item.email}} </router-link>
            </a>
        </td>
        </div>
        <td class="text-xs-right">{{ props.item.upload_date }}</td>
      </template>

      
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>

    </v-data-table>
  </v-card>
  
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
          <v-btn 
          @click="generate_artists_email_list" 
          dark 
          color="orange">Generate</v-btn>
          
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>


  <v-card-title>
     Artists Email List
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="artists_email_list"
      :search="search"
      hide-headers
    >
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
      methods:{
        generate_artists_email_list(){
          console.log('generating email list')
          this.$store.dispatch('get_email_list_of_artists')
          console.log(this.$store.getters.artists_email_list)
        },
           
      fetch_report_link(link){
        this.$store.commit("set_query_business_email", {business_email: link}) 
      }

      },
      computed: {
        formIsValid () {
            return this.business_email !==''
        },
      businesses() {
        //MODIFY THIS ONE
        return this.$store.getters.businesses
      },
      artists_email_list() {
        //MODIFY THIS ONE
        return this.$store.getters.artists_email_list
      }

      },
      

    data () {
      return {
          name:'',
          business_email:'',
          count: '',
        search: '',
        
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' }
        ]
      }
      
    }
  }
</script>