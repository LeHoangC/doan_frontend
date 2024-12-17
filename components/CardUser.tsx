import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CardUser = ({
    title,
    data,
    btnRm,
    handlebtnTitle,
    handleBtnRm,
}: {
    title?: string
    data: any
    btnRm?: string
    handleBtnRm?: (friendId: string) => void
    handlebtnTitle?: (friendId: string) => void
}) => {
    return (
        <div className="flex flex-col gap-2 shadow-lg p-2 rounded-md">
            <Link href={`/profile/${data?.slug}`}>
                <Image
                    src={data?.picturePath ? `${data?.picturePath}` : '/no-avatar.png'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: '240px' }}
                    className="rounded-md object-fill"
                    alt="avatart"
                />
            </Link>
            <span className="font-semibold text-base ml-2 text-white">{data?.name}</span>
            <div className="flex-grow">
                {!!data?.commonFriendsCount && (
                    <span className="font-medium text-base ml-2 text-white">{data?.commonFriendsCount} bạn chung</span>
                )}
            </div>
            {title && handlebtnTitle && (
                <button className="btn btn-primary" onClick={() => handlebtnTitle(data._id)}>
                    {title}
                </button>
            )}
            {btnRm && handleBtnRm && (
                <button className="btn" onClick={() => handleBtnRm(data._id)}>
                    {btnRm}
                </button>
            )}
        </div>
    )
}

export default CardUser
