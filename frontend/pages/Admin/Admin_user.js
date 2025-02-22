export default {
  template: `
  <div class="container mt-5">
    <h2 class="mb-4">User Management</h2>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Full Name</th>
          <th>Qualification</th>
          <th>Date of Birth</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user,index) in All_users" :key="user.id">
          <td>{{ index + 1}}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.fullname }}</td>
          <td>{{ user.qualification }}</td>
          <td>{{ user.dob }}</td>
          <td>{{ user.active ? 'Yes' : 'No' }}</td>
          <td>
            <button @click="openEditUserModal(user)" class="btn btn-warning btn-sm">Edit</button>
            <!-- Show Deactivate button if user is active -->
            <button v-if="user.active" @click="toggleUserStatus(user)" class="btn btn-danger btn-sm">
              Deactivate
            </button>
            <!-- Show Activate button if user is inactive -->
            <button v-else @click="toggleUserStatus(user)" class="btn btn-success btn-sm">
              Activate
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit User Modal -->
    <div v-if="selectedUser" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit User</h3>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="editEmail" :placeholder="selectedUser.email" />

        <label for="fullname">Full Name:</label>
        <input type="text" id="fullname" v-model="editFullname" :placeholder="selectedUser.fullname" />

        <label for="qualification">Qualification:</label>
        <input type="text" id="qualification" v-model="editQualification" :placeholder="selectedUser.qualification" />

        <label for="dob">Date of Birth:</label>
        <input type="date" id="dob" v-model="editDob" :placeholder="selectedUser.dob" />

        <button @click="editUser(user)" class="btn btn-success mt-3">Edit</button>
        <button @click="closeUserModal" class="btn btn-danger">Close</button>
      </div>
    </div>
  </div>
        `,
  data() {
    return {
      All_users: [],

      selectedUser: null,
      editEmail: "",
      editFullname: "",
      editQualification: "",
      editDob: "",
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const res = await fetch(location.origin + "/api/users", {
        headers: {
          "Authentication-token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        this.All_users = await res.json();
      } else {
        console.error("Failed to fetch users");
      }
    },
    openEditUserModal(User) {
      this.selectedUser = User;
      console.log(User);
    },
    // Close the user modal
    closeUserModal() {
      this.selectedUser = null;
    },
    async editUser(User) {
      const newEmail = this.editEmail;
      const newFullname = this.editFullname;
      const newQualification = this.editQualification;
      const newDob = this.editDob;
      if (!newEmail || !newFullname || !newQualification || !newDob) {
        alert("Please enter all field to update");
        return;
      }
      const res = await fetch(
        `${location.origin}/api/users/${this.selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": this.$store.state.auth_token,
          },
          body: JSON.stringify({
            email: newEmail,
            fullname: newFullname,
            qualification: newQualification,
            dob: newDob,
          }),
        }
      );
      if (res.ok) {
        alert(`User updated`);
      } else {
        alert("Failed to update user");
      }

      this.closeUserModal();
      this.editEmail = "";
      this.editFullname = "";
      this.editQualification = "";
      this.editDob = "";
      await this.fetchUsers();
    },
    async toggleUserStatus(user) {
      const newStatus = user.active ? 0 : 1;
      const res = await fetch(
        `${location.origin}/api/users/${user.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-token": this.$store.state.auth_token,
          },
          body: JSON.stringify({ active: newStatus }),
        }
      );
      if (res.ok) {
        alert("User status updated");
      } else {
        console.error("Failed to update user status");
      }
      await this.fetchUsers();
    },
  },
};
