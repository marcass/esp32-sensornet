//following block for jwt (see https://github.com/websanova/vue-auth/blob/master/docs/StepByStepGuide.md)

import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

Vue.use(VueAxios, axios)

const BASE_URL = 'https://skibo.duckdns.org/api';
const AUTH_URL = 'https://skibo.duckdns.org/auth'
Vue.axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

// access axios with Vue or use the 'this' reference in components
// Vue.axios.post(...).then(res => {
//     console.log('RES', res);
// });

export { getSensorTypes, postStartData, postCustomAx,
   getSites, getSensorDataSite, getSensorDataAll, getSensorDataTypes,
   postCustomData, getVerifyUser, updatePass, getSensorDataSiteMeas, Login };

// can decode with https://www.npmjs.com/package/vue-jwt-decode
// then get the expiration and test for a time near that so that a request can be made for a refresh token
// this can then be sent for a new token to api
function Login () {
 const LoginRoutine = user => new Promise ((resolve, reject) => {
   axios.post(AUTH_URL, user)
     .then(resp => {
       const token = resp.data.token
       localStorage.setItem('jwt-token', token) // store the token in localstorage
       localStorage.setItem('user', user.username)
       resolve(resp)
     })
   .catch(err => {
     localStorage.removeItem('jwt-token') // if the request fails, remove any possible user token if possible
     localStorage.removeItem('user')
     reject(err)
   })
 })
}

function simple_get(url) {
  return axios.get(url)
  .then(function (response) {
      return response.data
  });
}

function getSensorTypes() {
  const url = BASE_URL+'/data/values/types'
  return simple_get(url)
}

function getSensorDataTypes(type) {
  const url = BASE_URL+'/data/values/type/'+type
  return simple_get(url)
}

function getSensorDataSite(site) {
  // console.log(site)
  const url = BASE_URL+'/data/values/site/'+site
  return simple_get(url)
}

function getSensorDataSiteMeas(site, meas) {
  // console.log(site)
  const url = BASE_URL+'/data/values/site/'+meas+'/'+site
  return simple_get(url)
}

function getSensorDataAll() {
  const url = BASE_URL+'/data/values/all'
  return simple_get(url)
}

function getSites() {
  const url = BASE_URL+'/data/values/sites'
  return simple_get(url)
}

function postCustomData(payload) {
  // console.log(payload)
  const url = BASE_URL+'/data/values/custom'
  return axios.post(url, payload);
}

function postCustomAx(payload) {
  // console.log(payload)
  const url = BASE_URL+'/data/values/customAx'
  return axios.post(url, payload);
}

function postStartData(payload) {
  // console.log(payload)
  const url = BASE_URL+'/data/values'
  return axios.post(url, payload);
}

function getVerifyUser(user, payload) {
  const url = BASE_URL+'/auth/user/'
  return axios.post(url+user, payload)
  .then(function (response) {
      return response.data
  });
}

function updatePass(payload) {
  const url = BASE_URL+'/auth/user/password'
  return axios.put(url, payload);
}


// function delDoor(door) {
//   const url = BASE_URL+'/door/'
//   // console.log(user)
//   return axios.delete(url+door)
//   .then(function (response) {
//       return response.data
//   });
// }
