'use client'
import Link from 'next/link'
import React from 'react'
import MobileMenu from './MobileMenu'
import Image from 'next/image'
import { FiHome, FiUsers } from 'react-icons/fi'
import { useLocalStorage } from '@reactuses/core'
import { useLogout } from '@/data/user'

const Navbar = () => {
    const [user] = useLocalStorage<string>('user', null)
    const parseUser = JSON.parse(user!)
    const { mutate: logout } = useLogout()

    return (
        <div className="h-24 flex items-center justify-between">
            <div className="md:hidden lg:block w-[20%]">
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={100} height={100} />
                </Link>
            </div>
            <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
                <div className="flex gap-6 text-gray-600">
                    <Link href="/" className="flex items-center gap-2">
                        <FiHome size={20} />
                        <span>Trang chủ</span>
                    </Link>
                    <Link href="/friends" className="flex items-center gap-2">
                        <FiUsers size={20} />
                        <span>Bạn bè</span>
                    </Link>
                </div>
                <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-md">
                    <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none" />
                </div>
            </div>
            <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
                <Image
                    src={
                        parseUser?.picturePath ? `http://localhost:3001/assets/${parseUser?.picturePath}` : '/logo.png'
                    }
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    alt="avatart"
                />
                <span>{parseUser?.name}</span>
                <button onClick={() => logout()} className="text-blue-400">
                    Đăng xuất
                </button>
                <MobileMenu />
            </div>
        </div>
    )
}

export default Navbar
