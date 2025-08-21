import mysql from 'mysql2/promise';

let connection = null;

export async function connectToDatabase() {
    try {

        if (connection) {
            await connection.ping();
            return connection;
        }
        console.log('Connecting to database');

        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '', 
            database: process.env.DB_NAME || 'your_database_name',
            port: process.env.DB_PORT || 3306,
            timezone: '+00:00',
            charset: 'utf8mb4'
        };

        console.log('Database config:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port,
            password: dbConfig.password ? '***' : 'NO PASSWORD SET'
        });

        connection = await mysql.createConnection(dbConfig);
        
        console.log('Database connected');
        return connection;

    } catch (error) {
        console.error('Database connection failed:', error.message);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied - Check username/password in .env file');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused - Is MySQL server running?');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist - Check DB_NAME in .env');
        }
        
        throw error;
    }
}

export async function closeDatabaseConnection() {
    if (connection) {
        await connection.end();
        connection = null;
        console.log('Database connection closed');
    }
}

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit(0);
});