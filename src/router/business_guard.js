// this module exports a function that checks if the user is an artist and restricts accordingly
import { store } from '../store'
import { firebase } from '@firebase/app'
import { isNullOrUndefined } from 'util'

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
    // for both business and business_member
    else if ((key === 'business' || key === 'business_member') && loginKey >= 0) {
        next()
    }
    // otherwise, route them to page not found page
    else if ((key !== 'business' && loginKey >= 0)){
        console.log('invalid role, this returned: ' + localStorage.getItem('role'))
        next('page_not_found')
    } 
    else{
        next()
    }
}