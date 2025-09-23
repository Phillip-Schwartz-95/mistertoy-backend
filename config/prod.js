export const configProd = {
  dbURL: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || 'mister_toy_db',
}