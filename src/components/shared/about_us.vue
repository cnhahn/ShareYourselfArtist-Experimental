<template>
<v-container>
  <!-- <div class="loading_holder" v-if="loading">
    <div class="spinner_holder">
      <c-spinner></c-spinner>
    </div>
  </div>
 
  <v-content v-else>
    <v-parallax class="hidden-sm-and-down"  src="/static/images/about_us_banner.jpg" height="400"></v-parallax>
  <v-layout row align-center justify-center>
     <v-flex d-flex xs12  child-flex>
      <v-container  class="text-xs-center title1 hidden-sm-and-down">About Us</v-container>
   </v-flex>
 <v-flex d-flex xs12  child-flex>
    <v-container grid-list display-2 text-md-center class="text-xs-center title1 hidden-sm-and-down">
        <v-avatar>
          <img src="/static/images/logo.png" height="40px" alt="SYA Logo">
        </v-avatar>
      </v-flex>
    </v-container>
  </v-layout>
  <v-layout row>
    <v-container grid-list-lrg font-wieght headline text-md-center class="text-xs-center title2">ShareYourselfArtists.com connects visual artists to the art pages and sites that are making internet artists famous all around the world. 
      Share Yourself Artists makes the submission process simple and fun! We have helped hundreds of artists get recognition for their artwork. We are also the only submission platform that helps art pages earn money for maintaining their blog. By using our site, you are supporting the online arts industry!
   </v-container>
  </v-layout> -->

<v-parallax class="hidden-sm-and-down"  src="/static/images/about_us_banner.jpg" height="400"></v-parallax>
  <v-flex d-flex xs12>
      <v-container  class="text-xs-center title1  display-2">About Us</v-container>
   </v-flex>
  <v-flex d-flex xs12 >
     <v-container class=" title2"><b>ShareYourselfArtists.com</b> connects visual artists to the art pages and sites that are making internet artists famous all around the world. 
      <b>Share Yourself Artists</b> makes the submission process simple and fun! We have helped hundreds of artists get recognition for their artwork. We are also the only submission platform that helps art pages earn money for maintaining their blog. By using our site, you are supporting the online arts industry!
    </v-container>
  </v-flex>

  

 <!-- Nick's Profile    -->
  <v-flex d-flex xs12  child-flex>
    <v-container   class=" title2"><h2>Nick McElmurry</h2><br/> <span class ="font-weight-thin"><em>(Founder/Chief Executive Officer)</em><br/>
        </span>Nick's business and marketing expertise derive from both his work experiences and his personal endeavors. He has worked as a marketing executive for companies including, but not limited to, Jamba Juice, Sunpower, and State Farm. Though his specialty is social media and internet marketing, for he has accumulated over 100,000 followers across his personal project pages, Nick also has experience throwing and organizing events.<a href ="https://battleofthebaybands.com/"> He founded Battle of The Bay (Bands) </a> in 2018, a competition including over 30 bands from 5 different cities. 
        He also has a soft spot for the arts industry.  He is a musician in many different bands, but is most known for his band <a href="https://soundcloud.com/water-color-weekend" >Water Color Weekend.</a>
    </v-container>
  </v-flex>
<!-- Scott's Profile    -->
<v-flex d-flex xs12 >
        <v-container   class=" title2"><h2>Scott Davis</h2><br/> <span class ="font-weight-thin"> <em>(Software Engineer)</em><br/>
</span>Scott handles much of our development work and other stuff. As our Chief Creative/Developer, he's responsible for the overall work product of the company, overseeing our Design & Development. In the rare event that he's not working, he spends as much time as possible with his wife and his daughter. While he does occasionally get some sleep, it's usually when he passes out in his chair while working through the middle of the night.
      </v-container>
      </v-flex>
      
</v-container>
</template>
<style scoped>
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
  v-btn {
    width: 300px;
  }
  .iconRow {
    font-size: 120px;
    color: "primary";
  }
  .panel1 {
    padding: 50px;
    height: auto;
    background-color: #F2FAF5 !important;
  }
  .panel2 {
    height: auto;
    background-color: #FFF !important;
  }
  .account-btns {
    margin-bottom: 10px;
  }
  .number-circles {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FF7D27;
    color: white;
    margin-bottom: 10px;
  }
  .loading_holder {
    width: 100vw;
    height: 100vh;
  }
  .spinner_holder {
    height: 82vh;
    padding-top: 39vh;
    margin-left: 47vw;
  }
  .headline {
    color: black;
  }
  a:link {
    text-decoration: none;
}

</style>