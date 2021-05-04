import 'regenerator-runtime/runtime';
import { spawn } from 'child_process';

describe('run cli with tsheets command', () => {

    const run = spawn('node', ['tsheets']);
    const command = run.spawnargs[1];

    test('it should recognize the tsheets command', () => {
        expect(command).toBe('tsheets')
    });
});
