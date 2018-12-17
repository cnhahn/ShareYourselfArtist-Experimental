<template>
<v-parallax src="/static/images/15.jpg" height="100%">
     <center>
       <div class="card mt-5 mb-5" style="max-width: 700px;background-color: #f9f9fa" >
 
    <v-flex pt-4 pb-4>
        <v-stepper class="ml-4 mr-4 elevation-0" v-model="e1">
           <h6 v-if = "this.e1 == 1" class="title mt-4 mb-4 ml-4 mr-4" style="color: #FF7D27;">Get Paid Today with Share Yourself Artists's easy to use platform.</h6>
           <h6 v-if = "this.e1 == 2" class="title mt-4 mb-4 ml-4 mr-4" style="color: #FF7D27;">Artists will see these account details so answer with care.</h6>
           <h6 v-if = "this.e1 == 3" class="title mt-4 mb-4 ml-4 mr-4" style="color: #FF7D27;">Copy and paste your social media URL below.</h6>
           <h6 v-if = "this.e1 == 4" class="title mt-4 mb-4 ml-4 mr-4" style="color: #FF7D27;">Great, you're are clicks away from meeting new artists. </h6>
        
      <v-stepper-header class="elevation-0" style="margin-bottom: -20px;">
      <v-stepper-step dark :complete="e1 > 1" step="1"></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step dark :complete="e1 > 2" step="2"></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step dark :complete="e1 > 3" step="3"></v-stepper-step>
      
    </v-stepper-header>

    <v-stepper-items >
      <v-stepper-content step="1" >
       <form class="form white--text">
           
          <v-text-field
                            name='business_name'
                            label= 'Business Name'
                            id= 'business_name'
                            v-model='business_name'
                            :rules="nameRules"
                            required
                            >
        </v-text-field>
        <v-text-field
                            name='email'
                            label= 'Email'
                            id='email'
                            v-model= 'email'
                            :rules="emailRules"
                            required
                            >
       </v-text-field>
       <v-text-field
                            name='password'
                            id='password'
                            label= 'Password'
                            v-model='password'
                            :type="show1 ? 'text' : 'password'"
                            required
                            >
                            </v-text-field>
    <v-text-field
                            name='password_retype'
                            id='password_retype'
                            label= 'Retype your password'
                            v-model='password_retype'
                            :type="show2 ? 'text' : 'password'"
                            required
                            >
    </v-text-field>
  </form>
       <img v-if='uploaded_image' :src="image_url" width="50%" height="auto">
       <input type="file" 
       style="display:none"                         
        ref="fileInput" 
        accept="image/*"
        @change ="onFilePicked">

     <v-layout row> 

       <v-flex lg6 xs6> 
         <v-btn 
          depressed 
          large 
          color="primary" 
          @click="onPickFile"
          >
            Upload Your Logo
          </v-btn>
        </v-flex>

       <v-flex lg6 xs6> 
         <v-btn 
          v-if ="this.formIsValid"
          large
          color="primary"
          @click="e1 = 2"
          @onclick ="validFalse"
          >
            Next
          </v-btn>

         <v-btn
          v-if ="!this.formIsValid"
          disabled
          large
          >
            Next
          </v-btn>

        </v-flex>

      </v-layout>
        
      </v-stepper-content>
      <v-stepper-content step="2">
          <form class="form white--text">
     <v-text-field 
                            name='publication'
                            label= 'Name of Publication'
                            id= 'publication'
                            v-model='publication'
                            required
                            >
    </v-text-field>
    <v-text-field
                            type="number"
                            name='follower_count'
                            label= 'Follower Count'
                            id='follower_count'
                            value = 'number'
                            v-model= 'follower_count'
                            required
                            >
  </v-text-field>

  <v-text-field
      v-model="website"
      label="Website"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
     <v-text-field multi-line
                            name='about'
                            id='about'
                            label= 'About – Write a short summary of your page '
                            :rules="[(v) => v.length <= 620 || 'Max 620 characters']"
                            :counter="120"
                            v-model='about'
                            required
                            >
                            </v-text-field>
    <v-text-field multi-line
                name='additional_notes'
                id='additional_notes'
                label= 'Additional Notes – Give an encouraging message that gets artists excited '
                :rules="[(v) => v.length <= 620 || 'Max 620 characters']"
                :counter="620"
                v-model='additional_notes'
                >
  </v-text-field>
  </form>

        <v-btn 
        @click="e1 = 1"
        flat>Previous</v-btn>

         <v-btn
        v-if ="this.form2IsValid"
          color="primary"
          @click="e1 = 3"
          @onclick ="validFalse"
        >
          Next
        </v-btn>

         <v-btn
        v-if ="!this.form2IsValid"
          disabled
          @click="e1 = 3"
        >
          Next
        </v-btn>
          
      </v-stepper-content>

      <v-stepper-content step="3" >
        <v-text-field
                            prepend-icon="fab fa-facebook-f"
                            name='facebook'
                            label= 'facebook'
                            id='facebook'
                            value = 'facebook'
                            v-model= 'facebook'
                            >
  </v-text-field>
  <v-text-field
                            prepend-icon="fab fa-instagram"
                            name='instagram'
                            label= 'instagram'
                            id='instagram'
                            value = 'instagram'
                            v-model= 'instagram'
                            >
  </v-text-field>
  <v-text-field
                            prepend-icon="fab fa-tumblr"
                            name='Tumblr'
                            label= 'tumblr'
                            id='tumblr'
                            value = 'tumblr'
                            v-model= 'tumblr'
                            >
  </v-text-field>

        <v-btn 
        @click="e1 = 2"
        flat>Previous</v-btn>

        <v-btn
          @click="onSubmit"
          color="primary"
        >
          Submit
        </v-btn>
    
        </v-stepper-content>

 <v-stepper-content step="4" >
        <v-btn
          @click="goSignIn"
          color = "primary"
        >
          Let's Sign You In
        </v-btn>
        </v-stepper-content>

    </v-stepper-items>
  </v-stepper>
</v-flex>
  </div></center>
</v-parallax>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

  export default {
    valid: true,
    data: () => ({
      uploaded_image:false,
      show1: false,
      show2: false,
      file:'',
      facebook:'',
      tumblr:'',
      image_is_not_loaded: true,
      image_url:'',
      file_name:'',
      instagram:'',
      additional_notes:'',
      password:'',
      about:'',
     email:'',
     password_retype:'',
     website:'',
     follower_count:0,
     publication:'',
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
      onSubmit(){
            let currentdate = new Date()
            //this.$store.dispatch('signUserOut')
            this.$store.dispatch('singBusinessUp', {publication:this.publication, 
                                                            facebook:this.facebook,
                                                            email:this.email,
                                                            password:this.password,
                                                            instagram:this.instagram,
                                                            tumblr:this.tumblr,
                                                            website: this.website,
                                                            role:'business', 
                                                            file:this.file,
                                                            follower_count: this.follower_count,
                                                            file_name: this.file_name,
                                                            about: this.about,  
                                                            additional_notes: this.additional_notes, 
                                                            joined_on:Date.now(),
                                                            upload_date:Date.now() })

        },
        
      onPickFile(){
            this.$refs.fileInput.click()
        },
      onFilePicked(event){
            const files = event.target.files
            let file = files[0]
            console.log('file: '+file)
            this.file = file
            this.image_is_not_loaded = false
            let filename = files[0].name
            this.file_name = filename
            if (filename.lastIndexOf('.')<=0){
                return alert ('Please add a valid image file')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', ()=>{
                this.image_url = fileReader.result
                console.log(this.image_url)
                 //this.$store.dispatch('image_being_uploaded', {file:this.file, image_url: this.image_url})
            })
            fileReader.readAsDataURL(files[0])
            this.uploaded_image=true
            console.log(this.imageUrl)
        },
      goSignIn(){
           this.$router.push({
                        name: 'sign_in' 
            })
      },
      validFalse(){
        this.formIsValid= false
      },

      info(){
        this.dialog = true
      },
     
      clear () {
        this.$refs.form.reset()
      }
    },
    computed:{
      
      
      formIsValid () {
            return this.name !=='' && this.file!== '' && this.email !== ''  &&this.password !== null && this.password_retype !== null && this.password == this.password_retype
        },
      form2IsValid () {
            return this.publication !==''  && this.website !== '' && this.about !== '' && this.follower_count >0  && this.additional_notes !== ''
        }
    }
  }
</script>
