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

import { appendFile } from 'fs'
import { createInterface } from 'readline'

import { info, error as _error } from 'npmlog'

import run from '../modules/run'
import { generateAuthUrl, getToken } from '../modules/googleapis/auth'

async function command (options) {
  const authUrl = generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  })

  info('googleapis', 'Authorize this app by visiting this url:', authUrl)

  const readlineInterface = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readlineInterface.question('Enter the code from that page here: ', (code) => {
    readlineInterface.close()
    getToken(code, (error, token) => {
      if (error) {
        return _error('googleapis', 'Error while trying to retrieve access token', error)
      }

      // Store the token to disk for later program executions
      appendFile(
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
            return _error('googleapis', error)
          }

          info('googleapis', 'Token stored to .env file')
        })
    })
  })
}

run(command)
