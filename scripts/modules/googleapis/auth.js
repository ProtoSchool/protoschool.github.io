/*
    Create auth object for connecting with the Google APIs.
    All required information will be ready from env vars.
 */
import errorCode from 'err-code'

import { google } from 'googleapis'

if (!process.env.GOOGLE_CLIENT_ID) {
  throw errorCode(
    new Error('No config available. Add a .env file or make all the config available through env variables. Please check the docs at https://github.com/ProtoSchool/protoschool.github.io/tree/code/scripts'),
    'NO_CONFIG'
  )
}

const credentials = {
  installed: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS.split(',')
  }
}

if (!credentials.installed.client_id) {
  throw new Error('Failed to read the config from .env file. Check that all the credentials are set.')
}

const googleAuth = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
)

if (process.env.GOOGLE_ACCESS_TOKEN) {
  googleAuth.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    scope: process.env.GOOGLE_SCOPE,
    token_type: process.env.GOOGLE_TOKEN_TYPE,
    expiry_date: process.env.GOOGLE_EXPIRY_DATE
  })
}

export default googleAuth
