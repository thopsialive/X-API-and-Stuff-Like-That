// Importing Required Modules
require('dotenv').config();
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const fs = require('fs');

// Initialize OAuth 1.0a
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY, // Read from environment variable
    secret: process.env.TWITTER_API_SECRET // Read from environment variable
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

// Token Configuration
const token = {
  key: process.env.TWITTER_ACCESS_TOKEN, // Read from environment variable
  secret: process.env.TWITTER_ACCESS_SECRET // Read from environment variable
};

// User ID API Endpoint
const url = 'https://api.twitter.com/2/users/788898706586275840?user.fields=public_metrics';

// Fetching Twitter Follower Count
const fetchTwitterFollowerCount = async () => {
  const requestData = {
    url,
    method: 'GET',
  };

  // OAuth header
  const headers = oauth.toHeader(oauth.authorize(requestData, token));
  headers['User-Agent'] = 'v2UserLookupJS';

  // Handling Response
  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);

  // Extract the metrics
  const metrics = data?.data?.public_metrics;

  // Write the metrics to the environment file
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `METRICS=${JSON.stringify(metrics)}\n`);
};

fetchTwitterFollowerCount().catch(err => console.error(err));
