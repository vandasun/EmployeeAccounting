const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./employeesRoutes');
const errorHandler = require('./errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов (для разработки)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Маршруты API
app.use('/api', employeeRoutes);

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ 
    message: 'HR API is running',
    endpoints: {
      employees: '/api/employees',
      search: '/api/employees/search?query=',
      departments: '/api/departments',
      positions: '/api/positions'
    }
  });
});

// Обработка ошибок
app.use(errorHandler);

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});