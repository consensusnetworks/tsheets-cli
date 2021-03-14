#!/usr/bin/env node
import { showGreeting } from './lib/welcome.js';
import { requestSelectAccount } from './lib/api.js';
import { getClientCredentials } from './lib/config.js';
import { getMenuSelection } from './lib/menu.js';
const { clientId, clientSecret, token } = await getClientCredentials();
const clientNeedsSetup = !clientId || !clientSecret || !token;

const runCli = async () => {
  if (clientNeedsSetup) {
    await showGreeting();
    await getTSheetsCredentials();
    return requestSelectAccount();
  } else {
    await getMenuSelection();
  }
};

runCli();