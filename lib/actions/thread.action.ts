'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import { create } from "domain";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread ({text, author, communityId, path}: Params) {
    try {
        connectDB()
    const createThread = await Thread.create({
        text,
        author,
        community: null, 
    })

    await User.findByIdAndUpdate(author, {
        $push: {
            threads: createThread._id
        }
    })

    revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error Creating Thread: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;  // calculate the number of post to skip

    const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User})
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })

        const totalPostsCoount = await Thread.countDocuments({ parentId: {
            $in: [null, undefined]
        }})

        const posts = await postsQuery.exec()

        const isNext = totalPostsCoount > skipAmount + posts.length;

        return { posts, isNext }
}

export async function fetchThreadById(id: string){
    connectDB()

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

            return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string,
) {
    connectDB();

    try {
       const originalThread = await Thread.findById(threadId);
       
       if (!originalThread){
        throw new Error("Thread not found")
       }

       const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId,
       })

       const savedCommentThread = await commentThread.save()

       originalThread.children.push(savedCommentThread._id);

       await originalThread.save()

       revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectDB();

        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            })

            return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
   userId: string;
   searchString?: string;
   pageNumber?: number;
   pageSize?: number;
   sortBy: SortOrder;
}) {
    try {
        connectDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        }

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getActivity(userId: string){
    try {
        connectDB();

        const userThreads = await Thread.find({ author: userId})

        const childThreadsIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({ _id: { $in: childThreadsIds }, author: { $ne: userId }}).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;
    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}