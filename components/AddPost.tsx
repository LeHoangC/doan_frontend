'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaImage } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import { useForm, Controller } from 'react-hook-form'
import { useCreatePostMutation } from '@/data/post'
import { useAuthStore } from '@/store'

type CustomFile = File & {
    preview?: string
}

type AddPostFormData = {
    contentPost: string
    typePost: string
    imageChose?: CustomFile | null
}

const AddPost = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const { user } = useAuthStore()

    const { mutate: createPost, isPending, isSuccess } = useCreatePostMutation()

    const { control, handleSubmit, setValue, reset, watch } = useForm<AddPostFormData>({
        defaultValues: {
            contentPost: '',
            typePost: 'public',
            imageChose: null,
        },
    })

    const [imageChose, setImageChose] = useState<CustomFile | null>(null)

    const onSubmit = async (data: AddPostFormData) => {
        const formData = new FormData()
        formData.append('content', data.contentPost)
        formData.append('type', data.typePost)
        if (data.imageChose) {
            formData.append('picture', data.imageChose)
        }

        createPost(formData)
    }

    const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0] as CustomFile
            file.preview = URL.createObjectURL(file)
            setImageChose(file)
            setValue('imageChose', file) // Update react-hook-form value
        }
    }

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal()
        }
    }

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close()
        }
        reset({ contentPost: '', typePost: 'public', imageChose: null })
        setImageChose(null)
    }

    useEffect(() => {
        if (isSuccess) {
            closeModal()
        }
    }, [isSuccess])

    return (
        <div>
            <div className="p-4 bg-[#1f1f1f] shadow-md rounded-lg flex gap-4 justify-between items-center text-sm">
                <Image
                    alt="avatar"
                    src={user?.picturePath ? `http://localhost:3001/assets/${user?.picturePath}` : '/no-avatar.png'}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-full"
                />

                <div className="flex-1">
                    <div className="flex gap-4">
                        <input
                            readOnly
                            placeholder="Bạn đang nghĩ gì?"
                            className="flex-1 border-white bg-transparent rounded-lg px-2 py-3"
                            onClick={openModal}
                        />
                    </div>
                </div>
            </div>

            <dialog className="modal" ref={modalRef}>
                <form className="modal-box" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <p></p>
                        <p className="text-2xl font-bold">Tạo bài viết</p>
                        <span className="cursor-pointer" onClick={closeModal}>
                            <IoCloseSharp size={24} />
                        </span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex gap-3">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <Image
                                    alt="avatar"
                                    src={
                                        user?.picturePath
                                            ? `http://localhost:3001/assets/${user?.picturePath}`
                                            : '/no-avatar.png'
                                    }
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                            </div>
                        </div>
                        <div className="">
                            <p className="font-semibold">{user?.name}</p>
                            <Controller
                                name="typePost"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="select select-bordered select-xs max-w-xs font-semibold"
                                    >
                                        <option value="public">Công khai</option>
                                        <option value="private">Chỉ mình tôi</option>
                                    </select>
                                )}
                            />
                        </div>
                    </div>

                    <Controller
                        name="contentPost"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className="outline-none w-full mt-4"
                                rows={4}
                                placeholder="Bạn đang nghĩ gì thế?"
                                autoFocus={true}
                            ></textarea>
                        )}
                    />
                    <div className="divider"></div>

                    <div className="">
                        <input type="file" onChange={handlePickImage} hidden ref={inputRef} accept="image/*" />
                        <FaImage
                            className={`cursor-pointer opacity-70 ${imageChose && 'hidden'} my-2`}
                            size={32}
                            onClick={() => {
                                inputRef.current?.click()
                            }}
                        />
                        {imageChose && (
                            <div className="relative">
                                <img
                                    src={imageChose.preview}
                                    alt=""
                                    width={'50%'}
                                    height={'50%'}
                                    className="rounded-md"
                                />
                                <span
                                    className="absolute top-0 w-[50px] left-[50%] cursor-pointer"
                                    onClick={() => {
                                        setImageChose(null)
                                        setValue('imageChose', null) // Clear react-hook-form value
                                    }}
                                >
                                    <IoCloseSharp className="h-5 w-5" />
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={imageChose == null && watch('contentPost').trim() === ''}
                        >
                            <span className={`${isPending && 'loading'} loading-spinner`}></span>
                            Đăng
                        </button>
                    </div>
                </form>
                <form method="dialog" className="modal-backdrop" onSubmit={closeModal}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default AddPost
