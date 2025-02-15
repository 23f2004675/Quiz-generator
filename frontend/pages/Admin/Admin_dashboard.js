export default {
  template: `
        <div>
          <h1>Admin Dashboard</h1>
          <div v-for="Subject in All_Subjects" :key="Subject.id">
            <h2>{{ Subject.name }}</h2>
            <table style="border: 1px solid black; border-collapse: collapse; width: 100%">
              <thead>
                <tr>
                  <th>Chapter Name</th>
                  <th>No. of Questions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="chapter in Subject.chapters" :key="chapter.id">
                  <td>{{ chapter.name }}</td>
                  <td>{{ chapter.num_questions }}</td>
                  <td>
                    <button @click="editChapter(chapter)">Edit</button>
                    <button @click="deleteChapter(chapter)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
  data() {
    return {
      All_Subjects: [],
    };
  },
  async mounted() {
    const res = await fetch(location.origin + "/api/subjects", {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      this.All_Subjects = await res.json();
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
