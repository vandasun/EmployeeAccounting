const db = require('../config/database');

// Получить всех сотрудников с фильтрацией
const getEmployees = async (req, res) => {
  try {
    const { department, position, showFired } = req.query;
    
    let query = `
      SELECT 
        e.id,
        CONCAT(e.last_name, ' ', e.first_name, 
          CASE WHEN e.patronymic IS NOT NULL THEN ' ' || e.patronymic ELSE '' END
        ) AS full_name,
        e.last_name,
        e.first_name,
        e.patronymic,
        e.birth_date,
        e.passport_series,
        e.passport_number,
        e.phone_number,
        e.email,
        e.address,
        e.department_id,
        d.name AS department,
        e.position_id,
        p.title AS position,
        e.salary,
        e.hire_date,
        e.fired,
        CASE WHEN e.fired THEN 'Уволен' ELSE 'Работает' END AS status
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;
    
    if (department) {
      query += ` AND d.name = $${paramCount}`;
      values.push(department);
      paramCount++;
    }
    
    if (position) {
      query += ` AND p.title = $${paramCount}`;
      values.push(position);
      paramCount++;
    }
    
    if (showFired === 'false') {
      query += ` AND e.fired = false`;
    } else if (showFired === 'true') {
      query += ` AND e.fired = true`;
    }
    
    query += ` ORDER BY e.id`;
    
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        e.*,
        d.name AS department_name,
        p.title AS position_title
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE e.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchQuery = `
      SELECT 
        e.id,
        CONCAT(e.last_name, ' ', e.first_name, 
          CASE WHEN e.patronymic IS NOT NULL THEN ' ' || e.patronymic ELSE '' END
        ) AS full_name,
        e.last_name,
        e.first_name,
        e.patronymic,
        d.name AS department,
        p.title AS position,
        e.fired
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE 
        LOWER(e.last_name) LIKE LOWER($1) OR
        LOWER(e.first_name) LIKE LOWER($1) OR
        LOWER(e.patronymic) LIKE LOWER($1)
      ORDER BY e.last_name, e.first_name
      LIMIT 20
    `;
    
    const result = await db.query(searchQuery, [`%${query}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  searchEmployees
};