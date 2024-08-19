import { lstatSync, readFileSync } from 'fs'

import marked from 'meta-marked'

import { projects, tutorials, lessons } from '../../'

function assertIsFile (filePath) {
  expect(filePath).toBeDefined()
  expect(lstatSync(filePath).isFile()).toBeTruthy()
}

function assertIsDirectory (directory) {
  expect(directory).toBeDefined()
  expect(lstatSync(directory).isDirectory()).toBeTruthy()
}

function assertIsNotAFile (filePath) {
  expect(() => lstatSync(filePath)).toThrow('no such file or directory')
}

/**
 *
 * @param {Object} result Resulting tutorial to be tested
 * @param {Object} expected Expected tutorial
 */
function assertTutorialObject (result, expected) {
  expect(result).toMatchObject({
    ...expected,
    project: projects.get(expected.project)
  })
}

/**
  Asserts a tutorial was properly created. Asserts for:

  1. `result` and `expected` match
  2. `result` matches the tutorial metadata on the static json file
  3. tutorial folder was created correctly (e.g. src/tutorials/0003-blog)
 */
function assertTutorial (result, expected) {
  // assert against provided tutorial details
  assertTutorialObject(result, expected)

  // assert against tutorial metadata on static file
  assertTutorialObject(result, tutorials.list.getJson()[result.formattedId])

  // assert correct folder was created
  assertIsDirectory(result.fullPath)
}

function assertLesson (result, expected) {
  expect(result).toMatchObject(expected)

  assertIsFile(result.files.markdown)
  const lessonMarkdownMetadata = marked(readFileSync(result.files.markdown, 'utf8')).meta

  expect(lessonMarkdownMetadata).toHaveProperty('title')
  expect(lessonMarkdownMetadata).toHaveProperty('type')
  expect(lessonMarkdownMetadata).toMatchObject(expected)

  switch (expected.type) {
    case 'text':
      assertIsNotAFile(lessons.files.getJsPath(tutorials.get(result.tutorialId), result.id))
      assertIsNotAFile(lessons.files.getChallengeMarkdownPath(tutorials.get(result.tutorialId), result.id))
      break
    case 'code':
    case 'file-upload':
      assertIsFile(result.files.js)
      assertIsFile(result.files.challengeMarkdown)
      break
    case 'multiple-choice':
      assertIsFile(result.files.js)
      assertIsNotAFile(lessons.files.getChallengeMarkdownPath(tutorials.get(result.tutorialId), result.id))
      // TODO assert that the file contents are correct (match boilerplate)
  }
}

function assertUpdatedQuiz (result) {
  const fileContents = readFileSync(result.files.js, 'utf8')
  expect(fileContents).toMatchSnapshot()
}

export default {
  assertTutorial,
  assertLesson,
  assertUpdatedQuiz
}
