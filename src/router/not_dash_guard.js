// this prevents a signed-in user from accessing home or sign in page
import { store } from '../store'
import { firebase } from '@firebase/app';
import { isNullOrUndefined } from 'util';

export default (to, from, next) => {
    
console.log('userId: ' + localStorage.getItem('userId'))
const key = localStorage.getItem('userId')
 
    if (!(key>=0)) {
        next()
    }
    else if (key >= 0 && (to.name == 'Home' || to.name == 'sign_in') )
    {
        next('artist_dashboard')
    }
    else
    {
        next()
    }
}