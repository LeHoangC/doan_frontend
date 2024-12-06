'use client'
import { useFriendRequest } from '@/data/user'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'
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
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Yêu cầu kết bạn</span>
                <Link href="/" className="text-blue-500 text-sm">
                    Xem tất cả
                </Link>
            </div>
            {data?.metadata.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src={
                                item?.picturePath
                                    ? `http://localhost:3001/assets/${item?.picturePath}`
                                    : '/no-avatar.png'
                            }
                            alt=""
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-semibold">{item.name}</span>
                    </div>
                    <div className="flex justify-end">
                        <IoIosCheckmarkCircle
                            size={20}
                            color="blue"
                            className="cursor-pointer"
                            onClick={() => handleAcceptFriend(item._id)}
                        />
                        <IoIosCloseCircle size={20} className="cursor-pointer" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FriendRequests
