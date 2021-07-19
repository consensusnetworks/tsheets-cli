#!/usr/bin/env node
import { getClientCredentials } from './lib/config.js';
import { getMenuSelection } from './lib/menu.js';
import { setUpClient } from './lib/setup.js';

const runCli = async () => {
  try {
    const { clientId, clientSecret, accessToken, refreshToken } = getClientCredentials();
    const clientNeedsSetup = !clientId || !clientSecret || !accessToken || !refreshToken;
    if (clientNeedsSetup) {
      await setUpClient();
      process.exit(1)
    } else {
      await getMenuSelection();
      process.exit(1)
    }
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
};

runCli();