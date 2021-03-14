import { askTSheetsCredentials } from './prompts';
import { setClientIdAndSecret } from './config';

export const getTSheetsCredentials = async () => {
    const credentials = await askTSheetsCredentials();
    const { client_id, client_secret } = credentials;
    await setClientIdAndSecret(client_id, client_secret);
    return console.log(`\nYour app secrets have been saved.\n`);
}