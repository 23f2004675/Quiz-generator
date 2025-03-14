export default {
  props: {
    question: Object,
    index: Number,
    isSubmitted: Boolean,
  },
  data() {
    return {
      selectedAnswer: null, // Local state for the selected answer
    };
  },
  methods: {
    updateAnswer(value) {
      this.selectedAnswer = value;
      this.$emit("answer-selected", { index: this.index, answer: value }); // Emit event with the selected answer
    },
  },
  template: `
    <div class="card-body">
      <h5>Q{{ index + 1 }}. {{ question.question_text }} <span class="text-muted">(1 mark)</span></h5>
      <div v-for="(option, i) in question.options.split(',')" :key="i" class="form-check">
        <input
          type="radio"
          :name="'question_' + question.id"
          :value="option"
          :checked="selectedAnswer === option"
          @change="updateAnswer(option)" 
          class="form-check-input"
          :disabled="isSubmitted"
        />
        <label class="form-check-label">{{ option }}</label>
      </div>
    </div>
  `,
};
