# Designing Effective ProtoSchool Tutorials

This guide will introduce you to the process of building a ProtoSchool tutorial. It covers the steps you'll need to take to build the files that create your lessons, using the platform we've built in VueJS.

This guide is the starting place for creating a ProtoSchool tutorial. It covers the process for proposing and outlining a new tutorial with community input and explains the skillset you'll need to build a tutorial using the ProtoSchool platform. Perhaps more importantly, it clarifies the scope of ProtoSchool and outlines some of the key elements of an effective learning experience, so that you can design the best possible tutorial for our users. Please be sure to read this document in full before you get started with development.

Before you build your tutorial, you'll need to have reviewed this guide and opened an issue in GitHub with your proposal so that the community can offer feedback. Once you have an outline there approved by the ProtoSchool team, you'll be ready to get started by following our [Developing Tutorials](DEVELOPING_TUTORIALS.md) guide.

---

## Table of Contents**
TBC

---
## Designing Effective ProtoSchool Tutorials

### ProtoSchool's guiding principles

In our roadmap repo, we've documented the [guiding principles](https://github.com/protoschool/roadmap#guiding-principles) of the ProtoSchool project, which we apply to both our online tutorials and local chapter events. Here are some key highlights that apply directly to tutorial development:

- ProtoSchool’s self-paced online tutorials are **beginner-friendly**. (Advanced content is presented only when we have intermediate content in place to provide **scaffolding** that bridges the content gap.)
- ProtoSchool offers a **cohesive** and **consistently-formatted** set of tutorials for learning about the decentralized web. (It doesn’t serve as a catch-all for all formats of educational content.)
- Online tutorials provide a **welcoming and inclusive environment** for all community members.

### Brainstorming tutorial ideas as a team

We're excited to add new tutorials to our collection, and we'd love your help brainstorming and building new content about decentralized web concepts and protocols.

Have an idea for a new tutorial? Start by looking at the [tutorial ideas](https://github.com/protoschool/protoschool.github.io/labels/new-tutorial) flagged with the "new tutorial" tag in the ProtoSchool issue queue. If there's a similar idea there already, join the conversation!

If you have an idea for a new tutorial that has not yet been proposed, please [open a new issue](https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=new-tutorial&template=tutorial-proposal.md&title=New+Tutorial%3A+%5BProposed+title%5D) so we can share feedback before you get started building. With the help of our guiding principles, we'll work together to make sure it fits _cohesively_ into the ProtoSchool curriculum and will encourage you to create a content outline that supports a _beginner-friendly_ learning experience with appropriate _scaffolding_.

Don't feel like you have the skills or time to build a tutorial yourself? Please still go ahead and share your idea! There may be another community member who can help out.

### The capabilities and limitations of our platform

A ProtoSchool tutorial is made up of a series of lessons. We currently support the following lesson types, which can be mixed and matched within a tutorial:
- Text-only lessons
- Multiple-choice lessons
- Code challenges (with or without file upload required)

You'll learn more about how to build each lesson type in the section of our Developing Tutorials guide on [building your lessons](DEVELOPING_TUTORIALS.md#build-your-lessons-repeat-for-each-lesson-in-the-tutorial).

#### Technical skills needed to build a tutorial

The text portions of all of our lessons are written in Markdown, which is a fairly simple way to style text on the web. [Learn more about Markdown formatting here.](https://guides.github.com/features/mastering-markdown/)

Whether or not you know how to code, you should be able to follow the instructions here to build a tutorial made up of **text-only** or **multiple-choice lessons** by using our boilerplate templates.

To build **code challenges**, you'll need to know JavaScript, both to provide the starter and solution code and to create validation code to evaluate the code submitted by the user. And of course you'll need to be familiar with the protocol or API that you're teaching, such as IPFS.

Although our tutorials and website are hosted within the Vue.js framework and use an embedded Monaco editor, we've done our best to provide enough guidance so that **you won't need any familiarity with Vue.js or Monaco** to build your own tutorial.

#### Browser-based code challenges

**All code challenges must run in JavaScript in the browser**; we don't currently support tutorials that run from the command line or in other coding languages. We believe that offering our tutorials directly in the browser, as opposed to via the command line, reduces the barrier to entry for our learners. (Do you remember when cloning a repo, installing dependencies, and using the terminal felt overwhelming? We do!)

In the context of lessons on IPFS, this means that our coding challenges teach js-ipfs API methods. You can help our learners who specialize in languages other than JavaScript by ensuring that you provide links to documentation on any complex JavaScript methods that are required, so that they can focus on learning IPFS rather than JavaScript in your tutorial.

#### Decentralized web protocols supported by our platform

##### IPFS
To support lessons on IPFS, **we create a new IPFS instance for the user each time they submit their code**. You'll be able to access that instance in your validation function to confirm the learner has submitted successful code. Notice that the IPFS instance is not maintained from one lesson to the next. That means that when you build a series of lessons as part of a series of steps, you'll usually need to include successful code that passes the previous lessons and let the user add new code for the new step you're teaching. Learn more about this approach in our [instructions for building code challenges](DEVELOPING_TUTORIALS.md#build-code-challenges-and-validation-in-your-vue-file-skip-for-text-only-lessons).

##### libp2p
Although libp2p runs in the background during IPFS lessons, we don't yet surface a libp2p instance that we can validate against. We hope to add that feature in the future! Check out [this issue](https://github.com/ProtoSchool/protoschool.github.io/issues/229) if you'd like to help.

##### Other decentralized web protocols
We're currently focused on improving our platform and growing our curriculum on IPFS. In the future, we envision adding support for other decentralized web protocols as well. We welcome your [suggestions for new features](https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=enhancement&template=feature-request.md&title=Feature%3A+%5BYour+idea%5D)!

### Creating an effective learner experience

braindump of more ideas to extrapolate on here...
- step-by-step, limited scope per lesson
- scaffolding, each lesson builds on the previous one
- limit the amount of text in each lesson
- limit coding language challenges, focus on protocol challenges (link to docs for complicated JS methods)
- provide actionable feedback in error messages for code challenges or multiple choice quizzes
- link to official documentation when referencing new methods
- state pre-reqs at start of tutorial, linking to other tutorials or learning materials
- use the resources page at the end of the tutorial to suggest next steps for further learning
- use real-world examples (kitten.gif, not foo/bar)
- be gender-neutral or use a variety of genders in your examples
- avoid slang/jargon for the sake of English language learners
- know your audience: don't mix super advanced and super beginner concepts in the same tutorial without scaffolding


## License

ProtoSchool is licensed under the Apache-2.0 and MIT licenses. See [LICENSE.md](https://github.com/protoschool/protoschool.github.io/blob/master/LICENSE.md) for further detail.
