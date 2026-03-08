const base = require('./employeeCreate');
const base = require('./employeeRead');
const base = require('./employeeUpdate');

const base = require('./referencesRead');

module.exports = {
  getEmployees: employeeRead.getEmployees,
  getEmployeeById: employeeRead.getEmployeeById,
  searchEmployees: employeeRead.searchEmployees,
  createEmployee: employeeCreate.createEmployee,
  updateEmployee: employeeUpdate.updateEmployee,
  fireEmployee: employeeUpdate.fireEmployee,
  
  getDepartments: departments.getDepartments,
  getPositions: positions.getPositions
};