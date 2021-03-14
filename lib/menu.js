import { askMenu } from './prompts.js';
import { clockInOut, checkStatus, switchAccount, resetCredentials, quitPeacefully } from './options.js';

export const getMenuSelection = async () => {
    const { selection } = await askMenu();
    if (selection === 'clockInOut') {
      return clockInOut();
    } else if (selection === 'checkStatus') {
      return checkStatus();
    } else if (selection === 'switchAccount') {
      return switchAccount();
    } else if (selection === 'resetCredentials') {
      return resetCredentials();
    } else if (selection === 'quitPeacefully') {
      return quitPeacefully();
    }
}