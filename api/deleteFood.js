const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { foodname } = req.body;

        // 数据验证
        if (!foodname) {
            return res.status(400).json({ error: '必须提供食材名称' });
        }

        try {
            const client = await pool.connect();

            // 检查是否存在具有给定名称的食物
            const checkQuery = 'SELECT * FROM food WHERE foodname = $1';
            const checkValues = [foodname];
            const checkResult = await client.query(checkQuery, checkValues);

            if (checkResult.rows.length === 0) {
                client.release();
                return res.status(404).json({ error: '未找到该食材' });
            }

            // 如果存在，则删除食物的数据
            const query = `
                DELETE FROM food
                WHERE foodname = $1
            `;
            const values = [foodname];

            await client.query(query, values);

            client.release();
            res.status(200).json({ message: '食材已成功删除!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: '服务器错误' });
        }
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
};
