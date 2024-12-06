'use client'

import { useAddFriend, useUserNotFriend } from '@/data/user'
import { useAuthStore } from '@/store'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SuggestFriend = () => {
    const { user } = useAuthStore()
    const { data } = useUserNotFriend({ id: user?._id! })
    const { mutate: addFriend } = useAddFriend()

    const handleAddFriend = (receiverId: string) => {
        addFriend({ receiverId })
    }
    return (
        <div className="p-4 bg-[#1f1f1f] rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Gợi ý kết bạn</span>
            </div>
            <hr className="my-2 h-0.5 border-t-0 bg-gray-700 dark:bg-white/10" />
            {data?.metadata.map((item: any) => (
                <div key={item._id} className="flex items-center border-b-[0.5px] gap-2 rounded-md text-white p-4">
                    <Link href={`profile/${item.slug}`}>
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
                    </Link>
                    <div className="flex flex-col">
                        <span className="font-medium text-base mb-1">{item.name}</span>
                        <div className="flex gap-2">
                            <button className="bg-blue-500 p-2 rounded-md " onClick={() => handleAddFriend(item._id)}>
                                Thêm bạn bè
                            </button>
                            <button className="bg-gray-200 text-black py-2 px-4 rounded-md">Xóa</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SuggestFriend
