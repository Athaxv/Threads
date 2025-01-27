"use client"

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        image: string,
        bio: string,
    },
    btnTitle: string
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    return (
        <div>
            Account Profile 
        </div>
    )
}

export default AccountProfile;