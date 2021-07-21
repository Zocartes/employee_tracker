const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console_table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "tracker_DB",
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
          "Update employee",
        ],
      })

      //switch cases .then actions

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
            
        case "Update employee":
            updateEmployee();
            break;
        }
      });
  };

// -----------------------------UPDATE EMPLOYEE (CHOOSING EMPLOYEE)-----------------

const updateEmployee = () => {
    let employees = [];
    let employeeNames = [];
  
    // slecting all employees to use in inquirer prompt

    let queryEmp =
      "SELECT CONCAT(first_name, ' ', last_name) AS full_name, employee_id AS id, role.title AS role FROM employee LEFT JOIN role ON employee.role_id = role.role_id";
    connection.query(queryEmp, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        employees.push(res[i]);
        employeeNames.push(res[i].full_name);
      }
  
      inquirer
        .prompt({
          name: "whichEmp",
          type: "list",
          message: "Whos role would you like to update?",
          choices: employeeNames,
        })
        .then((userChoice) => {

          //pushing user selected employee to global varibale to use

          let userSelectedEmp = userChoice.whichEmp;
  
          empAspect(userSelectedEmp, employees);
        });
    });
  };
  

// ----------------------------UPDATE EMPLOYEE (CHOOSING WHAT PART OF EMPLOYEE)-----

  const empAspect = (userSelectedEmp, employees) => {
    inquirer
      .prompt({
        name: "empAspect",
        type: "list",
        message: "What aspect of the employee would you like to update?",
        choices: ["First name", "Last name", "Role", "Manager"],
      })
      .then((userChoice) => {
        switch (userChoice.empAspect) {
          case "First name":
            empFirstName(userSelectedEmp);
            break;
  
          case "Last name":
            empLastName(userSelectedEmp);
            break;
  
          case "Role":
            empRole(userSelectedEmp, employees);
            break;
  
          case "Manager":
            empManager(userSelectedEmp);
            break;
        }
      });
  };
  
  // ----------------------------UPDATE EMPLOYEE (ROLE)-------------------------------

  const empRole = (userSelectedEmp, employees) => {
    let roleTitles = [];
    let roles = [];
  
    //gets the role of the employee based on the user selection

    employees.forEach((employee) => {
      if (employee.full_name.includes(userSelectedEmp)) {
        userSelectedEmpRole = employee.role;
        userSelectedEmpId = employee.id;
      }
    });
  
    // slecting all roles to use in inquirer prompt

    let queryRole = "SELECT title, role_id AS id FROM role";
    connection.query(queryRole, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        roleTitles.push(res[i].title);
        roles.push(res[i]);
      }
  
      inquirer
        .prompt({
          name: "newRole",
          type: "list",
          message: `"${userSelectedEmp}'s current role is ${userSelectedEmpRole}, what would you like to change it to?"`,
          choices: roleTitles,
        })
        .then((userChoice) => {
  
          //gets the id of the role based on the user selection

          roles.forEach((role) => {
            if (role.title.includes(userChoice.newRole)) {
              userSelectedRole = role.id;
            }
          });
  
          console.log("Updating employee role...\n");
  
          // updating employee role id

          const query = connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: userSelectedRole,
              },
              {
                employee_id: userSelectedEmpId,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} employee updated!\n`);

              // Call runQuestions AFTER the UPDATE completes

              runQuestions();
            }
          );
  
          // logs the actual query being run

          console.log(query.sql);
        });
    });
  };

// -----------------------------------------ADD DEPARTMENT--------------------------

  const addDept = () => {
    inquirer
    .prompt({
        name: "deptName",
        type: "input",
        message: "What is the department's name?",
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

  // -----------------------------------------ADD ROLE--------------------------------

  const addRole = () => {

  // selecting all department names to use in inquirer prompt

  let departments = [];
  let queryDept = "SELECT name FROM department";
  connection.query(queryDept, (err, res) => {
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
      // Getting the id of the department based on user selection
      let userSelection = userAnswer.roleDept;
      connection.query(
        `SELECT department_id FROM department WHERE name = "${userSelection}"`,
        (err, res) => {
          let userDept = res[0].department_id;
          if (err) throw err;

          // inserting new role into role table
          console.log("Inserting a new role...\n");
          let query = connection.query(
            "INSERT INTO role SET ?",
            {
              title: userAnswer.roleName,
              salary: userAnswer.roleSalary,
              department_id: userDept,
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
        }
      );
        });
};

// -----------------------------------------ADD EMPLOYEE--------------------------------

const addEmployee = () => {
    let roles = [];
    let employees = [];
    let employeeNames = [];
  
    // slecting all roles to use in inquirer prompt
    let queryRole = "SELECT title FROM role";
    connection.query(queryRole, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        roles.push(res[i].title);
      }
    });
  
    // slecting all employees to use in inquirer prompt
    let queryEmp =
    "SELECT employee_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
    connection.query(queryEmp, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        employees.push(res[i]);
        employeeNames.push(res[i].full_name);
      }
    });

  
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
            type: "list",
            message: "What role will this employee be performing?",
            choices: roles,
          },
          {
            name: "empManager",
            type: "list",
            message: "Who is this employees manager?",
            choices: employeeNames,
          },
        ])
        .then((userAnswer) => {            
      // Getting the title of the role based on user selection
      let userSelection = userAnswer.empRole;
      connection.query(
        `SELECT role_id FROM role WHERE title = "${userSelection}"`,
            (err, res) => {
              let userRole = res[0].role_id;
              if (err) throw err;

          //gets the id of the manager based on the user selection
          employees.forEach((employee) => {
            if (employee.full_name.includes(userAnswer.empManager)) {
              userAnswer.empManager = employee.employee_id;
            }
          });

          console.log("Inserting a new employee...\n");
          let query = connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: userAnswer.firstName,
              last_name: userAnswer.lastName,
              role_id: userRole,
              manager_id: userAnswer.empManager,
            },
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} employee inserted!\n`);
              // Call runQuestions() AFTER the INSERT completes
              runQuestions();
            }
          );
          // logs the actual query being run
          console.log(query.sql);
            }
          );
        });
  };
  
  // -----------------------------------------SHOW DEPARTMENTS------------------------


  const showDepts = () => {
  let query = "SELECT department_id AS id, name FROM department";
    connection.query(query, (err, res) => {
      console.table(res);
      runQuestions();
    });
};

// -----------------------------------------SHOW ROLES------------------------------

const showRoles = () => {
    let query =
    "SELECT role_id AS id, title, salary,  department.name AS department FROM role LEFT JOIN department ON role.department_id = department.department_id";
    connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
};

// -----------------------------------------SHOW EMPLOYEES------------------------

const showEmployees = () => {
    let query =
    "SELECT employee.employee_id AS id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id LEFT JOIN department ON role.department_id = department.department_id;";
    connection.query(query, (err, res) => {
    console.table(res);
    runQuestions();
  });
  }; 