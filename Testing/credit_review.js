/*Joo Yon Kim
* CS 115
* 2018 Summer Session 1
* Unit test for credits
*/

var previous_credits = 4
var current_credits = previous_credits
var bought = [5, 10, 50]

function buy_credits(bought){
    var rand = Math.floor(Math.random()*3)
    var picked = bought[rand]
    var inc = 8
    switch (picked) {
        case 5:
          increase_credit(8)
          break
        case 10:
          increase_credit(20)
          inc=20
          break
        case 20:
          increase_credit(50)
          inc=50
          break
      }
    if (current_credits == previous_credits+inc ) {
        console.log('previous_credits for this artist is: ' + previous_credits)
        console.log('the bought credits are: ' + inc)
        console.log('current_credits for this artist is: ' + current_credits)
        console.log('success \n')
    }
    else {
        console.log('previous_credits for this artist is: ' + previous_credits)
        console.log('the bought credits are: ' + inc)
        console.log('current_credits for this artist is: ' + current_credits)
        console.log('failed')
    }
}

function increase_credit(value) {
    current_credits = value + current_credits
}

buy_credits(bought)