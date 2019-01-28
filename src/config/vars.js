const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  maxKNTDaily: 100000,
  maxKNT: 250,
  delegationsAccount: 'knacksteem.org',
  steemApi: process.env.STEEM_API || 'https://api.steemjs.com',
  botAccount: process.env.BOT_ACCOUNT || 'knacksteem.org',
  botKey: process.env.BOT_KEY,
  sc2_app: process.env.SC2_APP || 'knacksteem.app',
  sc2_callback: process.env.SC2_CALLBACK || 'http://localhost:3030',
  master_user: process.env.MASTER_USER || 'knowledges',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
