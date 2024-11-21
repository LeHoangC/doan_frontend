'use client'
import { useFollowing } from '@/data/user'
import Image from 'next/image'
import React from 'react'

const ProfileCard = () => {
    const user = JSON.parse(window.localStorage.getItem('user')!)

    const { data } = useFollowing({ id: user?._id })

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
            <div className="h-20 relative">
                <Image src="/logo.png" alt="" fill className="rounded-md" />
                <Image
                    src="https://images.pexels.com/photos/29062949/pexels-photo-29062949/free-photo-of-ng-i-ph-n-sanh-di-u-trong-chi-c-ao-khoac-xanh-ngoai-tr-i-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
                />
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 justify-center">
                <p className="font-semibold">{user?.name}</p>
                <span className="block">{data?.metadata.length} Người theo dõi</span>
                <button className="bg-blue-500 text-white px-3 py-2 rounded-md">Hồ sơ</button>
            </div>
        </div>
    )
}

export default ProfileCard
