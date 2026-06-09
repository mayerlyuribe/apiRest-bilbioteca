import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (err) {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB conectado: ${conn.connection.host}`);
    }

  } catch (error) {
    console.error(`Error al conectar: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;