<template>
  <div class="doors">
    <app-nav></app-nav>
    <h1>Update password for {{ this.username }}</h1>
    <div class="content">
      <ul>
        <li>
          Old password: <input type="password" v-model="password">
        </li>
        <li>
          New password: <input type="password" v-model="password1">
          Confirm new password: <input type="password" v-model="password2">
        </li>
        <li>
          <button v-on:click="passwordCheck(password, password1, password2)">Submit</button>
        </li>
      </ul>
   </div>
   <div v-if="this.resp != ''">
     {{ this.resp.Message }}
   </div>
  </div>
</template>

<script>
import { getVerifyUser, updatePass } from '../../../utils/api'
import AppNav from '../AppNav'
export default {
  name: 'userupdate',
  data () {
    return {
      // user: this.auth.user().username,
      keycode: '',
      username: '',
      status: 'Pending',
      verified: {},
      password: '',
      resp: '',
      password1: '',
      password2: ''
    }
  },
  components: {
    AppNav
  },
  methods: {
    passwordCheck (pass, pass1, pass2) {
      getVerifyUser(this.username, {'password': pass}).then((ret) => {
        this.verified = ret
        if (this.verified.status === 'passed') {
          if (pass1 === pass2) {
            updatePass({'username': this.username, 'password': pass1})
            this.resp = {'Status': 'Success', 'Message': 'Password updated'}
          } else {
            this.resp = {'Status': 'Error', 'Message': 'Passwords do not match, please re-enter new password'}
          }
        } else {
          this.resp = {'Status': 'Error', 'Message': 'Password check failed'}
        }
        this.password1 = ''
        this.password2 = ''
        this.password = ''
        // console.log(this.resp)
      })
    }
  },
  mounted () {
    this.username = this.$auth.user().username
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

div.col-sm-3 {
  text-align: left;
    padding-top: 40px;
}

div.col-lg-7 {
  clear: both;;
  margin: 15px;
}

div.col-lg-3 {
  clear: right;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b283;
}
</style>
