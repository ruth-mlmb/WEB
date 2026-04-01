import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(`[db] connected host=${conn.connection.host} db=${process.env.DB_NAME}`);
    return conn;
  } catch (error) {
    console.error('[db] connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
