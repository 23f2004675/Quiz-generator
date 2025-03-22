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
              <li >
              <button class="btn btn-primary ml-2" @click="downloadCSV">Download Report</button>
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
    async downloadCSV() {
      const res = await fetch(
        // location.origin + "/api/score/" + this.$store.state.user_id,
        location.origin + "/create_csv/admin",
        {
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        const task_id = await res.json();
        console.log(task_id.message);
        const interval = setInterval(async () => {
          const res = await fetch(
            location.origin + "/get_csv/" + task_id.message
          );
          if (res.ok) {
            console.log("CSV file is ready");
            clearInterval(interval);
            window.open(location.origin + "/get_csv/" + task_id.message);
          }
        }, 500);
        // await fetch(location.origin + "/get_csv/" + task_id.message);
      } else {
        console.error("Failed to fetch quizzes");
      }
    },
  },
};
