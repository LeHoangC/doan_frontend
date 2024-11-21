import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GrEmoji } from 'react-icons/gr'
import { useCommentsQuery, useCreateComment } from '@/data/comment'
import Comment from './Comment'

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
    const { mutate: createComment, isSuccess } = useCreateComment()
    const [page, setPage] = useState(1)

    const { register, handleSubmit, setValue, getValues } = useForm<FormComment>({
        defaultValues,
        resolver: yupResolver(commentValidateSchema),
    })

    const onSubmit = ({ content }: FormComment) => {
        createComment({ content, postId })
        setValue('content', '')
    }
    const { comments } = useCommentsQuery({ page, postId })

    return (
        <div className="">
            <div className="flex items-center gap-4">
                <Image
                    src="https://images.pexels.com/photos/29062949/pexels-photo-29062949/free-photo-of-ng-i-ph-n-sanh-di-u-trong-chi-c-ao-khoac-xanh-ngoai-tr-i-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                />
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 flex items-center justify-between bg-slate-100 px-6 py-2 text-sm rounded-xl w-full"
                >
                    <input
                        {...register('content')}
                        type="text"
                        placeholder="Bình luận..."
                        className="bg-transparent outline-none flex-1"
                    />
                    <GrEmoji size={18} className="cursor-pointer" />
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
