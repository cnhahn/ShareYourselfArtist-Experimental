// this module exports a function that checks if the user is signed in and routes accordingly
import { isNullOrUndefined } from 'util'

export default (to, from, next) => {
  const key = localStorage.getItem('userId')
  if (!(key >= 0)) {
    next('sign_in')
  } else {
        // if we have a user signed in continu with what you want to do
    next()
  }
}
