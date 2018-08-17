//following block for jwt (see https://github.com/websanova/vue-auth/blob/master/docs/StepByStepGuide.md)

import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

Vue.use(VueAxios, axios)

const BASE_URL = 'https://skibo.duckdns.org/api';
Vue.axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

// access axios with Vue or use the 'this' reference in components
// Vue.axios.post(...).then(res => {
//     console.log('RES', res);
// });

export { postStartData, getSites, getSensorDataSite, getSensorDataAll, getSensorDataTypes, postCustomData, getUser, getVerifyUser, putUserData };

function simple_get(url) {
  return axios.get(url)
  .then(function (response) {
      return response.data
  });
}

function getSensorDataTypes() {
  const url = BASE_URL+'/data/values/types'
  return simple_get(url)
}

function getSensorDataSite(site) {
  // console.log(site)
  const url = BASE_URL+'/data/values/site/'+site
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

function postStartData(payload) {
  // console.log(payload)
  const url = BASE_URL+'/data/values'
  return axios.post(url, payload);
}

function getUser(user) {
  const url = BASE_URL+'/user/data/'+user
  return simple_get(url)
}

function getVerifyUser(user, payload) {
  const url = BASE_URL+'/auth/user/'
  return axios.post(url+user, payload)
  .then(function (response) {
      return response.data
  });
}

function putUserData(payload, route) {
  const url = BASE_URL+'/user/'
  return axios.put(url+route, payload);
}
// function delDoor(door) {
//   const url = BASE_URL+'/door/'
//   // console.log(user)
//   return axios.delete(url+door)
//   .then(function (response) {
//       return response.data
//   });
// }
