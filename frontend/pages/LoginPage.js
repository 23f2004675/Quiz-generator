export default {
  template: `
  <div class="container mt-5">
    <h1 class="text-center">Login Page</h1>
    <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
            <form @submit.prevent="submitLogin" class="mt-4">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        class="form-control"
                        placeholder="Enter your email"
                        v-model="email"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        class="form-control"
                        placeholder="Enter your password"
                        v-model="password"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-primary btn-block mt-4">
                    Login
                </button>
            </form>

            <p class="text-center mt-3">
                Don't have an account? <a href="/#/Register">Create new User</a>
            </p>
          </div>
       </div>
    </div>
        `,
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async submitLogin() {
      const res = await fetch(location.origin + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      if (res.ok) {
        console.log("we are logged in");
        const data = await res.json();
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));

        this.$store.commit("setUser");
        if (this.$store.state.role == "admin") {
          this.$router.push("/admin/dashboard");
        } else {
          this.$router.push("/user/dashboard");
        }
      } else {
        console.error("Failed to login");
      }
    },
  },
};
