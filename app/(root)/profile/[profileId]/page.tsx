'use client'
import { use } from 'react'
import { useAddFriend, useProfile, useUpdateUser, useUploadAvatar } from '@/data/user'
import Image from 'next/image'
import React, { useRef } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaCamera, FaTransgender } from 'react-icons/fa'
import Link from 'next/link'
import { LuGraduationCap } from 'react-icons/lu'
import { VscHome } from 'react-icons/vsc'
import UserPost from '@/components/UserPost'
import AddPost from '@/components/AddPost'
import { useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINT } from '@/data/api-endpoint'
import { useAuthStore } from '@/store'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { profileValidationSchema } from './profile-update-schema'

type CustomFile = File & {
    preview?: string
}

const ProfileId = ({ params }: { params: Promise<{ profileId: string }> }) => {
    const modalRefAvatar = useRef<HTMLDialogElement>(null)
    const modalRefUpdate = useRef<HTMLDialogElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(profileValidationSchema),
    })

    const { user } = useAuthStore()
    const { profileId } = use(params)

    const { data: { metadata } = {} } = useProfile({ slug: profileId })
    const { data: { metadata: currentUser } = {} } = useProfile({ slug: user?.slug! })
    const { mutate } = useUploadAvatar()

    console.log(metadata)

    const openModalAvatar = () => {
        if (modalRefAvatar.current) {
            modalRefAvatar.current.showModal()
        }
    }

    const openModalUpdate = () => {
        if (modalRefUpdate.current) {
            modalRefUpdate.current.showModal()
        }
    }

    const closeModalUpdate = () => {
        if (modalRefUpdate.current) {
            modalRefUpdate.current.close()
        }
    }

    const handleClickAvatar = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        inputRef.current?.click()
    }

    const { mutate: updateUser } = useUpdateUser()
    const { updateUser: updateUserStore } = useAuthStore()

    const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0] as CustomFile
            file.preview = URL.createObjectURL(file)

            const formData = new FormData()
            formData.append('picture', file)

            mutate(formData, {
                onSuccess: (data) => {
                    updateUserStore({ picturePath: data.metadata })
                    queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.USER, profileId] })
                    queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.POST, profileId] })
                    queryClient.invalidateQueries({ queryKey: [API_ENDPOINT.COMMENT] })
                },
            })
        }
    }

    const onSubmit = async (data: any) => {
        updateUser(data)
        closeModalUpdate()
    }

    const { mutate: addFriend } = useAddFriend()

    const genderEnum = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác',
    }

    return (
        <div className="px-4 md:px-10 lg:px-12 xl:px-20 2xl:px-32 bg-black min-h-screen">
            <dialog ref={modalRefAvatar} className="modal w-full">
                <div className="modal-box h-96">
                    <Image src={`${metadata?.picturePath}`} alt="Profile" fill objectFit="contain" />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <div className="relative h-96 w-full">
                <Image src={`${metadata?.picturePath}`} alt="Cover" objectFit="cover" fill />
                {user?.slug === profileId && (
                    <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-md text-sm font-medium">
                        Chỉnh sửa ảnh bìa
                    </button>
                )}
            </div>

            <div className="relative flex justify-between max-w-7xl mx-auto mt-4 z-50 text-white">
                <div className="flex items-center space-x-4">
                    <div
                        className="-mt-16 ml-10 relative w-32 h-32 rounded-full border-4 border-white cursor-pointer"
                        onClick={openModalAvatar}
                    >
                        <Image
                            src={metadata?.picturePath ? `${metadata?.picturePath}` : '/no-avatar.png'}
                            alt="avatar"
                            fill
                            className="rounded-full select-none"
                        />
                        {profileId === user?.slug && (
                            <div
                                className="absolute z-[100] h-8 w-8 right-0 bottom-0 rounded-full flex justify-center items-center bg-white"
                                onClick={handleClickAvatar}
                            >
                                <input type="file" onChange={handlePickImage} hidden ref={inputRef} accept="image/*" />

                                <FaCamera size={20} fill="black" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{metadata?.name}</h2>
                        <p className="text-gray-500 font-medium">{metadata?.friends.length} người bạn</p>
                        <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                            {metadata?.friends.map((item: any) => (
                                <div className="avatar border-[2px]" key={item._id} title={item.name}>
                                    <Link className="w-8 h-8" href={item?.slug}>
                                        <Image
                                            width={32}
                                            height={32}
                                            alt=""
                                            src={item?.picturePath ? `${item?.picturePath}` : '/no-avatar.png'}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    {user?.slug !== profileId &&
                        metadata &&
                        !currentUser?.friends?.map((item: any) => item._id).includes(metadata?._id) && (
                            <button
                                className="bg-primary text-white ml-4 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                                onClick={() => addFriend({ receiverId: metadata._id })}
                            >
                                <AiOutlinePlus />
                                Thêm bạn bè
                            </button>
                        )}
                </div>
                <div className="flex space-x-2 items-center">
                    {user?.slug === profileId && (
                        <button className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                            <AiOutlinePlus />
                            Thêm vào tin
                        </button>
                    )}
                    {/* <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                        <FaPen />
                        Chỉnh sửa trang cá nhân
                    </button> */}
                </div>
            </div>

            <div className="divider"></div>
            <div role="tablist" className="tabs tabs-bordered">
                <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab text-white"
                    aria-label="Bài viết"
                    defaultChecked
                />
                <div role="tabpanel" className="tab-content mt-10">
                    <div className="md:flex gap-20">
                        <div className="md:w-2/5 border border-gray-600 rounded-md sticky top-28 h-fit space-y-4 p-4 text-white">
                            <h2 className="text-2xl font-semibold">Giới thiệu</h2>
                            <div className="flex items-center gap-2">
                                <LuGraduationCap size={24} />
                                <p>
                                    Đã học tại:{' '}
                                    <span className="font-medium">{metadata?.education ?? '( Chưa cập nhật )'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <VscHome size={24} />
                                <p>
                                    Sống tại:{' '}
                                    <span className="font-medium">{metadata?.location ?? '( Chưa cập nhật )'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTransgender size={24} />
                                <p>{metadata?.gender ? genderEnum[metadata?.gender] : '( Chưa cập nhật )'}</p>
                            </div>
                            {user?.slug === profileId && (
                                <button onClick={openModalUpdate} className="btn w-full">
                                    Chỉnh sửa chi tiết
                                </button>
                            )}
                        </div>
                        <div className="md:w-3/5 space-y-4">
                            {user?.slug === profileId && <AddPost />}
                            <UserPost userSlug={profileId} />
                        </div>
                    </div>
                    <dialog className="modal" ref={modalRefUpdate}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="modal-box flex-1 flex flex-col gap-4 items-center relative justify-between p-6 text-sm rounded-xl w-full"
                        >
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="" className="text-xl ml-1">
                                    Học vấn:
                                </label>
                                <input
                                    {...register('education')}
                                    defaultValue={metadata?.education ?? ''}
                                    type="text"
                                    placeholder="Đã học tại"
                                    className="flex-1 w-full p-4 outline-none border rounded-md border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="" className="text-xl ml-1">
                                    Sống tại:
                                </label>
                                <input
                                    {...register('location')}
                                    defaultValue={metadata?.location ?? ''}
                                    type="text"
                                    placeholder="VD: ha noi"
                                    className="flex-1 w-full p-4 outline-none border rounded-md border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="" className="text-xl ml-1">
                                    Giới tính:
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    defaultValue={metadata?.gender ?? 'other'}
                                    {...register('gender')}
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div className="">
                                <button
                                    type="button"
                                    onClick={closeModalUpdate}
                                    className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 motion-reduce:transition-none dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </dialog>
                </div>

                <input type="radio" name="my_tabs_1" role="tab" className="tab text-white" aria-label="Bạn bè" />
                <div role="tabpanel" className="tab-content mt-10">
                    Tab content 2
                </div>

                <input type="radio" name="my_tabs_1" role="tab" className="tab text-white" aria-label="Ảnh" />
                <div role="tabpanel" className="tab-content mt-10">
                    Tab content 3
                </div>
            </div>
        </div>
    )
}

export default ProfileId
