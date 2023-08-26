const mysql = require("mysql2");
const fs = require("fs");
const inquirer = require("inquirer");

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
        viewAllRoles();
      }
      if (choices === "View All employees") {
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
    console.table(results);
    promptUser();
  });
};

const viewAllRoles = () => {
  db.query(
    `select *
  from department
  join role
  on department.id= role.department_id

  `,
    function (err, results) {
      console.table(results);
      promptUser();
    }
  );
};

const viewAllEmployees = () => {
  db.query(
    `select first_name,last_name, department.name as department ,title,salary
  from department
  join role
  on department.id= role.department_id
  join employee
  on employee.role_id= role.department_id
  `,
    function (err, results) {
      console.table(results);
      promptUser();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "what is the department ?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department SET ?`,
        [answer],
        function (err, results) {
          console.log(`Added ${answer} to the database`);
        }
      );
    });
};

const addRole = () => {
  db.query("SELECT * FROM department", function (err, result) {
    console.log(result)
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "what is the title?",
      },
      {
        type: "list",
        name: "department",
        message: "Please select department:",
        choices: ["Sales", "Engineering", "Finance", "Legal"],
      },
      {
        type: "input",
        name: "salary",
        message: "what is the salary?",
      },
    ])
    );
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "what is the employee firstname?",
    },
    {
      type: "input",
      name: "Last_name",
      message: "what is the employee lastname?",
    },
    {
      type: "list",
      name: "title",
      message: "what is the employee role?",
      choices: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Account Manager",
        "Accountant",
        "Legal Team Lead",
        "Lawyer",
      ],
    },
    {
      type: "list",
      name: "manager",
      message: "what is the employee manager?",
      choices: [
        "None",
        "John Doe",
        "Mike Chan",
        "Ashely Rodrigues",
        "Kevin Tupik",
        "Kunal Singh",
        "Malia Brown",
      ],
    },
  ]);
};

promptUser();
