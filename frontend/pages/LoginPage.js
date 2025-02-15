export default {
  template: `
        <div>
        <h1>Login Page </h1>
        <input type="email" placeholder="email" v-model="email"/>
        <input type="password" placeholder="password" v-model="password"/>
        <button @click=submitLogin> Login </button>
        <a href="/#/Register">Create new User?</a>
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
