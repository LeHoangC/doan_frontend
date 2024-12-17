'use client'
import { useFriendRequest } from '@/data/user'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useAcceptFriend } from '@/data/user'
import { useAuthStore } from '@/store'

const FriendRequests = () => {
    const { user } = useAuthStore()

    const { data } = useFriendRequest({ id: user?._id! })
    const { mutate: acceptFriend } = useAcceptFriend()

    const handleAcceptFriend = (id: string) => {
        acceptFriend({ friendId: id })
    }

    return (
        <div className="p-4 bg-[#1f1f1f] rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Yêu cầu kết bạn</span>
                <Link href="/friends/requests" className="text-white text-sm hover:underline">
                    Xem tất cả
                </Link>
            </div>
            {data?.metadata.map((item: any) => (
                <div key={item._id} className="flex border-b-[0.5px] rounded-md text-white gap-4 p-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src={
                                item?.picturePath
                                    ? `http://localhost:3001/assets/${item?.picturePath}`
                                    : '/no-avatar.png'
                            }
                            alt=""
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">{item.name}</span>
                        <div className="flex gap-2">
                            <button className="bg-primary p-2 rounded-md " onClick={() => handleAcceptFriend(item._id)}>
                                Chấp nhận
                            </button>
                            <button className="bg-gray-200 text-black py-2 px-4 rounded-md">Xóa</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FriendRequests
