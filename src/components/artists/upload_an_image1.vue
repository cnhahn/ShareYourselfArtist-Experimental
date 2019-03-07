<template>
  <!--Styled by Jin. No modification on code.-->
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>

      <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
      >
      {{ text }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
      </v-snackbar>
        <h3 class="display-3">Great, let's get started. </h3>
        <h4 class="display-1">Blogs and labels typically respond within hours.</h4>
        <span class="subheading">If a blog decides that they like your piece, they'll let you know when and how they plan to share it.</span><br>
        <span class="subheading">You'll be able to chat with them, and share any information you think they might need for their coverage.</span>
        <v-divider class="my-3"></v-divider>
        <div class="display-1">Let's Upload your art piece!</div>
        <div class="buttons-123">
          <v-btn
            class="mx-0"
            color="primary"
            depressed
            large
            router to="/upload_an_image1"
            @click="onPickFile"
          >
            Upload your art
          </v-btn>
          <input type="file"
                style="display:none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked">
          <v-btn
            class="mx-0"
            depressed
            large
            color="primary"
            router to="/upload_an_image"
            :disabled="image_is_not_loaded"
            @click="getUserId">Next

          </v-btn>
        </div> 
                 
          <v-layout row="">
            <div class="preview-image">
            <v-flex xs12="" sm6="">
              <v-alert
                v-if="image_size_accepted == false"
                :value="true"
                type="error"
              >
                Image size is too large! Please reduce the image size
              </v-alert>
              <!--<img :src="image_url" height="350"></img>-->
              <!--<img :src="image_url" height="550"></img>-->
              <!--<div v-if="image_too_big == false">
                <img :src="image_url"
                    :style="{
                      width: resized_width + 'px',
                      height: resized_height + 'px'
                    }"
                ></img>
              </div>
               <div v-else>-->
                 <div v-if="image_is_landscape">
                    <img :src="image_url"
                      :style="{
                      width: max_pre_width + 'px'
                      }"
                    ></img>
                 </div>
                 <div v-else>
                   <img :src="image_url"
                      :style="{
                      height: max_pre_height + 'px'
                      }"
                    ></img>
                 </div>  
               <!--</div>-->
            </v-flex>
          </div>
          </v-layout> 
                   
        <v-layout>
      <div class="text-xs-center" id="tour">
        <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
          <template slot-scope="tour">
            <transition name="fade">
              <v-step
                v-if="tour.currentStep === index"
                v-for="(step, index) of tour.steps"
                :key="index"
                :step="step"
                :previous-step="tour.previousStep"
                :next-step="tour.nextStep"
                :stop="tour.stop"
                :is-first="tour.isFirst"
                :is-last="tour.isLast"
                :labels="tour.labels"
              >
              <template v-if="tour.currentStep === 0">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.nextStep" large depressed color="primary">Yes</v-btn>
                    <v-btn type="button" @click="tour.stop" large depressed color="primary">No</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 1">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">Close</v-btn>
                    <v-btn type="button" @click="tour.nextStep" depressed color="primary">Next Step</v-btn>
                  </div>
                </template>
                <template v-if="tour.currentStep === 2">
                  <div slot="actions">
                    <v-btn type="button" @click="tour.stop" depressed color="primary">
                      Close
                    </v-btn>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
        </v-tour>
      </div>
    </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/*** Start ImageTools.js, https://gist.github.com/dcollien/312bce1270a5f511bf4a#file-imagetools-es6 */
'use strict';

if (typeof exports === "undefined") {
    var exports = {};
}

if (typeof module === "undefined") {
   var module = {};
}

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var hasBlobConstructor = typeof Blob !== 'undefined' && (function () {
    try {
        return Boolean(new Blob());
    } catch (e) {
        return false;
    }
})();

var hasArrayBufferViewSupport = hasBlobConstructor && typeof Uint8Array !== 'undefined' && (function () {
    try {
        return new Blob([new Uint8Array(100)]).size === 100;
    } catch (e) {
        return false;
    }
})();

var hasToBlobSupport = typeof HTMLCanvasElement !== "undefined" ? HTMLCanvasElement.prototype.toBlob : false;

var hasBlobSupport = hasToBlobSupport || typeof Uint8Array !== 'undefined' && typeof ArrayBuffer !== 'undefined' && typeof atob !== 'undefined';

var hasReaderSupport = typeof FileReader !== 'undefined' || typeof URL !== 'undefined';

var ImageTools = (function () {
    function ImageTools() {
        _classCallCheck(this, ImageTools);
    }

    _createClass(ImageTools, null, [{
        key: 'resize',
        value: function resize(file, maxDimensions, callback) {
            if (typeof maxDimensions === 'function') {
                callback = maxDimensions;
                maxDimensions = {
                    width: 640,
                    height: 480
                };
            }

            var maxWidth = maxDimensions.width;
            var maxHeight = maxDimensions.height;

            if (!ImageTools.isSupported() || !file.type.match(/image.*/)) {
                callback(file, false);
                return false;
            }

            if (file.type.match(/image\/gif/)) {
                // Not attempting, could be an animated gif
                callback(file, false);
                // TODO: use https://github.com/antimatter15/whammy to convert gif to webm
                return false;
            }

            var image = document.createElement('img');

            image.onload = function (imgEvt) {
                var width = image.width;
                var height = image.height;
                var isTooLarge = false;

                if (width > height && width > maxDimensions.width) {
                    // width is the largest dimension, and it's too big.
                    height *= maxDimensions.width / width;
                    width = maxDimensions.width;
                    isTooLarge = true;
                } else if (height > maxDimensions.height) {
                    // either width wasn't over-size or height is the largest dimension
                    // and the height is over-size
                    width *= maxDimensions.height / height;
                    height = maxDimensions.height;
                    isTooLarge = true;
                }

                if (!isTooLarge) {
                    // early exit; no need to resize
                    callback(file, false);
                    return;
                }

                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                if (hasToBlobSupport) {
                    canvas.toBlob(function (blob) {
                        callback(blob, true);
                    }, file.type);
                } else {
                    var blob = ImageTools._toBlob(canvas, file.type);
                    callback(blob, true);
                }
            };
            ImageTools._loadImage(image, file);

            return true;
        }
    }, {
        key: '_toBlob',
        value: function _toBlob(canvas, type) {
            var dataURI = canvas.toDataURL(type);
            var dataURIParts = dataURI.split(',');
            var byteString = undefined;
            if (dataURIParts[0].indexOf('base64') >= 0) {
                // Convert base64 to raw binary data held in a string:
                byteString = atob(dataURIParts[1]);
            } else {
                // Convert base64/URLEncoded data component to raw binary data:
                byteString = decodeURIComponent(dataURIParts[1]);
            }
            var arrayBuffer = new ArrayBuffer(byteString.length);
            var intArray = new Uint8Array(arrayBuffer);

            for (var i = 0; i < byteString.length; i += 1) {
                intArray[i] = byteString.charCodeAt(i);
            }

            var mimeString = dataURIParts[0].split(':')[1].split(';')[0];
            var blob = null;

            if (hasBlobConstructor) {
                blob = new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], { type: mimeString });
            } else {
                var bb = new BlobBuilder();
                bb.append(arrayBuffer);
                blob = bb.getBlob(mimeString);
            }

            return blob;
        }
    }, {
        key: '_loadImage',
        value: function _loadImage(image, file, callback) {
            if (typeof URL === 'undefined') {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    image.src = evt.target.result;
                    if (callback) {
                        callback();
                    }
                };
                reader.readAsDataURL(file);
            } else {
                image.src = URL.createObjectURL(file);
                if (callback) {
                    callback();
                }
            }
        }
    }, {
        key: 'isSupported',
        value: function isSupported() {
            return typeof HTMLCanvasElement !== 'undefined' && hasBlobSupport && hasReaderSupport;
        }
    }]);

    return ImageTools;
})();

exports['default'] = ImageTools;
module.exports = exports['default']; 
/*** End ImageTools.js */

  // Styled by Jin. No modification on code.
  export default {
    name: 'myTour',
    data () {
      return {

        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        text: 'Please add a valid image file',

        image_size_accepted : true,
        checkbox: true,
        radioGroup: 0,
        switch1: true,
        image_url: '',
        file_name: null,
        file: {},
        image_is_not_loaded: true,
        max_pre_width: 600,
        max_pre_height: 430,
        image_too_big: false,
        image_is_landscape: true,
        resized_width: 0,
        resized_height: 0,
        resizedURL: '',
        steps: [
          {
            target: '#v-step-0', 
            content: 'Would you like help with uploading?'
          },
          {
            target: '#v-step-1', 
            content: 'Click the "UPLOAD YOUR ART" button and select your art to be uploaded from your local files'
          },
          {
            target: '#v-step-2', 
            content: 'Once you have finished uploading your image, you will be sent to your dashboard. At your dashboard, you can view your uploads and even submit your work to various art sharing platforms'
          }
        ], myCallbacks: {
          onPreviousStep: this.previousStepCallback,
          onNextStep: this.nextStepCallback
        }
      }
    },

    mounted: function(){
      this.$tours['myTour'].start()
    },
    computed: {},
    methods: {
      getUserId () {
        let userId = this.$store.getters.user.id
        console.log(userId)
      },
      onPickFile () {
        this.image_size_accepted = true
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let file = files[0]
        console.log('Entered on FilePicked')
        /*if(file.size > 4000000){
          this.image_size_accepted = false
          var input = document.getElementsByTagName('input')[0];
          input.value = null
          this.image_url = ''
          this.image_is_not_loaded = true
          return
        }*/ 
        console.log('file: ', file)
        this.file = file 
        this.image_is_not_loaded = false
        let filename = files[0].name
        if ( filename.lastIndexOf('.') <= 0 || !file.type.match('image.*') ) {
          this.image_is_not_loaded = true
          this.snackbar = true
          this.file = null
          this.image_url = ''
          return
        }

        // assume uploaded image not over max dimensions at first
        this.image_too_big = false
        this.image_is_landscape = true
        // lets methods be used within fileReader load
        var self = this

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          // Callback after fileReader loads the data with Url.
          this.image_url = fileReader.result

          /*** Start using ImageTools to resize image***/
          /*
          ImageTools.resize(this.files[0], {
            width: 320, // maximum width
            height: 240 // maximum height
          }, function(blob, didItResize) {
          // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
          //document.getElementById('preview').src = window.URL.createObjectURL(blob);
          this.image_url = window.URL.createObjectURL(blob);
          console.log('did it resize: ', didItResize)
          // you can also now upload this blob using an XHR.
          });
          */
          /*** End using ImageTools***/

          /*** Start using Canvas to resize image ***/
          /*
          // holds the uploaded image, used to get dimensions
          var img = new Image()

          // var dataURL = ''
          // image loading is done asynchronously, so you have to wait for load event
          // in other words, you have to wait for the image to load before using image
          img.onload = function()
          {
            //console.log('image width: ', img.width)
            //console.log('image height: ', img.height)
            
            // check orientation
            self.checkOrientation(img.width, img.height)

            // this is to resize the uploaded image
            // max width allowed = 1200, height allowed = 630
            var resizeDims = self.resizeImage(img.width, img.height, 1200, 630)
            img.width = resizeDims[0]
            img.height = resizeDims[1]

            // https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
            var canvas = document.createElement('canvas')
            //console.log('resized image width: ', img.width)
            //console.log('resized image height: ', img.height)
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)

            // dataURL = canvas.toDataURL('image/jpeg')
            self.resizedURL = canvas.toDataURL('image/jpeg')
            //console.log('dataURL: ', dataURL)

            //self.$store.dispatch('image_being_uploaded', {file: self.file, image_url: self.resizedURL})
            console.log('resizedURL: ', self.resizedURL)
          }
          img.src = this.image_url
          //console.log('image_url: ', this.image_url)
          */
          /*** End using Canvas to resize image ***/

          this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: this.image_url})
          // this.$store.dispatch('image_being_uploaded', {file: this.file, image_url: dataURL})
        })
        fileReader.readAsDataURL(files[0])
      },
        previousStepCallback(currentStep) {
        console.log("Previous")
      },
        nextStepCallback(currentStep) {
        console.log("Next")
      },
      checkOrientation(width, height)
      {
        // check if landscape or portrait to set max preview dimensions
        if (width >= height)
        {
          this.image_is_landscape = true
        }
        else
        {
          this.image_is_landscape = false
        }
      },
      resizeImage(width, height, maxWidth, maxHeight) {
        // resize the image proportionally if too large, keeping aspect ratio
        // preview is restricted to max width or height, depending on orientation
        var ratio = 0

        if (width > maxWidth)
        {
          ratio = maxWidth / width
          height = height * ratio
          width = width * ratio

          this.image_too_big = true
        }
        if (height > maxHeight)
        {
          ratio = maxHeight / height
          width = width * ratio
          height = height * ratio

          this.image_too_big = true
        }

        width = Math.round(width)
        height = Math.round(height)
        this.resized_width = width
        this.resized_height = height

        return [width, height]
      }

    }
  }
</script>


<style>
  .iconRow {
    font-size: 200px;
    color: #FF7D27;
  }

  .display-1 {
    margin-top: 5px;
    margin-bottom: 10px;
    margin-left: 300px;
  }

  .display-2 {
    margin-top: 10px;
    margin-left: 300px;
  }

  .display-3{
    margin-left: 300px;
  }

  .subheading{
    margin-left: 300px;
  }

  .buttons-123{
    margin-left: 300px;
  }

  .preview-image{
    margin-left: 300px;
  }

  #tour {
    margin-top: 50px;
    margin-left: 300px;
  }
</style>
