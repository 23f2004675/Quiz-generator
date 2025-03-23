export default {
  template: `
      <div class="container mt-4">
        <h3 class="my-5 text-center"><u>Search Quizzes by Subject or Chapter</u></h3>
        
        <!-- Search Bar -->
        <div class="form-group mb-4 d-flex justify-content-center">
        <input 
            type="text" 
            class="form-control w-50" 
            placeholder="Search by Subject Name or Chapter Name..." 
            v-model="searchQuery"
            @input="searchQuizzes"
        />
        </div>
  
        <!-- Display Filtered Quizzes -->
        <table class="table table-bordered table-striped">
          <thead class="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Subject Name</th>
              <th scope="col">Chapter Name</th>
              <th scope="col">Date</th>
              <th scope="col">Duration</th>
              <th scope="col">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz,index) in filteredQuizzes" :key="quiz.id">
              <td>{{ index+1 }}</td>
              <td>{{ quiz.subject_name }}</td>
              <td>{{ quiz.chapter_name }}</td>
              <td>{{ quiz.date_of_quiz }}</td>
              <td>{{ quiz.time_duration }}</td>
              <td>{{ quiz.remarks }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  data() {
    return {
      quizzes: [], // All quizzes fetched from the backend
      filteredQuizzes: [], // Quizzes filtered based on search
      searchQuery: "", // Search keyword
    };
  },
  methods: {
    searchQuizzes() {
      if (this.searchQuery.trim() === "") {
        // If search query is empty, show all quizzes
        this.filteredQuizzes = this.quizzes;
      } else {
        // Filter quizzes based on search query for subject_name or chapter_name
        const query = this.searchQuery.toLowerCase();
        this.filteredQuizzes = this.quizzes.filter((quiz) => {
          return (
            quiz.subject_name.toLowerCase().includes(query) ||
            quiz.chapter_name.toLowerCase().includes(query)
          );
        });
      }
    },
  },
  async mounted() {
    // Fetch all quizzes from the backend
    const res = await fetch(location.origin + "/api/quizzes/today_or_future", {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      this.quizzes = await res.json();
      this.filteredQuizzes = this.quizzes; // Initialize filtered quizzes
    } else {
      console.error("Failed to fetch quizzes");
    }
  },
};
