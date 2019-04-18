# ProtoSchool

ProtoSchool is an educational community that teaches decentralized web protocols and tools
through online tutorials and local chapter events.

This repository is for the main ProtoSchool website, hosted at https://proto.school, where you can
explore our self-guided interactive tutorials.

For information on local chapter organizing, please visit our [organizing repo](https://github.com/protoschool/organizing).

If you're interested in building tutorials, keep reading!

## Developing Tutorials

Each **tutorial** in ProtoSchool is made up of multiple **lessons**.


### Run the server locally

First, check out this repository and run the dev server locally.

```sh
> npm install
> npm run serve
```

### Create a directory for your tutorial

Create a new directory within `tutorials` for your tutorial, using your lesson shortname.

Example (while in `tutorials`):

```sh
> mkdir Tutorial-Shortname
```


### Create lesson files (repeat for each lesson in tutorial)

#### Vue file

Select the appropriate boilerplate Vue file for your lesson from the `tutorials/boilerplates` directory:

- `boilerplate-standard.vue` for a lesson with an exercise which does not require a file upload
- `boilerplate-file-upload.vue` for a lesson with an exercise that requires a file upload
- `boilerplate-no-exercise.vue` for a text-only lesson

Copy that boilerplate into your tutorial folder and rename it to the 2-digit number of the lesson.

Example (while in `tutorials`):

```sh
> cp boilerplate/boilerplate-standard.vue Tutorial-Shortname/01.vue
```

Replace anything in the boilerplate file that reads "REPLACEME".


#### Markdown file

Create a `.md` file alongside your `.vue` and add the markdown formatted text
of the lesson. The name of this file should match the 2-digit lesson number used
in the corresponding Vue file.

Example:

```
tutorials/Tutorial-Shortname/01.md
```

#### Exercise file (skip for text-only lessons)

Create a second `.md` file alongside your `.vue` and add the markdown formatted text that provides the assignment text for the exercise box. The name of this file should match the 2-digit lesson number used previously, with `-exercise` appended.

Example:

```
tutorials/Tutorial-Shortname/01-exercise.md
```

### Update routes and import statements in `main.js`

First, import each of your lesson components:

```js
import LessonBasics01 from './tutorials/Basics/01.vue'
```

Then add each of them to the list of routes in `main.js` like so:

```js
{ path: '/basics/01', component: LessonBasics01 },
```

Don't forget to include a landing page for your tutorial:

```js
{ path: '/basics', component: Landing, props: { tutorialId: 'basics' } },
```

When adding your routes, it's important that you follow the existing naming
convention, since the code used elsewhere will parse the route path to determine the
shortname of the tutorial, the current lesson number, and the total number of
lessons in your tutorial.

For example, if you add 3 lessons with the following routes:

```js
{ path: '/basics/01', component: LessonBasics01 },
{ path: '/basics/02', component: LessonBasics02 },
{ path: '/basics/03', component: LessonBasics03 },
```
your second lesson will display the following under the lesson title:

`Basics | Lesson 2 of 3`

If you add 5 lesssons with the following routes:

```js
{ path: '/data-structures/01', component: LessonDataStructures01 },
{ path: '/data-structures/02', component: LessonDataStructures02 },
{ path: '/data-structures/03', component: LessonDataStructures03 },
{ path: '/data-structures/04', component: LessonDataStructures04 },
{ path: '/data-structures/05', component: LessonDataStructures05 },
```

your third lesson will display the following under the lesson title:

`Data Structures | Lesson 3 of 5`

Notice how multi-word lesson shortnames are treated here. In filepaths, they are lowercase and hyphenated (e.g. `/data-structures/01`). In component names they are upper camel case (smushed together with the first letter of each word capitalized, e.g. `LessonDataStructures01`).


### Add your tutorial to `tutorials.json` and `courses.json`

In `static/tutorials.json`, add a new key for your tutorial (for example, `tutorialShortname` as shown in the example below) and fill in the appropriate values:

```json
"tutorialShortname": {
  "project": "IPFS",
  "title": "Your tutorial title",
  "description": "Your tutorial description",
  "lessons": [
      { "to": "/example/01", "name": "Title of 1st lesson" },
      { "to": "/example/02", "name": "Title of 2nd lesson" },
      { "to": "/example/03", "name": "Title of 3rd lesson" }
  ],
},
```

In `static/courses.json`, add the tutorial key to the `all` array so it will appear in the Tutorials page. It must exactly match the key you've used in `static/tutorials.json`. For example, to continue with the same example shown above, you would change this:

```json
{
  "all": ["dataStructures", "basics", "blog"],
  "featured": ["dataStructures", "basics", "blog"]
}
```

...to this:

```json
{
  "all": ["dataStructures", "basics", "blog", "tutorialShortname"],
  "featured": ["dataStructures", "basics", "blog"]
}
```

The project maintainers will take care of making any updates needed to ensure your project is featured in any relevant course listings.


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

When the sample code area is evaluated, it must return a function, usually an
async function. The result of that function is passed to your validation
function as `result`.

Each time the user's code is evaluated they get a new, clean, IPFS instance.
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
