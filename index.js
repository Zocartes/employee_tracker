const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console_table');
const Choice = require('inquirer/lib/objects/choice');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306
    user: 'root'
    password: ''
    database: 'tracker_DB'
});

connection.connect((err) => {
    if (err)throw err;
    runSearch();
});

const runSearch = () => {
    inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
  
      ],
    })
    .then((userChoice) => {
      switch (userChoice.action) {
        case "View all departments":
          showDepts();
          break;
  
        case "View all roles":
          showRoles();
          break;
  
        case "View all employees":
            showEmployees();
            break;
      }
    });
  };
  
  const showDepts = () => {
    const query =
      'SELECT * FROM department';
    connection.query(query, (err, res) => {
      console.table(res);
      runSearch();
    });
};

const showRoles = () => {
  const query =
    'SELECT * FROM role';
  connection.query(query, (err, res) => {
    console.table(res);
    runSearch();
  });
};

const showEmployees = () => {
  const query =
    'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    console.table(res);
    runSearch();
  });
  }; 