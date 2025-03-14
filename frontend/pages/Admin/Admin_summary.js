export default {
  template: `
  <div class="container mt-4">
  <h3>Admin Summary</h3>

  <!-- Top Scores Chart -->
  <div v-if="chart_urls.top_scores_chart_url" class="chart-container">
    <h4>Subject-wise Top Scores</h4>
    <img :src="getStaticUrl(chart_urls.top_scores_chart_url)" alt="Subject-wise Top Scores" />
  </div>

  <!-- User Attempts Chart -->
  <div v-if="chart_urls.user_attempts_chart_url" class="chart-container">
    <h4>Subject-wise User Attempts</h4>
    <img :src="getStaticUrl(chart_urls.user_attempts_chart_url)" alt="Subject-wise User Attempts" />
  </div>

  <!-- Display Error Message if Charts Fail to Load -->
  <div v-if="!chart_urls.top_scores_chart_url && !chart_urls.user_attempts_chart_url" class="alert alert-warning">
    Failed to load charts. Please try again later.
  </div>
</div>
      `,
  data() {
    return {
      chart_urls: {
        top_scores_chart_url: null,
        user_attempts_chart_url: null,
      },
    };
  },
  methods: {
    // Helper method to construct the static URL for the chart images
    getStaticUrl(relativeUrl) {
      const cleanUrl = relativeUrl.replace(/^frontend\//, "");
      return `${location.origin}/static/${cleanUrl}`;
    },
  },
  async mounted() {
    try {
      // Fetch chart URLs from the backend
      const res = await fetch(location.origin + "/api/admin/summary", {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        this.chart_urls = await res.json();
      } else {
        console.error("Failed to fetch admin summary charts");
      }
    } catch (error) {
      console.error("Error fetching admin summary charts:", error);
    }
  },
};
