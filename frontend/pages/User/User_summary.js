export default {
  template: `
    <div class="container mt-4">
      <h3>User Summary</h3>


      <div v-if="loading" class="text-center">
        <p>Your summary is being process by out top level Analyst. Please wait: {{ countdown }}</p>
      </div>

      
      <div v-if="!loading && chart_url.bar_chart_url" class="chart-container mb-4">
        <h4 class="text-center mb-3">Number of Quizzes by Subject</h4>
        <img 
          :src="getFullUrl(chart_url.bar_chart_url)" 
          alt="Number of Quizzes by Subject" 
          class="chart-image img-fluid rounded shadow"
        />
      </div>

  
      <div v-if="!loading && !chart_url.bar_chart_url" class="alert alert-warning mb-4">
        <strong>Warning:</strong> Bar chart cannot be created as no quizzes have been created.
      </div>

      
      <div v-if="!loading && chart_url.pie_chart_url" class="chart-container mb-4">
        <h4 class="text-center mb-3">Quizzes Attempted by Month</h4>
        <img 
          :src="getFullUrl(chart_url.pie_chart_url)" 
          alt="Quizzes Attempted by Month" 
          class="chart-image img-fluid rounded shadow"
        />
      </div>

  
      <div v-if="!loading && !chart_url.pie_chart_url" class="alert alert-warning mb-4">
        <strong>Warning:</strong> Pie chart cannot be created as no quizzes have been attempted.
      </div>
    </div>
  `,
  data() {
    return {
      chart_url: {
        bar_chart_url: null,
        pie_chart_url: null,
      },
      loading: true, // Add a loading state
      countdown: 5, // Initialize countdown
    };
  },
  methods: {
    getFullUrl(relativeUrl) {
      const cleanUrl = relativeUrl.replace(/^frontend\//, "");
      return `${location.origin}/static/${cleanUrl}`;
    },
    startCountdown() {
      const interval = setInterval(() => {
        this.countdown -= 1; // Decrease countdown by 1
        if (this.countdown === 0) {
          clearInterval(interval); // Stop the countdown
          this.loading = false; // Hide the countdown and display charts
        }
      }, 1000); // Update every 1 second
    },
  },
  async mounted() {
    // Fetch chart data
    const res = await fetch(
      location.origin + "/api/chart/" + this.$store.state.user_id,
      {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      this.chart_url = data; // Update chart URLs
      this.startCountdown(); // Start the countdown
    } else {
      console.error("Failed to fetch charts");
      this.loading = false; // Hide loading state even if there's an error
    }
  },
};
