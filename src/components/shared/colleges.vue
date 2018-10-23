 <template>

  
    <v-content>
      <section>
        <v-parallax src="/static/images/colleges.jpg" height="800">
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
          <v-layout row>
           
          </v-layout>
          <v-layout row>
             
            <v-flex lg6 sm4 mt5 ml5 align-center>
            <div class="white--text display-4 font-weight-black font-italic text-xs-center mt-5">Give Your Students the Edge in the Modern Art Climate.</div>
          </v-flex>
          <v-flex>
            <v-stepper class="mb-5 transparent2" v-model="e1">
    <v-stepper-header>
      <v-stepper-step dark :complete="e1 > 1" step="1"></v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step dark :complete="e1 > 2" step="2"></v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step dark step="3"></v-stepper-step>
    </v-stepper-header>

    <v-stepper-items >
      <v-stepper-content step="1" >
       
         <form class=" white--text">
    <v-text-field
     dark
      v-model="name"
      :error-messages="nameErrors"
      :counter="20"
      label="Name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
    dark
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-text-field
    dark
          v-model="phone"
          label="phone"
          value="XXX-XXX-XXXX"
          prepend-icon="phone"
          single-line
        ></v-text-field>
  </form>
      
        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
          <form class="form white--text">
    <v-text-field
      dark
      v-model="collegeAssociation"
      :error-messages="nameErrors"
      :counter="20"
      label="College Association: "
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
    dark
      v-model="numberOfStudents"
      :error-messages="emailErrors"
      label="How Many Art Students Are In Your Program:"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
   
  </form>

        <v-btn
          color="primary"
          @click="submit"
        >Submit
        </v-btn>

        <v-btn 
        @click="e1 = 1"
        flat>BAck</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-flex lg12>
            Thank You! We will be reaching out to you shortly. 
        </v-flex>
      
        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Submit Again
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
          </v-flex>
          </v-layout>
          
           
          </v-layout>
        </v-parallax>
      </section>

      <section>

       
        <v-layout
          row
          wrap
          class="my-5"
          
        >
        <v-flex lg6 sm4 mt5  align-right>
          <img class="ml-5 text-xs-right" src="/static/images/img1.png">
        </v-flex>
        <v-flex lg6 sm4 mt5>
          <div class = "panels">
            <div class="display-3 font-weight-black font-italic text-xs-left mt-5 mr-5
            ">Most Colleges’ Art Departments Do Not Stress Marketing Your Art.
              </div>
              <div class="display-2 font-weight-black font-italic text-xs-left mt-3"> We’ll Take Care of That For You. </div>
              <div class="title2 text-xs-left mt-3 mr-5"> Many art programs at colleges and universities turn aspiring artists into talented and skilled painters, drawers, photographers, etc… But a lot of those schools brush only briefly over the elements of marketing that go into being an artist. </div>
               <v-btn 
              @click="info"
              icon slot="activator" class="ml-3 mt-3">
              <v-icon 
              x-large 
              class="ml-5 orange--text text--lighten-1">fas fa-angle-double-right</v-icon>
              Learn more</v-btn>
              </div>
              
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout
        row
          wrap
          class="my-5">
           
         <v-flex lg12 sm12 mt5 ml5 align-center>
           
            <div class="display-3 font-weight-black font-italic text-xs-center mt-5">Here’s How it Works:               
              </div>
          </v-flex>
        </v-layout>
        <v-layout row>
           <v-flex lg5 sm12 mt5 ml5 align-center>
            <v-container> 
            <div class="title2 text-xs-center ml-5 mr-5 mt-5"><h3>1. Create a profile for your students, <br>Art Department or Class</h3>         
              </div>
            <div class="title2 font-italic text-xs-left mt-3 ml-5">  <span class ="font-weight-thin">Use a master e-mail so you can overlook all of the accounts in your organization. Set up Your Organization account settings to determine how you will be notified and how frequently you will be notified of student activity. Many schools have used the site as a way for students to submit their projects!
 </span></div>
          </v-container>
          </v-flex>
          <v-flex lg5 sm12 mt5 ml5 align-center>
            <img class=" mt-5 ml-5 mb-5 elevation-2" src="/static/images/home.png" width="100%" >              
              
          </v-flex>

        </v-layout>
        <v-divider></v-divider>
          <v-layout row>
           <v-flex lg5 sm12 mt5 ml5 align-center>
            <v-container>
            <div class="headline font-weight-black font-italic text-xs-center ml-5 mr-5 mt-5"><h3>2. Have your students create accounts and request to join your organization!</h3>
           
              </div>
            <div class="title2 font-italic text-xs-left mt-3 ml-5"> Use a master e-mail so you can overlook all of the accounts in your organization. Set up Your Organization account settings to determine how you will be notified and how frequently you will be notified of student activity. Many schools have used the site as a way for students to submit their projects!
 </div>
          </v-container>
          </v-flex>
          <v-flex lg5 sm12 mt5 ml5 align-center>
            <img class=" mt-5 ml-5 mb-5 elevation-2" src="/static/images/blogs.png" width="100%" >              
              
          </v-flex>
          </v-layout>
           <v-divider></v-divider>
          <v-layout row mb-5>
           <v-flex lg5 sm12 mt5 ml5 align-center>
            <v-container>
            <div class="title2 font-italic text-xs-center ml-5 mr-5 mt-5"><h3>3. All Students who join your organization will be granted 5-20 credits</h3>
           
              </div>
            <div class="title2 text-xs-left mt-3 ml-5"> per quarter depending on your Organization Package. Students Use their Credits to Submit their art to some of the biggest online art-sharing pages, magazines and publications on the internet! 

 </div>
          </v-container>
          </v-flex>
          <v-flex lg5 sm12 mt5 ml5 align-center>
            <img class=" mt-5 ml-5 elevation-2" src="/static/images/popular.png" width="100%" >              
              
          </v-flex>
          </v-layout>
          
      <section>
        <v-divider></v-divider>

          <v-layout
        row
          wrap
          class="my-5">
           
         <v-flex lg12 sm12 mt5 ml5 align-center>
            <div class="display-3 font-weight-black font-italic text-xs-center mt-5">Meet The Founders             
              </div>
          </v-flex>
          </v-layout>
        <!-- Nick's Profile    -->
        <v-layout  row align-center>
          <v-flex lg5 sm12 mt5 ml5 text-xs-right>
            <img class="ml-5 elevation-0" src="/static/images/nick.jpg" width="60%" >              
              
          </v-flex>
          <v-flex  lg9  >
            <div  class=" title2 ml-5 mr-5 mt-5"><h2>Nick McElmurry</h2><br/> <span class ="font-weight-thin"><em>Founder and Owner</em><br/>
        </span>-Marketing Executive with State Farm, Jamba Juice, Sunpower, and numerous small companies<br>
-Certified Copy Writer, 2018 <br>
-Certified Insurance Agent, Property & Casualty, 2018<br>
-Certified Real Estate Agent, 2014 <br>
-2 BA from UCSC, Business Management Economics & Philosophy <br>
-Musician and Band Manager for Water Color Weekend, Leisure Suit, and other local bands.<br>
-Published Philosopher in the American Journal of Philosophy<br>
-CUPSI National Slam Poetry Semi-Finalist<br>
</div>
          </v-flex>
        </v-layout>
          
 
<!-- Scott's Profile    -->
 <v-layout row align-center>
          <v-flex lg5 sm12 mt5 ml5 text-xs-right>
            <img class="ml-5 mt-5 elevation-0" src="/static/images/bw.jpg" width="60%" >              
              
          </v-flex>
          <v-flex  lg9 >
            <div  class=" title2 ml-5 mr-5"><h2>Scott Davis</h2><br/> <span class ="font-weight-thin"><em>CTO and Lead Website Designer</em><br/>
        </span>Scott handles much of our development work and other stuff. As our Chief Creative/Developer, he's responsible for the overall work product of the company, overseeing our Design & Development. In the rare event that he's not working, he spends as much time as possible with his wife and his daughter. While he does occasionally get some sleep, it's usually when he passes out in his chair while working through the middle of the night.
</div>
          </v-flex>
        </v-layout>
     </section>
          
        
      </section>
 <v-divider></v-divider>
     

   <!-- Dialog starts here -->

      
    <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">

      <v-card class= "dialogCard">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
         
        </v-toolbar>
        <div class="white--text display-3 font-weight-black font-italic text-xs-center mt-5"><b>Most Colleges’ Art Departments Do Not Stress Marketing Your Art. <br>We’ll Take Care of That For You.</b> </div>
        <div class="white--text display-2 font-weight-black font-italic text-xs-center mt-5">Many art programs at colleges and universities turn aspiring artists into talented and skilled painters, drawers, photographers, etc… </div>
        <div class="white--text display-2 font-weight-black font-italic text-xs-center mt-5">But a lot of those schools brush only briefly over the elements of marketing that go into being an artist. Our innovative platform gives professors an easy way to review and grade their student’s work while also giving the student the tools to show their art to the world! Being a successful artist deals entirely with reach, prestige and technique.  </div>
        <div class="white--text display-2 font-weight-black font-italic text-xs-center mt-5">Though ShareYourselfArtists.com cannot teach the technique behind being an incredible artist, it is the BEST tool for an artist to build reach and credibility. We connect artists to a network of the largest art sharing blogs, social media pages, and magazines on the web. This new and quickly growing website allows your students to submit to publications with MILLIONS OF FOLLOWERS… all in just the click of a button.  </div>

      </v-card>
    </v-dialog>
  </v-layout>
 

  <!-- Dialog ends here -->

  

   <v-layout class = "mb-5" row align-center>
     
          <v-flex lg5 sm12 mt5 ml5 text-xs-right>
            <img class="ml-5 mt-5 elevation-0" src="/static/images/testimonial.jpg" width="60%" >              
              
          </v-flex>
          <v-flex  lg9  >
            <div  class=" title2 ml-5 mr-5"><h2>An Experience Created Directly For You </h2><br/> <span class ="font-weight-thin">
        We have tested <b>ShareYourselfArtists.com</b> with 3 different colleges in the Bay Area and have had incredible results. But, the best part about our site is that we will Build Your Organization’s account to your exact liking. It is our guarantee. 

 We have a team of dedicated coders and website designers who will Ensure you get everything you could ask for and more through our site.</span>
</div>
          </v-flex>
        </v-layout>


  
  

<v-container>


        <v-flex m5>
            <v-stepper class="mb-5 ml-5 mr-5 " v-model="e1">
    <v-stepper-header>
      <v-stepper-step dark :complete="e1 > 1" step="1"></v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step dark :complete="e1 > 2" step="2"></v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step dark step="3"></v-stepper-step>
    </v-stepper-header>

    <v-stepper-items >
      <v-stepper-content step="1" >
       
         <form class="form white--text">
    <v-text-field
    
      v-model="name"
      :error-messages="nameErrors"
      :counter="20"
      label="Name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      color = "#fff"
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      
    ></v-text-field>
    <v-text-field
          v-model="phone"
          label="phone"
          value="XXX-XXX-XXXX"
          prepend-icon="phone"
          single-line
        ></v-text-field>
  </form>
        

        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Next
        </v-btn>

        
      </v-stepper-content>

      <v-stepper-content step="2">
          <form class="form white--text">
    <v-text-field
  
      v-model="collegeAssociation"
      :error-messages="nameErrors"
      :counter="20"
      label="College Association: "
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field

      v-model="numberOfStudents"
      :error-messages="emailErrors"
      label="How Many Art Students Are In Your Program:"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
   
  </form>

        <v-btn
          color="primary"
          @click="submit"
        >
          Submit
        </v-btn>

        <v-btn 
        @click="e1 = 1"
        flat>Previous</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3" >
        <v-flex lg12>
             Thank You! We will be reaching out to you shortly. 
        </v-flex>
      

        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Start Again
        </v-btn>

      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
          </v-flex>
        </v-container>

      
    </v-content>
    
</template>

<script>

  export default {
    data: () => ({
      nameErrors:'',
      emailErrors:'',
      dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
      numberOfStudents:0,
      collegeAssociation:'',
      phone:'',
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 20 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
       e1: 0,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false
    }),

    methods: {
      valid(){
        this.name != '' && this.email !=''
      },
      info(){
        this.dialog = true
      },
      submit () {
        this.e1 = 3
        let payload = {name: this.name, email: this.email, phone: this.phone, collegeAssociation: this.collegeAssociation,  numberOfStudents: this.numberOfStudents }
         this.$store.dispatch('submit_school_request', payload)
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>
<style scoped>
.dialogCard{
  background-image: url("/static/images/gradient.jpg");
  background-size: cover;
} 
  .title1 {
    margin-top: 10px;
    font-family: 'Roboto', sans-serif;
    font-weight: 100;
    font-size: 1.6em;
  }
  .title2 {
    margin-bottom: 20px;
    font-family: 'Roboto', sans-serif;
    font-weight: 100;
    font-size: 1.6em;
  }
.transparent2 {
  border-radius: 5%;
   background-color: transparent !important;
   border-color:white !important;
   border-style: solid;
   width: 60%;
   height: 70%;
   margin-left: 10%
 }
 .form {
   color: white;
   background-color: transparent!important;
   opacity: 0.84;
   width: 80%;
   margin-left: 10%
 }
 .panels{
   border-bottom: slategrey;
   border-width: 5px;


 }
 </style>
