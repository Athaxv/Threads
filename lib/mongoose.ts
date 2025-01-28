import mongoose from 'mongoose'

let isConnected = false;

export const connectDB = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URL){
        return console.log("MONGODB URL not found");
    }
    if (isConnected){
        return console.log("MongoDB already Connected");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error)
    }
}