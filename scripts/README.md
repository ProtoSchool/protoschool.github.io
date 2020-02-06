# ProtoSchool Scripts

This project depends on some remote sources for data:

- Events: Google Spreadsheets, using [Google Sheets API](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)

The scripts created in the directory are used to fetch the data and make it available to the vue application to render the new content.

## Setup

To run the commands, some environment variables are needed:

- Get the latest `.env` file contents from PL's `1Password` account.
- Create the file `.env` file with the contents

## Commands

### `npm run scripts:build:data`

As part of the build process (see [travis config](../.travis.yml)), we fetch all the data and write it to specific `static/*.json` files so the UI can read these json files and render the content.

To add new data sources:

- Add a new function to the `scripts/commands/build-data.js` script to be ran in the build process.
- Any new environment variables need to be saved:
    -  in your local `.env` file
    -  in the secure vault in PL's `1Password` account
    -  added to [travis ci](https://travis-ci.org/ProtoSchool/protoschool.github.io/settings)

#### `--debug`

Prints extra information when fetching and processing the data.

#### `--dry-run`

Data is fetched, processed but not saved into the json files.

### `npm run scripts:googleapis-generate-token`

Google APIs need authentication information, for this we need to generate, store and use it.
This only needs to be done once when the Google API Project is setup.

But if you need to update the token (new Google APIs project, more permissions are needed, etc), you will need to generate it again.
This command will append the new auth properties to the local `.env` file. Make sure you save it to PL's `1Password` account as well.
