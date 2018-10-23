/**
 * Jack Soto
 * CS 115
 * 2018 Summer Session 1
 * Unit Test for Submission Filtering
 */
class Submission_Filter_Unit_Test {

  constructor(submissions_array){
    this.master_submissions = submissions_array;
  }

  submissions_unreplied_submissions() {
    this.master_submissions = this.master_submissions.filter((review) => {
      return review.replied == false
    })
  }

  submissions_replied_submissions() {
    this.master_submissions = this.master_submissions.filter((review) => {
      return review.replied == true
    })
  }
}

const data_set = [{name:"1", replied:true}, {name:"2", replied:true}, {name:"3", replied:false}];
const submission_set_1 = new Submission_Filter_Unit_Test(data_set);
const submission_set_2 = new Submission_Filter_Unit_Test(data_set);

console.log("1. Filtering by unreplied by business");
submission_set_1.submissions_unreplied_submissions();
console.log(submission_set_1);
if(submission_set_1.master_submissions.length != 1){console.log("Failure: Filter did not find unreplied submissions.")
}else{ console.log("Pass: Filter successfully found all unreplied submissions.")}

console.log("2. Filtering by replied by business");
submission_set_2.submissions_replied_submissions();
console.log(submission_set_2);
if(submission_set_2.master_submissions.length != 2){console.log("Failure: Filter did not find replied submissions.")
}else{console.log("Pass: Filter successfully found all replied submissions.")}