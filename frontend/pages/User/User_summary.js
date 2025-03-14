export default {
  template: `
  <div class="container mt-4">
  <h3>User Summary</h3>

  <!-- Display Bar Chart -->
  <div v-if="chart_url.bar_chart_url" class="chart-container">
    <h4>Number of Quizzes by Subject</h4>
    <img :src="getFullUrl(chart_url.bar_chart_url)" alt="Number of Quizzes by Subject" style = "max-width: 70%; height: auto;"/>
  </div>

  <!-- Display Pie Chart -->
  <div v-if="chart_url.pie_chart_url" class="chart-container">
    <h4>Quizzes Attempted by Month</h4>
    <img :src="getFullUrl(chart_url.pie_chart_url)" alt="Quizzes Attempted by Month" style = "max-width: 70%; height: auto;" />
  </div>

  <!-- Display Error Message if Charts Fail to Load -->
  <div v-if="!chart_url.bar_chart_url && !chart_url.pie_chart_url" class="alert alert-warning">
    Failed to load charts. Please try again later.
  </div>
</div>
        `,
  data() {
    return {
      chart_url: {
        bar_chart_url: null,
        pie_chart_url: null,
      },
    };
  },
  methods: {
    getFullUrl(relativeUrl) {
      const cleanUrl = relativeUrl.replace(/^frontend\//, "");
      return `${location.origin}/static/${cleanUrl}`;
    },
  },
  async mounted() {
    const res = await fetch(
      location.origin + "/api/chart/" + this.$store.state.user_id,
      {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      }
    );
    if (res.ok) {
      this.chart_url = await res.json();
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
