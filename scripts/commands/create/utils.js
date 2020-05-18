const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const tutorials = require('../../../src/static/tutorials.json')

const tutorialKeys = Object.keys(tutorials)
const latestTutorialId = tutorialKeys.sort().reverse()[0]
const latestTutorial = tutorials[latestTutorialId]

// used by TUTORIAL
function nextTutorialNumber () {
  return (parseInt(tutorialKeys.sort()[tutorialKeys.length - 1]) + 1).toString().padStart(4, 0)
}

// used by utils accessed from LESSONS
function nextLessonNumber (lessons) {
  let lessonNumber = '01'
  if (lessons.length > 0) {
    lessonNumber = (parseInt(lessons.map(lesson => lesson.formattedId).sort().reverse()[0]) + 1).toString().padStart(2, 0)
  }
  return lessonNumber
}

// used by LESSON, RESOURCES
async function selectTutorial (newItemType) {
  let tutorial
  let tutorialId
  let lessons

  const tutorialResponses1 = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'latestTutorial',
        message: `Should we add your ${newItemType} to the "${latestTutorial.title}" tutorial?`
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
          message: `Which of these existing tutorials should we add your ${newItemType} to?`,
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
    }
  }
  return { tutorial, tutorialId, lessons }
}

// used by other utils accessed from LESSONS, RESOURCES
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

// used by other utils via RESOURCES
function validateUrl (url) {
  if (url.startsWith('http')) { // TODO better validation
    return true
  } else {
    return `That URL doesn't look right. Please be sure to start with \`http://\` or \`https://\`.`
  }
}

// used by TUTORIAL and by other utils via RESOURCES and LESSONS
function validateStringPresent (string) {
  if (string !== '') { // TODO: improve validation so it only returns true if there are non-space characters present - maybe first and last characters have to be non-spaces?
    return true
  } else {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  }
}

async function createResource (tutorial, tutorialId) {
  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this resource?",
        validate: validateStringPresent
      },
      {
        type: 'input',
        name: 'link',
        message: "What's the URL of this resource?",
        validate: validateUrl
      },
      {
        type: 'input',
        name: 'description',
        message: 'Add a description of this resource.',
        validate: validateStringPresent
      },
      {
        type: 'list',
        name: 'type',
        message: "What's the format of this resource?",
        choices: [ 'article', 'demo', 'docs', 'tool', 'tutorial', 'video' ]
      }
    ])

  // create resource in tutorials.json
  const newResource = {
    title: responses.title,
    link: responses.link,
    type: responses.type,
    description: responses.description
  }

  tutorials[tutorialId].resources.push(newResource)
  await promisify(fs.writeFile)('src/static/tutorials.json', JSON.stringify(tutorials, null, 4))
  console.log(tutorials)
  console.log(newResource)
  // log success
  log.info(`We've added "${responses.title}" to your resources list.`)

  await offerRepeat(tutorial, tutorialId, 'resource') // loops until user declines to repeat
}

// used by LESSONS
async function createLesson (tutorial, tutorialId) {
  let lessons = await getTutorialLessons(tutorial, tutorialId)
  const lessonResponses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this lesson?",
        validate: validateStringPresent
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
  let lessonNumber = nextLessonNumber(lessons)
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
  log.info(`Preview your lesson by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/${lessonNumber}`)

  await offerRepeat(tutorial, tutorialId, 'lesson') // loops until done, then returns back to where function was called
}

// used by RESOURCES and utils accessed from RESOURCES
function logResources (resources) {
  console.group()
  resources.forEach(resource => {
    log.info(`> ${resource.title} (${resource.type})`)
  })
  console.groupEnd()
}

// used by LESSONS and utils accessed from LESSONS
function logLessons (lessons) {
  console.group()
  lessons.forEach(lesson => {
    log.info(`> ${lesson.id} - ${lesson.title} (${lesson.type})`)
  })
  console.groupEnd()
}

// used by utils called by LESSONS and RESOURCES
async function offerRepeat (tutorial, tutorialId, type) {
  console.log(type)
  const another = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: type,
        message: `Would you like to add another ${type}?`
      }
    ])

  if (another.lesson) {
    await createLesson(tutorial, tutorialId)
  } else if (another.resource) {
    await createResource(tutorial, tutorialId)
  } else {
    console.log('you said no to adding another')
    log.info(`Okay, sounds like we're done. Here are all the ${type}s now included in the "${tutorial.title}" tutorial:`)
    if (type === 'lesson') {
      console.log('done adding lessons')
      logLessons(await getTutorialLessons(tutorial, tutorialId))
    } else if (type === 'resource') {
      console.log('done adding resources')
      logResources(tutorials[tutorialId].resources)
    }
  }
}

module.exports = { getTutorialLessons, nextTutorialNumber, offerRepeat, selectTutorial, validateStringPresent, nextLessonNumber, createLesson, createResource, logLessons, logResources }
