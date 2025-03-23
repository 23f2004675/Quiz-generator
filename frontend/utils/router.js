import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";

import Admin_dashboard from "../pages/Admin/Admin_dashboard.js";
import Admin_quiz from "../pages/Admin/Admin_quiz.js";
import Admin_summary from "../pages/Admin/Admin_summary.js";
import Admin_user from "../pages/Admin/Admin_user.js";
import Admin_search from "../pages/Admin/Admin_search.js";

import User_dashboard from "../pages/User/User_dashboard.js";
import Scores from "../pages/User/Scores.js";
import StartQuiz from "../pages/User/StartQuiz.js";
import User_summary from "../pages/User/User_summary.js";

import store from "./store.js";
import User_search from "../pages/User/User_search.js";

const About = {
  template: `
  <div>
    <!-- Hero Section -->
    <div class="container text-center mt-5">
      <h1 class="display-4 font-weight-bold">About QuizGen</h1>
      <p class="lead">Empowering learners through interactive quizzes and progress tracking.</p>
    </div>

    <!-- About Section -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <h2>Our Story</h2>
          <p class="text-muted">
            QuizGen was born out of a passion for learning and a desire to make education more engaging and accessible. 
            We believe that everyone has the potential to excel, and our platform is designed to help users track their 
            progress, challenge themselves, and achieve their goals.
          </p>
        </div>
        <div class="col-md-6">
          <h2>Our Mission</h2>
          <p class="text-muted">
            Our mission is to provide a seamless and interactive learning experience that empowers users to grow smarter 
            every day. Through daily reminders, detailed reports, and competitive scoreboards, we aim to make learning 
            fun, rewarding, and effective.
          </p>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="container mt-5">
  <h2 class="text-center mb-4">Meet Our Team</h2>
  <div class="row">
    <!-- Team Member 2 -->
    <div class="col-md-8 mb-4 mx-auto"> <!-- Increased width for the card -->
      <div class="card h-100 shadow">
        <div class="row no-gutters"> <!-- Flexbox row for image and text -->
          <!-- Image on the left -->
          <div class="col-md-4">
            <img src="static/assets/vb.jpg" class="card-img h-100 rounded-left" alt="Vaibhav Soni">
          </div>
          <!-- Text on the right -->
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">Vaibhav Soni</h5>
              <p class="card-text text-muted">Developer</p>
              <p class="card-text">
                Vaibhav is a Full Stack Developer. He is a knowledge seeker who is driven to study, develop, and succeed in Python, DBMS, and Flask. He is a team player who is always ready to help and support his team members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>
  `,
};

const Home = {
  template: `
  <div>
    <!-- Hero Section -->
    <div class="container text-center mt-5">
      <h1 class="display-4 font-weight-bold">Welcome to QuizGen</h1>
      <p class="lead">Track your progress, challenge your limits, and grow smarter every day.</p>
    </div>

    <!-- Cards Section -->
    <div class="container mt-5">
      <div class="row">
        <!-- Card 1: Quiz Score Recording -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-chart-line"></i> Quiz Score Recording</h5>
              <p class="card-text">
                Track your progress with automatically recorded quiz scores.
              </p>
            </div>
          </div>
        </div>
        <!-- Card 6: Admin Management -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-user-cog"></i> Admin Management</h5>
              <p class="card-text">
                Designed with admin features to manage users, subjects, chapter, quizzes, and scores.
              </p>
            </div>
          </div>
        </div>
        <!-- Card 3: Daily Reminders -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-bell"></i> Daily Reminders</h5>
              <p class="card-text">
                Stay on track with daily email reminders to complete quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <!-- Card 4: Monthly Activity Report -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-file-alt"></i> Monthly Activity Report</h5>
              <p class="card-text">
                Receive detailed monthly reports in HTML format via email.
              </p>
            </div>
          </div>
        </div>
        

      
        <!-- Card 5: Score Export as CSV -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-file-csv"></i> Score Export as CSV</h5>
              <p class="card-text">
                Export your quiz results in CSV format for easy analysis.
              </p>
            </div>
          </div>
        </div>

        <!-- Card 6: Detailed Summary Charts -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-chart-pie"></i> Detailed Summary Charts</h5>
              <p class="card-text">
                Visualize your progress with interactive charts and graphs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    path: "/user/search",
    component: User_search,
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
    path: "/admin/search",
    component: Admin_search,
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
