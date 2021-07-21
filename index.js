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
    runQuestions();
});

const runQuestions = () => {
    inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add new department",
        "Add new role",
        "Add new employee",
  
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
            
        case "Add new department":
          addDept();
          break;

        case "Add new role":
          addRole();
          break;

        case "Add new employee":
          addEmployee();
          break;
      }
    });
  };

  const addDept = () => {
    inquirer
    .prompt({
      name: 'deptName',
      type: 'input',
      message: "What is the departments name?",
      validate: function validateDeptName(DeptName){
          return DeptName !== '';
      },
    })
    .then((userAnswer) => {
  
      console.log('Inserting a new department...\n');
      const query = connection.query(
        'INSERT INTO department SET ?',
        {
          name: userAnswer.deptName,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department inserted!\n`);
          // Call runQuestions() AFTER the INSERT completes
          runQuestions();
        }
      );
      // logs the actual query being run
      console.log(query.sql);
  
    })
  
  };

  // questions for adding new role had to put into array because it wouldnt work within the prompt for some reason
const addRoleQuestions = [
    {
      name: 'roleName',
      type: 'input',
      message: "What is the new role?",
      validate: function validateRoleName(roleName){
        return roleName !== '';
      },
    },
    {
      name: 'roleSalary',
      type: 'input',
      message: 'What is the salary for this new role?',
      validate: function validateRoleSalary(roleSalary){
        return roleSalary !== '';
      },
    },
    {
      name: 'roleDept',
      type: 'input',
      message: "What department does this role fall under?",
      validate: function validateRoleDept(roleDept){
        return roleDept !== '';
      },
    },
  ];
  
  // prompts the user for information on the role they wish to add and adds it to the table role
  const addRole = () => {
    inquirer.prompt(addRoleQuestions)
    .then((userAnswer) => {
      console.log('Inserting a new role...\n');
      const query = connection.query(
        'INSERT INTO role SET ?',
        {
          title: userAnswer.roleName,
          salary: userAnswer.roleSalary,
          department_id: userAnswer.roleDept,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department inserted!\n`);
          // Call runQuestions() AFTER the INSERT completes
          runQuestions();
        }
      );
      // logs the actual query being run
      console.log(query.sql);
  
    })
};
  
  const showDepts = () => {
    const query =
      'SELECT * FROM department';
    connection.query(query, (err, res) => {
      console.table(res);
      runQuestions();
    });
};

const showRoles = () => {
  const query =
    'SELECT * FROM role';
  connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
};

const showEmployees = () => {
  const query =
    'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
  }; 