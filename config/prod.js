export const configProd = {
  dbURL: process.env.MONGODB_URL,
  dbName: process.env.DB_NAME || 'mister_toy_db',
}