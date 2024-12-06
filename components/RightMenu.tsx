import React from 'react'
import FriendRequests from './FriendRequests'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'
import SuggestFriend from './SuggestFriend'

const RightMenu = ({ userId }: { userId?: string }) => {
    return (
        <div className="sticky top-[120px]">
            <div className="flex flex-col gap-4">
                {userId ? (
                    <>
                        <UserInfoCard />
                        <UserMediaCard />
                    </>
                ) : null}
                <FriendRequests />
                <SuggestFriend />
            </div>
        </div>
    )
}

export default RightMenu
