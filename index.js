const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();
// mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  // app port
  port: 3306,
  // .env credentials
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
connection.connect((err) => {
  if (err) throw err;
  runQuestions();
});
// prompts the user for an action to take
const runQuestions = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Exit",
        "View all departments",
        "View all roles",
        "View all employees",
        "Add new department",
        "Add new role",
        "Add new employee",
        "Update employee",
        "Delete department",
        "Delete role",
        "Remove employee",
        "View employees by manager",
        "View employees by department",
        "View employees by role",
        "View total utilized budget of a department",
      ],
    })
    //switch cases
    .then((userChoice) => {
      switch (userChoice.action) {
        case "Exit":
          exit();
          break;

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

        case "Delete department":
          deleteDept();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Remove employee":
          deleteEmployee();
          break;

        case "View employees by manager":
          viewEmpByManager();
          break;

        case "View employees by department":
          viewEmpByDept();
          break;

        case "View employees by role":
          viewEmpByRole();
          break;

        case "View total utilized budget of a department":
          viewSalaryByDept();
          break;
      }
    });
};

// ---------------------EXIT--------------------------------------------------------

const exit = () => {
  connection.end();
}

// ---------------------SHOW SALARY BY DEPARTMENT-----------------------------------

const viewSalaryByDept = () => {
  let deptNames = [];
  let departments = [];
  // slecting all department
  let queryDept = "SELECT department_id AS id, name FROM department;";
  connection.query(queryDept, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      deptNames.push(res[i].name);
      departments.push(res[i]);
    }
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "Which department's employees would you like to view?",
        choices: deptNames,
      })
      .then((userChoice) => {
        //gets the id of the manager based on the user selection
        departments.forEach((department) => {
          if (department.name === userChoice.dept) {
            userChoice.dept = department.id;
          }
        });
        // shows all employees with a department id matching the department selected
        let query = `SELECT SUM(role.salary) AS budget FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.department_id WHERE role.department_id = ${userChoice.dept};`;
        connection.query(query, (err, res) => {
          console.table(res);
          runQuestions();
        });
      });
  });
};

// ---------------------SHOW EMPLOYEE BY ROLE---------------------------------------

const viewEmpByRole = () => {
  let roleNames = [];
  let roles = [];
  // slecting all roles
  let queryRole = "SELECT role_id AS id, title FROM role;";
  connection.query(queryRole, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      roleNames.push(res[i].title);
      roles.push(res[i]);
    }
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which role's employees would you like to view?",
        choices: roleNames,
      })
      .then((userChoice) => {
        //gets the id of the manager based on the user selection
        roles.forEach((role) => {
          if (role.title === userChoice.role) {
            userChoice.role = role.id;
          }
        });
        // shows all employees with a role id matching the role selected
        let query = `SELECT employee.employee_id AS id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.salary AS salary FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id LEFT JOIN department ON role.department_id = department.department_id WHERE role.role_id = ${userChoice.role};`;
        connection.query(query, (err, res) => {
          console.table(res);
          runQuestions();
        });
      });
  });
};

// ---------------------SHOW EMPLOYEE BY DEPARTMENT---------------------------------

const viewEmpByDept = () => {
  let deptNames = [];
  let departments = [];
  // slecting all department
  let queryDept = "SELECT department_id AS id, name FROM department;";
  connection.query(queryDept, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      deptNames.push(res[i].name);
      departments.push(res[i]);
    }
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "Which department's employees would you like to view?",
        choices: deptNames,
      })
      .then((userChoice) => {
        //gets the id of the manager based on the user selection
        departments.forEach((department) => {
          if (department.name === userChoice.dept) {
            userChoice.dept = department.id;
          }
        });
        // shows all employees with a department id matching the department selected
        let query = `SELECT employee.employee_id AS id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.salary AS salary FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id LEFT JOIN department ON role.department_id = department.department_id WHERE role.department_id = ${userChoice.dept};`;
        connection.query(query, (err, res) => {
          console.table(res);
          runQuestions();
        });
      });
  });
};

// ---------------------SHOW EMPLOYEE BY MANAGER------------------------------------

const viewEmpByManager = () => {
  let managerIds = [];
  let employees = [];
  // slecting all manager ids to use in select all managers query
  let queryEmp =
    "SELECT CONCAT(first_name, ' ', last_name) AS full_name, manager_id AS manager_id, employee_id FROM employee;";
  connection.query(queryEmp, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i]);
      if (res[i].manager_id !== null) {
        managerIds.push(res[i].manager_id);
      }
    }
    let managerNames = [];
    // slecting the managers based on the manager id's
    let queryMan = `SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee WHERE employee_id IN (${managerIds});`;
    connection.query(queryMan, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        managerNames.push(res[i].full_name);
      }
      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Whos team would you like to veiw?",
          choices: managerNames,
        })
        .then((userChoice) => {
          //gets the id of the manager based on the user selection
          employees.forEach((employee) => {
            if (employee.full_name === userChoice.manager) {
              userChoice.manager = employee.employee_id;
            }
          });
          // shows all employees with a manager id matching the manager employee_id
          let query = `SELECT employee.employee_id AS id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role, department.name AS department, role.salary AS salary FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id LEFT JOIN department ON role.department_id = department.department_id WHERE employee.manager_id = ${userChoice.manager};`;
          connection.query(query, (err, res) => {
            console.table(res);
            runQuestions();
          });
        });
    });
  });
};

// -----------------------------DELETING EMPLOYEE-----------------------------------

const deleteEmployee = () => {
  let employees = [];
  let employeeNames = [];
  // slecting all employees to use in inquirer prompt
  let queryEmp =
    "SELECT CONCAT(first_name, ' ', last_name) AS full_name, employee_id AS id FROM employee;";
  connection.query(queryEmp, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i]);
      employeeNames.push(res[i].full_name);
    }

    inquirer
      .prompt({
        name: "emp",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: employeeNames,
      })
      .then((userChoice) => {
        //gets the id of the employee based on the user selection
        employees.forEach((employee) => {
          if (employee.full_name === userChoice.emp) {
            userChoice.emp = employee.id;
          }
        });
        console.log("Deleting Employee...\n");
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            employee_id: userChoice.emp,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee deleted!\n`);
            // Call runQuestions AFTER the DELETE completes
            runQuestions();
          }
        );
      });
  });
};

// -----------------------------DELETING ROLE---------------------------------------

const deleteRole = () => {
  let roleNames = [];
  let roles = [];
  // selecting all department names to use in inquirer prompt
  let queryDept = "SELECT title, role_id AS id FROM role";
  connection.query(queryDept, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      roleNames.push(res[i].title);
      roles.push(res[i]);
    }
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which role would you like to delete?",
        choices: roleNames,
      })
      .then((userChoice) => {
        //gets the id of the department based on the user selection
        roles.forEach((role) => {
          if (role.title === userChoice.role) {
            userChoice.role = role.id;
          }
        });
        console.log("Deleting Role...\n");
        connection.query(
          "DELETE FROM role WHERE ?",
          {
            role_id: userChoice.role,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role deleted!\n`);
            // Call runQuestions AFTER the DELETE completes
            runQuestions();
          }
        );
      });
  });
};

// -----------------------------DELETING DEPARTMENT---------------------------------

const deleteDept = () => {
  let departmentNames = [];
  let departments = [];
  // selecting all department names to use in inquirer prompt
  let queryDept = "SELECT name, department_id AS id FROM department";
  connection.query(queryDept, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      departmentNames.push(res[i].name);
      departments.push(res[i]);
    }
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "Which department would you like to delete?",
        choices: departmentNames,
      })
      .then((userChoice) => {
        //gets the id of the department based on the user selection
        departments.forEach((department) => {
          if (department.name === userChoice.dept) {
            userChoice.dept = department.id;
          }
        });
        console.log("Deleting department...\n");
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            department_id: userChoice.dept,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} department deleted!\n`);
            // Call runQuestions AFTER the DELETE completes
            runQuestions();
          }
        );
      });
  });
};

// -----------------------------UPDATE EMPLOYEE (CHOOSING EMPLOYEE)-----------------

const updateEmployee = () => {
  let employees = [];
  let employeeNames = [];
  // slecting all employees to use in inquirer prompt
  let queryEmp =
    "SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS full_name, employee.employee_id AS id, role.title AS role, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id;";
  connection.query(queryEmp, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i]);
      employeeNames.push(res[i].full_name);
    }
    inquirer
      .prompt({
        name: "whichEmp",
        type: "list",
        message: "Which employee would you like to update?",
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
      choices: ["Role", "Manager"],
    })
    .then((userChoice) => {
      switch (userChoice.empAspect) {
        case "Role":
          empRole(userSelectedEmp, employees);
          break;

        case "Manager":
          empManager(userSelectedEmp, employees);
          break;
      }
    });
};

// ----------------------------UPDATE EMPLOYEE (MANAGER)----------------------------

const empManager = (userSelectedEmp) => {
  let employees = [];
  let employeeNames = ["None"];
  // slecting all employees to use in inquirer prompt
  let queryEmp =
    "SELECT employee_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query(queryEmp, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i]);
      employeeNames.push(res[i].full_name);
    }
    inquirer
      .prompt({
        name: "newManager",
        type: "list",
        message: `"Who is ${userSelectedEmp}'s new manager?"`,
        choices: employeeNames,
      })
      .then((userChoice) => {
        //gets the id of the manager based on the user selection
        employees.forEach((employee) => {
          if (employee.full_name === userChoice.newManager) {
            userSelectedManager = employee.employee_id;
          }
          else if (userChoice.newManager === "None") {
            userSelectedManager = null
          }
        });
        //gets the id of the manager based on the user selection
        employees.forEach((employee) => {
          if (employee.full_name === userSelectedEmp) {
            userSelectedEmpId = employee.employee_id;
          }
        });
        console.log("Updating employee manager...\n");
        // updating employee manager id
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: userSelectedManager,
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
      });
  });
};

// ----------------------------UPDATE EMPLOYEE (ROLE)-------------------------------

const empRole = (userSelectedEmp, employees) => {
  let roleTitles = [];
  let roles = [];
  //gets the role of the employee based on the user selection
  employees.forEach((employee) => {
    if (employee.full_name === userSelectedEmp) {
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
          if (role.title === userChoice.newRole) {
            userSelectedRole = role.id;
          }
        });
        console.log("Updating employee role...\n");

        // updating employee role id
        connection.query(
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
      });
  });
};


// -----------------------------------------ADD DEPARTMENT--------------------------

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
      connection.query(
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
        type: "list",
        message: "What department does this role fall under?",
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
          connection.query(
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
        }
      );
    });
};

// -----------------------------------------ADD EMPLOYEE----------------------------

const addEmployee = () => {
  let roles = [];
  let employees = [];
  let employeeNames = ["None"];
  // selecting  all roles to use in inquirer prompt
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
        message: "Who is this employee's manager?",
        choices: employeeNames,
      },
    ])
    .then((userAnswer) => {
      // Getting the id of the role based on user selection
      let userSelection = userAnswer.empRole;
      connection.query(
        `SELECT role_id FROM role WHERE title = "${userSelection}"`,
        (err, res) => {
          let userRole = res[0].role_id;
          if (err) throw err;
          //gets the id of the manager based on the user selection
          employees.forEach((employee) => {
            if (employee.full_name === userAnswer.empManager) {
              userAnswer.empManager = employee.employee_id;
            } else if (userAnswer.empManager === "None") {
              userAnswer.empManager = null;
            }
          });
          console.log("Inserting a new employee...\n");
          connection.query(
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

// -----------------------------------------SHOW EMPLOYEES--------------------------

const showEmployees = () => {
  let query =
    "SELECT employee.employee_id AS id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS role, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id LEFT JOIN department ON role.department_id = department.department_id;";
  connection.query(query, (err, res) => {
    console.table(res); 
    runQuestions();
  });
};