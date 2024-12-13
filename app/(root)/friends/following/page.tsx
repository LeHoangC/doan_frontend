'use client'
import CardUser from '@/components/CardUser'
import { useFollowing } from '@/data/user'
import { useAuthStore } from '@/store'
import React from 'react'

const Following = () => {
    const { user } = useAuthStore()
    const { data } = useFollowing({ id: user?._id! })

    return (
        <div className="">
            <h3 className="mb-2 mt-0 text-3xl font-medium leading-tight text-primary">Danh sách đang theo dõi</h3>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {!data?.metadata.length ? (
                    <h2 className="text-white">Bạn chưa theo dõi người nào</h2>
                ) : (
                    data?.metadata?.map((item: any) => (
                        <CardUser key={item._id} data={item} title="Thêm bạn bè" btnRm="Hủy theo dõi" />
                    ))
                )}
            </div>
        </div>
    )
}

export default Following