import { fetchUsers, getActivity } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    // Fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const activity = await getActivity(userInfo._id) || []; // Ensure `activity` is always an array

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    activity.map((item) => (
                        <Link key={item._id} href={`/thread/${item.parentId}`}>
                            <article className="activity-card flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition">
                                <Image
                                    src={item.author.image}
                                    alt={`${item.author.name}'s profile picture`}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                                <p className="!text-small-regular text-light-1">
                                    <span className="mr-1 text-primary-500">
                                        {activity.author.name}
                                    </span>{" "}
                                    replied to your thread
                                </p>
                            </article>
                        </Link>
                    ))
                ) : (
                    <p className="!text-base-regular text-light-3">No recent activity.</p>
                )}
            </section>
        </section>
    );
}

export default Page;
