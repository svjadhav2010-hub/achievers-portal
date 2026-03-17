import mysql from 'mysql2/promise';

// This creates a connection pool, which is more efficient for Next.js
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});