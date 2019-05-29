// this module exports a function that checks if the user is an artist and restricts accordingly
import  store  from '../store'
import { firebase } from '@firebase/app'
import { isNullOrUndefined } from 'util'
import router from '../router'

export default (to, from, next) => 
{  
    console.log('role: ' + localStorage.getItem('role'))

    const loginKey = localStorage.getItem('userId')
    const key = localStorage.getItem('role')


    // if the role of the user is an business, continue
    if(!(loginKey>=0))
    {
        next('sign_in')
    }
    // otherwise, route them to page not found page
    else if ((key !== 'artist' && loginKey >= 0)){
        router.push('/sign_in')
    } 
    else{
        next()
    }
}