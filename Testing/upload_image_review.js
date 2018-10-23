/**
* Yujin Chung
* Unit test for image upload function
**/
var imageIsNotLoaded = true
var fileName = ''
var event1 = {target: {files: ['file']}}
var event2 = {target: {files: ['']}}
var event3 = {target: {files: ['file.img']}}

function onFilePicked (event) {
  const files = event.target.files
  let name = files[0]
  imageIsNotLoaded = false
  if (name.lastIndexOf('.') <= 0) {
    return console.log('Please add a valid image file')
  }
  addEventListener(name, (res) => {
    // Callback after fileReader loads the data with Url.
    fileName = res
    imageBeingUploaded()
  })
}

function addEventListener(log, callback) {
  callback(log)
}

function imageBeingUploaded() {
  return;
}

function setUp () {
  imageIsNotLoaded = true
  fileName = ''
}

onFilePicked(event1)
console.log(imageIsNotLoaded === false)
console.log(fileName === '')
setUp()

onFilePicked(event2)
console.log(imageIsNotLoaded === false)
console.log(fileName === '')
setUp()

onFilePicked(event3)
console.log(imageIsNotLoaded === false)
console.log(fileName === 'file.img')
