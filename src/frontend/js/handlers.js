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

function resetFilters() {
    document.getElementById('departmentFilter').value = '';
    document.getElementById('positionFilter').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    loadEmployees();
}

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