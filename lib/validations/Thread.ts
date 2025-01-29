import * as z from 'zod';

export const ThreadVaildation = z.object({
    thread: z.string().nonempty().min(4, { message: 'Minimum 3 characters'}),
    accountId: z.string()
})

export const CommentVaildation = z.object({
    thread: z.string().nonempty().min(4, { message: 'Minimum 3 characters'}),
})