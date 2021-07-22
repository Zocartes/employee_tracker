CREATE DATABASE tracker_DB;

USE tracker_DB;

CREATE TABLE department (
	department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
	role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
	salary DECIMAL(10,2) NULL,
    department_id INT NULL,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department (department_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE employee (
	employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL, 
    manager_id INT NULL,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (role_id) REFERENCES role (role_id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee (employee_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Creating departments--
INSERT INTO department (name)
VALUES ("Human Resources"), ("Development"), ("Sales");

-- Creating roles for departments--
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1), ("HR Representative", 80000, 1), 
("Dev", 90000, 2), ("Lead Developer", 120000, 2), 
("Lead Sales Rep", 100000, 3), ("Sales Rep", 80000, 3);

-- Creating employees
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Gracie", "Dingles", 1), ("Andres", "Molestina", 2),
 ("Max", "Molestina", 4), ("Santos", "Quinto", 3), 
 ("Martha", "Quinto", 5), ("Angel", "Alvarado", 6); 