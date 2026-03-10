const API_URL = 'http://localhost:5000/api';

let departments = [];
let positions = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();
    loadPositions();
    loadEmployees();
    setupEventListeners();
});

function setupEventListeners() {
    // Поиск
    document.getElementById('searchBtn').onclick = loadEmployees;
    document.getElementById('searchInput').onkeypress = (e) => {
        if (e.key === 'Enter') loadEmployees();
    };
    
    // Фильтры
    document.getElementById('departmentFilter').onchange = loadEmployees;
    document.getElementById('positionFilter').onchange = loadEmployees;
    document.getElementById('statusFilter').onchange = loadEmployees;
    
    // Кнопки
    document.getElementById('resetBtn').onclick = resetFilters;
    document.getElementById('addBtn').onclick = () => openModal();
    
    // Модальное окно
    document.querySelector('.close').onclick = closeModal;
    document.getElementById('cancelBtn').onclick = closeModal;
    document.getElementById('employeeForm').onsubmit = saveEmployee;
    
    // Закрытие по клику вне модального окна
    window.onclick = (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    };
}

async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Ошибка запроса');
        return await response.json();
    } catch (error) {
        showMessage('Ошибка соединения с сервером', 'error');
        return null;
    }
}

async function loadDepartments() {
    const data = await fetchAPI(`${API_URL}/departments`);
    if (data) {
        departments = data;
        updateDepartmentSelects();
    }
}

async function loadPositions() {
    const data = await fetchAPI(`${API_URL}/positions`);
    if (data) {
        positions = data;
        updatePositionSelects();
    }
}

function updateDepartmentSelects() {
    const filter = document.getElementById('departmentFilter');
    const form = document.getElementById('departmentSelect');
    
    filter.innerHTML = '<option value="">Все отделы</option>';
    form.innerHTML = '';
    
    departments.forEach(d => {
        filter.innerHTML += `<option value="${d.name}">${d.name}</option>`;
        form.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
}

function updatePositionSelects() {
    const filter = document.getElementById('positionFilter');
    const form = document.getElementById('positionSelect');
    
    filter.innerHTML = '<option value="">Все должности</option>';
    form.innerHTML = '';
    
    positions.forEach(p => {
        filter.innerHTML += `<option value="${p.title}">${p.title}</option>`;
        form.innerHTML += `<option value="${p.id}">${p.title}</option>`;
    });
}

async function loadEmployees() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Загрузка...</td></tr>';
    
    const department = document.getElementById('departmentFilter').value;
    const position = document.getElementById('positionFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value;
    
    let url = `${API_URL}/employees?`;
    if (department) url += `department=${encodeURIComponent(department)}&`;
    if (position) url += `position=${encodeURIComponent(position)}&`;
    if (status !== 'all') url += `showFired=${status === 'fired'}&`;
    
    const employees = await fetchAPI(url);
    if (!employees) return;
    
    const filtered = search ? employees.filter(e => {
        const fullName = `${e.last_name} ${e.first_name} ${e.patronymic || ''}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    }) : employees;
    
    renderTable(filtered);
}

function renderTable(employees) {
    const tbody = document.getElementById('tableBody');
    
    if (!employees.length) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Нет данных</td></tr>';
        return;
    }
    
    tbody.innerHTML = employees.map(e => `
        <tr class="${e.fired ? 'fired' : ''}">
            <td>${e.last_name} ${e.first_name} ${e.patronymic || ''}</td>
            <td>${formatDate(e.birth_date)}</td>
            <td>${e.passport_series || ''} ${e.passport_number || ''}</td>
            <td>${e.phone_number || ''}</td>
            <td>${e.department || ''}</td>
            <td>${e.position || ''}</td>
            <td>${formatSalary(e.salary)}</td>
            <td>${formatDate(e.hire_date)}</td>
            <td>
                <span class="status-badge ${e.fired ? 'status-fired' : 'status-active'}">
                    ${e.fired ? 'Уволен' : 'Работает'}
                </span>
            </td>
            <td>
                <button class="btn" onclick="editEmployee(${e.id})" ${e.fired ? 'disabled' : ''}>
                    редактировать
                </button>
                <button class="btn btn-danger" onclick="fireEmployee(${e.id})" ${e.fired ? 'disabled' : ''}>
                    уволить
                </button>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    if (dateString.includes('T')) {
        const datePart = dateString.split('T')[0];
        return datePart;
    }
    
    return dateString;
}

function formatSalary(salary) {
    if (!salary) return '';
    return salary.toLocaleString() + ' ₽';
}

function resetFilters() {
    document.getElementById('departmentFilter').value = '';
    document.getElementById('positionFilter').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    loadEmployees();
}

function openModal(employee = null) {
    document.getElementById('modalTitle').textContent = employee ? 'Редактировать' : 'Добавить сотрудника';
    
    if (employee) {
        document.getElementById('employeeId').value = employee.id || '';
        document.getElementById('lastName').value = employee.last_name || '';
        document.getElementById('firstName').value = employee.first_name || '';
        document.getElementById('patronymic').value = employee.patronymic || '';
        document.getElementById('birthDate').value = employee.birth_date || '';
        document.getElementById('hireDate').value = employee.hire_date || '';
        document.getElementById('passportSeries').value = employee.passport_series || '';
        document.getElementById('passportNumber').value = employee.passport_number || '';
        document.getElementById('phoneNumber').value = employee.phone_number || '';
        document.getElementById('departmentSelect').value = employee.department_id || '';
        document.getElementById('positionSelect').value = employee.position_id || '';
        document.getElementById('salary').value = employee.salary || '';
    } else {
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeId').value = '';
    }
    
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.editEmployee = async function(id) {
    const employee = await fetchAPI(`${API_URL}/employees/${id}`);
    if (employee) openModal(employee);
};

window.fireEmployee = async function(id) {
    if (!confirm('Уволить сотрудника?')) return;
    
    const result = await fetchAPI(`${API_URL}/employees/${id}/fire`, {
        method: 'PATCH'
    });
    
    if (result) {
        showMessage('Сотрудник уволен', 'success');
        loadEmployees();
    }
};

async function saveEmployee(e) {
    e.preventDefault();
    
    const id = document.getElementById('employeeId').value;
    const data = {
        last_name: document.getElementById('lastName').value,
        first_name: document.getElementById('firstName').value,
        patronymic: document.getElementById('patronymic').value,
        birth_date: document.getElementById('birthDate').value,
        hire_date: document.getElementById('hireDate').value,
        passport_series: document.getElementById('passportSeries').value,
        passport_number: document.getElementById('passportNumber').value,
        phone_number: document.getElementById('phoneNumber').value,
        department_id: document.getElementById('departmentSelect').value || null,
        position_id: document.getElementById('positionSelect').value || null,
        salary: document.getElementById('salary').value || null
    };
    
    const url = id ? `${API_URL}/employees/${id}` : `${API_URL}/employees`;
    const method = id ? 'PUT' : 'POST';
    
    const result = await fetchAPI(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (result) {
        showMessage(id ? 'Сохранено' : 'Добавлено', 'success');
        closeModal();
        loadEmployees();
    }
}

function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `notification ${type}`;
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}