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
  const sql = 'SELECT * FROM department'
  db.query(sql, (error, response) => {
      if (error) throw error;
      let deptNamesArray = [];
      response.forEach((department) => {deptNamesArray.push(department.department_name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            this.addDepartment();
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: validate.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: validate.validateSalary
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
              if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
            });

            let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let crit = [createdRole, answer.salary, departmentId];

            db.query(sql, crit, (error) => {
              if (error) throw error;
              console.log(chalk.yellow.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(chalk.yellow.bold(`====================================================================================`));
              viewAllRoles();
            });
          });
      };
    });
  };


const addEmployee = () => {
  db.query('SELECT * FROM department', function(err,response){
    if(err){
      console.error(err)
    }
    let deptNamesArray = [];
    response.forEach((department)=>{deptNamesArray.push(department.department_name);});
    deptNamesArray.push('Create Department')
    console.log(deptNamesArray)

  })
}
promptUser();
