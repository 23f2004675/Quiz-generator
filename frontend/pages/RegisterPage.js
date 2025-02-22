export default {
  template: `
  <div class="container mt-5">
  <h1 class="text-center">Register Page</h1>
  <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-4">
          <form @submit.prevent="submitRegister" class="mt-4">
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

              <div class="form-group">
                  <label for="fullname">Full Name</label>
                  <input
                      type="text"
                      id="fullname"
                      class="form-control"
                      placeholder="Enter your full name"
                      v-model="fullname"
                      required
                  />
              </div>

              <div class="form-group">
                  <label for="qualification">Qualification</label>
                  <input
                      type="text"
                      id="qualification"
                      class="form-control"
                      placeholder="Enter your qualification"
                      v-model="qualification"
                      required
                  />
              </div>

              <div class="form-group">
                  <label for="dob">Date of Birth</label>
                  <input
                      type="date"
                      id="dob"
                      class="form-control"
                      v-model="dob"
                      required
                  />
              </div>

              <button type="submit" class="btn btn-primary btn-block mt-4">
                  Register
              </button>
          </form>

          <p class="text-center mt-3">
              Already have an account? <a href="/#/Login">Login</a>
          </p>
      </div>
  </div>
</div>

        `,
  data() {
    return {
      email: null,
      password: null,
      fullname: null,
      qualification: null,
      dob: null,
    };
  },
  methods: {
    async submitLogin() {
      const res = await fetch(location.origin + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          fullname: this.fullname,
          qualification: this.qualification,
          dob: this.dob,
        }),
      });
      if (res.ok) {
        console.log("we are registered");
        alert("we are registered");
      } else {
        console.error("Failed to registered");
      }
    },
  },
};
