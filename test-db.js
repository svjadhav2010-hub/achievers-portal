const mysql = require('mysql2/promise');

async function connect() {
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL
    });

    console.log("🚀 Successfully connected to TiDB Cloud!");

    // Create the table manually (SQL you can actually trace)
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS Member (
            id VARCHAR(255) PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            startupName VARCHAR(255)
        )
    `);

    // Add the CEO
    await connection.execute(
        'INSERT IGNORE INTO Member (id, fullName, email, startupName) VALUES (?, ?, ?, ?)',
        ['1', 'Nashik Branch CEO', 'ceo.nashik@achieversclub.com', 'The Achievers Club']
    );

    const [rows] = await connection.execute('SELECT * FROM Member');
    console.log("Current Members:", rows);

    await connection.end();
}

connect().catch(console.error);