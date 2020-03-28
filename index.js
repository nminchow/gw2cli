const inquirer = require('inquirer');
const client = require('gw2api-client');
const fs = require('fs');

function apiKey() {
  try {
    const file = fs.readFile('config.json');
    return JSON.parse(file).apiKey;
  } catch {
    return '';
  }
}

var questions = [
  {
    type: 'input',
    name: 'endpoint',
    message: "What's would you like to request?"
  },
];


async function ask(api) {
  inquirer.prompt(questions).then(async answers => {

    const parts = answers.endpoint.split(' ');

    const { commands, args } = parts.reduce(({ commands, args }, item) => {
      if (item.startsWith('-')) {
        args[commands.slice(-1)].push(item.substring(1));
      } else {
        commands.push(item);
        args[item] = [];
      };
      return { commands, args };
    }, { commands: [], args: {} });

    const fetch = commands.pop();

    try {
      const result = await commands.reduce((current, next) => current[next](...args[next]), api)[fetch]();

      console.log(JSON.stringify(result));
    } catch(error) {
      console.log(error);
    }
    ask(api);
  });
}

async function run() {

  let key = apiKey();

  if(!key) {
    key = await inquirer.prompt([
      { type: 'input', name: 'key', message: 'Please set your api key:' },
      { type: 'confirm', name: 'save', message: 'Save this key?' }
    ]).then(async answers => {
      const apiKey = answers.key;
      if (answers.save) {
        fs.writeFileSync('config.json', JSON.stringify({ apiKey }));
      }
      return apiKey;
    });
  }

  // Get an instance of an API client
  let api = client();

  // Optional, but recommended: Set the schema version of the client
  api.schema('2019-03-26T00:00:00Z');

  // Optional: Set the language of the client
  api.language('en');
  api.authenticate(key);
  ask(api);
}

run();
