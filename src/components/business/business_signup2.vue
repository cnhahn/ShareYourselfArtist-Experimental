<template>   
         <v-parallax src="/static/images/15.jpg" height="100%" 
      jumbotron>
       <center><div class = "card" style = "max-width: 700px; " >
   <v-card  >
       <v-card-title primary-title mx-auto>
            <div>
              <h3 class="headline mb-0">We’ll just need you to answer a few quick questions. PLEASE NOTE: ARTISTS WILL SEE THESE ACCOUNT DETAILS SO ANSWER WITH CARE</h3>
            </div>
          </v-card-title>
     
                     <v-layout row >
                            <v-text-field 
                            name='publication'
                            label= 'Name of Publication'
                            id= 'publication'
                            v-model='publication'
                            >
                            </v-text-field>
                        
                    </v-layout>
                     <v-layout row>
                            <v-text-field
                            type="number"
                            name='follower_count'
                            label= 'Follower Count'
                            id='follower_count'
                            value = 'number'
                            v-model= 'follower_count'
                            >
                            </v-text-field>
                      
                    </v-layout>
                    <v-layout row>
                            <v-text-field 
                            name='website'
                            id='website'
                            label= 'Website'
                            v-model='website'
                            >
                            </v-text-field>
                        
                    </v-layout>
                   <v-layout row>
                        
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
                        
                    </v-layout>
                    
                        <v-layout row>
                        
                            <v-text-field multi-line
                            name='the_good'
                            id='the_good'
                            label= 'Favorite Pieces – what type of posts do you typically share. i.e. paintings, psychedelic, realistic, photography, etc'
                            :rules="[(v) => v.length <= 620 || 'Max 620 characters']"
                            :counter="620"
                            v-model='the_good'
                            required
                            >
                            </v-text-field>
                        
                    </v-layout>     
        <v-layout row>
           
                <!-- <v-text-field multi-line
                name='worth_knowing'
                id='worth_knowing'
                label= 'Worth Knowing '
                :rules="[(v) => v.length <= 620 || 'Max 620 characters']"
                :counter="620"
                v-model='worth_knowing'
                required
                >
                </v-text-field> -->
             
        </v-layout>
            <v-layout row>
                
                <v-text-field multi-line
                name='additional_notes'
                id='additional_notes'
                label= 'Additional Notes – Give an encouraging message that gets artists excited to submit their art to you '
                :rules="[(v) => v.length <= 620 || 'Max 620 characters']"
                :counter="620"
                v-model='additional_notes'
                >
                </v-text-field>
             
            </v-layout>
           
         <v-text-field 
                    name='Instagram'
                    label= 'Copy and paste your Instagram page URL (https://www.instagram.com/...)'
                    id= 'instagram'
                    v-model='instagram'>
                 </v-text-field>
     
      
                 <v-text-field 
                    name='Facebook'
                    label= 'Copy and paste your Facebook page URL (https://www.facebook.com/...)'
                    id= 'facebook'
                    v-model='facebook'>
                 </v-text-field>
       
            <v-text-field 
                    name='Tumnlr'
                    label= 'Copy and paste your Tumblr page URL (https://www.tumblr.com/...)'
                    id= 'tumblr'
                    v-model='tumblr'>
                 </v-text-field>   
            
        <v-layout row>
       
            <v-flex>
                
                <v-layout row>
                                <input type="file" 
                                style="display:none" 
                                ref="fileInput" 
                                accept="image/*"
                                @change ="onFilePicked">
                            </v-layout>
                <img v-if='uploaded_image' :src="image_url" width="50%" height="auto">
                 <v-btn depressed color="primary" @click="onPickFile">Upload Your Logo</v-btn>
                <v-btn depressed color="primary" @click="onSubmit">Submit</v-btn>
            </v-flex>
        </v-layout>

        </v-card>
    </div></center>

    <v-dialog v-model="dialog" max-width="790">
      <v-card>
        <v-card-title class="headline">Almost There</v-card-title>
        <v-card-text>Please check your email and verify. If you do not receive email verification within five minutes, please check your junk mail folder.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="onSignOut"  router to="/">Ok</v-btn>
        </v-card-actions>
       
      </v-card>
    </v-dialog>
</v-parallax>


</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import * as firebase from "firebase"
export default {
    
    data(){
        return {        
            about: '',
            the_good:'',
            additional_notes: '',
            logo:'',
            worth_knowing:'',
            image_url:'',
            file_name:null,
            file:{},
            image_is_not_loaded: true,
            description: '',
            follower_count:null,
            website: null,
            publication:'',
            tumblr:'',
            facebook:'',
            instagram:'',
            role:'business',
            uplad_date: '',
            dialog: false,
            uploaded_image:false,
        }
    },
    computed: {
        formIsValid () {
            return this.about !=='' && this.the_good !== '' && this.worth_knowing !== '' 
        },
        emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      }
    },
    methods:{
    onSignOut(){
      console.log('signed out')
       this.dialog= false
       
    },
        modal(){
      this.dialog= true
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
                //console.log(this.image_url)
                 this.$store.dispatch('image_being_uploaded', {file:this.file, image_url: this.image_url})
            })
            fileReader.readAsDataURL(files[0])
            this.uploaded_image=true
            //console.log(this.imageUrl)
        },
        onSubmit(){
            this.dialog= true
            let currentdate = new Date()
            //this.$store.dispatch('signUserOut')
            let datetime = (currentdate.getMonth()+1) + "/"+currentdate.getDate() + "/" + currentdate.getFullYear()
            this.$store.dispatch('create_a_new_business', {publication:this.publication, 
                                                            facebook:this.facebook,
                                                            instagram:this.instagram,
                                                            tumblr:this.tumblr,
                                                            role:this.role, 
                                                            about: this.about, 
                                                            the_good: this.the_good, 
                                                            worth_knowing:this.worth_knowing, 
                                                            additional_notes: this.additional_notes, 
                                                            upload_date:datetime})
        },
        
    } 

}
</script>
<style>
 .formTitle{
     color: orange;
 }
 .card{
     margin:2%;
     padding:1%;
 }
  
</style>

 
                
             
              
             

