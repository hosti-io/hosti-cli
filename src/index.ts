import yargs from 'yargs';

const args = yargs.options({
    'api-key': { type: 'string', demandOption: true, alias: 'a' },
    'url': { type: 'string', demandOption: true, alias: 'u' },
    'instructions': { type: 'array', demandOption: true, alias: 'i' },
}).argv;

console.log(args);
