const fetch = require('node-fetch');

const {
  DISCOVERY
} = process.env;

exports.handler = async (event, context) => {
  const q = event.queryStringParameters.q || '';
  return fetch(`${DISCOVERY}/select?q=${q}&wt=json`)
    .then(response => response.json())
    .then(data => ({
        statusCode: 200,
        body: JSON.stringify(data)
      })
    )
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
