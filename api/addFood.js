const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { foodname, type, carbon, protein, fat } = req.body;

        // 数据验证
        if (!foodname || !type || !carbon || !protein || !fat) {
            return res.status(400).json({ error: '所有字段都必须提供' });
        }

        try {
            const client = await pool.connect();

            // 检查是否已存在具有给定名称的食物
            const checkQuery = 'SELECT * FROM food WHERE foodname = $1';
            const checkValues = [foodname];
            const checkResult = await client.query(checkQuery, checkValues);

            if (checkResult.rows.length > 0) {
                client.release();
                return res.status(409).json({ error: '该食材已存在' }); // 使用 409 Conflict 状态码
            }

            // 如果不存在，则插入新的食物数据
            const query = `
                INSERT INTO food (foodname, type, carbon, protein, fat)
                VALUES ($1, $2, $3, $4, $5)
            `;
            const values = [foodname, type, carbon, protein, fat];

            await client.query(query, values);

            client.release();
            res.status(201).json({ message: '食材已成功添加!' }); // 使用 201 Created 状态码
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: '服务器错误' });
        }
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
};
