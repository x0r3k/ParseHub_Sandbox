const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

async function runParseProject() {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      data: qs.stringify({
        api_key: process.env.PARSE_API_KEY
      })
    };
    const response = await axios(`https://www.parsehub.com/api/v2/projects/${process.env.PROJECT_TOKEN}/run`, options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function getParseRunStatus(runToken) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      params: {
        api_key: process.env.PARSE_API_KEY
      }
    };
    const response = await axios(`https://www.parsehub.com/api/v2/runs/${runToken}`, options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function getParseRunData(runToken) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      params: {
        api_key: process.env.PARSE_API_KEY,
        format: 'json'
      }
    };
    const response = await axios(`https://www.parsehub.com/api/v2/runs/${runToken}/data`, options);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

function postprocessParseRunData(data) {
  const resultObject = {

  }
}

// runParseProject();
// getParseRunData('tWtjCECXr1dr');