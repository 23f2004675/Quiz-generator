export default {
  template: `
    <div class="container mt-5">
      <h1 class="text-center">Login Page</h1>
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Login Form -->
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

          <!-- Signup Link -->
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
      errorMessage: null, // To store error messages
    };
  },
  methods: {
    async submitLogin() {
      try {
        const res = await fetch(location.origin + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        if (res.ok) {
          console.log("We are logged in");
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
          // Handle specific error cases
          const errorData = await res.json();
          if (res.status === 401 || res.status === 404) {
            this.errorMessage = errorData.message;
          } else {
            this.errorMessage = "An error occurred. Please try again later.";
          }
        }
      } catch (error) {
        console.error("Failed to login:", error);
        this.errorMessage =
          "An unexpected error occurred. Please try again later.";
      }
    },
  },
};
