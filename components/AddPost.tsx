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
    const modalFormCreate = useRef<HTMLDialogElement>(null)
    const modalGenCaption = useRef<HTMLDialogElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [textInputAi, setTextInputAi] = useState('')
    const [content, setContent] = useState('')

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

    const openModalFormCreate = () => {
        if (modalFormCreate.current) {
            modalFormCreate.current.showModal()
        }
    }

    const closeModalFormCreate = () => {
        if (modalFormCreate.current) {
            modalFormCreate.current.close()
        }
        reset({ contentPost: '', typePost: 'public', imageChose: null })
        setImageChose(null)
    }

    const openModalGenCaption = () => {
        if (modalGenCaption.current) {
            modalGenCaption.current.showModal()
        }
    }

    const closeModalGenCaption = () => {
        if (modalGenCaption.current) {
            modalGenCaption.current.close()
        }
        setContent('')
        setTextInputAi('')
    }

    useEffect(() => {
        if (isSuccess) {
            closeModalFormCreate()
        }
    }, [isSuccess])

    const handleGenTextToAi = async () => {
        setContent('')
        const response = await fetch(`http://localhost:3001/v1/api/posts/gen-caption?prompt=${textInputAi}`, {
            headers: {
                'Content-Type': 'text/event-stream',
            },
        })

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()

        while (true) {
            const { value, done } = await reader?.read()
            if (done) break
            setContent((prev) => prev + value)
        }
    }

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
                            onClick={openModalFormCreate}
                        />
                    </div>
                </div>
            </div>

            <dialog className="modal" ref={modalFormCreate}>
                <form className="modal-box" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <p></p>
                        <p className="text-2xl font-bold">Tạo bài viết</p>
                        <span className="cursor-pointer" onClick={closeModalFormCreate}>
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
                        <div className="ml-auto">
                            <button type="button" className="btn btn-primary btn-sm" onClick={openModalGenCaption}>
                                Tạo caption bằng AI
                            </button>

                            <dialog ref={modalGenCaption} className="modal">
                                <div className="modal-box flex flex-col w-11/12 max-w-5xl max-h-[540px]">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="w-full border-none outline-none px-2"
                                            placeholder="Nhập nội dung"
                                            value={textInputAi}
                                            onChange={(e) => setTextInputAi(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn text-sm font-normal btn-primary btn-sm"
                                            onClick={handleGenTextToAi}
                                        >
                                            Tạo
                                        </button>
                                    </div>
                                    <div className="divider"></div>
                                    <p className="py-4">{content}</p>
                                    <div className="divider"></div>
                                    <div className="ml-auto">
                                        <button
                                            type="button"
                                            className="btn text-white btn-error"
                                            onClick={closeModalGenCaption}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </dialog>
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
                <form method="dialog" className="modal-backdrop" onSubmit={closeModalFormCreate}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default AddPost
