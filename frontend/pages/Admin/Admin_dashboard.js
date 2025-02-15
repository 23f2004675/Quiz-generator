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
            <div>
              <button @click="addChapter(Subject)">+Add Chapter</button>
            </div>
          </div>
        </div>
      `,
  data() {
    return {
      All_Subjects: [],
    };
  },
  async mounted() {
    await this.fetchSubjects(); // Fetch subjects when the component is mounted
  },
  methods: {
    async fetchSubjects() {
      try {
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
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    },

    async editChapter(chapter) {
      console.log("Edit chapter", chapter);
    },

    async deleteChapter(chapter) {
      if (
        !confirm(
          `Are you sure you want to delete the chapter "${chapter.name}"?`
        )
      ) {
        return;
      }

      const res = await fetch(`${location.origin}/api/chapters/${chapter.id}`, {
        method: "DELETE",
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      });

      if (res.ok) {
        alert("Chapter deleted successfully!");
        await this.fetchSubjects(); // Refresh subject list
      } else {
        alert("Error deleting chapter");
      }
    },
    async editChapter(chapter) {
      const newName = prompt("Enter new Chapter Name:", chapter.name);
      const newDescription = prompt(
        "Enter new Chapter Description:",
        chapter.description
      );

      if (!newName || !newDescription) {
        alert("Both name and description are required!");
        return;
      }

      const res = await fetch(`${location.origin}/api/chapters/${chapter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": this.$store.state.auth_token,
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      });
      if (res.ok) {
        alert("Chapter updated successfully!");
        await this.fetchSubjects(); // Refresh the subject list
      } else {
        alert("Error updating chapter");
      }
    },

    async addChapter(Subject) {
      const name = prompt("Enter new Chapter Name:");
      const description = prompt("Enter Chapter Description:");

      if (!name || !description) {
        alert("Both name and description are required!");
        return;
      }

      const res = await fetch(`${location.origin}/api/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": this.$store.state.auth_token,
        },
        body: JSON.stringify({
          subject_id: Subject.id,
          name: name,
          description: description,
        }),
      });

      if (res.ok) {
        alert("Chapter added successfully!");
        await this.fetchSubjects();
      } else {
        alert("Error adding chapter");
      }
    },
  },
};
