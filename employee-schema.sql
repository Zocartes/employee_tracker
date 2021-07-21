CREATE DATABASE tracker_DB;
USE tracker_DB;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCRMENT,
    name VARCHAR(64) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCRMENT,
    title VARCHAR(32) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department (department_id)
);

CREATE TABLE employee (
    employee_id INT NOT NULL AUTO_INCRMENT,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (role_id) REFERENCES role (role_id)
    FOREIGN KEY (manager_id) REFERENCES employee_id (employee_id)
);

USE trackerDB;
--Creating departments
INSERT INTO department (name)
VALUES ("Human Resources"), ("Development"), ("Sales");


--Creating roles for departments
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1), ("HR REPRESENTATIVE", 80000, 1), 
("Dev", 90000, 2), ("Lead Developer", 120000, 2), 
("Lead Sales Rep", 100000, 3), ("Sales Rep", 80000, 3);


--Creating employees
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Gracie", "Dingles", 1), ("Andres", "Molestina", 2),
 ("Max", "Molestina", 4), ("Santos", "Quinto", 3), 
 ("Martha", "Quinto", 5), ("Angel", "Alvarado", 6); 