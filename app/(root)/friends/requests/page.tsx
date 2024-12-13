'use client'
import CardUser from '@/components/CardUser'
import { useAcceptFriend, useRequests } from '@/data/user'
import { useAuthStore } from '@/store'
import React from 'react'

const Following = () => {
    const { user } = useAuthStore()
    const { data } = useRequests({ id: user?._id! })

    const { mutate: acceptFriend } = useAcceptFriend()

    const handleAcceptFriend = (id: string) => {
        acceptFriend({ friendId: id })
    }

    return (
        <div className="">
            <h3 className="mb-2 mt-0 text-3xl font-medium leading-tight text-primary">Lời mời kết bạn</h3>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {!data?.metadata.length ? (
                    <h2 className="text-white">Danh sách trống</h2>
                ) : (
                    data?.metadata?.map((item: any) => (
                        <CardUser
                            key={item._id}
                            data={item}
                            title="Chấp nhận"
                            btnRm="Xóa"
                            handlebtnTitle={handleAcceptFriend}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Following
