export default {
  template: `
        <div>
        This is Customer Summary
        <p>{{chart_url}}</p>
        <p>{{chart_url}}</p>
        </div>
        `,
  data() {
    return {
      chart_url: {},
      /*chart_url: {
          chart1_url: null,
          chart2_url: null,
        },*/
    };
  },
  methods: {},
  async mounted() {
    const res = await fetch(
      location.origin + "/api/user/" + this.$store.state.user_id + "/chart",
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
