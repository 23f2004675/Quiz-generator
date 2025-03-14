import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";

import Admin_dashboard from "../pages/Admin/Admin_dashboard.js";
import Admin_quiz from "../pages/Admin/Admin_quiz.js";
import Admin_summary from "../pages/Admin/Admin_summary.js";
import Admin_user from "../pages/Admin/Admin_user.js";

import User_dashboard from "../pages/User/User_dashboard.js";
import Scores from "../pages/User/Scores.js";
import StartQuiz from "../pages/User/StartQuiz.js";
import User_summary from "../pages/User/User_summary.js";

import store from "./store.js";

const About = {
  template: `
  <div class="container mt-5">
    <h2>About Us</h2>
    <p>
      This is a quiz generator application that allows users to create and manage quizzes efficiently.
    </p>
  </div>
  `,
};

const Home = {
  template: `
  <div class="container text-center mt-5">
    <h1>Welcome to the Quiz Generator</h1>
    <p>Generate, edit, and manage quizzes with ease.</p>
  </div>
  `,
};

const routes = [
  { path: "/", component: Home },
  { path: "/About_us", component: About },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  {
    path: "/user/dashboard",
    component: User_dashboard,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/user/scores",
    component: Scores,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/Quiz/:quiz_id",
    component: StartQuiz,
    props: true,
    meta: { requiresLogin: true },
  },
  {
    path: "/user/summary",
    component: User_summary,
    meta: { requiresLogin: true, role: "user" },
  },
  {
    path: "/admin/dashboard",
    component: Admin_dashboard,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin/quiz",
    component: Admin_quiz,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin/user",
    component: Admin_user,
    meta: { requiresLogin: true, role: "admin" },
  },
  {
    path: "/admin/summary",
    component: Admin_summary,
    meta: { requiresLogin: true, role: "admin" },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)) {
    if (!store.state.loggedIn) {
      next({ path: "/login" });
    } else if (to.meta.role && to.meta.role != store.state.role) {
      console.log(store.state.role, to.meta.role);
      alert("role not allowed");
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
