import {
  TSheets,
} from "./api.js";
import { handleResponseCode } from "./codes.js";
import { needsTokenRefresh } from "./helpers.js";
import { askJobs, askNotes } from "./prompts.js";
import { setUpCredentials } from "./setup.js";

export const clockInOut = async () => {
  let user = await TSheets.requestUser();
  if (needsTokenRefresh(user)) {
    await TSheets.requestTokenRefresh();
    user = await TSheets.requestUser();
  }
  const status = await TSheets.requestStatusByUser(user);
  const jobs = await TSheets.requestJobsByStatus(status);
  const { selection } = await askJobs(jobs);
  if (status && status.on_the_clock) {
    const { notes } = await askNotes();
    const updatedStatus = await TSheets.clockOutJob(status, selection, notes);
    handleResponseCode(updatedStatus, 'clocked out')
  } else {
    const updatedStatus = await TSheets.clockInJob(user, selection);
    handleResponseCode(updatedStatus, 'clocked in')
  }
  return await checkStatus();
};

export const checkStatus = async () => {
  let user = await TSheets.requestUser();
  if (needsTokenRefresh(user)) {
    await TSheets.requestTokenRefresh();
    user = await TSheets.requestUser();
  }
  const status = await TSheets.requestStatusByUser(user);
  const jobs = await TSheets.requestJobsByStatus(status);
  if (!status) {
    console.log(`\nOff the clock since over a week ago`);
  } else if (!jobs) {
    console.log(`\nYou need to add some jobs in your TSheets console!`);
  } else {
    const { on_the_clock, start, end } = status;
    if (on_the_clock) {
      const currentJobName = jobs[0].name;
      console.log(
        `\nOn the clock for ${currentJobName} since ${new Date(start)}`
      );
    } else {
      console.log(`\nOff the clock since ${new Date(end)}`);
    }
  }
  console.log(
    `\n${user.first_name} ${user.last_name} | ${user.email} | ${user.company_name}\n`
  );
};

export const switchAccount = async () => {
  console.log(`\nOpening browser to sign you in...`);
  await TSheets.requestSelectAccount();
  console.log(`\nSaving your access token...\n`);
};

export const resetCredentials = async () => {
  return await setUpCredentials();
};

export const quitPeacefully = async () => {
  return console.log(`\nBye!\n`);
};
