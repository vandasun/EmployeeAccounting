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

function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `notification ${type}`;
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}