'use server';

import { revalidatePath } from "next/cache";
import mongoose from "mongoose"; // ✅ Import mongoose to check ObjectId
import User from "../models/user.model";
import { connectDB } from "../mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params): Promise<void> {
    await connectDB(); // Ensure DB connection before query

    try {
        // ✅ Convert `userId` to ObjectId only if it's valid, else keep it as is
        const query = mongoose.Types.ObjectId.isValid(userId) 
            ? { _id: new mongoose.Types.ObjectId(userId) }
            : { userId }; 

        await User.findOneAndUpdate(
            query,
            {
                username: username?.toLowerCase() || null,
                name,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true,
                new: true, 
            }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        console.error("MongoDB Error:", error);
        throw new Error(`Failed to create or update the user: ${error.message}`);
    }
}

export async function fetchUser(userId: string) {
    try {
        await connectDB();

        const query = mongoose.Types.ObjectId.isValid(userId) 
            ? { _id: new mongoose.Types.ObjectId(userId) }
            : { userId }; 

        return await User.findOne(query);
    } catch (error: any) {
        console.error("MongoDB Error:", error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}
