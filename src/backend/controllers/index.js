const employeeCreate = require('./employeeCreate');
const employeeRead = require('./employeeRead');
const employeeUpdate = require('./employeeUpdate');

const referencesRead = require('./referencesRead');

module.exports = {
  getEmployees: employeeRead.getEmployees,
  getEmployeeById: employeeRead.getEmployeeById,
  searchEmployees: employeeRead.searchEmployees,
  createEmployee: employeeCreate.createEmployee,
  updateEmployee: employeeUpdate.updateEmployee,
  fireEmployee: employeeUpdate.fireEmployee,
  
  getDepartments: referencesRead.getDepartments,
  getPositions: referencesRead.getPositions
};