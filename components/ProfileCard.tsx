'use client'
import { useFriends } from '@/data/user'
import { useAuthStore } from '@/store'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProfileCard = () => {
    const { user } = useAuthStore()
    const { data } = useFriends({ id: user?._id! })

    return (
        <div className="p-4 bg-[#1f1f1f] rounded-lg shadow-md text-white text-sm flex flex-col gap-6">
            <div className="h-20 relative">
                <Image src="https://picsum.photos/200/300" alt="" fill className="rounded-md" />
                <Image
                    src={user?.picturePath ? `http://localhost:3001/assets/${user?.picturePath}` : '/no-avatar.png'}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
                />
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 justify-center">
                <p className="font-semibold">{user?.name}</p>
                <span className="block">{data?.metadata.length} bạn bè</span>
                <Link href={`profile/${user?.slug}`} className="bg-primary text-white px-3 py-2 rounded-md">
                    Hồ sơ
                </Link>
            </div>
        </div>
    )
}

export default ProfileCard
