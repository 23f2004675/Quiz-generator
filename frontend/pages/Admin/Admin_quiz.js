export default {
  template: `
          <div>
            <h1>Quiz Management</h1>
            <div v-for="Quiz in All_Quizes" :key="Quiz.id">
              <h2>{{ Quiz.chapter_name }}</h2>
              <table style="border: 1px solid black; border-collapse: collapse; width: 100%">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Question Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(question, index) in Quiz.questions" :key="question.id">
                    <td> {{index+1}}</td>
                    <td>{{ question.question_title }}</td>
                    <td>
                      <button @click="editQuiz(Quiz)">Edit</button>
                      <button @click="deleteQuiz(Quiz)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `,
  data() {
    return {
      All_Quizes: [],
    };
  },
  async mounted() {
    const res = await fetch(location.origin + "/api/chapters", {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      this.All_Quizes = await res.json();
    } else {
      console.error("Failed to fetch subjects");
    }
  },
  methods: {
    editChapter(chapter) {
      console.log("Edit chapter", chapter);
    },
    deleteChapter(chapter) {
      console.log("Delete chapter", chapter);
    },
  },
};
