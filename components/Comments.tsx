import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GrEmoji } from 'react-icons/gr'
import { useCommentsQuery, useCreateComment } from '@/data/comment'
import Comment from './Comment'
import { useAuthStore } from '@/store'

const commentValidateSchema = yup.object().shape({
    content: yup.string().trim(),
})

export type FormComment = {
    content?: string
}

const defaultValues = {
    content: '',
}

const Comments = ({ postId }: { postId: string }) => {
    const { mutate: createComment } = useCreateComment()
    // const [page, setPage] = useState(1)
    const [showPicker, setShowPicker] = useState<boolean>(false)
    const { user } = useAuthStore()

    const { register, handleSubmit, setValue, getValues } = useForm<FormComment>({
        defaultValues,
        resolver: yupResolver(commentValidateSchema),
    })

    const onSubmit = ({ content }: FormComment) => {
        createComment({ content, postId })
        setValue('content', '')
    }
    const { comments } = useCommentsQuery({ page: 1, postId })

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        const currentValue = getValues('content')
        setValue('content', currentValue + emojiObject.emoji)
    }

    return (
        <div className="">
            <div className="flex items-center gap-4">
                <Image
                    src={user?.picturePath ? `http://localhost:3001/assets/${user.picturePath}` : '/no-avatar.png'}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                />
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 flex items-center relative justify-between px-6 py-2 text-sm rounded-xl w-full border border-white"
                >
                    <input
                        {...register('content')}
                        type="text"
                        placeholder="Bình luận..."
                        className="bg-transparent outline-none flex-1 caret-white text-white"
                    />
                    <GrEmoji
                        size={18}
                        className="cursor-pointer text-white"
                        onClick={() => setShowPicker((prev) => !prev)}
                    />
                    {showPicker && (
                        <div className="absolute right-0 bottom-full">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </form>
            </div>
            <div className="divider"></div>
            {/* <span
                onClick={() => setPage((prev) => prev + 1)}
                className="text-sm hover:underline cursor-pointer font-semibold"
            >
                Xem thêm bình luận
            </span> */}
            {comments?.map((comment: any) => (
                <Comment key={comment._id} data={comment} />
            ))}
        </div>
    )
}

export default Comments
