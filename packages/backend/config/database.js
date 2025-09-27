import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Usar MONGODB_URI si está disponible, sino usar variables individuales
    const mongoURI = process.env.MONGODB_URI || (() => {
      const {
        MONGODB_HOST = 'localhost',
        MONGODB_PORT = '27017',
        MONGODB_DATABASE = 'tpa_db',
        MONGODB_USERNAME,
        MONGODB_PASSWORD,
        MONGODB_AUTH_SOURCE = 'admin'
      } = process.env;

      if (MONGODB_USERNAME && MONGODB_PASSWORD) {
        return `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;
      } else {
        return `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
      }
    })();

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB desconectado');
  } catch (error) {
    console.error('Error desconectando MongoDB:', error.message);
  }
};