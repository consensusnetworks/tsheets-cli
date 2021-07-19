import { askTSheetsCredentials } from './prompts.js';
import { setClientIdAndSecret } from './config.js';
import { showGreeting } from './welcome.js';
import { TSheets } from './api.js';

export const setUpClient = async () => {
    showGreeting();
    await setUpCredentials();
    console.log(`\nOpening browser to sign you in...`);
    await TSheets.requestSelectAccount();
    console.log(`\nSaving your access token...\n`);
}

export const setUpCredentials = async () => {
    const { client_id, client_secret } = await askTSheetsCredentials();
    setClientIdAndSecret(client_id, client_secret);
    console.log(`\nYour app secrets have been saved.`);
}