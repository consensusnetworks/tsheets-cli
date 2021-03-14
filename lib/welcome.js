import chalk from 'chalk';
const { red } = chalk;

import figlet from 'figlet';
const { textSync } = figlet;

const welcomeTitle = red(textSync('TSheets CLI', { horizontalLayout: 'full' }));
const welcomeGreeting = 'Welcome to the TSheets punch clock CLI!';
const welcomeInstruction = 'To get started, please get your TSheets API Client ID and Client Secret by going through the setup steps 1-5 here: https://tsheetsteam.github.io/api_docs/?javascript--node#walkthroughs. Then enter the values below.';

export const showGreeting = async () => {
    return console.log(
        `
        \n${welcomeTitle}
        \n${welcomeGreeting}
        \n${welcomeInstruction}
        `   
    );
}