import Image from 'next/image'
import React, { useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FaRegCommentDots, FaTrash } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import { PiShareFatThin } from 'react-icons/pi'
import Comments from './Comments'
import { useDeletePostMutation, useLikePost } from '@/data/post'
import moment from 'moment'
import { TbMessageReportFilled } from 'react-icons/tb'
moment.locale('vi')

const Post = ({ data }: { data: any }) => {
    const {
        _id,
        post_content,
        post_picturePath,
        post_likeCount,
        post_commentCount,
        post_likes,
        post_userId: user,
        createdAt,
    } = data

    const idUser = localStorage.getItem('id')!
    const [isLike, setIsLike] = useState(post_likes[idUser])
    const [likeCount, setLikeCount] = useState(post_likeCount)

    const { mutate: likePost } = useLikePost()
    const { mutate: deletePost } = useDeletePostMutation()

    const handleLike = () => {
        setIsLike(!isLike)
        setLikeCount(isLike ? likeCount - 1 : likeCount + 1)
        likePost(_id)
    }

    const handleDeletePost = () => {
        deletePost(_id)
    }

    return (
        <div className="px-4 py-6 flex flex-col gap-4 shadow-lg rounded-lg">
            {/* USER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src="https://images.pexels.com/photos/29062949/pexels-photo-29062949/free-photo-of-ng-i-ph-n-sanh-di-u-trong-chi-c-ao-khoac-xanh-ngoai-tr-i-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <span className="font-semibold text-lg">{user.name}</span>
                        <span className="block text-sm">{moment(createdAt).fromNow()}</span>
                    </div>
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="">
                        <FiMoreHorizontal className="cursor-pointer" size={16} />
                    </div>
                    <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-max shadow">
                        <li>
                            <a>
                                Báo cáo bài viết <TbMessageReportFilled />
                            </a>
                        </li>
                        {idUser === user._id && (
                            <li className="text-red-400">
                                <button onClick={handleDeletePost}>
                                    Xóa bài viết <FaTrash />
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {/* POST */}
            <div className="flex flex-col gap-4">
                <p className="">{post_content}</p>
                {post_picturePath && (
                    <div className="w-full min-h-96 relative">
                        <Image src={post_picturePath} alt="image post" fill className="object-fill rounded-md" />
                    </div>
                )}
            </div>
            {/* REACTION */}
            <div className="flex items-center justify-between text-sm my-4">
                <div className="flex gap-6">
                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl cursor-pointer">
                        <div onClick={handleLike}>
                            {isLike ? (
                                <AiFillLike size={16} color="blue" />
                            ) : (
                                <AiOutlineLike size={18} className="cursor-pointer" />
                            )}
                        </div>
                        <span className="text-gray-300 select-none">|</span>
                        <span className="text-gray-500 text-[14px]">
                            {likeCount}
                            <span className="hidden md:inline select-none text-[13px]"> Thích</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl cursor-pointer">
                        <FaRegCommentDots size={16} />
                        {/* <AiFillLike size={16} color="blue" /> */}
                        <span className="text-gray-300 select-none">|</span>
                        <span className="text-gray-500 text-[14px]">
                            {post_commentCount}
                            <span className="hidden md:inline select-none text-[13px]"> Bình luận</span>
                        </span>
                    </div>
                </div>
                <div className="">
                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
                        <PiShareFatThin size={16} className="cursor-pointer" />
                        {/* <AiFillLike size={16} color="blue" /> */}
                        <span className="text-gray-300 select-none">|</span>
                        <span className="text-gray-500 text-[14px]">
                            0<span className="hidden md:inline select-none text-[13px]"> Lượt chia sẻ</span>
                        </span>
                    </div>
                </div>
            </div>
            <Comments postId={_id} />
        </div>
    )
}

export default Post
