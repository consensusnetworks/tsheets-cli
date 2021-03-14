
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name } = require('../package.json');
import Configstore from 'configstore';
const conf = new Configstore(name);

export const getClientCredentials = async () => {
    const clientId = conf.get('tsheets.client_id');
    const clientSecret = conf.get('tsheets.client_secret');
    const token = conf.get('tsheets.token');
    return { clientId, clientSecret, token };
}

export const setToken = async (token) => {
    conf.set('tsheets.token', token);
}

export const setClientIdAndSecret = async (id, secret) => {
    conf.set('tsheets.client_id', client_id);
    conf.set('tsheets.client_secret', client_secret);
}