# ProtoSchool

ProtoSchool is an educational community that teaches decentralized web protocols and tools
through online tutorials and local chapter events.

This repository is for the main ProtoSchool website, hosted at https://proto.school, where you can
explore our self-guided interactive tutorials.

For information on local chapter organizing, please visit our [organizing repo](https://github.com/protoschool/organizing)

If you're interested in building tutorials, keep reading!

## Developing Lessons

First, check out this repository and run the dev server locally.

```
npm install
npm run serve
```

Next copy `components/lessons/boiler.vue` to the number of your lesson.
Example:

```
cp components/lessons/boiler.vue components/lessons/03.vue
```

Replace anything in the boiler that reads "REPLACEME".

Create a `.md` file alongside your `.vue` and add the markdown formatted text
of the lesson.

Add your lesson to the routes in `main.js` and to the list of lessons in `Home.vue`.

When adding your routes, it's important that you follow the existing naming
convention, since the code used elsewhere will parse the route path to determine the
shortname of the tutorial, the current lesson number, and the total number of
lessons in your tutorial. For example, if you add 3 lessons with the following routes:

```
{ path: '/basics/01', component: LessonBasics01 },
{ path: '/basics/02', component: LessonBasics02 },
{ path: '/basics/03', component: LessonBasics03 },
```
your second lesson will display the following under the lesson title:

`Basics | Lesson 2 of 3`

## Boiler Explained

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
