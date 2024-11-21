'use client'

import { useAddFriend, useUserNotFriend } from '@/data/user'
import Image from 'next/image'
import React from 'react'

const SuggestFriend = () => {
    const user = JSON.parse(window.localStorage.getItem('user')!)
    const { data } = useUserNotFriend({ id: user?._id })

    const { mutate: addFriend } = useAddFriend()

    const handleAddFriend = (receiverId: string) => {
        addFriend({ receiverId })
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Gợi ý kết bạn</span>
            </div>
            {data?.metadata.map((item: any) => (
                <div key={item._id} className="flex items-center gap-2 rounded-md hover:bg-slate-50 p-2">
                    <Image
                        src={item?.picturePath ? `http://localhost:3001/assets/${item?.picturePath}` : '/no-avatar.png'}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="font-medium text-base mb-1">{item.name}</span>
                        <div className="flex gap-2">
                            <button
                                className="text-white font-normal btn btn-info btn-sm"
                                onClick={() => handleAddFriend(item._id)}
                            >
                                Thêm bạn bè
                            </button>
                            <button className="font-normal  btn btn-active btn-sm">Xóa</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SuggestFriend
