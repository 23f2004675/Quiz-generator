export default {
  template: `
      <div>
        <h3 class="my-5 text-center"><u>Admin Search</u></h3>
  
        <!-- Service Select Dropdown -->
        <div class="form-group mb-4 d-flex justify-content-center">
          <select 
            class="form-control w-50" 
            v-model="selectedService" 
            required
          >
            <option value="" disabled selected>Select your service</option>
            <option 
              v-for="service in services" 
              :key="service" 
              :value="service"
            >
              {{ service }}
            </option>
          </select>
        </div>
  
        <!-- Search Input (Conditional Rendering for Users) -->
        <div v-if="selectedService === 'Users'" class="form-group mb-4 d-flex justify-content-center">
          <input 
            type="text" 
            class="form-control w-50" 
            :placeholder="selectedService === 'Users' ? 'Enter user name/email/qualification' : ''" 
            v-model="searchQuery"
            @input="searchUsers"
          />
        </div>
        <div v-if="selectedService === 'Users'">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Qualification</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in filteredUsers" :key="user.id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.qualification }}</td>
                <td>{{ user.dob }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Search Input (Conditional Rendering for Subjects/Quizzes) -->
        <div v-if="selectedService === 'Subjects/Quizzes'" class="form-group mb-4 d-flex justify-content-center">
          <input 
            type="text" 
            class="form-control w-50" 
            :placeholder="selectedService === 'Subjects/Quizzes' ? 'Enter Subject name/ Chapter name' : ''" 
            v-model="searchQuery"
            @input="searchQuizzes"
          />
        </div>
        <div v-if="selectedService === 'Subjects/Quizzes'">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Subject name</th>
                <th>Chapter name</th>
                <th>Quiz Date</th>
                <th>Duration</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(quiz, index) in filteredQuizzes" :key="quiz.id">
                <td>{{ index + 1 }}</td>
                <td>{{ quiz.subject_name }}</td>
                <td>{{ quiz.chapter_name }}</td>
                <td>{{ quiz.date_of_quiz }}</td>
                <td>{{ quiz.time_duration }}</td>
                <td>{{ quiz.remarks }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Search Input (Conditional Rendering for Questions) -->
        <div v-if="selectedService === 'Questions'" class="form-group mb-4 d-flex justify-content-center">
          <input 
            type="text" 
            class="form-control w-50" 
            :placeholder="selectedService === 'Questions' ? 'Enter question title/text/quiz_id' : ''" 
            v-model="searchQuery"
            @input="searchQuestions"
          />
        </div>
        <div v-if="selectedService === 'Questions'">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Quiz id</th>
                <th>Question text</th>
                <th>Question title</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(question, index) in filteredQuestions" :key="question.id">
                <td>{{ index + 1 }}</td>
                <td>{{ question.quiz_id }}</td>
                <td>{{ question.question_text }}</td>
                <td>{{ question.question_title }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  data() {
    return {
      searchQuery: "",
      selectedService: "",
      services: ["Users", "Subjects/Quizzes", "Questions"], // Services for dropdown
      All_users: [], // Stores all fetched users
      filteredUsers: [], // Stores filtered users based on search
      quizzes: [], // All quizzes fetched from the backend
      filteredQuizzes: [], // Quizzes filtered based on search
      questions: [], // All questions fetched from the backend
      filteredQuestions: [], // Questions filtered based on search
      isLoading: false,
    };
  },
  methods: {
    async fetchAllUsers() {
      this.isLoading = true;
      try {
        const res = await fetch(location.origin + "/api/users", {
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          this.All_users = await res.json();
          this.filteredUsers = this.All_users; // Initialize filteredUsers with all users
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchQuizzes() {
      this.isLoading = true;
      try {
        const res = await fetch(
          location.origin + "/api/quizzes/today_or_future",
          {
            headers: {
              "Authentication-token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          this.quizzes = await res.json();
          this.filteredQuizzes = this.quizzes; // Initialize filtered quizzes
        } else {
          console.error("Failed to fetch quizzes");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchQuestions() {
      this.isLoading = true;
      try {
        const res = await fetch(location.origin + "/api/questions", {
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          this.questions = await res.json();
          this.filteredQuestions = this.questions; // Initialize filtered questions
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        this.isLoading = false;
      }
    },
    searchUsers() {
      if (!this.searchQuery) {
        this.filteredUsers = this.All_users; // Reset to all users if search query is empty
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.All_users.filter(
        (user) =>
          user.fullname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.qualification.toLowerCase().includes(query)
      );
    },
    searchQuizzes() {
      if (!this.searchQuery) {
        this.filteredQuizzes = this.quizzes; // Reset to all quizzes if search query is empty
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredQuizzes = this.quizzes.filter(
        (quiz) =>
          quiz.subject_name.toLowerCase().includes(query) ||
          quiz.chapter_name.toLowerCase().includes(query)
      );
    },
    searchQuestions() {
      if (!this.searchQuery) {
        this.filteredQuestions = this.questions; // Reset to all questions if search query is empty
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredQuestions = this.questions.filter(
        (question) =>
          question.question_text.toLowerCase().includes(query) ||
          question.question_title.toLowerCase().includes(query) ||
          question.quiz_id.toString().includes(query)
      );
    },
  },
  watch: {
    selectedService(newVal) {
      if (newVal === "Users") {
        this.fetchAllUsers(); // Fetch users when "Users" is selected
      } else if (newVal === "Subjects/Quizzes") {
        this.fetchQuizzes(); // Fetch quizzes when "Subjects/Quizzes" is selected
      } else if (newVal === "Questions") {
        this.fetchQuestions(); // Fetch questions when "Questions" is selected
      } else {
        this.All_users = []; // Clear users when another service is selected
        this.filteredUsers = [];
        this.quizzes = [];
        this.filteredQuizzes = [];
        this.questions = [];
        this.filteredQuestions = [];
      }
    },
  },
};
