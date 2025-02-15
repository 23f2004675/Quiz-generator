export default {
  template: `
        <div>
            <h1>Welcome {{$store.state.fullname}}</h1>
            <h3>Upcoming Quizzes</h3>
            <table style="border: 1px solid black; border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>No. of Questions</th>
                  <th>Date</th>
                  <th>Duration (hh:mm)</th>
                  <th>Actions</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quiz in quizzes" :key="quiz.id">
                  <td>{{ quiz.id }}</td>
                  <td>{{quiz.no_of_questions}}</td>
                  <td>{{ quiz.date_of_quiz }}</td>
                  <td>{{ quiz.time_duration }}</td>
                  <td><button @click="viewQuiz(quiz)">View</button> <button @click="Start(quiz)">Start</button></td>
                  <td>{{ quiz.remarks }}</td>
                </tr>
              </tbody>
            </table>
  
            <div v-if="selectedQuiz" class="modal-overlay">
              <div class="modal-content">
                  <h3>Quiz Details</h3>
                  <p><strong>ID:</strong> {{ selectedQuiz.id }}</p>
                  <p><strong>Chapter Name:</strong> {{ selectedQuiz.chapter_name }}</p>
                  <p><strong>Subject Name:</strong> {{ selectedQuiz.subject_name }}</p>
                  <p><strong>Date:</strong> {{ selectedQuiz.date_of_quiz }}</p>
                  <p><strong>Duration:</strong> {{ selectedQuiz.time_duration }}</p>
                  <p><strong>Remarks:</strong> {{ selectedQuiz.remarks }}</p>
                  <p><strong>No. of Questions:</strong> {{ selectedQuiz.no_of_questions }}</p>
                  <button @click="closeModal">Close</button>
              </div>
          </div>
      </div>
      `,
  data() {
    return {
      quizzes: [],
      selectedQuiz: null,
    };
  },
  methods: {
    Start(quiz) {
      this.$router.push("/Quiz/" + quiz.id);
    },
    viewQuiz(quiz) {
      this.selectedQuiz = quiz;
    },
    closeModal() {
      this.selectedQuiz = null;
    },
  },
  async mounted() {
    const res = await fetch(location.origin + "/api/quizzes/today_or_future", {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      this.quizzes = await res.json();
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
