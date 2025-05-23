export default {
  template: `
  <div class="container mt-4">
  <h3 class="mb-4">Quiz Scores</h3>
  <table class="table table-bordered table-striped">
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Chapter Name</th>
        <th>No. of Questions</th>
        <th>Date</th>
        <th>Score</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(score,index) in scores" :key="score.id">
        <td>{{ index+1 }}</td>
        <td>{{ score.quiz_name }}</td>
        <td>{{ score.no_of_questions }}</td>
        <td>{{ formatDate(score.timestamp) }}</td>
        <td>{{ score.score }}</td>
        <td>{{ formatScore(score.score) }}%</td>
      </tr>
    </tbody>
  </table>
  <div v-if="errorMessage" class="alert alert-danger">
  {{ errorMessage }}
  </div>
  <div class="text-center">
    <button class="btn btn-primary btn-lg my-3" @click="downloadCSV">
    <i class="fas fa-download"></i> Download Scores as CSV
    </button>
  </div>

</div>
      `,
  data() {
    return {
      errorMessage: null,
      scores: [],
    };
  },
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatScore(score) {
      return ((score.split("/")[0] / score.split("/")[1]) * 100).toFixed(2);
    },
    async downloadCSV() {
      const res = await fetch(
        // location.origin + "/api/score/" + this.$store.state.user_id,
        location.origin + "/create_csv/user/" + this.$store.state.user_id,
        {
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        const task_id = await res.json();
        console.log(task_id.message);
        const interval = setInterval(async () => {
          const res = await fetch(
            location.origin + "/get_csv/" + task_id.message
          );
          if (res.ok) {
            console.log("CSV file is ready");
            clearInterval(interval);
            window.open(location.origin + "/get_csv/" + task_id.message);
          }
        }, 500);
        // await fetch(location.origin + "/get_csv/" + task_id.message);
      } else {
        console.error("Failed to fetch quizzes");
      }
    },
  },
  async mounted() {
    const res = await fetch(
      location.origin + "/api/score/" + this.$store.state.user_id,
      {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      }
    );
    if (res.ok) {
      this.scores = await res.json();
      console.log(this.scores);
    } else if (res.status === 404) {
      this.errorMessage = "No scores found";
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
