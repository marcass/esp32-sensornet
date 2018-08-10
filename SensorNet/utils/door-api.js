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

export { getSensorDataTypes, postCustomData };

function simple_get(url) {
  return axios.get(url)
  .then(function (response) {
      return response.data
  });
}

function getSensorDataTypes() {
  const url = BASE_URL+'/data'
  return simple_get(url)
}

function postCustomData(payload) {
  const url = BASE_URL+'/data/values'
  return axios.post(url, payload);
}

// function delDoor(door) {
//   const url = BASE_URL+'/door/'
//   // console.log(user)
//   return axios.delete(url+door)
//   .then(function (response) {
//       return response.data
//   });
}
