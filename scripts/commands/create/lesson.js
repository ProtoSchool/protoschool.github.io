const fs = require('fs')
const promisify = require('util').promisify

const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const run = require('../../modules/run')
const tutorials = require('../../../src/static/tutorials.json')

async function command (options) {
  const latestTutorialId = Object.keys(tutorials).sort().reverse()[0]
  const latestTutorial = tutorials[latestTutorialId]
  console.log(latestTutorial)
  let tutorial
  let tutorialId
  let lessons

  log.info('tutorial-creation', "Let's add lessons to your tutorial.")
  const responses1 = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'tutorial',
        message: `Should we add your lesson to the "${latestTutorial.title}" tutorial?`
      }
    ])
  if (responses1.tutorial) {
    tutorial = latestTutorial
    tutorialId = latestTutorialId
    lessons = await getTutorialLessons(tutorial, tutorialId)
  } else {
    // TODO: deal with a no response, either diff tutorial or forgot to create one
  }

  // figure out next lesson lessonNumber
  let lessonNumber = '01'
  if (lessons.length > 0) {
    lessonNumber = (lessons.map(lesson => lesson.id).sort().reverse()[0] + 1).toString().padStart(2, 0)
  }

  // print existing lessons if present
  if (lessons.length === 0) {
    console.log("Let's create your first lesson!")
  } else {
    console.log("Here are the lessons you've created so far:")
    lessons.forEach(lesson => {
      console.log(`${lesson.id} - ${lesson.title} (${lesson.type})`)
    })
    console.log("Let's create your next lesson!")
  }

  const responses2 = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this lesson?"
      },
      {
        type: 'list',
        name: 'type',
        message: "What's the format of this lesson?",
        choices: [
          {
            name: 'Text only',
            value: 'text'
          },
          {
            name: 'Multiple-choice quiz',
            value: 'multiple-choice'
          },
          {
            name: 'Code challenge',
            value: 'code'
          },
          {
            name: 'Code challenge with file upload',
            value: 'file-upload'
          }
        ]
      }
    ])
  console.log(responses2.title)
  console.log(responses2.type)

  // create lesson files
  await promisify(fs.copyFile)('src/tutorials/boilerplates/boilerplate.md', `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`)
  let markdown = await promisify(fs.readFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, 'utf8')
  let newMarkdown = markdown.replace(`title: "Lesson title"`, `title: "${responses2.title}"`)
  if (responses2.type !== 'text') {
    newMarkdown = newMarkdown.replace(`type: "text"`, `type: "${responses2.type}"`)
    await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-${responses2.type}.js`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.js`)
    if (responses2.type !== 'multiple-choice') {
      await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-challenge.md`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}-challenge.md`)
    }
  }
  await promisify(fs.writeFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, newMarkdown)

  // log success
  console.info("Tada! We've created the files you'll need for this lesson.")
}

async function getTutorialLessons (tutorial, tutorialId, lessons = [], lessonNumber = 1) {
  const lessonFilePrefix = `${tutorialId}-${tutorial.url}/${lessonNumber.toString().padStart(2, 0)}`

  let lessonMd
  let lesson
  try {
    lessonMd = await promisify(fs.readFile)(`src/tutorials/${lessonFilePrefix}.md`, 'utf8')
    lesson = {
      id: lessonNumber,
      formattedId: lessonNumber.toString().padStart(2, 0),
      ...marked(lessonMd).meta
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'ENOENT') {
      return lessons
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
    throw error
  }
  lessons.push(lesson)
  return getTutorialLessons(tutorial, tutorialId, lessons, lessonNumber + 1)
}

run(command)
