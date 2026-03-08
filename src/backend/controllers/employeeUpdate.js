const db = require('../config/database');

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Проверяем, не уволен ли сотрудник
    const checkQuery = 'SELECT fired FROM employees WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    if (checkResult.rows[0].fired) {
      return res.status(403).json({ 
        error: 'Cannot edit fired employee' 
      });
    }
    
    // Динамическое построение UPDATE запроса
    const setClause = [];
    const values = [];
    let paramCount = 1;
    
    Object.entries(updates).forEach(([key, value]) => {
      // Исключаем id и fired из обновления
      if (key !== 'id' && key !== 'fired') {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value === '' ? null : value);
        paramCount++;
      }
    });
    
    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id); // Добавляем id для WHERE clause
    
    const query = `
      UPDATE employees 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fireEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE employees 
      SET fired = true
      WHERE id = $1 AND fired = false
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Employee not found or already fired' 
      });
    }
    
    res.json({ 
      message: 'Employee fired successfully', 
      employee: result.rows[0] 
    });
  } catch (error) {
    console.error('Error firing employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  updateEmployee,
  fireEmployee
};