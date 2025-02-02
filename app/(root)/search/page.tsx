import UserCard from "@/components/cards/UserCard";
import { fetchUsers } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Search() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    console.log("user details:",userInfo)
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
        sortBy: 'desc',
    })
    console.log("Result :", result)
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No users</p>
                ): (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person.id || person.username}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default Search