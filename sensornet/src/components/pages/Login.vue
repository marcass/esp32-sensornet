<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>User name</label>
     <input required v-model="username" type="text" placeholder="Snoopy"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
import {LoginRoutine} from '../../../utils/api'
export default {
  data () {
    return {
      // context: 'login context',
      token: '',
      refresh_token: '',
      role: '',
      data: {
        body: {
          username: '',
          password: ''
        },
        rememberMe: true,
        fetchUser: false
        // redirect: '/users'
      },

      error: null
    }
  },
  methods: {
   login: function () {
     const { username, password } = this
     LoginRoutine({ username, password }).then(() => {
       this.$router.push('/')
     })
   }
  }
</script>
// https://blog.sqreen.com/authentication-best-practices-vue/
// https://itnext.io/managing-and-refreshing-auth0-tokens-in-a-vuejs-application-65eb29c309bc
