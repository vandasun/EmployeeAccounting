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

function openModal(employee = null) {
    document.getElementById('modalTitle').textContent = employee ? 'Редактировать' : 'Добавить сотрудника';
    
    if (employee) {
        document.getElementById('employeeId').value = employee.id || '';
        document.getElementById('lastName').value = employee.last_name || '';
        document.getElementById('firstName').value = employee.first_name || '';
        document.getElementById('patronymic').value = employee.patronymic || '';
        
        if (employee.birth_date) {
            const birthDate = new Date(employee.birth_date);
            document.getElementById('birthDate').value = birthDate.toISOString().split('T')[0];
        } else {
            document.getElementById('birthDate').value = '';
        }
        
        if (employee.hire_date) {
            const hireDate = new Date(employee.hire_date);
            document.getElementById('hireDate').value = hireDate.toISOString().split('T')[0];
        } else {
            document.getElementById('hireDate').value = '';
        }
        
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