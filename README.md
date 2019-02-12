# ProtoSchool

ProtoSchool is an educational community that teaches decentralized web protocols and tools
through online tutorials and local chapter events.

This repository is for the main ProtoSchool website, hosted at https://proto.school, where you can
explore our self-guided interactive tutorials.

For information on local chapter organizing, please visit our [organizing repo](https://github.com/protoschool/organizing)

If you're interested in building tutorials, keep reading!

## Developing Tutorials

Each **tutorial** in ProtoSchool is made up of multiple **lessons**.


### Run the server locally

First, check out this repository and run the dev server locally.

```
npm install
npm run serve
```

### Create a directory for your tutorial


Create a new directory within `lessons` for your tutorial, using your lesson shortname.

Example (while in `lessons`):

`mkdir Tutorial-Shortname`



### Create lesson files (repeat for each lesson in tutorial)

#### Vue file

Select the appropriate boilerplate Vue file for your lesson:

- `boilerplate-standard.vue` for a lesson with an exercise which does not require upload
- `boilerplate-file-upload.vue` for a lesson that requires a file upload
- `boilerplate-no-exercise.vue` for a text-only lesson

Copy that boilerplate into your tutorial folder and rename it to the 2-digit number of the lesson.

Example:

```
cp components/lessons/boilerplate-standard.vue components/lessons/Tutorial-Shortname/01.vue
```

Replace anything in the boiler that reads "REPLACEME".

#### Markdown file
Create a `.md` file alongside your `.vue` and add the markdown formatted text
of the lesson.

Example:
```
components/lessons/Tutorial-Shortname/01.md
```

#### Exercise file (skip for text-only lessons)
Create a second `.md` file alongside your `.vue` and add the markdown formatted text that provides the assignment for the exercise box.

Example:
```
components/lessons/Tutorial-Shortname/01-exercise.md
```
### Update routes and import statements in `main.js`

First, add each of your lessons to the list of routes in `main.js` like so:

`{ path: '/basics/01', component: LessonBasics01 },`

Then import them like so:

`import LessonBasics01 from './lessons/Basics/01.vue'`

When adding your routes, it's important that you follow the existing naming
convention, since the code used elsewhere will parse the route path to determine the
shortname of the tutorial, the current lesson number, and the total number of
lessons in your tutorial.

For example, if you add 3 lessons with the following routes:

```
{ path: '/basics/01', component: LessonBasics01 },
{ path: '/basics/02', component: LessonBasics02 },
{ path: '/basics/03', component: LessonBasics03 },
```
your second lesson will display the following under the lesson title:

`Basics | Lesson 2 of 3`

If you add 5 lesssons with the following routes:

```
{ path: '/data-structures/01', component: LessonDataStructures01 },
{ path: '/data-structures/02', component: LessonDataStructures02 },
{ path: '/data-structures/03', component: LessonDataStructures03 },
{ path: '/data-structures/04', component: LessonDataStructures04 },
{ path: '/data-structures/05', component: LessonDataStructures05 },
```

your third lesson will display the following under the lesson title:

`Data Structures | Lesson 3 of 5`

Notice how multi-word lesson shortnames are treated here. In filepaths, they are lowercase and hyphenated. In component names they are upper camel case (smushed together with the first letter of each word capitalized).

### Add tutorial to index in `Home.vue`

In `Home.vue`, add a div as shown below, replacing the path, lesson title, and lesson description placeholders with the appropriate values.

Template:
```
<div class="bg-aqua br4 pa3 mb3 tutorial-tile">
  <router-link to="PATH_OF_FIRST_LESSON_IN_TUTORIAL">
    <h3 class="ma0 f3 fwy navy">TUTORIAL_TITLE</h3>
    <p class="f5 fw5 ma0 pt2 lh-copy white">
      TUTORIAL_DESCRIPTION
    </p>
  </router-link>
</div>
```

Example:
```
<div class="bg-aqua br4 pa3 mb3 tutorial-tile">
  <router-link to="/basics/01">
    <h3 class="ma0 f3 fw7 navy">P2P data links with content addressing</h3>
    <p class="f5 fw5 ma0 pt2 lh-copy white">
      Store, fetch, and create verifiable links between peer-hosted datasets with IPFS and CIDs. It’s graphs with friends!
    </p>
  </router-link>
</div>
```

### Add lessons to `Tutorials.vue`

In `Tutorials.vue`, add a new section for your tutorial, replacing the path, lesson title, and lesson description placeholders with the appropriate values.

Within the your <ul>, add one <li> for each lesson, containing an `ExerciseLink` component. Fill in the lesson's path, index, and full name accordingly.

Template:
```
<section class="db mw7 center ph2">
  <div class="flex items-start pv4">
    <div class="project-label flex-none tc">
      <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
      <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
    </div>
    <div class="w-100">
      <h2 class="ma0 f3 fw5"><router-link to="PATH_OF_FIRST_LESSON_IN_TUTORIAL">TUTORIAL_TITLE</router-link></h2>
      <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
        TUTORIAL_DESCRIPTION
      </p>
      <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
        <li>
          <ExerciseLink to="/TUTORIAL_SHORTNAME/01" index="1" name="COMPLETE_LESSON_TITLE" />
        </li>
        <li>
          <ExerciseLink to="/TUTORIAL_SHORTNAME/02" index="2" name="COMPLETE_LESSON_TITLE" />
        </li>
        <li>
          <ExerciseLink to="/TUTORIAL_SHORTNAME/03" index="3" name="COMPLETE_LESSON_TITLE" />
        </li>
      </ul>
    </div>
  </div>
</section>
```

Example:
```
<section class="db mw7 center ph2">
  <div class="flex items-start pv4">
    <div class="project-label flex-none tc">
      <h1 class="ma0 f3 fw6 pb2">IPFS</h1>
      <img src="../../images/ipfs.svg" alt="" style="height: 54px"/>
    </div>
    <div class="w-100">
      <h2 class="ma0 f3 fw5"><router-link to="/basics/01">P2P data links with content addressing</router-link></h2>
      <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
        Store, fetch, and create verifiable links between peer-hosted datasets with IPFS and CIDs. It’s graphs with friends!
      </p>
      <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
        <li>
          <ExerciseLink to="/basics/01" index="1" name="Create a node and return a Content Identifier (CID)" />
        </li>
        <li>
          <ExerciseLink to="/basics/02" index="2" name="Create a new node that's linked to an old one" />
        </li>
        <li>
          <ExerciseLink to="/basics/03" index="3" name="Read nested data using links" />
        </li>
      </ul>
    </div>
  </div>
</section>
```

## Boilerplate Explained

```javascript
import Lesson from '../Lesson'
import text from './REPLACEME.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'Happy Message!'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

// const code = `const run = async () => {}
// return run
// `

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      text, validate//, code
    }
  }
}
```

### validate(result, ipfs)

When the sample code area is eval'd it must return a function, usually an
async function. The result of that function is passed to your validation
function as `result`.

Each time the user's code is eval'd they get a new, clean, IPFS instance.
That instance is passed as the second argument, `ipfs`.

Validate must return an object with one of two properties: `fail` or
`success`. Each property should be used to give a detailed message of *why*
the sample code failed in order to help the user along.

### code

Code is a string property. It's the sample code used to populate the code
editor. If not set there's a default, used in the first lesson, that is used
instead.

## License

ProtoSchool is licensed under the Apache-2.0 and MIT licenses. See [LICENSE.md](https://github.com/protoschool/protoschool.github.io/blob/master/LICENSE.md) for further detail.
