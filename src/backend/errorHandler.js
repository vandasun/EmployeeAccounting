const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === '23505') {
    return res.status(400).json({ 
      error: 'Duplicate entry violates unique constraint' 
    });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({ 
      error: 'Referenced record does not exist' 
    });
  }
  
  res.status(500).json({ 
    error: 'Something went wrong on the server' 
  });
};

module.exports = errorHandler;