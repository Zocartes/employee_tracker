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