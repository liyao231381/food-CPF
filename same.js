const { Pool } = require('pg');
require('dotenv').config(); // 确保加载 .env 文件

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function findDuplicateFoodNames() {
  const client = await pool.connect();

  try {
    const query = `
      SELECT foodname, COUNT(*)
      FROM food
      GROUP BY foodname
      HAVING COUNT(*) > 1;
    `;

    const result = await client.query(query);

    if (result.rows.length > 0) {
      console.log("以下是重复的食材名称：");
      result.rows.forEach(row => {
        console.log(`- ${row.foodname} (重复 ${row.count} 次)`);
      });
    } else {
      console.log("没有找到重复的食材名称。");
    }
  } catch (err) {
    console.error("查询失败:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

findDuplicateFoodNames().catch(console.error);
