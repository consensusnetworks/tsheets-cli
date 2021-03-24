#!/usr/bin/env node
import { getClientCredentials } from './lib/config.js';
import { getMenuSelection } from './lib/menu.js';
import { setUpClient } from './lib/setup.js';

const runCli = async () => {
  try {
    const { clientId, clientSecret, accessToken, refreshToken } = await getClientCredentials();
    const clientNeedsSetup = !clientId || !clientSecret || !accessToken || !refreshToken;
    if (clientNeedsSetup) {
      await setUpClient();
    } else {
      await getMenuSelection();
    }
  } catch (err) {
    console.log(err.message)
  }
};

runCli();