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