const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
});

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  try {
    // OBTENER PRODUCTOS
    if (method === 'GET') {
      const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows)
      };
    }

    // CREAR PRODUCTO
    if (method === 'POST') {
      const { name, price, category, description, image } = JSON.parse(event.body);
      const result = await pool.query(
        'INSERT INTO products (name, price, category, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, category, description, image]
      );
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result.rows[0])
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
