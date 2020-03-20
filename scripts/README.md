# ProtoSchool Scripts

This project depends on some remote sources for data:

- Events: Google Sheets, using [Google Sheets API](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)

The scripts in this directory are used to fetch the data and make it available to the Vue application to render the new content.

## Setup

To run the commands, some environment variables are needed on your local machine:

1.  Get the latest `.env` file contents from the ProtoSchool vault in Protocol Labs' `1Password` account.
2.  Create a `.env` file in the project's root directory with those contents.

Note that because `.env` is included in `.gitignore`, your local copy of the file will not be synced to GitHub, thereby keeping our credentials private.

A copy of the `.env` file is also stored in our Travis account and used to update event listings both when PRs are merged and when regularly scheduled cron jobs are run.

## Commands

### `npm run scripts:build:data`

As part of the build process (see [travis config](../.travis.yml)), we fetch all the data and write it to specific `static/*.json` files so the UI can read these JSON files and render the content.

In the output of this command you'll see the following statistics:
- `total events`: Number of events listed on the Google Sheet
- `events approved`: Number of events in the Google Sheet manually marked as approved (the ones that will be added to the JSON file and displayed on the website)
- `events rejected`: Number of events in the Google Sheet manually marked as rejected (these will not be added to the JSON file or displayed on the website)
- `events pending approval`: Number of events in the Google Sheet that have been submitted by event organizers but not yet manually marked as approved or rejected (these will _not_ be added to the JSON file or displayed on the website until they're reviewed)

**Note: All changes to event data must be made directly in Google Sheets.** You _cannot_ make changes to the website by overwriting data in `events.json`. This is because the script referenced here will be run both at the time your PR is merged and at regular intervals via cron jobs, thereby overwriting any local changes made to the `events.json` file.

To add new data sources:

- Add a new function to the `scripts/commands/build-data.js` script to be run in the build process.
- Any new environment variables need to be saved:
    -  in your local `.env` file
    -  in the `.env` record in the secure ProtoSchool vault in Protocol Labs' `1Password` account
    -  as environment variables in the [Travis CI settings](https://travis-ci.org/ProtoSchool/protoschool.github.io/settings)

#### `--debug`

Prints extra information when fetching and processing the data.

#### `--dry-run`

Data is fetched and processed, allowing you to see the statistics noted above, but is not saved into the JSON files.

### `npm run scripts:googleapis-generate-token`

Google APIs need authentication information in the form of a token that we need to generate, store and use.
This only needs to be done once when the Google API Project is setup.

However, if you need to update the token (to accommodate a new Google APIs project, additional permissions, etc), you will need to run this command to generate it again.

This command will append the new auth properties to the local `.env` file. After running it, be sure to copy the contents of the updated `.env` file to overwrite the current `.env` record in the secure ProtoSchool vault in Protocol Labs' `1Password` account.
