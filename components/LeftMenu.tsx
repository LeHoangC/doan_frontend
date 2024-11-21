import React from 'react'
import ProfileCard from './ProfileCard'
import Link from 'next/link'
import { FiUsers } from 'react-icons/fi'
import { FaUserFriends } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import { CiSaveDown2 } from 'react-icons/ci'

const LeftMenu = ({ type }: { type: 'home' | 'profile' }) => {
    return (
        <div className="sticky top-[120px] flex flex-col gap-6">
            {type === 'home' && <ProfileCard />}
            <div className="px-4 py-2 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
                <Link href="/friends" className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100">
                    <FaUserFriends size={20} />
                    <span>Bạn bè</span>
                </Link>
                <hr className="my-2 h-0.5 border-t-0 bg-neutral-50 dark:bg-white/10" />
                <Link href="/mesages" className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100">
                    <AiFillMessage size={20} />
                    <span>Tin nhắn</span>
                </Link>
                <hr className="my-2 h-0.5 border-t-0 bg-neutral-50 dark:bg-white/10" />
                <Link href="/saved" className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100">
                    <CiSaveDown2 size={20} />
                    <span>Đã lưu</span>
                </Link>
                <hr className="my-2 h-0.5 border-t-0 bg-neutral-50 dark:bg-white/10" />
            </div>
        </div>
    )
}

export default LeftMenu
