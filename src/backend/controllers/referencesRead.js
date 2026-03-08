const db = require('../config/database');

const getDepartments = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM departments ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPositions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM positions ORDER BY title');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDepartments,
  getPositions
};