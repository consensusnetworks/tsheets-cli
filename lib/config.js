
import Configstore from 'configstore';
const conf = new Configstore('tsheets-cli');

export const getClientCredentials = () => {
    const clientId = conf.get('tsheets.credentials.client_id');
    const clientSecret = conf.get('tsheets.credentials.client_secret');
    const accessToken = conf.get('tsheets.credentials.access_token');
    const refreshToken = conf.get('tsheets.credentials.refresh_token');
    return { clientId, clientSecret, accessToken, refreshToken };
}

export const setTokens = (accessToken, refreshToken) => {
    conf.set('tsheets.credentials.access_token', accessToken);
    conf.set('tsheets.credentials.refresh_token', refreshToken);
}

export const setClientIdAndSecret = (id, secret) => {
    conf.set('tsheets.credentials.client_id', id);
    conf.set('tsheets.credentials.client_secret', secret);
}