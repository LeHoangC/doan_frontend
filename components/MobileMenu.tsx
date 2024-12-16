'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <div
                className="flex flex-col gap-[4.5px] cursor-pointer md:hidden"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${
                        isOpen ? 'rotate-45' : ''
                    } origin-left ease-in-out duration-500`}
                ></div>
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${isOpen ? 'opacity-0' : ''} ease-in-out duration-500`}
                ></div>
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${
                        isOpen ? '-rotate-45' : ''
                    } origin-left ease-in-out duration-500`}
                ></div>
            </div>
            {isOpen && (
                <div className="absolute left-0 top-24 w-full h-[calc(100vh - 96px)] bg-black flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
                    <Link href="/">Trang chủ</Link>
                    <Link href="/messages">Tin nhắn</Link>
                    <Link href="/friends">Bạn bè</Link>
                </div>
            )}
        </div>
    )
}

export default MobileMenu
