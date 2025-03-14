export default {
  template: `
  <div>
  <h3 class="my-5 text-center"><u>Upcoming Quizzes</u></h3>
  <table class="table table-bordered table-striped">
    <thead class="thead-dark">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">No. of Questions</th>
        <th scope="col">Date</th>
        <th scope="col">Duration (hh:mm)</th>
        <th scope="col">Actions</th>
        <th scope="col">Remarks</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(quiz,index) in quizzes" :key="quiz.id">
        <td>{{ index+1 }}</td>
        <td>{{ quiz.no_of_questions }}</td>
        <td>{{ quiz.date_of_quiz }}</td>
        <td>{{ quiz.time_duration }}</td>
        <td>
          <button @click="viewQuiz(quiz)" class="btn btn-info btn-sm mr-1">View</button>
          <button @click="Start(quiz)" class="btn btn-success btn-sm">Start</button>
        </td>
        <td>{{ quiz.remarks }}</td>
      </tr>
    </tbody>
  </table>

  <!-- Quiz Details Modal -->
  <div v-if="selectedQuiz" class="modal" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Quiz Details</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p><strong>ID:</strong> {{ selectedQuiz.id }}</p>
          <p><strong>Chapter Name:</strong> {{ selectedQuiz.chapter_name }}</p>
          <p><strong>Subject Name:</strong> {{ selectedQuiz.subject_name }}</p>
          <p><strong>Date:</strong> {{ selectedQuiz.date_of_quiz }}</p>
          <p><strong>Duration:</strong> {{ selectedQuiz.time_duration }}</p>
          <p><strong>Remarks:</strong> {{ selectedQuiz.remarks }}</p>
          <p><strong>No. of Questions:</strong> {{ selectedQuiz.no_of_questions }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
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
