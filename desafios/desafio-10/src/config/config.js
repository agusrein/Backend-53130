require('dotenv').config({ path: '.env.production' });

const configObject = {
  PUERTO: process.env.PUERTO,
  MONGO_URL: process.env.MONGO_URL,
  COOKIETOKEN: process.env.COOKIETOKEN,
  JWTKEY: process.env.JWTKEY,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
}

module.exports = configObject
