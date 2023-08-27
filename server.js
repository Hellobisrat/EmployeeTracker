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
  console.log("function start");
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
  const sql = "SELECT * FROM department";
  db.query(sql, (error, response) => {
    if (error) throw error;
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.name);
    });
    deptNamesArray.push("Create Department");
    console.log(deptNamesArray);
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role in?",
          choices: deptNamesArray,
        },
      ])
      .then((answer) => {
        if (answer.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of your new role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of this new role?",
          },
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let department_id;

          response.forEach((department) => {
            if (departmentData.departmentName === department.name) {
              department_id = department.id;
            }
          });

          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let crit = [createdRole, answer.salary, department_id];

          db.query(sql, crit, (error) => {
            if (error) throw error;

            console.log(`Role successfully created!`);

            viewAllRoles();
          });
        });
    };
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const crit = [answer.fistName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            db.query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  db.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!");
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

const updateEmployee = () => {
  console.log('start update')
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });
    console.log(employeeNamesArray);

    let sql = `SELECT role.id, role.title FROM role`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          db.query(sql, [newTitleId, employeeId], (error) => {
            if (error) throw error;

            console.log((`Employee Role Updated`));

            promptUser();
          });
        });
    });
  });
};
promptUser();
