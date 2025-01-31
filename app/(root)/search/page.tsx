import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/Profileheader";

import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

async function Search() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    return (
        <h1>Search</h1>
    )
}

export default Search