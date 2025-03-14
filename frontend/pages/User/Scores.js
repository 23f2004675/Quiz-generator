export default {
  template: `
  <div class="container mt-4">
  <h3 class="mb-4">Quiz Scores</h3>
  <table class="table table-bordered table-striped">
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Quiz Name</th>
        <th>No. of Questions</th>
        <th>Date</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(score,index) in scores" :key="score.id">
        <td>{{ index+1 }}</td>
        <td>{{ score.quiz_name }}</td>
        <td>{{ score.no_of_questions }}</td>
        <td>{{ formatDate(score.timestamp) }}</td>
        <td>{{ score.score }}</td>
      </tr>
    </tbody>
  </table>
</div>
      `,
  data() {
    return {
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
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
