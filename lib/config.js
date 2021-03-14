
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name } = require('../package.json');
import Configstore from 'configstore';
const conf = new Configstore(name);

export const getClientCredentials = async () => {
    const clientId = conf.get('tsheets.credentials.client_id');
    const clientSecret = conf.get('tsheets.credentials.client_secret');
    const accessToken = conf.get('tsheets.credentials.access_token');
    return { clientId, clientSecret, accessToken };
}

export const setAccessToken = async (accessToken) => {
    conf.set('tsheets.credentials.access_token', accessToken);
}

export const setClientIdAndSecret = async (id, secret) => {
    conf.set('tsheets.credentials.client_id', id);
    conf.set('tsheets.credentials.client_secret', secret);
}