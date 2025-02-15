import BlogCard from "../components/BlogCard.js";

export default {
  template: `
    <div>
        <h1>Blogs list</h1>
        <h2>Role: {{$store.state.role}}</h2>
        <BlogCard v-for="blog in blogs" 
                  :key="blog.id"
                  :id="blog.id"
                  :title="blog.title" 
                  :date="blog.timestamp" 
                  :author_id="blog.user_id" />
    </div>
    `,
  data() {
    return {
      blogs: [],
    };
  },
  methods: {},
  async mounted() {
    const res = await fetch(location.origin + "/api/blogs", {
      headers: {
        "Authentication-token": this.$store.state.auth_token,
      },
    });
    this.blogs = await res.json();
  },
  components: {
    BlogCard,
  },
};
