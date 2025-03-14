import Navbar from "./components/Navbar.js";
import Quiz from "./components/Quiz.js";
import router from "./utils/router.js";
import store from "./utils/store.js";
import Question from "./components/Question.js";

const app = new Vue({
  el: "#app",
  template: `
    <div>
        <Navbar />
        <router-view></router-view>
    </div>
    `,
  components: {
    Navbar,
    // Question,
    // Quiz,
  },
  router,
  store,
});
