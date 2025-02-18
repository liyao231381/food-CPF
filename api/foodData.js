// pages/api/foodData.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // 考虑配置正确的 SSL 证书以提高安全性
    }
});

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT foodname, type, carbon, protein, fat FROM food');
            client.release();

            // 将查询结果组织成您需要的格式
            const foodData = {
                carbon: [],
                protein: [],
                fat: []
            };

      result.rows.forEach(row => {
        switch (row.type) {
          case '碳水来源':
            foodData.carbon.push({
                foodname: row.foodname,
                carbon: row.carbon,
                protein: row.protein,
                fat: row.fat
            });
            break;
          case '蛋白质来源':
            foodData.protein.push({
                foodname: row.foodname,
                carbon: row.carbon,
                protein: row.protein,
                fat: row.fat
            });
            break;
          case '脂肪来源':
            foodData.fat.push({
                foodname: row.foodname,
                carbon: row.carbon,
                protein: row.protein,
                fat: row.fat
            });
            break;
          default:
            // 可以选择处理未知类型
        }
      });

            res.status(200).json(foodData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: '服务器错误' });
        }
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
};

