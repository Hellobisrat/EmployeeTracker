const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const inquirer = require("inquirer");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bisrat12",
  database: "employee_db",
});

const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please select an option:",
        choices: [
          "View All departments",
          "View All roles",
          "View All employees",
          "add a department",
          "add a role",
          "add an employee",
          "update a employee role",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
      if (choices === "View All departments") {
        viewAllDepartments();
      }
      if (choices === "View All roles") {
        viewAllrolles();
      }
      if (choices === "View All Employees") {
        viewAllEmployees();
      }
      if (choices === "add a department") {
        addDepartment();
      }
      if (choices === "add a role") {
        addRole();
      }
      if (choices === "add an employee") {
        addEmployee();
      }
      if (choices === "update a employee role ") {
        updateEmployee();
      }
    });
};

const viewAllDepartments = () => {
  db.query(`SELECT * FROM department`, function (err, results) {
    console.log(results);
  });
};

const viewAllrolless = () => {
  db.query(`SELECT * FROM roles`, function (err, results) {
    console.log(results);
  });
};

const viewAllEmployess = () => {
  db.query(`SELECT * FROM employee`, function (err, results) {
    console.log(results);
  });
};

const addDepartment =()=>{
  const question = inquirer.prompt(){
    
  }
}
