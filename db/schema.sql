DROP DATABASE IF EXISTS employee_db

CREATE DATABASE employee_db

USE employee_db

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY ,
  name VARCHAR(30)
)

CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY ,
  title VARCHAR(30),
  salary  DECIMAL,
  department_id  INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES department (id)
  ON DELETE SET NULL
)

CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY ,
  first_name VARCHAR(30),
  last_name DECIMAL,
  role_id  INT NOT NULL,
  FOREIGN KEY (role_id_id)
  REFERENCES role (id)
  ON DELETE SET NULL
  manager_id INT 
  FOREIGN KEY(manager_id)
  REFERENCES employee(id)
  ON DELETE SET NULL
)
