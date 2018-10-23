/*Karl Wong
* CS 115
* 2018 Summer Session 1
* Unit test for art submission
*/
const costOfBusiness = 1
var current_credits = 4
var art = ["null", "artpiece #1", "artpiece #2","artpiece #3", "artpiece #4"]

function submit_art(){
    console.log('credits before submission: ' + current_credits)
    if(current_credits >= costOfBusiness) {
      const creditAfterSubmit = current_credits - costOfBusiness 
      submit_request(art[current_credits])
      update_user_credit(creditAfterSubmit)
      console.log('current_credits for this artist is: ' + current_credits) 
      console.log('remove commits to the current business, about to complete transaction')
      console.log('success \n')
    } 
}

function submit_request(art) {
    console.log('art_being_submitted is set: ' + art)
}

function update_user_credit(value) {
    current_credits = value
}

while(current_credits > 0) {
    submit_art()
}

if(current_credits == 0) {
    console.log("Buy more credits! You have " + current_credits + " credits")
}
