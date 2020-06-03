const api = require('../../src/api')

// Creators: create data (tutorials, lessons)
async function createTutorial (config = { override: {}, lessons: 0, resources: 0 }) {
  const { tutorial, lessons, resources } = await generateTutorial(config)
  const createdTutorial = await api.tutorials.create(tutorial)

  for (let i = 0; i < lessons.length; ++i) {
    await api.lessons.create(await api.tutorials.get(createdTutorial.id), lessons[i])
  }

  resources.forEach(async resource => {
    await api.resources.add(createdTutorial.id, resource)
  })

  return api.tutorials.get(createdTutorial.id)
}

// Generators: generate data to be used

async function generateTutorial (config = { override: {}, lessons: 0, resources: 0 }) {
  const suffix = await api.tutorials.getNextTutorialId()

  const tutorial = {
    title: `New Tutorial (${suffix})`,
    url: `new-tut-${suffix}`,
    project: 'libp2p',
    description: 'New tutorial description',
    ...config.override
  }

  const lessons = await Promise.all(new Array(config.lessons).fill().map(async (_, i) => (
    (await generateLesson({ override: { title: `Lesson ${i + 1}` } })).lesson
  )))

  const resources = await Promise.all(new Array(config.resources).fill().map(async (_, i) => (
    (await generateResource({
      override: {
        title: `Resource ${i + 1}`,
        link: `https://resource${i + 1}.com`
      }
    })).resource
  )))

  return {
    tutorial,
    lessons,
    resources,
    expected: { ...tutorial, lessons, resources }
  }
}

async function generateLesson ({ createTutorial = false, override = {} } = {}) {
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

async function generateResource ({ createTutorial, override = {} } = {}) {
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
  createTutorial,
  generateTutorial,
  generateLesson,
  generateResource
}
