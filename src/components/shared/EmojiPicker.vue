<template>
  <div class="emoji-picker" v-if="show">
    <v-card height="300px" width="300px" v-if="show">
      
      <v-card-text>
        <div class="emoji-content">
          <emoji v-for="emoji in emojis" :emoji="emoji" @click="onEmojiClick" v-model="input_emoji"></emoji>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Emoji from './Emoji.vue'

  export default {
    data () {
      return {
        emojis: [],
        input_emoji:''
      }
    },
    props: {
      show: true
    },
    created () {
      this.$http.get('https://raw.githubusercontent.com/shanraisshan/EmojiCodeSheet/master/json/string/People.json').then(response => {
        this.emojis = response.body.peoples.people
      }, response => {
        // error callback
      })
    },
    methods: {
      onEmojiClick (emoji) {
        this.$emit('clicking', emoji.value)
      
        
      },
      closePicker () {
        this.$emit('close')
      }
    },
    components: {
      'emoji': Emoji
    }
  }
</script>

<style>
  .emoji-picker{
    background: white;
    position: absolute;
    bottom: 5rem;
    left: 0;
    width: 200px;
    user-select: none;
  }
  .emoji-picker .emoji-header{
    display: flex;
    padding: 5px;
    box-shadow: 0px 5px 9px 0px rgba(0,0,0,0.15);
  }

  .emoji-picker .emoji-header .emoji-close{
    margin-left: auto;
  }
  .emoji-picker .emoji-content{
    
    overflow-y: auto;
    height: 250px;
  }
  .emoji-picker span{
    cursor: pointer;
    font-size: 25px;
  }
</style>
