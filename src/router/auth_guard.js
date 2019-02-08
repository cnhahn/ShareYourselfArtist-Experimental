// this module exports a function that checks if the user is signed in and routes accordingly
import { store } from '../store'
import { firebase } from '@firebase/app';
import { isNullOrUndefined } from 'util';


console.log('userId: ' + localStorage.getItem('userId'))
export default (to, from, next) => {  
    console.log("why")
    
console.log('userId: ' + localStorage.getItem('userId'))
const key = localStorage.getItem('userId')
    if (!(key>=0)) {
        console.log("why")
        next('sign_in')
    }
    else {
        // if we have a user signed in continu with what you want to do
        next()
    } 
}