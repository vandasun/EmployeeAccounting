const API_URL = 'http://localhost:5000/api';

let departments = [];
let positions = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();
    loadPositions();
    loadEmployees();
    setupEventListeners();
    initPhoneMask();
});
