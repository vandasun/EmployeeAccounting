const db = require('../config/database');

const createEmployee = async (req, res) => {
  try {
    const {
      last_name,
      first_name,
      patronymic,
      birth_date,
      passport_series,
      passport_number,
      phone_number,
      email,
      address,
      department_id,
      position_id,
      salary,
      hire_date
    } = req.body;
    
    if (!last_name || !first_name || !hire_date) {
      return res.status(400).json({ 
        error: 'Last name, first name, and hire date are required' 
      });
    }
    
    const query = `
      INSERT INTO employees (
        last_name, first_name, patronymic, birth_date,
        passport_series, passport_number, phone_number, email,
        address, department_id, position_id, salary, hire_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      last_name,
      first_name,
      patronymic || null,
      birth_date || null,
      passport_series || null,
      passport_number || null,
      phone_number || null,
      email || null,
      address || null,
      department_id || null,
      position_id || null,
      salary || null,
      hire_date
    ];
    
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEmployee
};