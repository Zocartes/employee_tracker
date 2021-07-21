const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console_table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306
    user: "root"
    password: ""
    database: "tracker_DB"
});

connection.connect((err) => {
    if (err)throw err;
    runQuestions();
});

const runQuestions = () => {
    inquirer
    .prompt({
        name: "action",
        type: "list",
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
      //switch cases for every possible action
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
        name: "deptName",
        type: "input",
        message: "What is the departments name?",
        validate: function validateDeptName(DeptName) {
          return DeptName !== "";
        },
    })
    .then((userAnswer) => {
      console.log("Inserting a new department...\n");
      let query = connection.query(
        "INSERT INTO department SET ?",
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
    });
  
  };

  
  // prompts the user for information on the role they wish to add and adds it to the table role
  const addRole = () => {
    let departments = [];
    let query = "SELECT name FROM department";
    connection.query(query, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        departments.push(res[i]);
      }
    });
  
    inquirer
    .prompt([
        {
            name: "roleName",
            type: "input",
            message: "What is the new role?",
            validate: function validateRoleName(roleName) {
              return roleName !== "";
            },
        },
        {
            name: "roleSalary",
            type: "input",
            message: "What is the salary for this new role?",
            validate: function validateRoleSalary(roleSalary) {
              return roleSalary !== "";
            },
          },
          {
            name: "roleDept",
            type: "lists",
            message: "What department does this role fall under?",
            validate: function validateRoleDept(roleDept) {
              return roleDept !== "";
            },
            choices: departments,
          },
        ])
        .then((userAnswer) => {
      // let selection = userAnswer.roleDept;
      // let query = "SELECT department_id FROM department WHERE name = ?";
      // connection.query(query, (err, res) => {
      //   for (var i = 0; i < res.length; i++) {
      //     departments.push(res[i].name);
      //   }
      // });

          console.log("Inserting a new role...\n");
          let query = connection.query(
            "INSERT INTO role SET ?",
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
        });
};

// prompts the user for information on the employee they wish to add and adds it to the table employee
const addEmployee = () => {
  
  // let roles = [];

  // let query = "SELECT * FROM roles";
  // connection.query(query, (err, res) => {
  //   for (var i = 0; i < res.length; i++) {
  //     departments.push(res[i].name);
  //   }
  // });
  
    inquirer
    .prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employees first name?",
            validate: function validateFirstName(FirstName) {
              return FirstName !== "";
            },
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employees last name?",
            validate: function validateLastName(LastName) {
              return LastName !== "";
            },
          },
          {
            name: "empRole",
            type: "input",
            message: "What role will this employee be performing?",
            validate: function validateEmpRole(EmpRole) {
              return EmpRole !== "";
            },
          },
          {
            name: "empManager",
            type: "input",
            message: "Who is this employees manager?",
          },
        ])
        .then((userAnswer) => {
          console.log("Inserting a new employee...\n");
          let query = connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: userAnswer.firstName,
              last_name: userAnswer.lastName,
              role_id: userAnswer.empRole,
              manager_id: userAnswer.empManager,
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
        });
  };
  
  
  const showDepts = () => {
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
      console.log(res)
      console.table(res);
      runQuestions();
    });
};

const showRoles = () => {
    let query = "SELECT * FROM role";
  connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
};

const showEmployees = () => {
    let query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
  }; 