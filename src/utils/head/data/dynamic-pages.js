/*
  Dynamic pages do not match automatically, so we have to call them in the
  appropriate components.
  The `context` value should be the `this` object that relates to the vue component.
  The `data` value can be used for overrides if necessary.
*/

export default function (head) {
  return {
    tutorials: function lessons ({ context, data }) {
      let titleString = ''
      if (context.tutorial.title.includes(context.tutorial.project.name)) {
        titleString = `${context.tutorial.title} Tutorial`
      } else if (context.tutorial.project.id === 'dweb') {
        titleString = `${context.tutorial.title} | DWeb Tutorial`
      } else {
        titleString = `${context.tutorial.title} | ${context.tutorial.project.name} Tutorial`
      }
      return head({
        'title': titleString,
        'description': context.tutorial.description,
        ...data
      })
    },
    lessons: function lessons ({ context, data }) {
      return head({
        'title': `Lesson ${parseInt(context.lessonId, 10)} | ${context.tutorial.title} Tutorial`,
        'description': context.lesson.description || context.tutorial.description || null,
        ...data
      })
    },
    resources: function resources ({ context, data }) {
      return head({
        'title': `Resources - ${context.tutorial.title} Tutorial`,
        'description': `Here are some additional resources to explore related to the tutorial "${context.tutorial.title}".`,
        ...data
      })
    }
  }
}
