"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import * as z from 'zod';
import { ChangeEvent } from "react"
import { Textarea } from "../ui/textarea"
import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"
import { ThreadVaildation } from "@/lib/validations/Thread"
import { createThread } from "@/lib/actions/thread.action"

// interface Props {
//     user: {
//         id: string,
//         objectId: string,
//         username: string,
//         name: string,
//         image: string,
//         bio: string,
//     },
//     btnTitle: string
// }

function PostThread({ userId }: { userId: string}) {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(ThreadVaildation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadVaildation>) => {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname
      })

      router.push('/')
    }

    return (
        <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex justify-start flex-col gap-10">
        <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex gap-3 w-full flex-col">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea 
                    rows={7}
                    {...field}
                    />
                    <FormMessage/>
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="bg-primary-500" type="submit"></Button>
        </form>
        </Form>
        </>
    )
}

export default PostThread