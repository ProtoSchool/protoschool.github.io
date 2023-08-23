import { readFileSync } from 'fs'

// Used with generateTutorial
function assertNewTutorial ({ context, result, expected }) {
  expect(result).toBeInstanceOf(Object)
  expect(result.id).toBe(context.lastTutorialId + 1)
  expect(result.title).toBe(expected.title)
  expect(result.project.id).toBe(expected.project)
  expect(result.description).toBe(expected.description)

  if (result.lessons.length) {
    result.lessons.forEach((lesson, i) => {
      const id = i + 1

      expect(lesson).toMatchObject({
        id,
        formattedId: (id).toString().padStart(2, 0),
        title: `Lesson ${id}`,
        ...expected.lessons[i]
      })
    })
  } else {
    expect(result.lessons).toHaveLength(0)
  }

  if (result.resources) {
    for (let i in result.resources) {
      expect(result.resources[i]).toMatchObject(expected.resources[i])
    }
  } else {
    expect(result.resources).toHaveLength(0)
  }
}

// Used with generateLesson
function assertNewLesson ({ result, expected }) {
  expect(result).toBeInstanceOf(Object)
  expect(result.id).toBe(expected.tutorial.id)
  expect(result.title).toBe(expected.tutorial.title)
  expect(result.project).toMatchObject(expected.tutorial.project)
  expect(result.description).toBe(expected.tutorial.description)

  expect(result.lessons).toHaveLength(1)
  expect(result.lessons[0]).toMatchObject(expected.lesson)
}

// Used with generateResource
function assertNewResource ({ result, expected }) {
  expect(result).toBeInstanceOf(Object)
  expect(result.id).toBe(expected.tutorial.id)
  expect(result.title).toBe(expected.tutorial.title)
  expect(result.project).toMatchObject(expected.tutorial.project)
  expect(result.description).toBe(expected.tutorial.description)

  expect(result.resources).toHaveLength(1)
  expect(result.resources[0]).toMatchObject(expected.resource)
}

function assertQuizUnknownOrder ({ result, hardcodedData }) {
  const fileContents = readFileSync(result.files.js, 'utf8')
  expect(fileContents).toContain(`question = "${hardcodedData.question}"`)
  hardcodedData.choices.forEach(choice => {
    expect(fileContents).toContain(`{
    "answer": "${choice.answer}",
    "correct": ${choice.correct},
    "feedback": "${choice.feedback}"
  }`)
  })
}

function assertQuizKnownOrder ({ result }) {
  const fileContents = readFileSync(result.lessons[0].files.js, 'utf8')

  expect(fileContents).toMatchSnapshot()
}

export default {
  assertNewTutorial,
  assertNewLesson,
  assertNewResource,
  assertQuizKnownOrder,
  assertQuizUnknownOrder
}
