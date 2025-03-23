import Quiz from "../../components/Quiz.js";

export default {
  template: `
    <div class="container mt-5">
      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading quiz...</p>
      </div>

      <!-- Quiz Details -->
      <div v-else-if="quiz">
      <div v-if="!start">
        <div class="card">
          <div class="card-header text-white" style="background-color: rgb(0,0,0); ">
            <h2 class="card-title">Quiz Details</h2>
          </div>
          <div class="card-body">
            <h4 class="card-text">Quiz ID: {{ quiz.id }}</h4>
            <p class="card-text"><strong>Time Duration:</strong> {{ quiz.time_duration }} (HH:MM) </p>
            <p class="card-text"><strong>Remarks:</strong> {{ quiz.remarks }}</p>
            <hr>
            <h4 class="mb-3">Do you want to start the quiz?</h4>
            <div class="d-grid gap-2 d-md-block">
              <button class="btn btn-success me-2" @click="startQuiz">Start Quiz</button>
              <button class="btn btn-secondary" @click="goBack">Back</button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-else class="alert alert-danger mt-4 text-center">
        Questions of this Quiz is being updated or deleted by Admin.
        <div>
        As we can see, the number of questions are 0.
        </div>
        <div>
        Please be patient, Meanwhile start practising other Quizzes. Thank you.
        </div>
      </div>

      <!-- Quiz Component -->
      <Quiz v-if="start" :quiz="quiz" />
    </div>
  `,
  components: {
    Quiz, // Register the Quiz component
  },
  data() {
    return {
      start: false, // Control whether to show the Quiz component
      //   started
      quiz: null, // Store the fetched quiz data
      loading: true, // Track loading state
    };
  },
  methods: {
    startQuiz() {
      this.start = true; // Show the Quiz component
    },
    goBack() {
      this.$router.go(-1); // Navigate back to the previous page
    },
  },
  async mounted() {
    try {
      const quizId = this.$route.params.quiz_id; // Get quiz_id from route params
      const response = await fetch(`/api/quiz/${quizId}`, {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      }); // Fetch quiz data
      if (!response.ok) {
        throw new Error("Failed to fetch quiz data");
      }
      const data = await response.json(); // Parse JSON response
      this.quiz = data; // Store quiz data
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      this.quiz = null; // Handle error
    } finally {
      this.loading = false; // Set loading to false after the API call
    }
  },
};
