# ProtoSchool

ProtoSchool is an educational community that teaches decentralized web protocols and tools
through online tutorials and local chapter events.

This repository is for the main ProtoSchool website, hosted at https://proto.school, where you can
explore our self-guided interactive tutorials.

For information on local chapter organizing, please visit our [organizing repo](https://github.com/protoschool/organizing).

If you're interested in building tutorials, keep reading!

## Developing Tutorials

### Run the server locally to preview your work

First, check out this repository, install dependencies, and run the dev server locally:

```sh
> npm install
> npm run serve
```
You should now be able to preview your work in a web browser at: http://localhost:8080/#/

(Note that you won't be able to see your new lessons until you've updated the appropriate routes and import statements, as described below.)

### Create a directory for your tutorial

Create a new directory for your files within `tutorials`, using your tutorial shortname.

Example (while in `tutorials`):

```sh
> mkdir Tutorial-Shortname
```

### Build your lessons (repeat for each lesson in the tutorial)

Each **tutorial** in ProtoSchool is made up of multiple **lessons**.

Currently there are three lesson formats available, which you may mix and match within your tutorial:
- A standard lesson with a coding exercise (the most common)
- A lesson with a coding exercise that requires a file upload
- A text-only lesson with no code challenge

Follow the steps below to create each lesson.

#### Create lesson files

Depending on which lesson format you've chosen, you'll need to create 2-4 files within your project directory. Check the table below to see which files you need, then read on for instructions on how to create them.

| File | Sample Filename | Standard Lesson with Coding Exercise | Lesson with Coding Exercise and File Upload | Text-Only Lesson
| :--- | :---: | :---: | :---: | :---: |
| A Vue file that provides **required metadata** (e.g. title) for your lesson and, when relevant, the **default code and validation for the exercise**|`01.vue`| Required | Required | Required |
| A markdown file containing the **text of the lesson** (your educational content)|`01.md`| Required | Required | Required |
| A markdown file containing the **text of the assignment shown in the exercise box**|`01-exercise.vue`| Required | Required | Not Used |
| A markdown file containing the **text of the optional useful concepts box**|`01-concepts.md`| Optional | Optional | Optional |

Not familiar with markdown? It's a fairly simple way to style text on the web. [Learn more about markdown formatting here.](https://guides.github.com/features/mastering-markdown/)

Not familiar with Vue? No worries, we'll be providing the details you need to use it within this project. You _will_ need to use some JavaScript, though, as you build your default code and validation.

##### Vue file

Select the appropriate boilerplate Vue file for your lesson from the `tutorials/boilerplates` directory:

- `boilerplate-standard.vue` for a lesson with a coding excercise  which does not require a file upload
- `boilerplate-file-upload.vue` for a lesson with a coding exercise that requires a file upload
- `boilerplate-no-exercise.vue` for a text-only lesson

Copy that boilerplate into your tutorial folder and rename it to the 2-digit number of the lesson.

Example (while in `tutorials`):

```sh
> cp boilerplate/boilerplate-standard.vue Tutorial-Shortname/01.vue
```

Replace anything in the boilerplate file that reads "REPLACEME".

If your lesson includes a coding exercise, you'll also use this file to set up your default code and validation, as described later in these instructions.


##### Lesson text file

Create a `.md` file alongside your `.vue` and add the markdown-formatted text
of the lesson itself (your educational content). The name of this file should match the 2-digit lesson number used
in the corresponding Vue file.

Example:

```
tutorials/Tutorial-Shortname/01.md
```


##### Exercise text file (skip for text-only lessons)

If your lesson includes a coding exercise, create a second `.md` file and add the markdown-formatted text that provides the assignment text for the exercise box. The name of this file should match the 2-digit lesson number used previously, with `-exercise` appended.

Example:

```
tutorials/Tutorial-Shortname/01-exercise.md
```
##### Useful concepts text file (optional)

Ocassionally you may want to add a _useful concepts_ box defining key terminology, if this can't easily be done in-line. If you'd like to do this, create another `.md` file that provides the text for that _useful concepts_ box. The name of this file should match the 2-digit lesson number used previously, with `-concepts` appended. (This step is optional.)

Example:

```
tutorials/Tutorial-Shortname/01-concepts.md
```

#### Build code challenges and validation in your Vue file (skip for text-only lessons)

If you are creating a lesson with a code challenge (whether or not it requires file upload), you'll need to provide default code and set up validation in the lesson's Vue file. The basic template you need to accomplish this is provided in the boilerplate file you selected earlier.

#### Provide the starting code for your exercise

`code` is a string property. The value you set for `code` in your Vue file will
be used to populate the code
editor when the user first visits the page. (If you forget to set this, a default
will be used, but your exercise won't be very useful!)

```js
const code = `const run = async () => {
  /* your code here */
}
return run
`
```
Your default `code` will always have this exterior `run` function, inside of which
your user creates their own code. The code your user writes will almost always
include returning a value from the interior function.

As you decide what starting code to provide for each lesson, think about how you
can isolate the action the user needs to take to a single step, representing the
concept they've learned in this particular lesson.

In practice, most lessons build off of previous ones, and code is repeated and
built on between exercies. You will often need to pre-populate in your lesson the
correct solution to a previous lesson or lessons, so that the current exercise can
test adding only the most recent method taught.

You should also think about how you might provide support for programming language
challenges and limit the assignment to executing methods that practice your lesson
content.

Remember that you can add comments to your default code to orient the user, such as:
```js
// your code goes here
```

#### Provide the simplest solution to your exercise

`solution` is a string property. The value you set for `solution` in your Vue
file will be used to populate the code editor if the user clicks the "View
Solution" option. (We hope you'll have provided enough clues that they won't need
to do this!)

Be sure to test your solution code. If the user clicks "View Solution" and then
"Submit", they should see your success message.

There's almost always more than one way to solve a coding challenge. Although your
validation code (see below) should allow all reasonable solutions to pass, the
`solution` code you provide should be the most straightforward option which
requires the least thorough understanding of JavaScript.

#### Validate the user's submitted code

Feedback is key to a positive learning experience. As the author of a tutorial, you'll need to give careful thought both to how you'll verify that your user has submitted successful code and to what mistakes they might make along the way. It's your responsibility to anticipate challenges and provide helpful clues accordingly.

To do this, you'll use the `validate` function found in the boilerplate, which takes this format:

`validate(result, ipfs)`


When the sample code area is evaluated, it must return a function, usually an
async function. The result of that function is passed to your validation
function as `result`.

Each time the user's code is evaluated, they get a new, clean, IPFS instance.
That instance is passed as the second argument, `ipfs`.

You may want to use both the `result` and `ipfs` values when building conditional statements to evalute the success or failure of the user's code submission. If needed, check out this primer on [using conditionals in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals).

Your `validate` function must return an object with one of two properties: `fail` or
`success`. Each property should be used to give a detailed message (as a string) either congratulating the user or explaining *why*
the sample code failed in order to help the user along.

```js
const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'You forgot to return a result :)' }
  } else if (result) {
    return { success: 'Happy Message!' }
  } else {
    return { fail: 'Sad but useful message :(' }
  }
}
```
Be sure to include conditionals that will catch common mistakes and provide useful clues.

If the object returned by your `validate` function the has the property `fail`, the message string you've provided will be shown highlighted in red, and the user will have the opportunity to update and resubmit their code. If it has the property `success`, the user will see the success message highlighted in green, and the "Submit" button will change into a "Next" button allowing them to advance to the next lesson.

If this is the last lesson in your tutorial, the user will see a "More Tutorials" button instead of a "Next" button. Please create a success message for your last lesson that notes that the user has completed the whole tutorial. For example, `Great job! You've completed this series of lessons!`)


##### Override external error messages (optional)

As you test your code, you may notice that you see error messages appear that are different from the ones you provided in your `validate` function. These might include syntax errors noted by our embedded code editor or errors returned by the IPFS API, both of which appear by default. Syntax errors can be very helpful for your user, and other errors might help you identify common errors you hadn't thought of.

If you'd like to replace a specific error message returned automatically with a moire user-friendly message created by you, add the attribute
`:overrideErrors="true"` to the Lesson (or FileLesson) component at the start of your Vue file like so:

```js
<Lesson // or FileLesson
    :overrideErrors="true"
    ...
/>
```

Within the `validate` function, add cases for the specific error messages
you need to override, as in this example:

```js
} else if (result && result.error.message === 'No child name passed to addLink') {
  // Forgot the file name and just used a directory as the path
  return { fail: 'Uh oh. It looks like you created a folder instead of a file. Did you forget to include a filename in your path?' }
}
```

You'll also need to add the following lines below your custom validation so that
external error messages you haven't specifically overridden will continue to be shown to the user to aid in troubleshooting:

```js
// Output the default error if we haven't caught any
return { error: result.error }
```

Note that most tutorial lessons will _not_ require the overriding of external
errors. If you have questions about whether to use this optional feature, please reach
out to the project maintainers for guidance.

##### Display results to the user (optional)

When the user submits their code successfully, they'll receive a success message you've provided in your `validate` function (see above). If you'd like to also show some data to the user to help them understand the results of their code, it's possible to add an additional step after code submission.

In the `validate` function, when returning either a *fail* or a *success*, add `log` and `logDesc` (optional) keys with values, as in this example:

```js
const ipfsFiles = ipfs.files.ls('/foo')

if (result === 'foo') {
  return { success: 'Happy Message!' }
} else if (result === 'bar') {
  return {
    success: 'You did it!',
    logDesc: 'Check out the data now stored in your IPFS instance:', // A description of the data you're displaying
    log: ipfsFiles // The data you want the user to see
  }
} else {
  return { fail: 'Sad but useful message :(' }
}
```

When you use this option, a new section will appear below the exercise box, showing your `logDesc` message followed by the `log` data.


#### Update routes and import statements in `src/main.js`

To ensure your lessons appear on the website (and in your local preview), you'll need to add routes and import statements for each lesson in `src/main.js`

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


#### Add your tutorial to `tutorials.json` and `courses.json`

Although the step above ensures that your lessons are available at specific URLs on the website, you'll also need to ensure that your tutorial appears in our course listings.

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

## Troubleshooting

### Clearing cached data from localStorage

In order to save the user's progress as they work, ProtoSchool uses [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to save cached code and lesson state between visits. This feature works when the user visits the site repeatedly in the same web browser, so long as they aren't using incognito or private mode. Although this solution doesn't work across browsers (a user would see a different history in Chrome than in Firefox, for example), we find that it enables us to provide a nicely customized experience for most users without requiring a login.

On occasion, while developing a lesson, you may want to view the site as though you're a first-time visitor for testing purposes. To do this, you have a few options:
- Open the site in an icognito or private window using your normal web browser
- Open the site in a web browser you haven't used before (Firefox if you normally use Chrome, etc.)
- Clear the localStorage in your main browser by opening the console in your inspector and entering the command `localStorage.clear()`, then refreshing your browser.

Note that your user history on the live website (https://proto.school) is different from that in your local testing environment (localhost), so deleting your cache in the development environment won't affect your history on the live site.

## License

ProtoSchool is licensed under the Apache-2.0 and MIT licenses. See [LICENSE.md](https://github.com/protoschool/protoschool.github.io/blob/master/LICENSE.md) for further detail.
