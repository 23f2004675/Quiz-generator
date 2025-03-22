export default {
  template: `
    <nav class="navbar navbar-expand-lg"  style="background-color: #4e5283; padding: 24px;">
      <div class="container">
        <router-link to='/' class="navbar-brand text-warning f-2">Home</router-link>
        
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <li v-if="!$store.state.loggedIn" class="nav-item">
              <router-link to='/About_us' class="nav-link text-light">About Us</router-link>
            </li>
            <li v-if="!$store.state.loggedIn" class="nav-item">
              <router-link to='/Login' class="nav-link text-light">Login</router-link>
            </li>
            <li v-if="!$store.state.loggedIn" class="nav-item">
              <router-link to='/Register' class="nav-link text-light">Register</router-link>
            </li>

            <!-- Admin Navigation -->
            <template v-if="$store.state.loggedIn && $store.state.role=='admin'">
              <li class="nav-item">
                <router-link to='/admin/dashboard' class="nav-link text-warning">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/admin/quiz' class="nav-link text-warning">Quiz</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/admin/user' class="nav-link text-warning">Users</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/admin/search' class="nav-link text-warning">Search</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/admin/summary' class="nav-link text-warning">Summary</router-link>
              </li>
              <li class="nav-item">
                <p class="nav-link text-light">Welcome Admin</p>
              </li>
            </template>

            <!-- User Navigation -->
            <template v-if="$store.state.loggedIn && $store.state.role=='user'">
              <li class="nav-item">
                <router-link to='/user/dashboard' class="nav-link text-warning">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/user/scores' class="nav-link text-warning">Scores</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/user/search' class="nav-link text-warning">Search</router-link>
              </li>
              <li class="nav-item">
                <router-link to='/user/summary' class="nav-link text-warning">Summary</router-link>
              </li>
              <li class="nav-item">
                <p class="nav-link text-light">Welcome {{$store.state.fullname}}</p>
              </li>
            </template>

            <li v-if="$store.state.loggedIn" class="nav-item">
              <button class="btn btn-danger ml-2" @click="handleLogout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  methods: {
    handleLogout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
