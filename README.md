# ProtoSchool

ProtoSchool is an educational community that teaches decentralized web protocols and tools
through online tutorials and local chapter events.

This repository is for the main ProtoSchool website, hosted at https://proto.school, where you can
explore our self-guided interactive tutorials.

For information on local chapter organizing, please visit our [organizing repo](https://github.com/protoschool/organizing).

For the project roadmap, objectives, and archived meeting notes, please visit our [roadmap repo](https://github.com/protoschool/roadmap).

## Building tutorials

Whether you have an idea for a new tutorial or are ready to start building one, you've come to the right place!

First, please read our [**Designing Tutorials**](DESIGNING_TUTORIALS.md) guide, which:
- introduces you to ProtoSchool's guiding principles
- explains the process of proposing a new tutorial topic and soliciting community input
- outlines some key elements of effective learning design so that you can create compelling content

Once you've submitted your proposal for feedback (as described in the [Designing Tutorials](DESIGNING_TUTORIALS.md) guide) and are ready to start building, please refer to our [**Developing Tutorials**](DEVELOPING_TUTORIALS.md) guide for detailed instructions on:
- setting up your local repo
- creating the Markdown and Vue.js files needed to compose your lessons
- validating user responses to code challenges or multiple-choice quizzes
- troubleshooting

## Running ProtoSchool locally

Just here to help someone proof a PR? Jump to our detailed [instructions for running the site locally](DEVELOPING_TUTORIALS.md#run-the-server-locally-to-preview-your-work) or follow the condensed steps below:

Clone the repo, install dependencies, check out the appropriate branch, and run the site locally:
```sh
> git clone https://github.com/ProtoSchool/protoschool.github.io.git
> cd protoschool.github.io
> npm install
> git checkout existing-branch-name-from-PR
> npm run serve
```

View the site on localhost at: http://localhost:3000/

## License

ProtoSchool is licensed under the Apache-2.0 and MIT licenses. See [LICENSE.md](https://github.com/protoschool/protoschool.github.io/blob/master/LICENSE.md) for further detail.
