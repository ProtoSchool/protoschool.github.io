const fs = require('fs')
const promisify = require('util').promisify

const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const run = require('../../modules/run')
const tutorials = require('../../../src/static/tutorials.json')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

// determine new tutorial number

async function command (options) {
  const latestTutorialId = Object.keys(tutorials).sort().reverse()[0]
  const latestTutorial = tutorials[latestTutorialId]
  let tutorial
  let tutorialId
  let lessons

  log.info("Let's add lessons to your tutorial.")
  const tutorialResponses1 = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'latestTutorial',
        message: `Should we add your lesson to the "${latestTutorial.title}" tutorial?`
      }
    ])
  if (tutorialResponses1.latestTutorial) {
    tutorial = latestTutorial
    tutorialId = latestTutorialId
    lessons = await getTutorialLessons(tutorial, tutorialId)
  } else {
    // list existing tutorials + option to create new one
    let tutorialsList = [{name: 'CREATE NEW TUTORIAL', value: 'new'}]
    Object.keys(tutorials).sort().forEach(tutorialId => {
      tutorialsList.push({ name: tutorials[tutorialId].title, value: tutorialId })
    })

    const tutorialResponses2 = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'tutorialId',
          message: `Which of these existing tutorials should we add your lesson to?`,
          choices: tutorialsList.reverse()
        }
      ])
    if (tutorialResponses2.tutorialId !== 'new') {
      tutorial = tutorials[tutorialResponses2.tutorialId]
      tutorialId = tutorialResponses2.tutorialId
      lessons = await getTutorialLessons(tutorial, tutorialId)
    } else {
      log.info("I see that you want to create a new tutorial. Someday I'll figure out how to help with that. For now, you'll need to run the command `npm run scripts:create:tutorial` .")
      // TODO: launch into creating new tutorial
      return
    }
  }

  // figure out next lesson lessonNumber
  let lessonNumber = '01'
  if (lessons.length > 0) {
    lessonNumber = (lessons.map(lesson => lesson.id).sort().reverse()[0] + 1).toString().padStart(2, 0)
  }

  // print existing lessons if present
  if (lessons.length === 0) {
    log.info("Let's create your first lesson!")
  } else {
    log.info("Here are the lessons you've created so far:")
    console.group()
    lessons.forEach(lesson => {
      log.info(`${lesson.id} - ${lesson.title} (${lesson.type})`)
    })
    console.groupEnd()
    log.info("Let's create your next lesson!")
  }

  const lessonResponses = await inquirer
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

  // create lesson
  let newFileDetails = [`${lessonNumber}.md (for writing the text of your lesson)`]
  await promisify(fs.copyFile)('src/tutorials/boilerplates/boilerplate.md', `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`)
  let markdown = await promisify(fs.readFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, 'utf8')
  let newMarkdown = markdown.replace(`title: "Lesson title"`, `title: "${lessonResponses.title}"`)
  if (lessonResponses.type !== 'text') {
    newMarkdown = newMarkdown.replace(`type: "text"`, `type: "${lessonResponses.type}"`)
    await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-${lessonResponses.type}.js`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.js`)
    if (lessonResponses.type !== 'multiple-choice') {
      await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-challenge.md`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}-challenge.md`)
      newFileDetails.push(`${lessonNumber}-challenge.md (for describing your code challenge)`)
      newFileDetails.push(`${lessonNumber}.js (for building your code challenge)`)
    } else {
      newFileDetails.push(`${lessonNumber}.js (for building your multiple-choice quiz)`)
    }
  }
  await promisify(fs.writeFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, newMarkdown)

  // log success
  log.info("Tada! We've created the following files that you'll need for this lesson:")
  console.group()
  newFileDetails.forEach(file => log.info(file))
  console.groupEnd()
  log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/${lessonNumber}`)
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
