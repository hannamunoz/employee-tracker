// Setup dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
var fs = require('fs');
const consTable = require('console.table');
const { connect } = require('http2');

const SQL_FILE = fs.readFileSync('./schema.sql').toString();

// Setup connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    multipleStatements: true
});

// Setup connection ID
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as ID" + connection.threadId);
    startPrompt();
});

connection.query(SQL_FILE, function(err, res) {
    if (err) throw err;
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
var managerArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name);
        }
    })
    return managerArr;
}

// Add Employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstname',
            type: 'input',
            message: 'Enter employee first name '
        },
        {
            name: 'lastname',
            type: 'input',
            message: 'Enter employee last name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Enter employee role',
            choices: selectRole()
        },
        {
            name: 'choice',
            type: 'rawlist',
            message: 'Who is the manager for this employee',
            choices: selectManager()
        }
    ]).then(function (val) {
        var roleId = selectRole().indexOf(val.role) + 1;
        var managerId = selectManager().indexOf(val.choice) + 1;

        connection.query("INSERT INTO employee SET ?", 
        {
            first_name: val.firstName,
            last_name: val.lastName,
            manager_id: managerId,
            role_id: roleId
        },
        function (err) {
            if (err) throw err
            console.table(val);
            startPrompt();
        });
    });
}

// Update employee info
function updateEmployee() {
    connection.query("SELECT employee.last_name, employee.first_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
        if (err) throw err
        console.log(res);
        inquirer.prompt([
            {
                name: 'lastName',
                type: 'rawlist',
                choices: function() {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: 'What is the employee last name?',
            },
            {
                name: 'role',
                type: 'rawlist',
                message: 'What is the new employee title?',
                choices: selectRole()
            },
        ]).then(function(val) {
            var roleId = selectRole().indexOf(val.role) + 1;
            connection.query(`UPDATE employee SET employee.role_id = ${roleId} WHERE ?`,
            {
                last_name: val.lastName
            },
            function(err){
                if (err) throw err
                console.table(val);
                startPrompt();
            });
        });
    });
}

// Add employee role
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function(err, res) {
        inquirer.prompt([
            {
                name: 'Title',
                type: 'input',
                message: 'What is the employee role/title?'
            },
            {
                name: 'Salary',
                type: 'input',
                message: 'What is the employee salary?'
            }
        ]).then(function(res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )
        });
    });
}

// Add department
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What department would you like to add?'
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    });
}