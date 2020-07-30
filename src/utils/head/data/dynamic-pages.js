export default function (head) {
  return {
    tutorials: function lessons ({ context }) {
      return head({
        'title': `${context.tutorial.title} Tutorial`,
        'description': context.tutorial.description
      })
    },
    lessons: function lessons ({ context }) {
      return head({
        'title': `Lesson ${parseInt(context.lessonId, 10)} | ${context.tutorial.title} Tutorial`,
        'description': context.tutorial.description || null
      })
    },
    resources: function resources ({ context }) {
      return head({
        'title': `Resources - ${context.tutorial.title} Tutorial`,
        'description': `Here are some additional resources to explore related to the tutorial "${context.tutorial.title}".`
      })
    }
  }
}
