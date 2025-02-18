// api/foodData.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM food');
        const food = result.rows;
        client.release();
        res.status(200).json(food);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '服务器错误' });
    }
};
