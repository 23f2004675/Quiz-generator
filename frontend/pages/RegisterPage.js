export default {
  template: `
        <div>
        <h1>Register Page </h1>
        <input type="email" placeholder="email" v-model="email"/>
        <input type="password" placeholder="password" v-model="password"/>
        <input type="text" placeholder="Full name" v-model="fullname"/>
        <input type="text" placeholder="Qualification" v-model="qualification"/>
        <input type="date" placeholder="Date of birth?" v-model="dob"/>
        <button @click=submitLogin> Register </button>
        <a href="/#/Login">Existing user?</a>
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
