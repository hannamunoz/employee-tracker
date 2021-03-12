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
    })
}
