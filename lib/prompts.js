import inquirer from 'inquirer';
const { prompt } = inquirer;
export const askMenu = async () => {
    const questions = [
        {
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { name: 'Clock in/out', value: 'clockInOut' },
                { name: 'Check status', value: 'checkStatus' },
                { name: 'Switch account', value: 'switchAccount' },
                { name: 'Reset credentials', value: 'resetCredentials' },
                { name: 'Quit peacefully', value: 'quitPeacefully' }
            ],
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please select an option.';
                }
            }
        },
    ];
    return prompt(questions);
}
export const askJobs = async (jobs) => {
    const jobsChoices = jobs.map(job => {
        return { name: job.name, value: job.id }
    })
    const questions = [
        {
            name: 'selection',
            type: 'list',
            message: 'Clock in/out of which project?',
            choices: jobsChoices,
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please select an option.';
                }
            }
        },
    ];
    return prompt(questions);
}
export const askTSheetsCredentials = async () => {
    const questions = [
        {
            name: 'client_id',
            type: 'input',
            message: 'Enter your TSheets OAuth Client ID:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your TSheets OAuth Client ID.';
                }
            }
        },
        {
            name: 'client_secret',
            type: 'input',
            message: 'Enter your TSheets OAuth Client Secret:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your TSheets OAuth Client Secret.';
                }
            }
        },
    ];
    return prompt(questions);
}

export const askNotes = async () => {
    const questions = [
        {
            name: 'notes',
            type: 'input',
            message: 'Enter timesheet notes (optional):',
        }
    ]
    return prompt(questions);
}