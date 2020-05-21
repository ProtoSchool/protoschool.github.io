const api = require('../../../src/api')

async function generateTutorial (config = { override: {}, lessons: 0, resources: 0 }) {
  const tutorial = {
    title: 'New Tutorial',
    url: `new-tut-${Math.random()}`,
    project: 'libp2p',
    description: 'New tutorial description',
    ...config.override
  }

  const lessons = new Array(config.lessons).fill().map(async (_, i) => (
    (await generateLesson({ override: { title: `Lesson ${i + 1}` } })).lesson
  ))

  const resources = new Array(config.resources).fill().map(async (_, i) => (
    (await generateResource({
      override: {
        title: `Resource ${i + 1}`,
        link: `https://resource${i + 1}.com`
      }
    })).resource
  ))

  return {
    tutorial,
    lessons,
    resources,
    expected: { ...tutorial, lessons, resources }
  }
}

async function generateLesson ({ createTutorial = false, override = {} }) {
  const lesson = {
    title: 'Lesson',
    type: 'text',
    ...override
  }
  let tutorial

  if (createTutorial) {
    tutorial = await api.tutorials.create((await generateTutorial()).tutorial)
    await api.courses.add(tutorial.id)
  }

  return {
    lesson,
    tutorial,
    expected: { lesson, tutorial }
  }
}

async function generateResource ({ createTutorial, override = {} }) {
  const resource = {
    title: 'Resource',
    link: 'https://resource.com',
    description: 'Resoure description',
    type: 'demo',
    ...override
  }
  let tutorial

  if (createTutorial) {
    tutorial = await api.tutorials.create((await generateTutorial()).tutorial)
    await api.courses.add(tutorial.id)
  }

  return {
    resource,
    tutorial,
    expected: { resource, tutorial }
  }
}

module.exports = {
  generateTutorial,
  generateLesson,
  generateResource
}
