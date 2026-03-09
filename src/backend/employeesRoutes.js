const express = require('express');
const router = express.Router();
const employeesController = require('./controllers/index');

router.get('/employees', employeesController.getEmployees);
router.get('/employees/search', employeesController.searchEmployees);
router.get('/employees/:id', employeesController.getEmployeeById);
router.post('/employees', employeesController.createEmployee);
router.put('/employees/:id', employeesController.updateEmployee);
router.patch('/employees/:id/fire', employeesController.fireEmployee);

router.get('/departments', employeesController.getDepartments);
router.get('/positions', employeesController.getPositions);

module.exports = router;
