export default {
  template: `
      <div>
      <h3>Quiz Scores</h3>
            <table style="border: 1px solid black; border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>No. of Questions</th>
                  <th>Date & Time</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="score in scores" :key="score.id">
                  <td>{{ score.id }}</td>
                  <td>{{score.no_of_questions}}</td>
                  <td>{{ score.timestamp }}</td>
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
  methods: {},
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
      console.log(this.quizzes);
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
