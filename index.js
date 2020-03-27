const inquirer = require('inquirer');
const client = require('gw2api-client');

// Get an instance of an API client
let api = client();

// Optional, but recommended: Set the schema version of the client
api.schema('2019-03-26T00:00:00Z');

// Optional: Set the language of the client
api.language('en');
api.authenticate('apiKey');

debugger;

var questions = [
  {
    type: 'input',
    name: 'endpoint',
    message: "What's would you like to request?"
  },
];


async function ask() {
  inquirer.prompt(questions).then(async answers => {

    const parts = answers.endpoint.split(' ')


    // .reduce((agg, item) => {
    //   if (item.startsWith('-')) {
    //     agg[-1]['args'][-1]
    //   }
    // },[]);

    const result = await parts.reduce((current, next) => current[next](), api).get();

    console.log(result);
    ask();
  });
}

ask();
