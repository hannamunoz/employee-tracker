// Setup dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const console = require('console.table');

// Setup connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_trackerDB'
});

// Setup connection ID
connection.connect(function(err) {
    if (err) throw err
    console.log(`Connected as ID ${connection.threadID}`);
    startPrompt();
});

// Starting Prompt
function startPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                'View All Employees',
                'View All Employees By Role',
                'View All Employees By Department',
                'Update Employee',
                'Add Employee',
                'Add Role',
                'Add Department'
            ]
        }
    ]).then(function(val) {
        switch (val.choice) {
            case 'View All Employees':
                viewAllEmployees();
            break;

            case 'View All Employees By Role':
                viewAllByRole();
            break;

            case 'View All Employees By Department':
                viewAllByDepartment();
            break;

            case 'Update Employee':
                updateEmployee();
            break;

            case 'Add Employee':
                addEmployee();
            break;

            case 'Add Role':
                addRole();
            break;

            case 'Add Department':
                addDepartment();
            break;
        }
    });
}

// View all employees
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err
        console.table(res);
        startPrompt();
    });
}

// View all roles
function viewAllByRole() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function(err, res) {
        if (err) throw err
        console.table(res);
        startPrompt();
    });
}

// View all by department
function viewAllByDepartment() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function(err, res) {
        if (err) throw err
        console.table(res);
        startPrompt();
    });
}

// Role query for role title for adding employee
var rolesArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            rolesArr.push(res[i].title);
        }
    });
    return rolesArr;
}

// Role query for managers for adding employee

