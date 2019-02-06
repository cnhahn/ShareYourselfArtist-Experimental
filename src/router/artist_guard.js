// this module exports a function that checks if the user is an artist and restricts accordingly
import { store } from '../store'
import { firebase } from '@firebase/app';
import { isNullOrUndefined } from 'util';

console.log('userId: ' + localStorage.getItem('userId'))
console.log('role: ' + localStorage.getItem('role'))

//localStorage.setItem('role', this.$store.state.signed_in_user.role)


export default (to, from, next) => {  
console.log('role: ' + localStorage.getItem('role'))
    const key = localStorage.getItem('role')
    
    // if the user is an artist, continue with what you want to do
    if (key === "artist") {
        next()
    }
    // otherwise, route them to page not found page
    else {
        next('page_not_found')
    } 
}