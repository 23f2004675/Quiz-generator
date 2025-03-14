export default {
  template: `
  <div class="container mt-5 px-2">
  <div class="row">
    <div v-for="(Quiz,index) in All_Quizes" :key="Quiz.id" class="col-sm-6">
      <div class="card mb-4">
        <div class="card-body">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
            <h2 style="flex-grow: 1; text-align: center; margin-bottom: 10; cursor: pointer;" @click="fetchQuizz(Quiz)" ><u>Quiz{{index+1}} ({{ Quiz.chapter_name }})</u></h2>
            <div>
              <img class="icon" src="/static/assets/edit.png" @click="openEditQuizModal(Quiz)" alt="Edit">
              <img class="icon" src="/static/assets/delete.png" @click="deleteQuiz(Quiz)" alt="Delete">
            </div>
          </div>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Chapter Name</th>
                <th>Question Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(question, index) in Quiz.questions" :key="question.id">
                <td>{{ index+1 }}</td>
                <td>{{ question.question_title }}</td>
                <td>
                  <button @click="openEditQuestionModal(question)" class="btn btn-warning btn-sm">Edit</button>
                  <button @click="deleteQuestion(question)" class="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="openAddQuestionModal(Quiz)" class="btn btn-success btn-sm mt-3">+ Add Question</button>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mt-4">
    <button @click="openAddQuizModal" class="btn btn-primary btn-lg">+ Add Quiz</button>
  </div>

<!-- Quiz Detail Modal -->
  <div v-if="selectedQuizDetail" class="modal-overlay">
    <div class="modal-content">
      <h3>Quiz Details</h3>
      Subject Name: {{selectedQuizDetail.subject_name}} <br>
      Chapter Name: {{selectedQuizDetail.chapter_name}} <br>
      Date: {{selectedQuizDetail.date_of_quiz}}  (YYYY-MM--DD)<br>
      Time Duration: {{selectedQuizDetail.time_duration}} <br>
      Toal Questions: {{selectedQuizDetail.total_questions}} <br>
      Remarks: {{selectedQuizDetail.remarks}} <br>
      <button class="btn btn-danger btn-sm mt-2" @click="closeModal">Close</button>
    </div>
  </div>


  <!-- Add Quiz Modal -->
  <div v-if="addPopQuiz" class="modal-overlay">
    <div class="modal-content">
      <h3>New Quiz</h3>
      <label for="chapterId">Name:</label>
      <input type="text" id="chapterId" v-model="newChapterId" placeholder="Enter chapter id" />
      <label for="Date">Date:</label>
      <input type="date" id="Date" v-model="newDate" />
      <label for="Duration">Date:</label>
      <input type="text" id="Duration" v-model="newTimeDuration" placeholder="hh:mm" />
      <button class="btn btn-success btn-sm mt-3" @click="addQuiz">Add Quiz</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>

  <!-- Edit Quiz Modal -->
  <div v-if="selectedQuiz" class="modal-overlay">
    <div class="modal-content">
    <h3>Edit Quiz</h3>
    <label for="echapterId">Name:</label>
    <input type="text" id="echapterId" v-model="newEditChapterName" :placeholder="selectedQuiz.chapter_name" />
    <label for="Date">New Date:</label>
    <input type="date" id="Date" v-model="newEditDate"/>
    <label for="Duration">Time Duration:</label>
    <input type="text" id="Duration" v-model="newEditTimeDuration" :placeholder="selectedQuiz.time_duration" />
    <label for="remarks">Remarks:</label>
    <input type="text" id="remarks" v-model="newEditRemarks" :placeholder="selectedQuiz.remarks" />
    <button class="btn btn-success btn-sm mt-3" @click="editQuiz(selectedQuiz)">Edit Quiz</button>
    <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>

  <!-- Add Question Modal -->
  <div v-if="selectedQuestionQuiz" class="modal-overlay">
  <div class="modal-content">
    <h3>New Question</h3>
    <label for="questionTitle">Question Title:</label>
    <input type="text" id="questionTitle" v-model="newQuestionTitle" placeholder="Enter question title" />
    <label for="question">Question:</label>
    <textarea id="question" v-model="newQuestion" placeholder="Enter the question"></textarea>
    <label for="option1">Option 1:</label>
    <input type="text" id="option1" v-model="newOption1" placeholder="Enter option 1" />
    <label for="option2">Option 2:</label>
    <input type="text" id="option2" v-model="newOption2" placeholder="Enter option 2" />
    <label for="option3">Option 3:</label>
    <input type="text" id="option3" v-model="newOption3" placeholder="Enter option 3" />
    <label for="option4">Option 4:</label>
    <input type="text" id="option4" v-model="newOption4" placeholder="Enter option 4" />
    <label for="correctAnswer">Correct Answer:</label>
    <input type="text" id="correctAnswer" v-model="newCorrectAnswer" placeholder="Enter correct answer" />
    <button class="btn btn-success btn-sm mt-3" @click="addQuestion(selectedQuestionQuiz)">Add Question</button>
    <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
  </div>
  </div>

  <!-- Edit Question Modal -->
  <div v-if="selectedEditQuestionQuiz" class="modal-overlay">
    <div class="modal-content">
      <h3>Edit Question</h3>
      <label for="questionTitle">Question Title:</label>
      <input type="text" id="questionTitle" v-model="newEditQuestionTitle" :placeholder="selectedEditQuestionQuiz.question_title" />
      <label for="question">Question:</label>
      <textarea id="question" v-model="newEditQuestion" :placeholder="selectedEditQuestionQuiz.question_text"></textarea>
      <label for="option1">Option 1:</label>
      <input type="text" id="option1" v-model="newEditOption1" :placeholder="selectedEditQuestionQuiz.options.split(',')[0]" />
      <label for="option2">Option 2:</label>
      <input type="text" id="option2" v-model="newEditOption2" :placeholder="selectedEditQuestionQuiz.options.split(',')[1]" />
      <label for="option3">Option 3:</label>
      <input type="text" id="option3" v-model="newEditOption3" :placeholder="selectedEditQuestionQuiz.options.split(',')[2]" />
      <label for="option4">Option 4:</label>
      <input type="text" id="option4" v-model="newEditOption4" :placeholder="selectedEditQuestionQuiz.options.split(',')[3]" />
      <label for="correctAnswer">Correct Answer:</label>
      <input type="text" id="correctAnswer" v-model="newEditCorrectAnswer" :placeholder="selectedEditQuestionQuiz.correct_option" />
      <button class="btn btn-success btn-sm mt-3" @click="editQuestion(selectedEditQuestionQuiz)">Edit Question</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>


</div>
        `,
  data() {
    return {
      All_Quizes: [],

      addPopQuiz: null,
      selectedQuiz: null,

      newEditChapterName: "",
      newEditRemarks: "",
      newChapterId: "",
      newDate: "",
      newTimeDuration: "",

      newEditChapterId: "",
      newEditDate: "",
      newEditTimeDuration: "",

      selectedQuestionQuiz: null,
      newQuestionTitle: "",
      newQuestion: "",
      newOption1: "",
      newOption2: "",
      newOption3: "",
      newOption4: "",
      newCorrectAnswer: "",

      selectedEditQuestionQuiz: null,
      newEditQuestionTitle: "",
      newEditQuestion: "",
      newEditOption1: "",
      newEditOption2: "",
      newEditOption3: "",
      newEditOption4: "",
      newEditCorrectAnswer: "",

      selectedQuizDetail: null,
    };
  },
  async mounted() {
    await this.fetchQuizzes(); // Fetch Quizzes when the component is mounted
    // console.log("All Quizzes", this.All_Quizes);
  },
  methods: {
    openAddQuizModal() {
      this.addPopQuiz = true;
    },
    openEditQuizModal(Quiz) {
      // console.log(Quiz);
      this.selectedQuiz = Quiz;
    },
    openAddQuestionModal(Quiz) {
      this.selectedQuestionQuiz = Quiz;
    },
    openEditQuestionModal(question) {
      this.selectedEditQuestionQuiz = question;
    },
    closeModal() {
      this.addPopQuiz = null;
      this.selectedQuiz = null;
      this.selectedQuestionQuiz = null;
      this.selectedEditQuestionQuiz = null;
      this.selectedQuizDetail = null;
    },
    async fetchQuizzes() {
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
    async addQuiz() {
      const chapter_id = this.newChapterId;
      const date = this.newDate;
      const time_duration = this.newTimeDuration;

      if (!chapter_id || !date || !time_duration) {
        alert("All fields are required!");
        return;
      }

      const quizDetails = {
        chapter_id: parseInt(chapter_id, 10),
        date,
        time_duration: parseInt(time_duration, 10),
      };

      try {
        const res = await fetch(location.origin + "/api/quizzes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": this.$store.state.auth_token,
          },
          body: JSON.stringify(quizDetails),
        });

        if (res.ok) {
          alert("Quiz added successfully!");
          await this.fetchQuizzes(); // Refresh the quiz list
        } else {
          const errorData = await res.json();
          console.error("Failed to add quiz:", errorData);
          alert(`Error: ${errorData.message || "Failed to add quiz"}`);
        }
      } catch (error) {
        console.error("Error adding quiz:", error);
      }
      this.addPopQuiz = null;
      this.newChapterId = "";
      this.newDate = "";
      this.newTimeDuration = "";
    },
    async editQuiz(Quiz) {
      const newChapterName = this.newEditChapterName;
      const newDate = this.newEditDate;
      const new_time_duration = this.newEditTimeDuration;
      const newremarks = this.newEditRemarks;
      if (!newChapterName || !newDate || !new_time_duration || !newremarks)
        return;

      try {
        const res = await fetch(`${location.origin}/api/quizzes/${Quiz.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": this.$store.state.auth_token,
          },
          body: JSON.stringify({
            chapter_name: newChapterName,
            date: newDate,
            time_duration: new_time_duration,
            remarks: newremarks,
          }),
        });

        if (res.ok) {
          alert("Quiz updated successfully!");
          await this.fetchQuizzes(); // Refresh the list
        } else {
          alert.error("Failed to update quiz");
        }
      } catch (error) {
        console.error("Error updating quiz:", error);
      }
      this.selectedQuiz = null;
      this.newEditChapterName = "";
      this.newEditDate = "";
      this.newEditTimeDuration = "";
      this.remarks = "";
    },
    async deleteQuiz(Quiz) {
      if (!confirm("Are you sure you want to delete this quiz?")) return;

      try {
        const res = await fetch(`${location.origin}/api/quizzes/${Quiz.id}`, {
          method: "DELETE",
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        });

        if (res.ok) {
          alert("Quiz deleted successfully!");
          await this.fetchQuizzes(); // Refresh the list
        } else {
          alert("Failed to delete quiz");
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    },
    async addQuestion(Quiz) {
      const quizId = Quiz.id;
      const questionTitle = this.newQuestionTitle;
      const question = this.newQuestion;
      const option =
        this.newOption1 +
        "," +
        this.newOption2 +
        "," +
        this.newOption3 +
        "," +
        this.newOption4;
      const correctAnswer = this.newCorrectAnswer;

      if (!quizId || !questionTitle || !question || !option || !correctAnswer)
        return;
      try {
        const res = await fetch(
          `${location.origin}/api/quizzes/${quizId}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authentication-token": this.$store.state.auth_token,
            },
            body: JSON.stringify({
              question_title: questionTitle,
              question,
              option,
              correct_answer: correctAnswer,
            }),
          }
        );

        if (res.ok) {
          alert("Question added successfully!");
          await this.fetchQuizzes(); // Refresh the list
        } else {
          alert("Failed to add question");
        }
      } catch (error) {
        console.error("Error adding question:", error);
      }
      this.selectedQuestionQuiz = null;
      this.newChapterId = "";
      this.newQuestionTitle = "";
      this.newQuestion = "";
      this.newOption1 = "";
      this.newOption2 = "";
      this.newOption3 = "";
      this.newOption4 = "";
      this.newCorrectAnswer = "";
    },
    async editQuestion(question) {
      const questionTitle = this.newEditQuestionTitle;
      const question_text = this.newEditQuestion;
      const option =
        this.newEditOption1 +
        "," +
        this.newEditOption2 +
        "," +
        this.newEditOption3 +
        "," +
        this.newEditOption4;
      const correctAnswer = this.newEditCorrectAnswer;
      if (!questionTitle || !question_text || !option || !correctAnswer) return;
      console.log("Edit Question", question);
      try {
        const res = await fetch(
          `${location.origin}/api/questions/${question.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-token": this.$store.state.auth_token,
            },
            body: JSON.stringify({
              question_title: questionTitle,
              question_text,
              option,
              correct_answer: correctAnswer,
            }),
          }
        );

        if (res.ok) {
          alert("Question edited successfully!");
          await this.fetchQuizzes(); // Refresh the list
        } else {
          alert("Failed to edit question");
        }
      } catch (error) {
        console.error("Error editing question:", error);
      }
      this.selectedEditQuestionQuiz = null;
      this.newEditQuestionTitle = "";
      this.newEditQuestion = "";
      this.newEditOption1 = "";
      this.newEditOption2 = "";
      this.newEditOption3 = "";
      this.newEditOption4 = "";
      this.newEditCorrectAnswer = "";
    },
    async deleteQuestion(question) {
      if (!confirm("Are you sure you want to delete this Question?")) return;

      try {
        const res = await fetch(
          `${location.origin}/api/questions/${question.id}`,
          {
            method: "DELETE",
            headers: {
              "Authentication-token": this.$store.state.auth_token,
            },
          }
        );

        if (res.ok) {
          alert("Question deleted successfully!");
          await this.fetchQuizzes(); // Refresh the list
        } else {
          console.error("Failed to delete Question");
        }
      } catch (error) {
        console.error("Error deleting Qestion:", error);
      }
    },
    async fetchQuizz(Quiz) {
      const res = await fetch(
        `${location.origin}/api/quiz/${Quiz.id}/details`,
        {
          headers: {
            "Authentication-token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        this.selectedQuizDetail = await res.json();
      } else {
        console.error("Failed to fetch subjects");
      }
    },
  },
};
