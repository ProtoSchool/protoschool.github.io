const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const tutorials = require('../../../src/static/tutorials.json')
const courses = require('../../../src/static/courses.json')
const projects = require('../../../src/static/projects.json')

const tutorialKeys = Object.keys(tutorials)
const latestTutorialId = tutorialKeys.sort().reverse()[0]
const latestTutorial = tutorials[latestTutorialId]

async function createTutorial () {
  log.info("Let's create the files you need to build your tutorial. We'll ask you a few questions to get started.")
  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of your new tutorial?',
        validate: validateStringPresent
      },
      {
        type: 'input',
        name: 'url',
        message: 'What is the URL for your tutorial? (Hit return to accept our suggestion.)',
        default: function (responses) {
          return responses.title.toLowerCase().split(' ').join('-')
        },
        validate: validateStringPresent
      },
      {
        type: 'list',
        name: 'project',
        message: 'Which project is your tutorial about?',
        choices: projects.map(project => ({name: project.name, value: project.id}))
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please provide a short description for your tutorial to be displayed in tutorial listings.',
        validate: validateStringPresent
      }
    ])

  // determine new tutorial number
  const tutorialNumber = nextTutorialNumber()

  // create new directory
  await promisify(fs.mkdir)(`src/tutorials/${tutorialNumber}-${responses.url}`)

  // update all array in courses.json
  courses.all.push(tutorialNumber)
  await promisify(fs.writeFile)('src/static/courses.json', JSON.stringify(courses, null, 4))

  // add entry to tutorials.json
  const newTutorial = {
    url: responses.url,
    project: responses.project,
    title: responses.title,
    description: responses.description,
    newMessage: '',
    updateMessage: '',
    createdAt: new Date(),
    updatedAt: '',
    resources: []
  }

  tutorials[tutorialNumber] = newTutorial
  await promisify(fs.writeFile)('src/static/tutorials.json', JSON.stringify(tutorials, null, 4))

  // log success
  log.info(`Thanks! We've created a directory for your tutorial at \`src/tutorials/${tutorialNumber}-${responses.url}/\`.`)
  log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${responses.url}`)
  // suggest creating a lesson
  await promptCreateFirst('lesson', tutorialNumber)
}

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
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ipfs://')) {
    return true
  } else {
    return `That URL doesn't look right. Please be sure to start with \`http://\` or \`https://\`.`
  }
}

// used by TUTORIAL and by other utils via RESOURCES and LESSONS
function validateStringPresent (string) {
  if (string.trim()) {
    return true
  } else {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  }
}

async function createResourceIntro () {
  // determine new tutorial number
  log.info("Let's add resources to your tutorial.")
  async function command (options) {
    const { tutorial, tutorialId } = await selectTutorial('resources')
    const resources = tutorials[tutorialId].resources

    // print existing resources if present
    if (resources.length === 0) {
      log.info("Let's create your first resource!")
    } else {
      log.info("Here are the resources you've created so far:")
      logResources(resources)
    }

    await createResource(tutorial, tutorialId) // loops until user declines to repeat, then offers closing statements
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
  // log success
  log.info(`We've added "${responses.title}" to your resources list.`)

  await offerRepeat(tutorial, tutorialId, 'resource') // loops until user declines to repeat
}

async function createLessonIntro () {
  // determine new tutorial number
  log.info("Let's add lessons to your tutorial.")
  const { tutorial, tutorialId, lessons } = await selectTutorial('lesson')

  // print existing lessons if present
  if (lessons.length === 0) {
    log.info("Let's create your first lesson!")
  } else {
    log.info("Here are the lessons you've created so far:")
    logLessons(lessons)
    log.info("Let's create your next lesson!")
  }

  // loops until you say you don't want more lessons, then offers closing statements
  await createLesson(tutorial, tutorialId, lessons)
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
    log.info(`Okay, sounds like we're done. Here are all the ${type}s now included in the "${tutorial.title}" tutorial:`)
    if (type === 'lesson') {
      logLessons(await getTutorialLessons(tutorial, tutorialId))
      afterLessonCreate(tutorial, tutorialId)
    } else if (type === 'resource') {
      logResources(tutorials[tutorialId].resources)
      afterResourceCreate(tutorial, tutorialId)
    }
  }
}

async function afterLessonCreate (tutorial, tutorialId) {
  log.info(`You can find all the files you'll need for these lessons in the \`src/tutorials/${tutorialId}-${tutorial.url}/\` directory.`)

  // prompt to create resources if not yet done
  if (tutorial.resources.length === 0) {
    log.info(`All tutorials have a resources page where users can find opportunities for further learning.`)
    await promptCreateFirst('resource', tutorialId)
  } else {
    logEverythingDone(tutorial)
  }
}

async function afterResourceCreate (tutorial, tutorialId) {
  log.info(`You can preview your resources page by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/resources`)
  log.info('Need to change something? You can edit your resources in the file `src/static/tutorials.json`.')
  // prompt to create lessons if not yet done
  if ((await getTutorialLessons(tutorial, tutorialId)).length === 0) {
    log.info(`Looks like your "${tutorial.title}" tutorial doesn't have any lessons yet.`)
    await promptCreateFirst('resource', tutorialId)
  } else {
    logEverythingDone(tutorial)
  }
}

function logEverythingDone (tutorial) {
  log.info(`Awesome work! "${tutorial.title}" has both lesson files and resources!`)
  log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}`)
  log.info(`To create the content of your lessons, edit the files in the \`src/tutorials/${tutorial.formattedId}-${tutorial.url}/\` directory.`)
  log.info(`To update your tutorial's title, description, or resources, edit its entry in the \`src/static/tutorials.json\` file.`)
}

async function promptCreateFirst (itemType, tutorialId) {
  const start = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: itemType,
        message: `Are you ready to add your first ${itemType} to the "${tutorials[tutorialId].title}" tutorial?`
      }
    ])

  if (start.lesson) {
    await createLesson(tutorials[tutorialId], tutorialId)
  } else if (start.resource) {
    await createResource(tutorials[tutorialId], tutorialId)
  } else {
    log.info(`Okay, no problem. You can create a ${itemType} later using this command: \`npm run scripts:create:${itemType}\``)
  }
}

module.exports = { getTutorialLessons, createTutorial, createLessonIntro, createResourceIntro, nextTutorialNumber, promptCreateFirst, offerRepeat, selectTutorial, validateStringPresent, nextLessonNumber, createLesson, createResource, logLessons, logResources }
