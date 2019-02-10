// this prevents a signed-in user from accessing home or sign in page
import { store } from '../store'
import { firebase } from '@firebase/app';
import { isNullOrUndefined } from 'util';

export default (to, from, next) => {
    
console.log('userId: ' + localStorage.getItem('userId'))
const key = localStorage.getItem('userId')
/*console.log('user:')
console.log(store.getters.user)*/
 
    if (!(key>=0)) {
        /*console.log('pages, not signed in')
        console.log(from.name)
        console.log(to.name)*/
        if (from.name != 'Home' && from.name != null && to.name == 'sign_in')
        {
            //console.log('need to refresh page')
            // force refresh, or else signin page has dash components
            location.reload()
            next()
        }
        else
        {
            next()
        }
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