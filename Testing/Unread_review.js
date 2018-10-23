//Simulate fetch unread reviews
//Hiep Nguyen
// CS 115
// Unit test for fetching unread reviews

var user = []
var reviewList=""

var masterList = [{
        name: 'artist1',
        email: 'artist1@gmail.com',
        password:'1234',
        userId: 'abcd1234567890',
        submission:'dsfndsjkffndsfnskj',
        read_byartist:false
    },
    {
        name: 'artist2',
        email: 'artist2@gmail.com',
        password:'12345',
        userId: 'bcda1234567890',
        submission:'sdfnjkdsfndskjfds',
        read_byartist:false
    },
    {
        name: 'artist3',
        email: 'artist3@gmail.com',
        password:'123456',
        userId: 'cdaf1234567890',
        submissions:'sdfsdjfdnfjdskfnsjkfdskfjndsfdskfndsjkfndsfndsjkfdsf dsjknfnsdidsfndsf1290312903i290',
        read_byartist:true
    },
    {
        name: 'artist4',
        email: 'artist4@gmail.com',
        password:'123456',
        userId: 'cdaf1234567890',
        submissions:'sdfsdjfdnfjdskfnsjkfdskfjndsfdskfndsjkfndsfndsjkfdsf dssdfdsnfjkfndjskfkdsnfjdksfkjdsfnjksfjkjknfnsdidsfndsf1290312903i290',
        read_byartist:false
    },
    {
        name: 'artist5',
        email: 'artist5@gmail.com',
        password:'123456',
        userId: 'cdaf1234567890',
        submissions:'sdfsdjfdnfjdskfnsjkfdgfdgjfdig234924932fdskfjndsfdskfndsjkfndsfndsjkfdsf dsjknfnsdidsfndsf1290312903i290',
        read_byartist:true
    },
    
]


function reviewList_unread_reviews(){
    reviewList = masterList.filter((review) => {
      return review.read_byartist == false
    })
}

function checkUnreadReviews(reviews){
    for(let i=0;i<reviews.length;i++){
        if(reviews[i].read_byartist==true){
            console.log('Get unread reviews fail')
            break
        }
    }
    console.log('Get unread reviews successful', reviews)

}

reviewList_unread_reviews()
checkUnreadReviews(reviewList)

