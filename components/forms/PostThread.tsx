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
// import { Input } from "../ui/input"
import * as z from 'zod';
// import { ChangeEvent } from "react"
import { Textarea } from "../ui/textarea"
// import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"
import { ThreadVaildation } from "@/lib/validations/Thread"
import { createThread } from "@/lib/actions/thread.action"
import { useOrganization } from "@clerk/nextjs"

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

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadVaildation>>({
    resolver: zodResolver(ThreadVaildation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadVaildation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;