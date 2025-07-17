import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Db");
    } catch (err) {
        console.log("Failed to connect to db:", err.message);
        process.exit(1);
    }
};