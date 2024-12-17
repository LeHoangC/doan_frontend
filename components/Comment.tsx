import { useCommentsQuery, useCreateComment, useDeleteCommentMutation } from '@/data/comment'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLike } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import { TbMessageReportFilled } from 'react-icons/tb'
import { FormComment } from './Comments'
import { GrEmoji } from 'react-icons/gr'
import { useAuthStore } from '@/store'

const Comment = ({ data }: { data: any }) => {
    const [isReply, setIsReply] = useState(false)
    const [isShowReplyComment, setIsShowReplyComment] = useState(false)
    // const [page, setPage] = useState(1)

    const { mutate: createComment } = useCreateComment()
    const { mutate: deleteComment } = useDeleteCommentMutation()
    const { register, handleSubmit, setValue } = useForm<FormComment>({
        defaultValues: { content: '' },
    })

    const { user } = useAuthStore()

    const handleDeleteComment = async (commentId: string) => {
        const body = {
            commentId,
            postId: data.comment_postId,
        }
        deleteComment(body)
    }

    const { comments: repliedComments } = useCommentsQuery({
        page: 1,
        postId: data.comment_postId,
        parentCommentId: data._id,
    })

    const onSubmit = ({ content }: FormComment) => {
        setIsReply(false)
        createComment({ content, postId: data.comment_postId, parentCommentId: data._id })
        setValue('content', '')
    }

    const handleLoadReplyComment = () => {
        setIsShowReplyComment((prev) => !prev)
    }

    return (
        <div className="">
            <div className="flex gap-4 justify-between mt-6">
                <Image
                    src={
                        data?.comment_userId?.picturePath
                            ? `http://localhost:3001/assets/${data?.comment_userId?.picturePath}`
                            : '/no-avatar.png'
                    }
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col gap-1 text-white flex-1">
                    <span className="font-medium text-lg">{data?.comment_userId?.name}</span>
                    <p className="text-base break-words">{data.comment_content}</p>
                    {/* <ol className="border-s border-neutral-300 dark:border-neutral-500"> */}
                    <div className="flex flex-col text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-4">
                            <AiOutlineLike size={18} className="cursor-pointer" />
                            {/* <span className="text-gray-300">|</span>
                            <span className="text-gray-500 text-[14px]">231 Likes</span> */}
                            <div className="hover: text-sm cursor-pointer" onClick={() => setIsReply((prev) => !prev)}>
                                Reply
                            </div>
                        </div>
                        {isReply && (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex-1 mt-2 flex items-center justify-between py-2 px-4 text-sm rounded-xl w-full border border-white"
                            >
                                <input
                                    {...register('content')}
                                    autoFocus={isReply}
                                    type="text"
                                    placeholder="Bình luận..."
                                    className="bg-transparent outline-none flex-1 pr-4 caret-white text-white"
                                />
                                <GrEmoji size={18} className="cursor-pointer text-white" />
                            </form>
                        )}

                        {!!repliedComments?.length && (
                            <div>
                                <p
                                    className="text-base my-2 hover:underline w-fit cursor-pointer"
                                    onClick={handleLoadReplyComment}
                                >
                                    {repliedComments.length} phản hồi
                                </p>
                                {isShowReplyComment &&
                                    repliedComments?.map((item: any) => <Comment key={item._id} data={item} />)}
                            </div>
                        )}
                    </div>
                    {/* </ol> */}
                </div>
                <div className="dropdown dropdown-end text-white">
                    <div tabIndex={0} className="">
                        <FiMoreHorizontal className="cursor-pointer" size={16} />
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-max shadow">
                        {user?._id !== data.comment_userId._id && (
                            <li className="text-black">
                                <a>
                                    Báo cáo bình luận này <TbMessageReportFilled />
                                </a>
                            </li>
                        )}
                        {user?._id === data.comment_userId._id && (
                            <li className="text-red-400">
                                <button onClick={() => handleDeleteComment(data._id)}>
                                    Xóa <FaTrash />
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Comment
