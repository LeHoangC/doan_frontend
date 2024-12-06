import React from 'react'
import ProfileCard from './ProfileCard'
import Link from 'next/link'
import { FaUserFriends } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import { IoSaveSharp } from 'react-icons/io5'

const LeftMenu = ({ type }: { type: 'home' | 'profile' }) => {
    return (
        <div className="sticky top-[120px] flex flex-col gap-6">
            {type === 'home' && <ProfileCard />}
            <div className="px-4 py-2 bg-[#1f1f1f] rounded-lg shadow-md text-sm text-white flex flex-col gap-2">
                <Link href="/friends" className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-600">
                    <FaUserFriends size={20} />
                    <span>Bạn bè</span>
                </Link>
                <hr className="my-2 h-0.5 border-t-0 bg-gray-700 dark:bg-white/10" />
                <Link href="/messages" className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-600">
                    <AiFillMessage size={20} />
                    <span>Tin nhắn</span>
                </Link>
                <hr className="my-2 h-0.5 border-t-0 bg-gray-700 dark:bg-white/10" />
                <Link href="/saved" className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-600">
                    <IoSaveSharp size={20} />
                    <span>Đã lưu</span>
                </Link>
                {/* <hr className="my-2 h-0.5 border-t-0 bg-gray-700 dark:bg-white/10" /> */}
            </div>
        </div>
    )
}

export default LeftMenu
