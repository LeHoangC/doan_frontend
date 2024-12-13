'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = [
    {
        title: 'Tất cả bạn bè',
        href: '/friends',
    },
    {
        title: 'Gợi ý kết bạn',
        href: '/friends/sugesst',
    },
    {
        title: 'Lời mời kết bạn',
        href: '/friends/requests',
    },
    {
        title: 'Đã gửi lời mời',
        href: '/friends/recipient',
    },
    {
        title: 'Đang theo dõi',
        href: '/friends/following',
    },
]

export default function FriendLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex gap-6 pt-6 px-10">
            <div className="top-24 h-[calc(100%-96px)] w-[30%] border-r">
                <div className="sticky top-[120px]">
                    <div className="w-full">
                        <ul className="menu menu-lg rounded-box w-full space-y-2">
                            {menus.map((menu, i) => {
                                const isActive = pathname === menu.href
                                return (
                                    <li key={i} className={`rounded-md text-white ${isActive && 'bg-gray-200'}`}>
                                        <Link href={menu.href}>{menu.title}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <main className="w-[70%]">{children}</main>
        </div>
    )
}
