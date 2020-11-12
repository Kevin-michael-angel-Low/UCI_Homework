-- Q1, list employee number, last name, first name, sex, salary
SELECT e.emp_no, e.last_name, e.first_name, e.sex, s.salary
FROM employees e, salaries s
WHERE s.emp_no = e.emp_no;

-- Q2, list first name, last name, and hire date for employees hired in 1986
SELECT e.first_name, e.last_name, e.hire_date
FROM employees e
WHERE e.hire_date BETWEEN '$1986-01-01' AND '$1986-12-31'

-- Q3, list the manager of each department with the dept. number, dept name, manager's employee number, last name, and first name
SELECT departments.dept_no, departments.dept_name, dept_manager.emp_no, employees.last_name, employees.first_name
FROM departments
JOIN dept_manager
ON departments.dept_no = dept_manager.dept_no
JOIN employees
ON employees.emp_no = dept_manager.emp_no

-- Q4, List department of each employee with employee number, last name, first name, and department name
SELECT employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
FROM employees
JOIN dept_manager
ON employees.emp_no = dept_manager.emp_no
JOIN departments
ON dept_manager.dept_no = departments.dept_no;

-- Q5 List first name, last name, sex of employees with first name "Hercules" and last name starting with "B"
SELECT employees.first_name, employees.last_name, employees.sex
FROM employees
WHERE employees.first_name = 'Hercules' AND left(employees.last_name,1) = 'B'

-- Q6 List employees in the Sales dept with their employee number, last name, first name, and dept. name
SELECT employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
FROM employees
JOIN dept_emp
ON dept_emp.emp_no = employees.emp_no
JOIN departments
ON departments.dept_name = 'Sales'

-- Q7 List all emplo9yees in Sales/Development departments including employee number, last name, first name, and dept. name
SELECT employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
FROM employees
JOIN dept_emp
ON dept_emp.emp_no = employees.emp_no
JOIN departments
ON departments.dept_name = 'Sales'

-- Q8 Descending order, list frequency of employee last names
SELECT employees.last_name,
COUNT (*) 
FROM employees
GROUP BY employees.last_name
ORDER BY COUNT(*) desc

-- Select statement to verify tables are filled out
SELECT hire_date FROM employees;