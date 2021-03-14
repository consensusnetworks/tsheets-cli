import { requestSelectAccount, requestUser, requestStatusByUser, requestJobsByStatus, clockOutJob, clockInJob } from './api.js';
import { askJobs, askNotes } from './prompts.js';

export const clockInOut = async () => {
    const user = await requestUser();
    const status = await requestStatusByUser(user);
    const jobs = await requestJobsByStatus(status);
    const { selection } = await askJobs(jobs);
    if (status.on_the_clock) {
        const notes = await askNotes();
        await clockOutJob(status, selection, notes);
    } else {
        await clockInJob(status, selection);
    }
    return await checkStatus();
}

export const checkStatus = async () => {
    const user = await requestUser();
    const status = await requestStatusByUser(user);
    const jobs = await requestJobsByStatus(status);
    const { on_the_clock, start, end } = status;
    if (on_the_clock) {
        const currentJobName = jobs[0].name;
        console.log(`\nOn the clock for ${currentJobName} since ${new Date(start)}`);
    } else {
        console.log(`\nOff the clock since ${new Date(end)}`);
    }
    console.log(`\n${user.first_name} ${user.last_name} | ${user.email} | ${user.company_name}\n`);
}

export const switchAccount = async () => {
    return await requestSelectAccount();
}

export const resetCredentials = async () => {
    return await getTSheetsCredentials();
}

export const quitPeacefully = async () => {
    return console.log(`\nBye!\n`);
}