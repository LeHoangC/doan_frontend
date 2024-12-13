'use client'
import CardUser from '@/components/CardUser'
import { useDeleteFriend, useFriends } from '@/data/user'
import { useAuthStore } from '@/store'
import React from 'react'

const Friends = () => {
    const { user } = useAuthStore()
    const { data } = useFriends({ id: user?._id! })
    const { mutate: remove } = useDeleteFriend()

    const handleDeleteFriend = async (friendId: string) => {
        remove({ friendId })
    }

    return (
        <div className="">
            <h3 className="mb-2 mt-0 text-3xl font-medium leading-tight text-primary">Tất cả bạn bè</h3>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {!data?.metadata.length ? (
                    <h2 className="text-white">Danh sách bạn bè trống</h2>
                ) : (
                    data?.metadata?.map((item: any) => (
                        <CardUser key={item._id} data={item} btnRm="Xóa bạn" handleBtnRm={handleDeleteFriend} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Friends
