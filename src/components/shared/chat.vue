<template>
  <div>
    <v-container
    id='chat-container'
    style='max-height: 70vh'
    class='scroll-y'>
      <v-layout
        id='chat'
        column
        style='height: 70vh'
      >
        <v-layout row>
          <v-flex xs12 sm9 offset-sm3>
            <v-list three-line>
              <template v-for="(chat) in chat_items">
                <v-list-tile
                  :key="chat.key"
                  avatar
                  class="resize_list"
                >
                  <v-list-tile-avatar :color="chat.color" >
                    <img :src="chat.avatar" :style="chat.displayAvatar">
                    <span class="white--text headline" v-html="chat.initial">
                    </span>
                  </v-list-tile-avatar>

                  <v-list-tile-content >
                    <v-list-tile-title class="t" v-html="chat.name"></v-list-tile-title>
                    <v-list-tile-sub-title class="b" v-html="chat.message"></v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-text
                  class="a"
                  v-html="chat.time"
                  name='time'
                  ></v-list-tile-text>
                  <!-- <v-list-tile-text class="date" v-html="chat.daystamp" name='date'></v-list-tile-text> -->
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-layout row >
      <v-flex xs12 sm8 offset-sm3>
        <v-list three-line>
          <template v-for="(item) in input">
            <v-list-tile

              :key="item.name"
              avatar
              style="background-color:#e6fff7"

            >
            <v-icon class="smiley" @click="toggleEmojiPanel">sentiment_satisfied_alt</v-icon>
              <v-list-tile-content class="input">
                  <v-text-field
                  @keyup.native.enter="sendMessage"
                  id='message'
                  v-model="message"
                  box
                  clear-icon="mdi-close-circle"
                  label="Text here"
                  type="text"
                  width="50px"

                  ></v-text-field>
                  <emoji-picker :show="emojiPanel" @clicking="addEmoji" @close="toggleEmojiPanel"  ></emoji-picker>

              </v-list-tile-content>

              <v-list-tile-action
              style="color:orange"
              id='send'
              name='send'
              @click="sendMessage"
              v-html="item.send"></v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import * as firebase from "firebase"
import EmojiPicker from './EmojiPicker.vue'




  export default {
    mounted: function() {
      var chatContainer = document.getElementById('chat-container')
      var chatLayout = document.getElementById('chat')
      chatContainer.style.maxHeight = window.innerHeight
      chatLayout.style.height = window.innerHeight
      this.loadChats();
    },
    updated: function() {
      if(this.canRefresh) {
        this.refreshContainer();
        this.canRefresh = false
      }
    },
    components: {
      'emoji-picker': EmojiPicker,

    },
    data () {
      return {
        message: "",
        canRefresh: true,
        chat_items: [],
        input: [
          {
            name: 'Input',
            send: 'Send'
          }
        ],
        user_profile:[],
        emojiPanel:false,
        emojis:[],
      }
    },
    methods: {
      toggleEmojiPanel () {
        this.emojiPanel = !this.emojiPanel
      },
      addEmoji: function(value){
        console.log(value)
        this.message+=value
      },
      initial() {
        return String(this.$store.user.name).charAt(0)
      },
      loadChats() {
        let firebase_db = this.$store.getters.chat_database;
        let chat_items = this.chat_items;
        const that = this
        let chat_ref = firebase_db.ref('chat')
        chat_ref.on('value', function(snapshot, newMessage = true) {
          console.log(snapshot.length)
          chat_items.length = 0;
          var itemProcessed = 0;
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var chat = null
            if (childData.url == "") {
              chat = {
                key: childKey,
                color: childData.color,
                name: childData.user.name,
                message: childData.message,
                time: childData.timestamp,
                daystamp: childData.daystamp,
                initial: String(childData.user.name).charAt(0),
                displayAvatar: 'display:none'
              }
            } else {
              var chat = {
                key: childKey,
                color: childData.color,
                avatar: childData.url,
                name: childData.user.name,
                message: childData.message,
                time: childData.timestamp,
                daystamp: childData.timestamp,
                initial: '',
                url:childData.url,
                displayAvatar: 'display:block'
              }
            }
            chat_items.push(chat);
            itemProcessed++;
          });
          if (!newMessage) {
          } else {
            console.log("now is")
            that.canRefresh = true;
          }
        })
      },
      sendMessage(e) {
        if (this.message === '') {
          return;
        }
        var user = this.$store.getters.signed_in_user
        console.log(user)
        var role = user.role
        var sender = null
        if (role == 'business') {
          sender = user.business_name
        } else if (role == 'artist') {
          sender = user.name
        }
        var color = this.$store.getters.color
        console.log('color: ' + color)
        var url = this.$store.getters.url
        if (user == null) {
          return;
        }
        const copy_message = this.message;
        var total_timestamp = this.makeTimeStamp();

      if(url){
        this.$store.dispatch('sendMessageToFirebase', {
          message: copy_message,
          user: sender,
          daystamp: total_timestamp.daystamp,
          timestamp: total_timestamp.timestamp,
          url: url,
          color: color
        })

      }else{
        this.$store.dispatch('sendMessageToFirebase', {
            message: copy_message,
            user: sender,
            daystamp: total_timestamp.daystamp,
            timestamp: total_timestamp.timestamp,
            url: '',
            color: color,
            attach_url:''
          })
      }
        this.clearInput();
      },
      refreshContainer() {
        var container = document.getElementById("chat-container")
        container.scrollTop = container.scrollHeight;
      },
      getUserId() {
        // return firebase.auth().currentUser.uid;
      },
      makeTimeStamp() {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getUTCMonth() + 1;
        var curr_year = d.getFullYear();
        var curr_hour = d.getHours();
        var curr_min = d.getMinutes();
        var daystamp = curr_month + "/" + curr_date + "/" + curr_year;
        var timestamp = curr_hour + ":" + curr_min;
        var total_timestamp = {daystamp: daystamp, timestamp: timestamp}
        return total_timestamp
      },
      clearInput() {
        this.message = ''
      }
    },
    created () {
      let db = firebase.firestore()
      db.collection("messages").where("chat_message", "==", true)
    .onSnapshot(function(querySnapshot) {
        let messages = [];
        querySnapshot.forEach(function(doc) {
            messages.push(doc.data().message);
        })
        console.log("Current cities in CA: ", messages.join(", "));
    })
  }
  }
</script>
<style scoped>
  .date{
    font-size: 1ch;
    opacity: 0.5;
    margin-left: 5px;
  }
  .b{
    color:black;
    word-wrap:break-word;
    font-weight: normal;
    font-size: 12pt;
    font-family: Arial, Helvetica, sans-serif;
    overflow: auto

  }
  .a{
    opacity:0.5;
    font-size:small;
    margin-left:20%;

  }
  .t{
    font-weight: bold
  }
  .input{
    margin-right: 65px;
  }
  .resize_list{

  }
  .smiley{
    margin-right:10px
  }

</style>
