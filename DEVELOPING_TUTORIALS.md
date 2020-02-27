# Developing ProtoSchool Tutorials

This guide will introduce you to the process of building a ProtoSchool tutorial. It covers the steps you'll need to take to build the files that create your lessons, using the platform we've built in VueJS.

**Before you get started here, please be sure to read our documentation on [Designing Tutorials](DESIGNING_TUTORIALS.md) in its entirety.** There you'll learn about the process for proposing and outlining a new tutorial with community input, as well as some of the key elements of an effective learning experience.

**Before you start building your tutorial, you should have an open issue in this repo with your proposal/outline, with feedback and approval from the ProtoSchool team.**

Ready to get started? Read on!

---

**Table of Contents**

<!-- toc -->

- [Developing ProtoSchool Tutorials](#developing-protoschool-tutorials)
  - [Developing Tutorials](#developing-tutorials)
    - [Run the server locally to preview your work](#run-the-server-locally-to-preview-your-work)
    - [Create a directory for your tutorial](#create-a-directory-for-your-tutorial)
    - [Build your lessons (repeat for each lesson in the tutorial)](#build-your-lessons-repeat-for-each-lesson-in-the-tutorial)
      - [Create lesson files](#create-lesson-files)
        - [Lesson text file (with optional images)](#lesson-text-file-with-optional-images)
        - [JavaScript file](#javascript-file-skip-for-text-only-lessons)
        - [Exercise text file (skip for text-only and multiple-choice lessons)](#exercise-text-file-skip-for-text-only-and-multiple-choice-lessons)
        - [Useful concepts text file (optional)](#useful-concepts-text-file-optional)
      - [Create multiple-choice quizzes in your JavaScript file (skip for coding exercises and text-only lessons)](#create-multiple-choice-quizzes-in-your-javascript-file-skip-for-coding-exercises-and-text-only-lessons)
      - [Build code challenges and validation in your JavaScript file (skip for text-only and multiple-choice lessons)](#build-code-challenges-and-validation-in-your-javascript-file-skip-for-text-only-and-multiple-choice-lessons)
        - [Provide the starting code for your exercise](#provide-the-starting-code-for-your-exercise)
        - [Provide the simplest solution to your exercise](#provide-the-simplest-solution-to-your-exercise)
        - [Validate the user's submitted code](#validate-the-users-submitted-code)
          - [Work with uploaded files (for file upload lessons only)](#work-with-uploaded-files-for-file-upload-lessons-only)
          - [Create success and failure messages](#create-success-and-failure-messages)
          - [Override external error messages (optional)](#override-external-error-messages-optional)
          - [Display results to the user (optional)](#display-results-to-the-user-optional)
    - [Manage your tutorial's metadata and routing](#manage-your-tutorials-metadata-and-routing)
      - [Add your tutorial to `static/tutorials.json`](#add-your-tutorial-to-statictutorialsjson)
      - [Add your tutorial to `static/courses.json`](#add-your-tutorial-to-staticcoursesjson)
    - [Submit a pull request](#submit-a-pull-request)
  - [Troubleshooting](#troubleshooting)
    - [Clearing cached data from localStorage](#clearing-cached-data-from-localstorage)
    - [Renaming a tutorial after it has been published](#renaming-a-tutorial-after-it-has-been-published)
    - [Text of lesson or exercise not displayed](#text-of-lesson-or-exercise-not-displayed)
  - [Detailed Docs](#detailed-docs)
    - [Lesson File](#lesson-file)
  - [License](#license)

<!-- tocstop -->

---

## Developing Tutorials

### Run the server locally to preview your work

1. [Clone this repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to your computer:

```sh
> git clone https://github.com/ProtoSchool/protoschool.github.io.git
```

2. Change into the new directory created:

```sh
> cd protoschool.github.io
```

3. Install dependencies using NPM:

```sh
> npm install

```

4. Check out the appropriate branch:

If creating a new tutorial, create a new branch before making any changes, starting with our current website code (the `code` branch):

```sh
> git checkout code
> git checkout -b new-branch-name
```
If proofing a PR for someone else, check out their branch (you'll see its name listed in the PR):

```sh
> git checkout existing-branch-name
```

5. Run the dev server locally:

```sh
> npm run serve
```

6. Open a web browser to the following address to preview your work: http://localhost:3000/#/

Vue will update your localhost preview automatically as you make changes. However, you won't be able to see any newly added lessons until you've updated the appropriate routes and import statements, as described below.


### Create a directory for your tutorial

Each tutorial in ProtoSchool has a 4-digit ID and a corresponding directory. To determine the right ID for your new tutorial, first navigate to the `src/tutorials` directory and list its contents:


```sh
> cd src/tutorials
> ls
0001-data-structures
0002-basics
0003-blog
0004-mutable-file-system
boilerplates
```
The number used as your tutorial's ID and directory name should be one higher than the last numbered directory you see listed. (In the example above, seeing that `0004-*` is the last numbered directory, you would create a new directory called `0005-tutorial-short-title`, where the text after the id will be the identifier on the tutorial URL. More on this ahead!)

Create a directory with the appropriate ID, for example:

```sh
> mkdir 0005-tutorial-short-title
```

### Build your lessons (repeat for each lesson in the tutorial)

Each **tutorial** in ProtoSchool is made up of multiple **lessons**.

Currently there are three lesson formats available, which you may mix and match within your tutorial:
- A standard lesson with a coding exercise (the most common)
- A lesson with a coding exercise that requires a file upload
- A text-only lesson with no code challenge
- A lesson that concludes with a multiple-choice quiz

Follow the steps below to create each lesson.

#### Create lesson files

Depending on which lesson format you've chosen, you'll need to create 2-4 files within your project directory. Check the table below to see which files you need, then read on for instructions on how to create them.

| File | Sample Filename | Standard Lesson with Coding Exercise | Lesson with Coding Exercise and File Upload | Multiple-Choice Lesson | Text-Only Lesson
| :--- | :---: | :---: | :---: | :---: | :---: |
| A JavaScript file that provides **required metadata** (e.g. code) for your lesson and, when relevant, the **default code and validation for a coding exercise** or **answer selections for multiple-choice quizzes** |`01.js`| Required | Required | Required | Not Used |
| A markdown file containing the **text of the lesson** (your educational content)|`01.md`| Required | Required | Required | Required |
| A Markdown file containing the **text of the assignment shown in the exercise box**|`01-exercise.md`| Required | Required | Not Used | Not Used |
| A Markdown file containing the **text of the optional useful concepts box**|`01-concepts.md`| Optional | Optional | Optional | Optional |

In the example below, four files stored in the `tutorials/0005-tutorial-short-title` directory work together to create the second lesson in that tutorial.

![screenshot](public/lesson_sources.png)

Not familiar with Markdown? It's a fairly simple way to style text on the web. [Learn more about Markdown formatting here.](https://guides.github.com/features/mastering-markdown/)

Not familiar with JavaScript? You won't need it to create text-only lessons, and you'll only need to do some simple text replacements to set up questions and answers for multiple-choice quizzes. However, if you want to create code challenges (with or without file upload), you _will_ need to use JavaScript extensively to set up your default and solution code and validation.


##### Lesson text file (with optional images)



Create a `.md` file using the boilerplate and add the Markdown-formatted text of the lesson itself (your educational content). The name of this file should be the 2-digit lesson number.

For example (for Lesson 01 of Tutorial 0005):

```sh
> cp boilerplates/boilerplate.md 0005-tutorial-short-title/01.md
```

If you want to add images to your Markdown file, place them in the `public/tutorial-assets` directory, with the following naming convention:

`T<4-digit-tutorial-id>L<2-digit-lesson-number>-<imageName>`, such as `T0001L05-diagram.svg`.

Then in your lesson Markdown file, you can either add it with regular Markdown:

```
![Description of the image](tutorial-assets/T0001L01-diagram.svg)
```

...or with regular HTML, if you need to set the image size:

```html
<img src="tutorial-assets/T0001L01-diagram.svg" width="300px" height="150px" />
```

##### JavaScript file (skip for text-only lessons)

Select the appropriate boilerplate JavaScript file for your lesson from the `src/tutorials/boilerplates` directory:

- `boilerplate-code.js` for a lesson with a coding exercise which does not require a file upload
- `boilerplate-file-upload.js` for a lesson with a coding exercise that requires a file upload
- `boilerplate-multiple-choice.js` for a lesson with a multiple-choice quiz

Copy that boilerplate into the tutorial directory you created earlier (e.g. `0005-tutorial-short-title`) and rename it to the 2-digit number of the lesson.

For example, to create a JavaScript file for a standard coding exercise as Lesson 01 of Tutorial 0005 (while still in `src/tutorials`):

```sh
> cp boilerplates/boilerplate-code.js 0005-tutorial-short-title/01.js
```

Use this file to set up your default code and validation, as described later in these instructions.

##### Exercise text file (skip for text-only and multiple-choice lessons)

If your lesson includes a coding exercise, create a second `.md` file and add the markdown-formatted text that provides the assignment text for the exercise box. The name of this file should match the 2-digit lesson number used previously, with `-exercise` appended.

For example (for Lesson 01 of Tutorial 0005):

```
src/tutorials/0005-tutorial-short-title/01-exercise.md
```

##### Useful concepts text file (optional)

Occasionally you may want to add a _useful concepts_ box defining key terminology, if this can't easily be done in-line. If you'd like to do this, create another `.md` file that provides the text for that _useful concepts_ box. The name of this file should match the 2-digit lesson number used previously, with `-concepts` appended. (This step is optional.)

For example (for Lesson 01 of Tutorial 0005):

```
src/tutorials/0005-tutorial-short-title/01-concepts.md
```

#### Create multiple-choice quizzes in your JavaScript file (skip for coding exercises and text-only lessons)

When creating a multiple-choice lesson, you'll use your JavaScript file to define the question and its answer choices.

The `question` value must be a string:

```js
const question = "What's the meaning of life, the universe, and everything?"
```

 The `choices` variable must be an array of objects, one for each answer the learner may select. Each object in the array must contain three keys and their respective values:
 - `answer` (a string)
 - `correct` (a boolean: `true` if the answer is correct and `false` if it's wrong)
 - `feedback` (a string displaying a helpful error message for a wrong answer or a congratulatory message for a correct answer)

```js
 const choices = [
   {
     answer: 'An incorrect answer',
     correct: false,
     feedback: 'Oops. Here\'s some clue about why that answer is wrong.'
   },
   {
     answer: 'A correct answer.',
     correct: true,
     feedback: 'Great job!'
   },
   {
     answer: 'A different incorrect answer',
     correct: false,
     feedback: 'Sorry, here\'s some clue about why this choice is wrong.'
   }
 ]
 ```

Please provide 3-5 answer choices per question. **You may only provide _one_ correct choice.**

The answer choices will be presented in the order in which you list them. Be sure to vary the position of the correct answer from lesson to lesson.

The `feedback` provided for each choice will be shown highlighted in red if incorrect or in green if correct, and the user will be able to advance to next lesson once they've made the right selection.

#### Build code challenges and validation in your JavaScript file (skip for text-only and multiple-choice lessons)

If you are creating a lesson with a code challenge (whether or not it requires file upload), you'll need to provide default code and set up validation in the lesson's JavaScript file. The basic template you need to accomplish this is provided in the boilerplate file you selected earlier.

##### Provide the starting code for your exercise

`code` is a string property. The value you set for `code` in your JavaScript file will
be used to populate the code editor when the user first visits the page. (If you forget to set this, a default will be used, but your exercise won't be very useful!)

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
built on between exercises. You will often need to pre-populate in your lesson the
correct solution to a previous lesson or lessons, so that the current exercise can
test adding only the most recent method taught.

You should also think about how you might provide support for programming language
challenges and limit the assignment to executing methods that practice your lesson
content.

Remember that you can add comments to your default code to orient the user, such as:

```js
// your code goes here
```

##### Provide the simplest solution to your exercise

`solution` is a string property. The value you set for `solution` in your JavaScript
file will be used to populate the code editor if the user clicks the "View
Solution" option. (We hope you'll have provided enough clues that they won't need to do this!)

Be sure to test your solution code. If the user clicks "View Solution" and then "Submit", they should see your success message.

There's almost always more than one way to solve a coding challenge. Although your
validation code (see below) should allow all reasonable solutions to pass, the
`solution` code you provide should be the most straightforward option which
requires the least thorough understanding of JavaScript.

##### Validate the user's submitted code

Feedback is key to a positive learning experience. As the author of a tutorial, you'll need to give careful thought both to how you'll verify that your user has submitted successful code and to what mistakes they might make along the way. It's your responsibility to anticipate challenges and provide helpful clues accordingly.

To do this, you'll use the `validate` function found in the boilerplate, which takes this format:

`validate(result, ipfs)`

When the sample code area is evaluated, it must return a function, usually an
async function. The result of that function is passed to your validation
function as `result`.

Each time the user's code is evaluated, they get a new, clean, IPFS instance.
That instance is passed as the second argument, `ipfs`.

You may want to use both the `result` and `ipfs` values when building conditional statements to evaluate the success or failure of the user's code submission. If needed, check out this primer on [using conditionals in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals).

###### Work with uploaded files (for file upload lessons only)

By using the lesson type `file-upload`, which comes included in the `boilerplate-file-upload.js` template, you can create a lesson which requires the user to upload files before completing a code challenge.

![screenshot](public/file_upload.png)

The `run` function in the code challenge takes an argument `files`, which is the array of uploaded files.

```js
const run = async (files) => {
  /* remove the '//' on the line below to complete this challenge */
}
```

Behind the scenes, the uploaded files have been saved as `window.uploadedFiles` for use both in your user's code and in your own validation. In your `validate` function, we recommend saving the files to a variable and allowing for the fact that they may not be present. For example:

```js
const uploadedFiles = window.uploadedFiles || false
```

Remember that these files are stored as browser file objects. Reference the [Files documentation](https://developer.mozilla.org/en-US/docs/Web/API/File#Properties) to see what properties are available to both you and the user, including `name` and `type`.

If the user proceeds to the next lesson without refreshing their browser, the same files will remain available to them. However, they may also choose to click "Start Over" and upload different files. The user will be unable to click "Submit" until files have either been selected from their machine or carried over from a previous lesson.

###### Create success and failure messages

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

If the object returned by your `validate` function has the property `fail`, the message string you've provided will be shown highlighted in red, and the user will have the opportunity to update and resubmit their code. If it has the property `success`, the user will see the success message highlighted in green, and the "Submit" button will change into a "Next" button allowing them to advance to the next lesson.

You may (optionally) use [markdown formatting](https://guides.github.com/features/mastering-markdown/) in your `fail` or `success` messages. For example, the following validation code:

```js
} else if (result && !result.hash) {
  return { fail: "That result doesn't look right. Are you sure you ran the `stat` method on your empty root directory?" }
}
```

...would produce this user-facing message:

![screenshot](public/markdown_error.png)

If this is the last lesson in your tutorial, please create a success message that notes that the user has completed the whole tutorial. For example, `Great job! You've completed this series of lessons!`)

###### Override external error messages (optional)

As you test your code, you may notice that you see error messages appear that are different from the ones you provided in your `validate` function. These might include syntax errors noted by our embedded code editor or errors returned by the IPFS API, both of which appear by default. Syntax errors can be very helpful for your user, and other errors might help you identify common errors you hadn't thought of.

If you'd like to replace a specific error message returned automatically with a more user-friendly message created by you, use the option
`overrideErrors: true` in the `options` object:

```js
const options = {
    overrideErrors: true
}
```

Then, within the `validate` function, add cases for the specific error messages
you need to override, as in this example:

```js
} else if (result instanceof Error && result.message === 'No child name passed to addLink') {
  // Forgot the file name and just used a directory as the path
  return {
    fail: 'Uh oh. It looks like you created a directory instead of a file. Did you forget to include a filename in your path?',
    overrideError: true
  }
}
```

The `overrideError` attribute lets us know that you don't want the original error to be shown. If it is missing (or is not set to `true`) and the result of the user code is an error, the result of your validation will be ignored in order to show the original error.

The value of the `fail` attribute must be the string you'd like displayed to the user instead of the built-in error message you're overriding. As is true for all other success and failure messages, you may (optionally) choose to use Markdown formatting in your message string.

Be sure to adapt your test case so that it works within the context of your other conditionals to meet your validation needs.

Note that most tutorial lessons will _not_ require the overriding of external
errors. If you have questions about whether to use this optional feature, please reach
out to the project maintainers for guidance.


###### Display results to the user (optional)

When the user submits their code successfully, they'll receive a success message you've provided in your `validate` function (see above). If you'd like to also show some data to the user to help them understand the results of their code, it's possible to add an additional step after code submission.

In the `validate` function, when returning either a `fail` or a `success`, you can optionally add `log` and `logDesc` keys with values, as in this example:

```js
const ipfsFiles = ipfs.files.ls('/foo')

if (result === 'foo') {
  return { success: 'Happy Message!' }
} else if (result === 'bar') {
  return {
    success: 'You did it!', // A string, which can optionally include markdown formatting
    logDesc: 'Check out the current value of `CID`:', // A description of the data you're displaying (a string, which can optionally include markdown formatting)
    log: ipfsFiles // The data you want the user to see (a JSON object or a string)
  }
} else {
  return { fail: 'Sad but useful message :(' }
}
```

When you use this option, a new section will appear below the exercise box, showing your `logDesc` message followed by the `log` data.

Note that you may (optionally) use [markdown formatting](https://guides.github.com/features/mastering-markdown/) in both your `fail` or `success` values and your `logDesc` value. For example, the following validation code:

```js
return {
  fail: 'Looks like you edited the `ls` code to list something other than the root directory. Please try again, editing only the section of code indicated.',
  logDesc: 'Here\'s what your `ls` command shows' + returnedDirectoryMsg + ':',
  log: JSON.stringify(result, null, 2)
}
```

... would produce this formatted result for the user:

![screenshot](public/markdown_error_logdesc_log.png)


### Manage your tutorial's metadata

There are a few administrative steps you need to take to ensure that all of your lessons appear on our site, along with a landing page and resources page.

#### Add your tutorial to `static/tutorials.json`

In `static/tutorials.json`, add a new key for your tutorial and fill in the appropriate values, as in the example below.

```json
"0005": {
  "url": "tutorial-short-title",
  "redirectUrls": [],
  "project": "ipfs",
  "title": "Your short tutorial title",
  "description": "Your tutorial description",
  "resources": [
    {
      "title": "Video title",
      "link": "https://youtu.be/videoid",
      "type": "video",
      "description": "Description of video"
    },
    {
      "title": "Documentation 1",
      "link": "https://docs.domain.io",
      "type": "docs"
    }
  ]
},
```

The _key_ must match your tutorial's ID and the name of the directory where you've been creating your files.

The `title` of your tutorial will be seen in course listings on our tutorials page, your tutorial's table of contents, and anywhere else your tutorial is featured.

![screenshot](public/title-in-toc.png)

![screenshot](public/title-in-featured-tutorials.png)

The `url` will appear in the URL of your tutorial landing page and lessons. For example,  `http://proto.school/#/short-tutorial-title/01`. In most cases this will match your tutorial title, but you may find that you need to make it shorter. Note that this URL will also be used to create the abbreviated title that is shown in the breadcrumb navigation and the small header at the top of each page of your tutorial.

![screenshot](public/url-breadcrumb-header.png)

Pay special attention to the `resources` array shown above, which will be used to create a pre-styled `Resources` page at the end of your tutorial. Each object in this array represents one recommended resource, and should include a `title`, `link`, `type` (which appears as a tag), and optional `description` of that resource. The details you provide will be automatically populated into your `Resources` lesson, as in the example below:

![screenshot](public/resources.png)

Examples of meaningful resource `type`s include: `docs`, `demo`, `tutorial`, `article`, `video`, and `website`.

Be sure to include any ProtoSchool tutorials that would provide a nice follow-on to your own content. Be sure to use the type `tutorial` for these, and they will automagically receive an extra callout as ProtoSchool tutorials when the page renders, like so:

![screenshot](public/protoschool_resource.png)

#### Add your tutorial to `static/courses.json`

In `static/courses.json`, add the tutorial key that you used in `static/tutorials.json` to the `all` array so it will appear in the Tutorials page. For example, to continue with the same example shown above, you would change this:

```json
{
  "all": ["0001", "0002", "0003"],
  "featured": ["0001", "0002", "0003"]
}
```

...to this:

```json
{
  "all": ["0001", "0002", "0003", "0005"],
  "featured": ["0001", "0002", "0003"]
}
```

The project maintainers will take care of making any updates needed to ensure your project is featured in any relevant course listings elsewhere on our site.

### Submit a pull request

Ready to submit your new tutorial for feedback?

Before submitting new content, please make sure to run `npm run lint`, as a pull request will be rejected if there are any linting errors reported. (New to linting? It's the technical equivalent of grammar- and spell-checking, and will flag any programming errors, bugs, or stylistic errors in your code.)

Once you've addressed any linting errors, ensure all of your commits have been pushed to your branch, then [submit a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)  on GitHub to merge your branch into our default `code` branch. (If [creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork), please check the box to allow edits from maintainers.)

## Troubleshooting

### Clearing cached data from localStorage

In order to save the user's progress as they work, ProtoSchool uses [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to save cached code and lesson state between visits. This feature works when the user visits the site repeatedly in the same web browser, so long as they aren't using incognito or private mode. Although this solution doesn't work across browsers (a user would see a different history in Chrome than in Firefox, for example), we find that it enables us to provide a nicely customized experience for most users without requiring a login.

On occasion, while developing a lesson, you may want to view the site as though you're a first-time visitor for testing purposes. To do this, you have a few options:
- Open the site in an incognito or private window using your normal web browser
- Open the site in a web browser you haven't used before (Firefox if you normally use Chrome, etc.)
- Clear the localStorage in your main browser by opening the console in your inspector and entering the command `localStorage.clear()`, then refreshing your browser.

Note that your user history on the live website (https://proto.school) is different from that in your local testing environment (localhost), so deleting your cache in the development environment won't affect your history on the live site.

### Renaming a tutorial after it has been published

1. In the `src/static/tutorials.json` file, rename `title` to the new desired title.
1. Add old tutorial `url` value to the `redirectUrls` attribute. (e.g. `"redirectUrls": ["old-tutorial-short-title"]`)
1. Update `url` with the new name.
1. Rename folder `src/tutorials/xxxx-old-tutorial-short-title` to the new url. (e.g. `src/tutorials/xxxx-new-tutorial-short-title`)

That's it! Next time you run ProtoSchool the tutorial should be renamed and users will still have access to the status of their lesson progress. If a user tries to access the old URL for your tutorial or one of its lessons, they'll be redirected to the tutorial landing page at its new URL.

### Text of lesson or exercise not displayed

If you're unable to see the text of your lesson or exercise when previewing the website, one of your Markdown files (*.md or *-exercise.md) may not be loading correctly. You can use the `DEBUG=true` option to get warnings in the console. To enable it, run:

```sh
DEBUG=true npm start
```

Check your browser dev tools for warning logs.

## Detailed Docs

### Lesson file

Lesson files should be put in the folder `src/tutorials/xxxx-tutorials-short-title` with the appropriate number (e.g., `01.js`).

**Exportable properties**:

- `validate(result, ipfs)`: Function - mandatory
- `solution`: String - mandatory
- `code`: String - optional
- `modules`: Object - optional
- `options`: Object - optional
    - `overrideErrors`: Boolean - default is `false`
    - `createTestFile`: Boolean - default is `false`
    - `createTestTree`: Boolean - default is `false`

## License

ProtoSchool is licensed under the Apache-2.0 and MIT licenses. See [LICENSE.md](https://github.com/protoschool/protoschool.github.io/blob/master/LICENSE.md) for further detail.
