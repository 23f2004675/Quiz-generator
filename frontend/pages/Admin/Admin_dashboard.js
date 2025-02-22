export default {
  template: `
  <div class="container mt-5 px-2">
  <div class="row">
    <div v-for="Subject in All_Subjects" :key="Subject.id" class="col-sm-6">
      <div class="card mb-4">
        <div class="card-body">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
            <h2 style="flex-grow: 1; text-align: center; margin-bottom: 10;"><u>{{ Subject.name }}</u></h2>
            <div>
              <img class="icon" src="/static/assets/edit.png" @click="openEditSubjectModal(Subject)" alt="Edit">
              <img class="icon" src="/static/assets/delete.png" @click="deleteSubject(Subject)" alt="Delete">
            </div>
          </div>
          <table class="table table-bordered table-striped">
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
                  <button @click="openEditChapterModal(chapter)" class="btn btn-warning btn-sm">Edit</button>
                  <button @click="deleteChapter(chapter)" class="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="openAddChapterModal(Subject)" class="btn btn-success btn-sm mt-3">+ Add Chapter</button>
        </div>
      </div>
    </div>
  </div>
  

  <div class="text-center mt-4">
    <button @click="openAddSubjectModal" class="btn btn-primary btn-lg">+ Add Subject</button>
  </div>

  <!-- Add Subject Modal -->
  <div v-if="addPopSubject" class="modal-overlay">
    <div class="modal-content">
      <h3>New Subject</h3>
      <label for="subjectName">Name:</label>
      <input type="text" id="subjectName" v-model="newSubjectName" placeholder="Enter subject name" />
      <label for="subjectDescription">Description:</label>
      <textarea id="subjectDescription" v-model="newSubjectDescription" placeholder="Enter subject description"></textarea>
      <button class="btn btn-success btn-sm mt-3" @click="addSubject">Add Subject</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>

  <!-- Edit Subject Modal -->
  <div v-if="selectedSubject" class="modal-overlay">
    <div class="modal-content">
      <h3>Edit Subject</h3>
      <label for="subjectName">Name:</label>
      <input type="text" id="subjectName" v-model="editSubjectName" :placeholder="selectedSubject.name" />
      <label for="subjectDescription">Description:</label>
      <textarea id="subjectDescription" v-model="editSubjectDescription" :placeholder="selectedSubject.description"></textarea>
      <button class="btn btn-success btn-sm mt-3" @click="editSubject(selectedSubject)">Update Subject</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>


  <!-- Add Chapter Modal -->
  <div v-if="selectedSChapeter" class="modal-overlay">
    <div class="modal-content">
      <h3>New Chapter</h3>
      <label for="chapterName">Name:</label>
      <input type="text" id="chapterName" v-model="newChapterName" placeholder="Enter chapter name" />
      <label for="chapterDescription">Description:</label>
      <textarea id="chapterDescription" v-model="newChapterDescription" placeholder="Enter chapter description"></textarea>
      <button class="btn btn-success btn-sm mt-3" @click="addChapter(selectedSChapeter)">Add Chapter</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>
  

  <!-- Edit Subject Modal -->
  <div v-if="selectedChapter" class="modal-overlay">
    <div class="modal-content">
      <h3>Edit Chapter</h3>
      <label for="chapterName">Name:</label>
      <input type="text" id="chapterName" v-model="editChapterName" :placeholder="selectedChapter.name" />
      <label for="chapterDescription">Description:</label>
      <textarea id="chapterDescription" v-model="editChapterDescription" :placeholder="selectedChapter.description"></textarea>
      <button class="btn btn-success btn-sm mt-3" @click="editChapter(selectedChapter)">Update Subject</button>
      <button class="btn btn-danger btn-sm" @click="closeModal">Close</button>
    </div>
  </div>
  
  </div>
      `,
  data() {
    return {
      All_Subjects: [],

      addPopSubject: null,
      selectedSubject: null,
      selectedSChapeter: null,
      selectedChapter: null,

      newSubjectName: "",
      newSubjectDescription: "",

      editSubjectName: "",
      editSubjectDescription: "",

      newChapterName: "",
      newChapterDescription: "",

      editChapterName: "",
      editChapterDescription: "",
    };
  },
  async mounted() {
    await this.fetchSubjects(); // Fetch subjects when the component is mounted
  },
  methods: {
    openAddSubjectModal() {
      this.addPopSubject = true;
    },
    openEditSubjectModal(thisSubject) {
      this.selectedSubject = thisSubject;
    },
    openAddChapterModal(Subject) {
      this.selectedSChapeter = Subject;
    },
    openEditChapterModal(chapter) {
      this.selectedChapter = chapter;
    },
    closeModal() {
      this.addPopSubject = null;
      this.selectedSubject = null;
      this.selectedSChapeter = null;
      this.selectedChapter = null;
    },

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
    async addSubject() {
      const { newSubjectName: name, newSubjectDescription: description } = this;
      if (!name || !description) {
        alert("Both name and description are required!");
        return;
      }
      const res = await fetch(`${location.origin}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": this.$store.state.auth_token,
        },
        body: JSON.stringify({
          name: name,
          description: description,
        }),
      });

      if (res.ok) {
        alert("Subject added successfully!");

        await this.fetchSubjects();
      } else {
        alert("Error adding subject");
      }
      this.addPopSubject = null;
      this.newSubjectName = "";
      this.newSubjectDescription = "";
    },
    async editSubject(Subject) {
      if (!this.editSubjectName || !this.editSubjectDescription) {
        alert("Both name and description are required!");
        return;
      }
      console.log(Subject);
      const res = await fetch(`${location.origin}/api/subjects/${Subject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-token": this.$store.state.auth_token,
        },
        body: JSON.stringify({
          name: this.editSubjectName,
          description: this.editSubjectDescription,
        }),
      });

      if (res.ok) {
        alert("Subject updated successfully!");
        await this.fetchSubjects();
      } else {
        alert("Error updating subject");
      }
      this.selectedSubject = null;
      this.editSubjectName = "";
      this.editSubjectDescription = "";
    },
    async deleteSubject(Subject) {
      if (
        !confirm(
          `Are you sure you want to delete the subject "${Subject.name}"?`
        )
      ) {
        return;
      }
      const res = await fetch(`${location.origin}/api/subjects/${Subject.id}`, {
        method: "DELETE",
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      });

      if (res.ok) {
        alert("Subject deleted successfully!");
        await this.fetchSubjects();
      } else {
        alert("Error deleting subject");
      }
    },
    async addChapter(Subject) {
      if (!this.newChapterName || !this.newChapterDescription) {
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
          name: this.newChapterName,
          description: this.newChapterDescription,
        }),
      });

      if (res.ok) {
        alert("Chapter added successfully!");
        await this.fetchSubjects();
      } else {
        alert("Error adding chapter");
      }
      this.selectedSChapeter = null;
      this.newChapterName = "";
      this.newChapterDescription = "";
    },
    async editChapter(chapter) {
      if (!this.editChapterName || !this.editChapterDescription) {
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
          name: this.editChapterName,
          description: this.editChapterDescription,
        }),
      });
      if (res.ok) {
        alert("Chapter updated successfully!");
        await this.fetchSubjects(); // Refresh the subject list
      } else {
        alert("Error updating chapter");
      }
      this.selectedChapter = null;
      this.editChapterName = "";
      this.editChapterDescription = "";
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
  },
};
