const fs = require('fs').promises

const marked = require('meta-marked')

const api = require('../../')

async function assertIsFile (filePath) {
  expect(filePath).toBeDefined()
  expect((await fs.lstat(filePath)).isFile()).toBeTruthy()
}

async function assertIsDirectory (directory) {
  expect(directory).toBeDefined()
  expect((await fs.lstat(directory)).isDirectory()).toBeTruthy()
}

/**
 *
 * @param {Object} result Resulting tutorial to be tested
 * @param {Object} expected Expected tutorial
 */
function assertTutorialObject (result, expected) {
  expect(result).toMatchObject({
    ...expected,
    project: api.projects.get(expected.project)
  })
}

/**
  Asserts a tutorial was properly created. Asserts for:

  1. `result` and `expected` match
  2. `result` matches the tutorial metadata on the static json file
  3. tutorial folder was created correctly (e.g. src/tutorials/0003-blog)
 */
async function assertTutorial (result, expected) {
  // assert against provided tutorial details
  assertTutorialObject(result, expected)

  // assert against tutorial metadata on static file
  assertTutorialObject(result, (await api.tutorials.list.getJson())[result.formattedId])

  // assert correct folder was created
  await assertIsDirectory(result.fullPath)
}

async function assertLesson (result, expected) {
  expect(result).toMatchObject(expected)

  await assertIsFile(result.files.markdown)
  const lessonMarkdownMetadata = marked(await fs.readFile(result.files.markdown, 'utf8')).meta

  expect(lessonMarkdownMetadata).toHaveProperty('title')
  expect(lessonMarkdownMetadata).toHaveProperty('type')
  expect(lessonMarkdownMetadata).toMatchObject(expected)

  switch (expected.type) {
    case 'code':
    case 'file-upload':
      await assertIsFile(result.files.js)
      await assertIsFile(result.files.challengeMarkdown)
      break
    case 'multiple-choice':
      await assertIsFile(result.files.js)
  }
}

module.exports = {
  assertTutorial,
  assertLesson
}
