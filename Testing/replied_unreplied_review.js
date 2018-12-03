var listOfArt = [{
  art_title: 'test',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: true
},
{
  art_title: 'test2',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: false
},
{
  art_title: 'test',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: false
},
{
  art_title: 'test',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: false
},
{
  art_title: 'test',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: true
},
{
  art_title: 'test',
  artist_id: 'rLUZnvP5guc74u7iN0Gfm50u7ov1',
  artist_name: 'test',
  description: 'shshdjadbehs ga geytjehkqtkqtjagkagkgjfhahfjsvjfjsgjagjafjajfhsgsggsgdg',
  upload_date: 1543638648940,
  url: 'https://firebasestorage.googleapis.com/v0/b/sya-app.appspot.com/o/rLUZnvP5guc74u7iN0Gfm50u7ov1?alt=media&token=3921d306-2726-47e7-a84b-e4fb8a520aa1',
  artist_email: 'david3de@gmail.com',
  businessId: {business_email: 'test@gmail.com', business_name: 'test', userId: 'yekGAvzU5fZKh49e6w0tJuRmFFg1'},
  read_byartist: false,
  refunded: 0,
  replied: undefined
}
]

var amountOfTotalSubmissions = 0
var amountOfUnrepliedSubmissions = 0
var amountOfRepliedSubmissions = 0

function getTotal (submissions) {
  amountOfTotalSubmissions = submissions.length
}

function getUnreplied (submissions) {
  amountOfUnrepliedSubmissions = submissions.filter((review) => {
    return review.replied === undefined || review.replied === false
  }).length
}

function getReplied (submissions) {
  amountOfRepliedSubmissions = submissions.filter((review) => {
    return review.replied === true
  }).length
}

function checkTotal (submissions) {
  if (amountOfTotalSubmissions === 6) {
    console.log('Total Test Success')
  } else {
    console.log('Total Test Failed')
  }
}

function checkUnreplied (submissions) {
  if (amountOfUnrepliedSubmissions === 4) {
    console.log('Unreplied Test Success')
  } else {
    console.log('Unreplied Test Failed')
  }
}

function checkReplied (submissions) {
  if (amountOfRepliedSubmissions === 2) {
    console.log('Replied Test Success')
  } else {
    console.log('Replied Test Failed')
  }
}

getTotal(listOfArt)
checkTotal(listOfArt)

getUnreplied(listOfArt)
checkUnreplied(listOfArt)

getReplied(listOfArt)
checkReplied(listOfArt)
