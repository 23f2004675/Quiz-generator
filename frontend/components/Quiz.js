import Question from "./Question.js";

export default {
  props: ["quiz"],
  data() {
    return {
      timeRemaining: 0,
      timer: null,
      userAnswers: [], // Will be initialized in mounted
      currentQuestionIndex: 0,
      isSubmitted: false,
      score: 0,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  watch: {
    userAnswers: {
      handler(newVal) {
        console.log("userAnswers updated:", newVal); // Debugging
      },
      deep: true, // Watch nested changes
    },
  },
  methods: {
    startTimer() {
      const [hours, minutes] = this.quiz.time_duration.split(":");
      this.timeRemaining = parseInt(hours) * 3600 + parseInt(minutes) * 60;

      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.submitQuiz();
        }
      }, 1000);
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    async submitQuiz() {
      clearInterval(this.timer);
      this.score = this.quiz.questions.reduce((acc, question, index) => {
        return (
          acc + (this.userAnswers[index] === question.correct_option ? 1 : 0)
        );
      }, 0);
      this.isSubmitted = true;

      try {
        const response = await fetch("/api/score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": this.$store.state.auth_token,
          },
          body: JSON.stringify({
            quiz_id: this.quiz.id,
            user_id: this.$store.state.user_id,
            score: `${this.score}/${this.quiz.questions.length}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("There was a problem with the post operation:", error);
      }
    },
    handleAnswerSelected(payload) {
      const { index, answer } = payload;
      this.$set(this.userAnswers, index, answer); // Update userAnswers reactively
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.startTimer();
    this.userAnswers = new Array(this.quiz.questions.length).fill(null); // Initialize with null
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  components: {
    Question,
  },
  template: `
    <div class="container mt-5">
      <!-- Timer -->
      <div class="card mb-4">
        <div class="card-header text-white" style="background-color: #56a661;">
          <h4 class="card-title">Time Remaining: {{ formattedTime }} minutes</h4>
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestionIndex < quiz.questions.length" class="card mb-4">
        <Question 
          :question="quiz.questions[currentQuestionIndex]" 
          :index="currentQuestionIndex" 
          :isSubmitted="isSubmitted"
          @answer-selected="handleAnswerSelected" 
        />
        <div class="text-muted small font-italic m-2 p-2">
        Note: If option is selected, then please select again! (total questions: {{this.quiz.questions.length}})
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="text-center mt-3">
        <button class="btn btn-secondary me-2" @click="prevQuestion" v-if="currentQuestionIndex > 0">Back</button>
        <button class="btn btn-primary" @click="nextQuestion" v-if="currentQuestionIndex < quiz.questions.length - 1">Next</button>
        <button class="btn btn-success" @click="submitQuiz" v-if="currentQuestionIndex === quiz.questions.length - 1">Submit</button>
      </div>
      
      <!-- Score & Feedback -->
      <div v-if="isSubmitted" class="mt-4 p-4 bg-light rounded">
  <h4 class="text-center mb-4">Quiz Results</h4>

  <div v-for="(question, index) in quiz.questions" :key="question.id" class="card mt-3 shadow-sm"
    :class="{'border-success': userAnswers[index] === question.correct_option, 'border-danger': userAnswers[index] !== question.correct_option}">
    <div class="card-body">
      <h5 class="card-title">Q{{ index + 1 }}. {{ question.question_text }}</h5>
      <div v-if="userAnswers[index] === question.correct_option" class="alert alert-success mt-2">
        ✔ Correct
        <p class="mb-0">(Selected answer: {{ userAnswers[index] }})</p>
      </div>
      <div v-else class="alert alert-danger mt-2">
        ❌ Incorrect
        <p class="mb-0">Selected Answer: {{ userAnswers[index] }}</p>
        <p class="mb-0">Correct Answer: {{ question.correct_option }}</p>
      </div>
    </div>
  </div>

  <div class="mt-4 p-3 bg-white rounded shadow-sm">
    <p class="mb-1"><strong>Total Questions:</strong> {{ quiz.questions.length }}</p>
    <p class="mb-1"><strong>Correct Answers:</strong> {{ score }}</p>
    <p class="mb-0"><strong>Your Score:</strong> {{ ((score / quiz.questions.length) * 100).toFixed(2) }}%</p>
    <button class="btn btn-secondary" @click="goBack">Back</button>
  </div>
</div>
    </div>

  `,
};
