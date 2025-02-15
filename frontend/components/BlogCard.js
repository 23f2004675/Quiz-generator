export default {
  props: ["title", "date", "author_id", "id"],
  template: `
        <div class="jumbotron">
            <h1> Id: {{id}} </h1>
            <h2 @click= "$router.push('/blogs/'+id)"> {{title}}</h2>
            <p>Published by {{author_id}} on {{formatDate}}</p>
        </div>
        `,
  computed: {
    formatDate() {
      return new Date(this.date).toLocaleString();
    },
  },
};
