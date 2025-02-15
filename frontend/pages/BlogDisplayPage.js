export default {
  props: ["id"],
  template: `
            <div>
                <h2>{{blog.title}}</h2>
                <img v-if="blog.img_url" v-bind:src="'/static/assets' + blog.img_url" alt="Blog Image" />
                <p>{{blog.caption}}</p>
            </div>
        `,
  data() {
    return {
      blog: {},
    };
  },
  computed: {
    formatDate() {
      return new Date(this.blog.timestamp).toLocaleString();
    },
  },
  methods: {},
  async mounted() {
    const res = await fetch(location.origin + "/api/blogs/" + this.id, {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      this.blog = await res.json();
    }
  },
};
