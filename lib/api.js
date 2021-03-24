import util from "util";
import request from "request";
const requestPromise = util.promisify(request);
import open from "open";
import express from "express";
import {
  getDateStringForDaysAgo,
  formatDateStringShort,
  parseResponseBodyToData,
  parseResponseDataToObject,
} from "./helpers.js";
import { getClientCredentials, setTokens } from "./config.js";
const redirectUri = "http://localhost:3000/callback";
const encodedRedirectUri = encodeURIComponent(redirectUri);

export const requestSelectAccount = async () => {
  const { clientId, clientSecret } = await getClientCredentials();
  const options = {
    method: "GET",
    url: "https://rest.tsheets.com/api/v1/authorize",
    qs: {
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      state: "TSHEETSCLI",
    },
    headers: {},
  };

  const { body: authorizeBody } = await requestPromise(options);

  const app = express();
  const server = app.listen(3000);
  app.get("/", (_req, res) => {
    res.write(authorizeBody);
    res.end("");
  });

  app.get("/callback", async (req, res) => {
    res.write(
      "<html><head></head><body><p>Signed into the TSheets CLI successfully! You can close this browser tab.</p></body></html>"
    );

    var options = {
      method: "POST",
      url: "https://rest.tsheets.com/api/v1/grant",
      headers: {},
      form: {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code,
        redirect_uri: encodedRedirectUri,
      },
    };

    const { body: grantBody } = await requestPromise(options);

    const { access_token, refresh_token } = JSON.parse(grantBody);

    await setTokens(access_token, refresh_token);

    await requestUser();

    server.close();
    res.end("");
  });

  await open("http://localhost:3000");
};

export const requestTokenRefresh = async () => {
  const {
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
  } = await getClientCredentials();
  const options = {
    method: "POST",
    url: "https://rest.tsheets.com/api/v1/grant",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    },
  };

  const { body: grantBody } = await requestPromise(options);

  const { access_token, refresh_token } = JSON.parse(grantBody);

  await setTokens(access_token, refresh_token);

  await requestUser();
};

export const requestUser = async () => {
  const { accessToken } = await getClientCredentials();
  const options = {
    method: "GET",
    url: "https://rest.tsheets.com/api/v1/current_user",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { body: responseBody } = await requestPromise(options);
  const responseData = await parseResponseBodyToData(responseBody);
  if (responseData.error) {
    return responseData;
  }
  const { responseObject, responseKeys } = await parseResponseDataToObject(
    responseData,
    "users"
  );
  const user = responseObject[responseKeys[0]];
  return user;
};

export const requestStatusByUser = async ({ id }) => {
  const { accessToken } = await getClientCredentials();
  const queryStartDateString = await getDateStringForDaysAgo(7);
  const queryStartDateStringShort = await formatDateStringShort(
    queryStartDateString
  );
  const options = {
    method: "GET",
    url: "https://rest.tsheets.com/api/v1/timesheets",
    qs: {
      user_ids: id,
      start_date: queryStartDateStringShort,
      on_the_clock: "both",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { body: responseBody } = await requestPromise(options);

  const responseData = await parseResponseBodyToData(responseBody);
  const { responseObject, responseKeys } = await parseResponseDataToObject(
    responseData,
    "timesheets"
  );
  const status = responseObject[responseKeys[responseKeys.length - 1]];

  return status;
};

export const requestJobsByStatus = async (status) => {
  const { accessToken } = await getClientCredentials();
  const options = {
    method: "GET",
    url: "https://rest.tsheets.com/api/v1/jobcodes",
    qs: {
      active: "true",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  if (status && status.on_the_clock) {
    options.qs.ids = status.jobcode_id;
  }

  const { body: responseBody } = await requestPromise(options);
  const responseData = await parseResponseBodyToData(responseBody);
  const { responseObject, responseKeys } = await parseResponseDataToObject(
    responseData,
    "jobcodes"
  );

  const jobs = responseKeys.map((key) => {
    const { id, name } = responseObject[key];
    return { id, name };
  });
  return jobs;
};

export const clockInJob = async (status, selection) => {
  const { accessToken } = await getClientCredentials();
  const startDateString = await getDateStringForDaysAgo(0);
  const options = {
    method: "POST",
    url: "https://rest.tsheets.com/api/v1/timesheets",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [
        {
          user_id: parseInt(status.user_id),
          type: "regular",
          start: startDateString,
          end: "",
          jobcode_id: selection,
        },
      ],
    }),
  };

  const { body: responseBody } = await requestPromise(options);
  const responseData = await parseResponseBodyToData(responseBody);
  const { responseObject, responseKeys } = await parseResponseDataToObject(
    responseData,
    "timesheets"
  );

  const updatedStatus = responseObject[responseKeys[responseKeys.length - 1]];
  return updatedStatus;
};

export const clockOutJob = async (status, selection, notes) => {
  const { accessToken } = await getClientCredentials();
  const endDateString = await getDateStringForDaysAgo(0);
  const options = {
    method: "PUT",
    url: "https://rest.tsheets.com/api/v1/timesheets",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [
        {
          id: parseInt(status.id),
          end: endDateString,
          jobcode_id: selection,
          notes: notes ? notes : "",
        },
      ],
    }),
  };

  const { body: responseBody } = await requestPromise(options);
  const responseData = await parseResponseBodyToData(responseBody);
  const { responseObject, responseKeys } = await parseResponseDataToObject(
    responseData,
    "timesheets"
  );

  const updatedStatus = responseObject[responseKeys[responseKeys.length - 1]];
  return updatedStatus;
};
