const store = new Vuex.Store({
  state: {
    user_id: null,
    email: null,
    fullname: null,
    qualification: null,
    auth_token: null,
    role: null,
    loggedIn: null,
    dob: null,
  },
  mutations: {
    setUser(state) {
      try {
        if (JSON.parse(localStorage.getItem("user"))) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user.role == "admin") {
            state.user_id = user.id;
            state.auth_token = user.token;
            state.role = user.role;
            state.loggedIn = true;
          }
          state.user_id = user.id;
          state.dob = user.dob;
          state.email = user.email;
          state.fullname = user.fullname;
          state.qualification = user.qualification;
          state.auth_token = user.token;
          state.role = user.role;
          state.loggedIn = true;
        }
      } catch {
        console.log("we are not logged in");
      }
    },
    logout(state) {
      state.auth_token = null;
      state.roll = null;
      state.loggedIn = null;
      state.user_id = null;
      state.dob = null;
      state.email = null;
      state.fullname = null;
      state.qualification = null;
      localStorage.removeItem("user");
    },
  },
  actions: {},
});

export default store;
