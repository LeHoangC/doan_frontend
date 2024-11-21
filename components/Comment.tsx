import Image from 'next/image'
import React from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { FiMoreHorizontal } from 'react-icons/fi'

const Comment = ({ data }: { data: any }) => {
    const handleReply = async () => {
        console.log('Reply', data._id)
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
                <div className="flex flex-col gap-1 flex-1">
                    <span className="font-medium">{data?.comment_userId?.name}</span>
                    <p className="text-sm">{data.comment_content}</p>
                    <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-4">
                            <AiOutlineLike size={18} className="cursor-pointer" />
                            {/* <span className="text-gray-300">|</span>
                            <span className="text-gray-500 text-[14px]">231 Likes</span> */}
                        </div>
                        <div className="hover:underline cursor-pointer">Reply</div>
                    </div>
                </div>
                <FiMoreHorizontal size={16} />
            </div>
        </div>
    )
}

export default Comment
