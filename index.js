#!/usr/bin/env node
import { showGreeting } from './lib/welcome.js';
import { requestSelectAccount } from './lib/api.js';
import { getClientCredentials } from './lib/config.js';
import { getMenuSelection } from './lib/menu.js';
import { setUpCredentials } from './lib/setup.js';

const runCli = async () => {
  const { clientId, clientSecret, accessToken } = await getClientCredentials();
  const clientNeedsSetup = !clientId || !clientSecret || !accessToken;
  if (clientNeedsSetup) {
    await showGreeting();
    await setUpCredentials();
    return requestSelectAccount();
  } else {
    await getMenuSelection();
  }
};

runCli();