export default {
  template: `
      <div>
          <router-link to='/'>Home</router-link>
          <router-link v-if="!$store.state.loggedIn" to='/About_us'>About us</router-link>
          <router-link v-if="!$store.state.loggedIn" to='/Login'>Login</router-link>
          <router-link v-if="!$store.state.loggedIn" to='/Register'>Register</router-link>
  
          <router-link v-if="$store.state.loggedIn && $store.state.role=='admin' " to='/admin/dashboard'>Dashboard</router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role=='admin' " to='/admin/quiz'>Quiz</router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role=='admin' " to='/admin/summary'>Summary</router-link>
          <input v-if="$store.state.loggedIn && $store.state.role=='admin' " type="text" placeholder="Search" /> 
          <p v-if="$store.state.loggedIn && $store.state.role=='admin' ">Welcome Admin</p>
  
          <router-link v-if="$store.state.loggedIn && $store.state.role=='user' " to='/user/dashboard'>Dashboard</router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role=='user' " to='/user/scores'>Scores</router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role=='user' " to='user/summary'>Summary</router-link>
          <input v-if="$store.state.loggedIn && $store.state.role=='user' " type="text" placeholder="Search" /> 
          <p v-if="$store.state.loggedIn && $store.state.role=='user' ">Welcome User</p>
  
          <button v-if="$store.state.loggedIn" class="btn btn-secondary" @click="handleLogout">Logout</button>
          
          
      </div>
      `,
  methods: {
    handleLogout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
