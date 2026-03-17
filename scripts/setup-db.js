const mysql = require('mysql2/promise');

async function setup() {
    const connection = await mysql.createConnection({
        uri: 'mysql://ZFo7HjwMa8u8pPR.root:hzM7pJThYrHXXaxF@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}'
    });

    console.log("🔗 Connected to TiDB Cloud!");

    // Create the Member table manually
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS Member (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            startupName VARCHAR(255),
            industry VARCHAR(255),
            membership VARCHAR(50) DEFAULT 'Standard',
            joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("✅ Table 'Member' is ready.");

    // Add the Nashik Branch CEO
    await connection.execute(`
        INSERT IGNORE INTO Member (fullName, email, startupName, industry, membership) 
        VALUES ('Nashik Branch CEO', 'ceo.nashik@achieversclub.com', 'The Achievers Club', 'Entrepreneurship', 'Platinum')
    `);
    console.log("✅ CEO Record initialized.");

    await connection.end();
}

setup().catch(console.error);