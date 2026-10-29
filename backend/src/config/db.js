import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB Connected sucessfully");
        
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1)
    }
}