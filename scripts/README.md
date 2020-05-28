# ProtoSchool Scripts

## ProtoWizard (Tutorial Builder)

The ProtoWizard is a CLI (Command-Line Interface) that makes it easy to create the starter files and metadata needed for a new tutorial. You can build your full tutorial at once, creating your tutorial metadata (URL, description, etc.), lessons, and resources in one go. Alternatively, you can create your tutorial framework and then come back to add lessons and resources as you're ready.

You can start the wizard with the command:
`npm run scripts:wizard`

For a quicker shorthand, first install the wizard:
`npm run install-protowizard`
Once the wizard is installed, you'll be able to launch it repeatedly with the shortcut command:
`protowizard`

Learn more in our [Developing Tutorials](../../DEVELOPING_TUTORIALS.md) guide.

## Table of Contents Updates for Docs

The [Developing Tutorials](../../DEVELOPING_TUTORIALS.md) and [Designing Tutorials](../../DESIGNING_TUTORIALS.md) guides use [`markdown-toc`](https://www.npmjs.com/package/markdown-toc) to create their table of contents from Markdown headers of levels 2 - 6, replacing the content between the `<!-- toc -->` and `<!-- tocstop -->` comments. The script to update the ToCs on both files will be run automatically before any commit, so if you've changed one of these files and the ToC is updated by the script, those changes will be saved with your own.

To update one or more ToCs on demand (without automatically saving), you can run one of these commands:
  - `npm run build:docs:design` - update TOC in DESIGNING_TUTORIALS.md
  - `npm run build:docs:develop` - update TOC in DEVELOPING_TUTORIALS.md
  - `npm run build:docs` - update ToC in both files

## Event and Newsletter Data Import

This project depends on some remote sources for data:

- Events: Google Sheets, using [Google Sheets API](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)
- Newsletter: [Mailchimp API](https://mailchimp.com/developer/)

The scripts in the `build-data` directory are used to fetch the data and make it available to the Vue application to render the new content, as well as some other side effects.

### Setup

To run the commands, some environment variables are needed on your local machine:

1.  Get the latest `.env` file contents from the ProtoSchool vault in Protocol Labs' `1Password` account.
2.  Create a `.env` file in the project's root directory with those contents.

Note that because `.env` is included in `.gitignore`, your local copy of the file will not be synced to GitHub, thereby keeping our credentials private.

A copy of the `.env` file is also stored in our Travis account and used to update event listings both when PRs are merged and when regularly scheduled cron jobs are run.

### Commands

#### `npm run scripts:build:data`

As part of the build process (see [travis config](../.travis.yml)), we fetch all event data for submitted events and write the data for approved events to specific `static/*.json` files so the UI can read these JSON files and render the content as event listings. Additionally, we add new event organizers to our Mailchimp audience to subscribe them to our newsletter.

Output example: `npm run scripts:build:data -- --dry-run=false`

```bash
info run { dryRun: false, debug: false }
info modules:data:events fetch: fetching spreadsheet from Google
info modules:data:events spreadsheet successfully fetched

┌─────────────────┬─────────┬──────────┬──────────┬─────┐
│                 │ Pending │ Approved │ Rejected │ All │
├─────────────────┼─────────┼──────────┼──────────┼─────┤
│ Past Events     │ 0       │ 9        │ 1        │ 10  │
├─────────────────┼─────────┼──────────┼──────────┼─────┤
│ Upcoming Events │ 1       │ 1        │ 0        │ 2   │
├─────────────────┼─────────┼──────────┼──────────┼─────┤
│ All             │ 1       │ 10       │ 1        │ 12  │
└─────────────────┴─────────┴──────────┴──────────┴─────┘

info modules:data:events total events submitted: 12
info modules:data:events save: saving 10 approved events to src/static/events.json
info build:data:events events have been processed successfully - 10 events saved
info buid:data:mailchimp Found 12 audience members.
info buid:data:mailchimp Found 12 mailchimp audience members.
info modules:data:events getOrganizers: computing organizers from events list.
info buid:data:mailchimp Found 4 event organizers.
info buid:data:mailchimp No members to update.
```

**Note: All changes to event data must be made directly in Google Sheets.** You _cannot_ make changes to the website by overwriting data in `events.json`. This is because the script referenced here will be run both at the time your PR is merged and at regular intervals via cron jobs, thereby overwriting any local changes made to the `events.json` file.

To add new data sources:

- Add a new function to the `scripts/commands/build-data.js` script to be run in the build process.
- Any new environment variables need to be saved:
    -  in your local `.env` file
    -  in the `.env` record in the secure ProtoSchool vault in Protocol Labs' `1Password` account
    -  as environment variables in the [Travis CI settings](https://travis-ci.org/ProtoSchool/protoschool.github.io/settings)

##### `--debug` (default: false)

Prints extra information when fetching and processing the data.

##### `--dry-run` (default: true)

Data is fetched and processed, allowing you to see the statistics noted above, but is not saved into the JSON files.

Passing `--dry-run=false` will change this value to `false` and data will be fetched and saved (used in CI).

The default value `true` means that the default command will not make any changes to event listings or newsletter subscriptions. In "production" we specify `--dry-run=false` to make the necessary changes.


#### `npm run scripts:googleapis-generate-token`

Google APIs need authentication information in the form of a token that we need to generate, store and use.
This only needs to be done once when the Google API Project is setup.

However, if you need to update the token (to accommodate a new Google APIs project, additional permissions, etc), you will need to run this command to generate it again.

This command will append the new auth properties to the local `.env` file. After running it, be sure to copy the contents of the updated `.env` file to overwrite the current `.env` record in the secure ProtoSchool vault in Protocol Labs' `1Password` account.
