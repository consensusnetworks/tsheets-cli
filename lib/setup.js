import { askTSheetsCredentials } from './prompts.js';
import { setClientIdAndSecret } from './config.js';

export const setUpCredentials = async () => {
    const credentials = await askTSheetsCredentials();
    const { client_id, client_secret } = credentials;
    await setClientIdAndSecret(client_id, client_secret);
    return console.log(`\nYour app secrets have been saved.`);
}