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
      if (context.tutorial.project.id === 'dweb') {
        titleString = `DWeb Tutorial | ${context.tutorial.title}`
      } else {
        titleString = `${context.tutorial.project.name} Tutorial | ${context.tutorial.title}`
      }
      return head({
        'title': titleString,
        'description': context.tutorial.description,
        'og:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image:alt': titleString,
        ...data
      })
    },
    courses: function courses ({ context, data }) {
      let titleString = `${context.courseName} Course | ProtoSchool`
      return head({
        'title': titleString,
        'description': context.seoDescription || 'No idea what context.course.description is',
        'og:image': `https://proto.school/social-tiles/twitter/courses/${context.course}.jpg`,
        'twitter:image': `https://proto.school/social-tiles/twitter/courses/${context.course}.jpg`,
        'twitter:image:alt': titleString,
        ...data
      })
    },
    lessons: function lessons ({ context, data }) {
      let titleString = ''
      if (context.tutorial.project.id === 'dweb') {
        titleString = `DWeb Tutorial | ${context.tutorial.title} (Lesson ${parseInt(context.lessonId, 10)})`
      } else {
        titleString = `${context.tutorial.project.name} Tutorial | ${context.tutorial.title} (Lesson ${parseInt(context.lessonId, 10)})`
      }
      return head({
        'title': titleString,
        'description': context.lesson.description || context.tutorial.description || null,
        'og:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image:alt': titleString,
        ...data
      })
    },
    resources: function resources ({ context, data }) {
      let titleString = ''
      let descriptionString = ''
      if (context.tutorial.project.id === 'dweb') {
        titleString = `DWeb Tutorial | ${context.tutorial.title} (Resources)`
        descriptionString = `Learning resources to supplement ProtoSchool's decentralized web tutorial, ${context.tutorial.title}.`
      } else {
        titleString = `${context.tutorial.project.name} Tutorial | ${context.tutorial.title} (Resources)`
        descriptionString = `Learning resources to supplement ProtoSchool's ${context.tutorial.project.name} tutorial, ${context.tutorial.title}.`
      }
      return head({
        'title': titleString,
        'description': descriptionString,
        'og:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image': `https://proto.school/social-tiles/twitter/tutorials/${context.tutorial.url}.jpg`,
        'twitter:image:alt': titleString,
        ...data
      })
    }
  }
}
