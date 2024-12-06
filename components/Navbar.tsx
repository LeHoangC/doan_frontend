'use client'
import Link from 'next/link'
import React, { useRef } from 'react'
import MobileMenu from './MobileMenu'
import Image from 'next/image'
import { FiHome, FiUsers } from 'react-icons/fi'
import { useLogout } from '@/data/user'
import { useAuthStore } from '@/store'
import { IoIosLogOut } from 'react-icons/io'
import { FaBell } from 'react-icons/fa'

const Navbar = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const { user } = useAuthStore()
    const { mutate: logout } = useLogout()

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal()
        }
    }

    return (
        <div className="h-24 flex items-center justify-between">
            <div className="md:hidden lg:block w-[20%]">
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={100} height={100} />
                </Link>
            </div>
            <div className="hidden md:flex w-[40%] text-sm items-center justify-between">
                <div className="flex gap-6 text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <FiHome size={24} />
                        <span>Trang chủ</span>
                    </Link>
                    <Link href="/friends" className="flex items-center gap-2">
                        <FiUsers size={24} />
                        <span>Bạn bè</span>
                    </Link>
                </div>
                <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-md">
                    <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none" />
                </div>
            </div>
            <div className="w-[40%] flex items-center gap-4 xl:gap-8 text-white justify-end">
                <Image
                    src={user?.picturePath ? `http://localhost:3001/assets/${user?.picturePath}` : '/logo.png'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full ring-1 ring-white"
                    alt="avatart"
                />
                <FaBell size={20} />
                <span>{user?.name}</span>
                {/* <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button> */}
                <button onClick={openModal} className="btn btn-outline text-white">
                    Đăng xuất
                    <IoIosLogOut size={24} />
                </button>
                <MobileMenu />
            </div>

            <dialog className="modal" ref={modalRef}>
                <div className="modal-box">
                    <p className="py-4">Bạn có chắc muốn đăng xuất hay không</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Đóng</button>
                        </form>
                        <button onClick={() => logout()} className="btn">
                            Đồng ý
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Navbar
