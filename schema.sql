-- Create the database --
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Departments table --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

-- role table -- 
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Employee table --
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Feed into department --
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("legal");

-- Feed into employee for role --
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);

-- Employee values --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Hanna", "Monzo", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Taisha", "Pelker", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Chase", "Trenton", null, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Grace", "Tailor", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Trisha", "Cooler", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Aaron", "Crusher", 2, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tony", "Power", 3, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Lance", "Strong", 3, 2);

-- Selecting --
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
