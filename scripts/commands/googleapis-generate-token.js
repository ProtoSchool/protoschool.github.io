/*
 Generate token for Google APIs requests and writes them into the .env file
 Docs reference: https://developers.google.com/sheets/api/quickstart/nodejs
 The following code has been adapted from the the documentation above

 .env file required with the initial credentials provided by Google APIs

 Example:

 # google apis credentials

 GOOGLE_CLIENT_ID=""
 GOOGLE_PROJECT_ID=""
 GOOGLE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
 GOOGLE_TOKEN_URI="https://oauth2.googleapis.com/token"
 GOOGLE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
 GOOGLE_CLIENT_SECRET=""
 GOOGLE_REDIRECT_URIS=["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
 */

const fs = require('fs')
const readline = require('readline')

const log = require('npmlog')

const run = require('../modules/run')
const googleAuth = require('../modules/googleapis/auth')

async function command (options) {
  const authUrl = googleAuth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  })

  log.info('googleapis', 'Authorize this app by visiting this url:', authUrl)

  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readlineInterface.question('Enter the code from that page here: ', (code) => {
    readlineInterface.close()
    googleAuth.getToken(code, (error, token) => {
      if (error) {
        return log.error('googleapis', 'Error while trying to retrieve access token', error)
      }

      // Store the token to disk for later program executions
      fs.appendFile(
        '.env',
        `
        # google apis token

        GOOGLE_ACCESS_TOKEN="${token.access_token}"
        GOOGLE_REFRESH_TOKEN="${token.refresh_token}"
        GOOGLE_SCOPE="${token.scope}"
        GOOGLE_TOKEN_TYPE="${token.token_type}"
        GOOGLE_EXPIRY_DAT=${token.expiry_date}`,
        (error) => {
          if (error) {
            return log.error('googleapis', error)
          }

          log.info('googleapis', 'Token stored to .env file')
        })
    })
  })
}

run(command)
