import util from 'util';
import request from 'request';
const requestPromise = util.promisify(request);
import open from 'open';
import express from 'express';
import { getDateStringForDaysAgo, formatDateStringShort } from './helpers.js';
import { getClientCredentials, setToken } from './config.js';
const { clientId, clientSecret, token } = await getClientCredentials();
const redirectUri = 'http://localhost:3000/callback';
const encodedRedirectUri = encodeURIComponent(redirectUri);

export const requestSelectAccount = async () => {
  const options = {
    method: 'GET',
    url: 'https://rest.tsheets.com/api/v1/authorize',
    qs: {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state: 'TSHEETSCLI',
    },
    headers: {}
  };

  const { body: authorizeBody } = await requestPromise(options);

  console.log(`\nOpening browser to sign you in...\n`);

  const app = express();
  const server = app.listen(3000);
  app.get('/', function (req, res) {
    res.write(authorizeBody);
    res.end('');
  });

  app.get('/callback', async function (req, res) {
    res.write('<html><head></head><body><p>Signed in successfully! You can close this browser tab.</p></body></html>');

    var options = {
      method: 'POST',
      url: 'https://rest.tsheets.com/api/v1/grant',
      headers: {},
      form: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code,
        redirect_uri: encodedRedirectUri
      }
    };

    const { body: grantBody } = await requestPromise(options);

    const { access_token } = JSON.parse(grantBody);

    console.log(`\nSaving your access token...\n`);
    await setToken(access_token);

    await requestUser();

    server.close();
    res.end('');

  });

  await open('http://localhost:3000');
}

export const requestUser = async () => {
  const options = {
    method: 'GET',
    url: 'https://rest.tsheets.com/api/v1/current_user',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };

  const { body: userBody } = await requestPromise(options);
  const data = JSON.parse(userBody);
  const user = data.results.users[Object.keys(data.results.users)[0]];
  return user;
}

export const requestStatusByUser = async ({ id }) => {
  const UserId = id;
  const queryStartDateString = await getDateStringForDaysAgo(7);
  const queryStartDateStringShort = await formatDateStringShort(queryStartDateString);
  const options = {
    method: 'GET',
    url: 'https://rest.tsheets.com/api/v1/timesheets',
    qs: {
      user_ids: UserId,
      start_date: queryStartDateStringShort,
      on_the_clock: 'both',
    },
    headers:
    {
      'Authorization': `Bearer ${token}`,
    }
  };
  const { body: timesheetsBody } = await requestPromise(options);
  const data = JSON.parse(timesheetsBody);
  const timesheets = data.results.timesheets;
  const timesheetsKeys = Object.keys(timesheets);
  const status = timesheets[timesheetsKeys[timesheetsKeys.length - 1]];
  return status;
}

export const requestJobsByStatus = async (status) => {
  const options = {
    method: 'GET',
    url: 'https://rest.tsheets.com/api/v1/jobcodes',
    qs: {
      active: 'true'
    },
    headers:
    {
      'Authorization': `Bearer ${token}`,
    }
  };

  if (status.on_the_clock) {
    options.qs.ids = status.jobcode_id;
  }

  const { body: jobcodesBody } = await requestPromise(options);
  const data = JSON.parse(jobcodesBody);
  const jobcodes = data.results.jobcodes;
  const jobcodesKeys = Object.keys(jobcodes);
  const jobs = jobcodesKeys.map(key => {
    const { id, name } = jobcodes[key];
    return { id, name };
  });
  return jobs;
}

export const clockInJob = async (status, selection) => {
  const startDateString = await getDateStringForDaysAgo(0);
  const options = {
    method: 'POST',
    url: 'https://rest.tsheets.com/api/v1/timesheets',
    headers:
    {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'data': [
         {
          'user_id': parseInt(status.user_id),
          'type': 'regular',
          'start': startDateString,
          'end': '',
          'jobcode_id': selection,
         }
       ]
    })
  };

  const { body: timesheetsBody } = await requestPromise(options);
  const data = JSON.parse(timesheetsBody);
  const timesheets = data.results.timesheets;
  const timesheetsKeys = Object.keys(timesheets);
  const updatedStatus = timesheets[timesheetsKeys[timesheetsKeys.length - 1]];

  if (updatedStatus._status_code === 200) {
    console.log(`\nSuccessfully clocked in!`);
  } else {
    console.log(`\nError: ${updatedStatus._status_extra}`)
  }

  return updatedStatus;
}

export const clockOutJob = async (status, selection, notes) => {
  const endDateString = await getDateStringForDaysAgo(0);
  const options = {
    method: 'PUT',
    url: 'https://rest.tsheets.com/api/v1/timesheets',
    headers:
    {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'data': [
        {
         'id': parseInt(status.id),
         'end': endDateString,
         'jobcode_id': selection,
         'notes': notes ? notes : ''
        }
      ]
    })
  };

  const { body: timesheetsBody } = await requestPromise(options);
  const data = JSON.parse(timesheetsBody);
  const timesheets = data.results.timesheets;
  const timesheetsKeys = Object.keys(timesheets);
  const updatedStatus = timesheets[timesheetsKeys[timesheetsKeys.length - 1]];

  if (updatedStatus._status_code === 200) {
    console.log(`\nSuccessfully clocked out!`);
  } else {
    console.log(`\nError: ${updatedStatus._status_extra}`);
  }

  return updatedStatus;
}